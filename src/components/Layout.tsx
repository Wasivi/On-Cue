import { useApp } from '../App';
import RoleSwitcher from './RoleSwitcher';
import MiniConstellation from './MiniConstellation';
import { useEffect, useRef, useState } from 'react';
import {
  Clapperboard, LayoutDashboard, Radio, Zap,
  Shirt, Brain, RotateCcw, Box, DollarSign
} from 'lucide-react';
import type { Page } from '../App';

const navItems: { page: Page; label: string; icon: React.ReactNode }[] = [
  { page: 'myset', label: 'My Set', icon: <Clapperboard size={20} /> },
  { page: 'adcommand', label: 'AD Command', icon: <LayoutDashboard size={20} /> },
  { page: 'livetake', label: 'Live Take', icon: <Radio size={20} /> },
  { page: 'lighting', label: 'Lighting', icon: <Zap size={20} /> },
  { page: 'wardrobe', label: 'Wardrobe', icon: <Shirt size={20} /> },
  { page: 'continuity', label: 'Continuity', icon: <Box size={20} /> },
  { page: 'intelligence', label: 'Intelligence', icon: <Brain size={20} /> },
  { page: 'budget', label: 'Budget', icon: <DollarSign size={20} /> },
];

const BOTTOM_H = 68;
const AUTO_HIDE_MS = 3000;

// No top bar — there isn't one, on purpose. The page canvas is a calm,
// flat navy (not the landing page's dramatic gradient — that reads as a
// one-time title card, this is a surface people stare at for a full
// shoot day), and the bottom tab bar (auto-hiding, thumb-reachable) is
// the only persistent chrome. Role and reset — used occasionally, not
// the primary nav — live as a compact trailing cluster on that same bar
// instead of a whole second bar for two controls.
const HEADER_H = 72;

export default function Layout({ children }: { children: React.ReactNode }) {
  const { page, setPage, holdState, resetDemo } = useApp();
  const [barsVisible, setBarsVisible] = useState(true);
  const [headerWidth, setHeaderWidth] = useState(0);
  const mainRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // The header's own width, so the constellation spans it edge to edge on
  // any screen — phone, tablet, desktop — instead of a fixed guess.
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(entries => {
      const w = entries[0]?.contentRect.width;
      if (w) setHeaderWidth(w);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const wake = () => {
      setBarsVisible(true);
      clearTimeout(hideTimer.current);
      hideTimer.current = setTimeout(() => setBarsVisible(false), AUTO_HIDE_MS);
    };
    const el = mainRef.current;
    const events: (keyof DocumentEventMap)[] = ['scroll', 'pointerdown', 'pointermove', 'keydown', 'wheel'];
    events.forEach(evt => el?.addEventListener(evt, wake, { passive: true }));
    wake();
    return () => {
      events.forEach(evt => el?.removeEventListener(evt, wake));
      clearTimeout(hideTimer.current);
    };
  }, []);

  const goTo = (p: Page) => { setBarsVisible(true); setPage(p); };

  return (
    <div style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
      <main
        ref={mainRef}
        style={{
          position: 'absolute', inset: 0, overflow: 'auto',
          paddingBottom: BOTTOM_H,
          // Ivory paper — the same Navy/Gold/Ivory world as the landing
          // page, read as a working surface: ivory background, navy ink,
          // gold accent. The landing page's dark gradient is the one-time
          // title-card moment; this is what you stare at all day.
          background: 'var(--paper)'
        }}
      >
        {/* The landing page's own animation, carried into the chrome: the
            same orb cluster spans the header edge to edge instead of
            sitting as a small icon next to the wordmark. A bottom-edge-
            only fade dissolves it into the paper workspace below — no
            hard seam where dark meets light — without dimming the colors
            across the rest of the header, since the colors ARE the point. */}
        <div
          ref={headerRef}
          style={{ position: 'relative', height: HEADER_H, background: '#0a2a3a', overflow: 'hidden' }}
        >
          {headerWidth > 0 && (
            <div style={{ position: 'absolute', inset: 0 }}>
              <MiniConstellation width={headerWidth} height={HEADER_H} />
            </div>
          )}
          <div style={{
            position: 'absolute', left: 0, right: 0, bottom: 0, height: 36,
            background: 'linear-gradient(180deg, transparent 0%, rgba(7,24,32,0.5) 60%, var(--paper) 100%)',
            pointerEvents: 'none'
          }} />
          <button
            onClick={() => goTo('landing')}
            title="Back to the home page"
            style={{
              position: 'relative', display: 'flex', alignItems: 'center', height: '100%',
              background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
              padding: '0 16px'
            }}
          >
            <span style={{
              fontFamily: "'Playfair Display', Georgia, serif", fontStyle: 'normal', fontWeight: 700,
              color: '#ffffff', fontSize: 24, letterSpacing: '-0.01em',
              textShadow: '0 1px 4px rgba(0,0,0,0.35)'
            }}>
              On Cue
            </span>
          </button>
        </div>
        {children}
      </main>

      {/* Bottom bar — book-index tabs rising off a visible spine, not a
          band that blends into the page: every tab has its own solid
          fill, so it reads even when inactive; the active one pops up
          brighter and a touch taller. */}
      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 10,
        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
        gap: 12,
        background: 'var(--paper-deep)',
        borderTop: '1px solid var(--border-strong)',
        padding: '0 12px',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        transform: barsVisible ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.28s cubic-bezier(0.4,0,0.2,1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, flex: 1, overflowX: 'auto' }}>
          {navItems.map(item => {
            const active = page === item.page;
            return (
              <button
                key={item.page}
                onClick={() => goTo(item.page)}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  gap: 2, padding: active ? '9px 12px 8px' : '7px 12px 7px',
                  borderRadius: '12px 12px 0 0',
                  border: '1px solid var(--border-strong)',
                  borderBottom: 'none',
                  cursor: 'pointer', flexShrink: 0,
                  position: 'relative',
                  background: active ? 'var(--surface)' : 'var(--paper)',
                  color: active ? 'var(--bronze-text)' : 'var(--muted)',
                  boxShadow: active ? '0 -2px 8px rgba(20,34,43,0.1)' : 'none',
                  transition: 'all 0.15s ease-out'
                }}
              >
                <span style={{ position: 'relative' }}>
                  {item.icon}
                  {item.page === 'myset' && holdState === 'hold' && (
                    <span style={{
                      position: 'absolute', top: -2, right: -4,
                      width: 8, height: 8, borderRadius: '50%',
                      background: 'var(--stop-red)',
                      animation: 'pulse-glow 2s infinite'
                    }} />
                  )}
                </span>
                <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.01em' }}>{item.label}</span>
              </button>
            );
          })}
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '0 0 8px 10px', borderLeft: '1px solid var(--border-strong)', flexShrink: 0
        }}>
          <RoleSwitcher />
          <button
            onClick={resetDemo}
            title="Reset Demo"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 30, height: 30, borderRadius: 15,
              border: 'none', background: 'none', color: 'var(--muted-dim)', cursor: 'pointer',
              transition: 'background 0.15s ease-out, color 0.15s ease-out'
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(230,184,0,0.1)'; e.currentTarget.style.color = 'var(--bronze-text)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--muted-dim)'; }}
          >
            <RotateCcw size={15} />
          </button>
        </div>
      </nav>

      {/* Tap-to-reveal — a thin strip at the bottom edge, only present
          once the bar has tucked away. */}
      {!barsVisible && (
        <div
          onClick={() => setBarsVisible(true)}
          title="Show menu"
          style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: 14, zIndex: 9, cursor: 'pointer' }}
        />
      )}
    </div>
  );
}
