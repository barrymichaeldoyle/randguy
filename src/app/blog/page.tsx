import Link from "next/link";
import { Metadata } from "next";

import { getAllPosts } from "@/lib/posts";
import { Breadcrumb } from "@/components/Breadcrumb";

import { excali } from "../../fonts";

export const metadata: Metadata = {
  title: "Blog | Rand Guy",
  description:
    "Read about personal finance, investing, TFSAs, and building wealth in South Africa. Practical advice for everyday South Africans.",
  openGraph: {
    title: "Blog | Rand Guy",
    description:
      "Read about personal finance, investing, TFSAs, and building wealth in South Africa. Practical advice for everyday South Africans.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Blog | Rand Guy",
    description:
      "Read about personal finance, investing, TFSAs, and building wealth in South Africa. Practical advice for everyday South Africans.",
  },
};

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <main className="flex flex-col items-center p-8 flex-1">
      <div className="max-w-3xl w-full">
        <Breadcrumb items={[{ name: "Home", href: "/" }, { name: "Blog" }]} />

        <h1 className={`${excali.className} text-5xl mb-4 text-center`}>
          Rand Guy&apos;s Blog
        </h1>
        <p className="text-lg text-gray-600 mb-12 text-center">
          A random South African guy talking about personal finance.
        </p>

        <div className="flex flex-col gap-4">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <article className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all group cursor-pointer hover:border-yellow-400">
                <h2
                  className={`${excali.className} text-2xl font-bold mb-2 text-gray-900 group-hover:text-yellow-600 transition-colors`}
                >
                  {post.title}
                </h2>
                <time className="text-sm text-gray-500 block mb-3">
                  {new Date(post.date).toLocaleDateString("en-ZA", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
                <p className="text-gray-700 mb-4">{post.description}</p>
                <span
                  className={`${excali.className} text-gray-900 group-hover:text-yellow-600 font-medium transition-colors`}
                >
                  Read more →
                </span>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
