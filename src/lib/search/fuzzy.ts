import Fuse from 'fuse.js';

import type { SearchRecord } from '@/lib/search';

export const fuseOptions: Fuse.IFuseOptions<SearchRecord> = {
  keys: [
    { name: 'title', weight: 0.6 },
    { name: 'description', weight: 0.3 },
    { name: 'tags', weight: 0.1 },
  ],
  threshold: 0.35,
  includeMatches: true,
  ignoreLocation: true,
  minMatchCharLength: 2,
};

export interface SearchResult {
  record: SearchRecord;
  matches: Fuse.FuseResultMatch[];
  score: number;
}

export function performSearch(
  records: SearchRecord[],
  query: string,
  limit?: number
): SearchResult[] {
  const trimmed = query.trim();

  if (!trimmed) {
    return records.slice(0, limit ?? records.length).map((record) => ({
      record,
      matches: [],
      score: 0,
    }));
  }

  const fuse = new Fuse(records, fuseOptions);
  const results = fuse.search(trimmed, { limit });

  return results.map((result) => ({
    record: result.item,
    matches: result.matches ?? [],
    score: result.score ?? 0,
  }));
}

export function groupResults(results: SearchResult[]) {
  return results.reduce<Record<string, SearchResult[]>>((acc, result) => {
    const key = result.record.category;
    if (!acc[key]) {
      acc[key] = [];
    }

    acc[key].push(result);
    return acc;
  }, {});
}

