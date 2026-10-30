import { useApp } from '../App';
import { NoCallSheet, NothingYet } from '../components/EmptyState';
import { DollarSign, AlertTriangle, ShieldAlert } from 'lucide-react';

const fmt = (n: number) => `$${n.toLocaleString('en-US')}`;

export default function BudgetImpact() {
  const { role, production } = useApp();

  // The one rule every governance doc repeats about this page: dollars are
  // UPM and Producer only, the 1st AD never sees them. Gating it here, not
  // just by hiding a nav tab, so the restriction is real even if someone
  // lands on this page directly.
  if (role !== 'UPM' && role !== 'Producer') {
    return (
      <div style={{ padding: '32px 28px', maxWidth: 640 }}>
        <div className="card" style={{ padding: 32, textAlign: 'center' }}>
          <ShieldAlert size={28} style={{ color: 'var(--muted-dim)', marginBottom: 12 }} />
          <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)', marginBottom: 8 }}>
            Budget Impact is restricted
          </h2>
          <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>
            Cost figures are visible to the UPM and Producer only — everyone else, including the 1st AD,
            sees minutes lost on Take Intelligence instead of a dollar figure. Switch role to UPM or
            Producer to view this page.
          </p>
        </div>
      </div>
    );
  }

  if (!production) return <NoCallSheet />;
  const budget = production.prep?.budget;
  if (!budget) {
    return (
      <NothingYet
        title="No budget entered yet"
        body="The UPM enters each department's allocation once, during prep. Cost impact appears here as soon as it's in."
      />
    );
  }
  const { callSheet: cs, day } = production;
  const setup = day?.currentSetup;
  // The same time-lost breakdown Take Intelligence shows, priced at the
  // budget's blended cost of a minute lost.
  const timeLoss = day?.timeLoss ?? [];
  const costPerMinute = budget.costPerMinuteLost;
  const departmentBudgets = budget.departments;

  const totalMinutesLost = timeLoss.reduce((a, b) => a + b.minutes, 0);
  const totalCostImpact = totalMinutesLost * costPerMinute;
  const biggestCause = [...timeLoss].sort((a, b) => b.minutes - a.minutes)[0];
  const totalAllocated = departmentBudgets.reduce((a, b) => a + b.allocated, 0);
  const totalSpent = departmentBudgets.reduce((a, b) => a + b.spent, 0);

  return (
    <div style={{ padding: '32px 28px', maxWidth: 960 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: 'italic', fontSize: 22, fontWeight: 700, color: 'var(--ink-warm)', marginBottom: 4 }}>
          Budget Impact
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 14 }}>
          UPM view{setup ? ` · Setup ${setup.setupNumber} · Scene ${setup.scene}` : ''} · visible to UPM and Producer only
        </p>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12, marginBottom: 20 }}>
        <div className="card" style={{ padding: 20, textAlign: 'center' }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--stop-red-text)', letterSpacing: '-0.02em' }} className="mono">
            {fmt(totalCostImpact)}
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted-dim)', letterSpacing: '0.06em' }}>Cost Impact Today</div>
        </div>
        <div className="card" style={{ padding: 20, textAlign: 'center' }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--bronze-text)', letterSpacing: '-0.01em' }}>{biggestCause ? biggestCause.cause : '—'}</div>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted-dim)', letterSpacing: '0.06em' }}>Biggest Cost Driver</div>
        </div>
        <div className="card" style={{ padding: 20, textAlign: 'center' }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--ink)', letterSpacing: '-0.02em' }} className="mono">
            {Math.round((totalSpent / totalAllocated) * 100)}%
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted-dim)', letterSpacing: '0.06em' }}>Budget Utilized</div>
        </div>
      </div>

      {/* Cost by cause — same breakdown Take Intelligence shows in minutes,
          translated to dollars for this audience only. */}
      <div className="card" style={{ padding: 24, marginBottom: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted-dim)', marginBottom: 20 }}>
          Cost Impact by Cause
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[...timeLoss].sort((a, b) => b.minutes - a.minutes).map(item => {
            const cost = item.minutes * costPerMinute;
            return (
              <div key={item.cause}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{item.cause}</span>
                  <span style={{ fontSize: 12, color: 'var(--muted-dim)' }} className="mono">
                    {fmt(cost)} · {item.minutes} min lost
                  </span>
                </div>
                <div style={{ height: 8, borderRadius: 4, background: 'var(--paper)', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', width: `${totalCostImpact > 0 ? (cost / totalCostImpact) * 100 : 0}%`,
                    background: item.cause.includes('Lighting') ? 'var(--bronze)' : item.cause.includes('Actor') ? 'var(--stop-red)' : 'var(--muted)',
                    borderRadius: 4
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Department allocation — allocated vs. spent, overspend flagged. */}
      <div className="card" style={{ padding: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted-dim)', marginBottom: 16 }}>
          Department Spend — Shoot Day {cs.shootDay}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {departmentBudgets.map(d => {
            const pct = d.spent / d.allocated;
            const atRisk = pct >= 0.9;
            return (
              <div key={d.department} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: 12,
                background: atRisk ? 'rgba(201,162,39,0.14)' : 'var(--paper)', borderRadius: 8
              }}>
                <DollarSign size={14} style={{ color: 'var(--muted-dim)', flexShrink: 0 }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)', minWidth: 90 }}>{d.department}</span>
                <span style={{ fontSize: 12, color: 'var(--muted)', flex: 1 }} className="mono">
                  {fmt(d.spent)} / {fmt(d.allocated)}
                </span>
                {atRisk && (
                  <span className="pill pill-risk"><AlertTriangle size={11} /> {Math.round(pct * 100)}% used</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
