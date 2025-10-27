import { Assistant } from 'next/font/google';
import localFont from 'next/font/local';

export const excali = localFont({
  src: [
    {
      path: './Excalifont-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-excali',
  display: 'swap',
  preload: true, // Preload since it's used for headings prominently
  fallback: ['cursive', 'Comic Sans MS', 'system-ui'], // Fallback fonts
  adjustFontFallback: false, // Prevents extra CSS generation
});

export const assistant = Assistant({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-assistant',
  fallback: [
    'ui-sans-serif',
    'system-ui',
    'sans-serif',
    'Apple Color Emoji',
    'Segoe UI Emoji',
    'Segoe UI Symbol',
    'Noto Color Emoji',
  ],
});
