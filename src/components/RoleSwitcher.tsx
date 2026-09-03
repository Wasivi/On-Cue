import { useApp } from '../App';
import { ChevronDown, User } from 'lucide-react';
import { useState } from 'react';
import type { Role } from '../types';

const roles: Role[] = [
  '1st AD', 'Director', 'DP', 'Gaffer',
  'Script Supervisor', 'Wardrobe', 'Talent Assistant', 'Producer'
];

// Lives in the bottom bar's trailing cluster, so it's a small pill and the
// dropdown opens upward — there's no room below it, the bar sits at the
// very bottom of the screen.
export default function RoleSwitcher() {
  const { role, setRole } = useApp();
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '6px 10px',
          borderRadius: 16,
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.1)',
          color: '#e1ded2',
          fontSize: 12,
          fontWeight: 600,
          cursor: 'pointer',
          maxWidth: 120
        }}
      >
        <User size={14} style={{ color: 'rgba(230,184,0,0.55)', flexShrink: 0 }} />
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{role}</span>
        <ChevronDown size={12} style={{ color: 'rgba(230,184,0,0.55)', flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>

      {open && (
        <div style={{
          position: 'absolute',
          bottom: 'calc(100% + 6px)',
          right: 0,
          width: 200,
          background: '#0d2836',
          border: '1px solid var(--nav-border)',
          borderRadius: 10,
          padding: 6,
          boxShadow: '0 12px 28px rgba(0,0,0,0.4)',
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
                borderRadius: 6,
                border: 'none',
                background: role === r ? 'rgba(255,255,255,0.1)' : 'transparent',
                color: role === r ? '#e8f0f5' : '#9db4c2',
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
