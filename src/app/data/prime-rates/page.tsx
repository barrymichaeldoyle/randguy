"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import { excali } from "@/fonts";
import {
  PRIME_LENDING_RATE_ZA,
  REPO_RATE_ZA,
  REPO_RATE_SPREAD,
} from "@/lib/historical-data";

export default function PrimeRatesPage() {
  const [hoveredPoint, setHoveredPoint] = useState<{
    date: string;
    rate: number;
  } | null>(null);

  // Calculate statistics
  const stats = useMemo(() => {
    const rates = PRIME_LENDING_RATE_ZA.map((d) => d.rate);
    const currentRate = rates[rates.length - 1];
    const avgRate = rates.reduce((a, b) => a + b, 0) / rates.length;
    const maxRate = Math.max(...rates);
    const minRate = Math.min(...rates);

    return {
      current: currentRate,
      average: avgRate,
      max: maxRate,
      min: minRate,
    };
  }, []);

  // Format data for the chart
  const chartData = useMemo(() => {
    // Sort by date ascending (oldest first) and convert to proper date objects
    const sortedPrime = [...PRIME_LENDING_RATE_ZA].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
    const sortedRepo = [...REPO_RATE_ZA].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    return sortedPrime.map((item, index) => ({
      date: new Date(item.date).getTime(), // Use timestamp for proper time scaling
      primeRate: item.rate,
      repoRate: sortedRepo[index].rate,
      fullDate: new Date(item.date).toLocaleDateString("en-ZA", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    }));
  }, []);

  return (
    <main className="flex flex-col items-center pt-8 md:pt-12 px-4 pb-8 md:px-8 flex-1">
      <div className="max-w-6xl w-full">
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
              <Link href="/data" className="hover:text-yellow-600 transition">
                Historical Data
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-900 font-medium" aria-current="page">
              Prime Lending Rates
            </li>
          </ol>
        </nav>

        <div className="mb-8">
          <h1 className={`${excali.className} text-4xl mb-4`}>
            Historical Prime & Repo Rates
          </h1>
          <p className="text-lg text-gray-700 mb-2">
            Track how South Africa&apos;s prime lending rate and SARB repo rate
            have changed since 2002. The prime rate affects home loans, personal
            loans, and other credit products.
          </p>
          <p className="text-sm text-gray-600 mb-6">
            The repo rate is the SARB&apos;s policy rate. Prime rate is
            typically repo rate + {REPO_RATE_SPREAD}%.
          </p>

          {/* Statistics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Current Rate</div>
              <div className="text-3xl font-bold text-gray-900">
                {stats.current}%
              </div>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Average</div>
              <div className="text-3xl font-bold text-gray-900">
                {stats.average.toFixed(2)}%
              </div>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Highest</div>
              <div className="text-3xl font-bold text-gray-900">
                {stats.max}%
              </div>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Lowest</div>
              <div className="text-3xl font-bold text-gray-900">
                {stats.min}%
              </div>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <h2 className={`${excali.className} text-2xl mb-6`}>
            Prime & Repo Rates Over Time
          </h2>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onMouseMove={(e: any) => {
                  if (e.activePayload && e.activePayload.length > 0) {
                    setHoveredPoint({
                      date: e.activePayload[0].payload.fullDate,
                      rate: e.activePayload[0].payload.primeRate,
                    });
                  }
                }}
                onMouseLeave={() => setHoveredPoint(null)}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="date"
                  type="number"
                  domain={["dataMin", "dataMax"]}
                  stroke="#6b7280"
                  style={{ fontSize: "12px" }}
                  tickFormatter={(timestamp) => {
                    const date = new Date(timestamp);
                    return date.toLocaleDateString("en-ZA", {
                      year: "numeric",
                      month: "short",
                    });
                  }}
                  scale="time"
                />
                <YAxis
                  stroke="#6b7280"
                  style={{ fontSize: "12px" }}
                  label={{
                    value: "Rate (%)",
                    angle: -90,
                    position: "insideLeft",
                  }}
                  domain={[0, 20]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number, name: string) => [
                    `${value}%`,
                    name,
                  ]}
                  labelFormatter={(timestamp: number) => {
                    const point = chartData.find((d) => d.date === timestamp);
                    return point
                      ? point.fullDate
                      : new Date(timestamp).toLocaleDateString("en-ZA");
                  }}
                />
                <Legend />
                <Line
                  type="stepAfter"
                  dataKey="primeRate"
                  name="Prime Rate"
                  stroke="#eab308"
                  strokeWidth={2}
                  dot={{ fill: "#eab308", r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="stepAfter"
                  dataKey="repoRate"
                  name="Repo Rate"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: "#3b82f6", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          {hoveredPoint && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">Highlighted Point:</div>
              <div className="text-lg font-semibold">
                {hoveredPoint.date}: {hoveredPoint.rate}%
              </div>
            </div>
          )}
        </div>

        {/* Information Section */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className={`${excali.className} text-xl mb-3`}>
              What is the Prime Rate?
            </h3>
            <p className="text-gray-700 text-sm">
              The prime lending rate is the interest rate that banks charge
              their most creditworthy customers. Most variable-rate loans (like
              home loans) are calculated as prime plus a margin. For example, if
              prime is {stats.current}% and your loan is &quot;prime + 2%&quot;,
              you&apos;d pay {(stats.current + 2).toFixed(2)}%.
            </p>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <h3 className={`${excali.className} text-xl mb-3`}>
              Why Does it Change?
            </h3>
            <p className="text-gray-700 text-sm">
              The prime rate typically changes when the South African Reserve
              Bank (SARB) adjusts the repo rate. Banks usually increase their
              prime rate by the same amount. The SARB changes rates to control
              inflation and manage economic growth.
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className={`${excali.className} text-xl mb-3`}>
              Historical Highlights
            </h3>
            <ul className="text-gray-700 text-sm space-y-2">
              <li>
                <strong>2008:</strong> Rate peaked at 15.5% during the global
                financial crisis
              </li>
              <li>
                <strong>2020:</strong> Dropped to 7% during COVID-19 pandemic
              </li>
              <li>
                <strong>2022-2023:</strong> Rapid increases to combat inflation
              </li>
            </ul>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
            <h3 className={`${excali.className} text-xl mb-3`}>
              Impact on Your Finances
            </h3>
            <p className="text-gray-700 text-sm">
              A 1% change in prime rate on a R1 million bond can increase or
              decrease your monthly repayment by approximately R650-R700. Use
              our{" "}
              <Link
                href="/calculators/home-loan"
                className="text-yellow-600 hover:underline font-semibold"
              >
                Home Loan Calculator
              </Link>{" "}
              to see how different rates affect your repayments.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-8 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-8 text-center">
          <h2 className={`${excali.className} text-2xl mb-3`}>
            See How Rates Affect Your Finances
          </h2>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
            Use our calculators to see how changes in prime and repo rates
            impact your monthly repayments and overall costs.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/calculators/home-loan"
              className="inline-block bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Home Loan Calculator →
            </Link>
            <Link
              href="/calculators"
              className="inline-block bg-white hover:bg-gray-50 text-gray-900 font-semibold px-6 py-3 rounded-lg border border-gray-300 transition-colors"
            >
              View All Calculators
            </Link>
          </div>
        </div>

        {/* Data Table */}
        <div className="mt-8 bg-white border border-gray-200 rounded-lg p-6">
          <h2 className={`${excali.className} text-2xl mb-4`}>
            Historical Data Table
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-4">Date</th>
                  <th className="text-right py-2 px-4">Prime Rate</th>
                  <th className="text-right py-2 px-4">Change</th>
                  <th className="text-right py-2 px-4">Duration</th>
                </tr>
              </thead>
              <tbody>
                {PRIME_LENDING_RATE_ZA.map((item, index) => {
                  // Data is in reverse chronological order (newest first)
                  // So the "previous" rate is actually the next item in the array
                  const prevRate =
                    index < PRIME_LENDING_RATE_ZA.length - 1
                      ? PRIME_LENDING_RATE_ZA[index + 1].rate
                      : item.rate;
                  const change = item.rate - prevRate;

                  // Calculate duration until next rate change
                  let durationText = "-";
                  if (index > 0) {
                    const currentDate = new Date(item.date);
                    const nextDate = new Date(
                      PRIME_LENDING_RATE_ZA[index - 1].date,
                    );
                    const diffMs = nextDate.getTime() - currentDate.getTime();
                    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
                    const diffMonths = Math.floor(diffDays / 30.44); // Average days per month
                    const years = Math.floor(diffMonths / 12);
                    const months = diffMonths % 12;

                    if (years > 0 && months > 0) {
                      durationText = `${years}y ${months}m`;
                    } else if (years > 0) {
                      durationText = `${years}y`;
                    } else if (months > 0) {
                      durationText = `${months}m`;
                    } else {
                      durationText = `${diffDays}d`;
                    }
                  } else {
                    // For the most recent rate (index 0), show "Current"
                    durationText = "Current";
                  }

                  return (
                    <tr key={item.date} className="border-b border-gray-100">
                      <td className="py-2 px-4">{item.date}</td>
                      <td className="text-right py-2 px-4 font-semibold">
                        {item.rate}%
                      </td>
                      <td className="text-right py-2 px-4">
                        {change === 0 ? (
                          <span className="text-gray-400">-</span>
                        ) : change > 0 ? (
                          <span className="text-red-600">+{change}%</span>
                        ) : (
                          <span className="text-green-600">{change}%</span>
                        )}
                      </td>
                      <td className="text-right py-2 px-4 text-gray-600">
                        {durationText}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
