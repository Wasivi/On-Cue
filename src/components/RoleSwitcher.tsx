import { useApp } from '../App';
import { ChevronDown, User } from 'lucide-react';
import { useState } from 'react';
import type { Role } from '../types';

const roles: Role[] = [
  '1st AD', 'Director', 'DP', 'Gaffer', 
  'Script Supervisor', 'Wardrobe', 'Talent Assistant', 'Producer'
];

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
          gap: 10,
          padding: '10px 14px',
          borderRadius: 8,
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.1)',
          color: '#fff',
          fontSize: 13,
          fontWeight: 600,
          cursor: 'pointer',
          width: '100%'
        }}
      >
        <User size={16} style={{ color: '#9a9aa3' }} />
        <span style={{ flex: 1, textAlign: 'left' }}>{role}</span>
        <ChevronDown size={14} style={{ color: '#9a9aa3', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>

      {open && (
        <div style={{
          position: 'absolute',
          bottom: 'calc(100% + 6px)',
          left: 0,
          right: 0,
          background: '#25252b',
          border: '1px solid var(--nav-border)',
          borderRadius: 10,
          padding: 6,
          boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
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
                color: role === r ? '#fff' : '#9a9aa3',
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
