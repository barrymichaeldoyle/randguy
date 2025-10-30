import { notFound } from 'next/navigation';

// This catch-all route will trigger the data/not-found.tsx page
// for any non-existent data routes
export default function CatchAllData() {
  notFound();
}
