import Link from 'next/link';

import { Button } from '@/components/Button';
import { excali } from '@/fonts';
import { BASE_URL } from '@/lib/constants';
import { getSearchIndex } from '@/lib/search';
import { groupResults, performSearch } from '@/lib/search/fuzzy';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Search Rand Guy',
  description:
    'Search across Rand Guy blog posts, calculators, and data sets to find the information you need.',
  alternates: {
    canonical: '/search',
  },
  openGraph: {
    title: 'Search Rand Guy',
    description:
      'Find financial calculators, data resources, and blog posts on Rand Guy.',
    type: 'website',
    url: '/search',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Search Rand Guy',
    description:
      'Quickly find financial calculators, data sets, and blog posts on Rand Guy.',
  },
};

export const revalidate = 3600;

const CATEGORY_METADATA = {
  blog: { label: 'Blog Posts', cta: 'Read article →' },
  calculator: { label: 'Calculators', cta: 'Open calculator →' },
  data: { label: 'Data', cta: 'View dataset →' },
} as const;

type SearchPageProps = {
  searchParams?: {
    q?: string;
  };
};

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

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

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams?.q?.toString().trim() ?? '';
  const index = await getSearchIndex();
  const results = performSearch(index, query, query ? 50 : index.length);
  const grouped = groupResults(results);
  const hasQuery = query.length > 0;
  const hasResults = results.length > 0;

  return (
    <div className="w-full max-w-4xl px-4 pt-8 pb-16 md:px-8 md:pt-12">
      <nav className="mb-6 text-sm" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2 text-gray-600">
          <li>
            <Link href="/" className="transition hover:text-yellow-600">
              Home
            </Link>
          </li>
          <li>/</li>
          <li className="font-medium text-gray-900" aria-current="page">
            Search
          </li>
        </ol>
      </nav>

      <div className="mb-10 text-center">
        <h1 className={`${excali.className} mb-3 text-4xl`}>Search Rand Guy</h1>
        <p className="text-lg text-gray-700">
          Find calculators, data sets, and blog posts in one place.
        </p>
      </div>

      <form
        action="/search"
        method="get"
        className="mb-8 flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:gap-3 md:p-6"
      >
        <label className="flex-grow">
          <span className="sr-only">Search</span>
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Search blog posts, calculators, and data..."
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base text-gray-900 transition outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200"
            autoComplete="off"
          />
        </label>
        <Button type="submit">Search</Button>
      </form>

      {!hasQuery && (
        <section className="mb-8 rounded-xl border border-dashed border-gray-200 bg-gray-50 p-6 text-gray-700">
          <h2 className="mb-3 font-semibold text-gray-900">
            Tip: Use keyboard shortcuts
          </h2>
          <p className="text-sm">
            Press{' '}
            <kbd className="rounded border border-gray-300 bg-white px-2 py-1">
              /
            </kbd>{' '}
            or{' '}
            <kbd className="rounded border border-gray-300 bg-white px-2 py-1">
              ⌘K
            </kbd>{' '}
            to open the quick search from anywhere on the site.
          </p>
        </section>
      )}

      {!hasResults ? (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <p className="text-lg font-semibold text-gray-900">
            {hasQuery
              ? `No matches for “${query}”.`
              : 'No content in the search index yet.'}
          </p>
          {hasQuery && (
            <p className="mt-2 text-sm text-gray-600">
              Try different keywords or a broader term.
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(CATEGORY_METADATA).map(([key, meta]) => {
            const items = grouped[key] ?? [];
            if (items.length === 0) return null;

            return (
              <section key={key}>
                <h2 className="mb-4 text-sm font-semibold tracking-wide text-gray-500 uppercase">
                  {meta.label}
                </h2>
                <div className="space-y-3">
                  {items.map(({ record }) => (
                    <article
                      key={record.id}
                      className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-yellow-200 hover:shadow-md"
                    >
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">
                          <Link
                            href={record.href}
                            className="transition hover:text-yellow-600"
                          >
                            {highlightText(record.title, query)}
                          </Link>
                        </h3>
                        <span className="inline-flex w-fit items-center rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium tracking-wide text-gray-600 uppercase">
                          {meta.label}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-gray-700">
                        {highlightText(record.description, query)}
                      </p>
                      <div className="mt-3 text-sm">
                        <Link
                          href={record.href}
                          className="font-medium text-yellow-600 transition hover:text-yellow-500"
                        >
                          {meta.cta}
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}

      <div className="mt-12 rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-600 shadow-sm">
        <p>
          Want to browse everything manually? Check out the{' '}
          <Link
            href="/calculators"
            className="text-yellow-600 hover:text-yellow-500"
          >
            calculators
          </Link>
          ,{' '}
          <Link href="/data" className="text-yellow-600 hover:text-yellow-500">
            data sets
          </Link>
          , or{' '}
          <Link href="/blog" className="text-yellow-600 hover:text-yellow-500">
            latest blog posts
          </Link>
          . You can always find these links in the footer.
        </p>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SearchResultsPage',
            name: 'Rand Guy Search',
            url: `${BASE_URL}/search`,
            potentialAction: {
              '@type': 'SearchAction',
              target: `${BASE_URL}/search?q={search_term_string}`,
              'query-input': 'required name=search_term_string',
            },
          }),
        }}
      />
    </div>
  );
}
