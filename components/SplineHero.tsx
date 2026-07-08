'use client';
import { useEffect, useRef, useState } from 'react';

const PARTICLE_COUNT = 90;
const PARTICLE_COUNT_MOBILE = 45;
const MAX_DIST = 160;
const MOUNT_DELAY_MS = 800;

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  r: number; color: string;
}

const palette = ['rgba(240,235,226,', 'rgba(249,115,22,', 'rgba(129,140,248,'];
const weights  = [0.70, 0.18, 0.12];

function pickColor() {
  const r = Math.random();
  let acc = 0;
  for (let i = 0; i < weights.length; i++) {
    acc += weights[i];
    if (r < acc) return palette[i];
  }
  return palette[0];
}

export default function HeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  // Defer starting the animation so it doesn't compete with LCP/TBT on first paint
  useEffect(() => {
    const t = setTimeout(() => setReady(true), MOUNT_DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const canvas = canvasRef.current as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    if (!ctx) return;

    let animId: number;
    let W = 0, H = 0;
    let particles: Particle[] = [];

    function spawn(w: number, h: number): Particle[] {
      const count = w < 768 ? PARTICLE_COUNT_MOBILE : PARTICLE_COUNT;
      return Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.18,
        r: 1.2 + Math.random() * 1.4,
        color: pickColor(),
      }));
    }

    function resize() {
      // On mobile, absolutely-positioned parents report 0 — use window dimensions
      W = window.innerWidth;
      H = window.innerHeight;
      const dpr = Math.min(devicePixelRatio, 2);
      canvas.width  = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width  = W + 'px';
      canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = spawn(W, H);
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(200,195,185,${(1 - dist / MAX_DIST) * 0.18})`;
            ctx.lineWidth = 0.7;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      for (const p of particles) {
        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 5);
        grd.addColorStop(0, p.color + '0.25)');
        grd.addColorStop(1, p.color + '0)');
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 5, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + '0.85)';
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -10) p.x = W + 10;
        if (p.x > W + 10) p.x = -10;
        if (p.y < -10) p.y = H + 10;
        if (p.y > H + 10) p.y = -10;
      }

      animId = requestAnimationFrame(draw);
    }

    resize();
    draw();
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, [ready]);

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      />
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '80%',
        background: 'linear-gradient(to bottom, transparent 0%, rgba(14,14,13,0.5) 50%, rgba(14,14,13,0.92) 75%, #0e0e0d 100%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '18%',
        background: '#0e0e0d', pointerEvents: 'none',
      }} />
    </>
  );
}
