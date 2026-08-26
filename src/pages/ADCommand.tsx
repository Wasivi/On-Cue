import { useEffect, useState } from 'react';
import { useApp } from '../App';
import { production } from '../data/seed';
import { Clock, AlertCircle, CheckCircle, Radio, ArrowRight, Sunrise, Flag, CloudRain, Film } from 'lucide-react';
import AckButton from '../components/AckButton';

function formatElapsed(ms: number) {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function ADCommand() {
  const { holdState, lightingReady, actorReady, holdStartedAt, takes, clearHold, rollCamera, setPage, logAction } = useApp();
  const setup = production.currentSetup;

  const allReady = lightingReady && actorReady;
  const readinessColor = production.overallReadiness >= 85 ? 'var(--teal)' : production.overallReadiness >= 60 ? '#7a4a0a' : 'var(--red)';

  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (holdState !== 'hold') return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [holdState]);

  const elapsedHold = formatElapsed(now - holdStartedAt);

  const bannerColor = holdState === 'hold' ? 'var(--red)' : holdState === 'ready' ? 'var(--teal)' : 'var(--violet)';
  const bannerLabel = holdState === 'hold' ? 'HOLD' : holdState === 'ready' ? 'READY TO ROLL' : 'ROLLING';

  return (
    <div style={{ padding: '32px 28px', maxWidth: 960 }}>
      <div style={{ marginBottom: 16 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 4 }}>
          AD Command
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
          Full crew readiness · Setup {setup.setupNumber} · Scene {setup.scene}
        </p>
      </div>

      {/* Day frame */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24, flexWrap: 'wrap' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-secondary)' }}>
          <Clock size={14} style={{ color: 'var(--text-muted)' }} />
          Call <span className="mono">{production.callTime}</span>
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-secondary)' }}>
          <Sunrise size={14} style={{ color: 'var(--text-muted)' }} />
          First shot <span className="mono">{production.firstShot}</span>
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-secondary)' }}>
          <Flag size={14} style={{ color: 'var(--text-muted)' }} />
          Wrap target <span className="mono">{production.wrapTarget}</span>
        </span>
        {production.weather && (
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-secondary)' }}>
            <CloudRain size={14} style={{ color: 'var(--text-muted)' }} />
            {production.weather}
          </span>
        )}
      </div>

      {/* Big status */}
      <div className="card" role="status" aria-live="polite" style={{ padding: 32, marginBottom: 20, textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: 12 }}>
          <span aria-hidden="true" style={{ width: 8, height: 8, borderRadius: '50%', background: bannerColor, flexShrink: 0 }} />
          Setup {setup.setupNumber} — {bannerLabel}
        </div>
        <div style={{ fontSize: 42, fontWeight: 800, color: bannerColor, letterSpacing: '-0.03em', marginBottom: 8 }}>
          {holdState === 'hold' ? 'HOLD' : holdState === 'ready' ? 'READY TO ROLL' : `ROLLING — TAKE ${takes.length + 1}`}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, marginTop: 16, flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.06em' }}>Predicted Roll</div>
            <div style={{ fontSize: 18, fontWeight: 700 }} className="mono">{setup.targetRoll}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.06em' }}>
              {holdState === 'hold' ? 'Current Hold' : holdState === 'ready' ? 'Status' : 'Rolling For'}
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: holdState === 'hold' ? '#7a4a0a' : holdState === 'ready' ? 'var(--teal)' : 'var(--violet)' }} className="mono">
              {holdState === 'hold' ? elapsedHold : holdState === 'ready' ? 'Cleared' : elapsedHold}
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.06em' }}>Next Scene Risk</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: holdState === 'hold' ? '#7a4a0a' : 'var(--teal)' }} className="mono">
              {holdState === 'hold' ? '+12 min late' : 'On track'}
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.06em' }}>Overall Readiness</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: readinessColor }} className="mono">{production.overallReadiness}%</div>
          </div>
        </div>

        {allReady && holdState === 'hold' && (
          <button
            onClick={clearHold}
            className="btn btn-primary"
            style={{ marginTop: 24, padding: '14px 32px', fontSize: 15 }}
          >
            <Radio size={18} />
            Clear Hold — Roll When Ready
          </button>
        )}
        {holdState === 'ready' && (
          <button
            onClick={rollCamera}
            className="btn btn-primary"
            style={{ marginTop: 24, padding: '14px 32px', fontSize: 15 }}
          >
            <Radio size={18} />
            Roll Camera
          </button>
        )}
        {holdState === 'rolling' && (
          <button
            onClick={() => setPage('livetake')}
            className="btn btn-secondary"
            style={{ marginTop: 24, padding: '14px 32px', fontSize: 15 }}
          >
            <Film size={18} />
            Record Outcome on Live Take
          </button>
        )}
      </div>

      {/* Department grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
        {setup.departmentStatuses.map(dept => (
          <div key={dept.department} className="card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 13, fontWeight: 700 }}>{dept.department}</span>
              <span className={`pill ${
                dept.status === 'ready' ? 'pill-ready' :
                dept.status === 'inProgress' ? 'pill-risk' : 'pill-hold'
              }`}>
                {dept.status === 'ready' ? <CheckCircle size={11} /> :
                 dept.status === 'inProgress' ? <Clock size={11} /> : <AlertCircle size={11} />}
                {dept.status === 'ready' ? 'Ready' : dept.status === 'inProgress' ? 'In Progress' : 'Not Ready'}
              </span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8 }}>
              {dept.owner}
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-primary)', marginBottom: 8, lineHeight: 1.5 }}>
              {dept.currentTask}
            </div>
            {dept.eta && (
              <div style={{ fontSize: 12, color: '#7a4a0a', fontWeight: 600 }} className="mono">
                ETA: {dept.eta}
              </div>
            )}
            {dept.blockerCount > 0 && (
              <div style={{ fontSize: 12, color: 'var(--red)', fontWeight: 600, marginTop: 6 }}>
                {dept.blockerCount} blocker{dept.blockerCount > 1 ? 's' : ''}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 10, marginTop: 20, flexWrap: 'wrap' }}>
        <AckButton
          label="Send 5-Min Check-in"
          icon={<Clock size={16} />}
          onAck={() => logAction('5-minute check-in sent', 'Sent to all departments on Setup ' + setup.setupNumber)}
        />
        <AckButton
          label="Reorder Next Setup"
          icon={<ArrowRight size={16} />}
          onAck={() => logAction('Next setup reordered', '1st AD moved a later setup earlier in the day')}
        />
        <AckButton
          label="Escalate Blocker"
          icon={<AlertCircle size={16} />}
          variant="danger"
          onAck={() => logAction('Blocker escalated', 'Escalated current blocker to Producer for schedule-risk approval')}
        />
      </div>
    </div>
  );
}
