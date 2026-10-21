import { useEffect, useRef } from 'react';

interface Point {
  x: number;
  y: number;
  z: number;
  color: string;
}

const PALETTE = ['#e6b800', '#c9a227', '#8ab4c7', '#6b9ab0', '#5a8a9e'];

// The hub — same idea as the landing page's constellation, scaled down
// into a persistent logo mark. Matches the hero's look now: a few big,
// translucent, overlapping circles that blend into each other, not a
// delicate web of small dots and thin lines.
const HUB: Point = { x: 0, y: 0, z: 0.6, color: '#e6b800' };

const BLOB_COUNT = 9;
const BLOBS: Point[] = Array.from({ length: BLOB_COUNT }, (_, i) => {
  const angle = i * 2.399;
  const r = 0.2 + ((i * 37) % 10) / 10 * 0.7;
  return {
    x: Math.cos(angle) * r,
    y: Math.sin(angle) * r * 0.9,
    z: Math.sin(i * 1.7) * 0.4,
    color: PALETTE[i % PALETTE.length],
  };
});

const POINTS: Point[] = [HUB, ...BLOBS];

interface MiniConstellationProps {
  size?: number;
  /** Extra canvas width to the right of the cluster's own footprint. */
  reach?: number;
}

export default function MiniConstellation({ size = 36, reach = 0 }: MiniConstellationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef(0);
  const width = size + reach;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    let t = 0;
    const tilt = 0.35;
    const cosT = Math.cos(tilt), sinT = Math.sin(tilt);
    const radius = size * 0.4;
    const cx = size * 0.5, cy = size / 2;

    const drift = POINTS.map((_, i) => ({
      fx: 0.4 + (i * 0.31 % 1) * 0.5,
      fy: 0.35 + (i * 0.47 % 1) * 0.5,
      p: i * 1.9,
    }));

    const animate = () => {
      t += 0.012;
      const angle = t * 0.6;
      ctx.clearRect(0, 0, width, size);

      const projected = POINTS.map((p, i) => {
        const d = drift[i];
        const amp = i === 0 ? 0.03 : 0.14;
        const dx = Math.sin(t * d.fx + d.p) * amp;
        const dy = Math.cos(t * d.fy + d.p) * amp;
        const x = (p.x + dx) * radius, y = (p.y + dy) * radius, z = p.z * radius;
        const cosA = Math.cos(angle), sinA = Math.sin(angle);
        const rx = x * cosA + z * sinA;
        const rz1 = -x * sinA + z * cosA;
        const ry = y * cosT - rz1 * sinT;
        const rz2 = y * sinT + rz1 * cosT;
        const fov = radius * 2.2;
        const scale = fov / (fov + rz2);
        return { x: cx + rx * scale, y: cy + ry * scale, scale };
      });

      // Big, translucent, blended circles — same recipe as the landing
      // hero: overlapping soft-edged blobs read as one mass, not dots.
      ctx.globalCompositeOperation = 'lighter';
      projected.forEach((p, i) => {
        const r = (i === 0 ? 0.62 : 0.4) * size * p.scale;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = POINTS[i].color;
        ctx.globalAlpha = 0.5 * Math.min(p.scale, 1);
        ctx.fill();
      });
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;

      animRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => cancelAnimationFrame(animRef.current);
  }, [size, width]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width, height: size, flexShrink: 0 }}
      aria-hidden="true"
    />
  );
}
