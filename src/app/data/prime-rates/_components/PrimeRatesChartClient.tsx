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

type ChartDataPoint = {
  date: number;
  primeRate: number;
  repoRate: number;
  fullDate: string;
};

type PrimeRatesChartClientProps = {
  chartData: ChartDataPoint[];
};

export default function PrimeRatesChartClient({
  chartData,
}: PrimeRatesChartClientProps) {
  const [hoveredPoint, setHoveredPoint] = useState<{
    date: string;
    rate: number;
  } | null>(null);

  return (
    <>
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
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
              domain={[0, 20]}
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
              stroke="#eab308"
              strokeWidth={2}
              dot={{ fill: '#eab308', r: 4 }}
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
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600">Highlighted Point:</div>
          <div className="text-lg font-semibold">
            {hoveredPoint.date}: {hoveredPoint.rate}%
          </div>
        </div>
      )}
    </>
  );
}
