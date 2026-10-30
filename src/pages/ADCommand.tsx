import { useState } from 'react';
import { useApp } from '../App';
import type { Page } from '../App';
import { minutesOf, shootDate } from '../data/derive';
import { NoCallSheet, NothingYet } from '../components/EmptyState';
import { Clock, AlertCircle, Radio, ArrowRight } from 'lucide-react';

// Only departments with a real page to land on are clickable — Props and
// Art Department are status-only by design (BUILD_SPEC.md), so Camera,
// Sound, Talent, and Location stay plain text until that changes.
const DEPARTMENT_LINK: Record<string, Page> = {
  'Wardrobe': 'wardrobe',
  'Set/Props': 'continuity',
};

// "2 min ago" while it's recent — that's what you actually scan for; once
// it's far enough back that "ago" stops being useful at a glance, fall
// back to the full date (the call sheet's shoot date) and time instead.
function relativeTime(timestamp: string, nowStr: string, date: string): string {
  const diff = minutesOf(nowStr) - minutesOf(timestamp);
  if (diff <= 0) return 'just now';
  if (diff < 60) return `${diff} min ago`;
  return `${date}, ${timestamp}`;
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
  const { role, holdState, setHoldState, lightingReady, actorReady, setPage, production } = useApp();
  const [openDetails, setOpenDetails] = useState<Set<string>>(new Set());

  if (!production) return <NoCallSheet />;
  const { callSheet: cs, day } = production;
  if (!day) {
    return (
      <NothingYet
        title="No setups recorded yet"
        body="The readiness board fills in once the 1st AD calls the first setup and departments start reporting."
      />
    );
  }
  const setup = day.currentSetup;
  const date = shootDate(cs);

  const allReady = lightingReady && actorReady;
  // Blocked departments lead regardless of age — that's the thing the AD
  // actually needs to spot first; recency only breaks ties within a status.
  const statusRank = { notReady: 0, inProgress: 1, ready: 2 } as const;
  const feed = [...setup.departmentStatuses].sort((a, b) =>
    statusRank[a.status] - statusRank[b.status] || minutesOf(b.timestamp) - minutesOf(a.timestamp)
  );

  // The board's numbers, from the day's record. Background Hold only shows
  // when the day has background to hold.
  const boardStats = [
    { label: 'Predicted Roll', value: day.board.predictedRoll, tone: 'var(--ink)' },
    { label: 'Current Hold', value: day.board.currentHold, tone: 'var(--bronze-text)' },
    ...(day.board.nextSceneRisk ? [{ label: 'Next Scene Risk', value: day.board.nextSceneRisk, tone: 'var(--bronze-text)' }] : []),
    ...(day.board.backgroundHold ? [{ label: 'Background Hold', value: day.board.backgroundHold, tone: 'var(--bronze-text)' }] : []),
  ];

  const toggleDetails = (key: string) => {
    const next = new Set(openDetails);
    next.has(key) ? next.delete(key) : next.add(key);
    setOpenDetails(next);
  };

  return (
    <div style={{ padding: '32px 28px', maxWidth: 960 }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: 'italic', fontSize: 22, fontWeight: 700, letterSpacing: '-0.01em', marginBottom: 4, color: 'var(--ink-warm)' }}>
          AD Command
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 14 }}>
          Full crew readiness · Setup {setup.setupNumber} · Scene {setup.scene} · {cs.show.episodeTitle ?? cs.show.title}
        </p>
      </div>

      {/* Big status — the one Big Caslon display moment on this screen
          (DESIGN.md's One Display Rule): the HOLD / READY TO ROLL word is
          the whole point of AD Command, so it's the single place real
          scale and the display face are spent. Soft shadow for lift, per
          the system's own Elevation & Depth rule — not an exception. */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
      <div className="card" style={{ display: 'inline-block', padding: '10px 28px 16px', borderRadius: 24, textAlign: 'center', boxShadow: 'var(--shadow-lg)' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted-dim)', marginBottom: 3 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: holdState === 'hold' ? 'var(--stop-red)' : 'var(--teal)', flexShrink: 0 }} />
          Setup {setup.setupNumber} — {holdState === 'hold' ? 'HOLD' : 'READY'}
        </div>
        <div className={`big-status ${holdState === 'hold' ? 'hold' : 'ready'}`} style={{ fontSize: 42, marginBottom: 3 }}>
          {holdState === 'hold' ? 'HOLD' : 'READY TO ROLL'}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginTop: 8, flexWrap: 'wrap' }}>
          {boardStats.map(stat => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <div className="section-label" style={{ marginBottom: 1, fontSize: 9 }}>{stat.label}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: stat.tone }} className="mono">{stat.value}</div>
            </div>
          ))}
        </div>
        {/* Mock-state gate, not real auth — matches the one rule every
            governance doc repeats: only the 1st AD clears a hold. The real
            enforcement is the "only 1st ad can update setup status" RLS
            policy in 0001_initial_schema.sql; this is defense-in-depth
            against the current fake role-switcher until real auth lands. */}
        {allReady && holdState === 'hold' && role === '1st AD' && (
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
      <div className="section-label" style={{ marginBottom: 10, color: 'var(--ink)', fontFamily: "'Playfair Display', Georgia, serif", fontStyle: 'italic', fontWeight: 700, fontSize: 16, textTransform: 'none', letterSpacing: '0' }}>Blockers first</div>
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
                  background: dept.status === 'ready' ? 'var(--teal)' : dept.status === 'inProgress' ? 'var(--bronze)' : 'var(--stop-red)'
                }} />
                {DEPARTMENT_LINK[dept.department] ? (
                  <button
                    onClick={() => setPage(DEPARTMENT_LINK[dept.department])}
                    title={`Open ${dept.department}`}
                    style={{
                      fontSize: 13, fontWeight: 700, color: 'var(--teal-text)', whiteSpace: 'nowrap',
                      border: 'none', background: 'none', padding: 0, cursor: 'pointer', textDecoration: 'underline',
                      textDecorationColor: 'rgba(138,180,199,0.4)'
                    }}
                  >
                    {dept.department}
                  </button>
                ) : (
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)', whiteSpace: 'nowrap' }}>{dept.department}</span>
                )}
                {/* The pill carries both status and recency together —
                    the single most important fact about this chip, in
                    one place, not split across two labels. */}
                <span className={`pill ${
                  dept.status === 'ready' ? 'pill-ready' :
                  dept.status === 'inProgress' ? 'pill-risk' : 'pill-hold'
                }`} style={{ padding: '2px 7px', fontSize: 10, whiteSpace: 'nowrap' }}>
                  {dept.status === 'ready' ? 'Ready' : dept.status === 'inProgress' ? 'In Progress' : 'Not Ready'}
                  <span className="mono" style={{ opacity: 0.8, textTransform: 'none' }}>· {relativeTime(dept.timestamp, day.currentTime, date)}</span>
                </span>
              </div>

              <button
                onClick={() => toggleDetails(dept.department)}
                style={{ alignSelf: 'flex-start', border: 'none', background: 'none', cursor: 'pointer', padding: 0, fontSize: 11, fontWeight: 600, color: 'var(--teal-text)' }}
              >
                ··· {detailsOpen ? 'Hide' : 'Details'}
              </button>

              {/* Body — Playfair Display throughout, same as the rest of
                  the system (one voice, per DESIGN.md's One Display
                  Rule — no second typeface). Only rendered once asked
                  for — today's task first, history (if any) underneath. */}
              {detailsOpen && (
                <div>
                  <div style={{ fontWeight: 600, fontSize: 12, color: 'var(--muted)', marginBottom: 3, letterSpacing: '0.01em' }}>
                    {dept.owner}
                  </div>
                  <div style={{ fontWeight: 400, fontSize: 13, color: 'var(--ink)', lineHeight: 1.5 }}>
                    {dept.currentTask}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 5 }}>
                    {dept.eta && (
                      <span className="mono" style={{ fontSize: 11, color: 'var(--bronze-text)', fontWeight: 600 }}>ETA {dept.eta}</span>
                    )}
                    {dept.blockerCount > 0 && (
                      <span style={{ fontWeight: 600, fontSize: 11, color: 'var(--stop-red-text)' }}>
                        {dept.blockerCount} blocker{dept.blockerCount > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                  {dept.history && dept.history.length > 0 && (
                    <div style={{ borderTop: '1px solid var(--border)', marginTop: 8, paddingTop: 6 }}>
                      {dept.history.map((h, hi) => (
                        <div key={hi} style={{ display: 'flex', gap: 8, fontSize: 11, color: 'var(--muted-dim)', marginBottom: 2 }}>
                          <span className="mono" style={{ flexShrink: 0 }}>{h.timestamp}</span>
                          <span>{h.note}</span>
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
