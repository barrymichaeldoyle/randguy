import type { Metadata } from "next";
import Link from "next/link";

import { excali } from "@/fonts";
import { Button } from "@/components/Button";

import IncomeTaxCalculator from "./_components/IncomeTaxCalculator";

export const metadata: Metadata = {
  title: "Income Tax Calculator | South Africa 2025/2026",
  description:
    "Calculate your South African income tax for 2025/2026. Free income tax calculator with UIF, age-based rebates, and year-over-year comparison. Get instant tax breakdowns.",
  keywords: [
    "income tax calculator",
    "South Africa tax",
    "SARS tax calculator",
    "2025/2026 tax",
    "UIF calculator",
    "tax rebates",
    "take-home pay calculator",
  ],
  alternates: {
    canonical: "/calculators/income-tax",
  },
  openGraph: {
    title: "Income Tax Calculator | South Africa 2025/2026",
    description:
      "Calculate your South African income tax for 2025/2026. Free income tax calculator with UIF, age-based rebates, and year-over-year comparison.",
    type: "website",
    url: "/calculators/income-tax",
  },
};

export default function IncomeTaxCalculatorPage() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Income Tax Calculator",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "ZAR",
    },
    description:
      "Calculate your South African income tax for 2025/2026. Free income tax calculator with UIF, age-based rebates, and year-over-year comparison.",
    featureList: [
      "Income tax calculation for South Africa",
      "UIF (Unemployment Insurance Fund) calculation",
      "Age-based rebates (65+ and 75+)",
      "Year-over-year tax comparison",
      "Multiple pay frequency options (monthly, annual, bi-weekly, weekly)",
      "Historical tax data from 2020/2021 to 2025/2026",
    ],
    inLanguage: "en-ZA",
    url: `${baseUrl}/calculators/income-tax`,
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
        name: "Income Tax Calculator",
        item: `${baseUrl}/calculators/income-tax`,
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
              Income Tax Calculator
            </li>
          </ol>
        </nav>

        <div className="text-center mb-8">
          <h1 className={`${excali.className} text-4xl mb-4`}>
            South African Income Tax Calculator 2025/2026
          </h1>
          <p className="text-lg text-gray-700">
            Calculate your South African income tax with UIF and age-based
            rebates
          </p>
        </div>

        <IncomeTaxCalculator />

        <article className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className={`${excali.className} text-xl mb-3 text-blue-900`}>
            About This Income Tax Calculator
          </h2>
          <ul className="space-y-2 text-sm text-blue-900">
            <li>
              • Based on official <strong>SARS tax brackets and rebates</strong>{" "}
              for the selected tax year (2020/2021 - 2025/2026)
            </li>
            <li>
              • <strong>UIF (Unemployment Insurance Fund)</strong> is calculated
              at 1% for salary income, capped at R177.12/month (R17,712 monthly
              income ceiling)
            </li>
            <li>
              • Tax brackets remained unchanged from 2024/2025 to 2025/2026,
              which may result in <strong>&quot;bracket creep&quot;</strong> as
              inflation pushes salaries into higher tax brackets
            </li>
            <li>
              • Includes <strong>age-based rebates</strong> for taxpayers 65+
              and 75+
            </li>
            <li>
              • Supports multiple <strong>pay frequencies</strong>: monthly,
              annual, bi-weekly, and weekly
            </li>
            <li>
              • Does not include medical aid tax credits, retirement fund
              contributions, or other deductions
            </li>
            <li>
              • For informational purposes only - consult a tax professional for
              personalized advice
            </li>
          </ul>
        </article>

        <div className="text-center mt-8">
          <Button href="/" variant="secondary">
            Back to Home
          </Button>
        </div>
      </div>
    </main>
  );
}
