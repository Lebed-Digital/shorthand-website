'use client';

import { useState } from 'react';

interface FeatureVideoProps {
  videoId: string;
  title: string;
  start?: number;
  hideControls?: boolean;
}

export default function FeatureVideo({ videoId, title, start, hideControls }: FeatureVideoProps) {
  const [playing, setPlaying] = useState(false);

  const thumbUrl = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
  const embedSrc = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1${hideControls ? '&controls=0' : ''}${start ? `&start=${start}` : ''}`;

  return (
    <div className="video-frame-wrap" style={{ maxWidth: 360, marginBottom: 80 }}>
      {playing ? (
        <iframe
          src={embedSrc}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button className="feature-video-facade" onClick={() => setPlaying(true)} aria-label={`Play ${title}`}>
          <img src={thumbUrl} alt={title} />
          <span className="feature-video-play">▶</span>
        </button>
      )}
    </div>
  );
}
