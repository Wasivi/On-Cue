import { useApp } from '../App';
import { production } from '../data/seed';
import { Zap, AlertTriangle, CheckCircle, Clock, Power, Cable, Sun } from 'lucide-react';
import { useState } from 'react';
import AckButton from '../components/AckButton';

const CHECKLIST_ITEMS = [
  'Key light positioned and softened',
  'Fill light balanced (2:1 ratio)',
  'Practicals in kitchen dimmed to 30%',
  'Window blackout confirmed',
  'Cable run taped and marked',
  'Fire extinguisher at generator'
];

export default function LightingConsole() {
  const { lightingReady, markLightingReady, logAction } = useApp();
  const setup = production.currentSetup;
  const [checked, setChecked] = useState<boolean[]>(() => CHECKLIST_ITEMS.map(() => false));
  const allChecked = checked.every(Boolean);

  const toggleItem = (i: number) => {
    setChecked(prev => prev.map((v, idx) => (idx === i ? !v : v)));
  };

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
        background: 'var(--amber-light)', borderRadius: 3, marginBottom: 20, border: '1px solid rgba(180,105,14,0.35)'
      }}>
        <AlertTriangle size={20} style={{ color: 'var(--amber)', flexShrink: 0 }} />
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--amber)' }}>Pattern Alert</div>
          <div style={{ fontSize: 12, color: '#7a4a0a' }}>
            Lighting contributed to delays in 3 of the past 5 setups. Consider pre-lighting Scene 43 while talent resets.
          </div>
        </div>
      </div>

      {/* Task card */}
      <div className="card" style={{ padding: 24, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 12 }}>
          <span aria-hidden="true" style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--amber)', flexShrink: 0 }} />
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
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            onClick={markLightingReady}
            disabled={lightingReady || !allChecked}
            className="btn btn-primary"
            style={!lightingReady && !allChecked ? { opacity: 0.5, cursor: 'not-allowed' } : undefined}
          >
            <CheckCircle size={16} /> Lighting Ready
          </button>
          <AckButton
            label="Need 5 Minutes"
            icon={<Clock size={16} />}
            onAck={() => logAction('Need 5 minutes', 'Gaffer requested a short extension on the current setup')}
          />
          <AckButton
            label="Equipment Issue"
            icon={<AlertTriangle size={16} />}
            variant="danger"
            onAck={() => logAction('Equipment issue flagged', 'Gaffer flagged an equipment problem on Setup ' + setup.setupNumber)}
          />
        </div>
        {!lightingReady && !allChecked && (
          <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text-muted)' }}>
            Complete the setup checklist below before marking lighting ready.
          </div>
        )}
      </div>

      {/* Power status */}
      <div className="card" style={{ padding: 24, marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 16 }}>
          Power & Equipment
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          <div style={{ padding: 14, background: 'var(--workspace-bg)', borderRadius: 3 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <Power size={14} style={{ color: 'var(--teal)' }} />
              <span style={{ fontSize: 12, fontWeight: 700 }}>Generator A</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Running · 78% load · 12 hrs fuel</div>
          </div>
          <div style={{ padding: 14, background: 'var(--workspace-bg)', borderRadius: 3 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <Cable size={14} style={{ color: 'var(--teal)' }} />
              <span style={{ fontSize: 12, fontWeight: 700 }}>Cable Run</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Clear · Route marked · No trip hazards</div>
          </div>
          <div style={{ padding: 14, background: 'var(--workspace-bg)', borderRadius: 3 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <Zap size={14} style={{ color: 'var(--teal)' }} />
              <span style={{ fontSize: 12, fontWeight: 700 }}>Condor</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Stowed · Not needed for this setup</div>
          </div>
          <div style={{ padding: 14, background: 'var(--workspace-bg)', borderRadius: 3 }}>
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)' }}>
            Setup Checklist
          </div>
          <div className="mono" style={{ fontSize: 11, color: allChecked ? 'var(--teal)' : 'var(--text-muted)', fontWeight: 700 }}>
            {checked.filter(Boolean).length}/{CHECKLIST_ITEMS.length}
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {CHECKLIST_ITEMS.map((item, i) => (
            <label key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 10, background: 'var(--workspace-bg)', borderRadius: 2, cursor: 'pointer', fontSize: 13 }}>
              <input
                type="checkbox"
                checked={checked[i]}
                onChange={() => toggleItem(i)}
                style={{ width: 16, height: 16, accentColor: 'var(--teal)' }}
              />
              <span style={{ textDecoration: checked[i] ? 'line-through' : 'none', color: checked[i] ? 'var(--text-secondary)' : 'var(--text-primary)' }}>
                {item}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
