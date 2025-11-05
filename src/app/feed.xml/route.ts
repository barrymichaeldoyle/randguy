import { BASE_URL, contactEmail } from '@/lib/constants';
import { getAllPosts } from '@/lib/posts';

export async function GET() {
  const posts = await getAllPosts();

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
    ${posts
      .map(
        (post) => `    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${BASE_URL}/blog/${post.slug}</link>
      <guid isPermaLink="true">${BASE_URL}/blog/${post.slug}</guid>
      <description><![CDATA[${post.description}]]></description>
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
