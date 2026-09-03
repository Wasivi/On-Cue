import { useState } from 'react';
import { useApp } from '../App';
import { production } from '../data/seed';
import { Clock, AlertCircle, Radio, ArrowRight } from 'lucide-react';

// "2:14 PM" → minutes since midnight, so the feed can sort on the actual
// time rather than the order departments happen to be authored in.
function parseClock(t: string): number {
  const m = t.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!m) return 0;
  let h = parseInt(m[1], 10);
  const min = parseInt(m[2], 10);
  const ap = m[3].toUpperCase();
  if (ap === 'PM' && h !== 12) h += 12;
  if (ap === 'AM' && h === 12) h = 0;
  return h * 60 + min;
}

// The one date this whole demo happens on — there's no real calendar in
// the seed data, just times-of-day, so the "too long ago" fallback below
// needs somewhere to anchor a full date.
const SHOOT_DATE = 'Sep 2, 2026';

// "2 min ago" while it's recent — that's what you actually scan for; once
// it's far enough back that "ago" stops being useful at a glance, fall
// back to the full date and time instead.
function relativeTime(timestamp: string, nowStr: string): string {
  const diff = parseClock(nowStr) - parseClock(timestamp);
  if (diff <= 0) return 'just now';
  if (diff < 60) return `${diff} min ago`;
  return `${SHOOT_DATE}, ${timestamp}`;
}

// The brick layout: each chip gets an explicit column range but no
// explicit row, so CSS Grid's own auto-placement finds the first row
// where that range is free — which is exactly what makes chip 2 land
// under where chip 1's second block started, chip 3 land further down
// still, and so on, without any manual row bookkeeping. Talent sits
// centered under Set/Props+Lighting; Sound starts at Wardrobe's midpoint
// and runs to the far edge, dropping to its own row below Wardrobe since
// its range overlaps Wardrobe's; Camera sits further left than Sound, its
// own row underneath; Location is the narrowest of the three, its own row
// below Camera.
const BRICK_COLS: [number, number][] = [
  [1, 7], [7, 13], [4, 11], [1, 9], [5, 13], [2, 11], [1, 8],
];

export default function ADCommand() {
  const { holdState, setHoldState, lightingReady, actorReady } = useApp();
  const setup = production.currentSetup;
  const [openDetails, setOpenDetails] = useState<Set<string>>(new Set());

  const allReady = lightingReady && actorReady;
  // Latest report always leads — a feed of what changed, not a fixed grid.
  const feed = [...setup.departmentStatuses].sort((a, b) => parseClock(b.timestamp) - parseClock(a.timestamp));

  const toggleDetails = (key: string) => {
    const next = new Set(openDetails);
    next.has(key) ? next.delete(key) : next.add(key);
    setOpenDetails(next);
  };

  return (
    <div style={{ padding: '32px 28px', maxWidth: 960 }}>
      <div style={{ marginBottom: 20 }}>
        {/* White — this sits directly on the page's dark-to-light gradient,
            not inside a white card, so it needs its own light color. */}
        <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 4, color: '#ffffff' }}>
          AD Command
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 14 }}>
          Full crew readiness · Setup {setup.setupNumber} · Scene {setup.scene} · {production.episodeTitle}
        </p>
      </div>

      {/* Big status — same white card, same content and layout as before;
          just a much smaller, rounder container, centered, with its own
          shadow (a deliberate exception — everything else in this system
          stays flat/shadowless, but this one card is meant to float). */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
      <div className="card" style={{ display: 'inline-block', padding: '6px 20px 12px', borderRadius: 24, textAlign: 'center', boxShadow: '0 10px 28px rgba(10,20,30,0.22)' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: 3 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: holdState === 'hold' ? '#c53030' : '#1a5f7a', flexShrink: 0 }} />
          Setup {setup.setupNumber} — {holdState === 'hold' ? 'HOLD' : 'READY'}
        </div>
        <div className={`big-status ${holdState === 'hold' ? 'hold' : 'ready'}`} style={{ fontSize: 28, marginBottom: 3 }}>
          {holdState === 'hold' ? 'HOLD' : 'READY TO ROLL'}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginTop: 8, flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'center' }}>
            <div className="section-label" style={{ marginBottom: 1, fontSize: 9 }}>Predicted Roll</div>
            <div style={{ fontSize: 13, fontWeight: 700 }} className="mono">2:45 PM</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div className="section-label" style={{ marginBottom: 1, fontSize: 9 }}>Current Hold</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#c9870a' }} className="mono">12 min</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div className="section-label" style={{ marginBottom: 1, fontSize: 9 }}>Next Scene Risk</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#c9870a' }} className="mono">+15 min late</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div className="section-label" style={{ marginBottom: 1, fontSize: 9 }}>Background Hold</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#c9870a' }} className="mono">45 min</div>
          </div>
        </div>
        {allReady && holdState === 'hold' && (
          <button
            onClick={() => setHoldState('ready')}
            className="btn btn-gold"
            style={{ marginTop: 12, padding: '8px 16px', fontSize: 13 }}
          >
            <Radio size={16} />
            Clear Hold — Roll When Ready
          </button>
        )}
      </div>
      </div>

      {/* Department feed — a brick wall, not a grid of identical bars.
          Each chip's status pill carries the recency itself ("2 min ago"),
          collapsed by default; one "···Details" trigger reveals today's
          task and, if there's any, the history underneath it — one place
          to look, not two. */}
      {/* .section-label is already bold and Playfair by inheritance —
          just bigger here, explicit for clarity. */}
      <div className="section-label" style={{ marginBottom: 10, color: 'rgba(255,255,255,0.8)', fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700, fontSize: 16, textTransform: 'none', letterSpacing: '0' }}>Latest first</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 8, marginBottom: 20 }}>
        {feed.map((dept, i) => {
          const detailsOpen = openDetails.has(dept.department);
          const [colStart, colEnd] = BRICK_COLS[i % BRICK_COLS.length];
          return (
            <div
              key={dept.department}
              className="card"
              style={{
                gridColumn: `${colStart} / ${colEnd}`,
                padding: '9px 12px',
                borderRadius: 16,
                display: 'flex', flexDirection: 'column', gap: detailsOpen ? 6 : 0,
                minWidth: 0
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap' }}>
                <span style={{
                  width: 7, height: 7, borderRadius: '50%', flexShrink: 0,
                  background: dept.status === 'ready' ? 'var(--teal)' : dept.status === 'inProgress' ? 'var(--amber)' : 'var(--red)'
                }} />
                <span style={{ fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap' }}>{dept.department}</span>
                {/* The pill carries both status and recency together —
                    the single most important fact about this chip, in
                    one place, not split across two labels. */}
                <span className={`pill ${
                  dept.status === 'ready' ? 'pill-ready' :
                  dept.status === 'inProgress' ? 'pill-risk' : 'pill-hold'
                }`} style={{ padding: '2px 7px', fontSize: 10, whiteSpace: 'nowrap' }}>
                  {dept.status === 'ready' ? 'Ready' : dept.status === 'inProgress' ? 'In Progress' : 'Not Ready'}
                  <span className="mono" style={{ opacity: 0.8, textTransform: 'none' }}>· {relativeTime(dept.timestamp, production.currentTime)}</span>
                </span>
              </div>

              <button
                onClick={() => toggleDetails(dept.department)}
                style={{ alignSelf: 'flex-start', border: 'none', background: 'none', cursor: 'pointer', padding: 0, fontSize: 11, fontWeight: 600, color: 'var(--teal)' }}
              >
                ··· {detailsOpen ? 'Hide' : 'Details'}
              </button>

              {/* Body — Oswald (Engravers' Gothic stand-in); everything
                  above stays Playfair. Only rendered once asked for —
                  today's task first, history (if any) underneath it. */}
              {detailsOpen && (
                <div>
                  <div style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 500, fontSize: 12, color: 'var(--text-secondary)', marginBottom: 3, letterSpacing: '0.01em' }}>
                    {dept.owner}
                  </div>
                  <div style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 400, fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.5 }}>
                    {dept.currentTask}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 5 }}>
                    {dept.eta && (
                      <span className="mono" style={{ fontSize: 11, color: '#c9870a', fontWeight: 600 }}>ETA {dept.eta}</span>
                    )}
                    {dept.blockerCount > 0 && (
                      <span style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 600, fontSize: 11, color: '#c53030' }}>
                        {dept.blockerCount} blocker{dept.blockerCount > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                  {dept.history && dept.history.length > 0 && (
                    <div style={{ borderTop: '1px solid var(--border)', marginTop: 8, paddingTop: 6 }}>
                      {dept.history.map((h, hi) => (
                        <div key={hi} style={{ display: 'flex', gap: 8, fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>
                          <span className="mono" style={{ flexShrink: 0 }}>{h.timestamp}</span>
                          <span style={{ fontFamily: "'Oswald', sans-serif" }}>{h.note}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button className="btn btn-secondary" style={{ padding: '7px 14px', fontSize: 12 }}>
          <Clock size={14} /> Send 5-Min Check-in
        </button>
        <button className="btn btn-secondary" style={{ padding: '7px 14px', fontSize: 12 }}>
          <ArrowRight size={14} /> Reorder Next Setup
        </button>
        <button className="btn btn-danger" style={{ padding: '7px 14px', fontSize: 12 }}>
          <AlertCircle size={14} /> Escalate Blocker
        </button>
      </div>
    </div>
  );
}
