import { BlogPostCard } from '@/components/BlogPostCard';
import { Breadcrumb } from '@/components/Breadcrumb';
import { getAllPosts } from '@/lib/posts';

import { excali } from '../../fonts';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog | Rand Guy',
  description:
    'Read about personal finance, investing, TFSAs, and building wealth in South Africa. Practical advice for everyday South Africans.',
  openGraph: {
    title: 'Blog | Rand Guy',
    description:
      'Read about personal finance, investing, TFSAs, and building wealth in South Africa. Practical advice for everyday South Africans.',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Rand Guy - Making Cents of SA Finance',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog | Rand Guy',
    description:
      'Read about personal finance, investing, TFSAs, and building wealth in South Africa. Practical advice for everyday South Africans.',
    images: ['/og-image.png'],
  },
};

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <main className="flex flex-1 flex-col items-center">
      <div className="mb-8 w-full bg-gray-50 px-8 py-8">
        <div className="mx-auto max-w-3xl">
          <Breadcrumb items={[{ name: 'Home', href: '/' }, { name: 'Blog' }]} />

          <h1 className={`${excali.className} mt-8 mb-4 text-center text-5xl`}>
            Rand Guy&apos;s Blog
          </h1>
          <p className="text-center text-lg text-gray-600">
            A random South African guy talking about personal finance.
          </p>
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
