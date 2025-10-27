import { notFound } from 'next/navigation';

import { excali } from '@/fonts';
import { getAllPosts } from '@/lib/posts';
import { Breadcrumb } from '@/components/Breadcrumb';
import { BASE_URL } from '@/lib/constants';

interface BlogPostMetadata {
  title: string;
  date: string;
  description: string;
}

async function getPost(slug: string) {
  try {
    const post = await import(`@/app/blog/posts/${slug}.mdx`);
    return {
      content: post.default,
      metadata: post.metadata as BlogPostMetadata,
    };
  } catch (_e) {
    return null;
  }
}

// Generate static params for all blog posts at build time
export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: `${post.metadata.title} | Rand Guy`,
    description: post.metadata.description,
    openGraph: {
      title: post.metadata.title,
      description: post.metadata.description,
      type: 'article',
      publishedTime: post.metadata.date,
      authors: ['Rand Guy'],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.metadata.title,
      description: post.metadata.description,
    },
  };
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  const Content = post.content;

  // Structured data for SEO
  const blogPostData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.metadata.title,
    description: post.metadata.description,
    datePublished: post.metadata.date,
    author: {
      '@type': 'Person',
      name: 'Rand Guy',
    },
  };

  const breadcrumbData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: BASE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: `${BASE_URL}/blog`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.metadata.title,
        item: `${BASE_URL}/blog/${slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />
      <main className="flex flex-col items-center p-8 flex-1">
        <article className="max-w-3xl w-full">
          <Breadcrumb
            items={[
              { name: 'Home', href: '/' },
              { name: 'Blog', href: '/blog' },
              { name: post.metadata.title },
            ]}
          />

          <header className="mb-8 pb-6 border-b border-gray-200">
            <h1
              className={`${excali.className} text-4xl font-bold mb-3 text-gray-900`}
            >
              {post.metadata.title}
            </h1>
            <time className="text-gray-600">
              {new Date(post.metadata.date).toLocaleDateString('en-ZA', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          </header>

          <div className="prose prose-lg max-w-none">
            <Content />
          </div>
        </article>
      </main>
    </>
  );
}
