import Link from 'next/link';

import { LINKS, TAGLINE, TWITTER_HANDLE } from '@/lib/constants';

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
    <footer className="mt-auto border-t border-gray-200 bg-gray-50 py-8 sm:py-12">
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
          <div className="mb-3 sm:mb-4">
            <a
              href={LINKS.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm transition-colors hover:text-yellow-600 sm:text-base"
              aria-label="Follow Rand Guy on X (Twitter)"
            >
              <svg
                className="h-4 w-4 sm:h-5 sm:w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              Follow {TWITTER_HANDLE}
            </a>
          </div>
          <div className="text-xs text-gray-700 sm:text-sm">
            © {new Date().getFullYear()} Rand Guy. {TAGLINE}
          </div>
        </div>
      </div>
    </footer>
  );
}
