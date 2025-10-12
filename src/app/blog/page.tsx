import Link from "next/link";
import { excali } from "../../fonts";
import { Button } from "@/components/Button";

interface BlogPost {
  slug: string;
  title: string;
  date: string;
  description: string;
}

const posts: BlogPost[] = [
  {
    slug: "getting-started-with-investing",
    title: "Getting Started with Investing in South Africa",
    date: "2025-10-12",
    description:
      "A beginner's guide to investing in South Africa. Learn about ETFs, unit trusts, and tax-free savings accounts.",
  },
  {
    slug: "understanding-tax-free-savings",
    title: "Understanding Tax-Free Savings Accounts",
    date: "2025-10-10",
    description:
      "Everything you need to know about TFSAs in South Africa, including contribution limits and best practices.",
  },
];

export default function BlogPage() {
  return (
    <main className="flex flex-col items-center p-8 flex-1">
      <div className="max-w-3xl w-full">
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
