import type { Metadata } from "next";
import Link from "next/link";

import { excali } from "@/fonts";
import { Button } from "@/components/Button";

import LTVCalculator from "./_components/LTVCalculator";

export const metadata: Metadata = {
  title: "Loan-to-Value (LTV) Calculator | South Africa",
  description:
    "Calculate your Loan-to-Value (LTV) ratio for property purchases in South Africa. Free LTV calculator to understand your equity position and loan terms. Essential for home buyers.",
  keywords: [
    "LTV calculator",
    "loan to value calculator",
    "South Africa property",
    "home loan LTV",
    "property equity calculator",
    "bond LTV",
    "SA home loan",
    "mortgage calculator",
  ],
  alternates: {
    canonical: "/calculators/ltv",
  },
  openGraph: {
    title: "Loan-to-Value (LTV) Calculator | South Africa",
    description:
      "Calculate your Loan-to-Value (LTV) ratio for property purchases in South Africa. Understand your equity position and loan terms.",
    type: "website",
    url: "/calculators/ltv",
  },
};

export default function LTVCalculatorPage() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Loan-to-Value Calculator",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "ZAR",
    },
    description:
      "Calculate your Loan-to-Value (LTV) ratio for property purchases in South Africa. Free calculator to understand your equity position.",
    featureList: [
      "LTV percentage calculation",
      "Equity position calculation",
      "Visual breakdown of loan vs equity",
      "Flexible input (deposit or loan amount)",
      "South African property context",
      "Interest rate guidance by LTV level",
    ],
    inLanguage: "en-ZA",
    url: `${baseUrl}/calculators/ltv`,
  };

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Calculators",
        item: `${baseUrl}/calculators`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "LTV Calculator",
        item: `${baseUrl}/calculators/ltv`,
      },
    ],
  };

  return (
    <main className="flex flex-col items-center pt-12 p-8 flex-1">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />
      <div className="max-w-7xl w-full">
        {/* Breadcrumb Navigation */}
        <nav className="mb-6 text-sm" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-gray-600">
            <li>
              <Link href="/" className="hover:text-yellow-600 transition">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link
                href="/calculators"
                className="hover:text-yellow-600 transition"
              >
                Calculators
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-900 font-medium" aria-current="page">
              LTV Calculator
            </li>
          </ol>
        </nav>

        <div className="text-center mb-8">
          <h1 className={`${excali.className} text-4xl mb-4`}>
            Loan-to-Value (LTV) Calculator
          </h1>
          <p className="text-lg text-gray-700">
            Calculate your LTV ratio and understand your equity position
          </p>
        </div>

        <LTVCalculator />

        <article className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className={`${excali.className} text-xl mb-3 text-blue-900`}>
            About Loan-to-Value (LTV) Ratio
          </h2>
          <ul className="space-y-2 text-sm text-blue-900">
            <li>
              • <strong>LTV (Loan-to-Value)</strong> is the ratio of your loan
              amount to the property value, expressed as a percentage
            </li>
            <li>
              • <strong>Formula:</strong> LTV = (Loan Amount / Property Value) ×
              100
            </li>
            <li>
              • <strong>Lower LTV = Better rates:</strong> Banks offer better
              interest rates for LTV below 80%
            </li>
            <li>
              • <strong>100% LTV</strong> means a full loan with no deposit.
              Available for first-time buyers but may have higher rates
            </li>
            <li>
              • <strong>Your equity</strong> is the difference between property
              value and loan amount (your deposit)
            </li>
            <li>
              • <strong>80% LTV or less</strong> typically gets you the best
              rates and terms from SA banks
            </li>
            <li>
              • A larger deposit (lower LTV) gives you more{" "}
              <strong>negotiating power</strong> with banks
            </li>
            <li>
              • LTV can change over time as you pay down your bond or as
              property values fluctuate
            </li>
            <li>
              • For informational purposes only - actual rates depend on credit
              score, income, and bank policies
            </li>
          </ul>
        </article>

        <div className="text-center mt-8">
          <Button href="/calculators" variant="secondary">
            View All Calculators
          </Button>
        </div>
      </div>
    </main>
  );
}
