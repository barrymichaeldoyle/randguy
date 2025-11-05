import fs from 'fs';
import path from 'path';

import { BASE_URL, contactEmail } from '@/lib/constants';
import { getAllPosts } from '@/lib/posts';

// Convert markdown/MDX to HTML for RSS feed
function markdownToHTML(content: string): string {
  // Remove metadata export block
  let html = content
    .replace(/^export const metadata = \{[\s\S]*?\};?\s*/m, '')
    .trim();

  // Process line by line to handle block elements correctly
  const lines = html.split('\n');
  const processed: string[] = [];
  let inCodeBlock = false;
  let inList = false;
  let listType: 'ul' | 'ol' | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Skip empty lines (they'll become paragraph breaks)
    if (!line) {
      if (inList) {
        processed.push(`</${listType}>`);
        inList = false;
        listType = null;
      }
      processed.push('');
      continue;
    }

    // Code blocks
    if (line.startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      if (inCodeBlock) {
        processed.push('<pre><code>');
      } else {
        processed.push('</code></pre>');
      }
      continue;
    }

    if (inCodeBlock) {
      // Inside code block, preserve as-is
      processed.push(line);
      continue;
    }

    // Headings
    if (line.startsWith('### ')) {
      processed.push(`<h3>${line.substring(4)}</h3>`);
      continue;
    }
    if (line.startsWith('## ')) {
      processed.push(`<h2>${line.substring(3)}</h2>`);
      continue;
    }
    if (line.startsWith('# ')) {
      processed.push(`<h1>${line.substring(2)}</h1>`);
      continue;
    }

    // Blockquotes
    if (line.startsWith('> ')) {
      processed.push(
        `<blockquote>${processInlineMarkdown(line.substring(2))}</blockquote>`
      );
      continue;
    }

    // Lists
    if (line.match(/^[-*] /)) {
      if (!inList || listType !== 'ul') {
        if (inList && listType === 'ol') {
          processed.push('</ol>');
        }
        processed.push('<ul>');
        inList = true;
        listType = 'ul';
      }
      processed.push(`<li>${processInlineMarkdown(line.substring(2))}</li>`);
      continue;
    }

    if (line.match(/^\d+\. /)) {
      if (!inList || listType !== 'ol') {
        if (inList && listType === 'ul') {
          processed.push('</ul>');
        }
        processed.push('<ol>');
        inList = true;
        listType = 'ol';
      }
      const match = line.match(/^\d+\. (.*)$/);
      if (match) {
        processed.push(`<li>${processInlineMarkdown(match[1])}</li>`);
      }
      continue;
    }

    // Close list if we hit a non-list line
    if (inList) {
      processed.push(`</${listType}>`);
      inList = false;
      listType = null;
    }

    // Regular paragraph
    processed.push(`<p>${processInlineMarkdown(line)}</p>`);
  }

  // Close any open list
  if (inList && listType) {
    processed.push(`</${listType}>`);
  }

  return processed.join('\n');
}

// Process inline markdown (bold, italic, links, code)
function processInlineMarkdown(text: string): string {
  // Escape HTML first
  text = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Inline code (must be before other formatting)
  text = text.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Links (must be before bold/italic to avoid conflicts)
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // Bold (must be before italic)
  text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/__([^_]+)__/g, '<strong>$1</strong>');

  // Italic
  text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  text = text.replace(/_([^_]+)_/g, '<em>$1</em>');

  return text;
}

// Get full post content for RSS
async function getPostContent(slug: string): Promise<string> {
  const filePath = path.join(
    process.cwd(),
    'src/app/blog/posts',
    `${slug}.mdx`
  );
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  return markdownToHTML(fileContent);
}

export async function GET() {
  const posts = await getAllPosts();

  // Get full content for each post
  const postsWithContent = await Promise.all(
    posts.map(async (post) => ({
      ...post,
      content: await getPostContent(post.slug),
    }))
  );

  // Format date to RFC 822 format for RSS
  function formatRSSDate(dateString: string): string {
    const date = new Date(dateString);
    // Set to SAST timezone (UTC+2) - use noon
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const rssDate = new Date(`${year}-${month}-${day}T12:00:00+02:00`);
    return rssDate.toUTCString();
  }

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Rand Guy Blog</title>
    <link>${BASE_URL}/blog</link>
    <description>South African personal finance blog: investing, tax, TFSAs, ETFs, and money tips to build wealth in SA.</description>
    <image>
      <url>${BASE_URL}/RandGuyLogo.png</url>
      <title>Rand Guy</title>
      <link>${BASE_URL}/blog</link>
    </image>
    <language>en-ZA</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    <webMaster>${contactEmail} (Rand Guy)</webMaster>
    <managingEditor>${contactEmail} (Rand Guy)</managingEditor>
    <generator>Next.js</generator>
    ${postsWithContent
      .map(
        (post) => `    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${BASE_URL}/blog/${post.slug}</link>
      <guid isPermaLink="true">${BASE_URL}/blog/${post.slug}</guid>
      <description><![CDATA[${post.description}]]></description>
      <content:encoded><![CDATA[${post.content}]]></content:encoded>
      <pubDate>${formatRSSDate(post.date)}</pubDate>
      <category>Personal Finance</category>
      <category>South Africa</category>
    </item>`
      )
      .join('\n')}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
