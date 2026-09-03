import { useApp } from '../App';
import RoleSwitcher from './RoleSwitcher';
import MiniConstellation from './MiniConstellation';
import { useEffect, useRef, useState } from 'react';
import {
  Clapperboard, LayoutDashboard, Radio, Zap,
  Shirt, Brain, RotateCcw
} from 'lucide-react';
import type { Page } from '../App';

const navItems: { page: Page; label: string; icon: React.ReactNode }[] = [
  { page: 'myset', label: 'My Set', icon: <Clapperboard size={20} /> },
  { page: 'adcommand', label: 'AD Command', icon: <LayoutDashboard size={20} /> },
  { page: 'livetake', label: 'Live Take', icon: <Radio size={20} /> },
  { page: 'lighting', label: 'Lighting', icon: <Zap size={20} /> },
  { page: 'wardrobe', label: 'Wardrobe', icon: <Shirt size={20} /> },
  { page: 'intelligence', label: 'Intelligence', icon: <Brain size={20} /> },
];

const BOTTOM_H = 68;
const AUTO_HIDE_MS = 3000;

// No top bar — there isn't one, on purpose. The page canvas runs its own
// dark-to-light ombré, and the bottom tab bar (auto-hiding, thumb-
// reachable) is the only persistent chrome. Role and reset — used
// occasionally, not the primary nav — live as a compact trailing cluster
// on that same bar instead of a whole second bar for two controls.
export default function Layout({ children }: { children: React.ReactNode }) {
  const { page, setPage, holdState, resetDemo } = useApp();
  const [barsVisible, setBarsVisible] = useState(true);
  const mainRef = useRef<HTMLElement>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

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
          // Dark blue easing to light blue — a vignette across the whole
          // canvas, not a flat fill. Cards stay their own opaque white,
          // unaffected; page-level text sits directly on this and needs
          // its own light color where it does (see AD Command). Darkened
          // ~50% across every stop from the first pass.
          background: 'linear-gradient(135deg, #091e29 0%, #183643 35%, #55656b 70%, #75797b 100%)'
        }}
      >
        {/* The wordmark — content sitting directly on the gradient, not a
            bar with its own background behind it. */}
        <button
          onClick={() => goTo('landing')}
          title="Back to the home page"
          style={{
            display: 'flex', alignItems: 'center', gap: 0,
            background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
            padding: '16px 20px 4px'
          }}
        >
          <MiniConstellation size={138} reach={78} />
          <span style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: 'normal', fontWeight: 700, color: '#ffffff', fontSize: 39, letterSpacing: '-0.01em', marginLeft: -90, transform: 'translateY(-20px)' }}>On Cue</span>
        </button>
        {children}
      </main>

      {/* Bottom tab bar — the only persistent chrome. Lightest where it
          meets the workspace, darkest at the screen's bottom edge. */}
      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 10,
        display: 'flex', alignItems: 'stretch',
        background: 'linear-gradient(to bottom, #123c4f 0%, #06202c 100%)',
        borderTop: '1px solid var(--nav-border)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        transform: barsVisible ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.28s cubic-bezier(0.4,0,0.2,1)'
      }}>
        <div style={{ display: 'flex', flex: 1 }}>
          {navItems.map(item => {
            const active = page === item.page;
            return (
              <button
                key={item.page}
                onClick={() => goTo(item.page)}
                style={{
                  flex: 1,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  gap: 3, padding: '9px 4px 8px',
                  border: 'none', background: 'none', cursor: 'pointer',
                  position: 'relative',
                  color: active ? 'var(--gold)' : 'rgba(230,184,0,0.55)',
                  transition: 'color 0.15s ease-out'
                }}
              >
                {/* A left rule reads "you are here" on a vertical rail;
                    rotated for a horizontal bar, that's a top rule. */}
                {active && (
                  <span style={{
                    position: 'absolute', top: 0, left: '30%', right: '30%', height: 2,
                    background: 'var(--gold)'
                  }} />
                )}
                <span style={{ position: 'relative' }}>
                  {item.icon}
                  {item.page === 'myset' && holdState === 'hold' && (
                    <span style={{
                      position: 'absolute', top: -2, right: -4,
                      width: 8, height: 8, borderRadius: '50%',
                      background: '#c53030',
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
          padding: '0 10px', borderLeft: '1px solid var(--nav-border)', flexShrink: 0
        }}>
          <RoleSwitcher />
          <button
            onClick={resetDemo}
            title="Reset Demo"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 30, height: 30, borderRadius: 15,
              border: 'none', background: 'none', color: 'rgba(230,184,0,0.55)', cursor: 'pointer',
              transition: 'background 0.15s ease-out, color 0.15s ease-out'
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = '#e8f0f5'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'rgba(230,184,0,0.55)'; }}
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
