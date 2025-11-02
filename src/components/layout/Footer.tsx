import Link from 'next/link';

import {
  LINKS,
  TAGLINE,
  TWITTER_HANDLE,
  YOUTUBE_HANDLE,
} from '@/lib/constants';

import { excali } from '../../fonts';

interface FooterLink {
  href: string;
  label: string;
}

interface FooterGroup {
  title: string;
  links: FooterLink[];
}

const footerGroups: FooterGroup[] = [
  {
    title: 'Calculators',
    links: [
      { href: '/calculators/income-tax', label: 'Income Tax Calculator' },
      { href: '/calculators/home-loan', label: 'Home Loan Calculator' },
      { href: '/calculators/ltv', label: 'Loan-to-Value Calculator' },
      { href: '/calculators/tfsa', label: 'TFSA Calculator' },
      { href: '/calculators/interest', label: 'Interest Calculator' },
    ],
  },
  {
    title: 'Historical Data',
    links: [
      { href: '/data/prime-rates', label: 'Prime Rates' },
      { href: '/data/tax-brackets', label: 'Tax Brackets' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { href: '/blog', label: 'Blog' },
      { href: '/calculators', label: 'All Calculators' },
      { href: '/data', label: 'All Data' },
    ],
  },
];

export function Footer() {
  return (
    <footer
      className="mt-auto border-t border-gray-200 bg-gray-50 py-8 sm:py-12"
      role="contentinfo"
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-8 md:flex-row md:justify-between md:gap-12">
          {footerGroups.map((group) => (
            <div key={group.title} className="text-center md:text-left">
              <h3
                className={`${excali.className} mb-3 text-base font-bold sm:mb-4 sm:text-lg`}
              >
                {group.title}
              </h3>
              <ul className="space-y-2 text-sm">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 pt-4 text-center sm:pt-6">
          <div className="mb-3 flex flex-wrap items-center justify-center gap-4 sm:mb-4">
            <Link
              href={LINKS.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md px-2 py-1 text-sm outline-2 transition-colors hover:text-yellow-600 focus-visible:outline focus-visible:outline-blue-600 sm:text-base"
            >
              <svg
                className="h-4 w-4 shrink-0 sm:h-5 sm:w-5"
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
              className="inline-flex items-center gap-2 rounded-md px-2 py-1 text-sm outline-2 transition-colors hover:text-yellow-600 focus-visible:outline focus-visible:outline-blue-600 sm:text-base"
            >
              <svg
                className="h-4 w-4 shrink-0 sm:h-5 sm:w-5"
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
          <div className="text-xs text-gray-700 sm:text-sm">
            © {new Date().getFullYear()} Rand Guy. {TAGLINE}
          </div>
        </div>
      </div>
    </footer>
  );
}
