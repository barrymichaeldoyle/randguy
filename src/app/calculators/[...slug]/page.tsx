import { notFound } from 'next/navigation';

// This catch-all route will trigger the calculators/not-found.tsx page
// for any non-existent calculator routes
export default function CatchAllCalculators() {
  notFound();
}
