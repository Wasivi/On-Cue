import { useEffect, useRef } from 'react';

interface Point {
  x: number;
  y: number;
  z: number;
  color: string;
}

// Same idea as the landing page's constellation, scaled down into a
// persistent logo mark — including its color mix (gold hub, blue/teal
// satellites), not a monochrome gold cluster.
const POINTS: Point[] = [
  { x: 0, y: 0, z: 0.6, color: '#e6b800' },
  { x: 0.75, y: -0.35, z: 0.1, color: '#c9a227' },
  { x: -0.7, y: -0.3, z: -0.1, color: '#8ab4c7' },
  { x: 0.5, y: 0.55, z: -0.3, color: '#6b9ab0' },
  { x: -0.55, y: 0.5, z: 0.2, color: '#5a8a9e' },
  { x: 0, y: -0.8, z: -0.4, color: '#8ab4c7' },
];

const LINKS: [number, number][] = [
  [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [1, 3], [2, 4]
];

export default function MiniConstellation({ size = 36 }: { size?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    let t = 0;
    const tilt = 0.35;
    const cosT = Math.cos(tilt), sinT = Math.sin(tilt);
    const radius = size * 0.36;
    const cx = size / 2, cy = size / 2;

    // Each point drifts on its own independent orbit, same as the big map,
    // so the little mark never settles into one fixed silhouette either.
    const drift = POINTS.map((_, i) => ({
      fx: 0.4 + (i * 0.31 % 1) * 0.5,
      fy: 0.35 + (i * 0.47 % 1) * 0.5,
      p: i * 1.9,
    }));

    const animate = () => {
      t += 0.012;
      const angle = t * 0.6;
      ctx.clearRect(0, 0, size, size);

      const projected = POINTS.map((p, i) => {
        const d = drift[i];
        const amp = i === 0 ? 0.02 : 0.1;
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

      LINKS.forEach(([a, b]) => {
        const pa = projected[a], pb = projected[b];
        const avg = (pa.scale + pb.scale) / 2;
        ctx.beginPath();
        ctx.moveTo(pa.x, pa.y);
        ctx.lineTo(pb.x, pb.y);
        ctx.strokeStyle = `rgba(230, 184, 0, ${0.4 * avg})`;
        ctx.lineWidth = Math.max(0.4, avg * 0.7);
        ctx.stroke();
      });

      projected.forEach((p, i) => {
        const r = (i === 0 ? 2.6 : 1.6) * p.scale;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = POINTS[i].color;
        ctx.globalAlpha = Math.min(p.scale, 1);
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      animRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => cancelAnimationFrame(animRef.current);
  }, [size]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: size, height: size, flexShrink: 0 }}
      aria-hidden="true"
    />
  );
}
