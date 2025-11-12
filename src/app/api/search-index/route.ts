import { NextResponse } from 'next/server';

import { getSearchIndex } from '@/lib/search';

export const revalidate = 3600;

export async function GET() {
  const index = await getSearchIndex();
  return NextResponse.json(index, {
    headers: {
      'cache-control': `public, s-maxage=${revalidate}, stale-while-revalidate=${revalidate}`,
    },
  });
}

