import { useApp } from '../App';
import RoleSwitcher from './RoleSwitcher';
import Wordmark from './Wordmark';
import {
  Clapperboard, LayoutDashboard, Radio, Zap,
  Shirt, Brain, Activity, RotateCcw, AlertTriangle
} from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Page } from '../App';

const navItems: { page: Page; label: string; icon: React.ReactNode }[] = [
  { page: 'myset', label: 'My Set', icon: <Clapperboard size={18} /> },
  { page: 'adcommand', label: 'AD Command', icon: <LayoutDashboard size={18} /> },
  { page: 'livetake', label: 'Live Take', icon: <Radio size={18} /> },
  { page: 'lighting', label: 'Lighting', icon: <Zap size={18} /> },
  { page: 'wardrobe', label: 'Wardrobe', icon: <Shirt size={18} /> },
  { page: 'intelligence', label: 'Intelligence', icon: <Brain size={18} /> },
  { page: 'activity', label: 'Agent Activity', icon: <Activity size={18} /> },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const { page, setPage, holdState, resetDemo } = useApp();
  const [resetArmed, setResetArmed] = useState(false);

  useEffect(() => {
    if (!resetArmed) return;
    const timer = setTimeout(() => setResetArmed(false), 3000);
    return () => clearTimeout(timer);
  }, [resetArmed]);

  const handleResetClick = () => {
    if (resetArmed) {
      setResetArmed(false);
      resetDemo();
    } else {
      setResetArmed(true);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Sidebar */}
      <aside style={{
        width: 240,
        background: 'var(--nav-bg)',
        borderRight: '1px solid var(--nav-border)',
        display: 'flex',
        flexDirection: 'column',
        padding: '20px 14px',
        flexShrink: 0
      }}>
        <div style={{ marginBottom: 28, paddingLeft: 2 }}>
          <Wordmark size={17} />
          <div style={{ color: 'var(--rail-muted)', fontSize: 11, marginTop: 6 }}>
            Harbor Unit · Ep 104 · Day 12
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
                  background: 'var(--red)',
                  animation: 'pulse-amber 2s infinite'
                }} />
              )}
            </button>
          ))}
        </nav>

        <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid var(--nav-border)' }}>
          <RoleSwitcher />
          <button
            onClick={handleResetClick}
            className="nav-link"
            style={{
              width: '100%', border: 'none', cursor: 'pointer', marginTop: 8,
              background: resetArmed ? 'rgba(200,30,44,0.18)' : 'none',
              color: resetArmed ? '#f0a3a8' : undefined,
              borderLeft: resetArmed ? '2px solid var(--red)' : '2px solid transparent'
            }}
          >
            {resetArmed ? <AlertTriangle size={18} /> : <RotateCcw size={18} />}
            <span>{resetArmed ? 'Click again to confirm' : 'Reset Demo'}</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, overflow: 'auto', background: 'var(--workspace-bg)' }}>
        {children}
      </main>
    </div>
  );
}
