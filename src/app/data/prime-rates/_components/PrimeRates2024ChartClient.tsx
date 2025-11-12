'use client';

import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

import { PRIME_LENDING_RATE_ZA, REPO_RATE_ZA } from '@/lib/historical-data';
import { useIsMounted } from '@/lib/use-is-mounted';

// Filter data from 2024-01-01 onwards
const dataFrom2024 = PRIME_LENDING_RATE_ZA.filter(
  (item) => item.date >= '2024-01-01'
);

// Prepare and sort chart data at module level
const sortedPrime = [...dataFrom2024].sort(
  (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
);

// Get corresponding repo rates for the filtered dates
const sortedRepo = sortedPrime.map((primeItem) => {
  const repoItem = REPO_RATE_ZA.find((r) => r.date === primeItem.date);
  return {
    date: primeItem.date,
    rate: repoItem ? repoItem.rate : primeItem.rate - 3.5,
  };
});

const chartData = sortedPrime.map((item, index) => ({
  date: new Date(item.date).getTime(),
  primeRate: item.rate,
  repoRate: sortedRepo[index].rate,
  fullDate: new Date(item.date).toLocaleDateString('en-ZA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }),
}));

export function PrimeRates2024ChartClient() {
  const [hoveredPoint, setHoveredPoint] = useState<{
    date: string;
    rate: number;
  } | null>(null);
  const isMounted = useIsMounted();

  if (!isMounted) {
    return (
      <div className="flex h-96 min-w-0 items-center justify-center">
        <div className="text-gray-500">Loading chart...</div>
      </div>
    );
  }

  return (
    <>
      <div className="h-96 min-w-0">
        <ResponsiveContainer
          width="100%"
          height="100%"
          minWidth={1}
          minHeight={1}
        >
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
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
              domain={['dataMin', 'dataMax']}
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
              tickFormatter={(timestamp) => {
                const date = new Date(timestamp);
                return date.toLocaleDateString('en-ZA', {
                  year: 'numeric',
                  month: 'short',
                });
              }}
              scale="time"
            />
            <YAxis
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
              label={{
                value: 'Rate (%)',
                angle: -90,
                position: 'insideLeft',
              }}
              domain={['dataMin - 0.5', 'dataMax + 0.5']}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
              formatter={(value: number, name: string) => [`${value}%`, name]}
              labelFormatter={(timestamp: number) => {
                const point = chartData.find((d) => d.date === timestamp);
                return point
                  ? point.fullDate
                  : new Date(timestamp).toLocaleDateString('en-ZA');
              }}
            />
            <Legend />
            <Line
              type="stepAfter"
              dataKey="primeRate"
              name="Prime Rate"
              stroke="#d97706"
              strokeWidth={2}
              dot={{ fill: '#d97706', r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="stepAfter"
              dataKey="repoRate"
              name="Repo Rate"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: '#3b82f6', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {hoveredPoint && (
        <div className="mt-4 rounded-lg bg-gray-50 p-4">
          <div className="text-sm text-gray-600">Highlighted Point:</div>
          <div className="text-lg font-semibold">
            {hoveredPoint.date}: {hoveredPoint.rate}%
          </div>
        </div>
      )}
    </>
  );
}
