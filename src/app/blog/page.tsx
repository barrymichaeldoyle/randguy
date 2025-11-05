import Image from 'next/image';

import { BlogPostCard } from '@/components/BlogPostCard';
import { Breadcrumb } from '@/components/Breadcrumb';
import { BASE_URL, TAGLINE, TWITTER_HANDLE } from '@/lib/constants';
import { getAllPosts } from '@/lib/posts';

import { excali } from '../../fonts';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog | Rand Guy',
  description:
    'South African personal finance blog: investing, tax, TFSAs, ETFs, and money tips to build wealth in SA.',
  alternates: {
    types: {
      'application/rss+xml': `${BASE_URL}/feed.xml`,
    },
  },
  openGraph: {
    title: 'Blog | Rand Guy',
    description:
      'South African personal finance blog: investing, tax, TFSAs, ETFs, and money tips to build wealth in SA.',
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
    title: 'Blog | Rand Guy',
    description:
      'South African personal finance blog: investing, tax, TFSAs, ETFs, and money tips to build wealth in SA.',
    images: ['/og-image.png'],
    site: TWITTER_HANDLE,
    creator: TWITTER_HANDLE,
  },
};

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <main className="flex flex-1 flex-col items-center">
      <div className="mb-8 w-full px-8 py-8">
        <div className="mx-auto max-w-3xl">
          <Breadcrumb items={[{ name: 'Home', href: '/' }, { name: 'Blog' }]} />

          <Image
            src="/RandGuyLogo.png"
            alt="Rand Guy logo"
            width={80}
            height={80}
            className="mx-auto mt-6 mb-4"
          />

          <h1 className={`${excali.className} mt-8 mb-4 text-center text-5xl`}>
            Rand Guy&apos;s Blog
          </h1>
          <p className="text-center text-lg text-gray-600">
            A random South African guy talking about personal finance.
          </p>
          <div className="mt-4 text-center">
            <a href="/feed.xml" aria-label="Subscribe to RSS feed">
              📡 Subscribe via RSS
            </a>
          </div>
        </div>
      </div>

      <div className="w-full max-w-3xl px-8 pb-8">
        <div className="flex flex-col gap-4">
          {posts.map((post) => (
            <BlogPostCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </main>
  );
}
