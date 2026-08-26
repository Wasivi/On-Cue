import { useApp } from '../App';
import { production, roleDescriptions } from '../data/seed';
import { Clock, MapPin, AlertCircle, CheckCircle, XCircle, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import AckButton from '../components/AckButton';

type RoleButton = {
  label: string;
  primary?: boolean;
  danger?: boolean;
  onClick: () => void;
  /** Ties this button to real, already-tracked app state instead of a local acknowledge. */
  real?: 'lighting' | 'actor' | 'print' | 'hold' | 'noGood';
};

export default function MySet() {
  const { role, holdState, lightingReady, actorReady, markLightingReady, markActorReady, recordTakeOutcome, logAction } = useApp();
  const setup = production.currentSetup;
  const [takeDecided, setTakeDecided] = useState(false);

  const decideTake = (result: 'print' | 'hold' | 'noGood') => {
    if (takeDecided) return;
    setTakeDecided(true);
    if (result === 'print') {
      recordTakeOutcome('print', [], 'Printed from My Set quick action');
    } else if (result === 'hold') {
      recordTakeOutcome('hold', ['Director wants another option'], 'Held for director review');
    } else {
      recordTakeOutcome('noGood', ['Actor performance / line', 'Lighting adjustment'], 'Actor missed final line, key light shifted');
    }
  };

  const getRoleContent = (): { action: string; detail: string; target: string; buttons: RoleButton[] } => {
    switch (role) {
      case 'Gaffer':
        return {
          action: 'Adjust key light for actor mark 2',
          detail: 'Current: Key light shifted during Take 5 movement. Move 18 inches camera-left, soften to f/2.8 equivalent.',
          target: '10:40 AM',
          buttons: [
            { label: 'Lighting Ready', primary: true, real: 'lighting', onClick: markLightingReady },
            { label: 'Need 5 Minutes', onClick: () => logAction('Need 5 minutes', 'Gaffer requested a short extension') },
            { label: 'Equipment Issue', danger: true, onClick: () => logAction('Equipment issue flagged', 'Gaffer flagged an equipment problem') }
          ]
        };
      case 'Wardrobe':
        return {
          action: 'Confirm Detective Vale, Look 3, continuity-ready',
          detail: 'Coat damp on left shoulder; left cuff rolled once. Reset from rain tower required before next take.',
          target: '10:39 AM',
          buttons: [
            { label: 'Actor Ready', primary: true, real: 'actor', onClick: markActorReady },
            { label: 'Continuity Issue', danger: true, onClick: () => logAction('Continuity issue flagged', 'Detective Vale, Look 3 continuity flagged') },
            { label: 'Reset Needed', danger: true, onClick: () => logAction('Reset requested', 'Wardrobe reset needed before next take') }
          ]
        };
      case 'Script Supervisor':
        return {
          action: 'Record Take 5 outcome and slate next',
          detail: `Slate: ${setup.scene}-${setup.setupNumber} | Take: 5 | Last: NO GOOD — actor missed final line, key light shifted.`,
          target: 'Slate 42-14B Take 6',
          buttons: [
            { label: 'Print', primary: true, real: 'print', onClick: () => decideTake('print') },
            { label: 'Hold', real: 'hold', onClick: () => decideTake('hold') },
            { label: 'No Good', danger: true, real: 'noGood', onClick: () => decideTake('noGood') }
          ]
        };
      case 'Director':
        return {
          action: 'Review Take 5 and decide next',
          detail: 'Actor missed final line at 00:38. DP requests lighting correction for new mark. Option for softer read available.',
          target: 'Decision by 10:40 AM',
          buttons: [
            { label: 'Go Again', primary: true, onClick: () => logAction('Go again', 'Director called for another take') },
            { label: 'Move On', onClick: () => logAction('Move on', 'Director approved moving past this take') },
            { label: 'Request Option', onClick: () => logAction('Option requested', 'Director asked for a softer emotional read') }
          ]
        };
      case 'Producer':
        return {
          action: 'Schedule risk: Scene 43 may move 12 min late',
          detail: 'Current hold: 7 minutes. Lighting + talent reset in progress. Daily page count at risk if hold extends past 15 min.',
          target: 'Monitor',
          buttons: [
            { label: 'Approve Escalation', primary: true, onClick: () => logAction('Escalation approved', 'Producer approved the 1st AD’s escalation') },
            { label: 'View Budget Impact', onClick: () => logAction('Budget impact viewed', 'Producer reviewed schedule-risk cost impact') }
          ]
        };
      case 'Talent Assistant':
        return {
          action: 'Talent reset: Detective Vale (Actor)',
          detail: 'Return to holding for line rehearsal. Hair/makeup touch-up. Wardrobe reset for Look 3 continuity.',
          target: 'Ready by 10:39 AM',
          buttons: [
            { label: 'Talent in Holding', primary: true, real: 'actor', onClick: markActorReady },
            { label: 'Need More Time', onClick: () => logAction('Need more time', 'Talent Assistant requested more time for talent reset') },
            { label: 'Talent Issue', danger: true, onClick: () => logAction('Talent issue flagged', 'Talent Assistant flagged an issue with talent readiness') }
          ]
        };
      case 'DP':
        return {
          action: 'Camera ready. Await lighting correction.',
          detail: 'Lens: 32mm T2.0 | Focus mark set for kitchen island two-shot. Key light shift affected exposure on actor right side.',
          target: 'Roll at 10:42 AM',
          buttons: [
            { label: 'Camera Ready', primary: true, onClick: () => logAction('Camera ready', 'DP confirmed camera package and focus marks') },
            { label: 'Visual Issue', danger: true, onClick: () => logAction('Visual issue flagged', 'DP flagged an exposure issue from the lighting shift') }
          ]
        };
      default: // 1st AD
        return {
          action: 'Coordinate reset: lighting + talent',
          detail: 'Two blockers active. Lighting ETA 3 min. Talent ETA 4 min. Predicted roll: 10:42 AM. Scene 43 at risk.',
          target: '10:42 AM',
          buttons: [
            { label: 'Send 5-Min Check-in', primary: true, onClick: () => logAction('5-minute check-in sent', 'Sent to lighting and talent departments') },
            { label: 'Reorder Next Setup', onClick: () => logAction('Next setup reordered', '1st AD moved a later setup earlier in the day') },
            { label: 'Escalate', danger: true, onClick: () => logAction('Blocker escalated', '1st AD escalated the current blocker to the Producer') }
          ]
        };
    }
  };

  const content = getRoleContent();
  const realDone: Record<string, boolean> = {
    lighting: lightingReady,
    actor: actorReady,
    print: takeDecided,
    hold: takeDecided,
    noGood: takeDecided
  };

  return (
    <div style={{ padding: '32px 28px', maxWidth: 840 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <span className={`pill ${holdState === 'hold' ? 'pill-hold' : holdState === 'ready' ? 'pill-ready' : 'pill-wait'}`}>
            {holdState === 'hold' ? <AlertCircle size={12} /> : holdState === 'ready' ? <CheckCircle size={12} /> : <Clock size={12} />}
            {holdState === 'hold' ? 'HOLD' : holdState === 'ready' ? 'READY TO ROLL' : 'ROLLING'}
          </span>
          <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>
            {roleDescriptions[role]}
          </span>
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 4 }}>
          My Set
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
          {production.title} · Episode {production.episode} · Shoot Day {production.shootDay}
        </p>
      </div>

      {/* NOW card */}
      <div className="card" style={{ padding: 24, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 12 }}>
          <span aria-hidden="true" style={{ width: 7, height: 7, borderRadius: '50%', background: holdState === 'hold' ? 'var(--red)' : holdState === 'ready' ? 'var(--teal)' : 'var(--violet)', flexShrink: 0 }} />
          NOW
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 20, fontWeight: 700 }}>Setup {setup.setupNumber}</span>
          <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>·</span>
          <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Scene {setup.scene}</span>
          <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>·</span>
          <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{setup.location}</span>
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>
          {setup.description}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
            <Clock size={14} style={{ color: 'var(--text-muted)' }} />
            <span className="mono">Target roll: {setup.targetRoll}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
            <MapPin size={14} style={{ color: 'var(--text-muted)' }} />
            <span>{production.location}</span>
          </div>
        </div>
      </div>

      {/* YOUR ACTION */}
      <div className="card" style={{ padding: 24, marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 12 }}>
          YOUR ACTION
        </div>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>{content.action}</h3>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>
          {content.detail}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
          <Clock size={14} style={{ color: '#7a4a0a' }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: '#7a4a0a' }} className="mono">
            Target ready: {content.target}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {content.buttons.map((btn, i) => {
            if (btn.real) {
              const done = realDone[btn.real];
              return (
                <button
                  key={i}
                  onClick={btn.onClick}
                  disabled={done}
                  className={`btn ${btn.primary ? 'btn-primary' : btn.danger ? 'btn-danger' : 'btn-secondary'}`}
                  style={done ? { opacity: 0.6, cursor: 'default' } : undefined}
                >
                  {done && <CheckCircle size={16} />} {btn.label}
                </button>
              );
            }
            return (
              <AckButton
                key={i}
                label={btn.label}
                icon={btn.danger ? <AlertCircle size={16} /> : btn.primary ? <CheckCircle size={16} /> : <Clock size={16} />}
                variant={btn.primary ? 'primary' : btn.danger ? 'danger' : 'secondary'}
                onAck={btn.onClick}
              />
            );
          })}
        </div>
      </div>

      {/* WHAT CHANGED */}
      <div className="card" style={{ padding: 24, marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 12 }}>
          WHAT CHANGED
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13 }}>
            <XCircle size={14} style={{ color: 'var(--red)', marginTop: 2, flexShrink: 0 }} />
            <span>Take 5 stopped at 00:38 — actor line reset requested</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13 }}>
            <AlertCircle size={14} style={{ color: 'var(--amber)', marginTop: 2, flexShrink: 0 }} />
            <span>Lighting adjustment requested by DP after actor hit new mark</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13 }}>
            <Clock size={14} style={{ color: 'var(--text-muted)', marginTop: 2, flexShrink: 0 }} />
            <span style={{ color: 'var(--text-secondary)' }}>Next status check in 4 minutes</span>
          </div>
        </div>
      </div>

      {/* UP NEXT */}
      <div className="card" style={{ padding: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 12 }}>
          UP NEXT
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Scene 42, reverse angle</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>Setup 15A · Close-up witness · Est. 11:05 AM</div>
          </div>
          <ChevronRight size={18} style={{ color: 'var(--text-muted)' }} />
        </div>
      </div>
    </div>
  );
}
