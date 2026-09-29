'use client';

import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    YT?: { ready: (cb: () => void) => void; Player: new (el: HTMLElement, opts: object) => unknown };
  }
}

interface FeatureVideoProps {
  videoId: string;
  title: string;
  start?: number;
  hideControls?: boolean;
  // 16:9 layout for long-form horizontal videos. Default stays the 9:16 Shorts layout.
  wide?: boolean;
  onPlay?: () => void;
}

// Safari (Mac and iPhone) and most mobile browsers don't carry the facade click
// into a freshly created iframe, so ?autoplay=1 alone leaves a second YouTube
// play button. There, load YouTube's player API on click and start playback
// from its onReady instead. Same approach as paulirish/lite-youtube-embed.
function needsPlayerApi() {
  return navigator.vendor.includes('Apple') || navigator.userAgent.includes('Mobi');
}

let playerApi: Promise<void> | undefined;
function loadPlayerApi(): Promise<void> {
  playerApi ??= new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    script.async = true;
    script.onload = () => window.YT!.ready(resolve);
    script.onerror = () => { playerApi = undefined; reject(); };
    document.head.appendChild(script);
  });
  return playerApi;
}

export default function FeatureVideo({ videoId, title, start, hideControls, wide, onPlay }: FeatureVideoProps) {
  const [mode, setMode] = useState<'facade' | 'iframe' | 'api'>('facade');
  const [thumbFallback, setThumbFallback] = useState(false);
  const apiMount = useRef<HTMLDivElement>(null);

  const thumbUrl = thumbFallback
    ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
    : `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
  const embedSrc = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1${hideControls ? '&controls=0' : ''}${start ? `&start=${start}` : ''}`;

  useEffect(() => {
    if (mode !== 'api') return;
    let cancelled = false;
    loadPlayerApi().then(
      () => {
        if (cancelled || !apiMount.current) return;
        // YouTube replaces this element with its iframe, so give it one React doesn't own.
        const el = document.createElement('div');
        apiMount.current.appendChild(el);
        new window.YT!.Player(el, {
          host: 'https://www.youtube-nocookie.com',
          videoId,
          playerVars: {
            autoplay: 1, playsinline: 1, rel: 0, modestbranding: 1,
            ...(hideControls && { controls: 0 }),
            ...(start && { start }),
          },
          events: { onReady: (e: { target: { playVideo: () => void } }) => e.target.playVideo() },
        });
      },
      // API script blocked (ad blocker, school filter): fall back to the plain embed.
      () => { if (!cancelled) setMode('iframe'); }
    );
    return () => { cancelled = true; };
  }, [mode, videoId, hideControls, start]);

  function play() {
    if (mode !== 'facade') return;
    onPlay?.();
    setMode(needsPlayerApi() ? 'api' : 'iframe');
  }

  return (
    <div
      className={wide ? 'video-frame-wrap video-frame-wrap--wide' : 'video-frame-wrap'}
      style={wide ? { maxWidth: 860, margin: '0 auto' } : { maxWidth: 360, marginBottom: 80 }}
    >
      {mode === 'iframe' ? (
        <iframe
          src={embedSrc}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <>
          <button className="feature-video-facade" onClick={play} aria-label={`Play ${title}`}>
            <img
              src={thumbUrl}
              alt={title}
              loading={wide ? 'lazy' : undefined}
              onError={() => setThumbFallback(true)}
            />
            <span className="feature-video-play">▶</span>
          </button>
          {/* The player's iframe lands here and covers the thumbnail once it loads. */}
          {mode === 'api' && <div ref={apiMount} />}
        </>
      )}
    </div>
  );
}
