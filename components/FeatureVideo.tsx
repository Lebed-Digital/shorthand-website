'use client';

import { useState } from 'react';

interface FeatureVideoProps {
  videoId: string;
  title: string;
  start?: number;
  hideControls?: boolean;
  // 16:9 layout for long-form horizontal videos. Default stays the 9:16 Shorts layout.
  wide?: boolean;
  onPlay?: () => void;
}

export default function FeatureVideo({ videoId, title, start, hideControls, wide, onPlay }: FeatureVideoProps) {
  const [playing, setPlaying] = useState(false);
  const [thumbFallback, setThumbFallback] = useState(false);

  const thumbUrl = thumbFallback
    ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
    : `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
  const embedSrc = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1${hideControls ? '&controls=0' : ''}${start ? `&start=${start}` : ''}`;

  return (
    <div
      className={wide ? 'video-frame-wrap video-frame-wrap--wide' : 'video-frame-wrap'}
      style={wide ? { maxWidth: 860, margin: '0 auto' } : { maxWidth: 360, marginBottom: 80 }}
    >
      {playing ? (
        <iframe
          src={embedSrc}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          className="feature-video-facade"
          onClick={() => { setPlaying(true); onPlay?.(); }}
          aria-label={`Play ${title}`}
        >
          <img
            src={thumbUrl}
            alt={title}
            loading={wide ? 'lazy' : undefined}
            onError={() => setThumbFallback(true)}
          />
          <span className="feature-video-play">▶</span>
        </button>
      )}
    </div>
  );
}
