import { notFound } from "next/navigation";
import Link from "next/link";
import { excali } from "@/fonts";

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
  } catch (error) {
    return null;
  }
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
      title: "Post Not Found",
    };
  }

  return {
    title: `${post.metadata.title} | Rand Guy`,
    description: post.metadata.description,
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

  return (
    <main className="flex flex-col items-center p-8 flex-1">
      <article className="max-w-3xl w-full">
        <Link
          href="/blog"
          className="text-blue-600 hover:text-blue-800 mb-6 inline-block"
        >
          ← Back to Blog
        </Link>

        <header className="mb-8 pb-6 border-b border-gray-200">
          <h1
            className={`${excali.className} text-4xl font-bold mb-3 text-gray-900`}
          >
            {post.metadata.title}
          </h1>
          <time className="text-gray-600">
            {new Date(post.metadata.date).toLocaleDateString("en-ZA", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </header>

        <div className="prose prose-lg max-w-none">
          <Content />
        </div>
      </article>
    </main>
  );
}
