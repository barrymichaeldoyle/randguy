'use client';

import { useEffect, useState } from 'react';

interface YouTubeEmbedProps {
  /** YouTube video ID or full URL (shorts or regular) */
  videoId: string;
  /** Video title for accessibility and SEO */
  title?: string;
  /** Whether this is a YouTube Short (vertical format) */
  isShort?: boolean;
  /** Optional custom width (defaults based on isShort) */
  maxWidth?: string;
}

/**
 * Extracts video ID from various YouTube URL formats
 */
function extractVideoId(urlOrId: string): string {
  // If it's already just an ID, return it
  if (!urlOrId.includes('/') && !urlOrId.includes('?')) {
    return urlOrId;
  }

  // Handle shorts URL: youtube.com/shorts/VIDEO_ID
  const shortsMatch = urlOrId.match(/shorts\/([a-zA-Z0-9_-]+)/);
  if (shortsMatch) {
    return shortsMatch[1];
  }

  // Handle regular YouTube URLs
  const regularMatch = urlOrId.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/
  );
  if (regularMatch) {
    return regularMatch[1];
  }

  // Fallback: assume it's already an ID
  return urlOrId;
}

export function YouTubeEmbed({
  videoId,
  title = 'YouTube video',
  isShort = false,
  maxWidth,
}: YouTubeEmbedProps) {
  const [shouldLoad, setShouldLoad] = useState(false);
  const [embedId] = useState(() => extractVideoId(videoId));

  // Lazy load the iframe when component comes into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoad(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: '50px' }
    );

    const element = document.getElementById(`youtube-${embedId}`);
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [embedId]);

  // Default sizing based on video type
  const containerStyle = {
    maxWidth: maxWidth || (isShort ? '400px' : '100%'),
    margin: '0 auto 2rem',
    aspectRatio: isShort ? '9/16' : '16/9',
  };

  return (
    <div
      id={`youtube-${embedId}`}
      style={{
        position: 'relative',
        ...containerStyle,
      }}
    >
      {shouldLoad ? (
        <iframe
          src={`https://www.youtube.com/embed/${embedId}`}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: 0,
            borderRadius: '12px',
          }}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={title}
          loading="lazy"
        />
      ) : (
        // Placeholder that looks like the video
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: '#000',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
          onClick={() => setShouldLoad(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setShouldLoad(true);
            }
          }}
          tabIndex={0}
          role="button"
          aria-label={`Load ${title}`}
        >
          <svg
            width="68"
            height="48"
            viewBox="0 0 68 48"
            style={{ opacity: 0.8 }}
          >
            <path
              d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.63-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z"
              fill="#f00"
            />
            <path d="M 45,24 27,14 27,34" fill="#fff" />
          </svg>
        </div>
      )}
    </div>
  );
}
