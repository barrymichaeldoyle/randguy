import Link from 'next/link';
import { excali } from '../../fonts';
import { LINKS, TAGLINE, TWITTER_HANDLE } from '@/lib/constants';

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
    <footer className="border-t border-gray-200 py-8 sm:py-12 mt-auto bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:justify-between gap-8 md:gap-12 mb-8">
          {footerGroups.map((group) => (
            <div key={group.title} className="text-center md:text-left">
              <h3
                className={`${excali.className} text-base sm:text-lg font-bold mb-3 sm:mb-4`}
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

        <div className="border-t border-gray-200 pt-4 sm:pt-6 text-center">
          <div className="mb-3 sm:mb-4">
            <a
              href={LINKS.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm sm:text-base hover:text-yellow-600 transition-colors"
              aria-label="Follow Rand Guy on X (Twitter)"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              Follow {TWITTER_HANDLE}
            </a>
          </div>
          <div className="text-xs sm:text-sm text-gray-700">
            © {new Date().getFullYear()} Rand Guy. {TAGLINE}
          </div>
        </div>
      </div>
    </footer>
  );
}
