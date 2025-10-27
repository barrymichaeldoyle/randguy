import { CSSProperties } from 'react';

// Common styles for OG images
export const ogStyles = {
  container: {
    background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px',
    fontFamily: 'Comic Sans MS, cursive, system-ui',
  } as CSSProperties,

  title: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 20,
    textAlign: 'center',
    display: 'flex',
  } as CSSProperties,

  subtitle: {
    fontSize: 28,
    color: '#4b5563',
    marginBottom: 50,
    textAlign: 'center',
    display: 'flex',
  } as CSSProperties,

  footer: {
    fontSize: 20,
    color: '#6b7280',
    marginTop: 40,
    textAlign: 'center',
    display: 'flex',
  } as CSSProperties,

  cardContainer: {
    display: 'flex',
    gap: 20,
    width: '100%',
    justifyContent: 'center',
  } as CSSProperties,

  card: {
    borderRadius: 12,
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
  } as CSSProperties,

  cardWhite: {
    background: '#ffffff',
    border: '2px solid #d1d5db',
  } as CSSProperties,

  cardBlue: {
    background: '#dbeafe',
    border: '2px solid #93c5fd',
  } as CSSProperties,

  cardRed: {
    background: '#fee2e2',
    border: '2px solid #fecaca',
  } as CSSProperties,

  cardGreen: {
    background: '#dcfce7',
    border: '2px solid #bbf7d0',
  } as CSSProperties,

  cardYellow: {
    background: '#fef9c3',
    border: '2px solid #fde047',
  } as CSSProperties,

  cardLabel: {
    fontSize: 18,
    marginBottom: 8,
    display: 'flex',
  } as CSSProperties,

  cardValue: {
    fontSize: 56,
    fontWeight: 'bold',
    display: 'flex',
  } as CSSProperties,
};

// Common OG image configuration
export const ogConfig = {
  size: {
    width: 1200,
    height: 630,
  },
  contentType: 'image/png' as const,
};

// Reusable OG Image wrapper component
export const OGContainer = ({ children }: { children: React.ReactNode }) => (
  <div style={ogStyles.container}>{children}</div>
);

// Reusable stat card component
interface StatCardProps {
  label: string;
  value: string | number;
  variant?: 'white' | 'blue' | 'red' | 'green' | 'yellow';
  labelColor?: string;
  valueColor?: string;
  width?: number;
}

export const StatCard = ({
  label,
  value,
  variant = 'white',
  labelColor = '#4b5563',
  valueColor = '#1f2937',
  width,
}: StatCardProps) => {
  const variantStyles = {
    white: ogStyles.cardWhite,
    blue: ogStyles.cardBlue,
    red: ogStyles.cardRed,
    green: ogStyles.cardGreen,
    yellow: ogStyles.cardYellow,
  };

  return (
    <div
      style={{
        ...ogStyles.card,
        ...variantStyles[variant],
        ...(width && { width }),
      }}
    >
      <div
        style={{
          ...ogStyles.cardLabel,
          color: labelColor,
        }}
      >
        {label}
      </div>
      <div
        style={{
          ...ogStyles.cardValue,
          color: valueColor,
        }}
      >
        {value}
      </div>
    </div>
  );
};
