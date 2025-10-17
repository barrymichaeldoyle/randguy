import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";

import { excali } from "@/fonts";
import { Button } from "@/components/Button";
import { getAllPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Rand Guy | South African Personal Finance & Investment Guide",
  description:
    "Learn about personal finance, investing, TFSAs, ETFs, and building wealth in South Africa. Free financial calculators, tax guides, and investment advice for South Africans.",
  keywords: [
    "South African personal finance",
    "investing in South Africa",
    "TFSA",
    "ETF investing",
    "tax-free savings",
    "wealth building",
    "SARS tax",
    "financial planning",
    "SA investment guide",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Rand Guy | South African Personal Finance & Investment Guide",
    description:
      "Learn about personal finance, investing, TFSAs, ETFs, and building wealth in South Africa. Free financial calculators and investment advice.",
    type: "website",
    url: "/",
    siteName: "Rand Guy",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rand Guy | South African Personal Finance",
    description:
      "Learn about personal finance, investing, TFSAs, ETFs, and building wealth in South Africa.",
  },
};

export default async function Home() {
  const posts = await getAllPosts();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Rand Guy",
    description:
      "South African personal finance and investment guide. Learn about investing, TFSAs, ETFs, and building wealth.",
    url: baseUrl,
    inLanguage: "en-ZA",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/blog?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Rand Guy",
    description: "South African Personal Finance & Investment Guide",
    url: baseUrl,
    logo: `${baseUrl}/RandGuyLogo.png`,
    sameAs: [],
  };

  const blogPostsSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: posts.slice(0, 5).map((post, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "BlogPosting",
        headline: post.title,
        description: post.description,
        datePublished: post.date,
        url: `${baseUrl}/blog/${post.slug}`,
        author: {
          "@type": "Person",
          name: "Rand Guy",
        },
      },
    })),
  };

  const siteNavigationSchema = {
    "@context": "https://schema.org",
    "@type": "SiteNavigationElement",
    name: "Main Navigation",
    url: baseUrl,
    hasPart: [
      {
        "@type": "WebPage",
        name: "Home",
        url: baseUrl,
        description:
          "South African personal finance and investment advice, calculators, and guides",
      },
      {
        "@type": "WebPage",
        name: "Calculators",
        url: `${baseUrl}/calculators`,
        description:
          "Free financial calculators for South Africans - income tax, UIF, and more",
      },
      {
        "@type": "WebPage",
        name: "Blog",
        url: `${baseUrl}/blog`,
        description:
          "Personal finance articles and investment guides for South Africans",
      },
      {
        "@type": "WebPage",
        name: "Income Tax Calculator",
        url: `${baseUrl}/calculators/income-tax`,
        description:
          "Calculate your South African income tax with UIF and age-based rebates",
      },
      {
        "@type": "WebPage",
        name: "Home Loan Calculator",
        url: `${baseUrl}/calculators/home-loan`,
        description:
          "Calculate your home loan repayments and total interest for property purchases",
      },
      {
        "@type": "WebPage",
        name: "Loan-to-Value Calculator",
        url: `${baseUrl}/calculators/ltv`,
        description:
          "Calculate your LTV ratio and understand your equity position for property financing",
      },
    ],
  };

  return (
    <main className="flex flex-col items-center pt-16 p-8 flex-1">
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
          Learn about investing, TFSAs, ETFs, and building wealth in South
          Africa
        </p>
      </div>

      <div className="max-w-3xl w-full">
        {/* Features Section */}
        <section className="mb-12 grid md:grid-cols-2 gap-6">
          <Link
            href="/calculators"
            className="group border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all hover:border-yellow-400"
          >
            <div className="flex items-center gap-3">
              <div className="text-3xl mb-3">🧮</div>
              <h2
                className={`${excali.className} text-xl font-bold mb-2 group-hover:text-yellow-600 transition-colors`}
              >
                Free Financial Calculators
              </h2>
            </div>
            <p className="text-gray-700 text-sm">
              Calculate your <strong>income tax</strong>, <strong>UIF</strong>,
              and more with our SA-specific tools
            </p>
          </Link>

          <Link
            href="/blog"
            className="group border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all hover:border-yellow-400"
          >
            <div className="flex items-center gap-3">
              <div className="text-3xl mb-3">📚</div>
              <h2
                className={`${excali.className} text-xl font-bold mb-2 group-hover:text-yellow-600 transition-colors`}
              >
                Investment Guides & Tips
              </h2>
            </div>
            <p className="text-gray-700 text-sm">
              Learn about <strong>TFSAs</strong>, <strong>ETFs</strong>, and
              building wealth in South Africa
            </p>
          </Link>
        </section>

        {/* Latest Blog Posts */}
        <section>
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
        </section>
      </div>
    </main>
  );
}
