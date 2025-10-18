import type { Metadata } from "next";

import { excali } from "@/fonts";
import { Button } from "@/components/Button";
import { CalculatorInfo } from "@/components/CalculatorInfo";
import { Breadcrumb } from "@/components/Breadcrumb";
import {
  PRIME_LENDING_RATE_ZA,
  PRIME_LENDING_RATE_LAST_UPDATED,
} from "@/lib/historical-data";

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

  // Get current prime rate (first item in the array since it's reverse chronological)
  const currentPrimeRate = PRIME_LENDING_RATE_ZA[0].rate;
  const lastUpdated = new Date(
    PRIME_LENDING_RATE_LAST_UPDATED,
  ).toLocaleDateString("en-ZA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

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
      "Loan term flexibility (1-100 years or months)",
      "Deposit percentage calculator",
      "Configurable monthly service fee",
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
    <main className="flex flex-col items-center pt-8 md:pt-12 px-4 pb-8 md:px-8 flex-1">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />
      <div className="max-w-7xl w-full">
        <Breadcrumb
          items={[
            { name: "Home", href: "/" },
            { name: "Calculators", href: "/calculators" },
            { name: "Home Loan Calculator" },
          ]}
        />

        <div className="text-center mb-8">
          <h1 className={`${excali.className} text-4xl mb-4`}>
            Home Loan Calculator
          </h1>
          <p className="text-lg text-gray-700">
            Calculate your monthly bond repayments in South Africa
          </p>
        </div>

        <HomeLoanCalculator />

        <CalculatorInfo
          title="About This Home Loan Calculator"
          items={[
            <>
              • Calculates <strong>monthly repayments</strong> based on loan
              amount, interest rate, and term
            </>,
            <>
              • Uses the standard <strong>amortization formula</strong> used by
              South African banks
            </>,
            <>
              • Current <strong>SA prime rate</strong> is {currentPrimeRate}%
              (as of {lastUpdated}).{" "}
              <a
                href="/data/prime-rates"
                className="text-yellow-600 hover:underline font-semibold"
              >
                View historical rates
              </a>
              . Interest rates vary by bank and are negotiable
            </>,
            <>
              • <strong>100% home loans</strong> are available from many banks,
              especially for first-time home buyers. Adding a deposit may help
              you negotiate better rates
            </>,
            <>
              • Includes optional <strong>monthly service fee</strong>{" "}
              (typically R69) - this is the bank admin fee charged each month
            </>,
            <>
              • Does not include additional costs like transfer fees, bond
              registration, or insurance
            </>,
            <>
              • <strong>Loan term</strong> typically ranges from 20-30 years for
              home loans
            </>,
            <>
              • Shorter loan terms mean higher monthly payments but less total
              interest paid
            </>,
            <>
              • For informational purposes only - contact a bank or bond
              originator for accurate quotes
            </>,
          ]}
        />

        <div className="text-center mt-8">
          <Button href="/calculators" variant="secondary">
            View All Calculators
          </Button>
        </div>
      </div>
    </main>
  );
}
