import type { Metadata } from "next";
import Link from "next/link";

import { excali } from "@/fonts";
import { Button } from "@/components/Button";

import HomeLoanCalculator from "./_components/HomeLoanCalculator";

export const metadata: Metadata = {
  title: "Home Loan Calculator | South Africa",
  description:
    "Calculate your home loan repayments in South Africa. Free bond calculator with monthly payments, total interest, and loan breakdown. Plan your property purchase with accurate repayment estimates.",
  keywords: [
    "home loan calculator",
    "bond calculator",
    "South Africa mortgage",
    "home loan repayment",
    "bond repayment calculator",
    "property loan calculator",
    "SA home loan",
    "mortgage calculator",
  ],
  alternates: {
    canonical: "/calculators/home-loan",
  },
  openGraph: {
    title: "Home Loan Calculator | South Africa",
    description:
      "Calculate your home loan repayments in South Africa. Free bond calculator with monthly payments, total interest, and loan breakdown.",
    type: "website",
    url: "/calculators/home-loan",
  },
};

export default function HomeLoanCalculatorPage() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Home Loan Calculator",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "ZAR",
    },
    description:
      "Calculate your home loan repayments in South Africa. Free bond calculator with monthly payments, total interest, and loan breakdown.",
    featureList: [
      "Monthly repayment calculation",
      "Total interest calculation",
      "Loan term flexibility (1-30 years)",
      "Deposit percentage calculator",
      "Visual cost breakdown",
      "South African bond calculator",
    ],
    inLanguage: "en-ZA",
    url: `${baseUrl}/calculators/home-loan`,
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
        name: "Home Loan Calculator",
        item: `${baseUrl}/calculators/home-loan`,
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
              Home Loan Calculator
            </li>
          </ol>
        </nav>

        <div className="text-center mb-8">
          <h1 className={`${excali.className} text-4xl mb-4`}>
            Home Loan Calculator
          </h1>
          <p className="text-lg text-gray-700">
            Calculate your monthly bond repayments in South Africa
          </p>
        </div>

        <HomeLoanCalculator />

        <article className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className={`${excali.className} text-xl mb-3 text-blue-900`}>
            About This Home Loan Calculator
          </h2>
          <ul className="space-y-2 text-sm text-blue-900">
            <li>
              • Calculates <strong>monthly repayments</strong> based on loan
              amount, interest rate, and term
            </li>
            <li>
              • Uses the standard <strong>amortization formula</strong> used by
              South African banks
            </li>
            <li>
              • Current <strong>SA prime rate</strong> is 10.5% (as of Oct
              2025). Interest rates vary by bank and are negotiable
            </li>
            <li>
              • <strong>100% home loans</strong> are available from many banks,
              especially for first-time home buyers. Adding a deposit may help
              you negotiate better rates
            </li>
            <li>
              • Does not include additional costs like transfer fees, bond
              registration, or insurance
            </li>
            <li>
              • <strong>Loan term</strong> typically ranges from 20-30 years for
              home loans
            </li>
            <li>
              • Shorter loan terms mean higher monthly payments but less total
              interest paid
            </li>
            <li>
              • For informational purposes only - contact a bank or bond
              originator for accurate quotes
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
