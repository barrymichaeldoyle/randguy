'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/Button';
import { excali } from '../../fonts';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMenuOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  return (
    <header className="sticky top-0 z-50 bg-white flex items-center justify-between px-4 py-2 border-b border-gray-200">
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/RandGuyLogo.png"
          alt="Rand Guy logo"
          width={40}
          height={40}
          className="h-10 w-auto"
        />
        <h1
          className={`${excali.className} text-2xl leading-none text-gray-900 hover:text-yellow-600 transition-colors`}
        >
          Rand Guy
        </h1>
      </Link>

      {/* Desktop Navigation */}
      <nav className="hidden sm:flex items-center gap-2">
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
        onClick={() => setIsMenuOpen(true)}
        className="sm:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Open menu"
        aria-expanded={isMenuOpen}
        aria-controls="mobile-menu"
      >
        <svg
          className="w-6 h-6"
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
          className="fixed inset-0 bg-black/50 z-50 sm:hidden"
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu Drawer */}
      <nav
        id="mobile-menu"
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out sm:hidden ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-label="Mobile navigation"
      >
        <div className="flex flex-col h-full">
          {/* Close Button */}
          <div className="flex justify-end p-4 border-b border-gray-200">
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close menu"
            >
              <svg
                className="w-6 h-6"
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
