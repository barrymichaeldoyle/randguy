'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type MouseEvent,
} from 'react';

import { excali } from '@/fonts';
import { groupResults, performSearch } from '@/lib/search/fuzzy';

import type { SearchRecord } from '@/lib/search';

const CATEGORY_ORDER = ['calculator', 'data', 'blog'] as const;

const CATEGORY_LABELS: Record<SearchRecord['category'], string> = {
  calculator: 'Calculators',
  data: 'Data',
  blog: 'Blog Posts',
};

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

type FetchState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; records: SearchRecord[] }
  | { status: 'error'; error: string };

function highlightText(text: string, rawQuery: string) {
  const query = rawQuery.trim();

  if (!query) {
    return text;
  }

  const tokens = Array.from(
    new Set(
      query
        .split(/\s+/)
        .map((token) => token.trim())
        .filter((token) => token.length > 0)
    )
  );

  if (tokens.length === 0) {
    return text;
  }

  const pattern = tokens.map(escapeRegExp).join('|');
  const regex = new RegExp(`(${pattern})`, 'gi');
  const parts = text.split(regex);

  if (parts.length === 1) {
    return text;
  }

  return parts.map((part, index) => {
    const lower = part.toLowerCase();
    const shouldHighlight = tokens.some(
      (token) => lower === token.toLowerCase()
    );

    if (!shouldHighlight) {
      return part;
    }

    return (
      <mark
        key={`highlight-${index}-${part}-${text}`}
        className="-mx-0.5 rounded bg-yellow-200 px-0.5 text-gray-900"
      >
        {part}
      </mark>
    );
  });
}

type HeaderSearchOverlayProps = {
  open: boolean;
  onClose: () => void;
};

function HeaderSearchOverlay({ open, onClose }: HeaderSearchOverlayProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const fetchControllerRef = useRef<AbortController | null>(null);
  const [query, setQuery] = useState('');
  const [fetchState, setFetchState] = useState<FetchState>({ status: 'idle' });
  const [activeIndex, setActiveIndex] = useState(0);

  const records =
    fetchState.status === 'success' ? fetchState.records : undefined;

  const results = useMemo(() => {
    if (!records) return [];
    return performSearch(records, query, query ? 12 : 8);
  }, [records, query]);

  const flatResults = results;

  const groupedResults = useMemo(() => groupResults(results), [results]);

  const handleResultSelect = useCallback(
    (href: string) => {
      onClose();
      router.push(href);
    },
    [router, onClose]
  );

  const handleBackdropClick = useCallback(
    (event: MouseEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  const retryFetch = useCallback(() => {
    setFetchState({ status: 'idle' });
  }, []);

  useEffect(
    () => () => {
      fetchControllerRef.current?.abort();
      fetchControllerRef.current = null;
    },
    []
  );

  let runningIndex = 0;
  const renderedSections = CATEGORY_ORDER.map((category) => {
    const items = groupedResults[category] ?? [];
    if (items.length === 0) return null;

    const startIndex = runningIndex;
    runningIndex += items.length;

    return (
      <li key={category} className="bg-white">
        <div className="border-b border-gray-100 bg-gray-50 px-6 py-2 text-xs font-semibold tracking-wide text-gray-500 uppercase">
          {CATEGORY_LABELS[category]}
        </div>
        <ul>
          {items.map((result, indexWithinCategory) => {
            const itemIndex = startIndex + indexWithinCategory;
            const isActive = itemIndex === activeIndex;

            return (
              <li key={result.record.id}>
                <button
                  type="button"
                  onClick={() => handleResultSelect(result.record.href)}
                  onMouseEnter={() => setActiveIndex(itemIndex)}
                  className={`flex w-full flex-col items-start gap-1 px-6 py-4 text-left transition ${
                    isActive ? 'bg-yellow-50 text-gray-900' : 'hover:bg-gray-50'
                  }`}
                >
                  <span className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                    <span>{highlightText(result.record.title, query)}</span>
                    {result.record.category === 'blog' &&
                      result.record.date && (
                        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
                          {new Date(result.record.date).toLocaleDateString(
                            'en-ZA',
                            {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            }
                          )}
                        </span>
                      )}
                  </span>
                  <span className="text-xs text-gray-600">
                    {highlightText(result.record.description, query)}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </li>
    );
  }).filter(Boolean);

  useEffect(() => {
    if (!open) {
      fetchControllerRef.current?.abort();
      fetchControllerRef.current = null;
      return;
    }

    if (fetchState.status === 'loading' || fetchState.status === 'success') {
      return;
    }

    const controller = new AbortController();
    fetchControllerRef.current = controller;

    async function loadIndex() {
      try {
        setFetchState({ status: 'loading' });
        const response = await fetch('/api/search-index', {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error('Failed to load search index');
        }

        const data: SearchRecord[] = await response.json();
        if (!controller.signal.aborted) {
          fetchControllerRef.current = null;
          setFetchState({ status: 'success', records: data });
        }
      } catch (error) {
        if (controller.signal.aborted) return;
        fetchControllerRef.current = null;
        setFetchState({
          status: 'error',
          error:
            error instanceof Error
              ? error.message
              : 'Failed to load search index',
        });
      }
    }

    void loadIndex();
  }, [open, fetchState.status]);

  useEffect(() => {
    if (!open) return;

    const focusTimeout = window.setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 50);

    const { style: bodyStyle } = document.body;
    const originalOverflow = bodyStyle.overflow;
    const originalPosition = bodyStyle.position;
    const originalTop = bodyStyle.top;
    const originalWidth = bodyStyle.width;
    const scrollY = window.scrollY;

    bodyStyle.overflow = 'hidden';
    bodyStyle.position = 'fixed';
    bodyStyle.top = `-${scrollY}px`;
    bodyStyle.width = '100%';

    return () => {
      window.clearTimeout(focusTimeout);
      bodyStyle.overflow = originalOverflow;
      bodyStyle.position = originalPosition;
      bodyStyle.top = originalTop;
      bodyStyle.width = originalWidth;
      window.scrollTo(0, scrollY);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (flatResults.length === 0) return;

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setActiveIndex((prev) =>
          prev + 1 >= flatResults.length ? 0 : prev + 1
        );
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        setActiveIndex((prev) =>
          prev - 1 < 0 ? flatResults.length - 1 : prev - 1
        );
      } else if (event.key === 'Enter') {
        if (flatResults[activeIndex]) {
          event.preventDefault();
          const href = flatResults[activeIndex].record.href;
          onClose();
          router.push(href);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, flatResults, activeIndex, router, onClose]);

  useEffect(() => {
    if (!open) {
      setQuery('');
      setActiveIndex(0);
    }
  }, [open]);

  if (!open) {
    return null;
  }

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 px-4 py-12 sm:items-center sm:px-6"
      onClick={handleBackdropClick}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search"
        className="relative flex w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <div className="flex items-center gap-3 border-b border-gray-200 px-4 py-3">
          <span className="text-gray-400" aria-hidden="true">
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search blog posts, calculators, or data..."
            className="flex-1 border-none bg-transparent text-base text-gray-900 outline-none placeholder:text-gray-400"
            aria-label="Search"
            autoComplete="off"
          />
          <div className="hidden items-center gap-2 text-xs text-gray-500 sm:flex">
            <kbd className="rounded border border-gray-300 bg-gray-100 px-2 py-1">
              ⌘K
            </kbd>
            <span>Esc</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="ml-auto rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
            aria-label="Close search"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto bg-white">
          {fetchState.status === 'loading' && (
            <div className="flex items-center justify-center py-12 text-gray-500">
              Loading search index…
            </div>
          )}

          {fetchState.status === 'error' && (
            <div className="px-6 py-10 text-center text-sm text-red-600">
              <p>{fetchState.error}</p>
              <button
                type="button"
                onClick={retryFetch}
                className="mt-4 inline-flex items-center rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:border-red-300 hover:text-red-700"
              >
                Try again
              </button>
            </div>
          )}

          {fetchState.status === 'success' && flatResults.length === 0 && (
            <div className="px-6 py-10 text-center text-sm text-gray-500">
              {query
                ? `No results for “${query}”. Try different keywords.`
                : 'Start typing to search across the site.'}
            </div>
          )}

          {fetchState.status === 'success' && renderedSections.length > 0 && (
            <ul className="divide-y divide-gray-100">{renderedSections}</ul>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-gray-200 bg-gray-50 px-4 py-3 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <kbd className="rounded border border-gray-300 bg-white px-2 py-1">
              ↑↓
            </kbd>
            <span>to navigate</span>
            <kbd className="rounded border border-gray-300 bg-white px-2 py-1">
              Enter
            </kbd>
            <span>to open</span>
          </div>
          <Link
            href={query ? `/search?q=${encodeURIComponent(query)}` : '/search'}
            onClick={() => onClose()}
            className="font-medium text-yellow-600 transition hover:text-yellow-500"
          >
            Open full search →
          </Link>
        </div>
      </div>
    </div>
  );
}

type HeaderSearchProps = {
  onOpen?: () => void;
};

export function HeaderSearch({ onOpen }: HeaderSearchProps) {
  const [open, setOpen] = useState(false);

  const openSearch = useCallback(() => {
    onOpen?.();
    setOpen(true);
  }, [onOpen]);
  const closeSearch = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if (
        event.defaultPrevented ||
        (event.target instanceof HTMLElement &&
          ['INPUT', 'TEXTAREA'].includes(event.target.tagName)) ||
        (event.target instanceof HTMLElement && event.target.isContentEditable)
      ) {
        return;
      }

      const key = event.key.toLowerCase();
      const metaK = (event.metaKey || event.ctrlKey) && key === 'k';
      const slash =
        key === '/' && !event.metaKey && !event.ctrlKey && !event.altKey;

      if (metaK || slash) {
        event.preventDefault();
        openSearch();
      }
    };

    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, [openSearch]);

  return (
    <>
      <button
        type="button"
        onClick={openSearch}
        className="hidden items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 shadow-sm transition hover:border-yellow-300 hover:text-gray-900 sm:flex"
      >
        <span className={`${excali.className} text-base text-gray-800`}>
          Search
        </span>
        <span className="text-xs text-gray-400">⌘K</span>
      </button>

      <button
        type="button"
        onClick={openSearch}
        className="rounded-lg p-2 text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 sm:hidden"
        aria-label="Open search"
      >
        <svg
          className="h-6 w-6"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </button>

      <HeaderSearchOverlay open={open} onClose={closeSearch} />
    </>
  );
}
