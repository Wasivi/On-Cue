import { useApp } from '../App';
import { minutesOf } from '../data/derive';
import { NoCallSheet, NothingYet } from '../components/EmptyState';
import { Clock, Lightbulb, AlertTriangle, CheckCircle } from 'lucide-react';

export default function TakeIntelligence() {
  const { production } = useApp();
  if (!production) return <NoCallSheet />;
  const { day } = production;
  if (!day) {
    return (
      <NothingYet
        title="No takes to learn from yet"
        body="Time lost, turnaround, and recovery suggestions build up from the day's takes once the first setup rolls."
      />
    );
  }

  const setup = day.currentSetup;
  const timeLoss = [...day.timeLoss].sort((a, b) => b.minutes - a.minutes);
  const totalLost = timeLoss.reduce((a, b) => a + b.minutes, 0);
  const usableTakes = setup.takes.filter(t => t.result === 'print').length;
  // Average gap between consecutive takes on this setup, from the times
  // they were logged.
  const gaps = setup.takes.slice(1).map((t, i) => minutesOf(t.timestamp) - minutesOf(setup.takes[i].timestamp));
  const avgTurnaround = gaps.length > 0 ? `${Math.round(gaps.reduce((a, b) => a + b, 0) / gaps.length)} min` : '—';

  return (
    <div style={{ padding: '32px 28px', maxWidth: 960 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: 'italic', fontSize: 22, fontWeight: 700, color: 'var(--ink-warm)', marginBottom: 4 }}>
          Take Intelligence
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 14 }}>
          Recovery insights · Setup {setup.setupNumber} · Scene {setup.scene}
        </p>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12, marginBottom: 20 }}>
        <div className="card" style={{ padding: 20, textAlign: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--ink)', letterSpacing: '-0.03em' }}>{setup.takes.length}</div>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted-dim)', letterSpacing: '0.06em' }}>Total Takes</div>
        </div>
        <div className="card" style={{ padding: 20, textAlign: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--teal-text)', letterSpacing: '-0.03em' }}>{usableTakes}</div>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted-dim)', letterSpacing: '0.06em' }}>Usable Takes</div>
        </div>
        <div className="card" style={{ padding: 20, textAlign: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--bronze-text)', letterSpacing: '-0.03em' }} className="mono">{avgTurnaround}</div>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted-dim)', letterSpacing: '0.06em' }}>Avg Turnaround</div>
        </div>
        <div className="card" style={{ padding: 20, textAlign: 'center' }}>
          <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--stop-red-text)', letterSpacing: '-0.03em' }} className="mono">{totalLost}m</div>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted-dim)', letterSpacing: '0.06em' }}>Time Lost</div>
        </div>
      </div>

      {/* Insight card — an agent's suggestion; a person decides whether to act on it */}
      {day.insight && (
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: 16, padding: 20,
          background: 'rgba(230,184,0,0.12)', borderRadius: 12, marginBottom: 20, border: '1px solid rgba(230,184,0,0.3)'
        }}>
          <Lightbulb size={24} style={{ color: 'var(--bronze-text)', flexShrink: 0, marginTop: 2 }} />
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--bronze-text)', marginBottom: 4 }}>
              Recovery Suggestion
            </div>
            <div style={{ fontSize: 13, color: 'var(--bronze-text)', lineHeight: 1.6 }}>
              {day.insight}
            </div>
          </div>
        </div>
      )}

      {/* Delay breakdown */}
      {timeLoss.length > 0 && (
        <div className="card" style={{ padding: 24, marginBottom: 20 }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted-dim)', marginBottom: 20 }}>
            Time Lost by Cause
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {timeLoss.map(item => (
              <div key={item.cause}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{item.cause}</span>
                  <span style={{ fontSize: 12, color: 'var(--muted-dim)' }} className="mono">
                    {item.minutes} min · {item.setupCount} setup{item.setupCount > 1 ? 's' : ''}
                  </span>
                </div>
                <div style={{ height: 8, borderRadius: 4, background: 'var(--paper)', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', width: `${totalLost > 0 ? (item.minutes / totalLost) * 100 : 0}%`,
                    background: item.cause.includes('Lighting') ? 'var(--bronze)' : item.cause.includes('Actor') ? 'var(--stop-red)' : 'var(--muted)',
                    borderRadius: 4
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pattern table */}
      {day.setupHistory.length > 0 && (
        <div className="card" style={{ padding: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted-dim)', marginBottom: 16 }}>
            Recent Setup Performance
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {day.setupHistory.map(s => (
              <div key={s.setup} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: 12,
                background: s.current ? 'rgba(201,162,39,0.14)' : 'var(--paper)',
                borderRadius: 8
              }}>
                <span className="mono" style={{ fontSize: 13, fontWeight: 700, minWidth: 50, color: 'var(--ink)' }}>{s.setup}</span>
                <span style={{ fontSize: 12, color: 'var(--muted)', minWidth: 80 }}>{s.takes} takes</span>
                <span style={{ fontSize: 12, color: 'var(--teal-text)', minWidth: 80, fontWeight: 600 }}>{s.usable} usable</span>
                <span style={{ fontSize: 12, color: 'var(--muted)', flex: 1 }}>{s.issue}</span>
                {s.current && (
                  <span className="pill pill-risk"><Clock size={11} /> In Progress</span>
                )}
                {!s.current && s.usable >= 2 && (
                  <span className="pill pill-ready"><CheckCircle size={11} /> Good</span>
                )}
                {!s.current && s.usable < 2 && (
                  <span className="pill pill-hold"><AlertTriangle size={11} /> Heavy</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
