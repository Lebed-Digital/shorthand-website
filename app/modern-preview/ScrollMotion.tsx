'use client';

import { useEffect, useRef } from 'react';

export default function ScrollMotion({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const animations = new Set<Animation>();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        if (media.matches) continue;
        const animation = entry.target.animate([
          { opacity: 0, transform: 'translateY(36px)' },
          { opacity: 1, transform: 'translateY(0)' },
        ], { duration: 850, easing: 'cubic-bezier(.22,1,.36,1)' });
        animations.add(animation);
        animation.onfinish = () => animations.delete(animation);
      }
    }, { threshold: 0.08 });
    root.current?.querySelectorAll('[data-reveal]').forEach((element) => observer.observe(element));
    const stop = () => { if (media.matches) animations.forEach((animation) => animation.cancel()); };
    media.addEventListener('change', stop);
    return () => {
      observer.disconnect();
      animations.forEach((animation) => animation.cancel());
      media.removeEventListener('change', stop);
    };
  }, []);

  return <div ref={root}>{children}</div>;
}
