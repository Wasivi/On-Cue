import { useState } from 'react';
import { production, retakeCauses } from '../data/seed';
import { Clapperboard, Camera, AlertCircle, User, Zap, Mic, Box, Wrench, Film, Timer } from 'lucide-react';
import type { RetakeCause } from '../types';

function ArrowRightIcon({ size, style }: { size: number; style?: React.CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

export default function LiveTake() {
  const setup = production.currentSetup;
  const [selectedCauses, setSelectedCauses] = useState<RetakeCause[]>([]);
  const [createdTasks, setCreatedTasks] = useState<{role: string; task: string}[]>([]);

  const toggleCause = (cause: RetakeCause) => {
    if (selectedCauses.includes(cause)) {
      setSelectedCauses(selectedCauses.filter(c => c !== cause));
    } else {
      setSelectedCauses([...selectedCauses, cause]);
    }
  };

  const generateTasks = () => {
    const tasks: {role: string; task: string}[] = [];
    if (selectedCauses.includes('Actor performance / line') || selectedCauses.includes('Continuity')) {
      tasks.push({ role: 'Talent Assistant / Wardrobe', task: 'Actor reset — line rehearsal and continuity check' });
    }
    if (selectedCauses.includes('Lighting adjustment')) {
      tasks.push({ role: 'Gaffer', task: 'Adjust key light for actor mark 2 — target 10:40 AM' });
    }
    if (selectedCauses.includes('Camera / focus')) {
      tasks.push({ role: '1st AC', task: 'Check focus marks and lens calibration' });
    }
    if (selectedCauses.includes('Sound')) {
      tasks.push({ role: 'Sound Mixer', task: 'Reposition boom — check for train noise window' });
    }
    if (selectedCauses.includes('Props / set reset')) {
      tasks.push({ role: 'Set Decorator', task: 'Reset props to top marks' });
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
        <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 4 }}>
          Live Take
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
          Scene {setup.scene} · Setup {setup.setupNumber} · Take {setup.takes.length}
        </p>
      </div>

      {/* Take timeline */}
      <div className="card" style={{ padding: 24, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', background: 'var(--red-light)', borderRadius: 8, color: 'var(--red)', fontWeight: 700, fontSize: 13 }}>
            <Clapperboard size={16} />
            CUT — Take {setup.takes.length} NO GOOD
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }} className="mono">
            00:38 elapsed
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
          {['Camera ready', 'Actors to marks', 'Action', 'Cut', 'Reset required'].map((step, i) => (
            <div key={step} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                padding: '6px 12px', borderRadius: 6, fontSize: 12, fontWeight: 600,
                background: i < 4 ? 'var(--teal-light)' : 'var(--red-light)',
                color: i < 4 ? 'var(--teal)' : 'var(--red)'
              }}>
                {step}
              </div>
              {i < 4 && <ArrowRightIcon size={14} style={{ color: 'var(--text-muted)' }} />}
            </div>
          ))}
        </div>

        <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          Take {setup.takes.length} stopped. Primary: Actor missed final line. Secondary: Key light shifted during movement to new mark.
        </div>
      </div>

      {/* Retake causes */}
      <div className="card" style={{ padding: 24, marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 16 }}>
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
                borderColor: selectedCauses.includes(cause) ? 'var(--teal)' : 'var(--border)',
                background: selectedCauses.includes(cause) ? 'var(--teal-light)' : 'var(--workspace-surface)',
                color: selectedCauses.includes(cause) ? 'var(--teal)' : 'var(--text-secondary)',
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 16 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--violet)', flexShrink: 0 }} />
            Who needs to act
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {createdTasks.map((task, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 14, background: 'var(--workspace-bg)', borderRadius: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--violet-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--violet)' }}>
                  <User size={16} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{task.role}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{task.task}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Take history */}
      <div className="card" style={{ padding: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 16 }}>
          Take history — Setup {setup.setupNumber}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {setup.takes.map(take => (
            <div key={take.number} style={{ 
              display: 'flex', alignItems: 'center', gap: 12, padding: 12, 
              background: take.result === 'print' ? 'var(--teal-light)' : 'var(--workspace-bg)',
              borderRadius: 8 
            }}>
              <span className="mono" style={{ fontSize: 13, fontWeight: 700, minWidth: 60 }}>
                Take {take.number}
              </span>
              <span style={{ 
                fontSize: 11, fontWeight: 700, textTransform: 'uppercase', padding: '3px 8px', borderRadius: 4,
                background: take.result === 'print' ? 'var(--teal)' : take.result === 'hold' ? 'var(--amber)' : 'var(--red)',
                color: '#fff'
              }}>
                {take.result === 'print' ? 'Print' : take.result === 'hold' ? 'Hold' : take.result === 'noGood' ? 'No Good' : 'Incomplete'}
              </span>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)', flex: 1 }}>
                {take.notes}
              </span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }} className="mono">
                {take.duration}s · {take.timestamp}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
