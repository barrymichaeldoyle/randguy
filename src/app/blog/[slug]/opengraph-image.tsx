import { ImageResponse } from 'next/og';
import { readFileSync } from 'fs';
import { join } from 'path';
import { ogConfig, ogStyles } from '@/lib/og-image-utils';

export const alt = 'Rand Guy Blog Post';
export const size = ogConfig.size;
export const contentType = ogConfig.contentType;

interface BlogPostMetadata {
  title: string;
  date: string;
  description: string;
}

async function getPost(slug: string) {
  try {
    const post = await import(`@/app/blog/posts/${slug}.mdx`);
    return {
      metadata: post.metadata as BlogPostMetadata,
    };
  } catch (_e) {
    return null;
  }
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    // Fallback if post not found
    return new ImageResponse(
      (
        <div style={ogStyles.container}>
          <div style={ogStyles.title}>Post Not Found</div>
        </div>
      ),
      {
        ...size,
      }
    );
  }

  // Load the logo image and convert to base64
  const logoPath = join(process.cwd(), 'public', 'RandGuyLogoWithText.png');
  const logoBuffer = readFileSync(logoPath);
  const logoBase64 = logoBuffer.toString('base64');
  const logoSrc = `data:image/png;base64,${logoBase64}`;

  // Format date
  const formattedDate = new Date(post.metadata.date).toLocaleDateString(
    'en-ZA',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
  );

  return new ImageResponse(
    (
      <div style={ogStyles.container}>
        {/* Header with logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginTop: -40,
            marginBottom: -40,
          }}
        >
          <img src={logoSrc} alt="Rand Guy" width={200} />
        </div>

        {/* Main content area */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            maxWidth: '1000px',
            textAlign: 'center',
          }}
        >
          {/* Blog post badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 24,
              justifyContent: 'center',
            }}
          >
            <div style={{ fontSize: 32 }}>📚</div>
            <div
              style={{
                fontSize: 24,
                fontWeight: 'bold',
                color: '#15803d',
              }}
            >
              Blog Post
            </div>
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: 56,
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: 20,
              lineHeight: 1.2,
            }}
          >
            {post.metadata.title}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              ...ogStyles.footer,
              marginTop: 0,
            }}
          >
            Free financial advice for South Africans 🇿🇦
          </div>
          <div style={{ ...ogStyles.footer, marginTop: 0 }}>randguy.com</div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
