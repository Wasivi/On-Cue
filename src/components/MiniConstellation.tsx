import { useEffect, useRef } from 'react';

interface Point {
  x: number;
  y: number;
  z: number;
  color: string;
}

const PALETTE = ['#e6b800', '#c9a227', '#8ab4c7', '#6b9ab0', '#5a8a9e', '#4a7a8e', '#6f9db3'];

// The hub — same idea as the landing page's constellation, scaled down
// into a persistent logo mark.
const HUB: Point = { x: 0, y: 0, z: 0.6, color: '#e6b800' };

// These reach well outside the main cluster's own radius on purpose, in
// both x and y — with `reach` giving them canvas room to the right, their
// bones arc above and below where the wordmark sits, wrapping partway
// around it instead of just poking one thread toward it.
const REACH: Point[] = [
  { x: 1.5, y: -0.25, z: 0.15, color: '#6f9db3' },
  { x: 1.35, y: 0.4, z: -0.15, color: '#4a7a8e' },
  { x: 1.75, y: -0.85, z: 0.1, color: '#8ab4c7' },
  { x: 1.65, y: 0.9, z: -0.2, color: '#6b9ab0' },
];

// Generated, not hand-typed — this has been asked to grow several times
// over, and a loop scales that request without turning the file into 60
// lines of coordinates. Deterministic (no Math.random) so it's stable
// frame to frame and reload to reload.
const DUST_COUNT = 57; // hub(1) + dust(57) + reach(4) = 62 points total
const DUST: Point[] = Array.from({ length: DUST_COUNT }, (_, i) => {
  const angle = i * 2.399;
  // Wider spread (was 0.15–1.0) for "more open" — the same point count
  // now covers more of the canvas instead of clustering tight at center.
  const r = 0.15 + ((i * 37) % 10) / 10 * 1.1;
  return {
    x: Math.cos(angle) * r,
    y: Math.sin(angle) * r * 0.9,
    z: Math.sin(i * 1.7) * 0.4,
    color: PALETTE[i % PALETTE.length],
  };
});

const POINTS: Point[] = [HUB, ...DUST, ...REACH];

// Mesh, generated the same way the landing page's does: the hub reaches a
// handful of spread-out dust points, and every point also links to its two
// nearest neighbors — that's what turns "a lot of dots" into an actual
// woven net instead of a scatter.
const LINKS: [number, number][] = (() => {
  const seen = new Set<string>();
  const key = (a: number, b: number) => (a < b ? `${a}|${b}` : `${b}|${a}`);
  const links: [number, number][] = [];
  const add = (a: number, b: number) => {
    const k = key(a, b);
    if (seen.has(k) || a === b) return;
    seen.add(k);
    links.push([a, b]);
  };

  for (let i = 0; i < 7; i++) {
    add(0, 1 + Math.floor((i * DUST.length) / 7));
  }
  POINTS.forEach((p, i) => {
    const nearest = POINTS
      .map((o, j) => ({ j, d: Math.hypot(o.x - p.x, o.y - p.y) }))
      .filter(o => o.j !== i)
      .sort((a, b) => a.d - b.d)
      .slice(0, 2);
    nearest.forEach(({ j }) => add(i, j));
  });
  return links;
})();

interface MiniConstellationProps {
  size?: number;
  /** Extra canvas width to the right of the cluster's own footprint —
   *  where the reaching points above actually have room to extend into,
   *  toward adjacent text, instead of clipping at the edge. */
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
    const radius = size * 0.34;
    // Hugging the left edge of its own footprint, not centered — the
    // reach space (and the reach points above) do the work of extending
    // toward the wordmark instead of the whole cluster sitting mid-canvas.
    const cx = size * 0.36, cy = size / 2;

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
      ctx.clearRect(0, 0, width, size);

      const isReach = (i: number) => i > DUST_COUNT; // hub=0, dust=1..DUST_COUNT, reach after
      const projected = POINTS.map((p, i) => {
        const d = drift[i];
        const amp = i === 0 ? 0.02 : isReach(i) ? 0.16 : 0.11;
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
        ctx.strokeStyle = `rgba(230, 184, 0, ${0.32 * avg})`;
        ctx.lineWidth = Math.max(0.25, avg * 0.38);
        ctx.stroke();
      });

      projected.forEach((p, i) => {
        const r = (i === 0 ? 1.9 : 0.85) * p.scale;
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
  }, [size, width]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width, height: size, flexShrink: 0 }}
      aria-hidden="true"
    />
  );
}
