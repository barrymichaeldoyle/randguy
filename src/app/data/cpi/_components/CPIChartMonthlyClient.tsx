'use client';

import { useState } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { CPI_MONTHLY_ZA } from '@/lib/historical-data';
import { useIsMounted } from '@/lib/use-is-mounted';

// Prepare and sort monthly chart data at module level
const monthlyChartData = CPI_MONTHLY_ZA.map((item) => {
  const d = new Date(item.date);
  return {
    date: d.getTime(),
    inflationRate: item.inflationRate,
    fullLabel: d.toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'short',
    }),
  };
}).sort((a, b) => a.date - b.date);

export function CPIChartMonthlyClient() {
  const [hoveredPoint, setHoveredPoint] = useState<{
    label: string;
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
          aspect={undefined}
        >
          <LineChart
            data={monthlyChartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            onMouseMove={(e: any) => {
              if (e.activePayload && e.activePayload.length > 0) {
                setHoveredPoint({
                  label: e.activePayload[0].payload.fullLabel,
                  rate: e.activePayload[0].payload.inflationRate,
                });
              }
            }}
            onMouseLeave={() => setHoveredPoint(null)}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              type="number"
              domain={[
                monthlyChartData[0]?.date ?? 'dataMin',
                monthlyChartData[monthlyChartData.length - 1]?.date ??
                  'dataMax',
              ]}
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
              tickFormatter={(timestamp) => {
                const d = new Date(timestamp);
                return d.toLocaleDateString('en-ZA', {
                  month: 'short',
                  year: '2-digit',
                });
              }}
              scale="time"
            />
            <YAxis
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
              label={{
                value: 'Inflation Rate (%)',
                angle: -90,
                position: 'insideLeft',
                style: { textAnchor: 'middle' },
              }}
              domain={[0, 'auto']}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
              formatter={(value: number) => [`${value}%`, 'Inflation Rate']}
              labelFormatter={(timestamp: number) => {
                const d = new Date(timestamp);
                return d.toLocaleDateString('en-ZA', {
                  month: 'short',
                  year: 'numeric',
                });
              }}
            />
            <Legend />
            {/* SARB Target Range - 3% to 6% shaded area */}
            <ReferenceArea
              y1={3}
              y2={6}
              fill="#22c55e"
              fillOpacity={0.15}
              label={{
                value: 'SARB Target Range',
                position: 'insideTopRight',
                fill: '#16a34a',
                fontSize: 12,
                fontWeight: 600,
              }}
            />
            <Line
              type="monotone"
              dataKey="inflationRate"
              name="Inflation Rate"
              stroke="#eab308"
              strokeWidth={3}
              dot={{ fill: '#eab308', r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {hoveredPoint && (
        <div className="mt-4 rounded-lg bg-gray-50 p-4">
          <div className="text-sm text-gray-600">Highlighted Point:</div>
          <div className="text-lg font-semibold">
            {hoveredPoint.label}: {hoveredPoint.rate}%
          </div>
        </div>
      )}
    </>
  );
}
