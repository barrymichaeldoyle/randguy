import Image from 'next/image';
import { Metadata } from 'next';

import { excali } from '@/fonts';
import { Button } from '@/components/Button';
import { getAllPosts } from '@/lib/posts';
import { BASE_URL } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Rand Guy | South African Personal Finance & Investment Guide',
  description:
    'Learn about personal finance, investing, TFSAs, ETFs, and building wealth in South Africa. Free financial calculators, tax guides, and investment advice for South Africans.',
  keywords: [
    'South African personal finance',
    'investing in South Africa',
    'TFSA',
    'ETF investing',
    'tax-free savings',
    'wealth building',
    'SARS tax',
    'financial planning',
    'SA investment guide',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Rand Guy | South African Personal Finance & Investment Guide',
    description:
      'Learn about personal finance, investing, TFSAs, ETFs, and building wealth in South Africa. Free financial calculators and investment advice.',
    type: 'website',
    url: '/',
    siteName: 'Rand Guy',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rand Guy | South African Personal Finance',
    description:
      'Learn about personal finance, investing, TFSAs, ETFs, and building wealth in South Africa.',
  },
};

export default async function Home() {
  const posts = await getAllPosts();

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Rand Guy',
    description:
      'South African personal finance and investment guide. Learn about investing, TFSAs, ETFs, and building wealth.',
    url: BASE_URL,
    inLanguage: 'en-ZA',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${BASE_URL}/blog?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Rand Guy',
    description: 'South African Personal Finance & Investment Guide',
    url: BASE_URL,
    logo: `${BASE_URL}/RandGuyLogo.png`,
    sameAs: [],
  };

  const blogPostsSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: posts.slice(0, 5).map((post, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.description,
        datePublished: post.date,
        url: `${BASE_URL}/blog/${post.slug}`,
        author: {
          '@type': 'Person',
          name: 'Rand Guy',
        },
      },
    })),
  };

  const siteNavigationSchema = {
    '@context': 'https://schema.org',
    '@type': 'SiteNavigationElement',
    name: 'Main Navigation',
    url: BASE_URL,
    hasPart: [
      {
        '@type': 'WebPage',
        name: 'Home',
        url: BASE_URL,
        description:
          'South African personal finance and investment advice, calculators, and guides',
      },
      {
        '@type': 'WebPage',
        name: 'Calculators',
        url: `${BASE_URL}/calculators`,
        description:
          'Free financial calculators for South Africans - income tax, UIF, and more',
      },
      {
        '@type': 'WebPage',
        name: 'Historical Data',
        url: `${BASE_URL}/data`,
        description:
          'Historical financial data visualizations for South Africa',
      },
      {
        '@type': 'WebPage',
        name: 'Blog',
        url: `${BASE_URL}/blog`,
        description:
          'Personal finance articles and investment guides for South Africans',
      },
      {
        '@type': 'WebPage',
        name: 'Income Tax Calculator',
        url: `${BASE_URL}/calculators/income-tax`,
        description:
          'Calculate your South African income tax with UIF and age-based rebates',
      },
      {
        '@type': 'WebPage',
        name: 'Home Loan Calculator',
        url: `${BASE_URL}/calculators/home-loan`,
        description:
          'Calculate your home loan repayments and total interest for property purchases',
      },
      {
        '@type': 'WebPage',
        name: 'Loan-to-Value Calculator',
        url: `${BASE_URL}/calculators/ltv`,
        description:
          'Calculate your LTV ratio and understand your equity position for property financing',
      },
      {
        '@type': 'WebPage',
        name: 'TFSA Calculator',
        url: `${BASE_URL}/calculators/tfsa`,
        description:
          'Calculate how long to max out your Tax-Free Savings Account',
      },
    ],
  };

  return (
    <main className="flex flex-col items-center flex-1">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostsSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(siteNavigationSchema),
        }}
      />

      {/* Hero Section */}
      <div
        className="w-full pt-16 pb-8 px-8"
        style={{
          background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
        }}
      >
        <div className="text-center mb-12">
          <Image
            src="/RandGuyLogo.png"
            alt="Rand Guy - South African Personal Finance"
            width={80}
            height={80}
            className="mx-auto mb-4"
          />
          <h1 className={`${excali.className} text-4xl mb-2`}>
            South African Personal Finance Made Simple
          </h1>
          <p className="text-lg text-gray-700 mb-6">
            Learn how to invest, use TFSAs, buy ETFs, and build wealth in South
            Africa
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div className="w-full bg-gray-50 px-8 py-16">
        <div className="max-w-3xl mx-auto">
          <section>
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="border border-gray-200 rounded-lg p-8 hover:shadow-lg transition-all hover:border-yellow-400 flex flex-col text-center bg-white">
                <div className="text-4xl mb-4">🧮</div>
                <h2 className={`${excali.className} text-2xl font-bold mb-3`}>
                  Financial Calculators
                </h2>
                <p className="text-gray-700 mb-6 flex-grow leading-relaxed">
                  Calculate your <strong>income tax</strong>,{' '}
                  <strong>UIF</strong>, and more with these SA-specific tools
                </p>
                <Button href="/calculators">Explore Calculators</Button>
              </div>

              <div className="border border-gray-200 rounded-lg p-8 hover:shadow-lg transition-all hover:border-yellow-400 flex flex-col text-center bg-white">
                <div className="text-4xl mb-4">📊</div>
                <h2 className={`${excali.className} text-2xl font-bold mb-3`}>
                  Historical Data & Trends
                </h2>
                <p className="text-gray-700 mb-6 flex-grow leading-relaxed">
                  Check out <strong>prime rates</strong>,{' '}
                  <strong>tax brackets</strong>, and how SA finances have
                  evolved
                </p>
                <Button href="/data">View Data</Button>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-8 hover:shadow-lg transition-all hover:border-yellow-400 flex flex-col text-center bg-white">
              <div className="text-4xl mb-4">📚</div>
              <h2 className={`${excali.className} text-2xl font-bold mb-3`}>
                Investment Guides & Tips
              </h2>
              <p className="text-gray-700 mb-6 flex-grow leading-relaxed">
                Learn how <strong>TFSAs</strong> work, what{' '}
                <strong>ETFs</strong> are, and how to build wealth in South
                Africa
              </p>
              <Button href="/blog">Read Guides</Button>
            </div>
          </section>
        </div>
      </div>

      {/* Latest Blog Posts Section */}
      <div className="w-full py-16 px-8">
        <div className="max-w-3xl mx-auto">
          <section>
            <h2 className={`${excali.className} text-3xl mb-8 text-center`}>
              Latest Posts
            </h2>
            <div className="flex flex-col gap-6 mb-8">
              {posts.map((post) => (
                <article
                  key={post.slug}
                  className="border border-gray-200 rounded-lg p-8 hover:shadow-lg transition-all hover:border-yellow-400 flex flex-col"
                >
                  <h3
                    className={`${excali.className} text-2xl font-bold mb-2 text-gray-900`}
                  >
                    {post.title}
                  </h3>
                  <time className="text-sm text-gray-500 block mb-4">
                    {new Date(post.date).toLocaleDateString('en-ZA', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                  <p className="text-gray-700 mb-6 leading-relaxed flex-grow">
                    {post.description}
                  </p>
                  <div className="flex justify-end">
                    <Button href={`/blog/${post.slug}`}>Read Article</Button>
                  </div>
                </article>
              ))}
            </div>
            <div className="text-center">
              <Button href="/blog">View All Posts</Button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
