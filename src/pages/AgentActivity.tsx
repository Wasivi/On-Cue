import { useApp } from '../App';
import { production } from '../data/seed';
import { CheckCircle, AlertCircle, Radio, Clapperboard, Bell, Activity } from 'lucide-react';
import type { AgentEvent } from '../types';

const kindMeta: Record<AgentEvent['kind'], { icon: React.ReactNode; color: string }> = {
  ready: { icon: <CheckCircle size={16} />, color: 'var(--teal)' },
  hold: { icon: <AlertCircle size={16} />, color: 'var(--amber)' },
  roll: { icon: <Radio size={16} />, color: 'var(--violet)' },
  take: { icon: <Clapperboard size={16} />, color: 'var(--text-secondary)' },
  info: { icon: <Bell size={16} />, color: 'var(--text-muted)' }
};

export default function AgentActivity() {
  const { events } = useApp();
  const ordered = [...events].reverse();

  return (
    <div style={{ padding: '32px 28px', maxWidth: 840 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 4 }}>
          Agent Activity
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
          Event routing & authorization log · {production.title} · Episode {production.episode} · Shoot Day {production.shootDay}
        </p>
      </div>

      <div className="card" style={{ padding: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 16 }}>
          {ordered.length} event{ordered.length === 1 ? '' : 's'} this session
        </div>

        {ordered.length === 0 ? (
          <div style={{ padding: '32px 12px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: 13 }}>
            <Activity size={28} style={{ color: 'var(--text-muted)', marginBottom: 10 }} />
            <div>No activity yet.</div>
            <div style={{ marginTop: 4, color: 'var(--text-muted)' }}>
              Actions on My Set, AD Command, Lighting Console, and Wardrobe & Talent route here the moment they happen — who did what, and what it authorized.
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {ordered.map(evt => {
              const meta = kindMeta[evt.kind];
              return (
                <div
                  key={evt.id}
                  className="animate-slide-in"
                  style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: 12, background: 'var(--workspace-bg)', borderRadius: 3 }}
                >
                  <div style={{ color: meta.color, marginTop: 2, flexShrink: 0 }}>{meta.icon}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 13, fontWeight: 700 }}>{evt.action}</span>
                      <span className="pill pill-wait" style={{ fontSize: 10, padding: '2px 8px' }}>{evt.role}</span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{evt.detail}</div>
                  </div>
                  <span className="mono" style={{ fontSize: 11, color: 'var(--text-muted)', flexShrink: 0 }}>{evt.time}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
