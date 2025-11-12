import { cache } from 'react';

import { CALCULATORS, DATASETS } from '@/lib/site-data';
import { getAllPosts } from '@/lib/posts';

export type SearchCategory = 'blog' | 'calculator' | 'data';

export interface SearchRecord {
  id: string;
  title: string;
  description: string;
  href: string;
  category: SearchCategory;
  date?: string;
  tags?: string[];
}

async function buildSearchIndex(): Promise<SearchRecord[]> {
  const posts = await getAllPosts();

  const blogItems: SearchRecord[] = posts.map((post) => ({
    id: `blog-${post.slug}`,
    title: post.title,
    description: post.description,
    href: `/blog/${post.slug}`,
    category: 'blog',
    date: post.date,
    tags: ['Blog'],
  }));

  const calculatorItems: SearchRecord[] = CALCULATORS.map((calculator) => ({
    id: `calculator-${calculator.href}`,
    title: calculator.title,
    description: calculator.description,
    href: calculator.href,
    category: 'calculator',
    tags: ['Calculator'],
  }));

  const datasetItems: SearchRecord[] = DATASETS.map((dataset) => ({
    id: `data-${dataset.href}`,
    title: dataset.title,
    description: dataset.description,
    href: dataset.href,
    category: 'data',
    tags: ['Data'],
  }));

  return [...blogItems, ...calculatorItems, ...datasetItems];
}

export const getSearchIndex = cache(buildSearchIndex);

