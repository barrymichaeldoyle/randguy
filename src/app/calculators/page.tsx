import Link from "next/link";
import { Metadata } from "next";
import Image from "next/image";

import { excali } from "@/fonts";

export const metadata: Metadata = {
  title: "Financial Calculators",
  description:
    "Free financial calculators for South Africans. Calculate income tax, investment returns, and more.",
  openGraph: {
    title: "Financial Calculators | Rand Guy",
    description:
      "Free financial calculators for South Africans. Calculate income tax, investment returns, and more.",
    type: "website",
  },
};

const calculators = [
  {
    title: "Income Tax Calculator",
    description:
      "Calculate your South African income tax based on the latest tax brackets and rebates for the 2024/2025 tax year.",
    href: "/calculators/income-tax",
    icon: "💰",
  },
  // Add more calculators here in the future
];

export default function CalculatorsPage() {
  return (
    <main className="flex flex-col items-center pt-12 p-8 flex-1">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <Image
            src="/RandGuyLogo.png"
            alt="Rand Guy logo"
            width={80}
            height={80}
            className="mx-auto mb-4"
          />
          <h1 className={`${excali.className} text-4xl mb-4`}>
            Financial Calculators
          </h1>
          <p className="text-lg text-gray-700">
            Free tools to help you make informed financial decisions
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {calculators.map((calculator) => (
            <Link
              key={calculator.href}
              href={calculator.href}
              className="group"
            >
              <article className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all cursor-pointer hover:border-yellow-400 h-full">
                <div className="text-4xl mb-4">{calculator.icon}</div>
                <h2
                  className={`${excali.className} text-2xl font-bold mb-3 text-gray-900 group-hover:text-yellow-600 transition-colors`}
                >
                  {calculator.title}
                </h2>
                <p className="text-gray-700 mb-4">{calculator.description}</p>
                <span
                  className={`${excali.className} text-gray-900 group-hover:text-yellow-600 font-medium transition-colors`}
                >
                  Use Calculator →
                </span>
              </article>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-6">
            More calculators coming soon! Have a suggestion?
          </p>
        </div>
      </div>
    </main>
  );
}
