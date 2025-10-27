import { ImageResponse } from 'next/og';
import { PRIME_LENDING_RATE_ZA } from '@/lib/historical-data';

export const runtime = 'edge';
export const alt = 'Historical Prime & Repo Rates - South Africa';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  // Calculate statistics (same logic as the page)
  const rates = PRIME_LENDING_RATE_ZA.map((d) => d.rate);
  const currentRate = rates[0];
  const avgRate = rates.reduce((a, b) => a + b, 0) / rates.length;
  const maxRate = Math.max(...rates);
  const minRate = Math.min(...rates);

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px',
        }}
      >
        {/* Title */}
        <div
          style={{
            fontSize: 64,
            fontWeight: 'bold',
            color: '#1f2937',
            marginBottom: 20,
            textAlign: 'center',
            display: 'flex',
          }}
        >
          Prime & Repo Rates
        </div>
        <div
          style={{
            fontSize: 28,
            color: '#4b5563',
            marginBottom: 50,
            textAlign: 'center',
            display: 'flex',
          }}
        >
          Historical Data for South Africa (Since 2002)
        </div>

        {/* Statistics Cards */}
        <div
          style={{
            display: 'flex',
            gap: 20,
            width: '100%',
            justifyContent: 'center',
          }}
        >
          {/* Current Rate */}
          <div
            style={{
              background: '#fef9c3',
              border: '2px solid #fde047',
              borderRadius: 12,
              padding: '24px',
              width: 240,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                fontSize: 18,
                color: '#4b5563',
                marginBottom: 8,
                display: 'flex',
              }}
            >
              Current Prime
            </div>
            <div
              style={{
                fontSize: 56,
                fontWeight: 'bold',
                color: '#1f2937',
                display: 'flex',
              }}
            >
              {currentRate}%
            </div>
          </div>

          {/* Average Rate */}
          <div
            style={{
              background: '#f9fafb',
              border: '2px solid #e5e7eb',
              borderRadius: 12,
              padding: '24px',
              width: 240,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                fontSize: 18,
                color: '#4b5563',
                marginBottom: 8,
                display: 'flex',
              }}
            >
              Average
            </div>
            <div
              style={{
                fontSize: 56,
                fontWeight: 'bold',
                color: '#1f2937',
                display: 'flex',
              }}
            >
              {avgRate.toFixed(2)}%
            </div>
          </div>

          {/* Highest Rate */}
          <div
            style={{
              background: '#fee2e2',
              border: '2px solid #fecaca',
              borderRadius: 12,
              padding: '24px',
              width: 240,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                fontSize: 18,
                color: '#4b5563',
                marginBottom: 8,
                display: 'flex',
              }}
            >
              Highest
            </div>
            <div
              style={{
                fontSize: 56,
                fontWeight: 'bold',
                color: '#1f2937',
                display: 'flex',
              }}
            >
              {maxRate}%
            </div>
          </div>

          {/* Lowest Rate */}
          <div
            style={{
              background: '#dcfce7',
              border: '2px solid #bbf7d0',
              borderRadius: 12,
              padding: '24px',
              width: 240,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                fontSize: 18,
                color: '#4b5563',
                marginBottom: 8,
                display: 'flex',
              }}
            >
              Lowest
            </div>
            <div
              style={{
                fontSize: 56,
                fontWeight: 'bold',
                color: '#1f2937',
                display: 'flex',
              }}
            >
              {minRate}%
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            fontSize: 20,
            color: '#6b7280',
            marginTop: 40,
            textAlign: 'center',
            display: 'flex',
          }}
        >
          randguy.com • Making Cents of SA Finance
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
