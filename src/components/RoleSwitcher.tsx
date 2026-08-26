import { useApp } from '../App';
import { ChevronDown, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { Role } from '../types';

const roles: Role[] = [
  '1st AD', 'Director', 'DP', 'Gaffer',
  'Script Supervisor', 'Wardrobe', 'Talent Assistant', 'Producer'
];

export default function RoleSwitcher() {
  const { role, setRole } = useApp();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        aria-haspopup="listbox"
        aria-expanded={open}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '10px 14px',
          borderRadius: 3,
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.1)',
          color: '#fff',
          fontSize: 13,
          fontWeight: 600,
          cursor: 'pointer',
          width: '100%'
        }}
      >
        <User size={16} style={{ color: 'var(--rail-muted)' }} />
        <span style={{ flex: 1, textAlign: 'left' }}>{role}</span>
        <ChevronDown size={14} style={{ color: 'var(--rail-muted)', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>

      {open && (
        <div style={{
          position: 'absolute',
          bottom: 'calc(100% + 6px)',
          left: 0,
          right: 0,
          background: '#1c1c1f',
          border: '1px solid var(--rail-muted)',
          borderRadius: 3,
          padding: 6,
          zIndex: 100
        }}>
          {roles.map(r => (
            <button
              key={r}
              onClick={() => { setRole(r); setOpen(false); }}
              style={{
                display: 'block',
                width: '100%',
                padding: '8px 12px',
                borderRadius: 2,
                border: 'none',
                background: role === r ? 'rgba(255,255,255,0.1)' : 'transparent',
                color: role === r ? '#fff' : 'var(--rail-muted)',
                fontSize: 13,
                fontWeight: role === r ? 600 : 500,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s'
              }}
              onMouseEnter={e => { if (role !== r) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
              onMouseLeave={e => { if (role !== r) e.currentTarget.style.background = 'transparent'; }}
            >
              {r}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
