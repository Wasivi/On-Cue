import { useApp } from '../App';
import { production } from '../data/seed';
import { Zap, AlertTriangle, CheckCircle, Clock, Power, Cable, Sun } from 'lucide-react';

export default function LightingConsole() {
  const { setLightingReady, actorReady, setHoldState } = useApp();
  const setup = production.currentSetup;

  return (
    <div style={{ padding: '32px 28px', maxWidth: 720 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 4 }}>
          Lighting Console
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
          Gaffer view · Setup {setup.setupNumber} · Scene {setup.scene}
        </p>
      </div>

      {/* Alert */}
      <div style={{ 
        display: 'flex', alignItems: 'center', gap: 12, padding: 16, 
        background: 'var(--amber-light)', borderRadius: 10, marginBottom: 20, border: '1px solid #fcd34d'
      }}>
        <AlertTriangle size={20} style={{ color: 'var(--amber)', flexShrink: 0 }} />
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--amber)' }}>Pattern Alert</div>
          <div style={{ fontSize: 12, color: '#92400e' }}>
            Lighting contributed to delays in 3 of the past 5 setups. Consider pre-lighting Scene 43 while talent resets.
          </div>
        </div>
      </div>

      {/* Task card — a lamp leads the label, not a border stripe */}
      <div className="card" style={{ padding: 24, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 12 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--amber)', flexShrink: 0 }} />
          Current Task
        </div>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
          Adjust key light for actor mark 2
        </h3>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>
          Key light (Arri SkyPanel S60) shifted during actor movement in Take 5. Move 18 inches camera-left. Soften to match f/2.8 exposure. Check no spill on background window.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
            <Clock size={14} style={{ color: 'var(--amber)' }} />
            <span style={{ fontWeight: 600, color: 'var(--amber)' }} className="mono">Target: 10:40 AM</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
            <Sun size={14} style={{ color: 'var(--text-muted)' }} />
            <span>Scene 42 · Loft Kitchen</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button 
            onClick={() => { setLightingReady(true); if (actorReady) setHoldState('ready'); }}
            className="btn btn-primary"
          >
            <CheckCircle size={16} /> Lighting Ready
          </button>
          <button className="btn btn-secondary">
            <Clock size={16} /> Need 5 Minutes
          </button>
          <button className="btn btn-danger">
            <AlertTriangle size={16} /> Equipment Issue
          </button>
        </div>
      </div>

      {/* Power status */}
      <div className="card" style={{ padding: 24, marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 16 }}>
          Power & Equipment
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          <div style={{ padding: 14, background: 'var(--workspace-bg)', borderRadius: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <Power size={14} style={{ color: 'var(--teal)' }} />
              <span style={{ fontSize: 12, fontWeight: 700 }}>Generator A</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Running · 78% load · 12 hrs fuel</div>
          </div>
          <div style={{ padding: 14, background: 'var(--workspace-bg)', borderRadius: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <Cable size={14} style={{ color: 'var(--teal)' }} />
              <span style={{ fontSize: 12, fontWeight: 700 }}>Cable Run</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Clear · Route marked · No trip hazards</div>
          </div>
          <div style={{ padding: 14, background: 'var(--workspace-bg)', borderRadius: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <Zap size={14} style={{ color: 'var(--teal)' }} />
              <span style={{ fontSize: 12, fontWeight: 700 }}>Condor</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Stowed · Not needed for this setup</div>
          </div>
          <div style={{ padding: 14, background: 'var(--workspace-bg)', borderRadius: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <Sun size={14} style={{ color: 'var(--amber)' }} />
              <span style={{ fontSize: 12, fontWeight: 700 }}>Rain Tower</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Standing by · Water catch required</div>
          </div>
        </div>
      </div>

      {/* Equipment checklist */}
      <div className="card" style={{ padding: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 16 }}>
          Setup Checklist
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            'Key light positioned and softened',
            'Fill light balanced (2:1 ratio)',
            'Practicals in kitchen dimmed to 30%',
            'Window blackout confirmed',
            'Cable run taped and marked',
            'Fire extinguisher at generator'
          ].map((item, i) => (
            <label key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 10, background: 'var(--workspace-bg)', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>
              <input type="checkbox" style={{ width: 16, height: 16, accentColor: 'var(--teal)' }} />
              <span>{item}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
