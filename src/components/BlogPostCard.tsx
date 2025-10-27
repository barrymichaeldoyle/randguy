import { Button } from '@/components/Button';
import { excali } from '@/fonts';
import { BlogPost } from '@/lib/posts';

interface BlogPostCardProps {
  post: BlogPost;
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <article className="border border-gray-200 rounded-lg p-6 shadow-sm transition-shadow">
      <h2
        className={`${excali.className} text-2xl font-bold mb-2 text-gray-900`}
      >
        {post.title}
      </h2>
      <div className="flex items-center gap-3 mb-3">
        <time className="text-sm text-gray-500">
          {new Date(post.date).toLocaleDateString('en-ZA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </time>
        <span className="text-gray-300">•</span>
        <span className="text-sm text-gray-500">
          {post.readingTime} min read
        </span>
      </div>
      <p className="text-gray-700 mb-4">{post.description}</p>
      <div className="flex justify-end">
        <Button href={`/blog/${post.slug}`} variant="primary" size="md">
          Read Article →
        </Button>
      </div>
    </article>
  );
}
