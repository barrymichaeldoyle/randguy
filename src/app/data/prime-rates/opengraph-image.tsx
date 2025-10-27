import { ImageResponse } from 'next/og';
import { readFileSync } from 'fs';
import { join } from 'path';
import { PRIME_LENDING_RATE_ZA } from '@/lib/historical-data';
import { ogStyles, ogConfig } from '@/lib/og-image-utils';

export const alt = 'Historical Prime & Repo Rates - South Africa';
export const size = ogConfig.size;
export const contentType = ogConfig.contentType;

export default async function Image() {
  // Calculate statistics (same logic as the page)
  const rates = PRIME_LENDING_RATE_ZA.map((d) => d.rate);
  const currentRate = rates[0];
  const avgRate = rates.reduce((a, b) => a + b, 0) / rates.length;
  const maxRate = Math.max(...rates);
  const minRate = Math.min(...rates);

  // Load the logo image and convert to base64
  const logoPath = join(process.cwd(), 'public', 'PrimeAndRepoRates.png');
  const logoBuffer = readFileSync(logoPath);
  const logoBase64 = logoBuffer.toString('base64');
  const logoSrc = `data:image/png;base64,${logoBase64}`;

  return new ImageResponse(
    (
      <div style={ogStyles.container}>
        {/* Logo with text */}
        <img
          src={logoSrc}
          alt="Prime & Repo Rates"
          width={400}
          style={{
            marginTop: -60,
            marginBottom: -20,
            display: 'flex',
          }}
        />

        <div style={{ ...ogStyles.subtitle, fontSize: 20, marginBottom: 30 }}>
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
              background: '#ffffff',
              border: '2px solid #d1d5db',
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
              background: '#dbeafe',
              border: '2px solid #93c5fd',
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
                color: '#1e3a8a',
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
                color: '#1e40af',
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
        <div style={ogStyles.footer}>
          randguy.com • Making Cents of SA Finance
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
