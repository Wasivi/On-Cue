import { useEffect, useRef, useState, useCallback } from 'react';

interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
  baseR: number;
  color: string;
  category: string;
}

interface Edge {
  from: string;
  to: string;
}

const CATEGORIES = [
  { id: 'command', label: '1st AD', color: '#e6b800', glow: 'rgba(230,184,0,0.5)' },
  { id: 'creative', label: 'Creative', color: '#c9a227', glow: 'rgba(201,162,39,0.4)' },
  { id: 'technical', label: 'Technical', color: '#8ab4c7', glow: 'rgba(138,180,199,0.4)' },
  { id: 'support', label: 'Support', color: '#6b9ab0', glow: 'rgba(107,154,176,0.3)' },
  { id: 'talent', label: 'Talent', color: '#5a8a9e', glow: 'rgba(90,138,158,0.3)' },
];

const NODES: Node[] = [
  { id: 'ad', label: '1st AD', x: 0.50, y: 0.50, baseR: 5, color: '#e6b800', category: 'command' },
  { id: 'director', label: 'Director', x: 0.35, y: 0.28, baseR: 3.5, color: '#c9a227', category: 'creative' },
  { id: 'producer', label: 'Producer', x: 0.65, y: 0.28, baseR: 3.5, color: '#c9a227', category: 'creative' },
  { id: 'dp', label: 'DP', x: 0.72, y: 0.42, baseR: 3, color: '#8ab4c7', category: 'technical' },
  { id: 'gaffer', label: 'Gaffer', x: 0.28, y: 0.42, baseR: 3, color: '#8ab4c7', category: 'technical' },
  { id: 'camera', label: 'Camera', x: 0.78, y: 0.58, baseR: 2.8, color: '#8ab4c7', category: 'technical' },
  { id: 'sound', label: 'Sound', x: 0.22, y: 0.58, baseR: 2.8, color: '#8ab4c7', category: 'technical' },
  { id: 'wardrobe', label: 'Wardrobe', x: 0.32, y: 0.72, baseR: 2.8, color: '#6b9ab0', category: 'support' },
  { id: 'onset', label: 'On Set', x: 0.68, y: 0.72, baseR: 2.8, color: '#6b9ab0', category: 'support' },
  { id: 'script', label: 'Script Sup', x: 0.42, y: 0.82, baseR: 2.5, color: '#6b9ab0', category: 'support' },
  { id: 'locations', label: 'Locations', x: 0.58, y: 0.82, baseR: 2.5, color: '#6b9ab0', category: 'support' },
  { id: 'actor1', label: 'Actor 1', x: 0.45, y: 0.15, baseR: 2.5, color: '#5a8a9e', category: 'talent' },
  { id: 'actor2', label: 'Actor 2', x: 0.55, y: 0.15, baseR: 2.5, color: '#5a8a9e', category: 'talent' },
  { id: 'actor3', label: 'Actor 3', x: 0.50, y: 0.08, baseR: 2.2, color: '#5a8a9e', category: 'talent' },
  { id: 'scene', label: 'Scene', x: 0.18, y: 0.38, baseR: 2.5, color: '#5a8a9e', category: 'talent' },
  { id: 'lighting', label: 'Lighting', x: 0.82, y: 0.38, baseR: 2.5, color: '#5a8a9e', category: 'talent' },
  { id: 'transport', label: 'Transport', x: 0.15, y: 0.68, baseR: 2.2, color: '#4a7a8e', category: 'talent' },
  { id: 'safety', label: 'Safety', x: 0.85, y: 0.68, baseR: 2.2, color: '#4a7a8e', category: 'talent' },
  { id: 'art', label: 'Art', x: 0.50, y: 0.90, baseR: 2.2, color: '#4a7a8e', category: 'talent' },
  { id: 'props', label: 'Props', x: 0.25, y: 0.82, baseR: 2.2, color: '#4a7a8e', category: 'talent' },
  { id: 'hair', label: 'Hair/MU', x: 0.75, y: 0.82, baseR: 2.2, color: '#4a7a8e', category: 'talent' },
];

const EDGES: Edge[] = [
  { from: 'ad', to: 'director' }, { from: 'ad', to: 'producer' },
  { from: 'ad', to: 'dp' }, { from: 'ad', to: 'gaffer' },
  { from: 'ad', to: 'camera' }, { from: 'ad', to: 'sound' },
  { from: 'ad', to: 'wardrobe' }, { from: 'ad', to: 'onset' },
  { from: 'ad', to: 'actor1' }, { from: 'ad', to: 'actor2' },
  { from: 'ad', to: 'scene' }, { from: 'ad', to: 'lighting' },
  { from: 'ad', to: 'script' }, { from: 'ad', to: 'locations' },
  { from: 'ad', to: 'transport' }, { from: 'ad', to: 'safety' },
  { from: 'director', to: 'producer' }, { from: 'dp', to: 'camera' },
  { from: 'gaffer', to: 'lighting' }, { from: 'wardrobe', to: 'actor1' },
  { from: 'sound', to: 'onset' }, { from: 'scene', to: 'script' },
  { from: 'locations', to: 'transport' }, { from: 'onset', to: 'safety' },
  { from: 'actor1', to: 'actor2' }, { from: 'actor2', to: 'actor3' },
  { from: 'props', to: 'art' }, { from: 'hair', to: 'wardrobe' },
  { from: 'transport', to: 'props' }, { from: 'safety', to: 'onset' },
  { from: 'director', to: 'actor1' }, { from: 'producer', to: 'scene' },
  { from: 'dp', to: 'lighting' }, { from: 'camera', to: 'onset' },
];

const STATS = [
  { value: '21', label: 'DEPARTMENTS' },
  { value: '87', label: 'CREW' },
  { value: '12', label: 'CAST' },
  { value: '4', label: 'LOCATIONS' },
  { value: '3', label: 'PICTURE VEHICLES' },
  { value: '45', label: 'BACKGROUND' },
  { value: '1,127', label: 'AVG CITES' },
  { value: '8.9', label: 'H-INDEX' },
];

export default function LandingPage({ onEnter }: { onEnter: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const timeRef = useRef(0);
  const animRef = useRef(0);
  const nodesRef = useRef<Map<string, any>>(new Map());

  const getNode = useCallback((id: string) => NODES.find(n => n.id === id)!, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    // Initialize node states
    NODES.forEach(node => {
      nodesRef.current.set(node.id, {
        currentR: node.baseR,
        targetR: node.baseR,
        labelOpacity: 0,
        targetLabelOpacity: 0,
        pulsePhase: Math.random() * Math.PI * 2,
        expandTimer: Math.random() * 8,
        glowIntensity: 0,
      });
    });

    const findNodeAt = (mx: number, my: number) => {
      const rect = canvas.getBoundingClientRect();
      const x = (mx - rect.left);
      const y = (my - rect.top);
      for (const node of NODES) {
        const nx = node.x * rect.width;
        const ny = node.y * rect.height;
        const state = nodesRef.current.get(node.id);
        const r = state ? state.currentR : node.baseR;
        const dist = Math.sqrt((x - nx) ** 2 + (y - ny) ** 2);
        if (dist < Math.max(r * 3, 15)) return node.id;
      }
      return null;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const id = findNodeAt(e.clientX - rect.left, e.clientY - rect.top);
      setHoveredNode(id);
    };

    const handleClick = () => onEnter();

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);

    const animate = () => {
      timeRef.current += 0.016;
      const t = timeRef.current;
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      ctx.clearRect(0, 0, w, h);

      // Draw edges
      EDGES.forEach(edge => {
        const from = getNode(edge.from);
        const to = getNode(edge.to);
        if (!from || !to) return;

        const fx = from.x * w, fy = from.y * h;
        const tx = to.x * w, ty = to.y * h;

        // Check visibility based on filter
        const fromVisible = activeFilter === 'all' || from.category === activeFilter;
        const toVisible = activeFilter === 'all' || to.category === activeFilter;
        if (!fromVisible || !toVisible) return;

        const isConnectedToHover = hoveredNode && (hoveredNode === edge.from || hoveredNode === edge.to);
        const baseOpacity = hoveredNode ? (isConnectedToHover ? 0.25 : 0.06) : 0.12;

        ctx.beginPath();
        ctx.moveTo(fx, fy);
        ctx.lineTo(tx, ty);
        ctx.strokeStyle = `rgba(138, 180, 199, ${baseOpacity})`;
        ctx.lineWidth = 0.4;
        ctx.stroke();

        // Traveling signal
        const signalT = ((t * 0.4 + (from.x + from.y) * 50) % 100) / 100;
        const sx = fx + (tx - fx) * signalT;
        const sy = fy + (ty - fy) * signalT;

        const signalGrad = ctx.createRadialGradient(sx, sy, 0, sx, sy, 6);
        signalGrad.addColorStop(0, 'rgba(230, 184, 0, 0.8)');
        signalGrad.addColorStop(1, 'rgba(230, 184, 0, 0)');
        ctx.beginPath();
        ctx.arc(sx, sy, 6, 0, Math.PI * 2);
        ctx.fillStyle = signalGrad;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(sx, sy, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(230, 184, 0, 0.9)';
        ctx.fill();
      });

      // Update and draw nodes
      NODES.forEach(node => {
        const state = nodesRef.current.get(node.id);
        if (!state) return;

        const isVisible = activeFilter === 'all' || node.category === activeFilter;
        if (!isVisible) return;

        // Breathing pulse
        const pulse = Math.sin(t * 0.8 + state.pulsePhase);
        const breathe = 1 + pulse * 0.12;

        // Random expansion
        state.expandTimer -= 0.016;
        if (state.expandTimer <= 0) {
          state.expandTimer = 4 + Math.random() * 8;
          state.targetR = state.targetR === node.baseR ? node.baseR * 2.2 : node.baseR;
          state.targetLabelOpacity = state.targetR === node.baseR ? 0 : 1;
        }

        // Smooth transitions
        state.currentR += (state.targetR - state.currentR) * 0.04;
        state.labelOpacity += (state.targetLabelOpacity - state.labelOpacity) * 0.03;

        const isHovered = hoveredNode === node.id;
        const finalR = state.currentR * breathe * (isHovered ? 1.4 : 1);
        const finalLabelOp = isHovered ? 1 : state.labelOpacity;

        const nx = node.x * w;
        const ny = node.y * h;

        // Glow
        const glowR = finalR * 6;
        const glowGrad = ctx.createRadialGradient(nx, ny, 0, nx, ny, glowR);
        const cat = CATEGORIES.find(c => c.id === node.category);
        const glowColor = cat ? cat.glow : 'rgba(138,180,199,0.3)';
        glowGrad.addColorStop(0, glowColor);
        glowGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.beginPath();
        ctx.arc(nx, ny, glowR, 0, Math.PI * 2);
        ctx.fillStyle = glowGrad;
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(nx, ny, finalR, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.globalAlpha = isHovered ? 1 : 0.75;
        ctx.fill();
        ctx.globalAlpha = 1;

        // Inner bright core
        if (node.id === 'ad' || finalR > node.baseR * 1.5) {
          ctx.beginPath();
          ctx.arc(nx, ny, finalR * 0.35, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(255,255,255,0.95)';
          ctx.fill();
        }

        // Label
        if (finalLabelOp > 0.01) {
          ctx.font = `${isHovered ? '600' : '500'} 10px 'JetBrains Mono', monospace`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'top';
          ctx.fillStyle = isHovered ? '#e8f0f5' : (node.id === 'ad' ? '#e6b800' : '#8ab4c7');
          ctx.globalAlpha = finalLabelOp * (isHovered ? 1 : 0.8);
          ctx.fillText(node.label, nx, ny + finalR + 5);
          ctx.globalAlpha = 1;
        }
      });

      animRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleClick);
    };
  }, [hoveredNode, activeFilter, getNode, onEnter]);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(160deg, #0d3a4d 0%, #0a2a3a 30%, #071820 70%, #051015 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: "'Inter', system-ui, sans-serif",
      color: '#e8f0f5'
    }}>
      {/* Subtle vignette overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at 50% 40%, transparent 30%, rgba(5,16,21,0.6) 100%)',
        pointerEvents: 'none',
        zIndex: 1
      }} />

      {/* Top header bar */}
      <div style={{
        width: '100%',
        padding: '20px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid rgba(138,180,199,0.1)',
        position: 'relative',
        zIndex: 2
      }}>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10,
          fontWeight: 500,
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: '#c9a227'
        }}>
          Live Production Map
        </div>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10,
          fontWeight: 500,
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: '#4a6b7d'
        }}>
          Role-Based Coordination
        </div>
      </div>

      {/* Main content area */}
      <div style={{
        flex: 1,
        width: '100%',
        maxWidth: 1200,
        padding: '24px 32px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        zIndex: 2
      }}>
        {/* Title section */}
        <div style={{ textAlign: 'center', marginBottom: 8 }}>
          <div style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 52,
            fontWeight: 700,
            fontStyle: 'italic',
            letterSpacing: '-0.01em',
            color: '#e8f0f5',
            lineHeight: 1.1,
            textShadow: '0 0 60px rgba(230,184,0,0.1)'
          }}>
            On Cue
          </div>
        </div>

        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 12,
          fontWeight: 400,
          letterSpacing: '0.1em',
          color: '#6b9ab0',
          marginBottom: 20
        }}>
          21 departments · 87 crew · 12 cast · 4 locations
        </div>

        {/* Filter pills */}
        <div style={{
          display: 'flex',
          gap: 8,
          marginBottom: 20,
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          {[{ id: 'all', label: 'All Roles' }, ...CATEGORIES].map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveFilter(cat.id)}
              style={{
                padding: '6px 16px',
                borderRadius: 20,
                border: `1px solid ${activeFilter === cat.id ? '#c9a227' : 'rgba(138,180,199,0.25)'}`,
                background: activeFilter === cat.id ? 'rgba(201,162,39,0.1)' : 'transparent',
                color: activeFilter === cat.id ? '#c9a227' : '#6b9ab0',
                fontSize: 11,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: "'Inter', system-ui, sans-serif",
                letterSpacing: '0.04em',
                transition: 'all 0.2s ease'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Canvas constellation */}
        <canvas
          ref={canvasRef}
          style={{
            width: '100%',
            height: '50vh',
            minHeight: 400,
            cursor: 'pointer',
            borderRadius: 8
          }}
        />

        {/* Bottom hint */}
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 9,
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: '#3a5a6d',
          marginTop: 8
        }}>
          Legend · Hover to explore · Click to enter
        </div>
      </div>

      {/* Bottom stats panel */}
      <div style={{
        width: '100%',
        borderTop: '1px solid rgba(138,180,199,0.1)',
        background: 'rgba(7,24,32,0.6)',
        backdropFilter: 'blur(10px)',
        padding: '20px 32px',
        position: 'relative',
        zIndex: 2
      }}>
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: 24
        }}>
          {/* Stats grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '16px 32px'
          }}>
            {STATS.map((stat, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: 24,
                  fontWeight: 700,
                  color: '#c9a227',
                  lineHeight: 1.2
                }}>
                  {stat.value}
                </div>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 9,
                  fontWeight: 500,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: '#4a6b7d',
                  marginTop: 2
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Legend + Sign in */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 16 }}>
            {/* Category legend */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {CATEGORIES.map(cat => (
                <div key={cat.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: cat.color,
                    boxShadow: `0 0 6px ${cat.glow}`
                  }} />
                  <span style={{
                    fontSize: 11,
                    color: '#6b9ab0',
                    fontFamily: "'JetBrains Mono', monospace",
                    letterSpacing: '0.04em'
                  }}>
                    {cat.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Sign in */}
            <button
              onClick={onEnter}
              style={{
                background: 'none',
                border: 'none',
                color: '#8ab4c7',
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
                letterSpacing: '0.1em',
                fontFamily: "'JetBrains Mono', monospace",
                textTransform: 'uppercase',
                padding: '8px 0',
                transition: 'color 0.3s ease',
                borderBottom: '1px solid rgba(138,180,199,0.2)'
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#e6b800'; e.currentTarget.style.borderBottomColor = '#e6b800'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#8ab4c7'; e.currentTarget.style.borderBottomColor = 'rgba(138,180,199,0.2)'; }}
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
