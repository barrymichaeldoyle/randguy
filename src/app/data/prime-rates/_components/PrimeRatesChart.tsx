"use client";

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
import { PRIME_LENDING_RATE_ZA, REPO_RATE_ZA } from "@/lib/historical-data";

export default function PrimeRatesChart() {
  const [hoveredPoint, setHoveredPoint] = useState<{
    date: string;
    rate: number;
  } | null>(null);

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
              formatter={(value: number, name: string) => [`${value}%`, name]}
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
  );
}
