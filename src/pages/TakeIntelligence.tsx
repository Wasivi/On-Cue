import { production, timeLossData } from '../data/seed';
import { Clock, Lightbulb, AlertTriangle, CheckCircle } from 'lucide-react';

export default function TakeIntelligence() {
  const setup = production.currentSetup;
  const totalLost = timeLossData.reduce((a, b) => a + b.minutes, 0);
  const usableTakes = setup.takes.filter(t => t.result === 'print').length;

  return (
    <div style={{ padding: '32px 28px', maxWidth: 960 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 4 }}>
          Take Intelligence
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
          Recovery insights · Setup {setup.setupNumber} · Scene {setup.scene}
        </p>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12, marginBottom: 20 }}>
        <div className="card" style={{ padding: 20, textAlign: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>{setup.takes.length}</div>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.06em' }}>Total Takes</div>
        </div>
        <div className="card" style={{ padding: 20, textAlign: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--teal)', letterSpacing: '-0.03em' }}>{usableTakes}</div>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.06em' }}>Usable Takes</div>
        </div>
        <div className="card" style={{ padding: 20, textAlign: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--amber)', letterSpacing: '-0.03em' }} className="mono">4m 12s</div>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.06em' }}>Avg Turnaround</div>
        </div>
        <div className="card" style={{ padding: 20, textAlign: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--red)', letterSpacing: '-0.03em' }} className="mono">{totalLost}m</div>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.06em' }}>Time Lost</div>
        </div>
      </div>

      {/* Insight card */}
      <div style={{ 
        display: 'flex', alignItems: 'flex-start', gap: 16, padding: 20, 
        background: 'var(--violet-light)', borderRadius: 12, marginBottom: 20, border: '1px solid #ddd6fe'
      }}>
        <Lightbulb size={24} style={{ color: 'var(--violet)', flexShrink: 0, marginTop: 2 }} />
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--violet)', marginBottom: 4 }}>
            Recovery Suggestion
          </div>
          <div style={{ fontSize: 13, color: '#5b21b6', lineHeight: 1.6 }}>
            Lighting contributed to delays in 3 of the past 5 setups. Consider pre-lighting Scene 43 while talent resets for current setup. This could recover 8–10 minutes on the day.
          </div>
        </div>
      </div>

      {/* Delay breakdown */}
      <div className="card" style={{ padding: 24, marginBottom: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 20 }}>
          Time Lost by Cause
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {timeLossData.sort((a, b) => b.minutes - a.minutes).map(item => (
            <div key={item.cause}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{item.cause}</span>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }} className="mono">
                  {item.minutes} min · {item.setupCount} setup{item.setupCount > 1 ? 's' : ''}
                </span>
              </div>
              <div style={{ height: 8, borderRadius: 4, background: 'var(--workspace-bg)', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: `${(item.minutes / totalLost) * 100}%`,
                  background: item.cause.includes('Lighting') ? 'var(--amber)' : item.cause.includes('Actor') ? 'var(--red)' : 'var(--text-muted)',
                  borderRadius: 4
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pattern table */}
      <div className="card" style={{ padding: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 16 }}>
          Recent Setup Performance
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { setup: '14B', takes: 6, usable: 1, issue: 'Actor + lighting', status: 'current' },
            { setup: '14A', takes: 4, usable: 2, issue: 'Lighting', status: 'done' },
            { setup: '13B', takes: 3, usable: 2, issue: 'Sound', status: 'done' },
            { setup: '13A', takes: 2, usable: 2, issue: 'None', status: 'done' },
            { setup: '12B', takes: 5, usable: 1, issue: 'Actor performance', status: 'done' },
          ].map(s => (
            <div key={s.setup} style={{ 
              display: 'flex', alignItems: 'center', gap: 12, padding: 12, 
              background: s.status === 'current' ? 'var(--amber-light)' : 'var(--workspace-bg)',
              borderRadius: 8 
            }}>
              <span className="mono" style={{ fontSize: 13, fontWeight: 700, minWidth: 50 }}>{s.setup}</span>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)', minWidth: 80 }}>{s.takes} takes</span>
              <span style={{ fontSize: 12, color: 'var(--teal)', minWidth: 80, fontWeight: 600 }}>{s.usable} usable</span>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)', flex: 1 }}>{s.issue}</span>
              {s.status === 'current' && (
                <span className="pill pill-risk"><Clock size={11} /> In Progress</span>
              )}
              {s.status === 'done' && s.usable >= 2 && (
                <span className="pill pill-ready"><CheckCircle size={11} /> Good</span>
              )}
              {s.status === 'done' && s.usable < 2 && (
                <span className="pill pill-hold"><AlertTriangle size={11} /> Heavy</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
