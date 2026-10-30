import { useState } from 'react';
import { useApp } from '../App';
import { retakeCauses } from '../data/reference';
import { crewName } from '../data/derive';
import { NoCallSheet, NothingYet } from '../components/EmptyState';
import { Clapperboard, Camera, AlertCircle, User, Zap, Mic, Box, Wrench, Film, Timer } from 'lucide-react';
import type { RetakeCause, TakeResult } from '../types';

const RESULT_LABEL: Record<TakeResult, string> = {
  print: 'PRINT', hold: 'HOLD', noGood: 'NO GOOD', incomplete: 'INCOMPLETE'
};

function ArrowRightIcon({ size, style }: { size: number; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

export default function LiveTake() {
  const { production } = useApp();
  const [selectedCauses, setSelectedCauses] = useState<RetakeCause[]>([]);
  const [createdTasks, setCreatedTasks] = useState<{role: string; who?: string; task: string}[]>([]);

  if (!production) return <NoCallSheet />;
  const { callSheet: cs, day } = production;
  if (!day) {
    return (
      <NothingYet
        title="No takes recorded yet"
        body="Takes appear here as the script supervisor logs them, starting with the first setup of the day."
      />
    );
  }
  const setup = day.currentSetup;
  const lastTake = setup.takes[setup.takes.length - 1];

  const toggleCause = (cause: RetakeCause) => {
    if (selectedCauses.includes(cause)) {
      setSelectedCauses(selectedCauses.filter(c => c !== cause));
    } else {
      setSelectedCauses([...selectedCauses, cause]);
    }
  };

  // Who acts on each cause — named from the call sheet's crew list where
  // the sheet lists that department's lead.
  const generateTasks = () => {
    const tasks: {role: string; who?: string; task: string}[] = [];
    if (selectedCauses.includes('Actor performance / line') || selectedCauses.includes('Continuity')) {
      tasks.push({ role: 'Wardrobe / Talent', who: crewName(cs, /wardrobe|costume/i), task: `Actor reset for Setup ${setup.setupNumber} — line run and continuity check against the photos` });
    }
    if (selectedCauses.includes('Lighting adjustment')) {
      tasks.push({ role: 'Gaffer', who: crewName(cs, /gaffer/i), task: `Lighting adjustment for Setup ${setup.setupNumber}` });
    }
    if (selectedCauses.includes('Camera / focus')) {
      tasks.push({ role: 'Camera', who: crewName(cs, /photography|\bdp\b|camera/i), task: 'Check focus marks and lens calibration' });
    }
    if (selectedCauses.includes('Sound')) {
      tasks.push({ role: 'Sound Mixer', who: crewName(cs, /sound/i), task: 'Reposition the boom and agree a quiet window before the next take' });
    }
    if (selectedCauses.includes('Props / set reset')) {
      tasks.push({ role: 'Props', who: crewName(cs, /prop/i), task: 'Reset props to their first-position marks' });
    }
    setCreatedTasks(tasks);
  };

  const getCauseIcon = (cause: string) => {
    if (cause.includes('Actor')) return <User size={14} />;
    if (cause.includes('Light')) return <Zap size={14} />;
    if (cause.includes('Camera')) return <Camera size={14} />;
    if (cause.includes('Sound')) return <Mic size={14} />;
    if (cause.includes('Prop')) return <Box size={14} />;
    if (cause.includes('Director')) return <Film size={14} />;
    if (cause.includes('Technical')) return <Wrench size={14} />;
    if (cause.includes('Time')) return <Timer size={14} />;
    return <AlertCircle size={14} />;
  };

  return (
    <div style={{ padding: '32px 28px', maxWidth: 960 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: 'italic', fontSize: 22, fontWeight: 700, color: 'var(--ink-warm)', marginBottom: 4 }}>
          Live Take
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 14 }}>
          Scene {setup.scene} · Setup {setup.setupNumber} · Take {setup.takes.length}
        </p>
      </div>

      {/* Take timeline — the last take on record, as logged */}
      {lastTake ? (
      <div className="card" style={{ padding: 24, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', background: 'rgba(226,73,60,0.14)', borderRadius: 8, color: 'var(--stop-red-text)', fontWeight: 700, fontSize: 13 }}>
            <Clapperboard size={16} />
            CUT — Take {lastTake.number} {RESULT_LABEL[lastTake.result]}
          </div>
          <div style={{ fontSize: 13, color: 'var(--muted-dim)' }} className="mono">
            {Math.floor(lastTake.duration / 60)}:{String(lastTake.duration % 60).padStart(2, '0')} elapsed
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
          {['Camera ready', 'Actors to marks', 'Action', 'Cut', 'Reset required'].map((step, i) => (
            <div key={step} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                padding: '6px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600,
                background: i < 4 ? 'rgba(138,180,199,0.14)' : 'rgba(226,73,60,0.14)',
                color: i < 4 ? 'var(--teal-text)' : 'var(--stop-red-text)'
              }}>
                {step}
              </div>
              {i < 4 && <ArrowRightIcon size={14} style={{ color: 'var(--muted-dim)' }} />}
            </div>
          ))}
        </div>

        <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>
          Take {lastTake.number} stopped.
          {lastTake.causes[0] && <> Primary: {lastTake.causes[0]}.</>}
          {lastTake.causes[1] && <> Secondary: {lastTake.causes[1]}.</>}
          {' '}{lastTake.notes}
        </div>
      </div>
      ) : (
        <div className="card" style={{ padding: 24, marginBottom: 16, fontSize: 13, color: 'var(--muted)' }}>
          No takes yet on Setup {setup.setupNumber}.
        </div>
      )}

      {/* Retake causes */}
      <div className="card" style={{ padding: 24, marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted-dim)', marginBottom: 16 }}>
          Why did this take stop?
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
          {retakeCauses.map(cause => (
            <button
              key={cause}
              onClick={() => toggleCause(cause)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                border: '1px solid',
                borderColor: selectedCauses.includes(cause) ? 'var(--teal-text)' : 'var(--border)',
                background: selectedCauses.includes(cause) ? 'rgba(138,180,199,0.14)' : 'var(--surface)',
                color: selectedCauses.includes(cause) ? 'var(--teal-text)' : 'var(--muted)',
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              {getCauseIcon(cause)}
              {cause}
            </button>
          ))}
        </div>
        <button 
          onClick={generateTasks}
          disabled={selectedCauses.length === 0}
          className="btn btn-primary"
          style={{ opacity: selectedCauses.length === 0 ? 0.5 : 1 }}
        >
          Generate Department Actions
        </button>
      </div>

      {/* Created tasks — a lamp leads the label, not a border stripe */}
      {createdTasks.length > 0 && (
        <div className="card" style={{ padding: 24, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted-dim)', marginBottom: 16 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--gold)', flexShrink: 0 }} />
            Who needs to act
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {createdTasks.map((task, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 14, background: 'var(--paper)', borderRadius: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(230,184,0,0.16)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--bronze-text)' }}>
                  <User size={16} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>
                    {task.role}
                    {task.who && <span style={{ fontWeight: 400, color: 'var(--muted)' }}> · {task.who}</span>}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>{task.task}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Take history */}
      <div className="card" style={{ padding: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted-dim)', marginBottom: 16 }}>
          Take history — Setup {setup.setupNumber}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {setup.takes.map(take => (
            <div key={take.number} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: 12,
              background: take.result === 'print' ? 'rgba(138,180,199,0.14)' : 'var(--paper)',
              borderRadius: 8
            }}>
              <span className="mono" style={{ fontSize: 13, fontWeight: 700, minWidth: 60, color: 'var(--ink)' }}>
                Take {take.number}
              </span>
              <span style={{
                fontSize: 11, fontWeight: 700, textTransform: 'uppercase', padding: '3px 8px', borderRadius: 4,
                background: take.result === 'print' ? 'var(--teal)' : take.result === 'hold' ? 'var(--bronze)' : 'var(--stop-red)',
                color: '#fff'
              }}>
                {take.result === 'print' ? 'Print' : take.result === 'hold' ? 'Hold' : take.result === 'noGood' ? 'No Good' : 'Incomplete'}
              </span>
              <span style={{ fontSize: 12, color: 'var(--muted)', flex: 1 }}>
                {take.notes}
              </span>
              <span style={{ fontSize: 12, color: 'var(--muted-dim)' }} className="mono">
                {take.duration}s · {take.timestamp}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
