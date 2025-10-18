"use client";

import { useMemo } from "react";
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
import { taxBracketsHistory } from "@/lib/historical-data";

export default function TaxThresholdChart() {
  // Prepare data for tax threshold chart (how thresholds have changed)
  const thresholdData = useMemo(() => {
    return taxBracketsHistory.map((year) => ({
      year: year.year,
      firstBracket: year.brackets[0].max || 0,
      secondBracket: year.brackets[1].max || 0,
      thirdBracket: year.brackets[2].max || 0,
      primaryRebate: year.rebates.primary,
    }));
  }, []);

  // Format number as currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
      <h2 className={`${excali.className} text-2xl mb-6`}>
        Tax Threshold Evolution
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        How the upper limits of the first three tax brackets have changed over
        time.
      </p>
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={thresholdData}
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
              tickFormatter={(value) => `R${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
              formatter={(value: number) => formatCurrency(value)}
            />
            <Legend wrapperStyle={{ paddingTop: "20px" }} />
            <Line
              type="monotone"
              dataKey="firstBracket"
              name="1st Bracket"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
            <Line
              type="monotone"
              dataKey="secondBracket"
              name="2nd Bracket"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
            <Line
              type="monotone"
              dataKey="thirdBracket"
              name="3rd Bracket"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
