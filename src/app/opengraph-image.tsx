import { readFileSync } from 'fs';
import { join } from 'path';

import { ImageResponse } from 'next/og';

import { TAGLINE } from '@/lib/constants';
import { ogStyles, ogConfig } from '@/lib/og-image-utils';

export const alt = `Rand Guy - ${TAGLINE}`;
export const size = ogConfig.size;
export const contentType = ogConfig.contentType;

export default async function Image() {
  // Load the logo image and convert to base64
  const logoPath = join(process.cwd(), 'public', 'RandGuyLogoWithText.png');
  const logoBuffer = readFileSync(logoPath);
  const logoBase64 = logoBuffer.toString('base64');
  const logoSrc = `data:image/png;base64,${logoBase64}`;

  return new ImageResponse(
    (
      <div style={ogStyles.container}>
        {/* Logo with text */}
        <img
          src={logoSrc}
          alt="Rand Guy"
          width={300}
          style={{
            marginTop: -60,
            marginBottom: -30,
            display: 'flex',
          }}
        />

        {/* Tagline */}
        <div
          style={{
            ...ogStyles.subtitle,
            fontSize: 32,
            marginBottom: 50,
          }}
        >
          {TAGLINE}
        </div>

        {/* Feature Cards */}
        <div
          style={{
            display: 'flex',
            gap: 20,
            width: '100%',
            justifyContent: 'center',
          }}
        >
          {/* Calculators */}
          <div
            style={{
              background: '#ffffff',
              border: '2px solid #d1d5db',
              borderRadius: 12,
              padding: '20px 32px',
              width: 220,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                fontSize: 48,
                marginBottom: 8,
                display: 'flex',
              }}
            >
              🧮
            </div>
            <div
              style={{
                fontSize: 24,
                fontWeight: 'bold',
                color: '#1f2937',
                display: 'flex',
              }}
            >
              Calculators
            </div>
          </div>

          {/* Data */}
          <div
            style={{
              background: '#dbeafe',
              border: '2px solid #93c5fd',
              borderRadius: 12,
              padding: '20px 32px',
              width: 220,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                fontSize: 48,
                marginBottom: 8,
                display: 'flex',
              }}
            >
              📊
            </div>
            <div
              style={{
                fontSize: 24,
                fontWeight: 'bold',
                color: '#1e40af',
                display: 'flex',
              }}
            >
              Data
            </div>
          </div>

          {/* Guides */}
          <div
            style={{
              background: '#dcfce7',
              border: '2px solid #bbf7d0',
              borderRadius: 12,
              padding: '20px 32px',
              width: 220,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                fontSize: 48,
                marginBottom: 8,
                display: 'flex',
              }}
            >
              📚
            </div>
            <div
              style={{
                fontSize: 24,
                fontWeight: 'bold',
                color: '#15803d',
                display: 'flex',
              }}
            >
              Guides
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            ...ogStyles.footer,
            marginTop: 50,
          }}
        >
          Free financial tools & advice for South Africans 🇿🇦
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
