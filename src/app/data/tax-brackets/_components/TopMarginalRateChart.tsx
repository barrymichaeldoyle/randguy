"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { excali } from "@/fonts";
import { taxBracketsHistory } from "@/lib/historical-data";

export default function TopMarginalRateChart() {
  // Prepare data for top marginal rate over time
  const topRateData = useMemo(() => {
    return taxBracketsHistory.map((year) => ({
      year: year.year,
      topRate: year.brackets[year.brackets.length - 1].rate,
    }));
  }, []);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
      <h2 className={`${excali.className} text-2xl mb-6`}>
        Top Marginal Tax Rate Over Time
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        The highest tax rate applied to top earners.
      </p>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={topRateData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="year"
              stroke="#6b7280"
              style={{ fontSize: "12px" }}
              angle={-45}
              textAnchor="end"
              height={100}
            />
            <YAxis
              stroke="#6b7280"
              style={{ fontSize: "12px" }}
              domain={[0, 50]}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
              formatter={(value: number) => [`${value}%`, "Top Rate"]}
            />
            <Bar dataKey="topRate" fill="#eab308" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
