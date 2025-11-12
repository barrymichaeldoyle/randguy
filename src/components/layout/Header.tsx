'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';

import { Button } from '@/components/Button';
import { HeaderSearch } from '@/components/search/HeaderSearch';
import { LINKS, TWITTER_HANDLE, YOUTUBE_HANDLE } from '@/lib/constants';

import { excali } from '../../fonts';

const MENU_ITEMS = [
  { href: '/blog', label: 'Blog' },
  { href: '/calculators', label: 'Calculators' },
  { href: '/data', label: 'Data' },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Close menu when route changes
  useEffect(() => {
    // This is intentional - we want to sync the menu state with navigation changes
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMenuOpen(false);
  }, [pathname]);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMenuOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      // Store original values
      const originalStyle = window.getComputedStyle(document.body).overflow;
      const scrollY = window.scrollY;

      // Lock scroll
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';

      // Move focus to close button when menu opens
      setTimeout(() => {
        closeButtonRef.current?.focus();
      }, 100);

      return () => {
        // Restore scroll
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = originalStyle;
        window.scrollTo(0, scrollY);
      };
    }
  }, [isMenuOpen]);

  // Focus trap
  useEffect(() => {
    if (!isMenuOpen) return;

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !menuRef.current) return;

      const focusableElements = menuRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[
        focusableElements.length - 1
      ] as HTMLElement;

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement?.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement?.focus();
      }
    };

    document.addEventListener('keydown', handleTab);
    return () => document.removeEventListener('keydown', handleTab);
  }, [isMenuOpen]);

  return (
    <header
      className="sticky top-0 z-50 flex items-center border-b border-gray-200 bg-white px-4 py-2"
      role="banner"
    >
      <Link href="/" className="group flex items-center gap-2">
        <Image
          src="/RandGuyLogo.png"
          alt="Rand Guy logo"
          width={40}
          height={40}
          className="h-10 w-auto"
        />
        <h1
          className={`${excali.className} text-2xl leading-none text-gray-900 transition-colors group-hover:text-yellow-600`}
        >
          Rand Guy
          <span className="sr-only"> - Home</span>
        </h1>
      </Link>

      <div className="ml-auto flex items-center gap-2">
        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-3 sm:flex">
          {MENU_ITEMS.map((item) => (
            <Button key={item.href} href={item.href} size="sm">
              {item.label}
            </Button>
          ))}

          {/* Desktop Social Links */}
          <div className="ml-2 flex items-center gap-2 border-l border-gray-300 pl-3">
            <Link
              href={LINKS.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-red-600 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
              aria-label={`Subscribe to ${YOUTUBE_HANDLE} on YouTube`}
            >
              <svg
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <title>YouTube icon</title>
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </Link>
            <Link
              href={LINKS.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
              aria-label={`Follow ${TWITTER_HANDLE} on X (Twitter)`}
            >
              <svg
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <title>X icon</title>
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </Link>
          </div>
        </nav>

        <HeaderSearch onOpen={() => setIsMenuOpen(false)} />

        {/* Mobile Menu Button */}
        <button
          ref={menuButtonRef}
          onClick={() => setIsMenuOpen(true)}
          className="rounded-lg p-2 transition-colors hover:bg-gray-100 focus:ring-2 focus:ring-yellow-400 focus:outline-none sm:hidden"
          aria-label="Open menu"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 sm:hidden"
          onClick={() => {
            setIsMenuOpen(false);
            menuButtonRef.current?.focus();
          }}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu Drawer */}
      <nav
        ref={menuRef}
        id="mobile-menu"
        className={`fixed top-0 right-0 z-50 h-full w-64 transform bg-white shadow-xl transition-transform duration-300 ease-in-out sm:hidden ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-label="Mobile navigation"
        aria-hidden={!isMenuOpen}
        role="navigation"
      >
        <div className="flex h-full flex-col">
          {/* Close Button */}
          <div className="flex justify-end border-b border-gray-200 p-4">
            <button
              ref={closeButtonRef}
              onClick={() => {
                setIsMenuOpen(false);
                menuButtonRef.current?.focus();
              }}
              className="rounded-lg p-2 transition-colors hover:bg-gray-100 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
              aria-label="Close menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Menu Items */}
          <div className="flex flex-1 flex-col gap-2 p-4">
            {MENU_ITEMS.map((item) => (
              <Button key={item.href} href={item.href} size="sm">
                {item.label}
              </Button>
            ))}
          </div>

          {/* Social Links */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex flex-col gap-3">
              <Link
                href={LINKS.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-gray-100 hover:text-yellow-600 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
              >
                <svg
                  className="h-5 w-5 shrink-0"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <title>YouTube icon</title>
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
                <span>Subscribe to {YOUTUBE_HANDLE}</span>
              </Link>
              <Link
                href={LINKS.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-gray-100 hover:text-yellow-600 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
              >
                <svg
                  className="h-5 w-5 shrink-0"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <title>X icon</title>
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                <span>Follow {TWITTER_HANDLE}</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
