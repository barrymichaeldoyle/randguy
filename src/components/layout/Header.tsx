'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';

import { Button } from '@/components/Button';

import { excali } from '../../fonts';

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
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-2">
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
        </h1>
      </Link>

      {/* Desktop Navigation */}
      <nav className="hidden items-center gap-2 sm:flex">
        <Button href="/calculators" size="sm">
          Calculators
        </Button>
        <Button href="/data" size="sm">
          Data
        </Button>
        <Button href="/blog" size="sm">
          Blog
        </Button>
      </nav>

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
          <div className="flex flex-col gap-2 p-4">
            <Button href="/calculators" size="sm">
              Calculators
            </Button>
            <Button href="/data" size="sm">
              Data
            </Button>
            <Button href="/blog" size="sm">
              Blog
            </Button>
          </div>
        </div>
      </nav>
    </header>
  );
}
