import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";

import { excali } from "@/fonts";
import { Button } from "@/components/Button";
import { getAllPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Rand Guy | South African Personal Finance",
  description:
    "A random South African guy talking about personal finance. Learn about investing, TFSAs, ETFs, and building wealth in South Africa.",
  openGraph: {
    title: "Rand Guy | South African Personal Finance",
    description:
      "A random South African guy talking about personal finance. Learn about investing, TFSAs, ETFs, and building wealth in South Africa.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Rand Guy | South African Personal Finance",
    description:
      "A random South African guy talking about personal finance. Learn about investing, TFSAs, ETFs, and building wealth in South Africa.",
  },
};

export default async function Home() {
  const posts = await getAllPosts();

  return (
    <main className="flex flex-col items-center pt-30 p-8 flex-1">
      <div className="text-center mb-12">
        <Image
          src="/RandGuyLogo.png"
          alt="Rand Guy logo"
          width={80}
          height={80}
          className="mx-auto mb-4"
        />
        <h1 className={`${excali.className} text-4xl mb-2`}>Rand Guy</h1>
        <p className="text-lg text-gray-700 mb-6">
          A random South African guy talking about personal finance.
        </p>
      </div>

      <div className="max-w-3xl w-full">
        <h2 className={`${excali.className} text-3xl mb-6 text-center`}>
          Latest Posts
        </h2>
        <div className="flex flex-col gap-4 mb-8">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <article className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all group cursor-pointer hover:border-yellow-400">
                <h3
                  className={`${excali.className} text-2xl font-bold mb-2 text-gray-900 group-hover:text-yellow-600 transition-colors`}
                >
                  {post.title}
                </h3>
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
        <div className="text-center">
          <Button href="/blog">View All Posts</Button>
        </div>
      </div>
    </main>
  );
}
