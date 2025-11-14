import Image from 'next/image';
import Link from 'next/link';

import { Breadcrumb } from '@/components/Breadcrumb';
import { Button } from '@/components/Button';
import { BASE_URL, LINKS, TAGLINE, TWITTER_HANDLE } from '@/lib/constants';

import { excali } from '../../fonts';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Referrals & Affiliate Links | Rand Guy',
  description:
    'Support Rand Guy by using these referral links for Easy Equities, VALR, and LUNO. I only recommend services I use and trust.',
  openGraph: {
    title: 'Referrals & Affiliate Links | Rand Guy',
    description:
      'Support Rand Guy by using these referral links for Easy Equities, VALR, and LUNO. I only recommend services I use and trust.',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: `Rand Guy - ${TAGLINE}`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Referrals & Affiliate Links | Rand Guy',
    description:
      'Support Rand Guy by using these referral links for Easy Equities, VALR, and LUNO. I only recommend services I use and trust.',
    images: ['/og-image.png'],
    site: TWITTER_HANDLE,
    creator: TWITTER_HANDLE,
  },
};

interface ReferralLink {
  name: string;
  description: string;
  href: string;
  benefits?: string[];
}

const referrals: ReferralLink[] = [
  {
    name: 'Easy Equities',
    description:
      'My top pick for investing in South Africa. Low fees, easy to use, and perfect for TFSAs, ETFs, and building long-term wealth.',
    href: LINKS.easyEquities,
    benefits: [
      'Low-cost investing platform',
      'Perfect for TFSAs and ETFs',
      'Easy to use interface',
      'Great for beginners and experienced investors',
    ],
  },
  {
    name: 'VALR',
    description:
      'A leading cryptocurrency exchange in South Africa. Buy, sell, and trade Bitcoin, Ethereum, and other cryptocurrencies with competitive fees.',
    href: LINKS.valr,
    benefits: [
      'Competitive trading fees',
      'Secure platform',
      'Wide range of cryptocurrencies',
      'South African based',
    ],
  },
  {
    name: 'LUNO',
    description:
      'One of the most trusted cryptocurrency platforms in South Africa. Simple, secure, and user-friendly for buying and selling crypto.',
    href: LINKS.luno,
    benefits: [
      'User-friendly interface',
      'Secure and regulated',
      'Easy fiat on-ramp',
      'Great for beginners',
    ],
  },
];

export default function ReferralsPage() {
  return (
    <main className="flex flex-1 flex-col items-center">
      <div className="mb-8 w-full px-8 py-8">
        <div className="mx-auto max-w-3xl">
          <Breadcrumb
            items={[{ name: 'Home', href: '/' }, { name: 'Referrals' }]}
          />

          <Image
            src="/RandGuyLogo.png"
            alt="Rand Guy logo"
            width={80}
            height={80}
            className="mx-auto mt-6 mb-4"
          />

          <h1 className={`${excali.className} mt-8 mb-4 text-center text-5xl`}>
            Referrals & Affiliate Links
          </h1>
          <p className="mb-8 text-center text-lg text-gray-600">
            Support Rand Guy by using these referral links. I only recommend
            services I personally use and trust.
          </p>

          <div className="mb-8 rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-gray-700">
            <p className="mb-2 font-semibold">💡 Disclosure</p>
            <p>
              Some of the links on this page are affiliate/referral links. If
              you sign up through these links, I may receive a small commission
              at no extra cost to you. This helps support Rand Guy and allows me
              to keep creating free content. I only recommend services I
              genuinely use and believe in.
            </p>
          </div>
        </div>
      </div>

      <div className="w-full max-w-3xl px-8 pb-16">
        <div className="flex flex-col gap-6">
          {referrals.map((referral) => (
            <div
              key={referral.name}
              className="rounded-lg border border-gray-200 bg-white p-6"
            >
              <h2 className={`${excali.className} mb-2 text-2xl font-bold`}>
                {referral.name}
              </h2>
              <p className="mb-4 text-gray-700">{referral.description}</p>
              {referral.benefits && (
                <ul className="mb-4 space-y-1 text-sm text-gray-600">
                  {referral.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-yellow-600">✓</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              )}
              <Link
                href={referral.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`${excali.className} inline-block rounded bg-yellow-400 px-6 py-3 text-base font-medium text-black transition hover:bg-yellow-500`}
              >
                Sign Up with {referral.name} →
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-lg border border-gray-200 bg-gray-50 p-6 text-center">
          <p className="text-gray-700">
            Have questions about any of these platforms?{' '}
            <Link
              href="/blog"
              className="font-semibold text-yellow-600 hover:text-yellow-700"
            >
              Check out my blog posts
            </Link>{' '}
            or{' '}
            <Link
              href={`https://x.com/${TWITTER_HANDLE}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-yellow-600 hover:text-yellow-700"
            >
              reach out on X/Twitter
            </Link>
            .
          </p>
        </div>
      </div>
    </main>
  );
}
