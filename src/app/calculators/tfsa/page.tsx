import type { Metadata } from "next";

import { excali } from "@/fonts";
import { Button } from "@/components/Button";
import { CalculatorInfo } from "@/components/CalculatorInfo";
import { Breadcrumb } from "@/components/Breadcrumb";

import TFSACalculator from "./_components/TFSACalculator";

export const metadata: Metadata = {
  title: "TFSA Calculator | South Africa",
  description:
    "Calculate how long it will take to max out your Tax-Free Savings Account (TFSA) in South Africa. Free TFSA calculator with contribution tracking, timeline projections, and progress visualization.",
  keywords: [
    "TFSA calculator",
    "tax-free savings account",
    "South Africa TFSA",
    "TFSA contribution calculator",
    "TFSA timeline",
    "tax-free investment",
    "SA savings calculator",
    "TFSA limit calculator",
  ],
  alternates: {
    canonical: "/calculators/tfsa",
  },
  openGraph: {
    title: "TFSA Calculator | South Africa",
    description:
      "Calculate how long it will take to max out your Tax-Free Savings Account (TFSA) in South Africa. Free TFSA calculator with contribution tracking and timeline projections.",
    type: "website",
    url: "/calculators/tfsa",
  },
};

export default function TFSACalculatorPage() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "TFSA Calculator",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "ZAR",
    },
    description:
      "Calculate how long it will take to max out your Tax-Free Savings Account (TFSA) in South Africa. Free TFSA calculator with contribution tracking, timeline projections, and progress visualization.",
    featureList: [
      "TFSA contribution timeline calculation",
      "Progress tracking visualization",
      "Lifetime limit: R500,000",
      "Annual limit checking: R36,000",
      "Projected max-out date",
      "Monthly and annual contribution planning",
    ],
    inLanguage: "en-ZA",
    url: `${baseUrl}/calculators/tfsa`,
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
        name: "TFSA Calculator",
        item: `${baseUrl}/calculators/tfsa`,
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
            { name: "TFSA Calculator" },
          ]}
        />

        <div className="text-center mb-8">
          <h1 className={`${excali.className} text-4xl mb-4`}>
            TFSA Calculator
          </h1>
          <p className="text-lg text-gray-700">
            Calculate how long it will take to max out your Tax-Free Savings
            Account
          </p>
        </div>

        <TFSACalculator />

        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <p className="text-gray-800 mb-3">
            Want to learn more about TFSAs and investment strategies?
          </p>
          <Button href="/blog/understanding-tax-free-savings">
            Read the Complete TFSA Guide →
          </Button>
        </div>

        <CalculatorInfo
          title="About Tax-Free Savings Accounts (TFSA)"
          items={[
            <>
              • <strong>Lifetime contribution limit:</strong> R500,000 (cannot
              be exceeded)
            </>,
            <>
              • <strong>Annual contribution limit:</strong> R36,000 per tax year
            </>,
            <>
              • <strong>Tax benefits:</strong> All growth, dividends, and
              interest are completely tax-free
            </>,
            <>
              • <strong>No tax on withdrawals:</strong> Unlike retirement
              annuities, you can access your money anytime without penalties.
              However, treat it like a retirement fund and avoid withdrawing to
              maximize long-term tax-free growth
            </>,
            <>
              • <strong>Withdrawals don&apos;t free up space:</strong> Once you
              contribute, that counts towards your lifetime limit forever - even
              if you withdraw the money
            </>,
            <>
              • <strong>Over-contribution penalties:</strong> Contributing more
              than R36,000 per year incurs a 40% penalty tax on the excess
            </>,
            <>
              • <strong>Available across providers:</strong> You can have
              multiple TFSAs across different banks and investment platforms
            </>,
            <>
              • <strong>Popular investment vehicle:</strong> Ideal for long-term
              wealth building with complete tax efficiency
            </>,
            <>
              • For informational purposes only - consult a financial advisor
              for personalized investment advice
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
