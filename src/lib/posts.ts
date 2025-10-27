import fs from 'fs';
import path from 'path';

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  description: string;
  readingTime: number;
}

// Calculate reading time (average reading speed: 200 words per minute)
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  // Remove MDX/JSX syntax, code blocks, and special characters for accurate word count
  const text = content
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/<[^>]*>/g, '') // Remove HTML/JSX tags
    .replace(/[#*_~`]/g, '') // Remove markdown formatting
    .trim();

  const words = text.split(/\s+/).filter((word) => word.length > 0).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return minutes;
}

export async function getAllPosts(): Promise<BlogPost[]> {
  const postsDirectory = path.join(process.cwd(), 'src/app/blog/posts');
  const filenames = fs.readdirSync(postsDirectory);

  const posts = await Promise.all(
    filenames
      .filter((filename) => filename.endsWith('.mdx'))
      .map(async (filename) => {
        const slug = filename.replace(/\.mdx$/, '');
        const filePath = path.join(postsDirectory, filename);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const post = await import(`@/app/blog/posts/${slug}.mdx`);

        return {
          slug,
          title: post.metadata.title,
          date: post.metadata.date,
          description: post.metadata.description,
          readingTime: calculateReadingTime(fileContent),
        };
      })
  );

  // Sort posts by date, newest first
  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}
