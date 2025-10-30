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

type ChartDataPoint = {
  year: number;
  inflationRate: number;
  cpiIndex: number;
};

type CPIChartClientProps = {
  chartData: ChartDataPoint[];
};

export default function CPIChartClient({ chartData }: CPIChartClientProps) {
  const [hoveredPoint, setHoveredPoint] = useState<{
    year: number;
    inflationRate: number;
  } | null>(null);

  // Sort data by year ascending for proper chart display
  const sortedData = [...chartData].sort((a, b) => a.year - b.year);

  return (
    <>
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={sortedData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            onMouseMove={(e: any) => {
              if (e.activePayload && e.activePayload.length > 0) {
                setHoveredPoint({
                  year: e.activePayload[0].payload.year,
                  inflationRate: e.activePayload[0].payload.inflationRate,
                });
              }
            }}
            onMouseLeave={() => setHoveredPoint(null)}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="year"
              type="number"
              domain={['dataMin', 'dataMax']}
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => value.toString()}
            />
            <YAxis
              yAxisId="left"
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
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#9333ea"
              style={{ fontSize: '12px' }}
              label={{
                value: 'CPI Index',
                angle: 90,
                position: 'insideRight',
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
              formatter={(value: number, name: string) => {
                if (name === 'Inflation Rate') {
                  return [`${value}%`, name];
                }
                return [value, name];
              }}
              labelFormatter={(year: number) => `Year: ${year}`}
            />
            <Legend />
            {/* SARB Target Range - 3% to 6% shaded area */}
            <ReferenceArea
              yAxisId="left"
              y1={3}
              y2={6}
              fill="#22c55e"
              fillOpacity={0.15}
              label={{
                value: 'SARB Target Range',
                position: 'insideBottomRight',
                fill: '#16a34a',
                fontSize: 12,
                fontWeight: 600,
              }}
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="inflationRate"
              name="Inflation Rate"
              stroke="#eab308"
              strokeWidth={3}
              dot={{ fill: '#eab308', r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="cpiIndex"
              name="CPI Index"
              stroke="#9333ea"
              strokeWidth={2}
              dot={{ fill: '#9333ea', r: 3 }}
              activeDot={{ r: 5 }}
              strokeDasharray="5 5"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* SARB Target Range Info */}
      <div className="mt-4 rounded-lg bg-green-50 p-4">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 bg-green-500"></div>
          <span className="text-sm font-semibold text-green-900">
            SARB Target Range: 3% - 6%
          </span>
        </div>
        <p className="mt-2 text-xs text-green-800">
          The shaded green area on the chart shows the South African Reserve
          Bank&apos;s target range for inflation. When the yellow line is within
          this band, inflation is considered healthy and stable.
        </p>
      </div>

      {hoveredPoint && (
        <div className="mt-4 rounded-lg bg-gray-50 p-4">
          <div className="text-sm text-gray-600">Highlighted Point:</div>
          <div className="text-lg font-semibold">
            {hoveredPoint.year}: {hoveredPoint.inflationRate}% inflation
          </div>
        </div>
      )}
    </>
  );
}
