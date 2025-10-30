import Link from 'next/link';

import { BlogPostCard } from '@/components/BlogPostCard';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Button } from '@/components/Button';
import { excali } from '@/fonts';
import { getAllPosts } from '@/lib/posts';

export default async function BlogNotFound() {
  const posts = await getAllPosts();

  return (
    <main className="flex flex-1 flex-col items-center">
      <div className="mb-8 w-full bg-gray-50 px-8 py-8">
        <div className="mx-auto max-w-3xl">
          <Breadcrumb items={[{ name: 'Home', href: '/' }, { name: 'Blog' }]} />

          <div className="mt-8 text-center">
            <h1 className={`${excali.className} mb-4 text-6xl text-yellow-600`}>
              404
            </h1>
            <h2 className={`${excali.className} mb-4 text-4xl`}>
              Blog Post Not Found
            </h2>
            <p className="mb-6 text-lg text-gray-600">
              Sorry, we couldn&apos;t find the blog post you&apos;re looking
              for.
            </p>
            <Button href="/blog" variant="primary" size="md">
              View All Posts
            </Button>
          </div>
        </div>
      </div>

      <div className="w-full max-w-3xl px-8 pb-8">
        <h3 className={`${excali.className} mb-6 text-2xl`}>
          Check out our other posts
        </h3>
        <div className="flex flex-col gap-4">
          {posts.map((post) => (
            <BlogPostCard key={post.slug} post={post} />
          ))}
        </div>

        {posts.length === 0 && (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
            <p className="text-gray-600">No blog posts available yet.</p>
            <Link
              href="/"
              className="mt-4 inline-block text-yellow-800 hover:text-yellow-600"
            >
              Return to Home
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
