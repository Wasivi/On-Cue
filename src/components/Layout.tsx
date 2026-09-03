import { useApp } from '../App';
import RoleSwitcher from './RoleSwitcher';
import MiniConstellation from './MiniConstellation';
import {
  Clapperboard, LayoutDashboard, Radio, Zap,
  Shirt, Brain, RotateCcw
} from 'lucide-react';
import type { Page } from '../App';

const navItems: { page: Page; label: string; icon: React.ReactNode }[] = [
  { page: 'myset', label: 'My Set', icon: <Clapperboard size={18} /> },
  { page: 'adcommand', label: 'AD Command', icon: <LayoutDashboard size={18} /> },
  { page: 'livetake', label: 'Live Take', icon: <Radio size={18} /> },
  { page: 'lighting', label: 'Lighting', icon: <Zap size={18} /> },
  { page: 'wardrobe', label: 'Wardrobe', icon: <Shirt size={18} /> },
  { page: 'intelligence', label: 'Intelligence', icon: <Brain size={18} /> },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const { page, setPage, holdState, resetDemo } = useApp();

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Sidebar — DSI Navy, flat */}
      <aside style={{
        width: 240,
        background: '#0a0e17',
        borderRight: '1px solid #1a2332',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px 14px',
        flexShrink: 0
      }}>
        <div style={{ marginBottom: 28 }}>
          <button
            onClick={() => setPage('landing')}
            title="Back to the home page"
            style={{
              display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4,
              background: 'none', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left'
            }}
          >
            <MiniConstellation size={36} />
            <div>
              <span style={{ fontFamily: "'Big Caslon', 'Big Caslon Medium', Didot, Georgia, serif", fontStyle: 'normal', color: '#e1ded2', fontWeight: 500, fontSize: 17, letterSpacing: '-0.01em' }}>On Cue</span>
              <div style={{ color: '#e6b800', fontSize: 10, fontWeight: 700, letterSpacing: '0.04em', marginTop: 1 }}>DSI PRODUCTION</div>
            </div>
          </button>
          <div style={{ color: '#4a5568', fontSize: 11, marginLeft: 46, marginTop: 4 }}>
            S8E9 "Lone Wolf" · Day 9
          </div>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {navItems.map(item => (
            <button
              key={item.page}
              onClick={() => setPage(item.page)}
              className={`nav-link ${page === item.page ? 'active' : ''}`}
              style={{ width: '100%', border: 'none', background: 'none', cursor: 'pointer' }}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.page === 'myset' && holdState === 'hold' && (
                <span style={{
                  marginLeft: 'auto',
                  width: 8, height: 8, borderRadius: '50%',
                  background: '#c53030',
                  animation: 'pulse-glow 2s infinite'
                }} />
              )}
            </button>
          ))}
        </nav>

        <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid #1a2332' }}>
          <RoleSwitcher />
          <button 
            onClick={resetDemo}
            className="nav-link"
            style={{ width: '100%', border: 'none', background: 'none', cursor: 'pointer', marginTop: 8 }}
          >
            <RotateCcw size={18} />
            <span>Reset Demo</span>
          </button>
        </div>
      </aside>

      <main style={{ flex: 1, overflow: 'auto', background: 'var(--workspace-bg)' }}>
        {children}
      </main>
    </div>
  );
}
