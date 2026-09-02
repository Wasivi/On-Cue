import { useApp } from '../App';
import { production } from '../data/seed';
import { Clock, AlertCircle, CheckCircle, Radio, ArrowRight, Shield } from 'lucide-react';

export default function ADCommand() {
  const { holdState, setHoldState, lightingReady, actorReady } = useApp();
  const setup = production.currentSetup;

  const allReady = lightingReady && actorReady;

  return (
    <div style={{ padding: '32px 28px', maxWidth: 960 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <Shield size={20} style={{ color: '#1a5f7a' }} />
          <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em' }}>
            AD Command
          </h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
          Full crew readiness · Setup {setup.setupNumber} · Scene {setup.scene} · {production.episodeTitle}
        </p>
      </div>

      {/* Big status */}
      <div className="card" style={{ padding: 32, marginBottom: 20, textAlign: 'center', borderLeft: `3px solid ${holdState === 'hold' ? '#c53030' : '#1a5f7a'}` }}>
        <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: 12 }}>
          Setup {setup.setupNumber} — {holdState === 'hold' ? 'HOLD' : 'READY'}
        </div>
        <div className={`big-status ${holdState === 'hold' ? 'hold' : 'ready'}`} style={{ marginBottom: 8 }}>
          {holdState === 'hold' ? 'HOLD' : 'READY TO ROLL'}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, marginTop: 16, flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'center' }}>
            <div className="section-label" style={{ marginBottom: 4 }}>Predicted Roll</div>
            <div style={{ fontSize: 18, fontWeight: 700 }} className="mono">2:45 PM</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div className="section-label" style={{ marginBottom: 4 }}>Current Hold</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#c9870a' }} className="mono">12 min</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div className="section-label" style={{ marginBottom: 4 }}>Next Scene Risk</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#c9870a' }} className="mono">+15 min late</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div className="section-label" style={{ marginBottom: 4 }}>Background Hold</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#c9870a' }} className="mono">45 min</div>
          </div>
        </div>
        {allReady && holdState === 'hold' && (
          <button 
            onClick={() => setHoldState('ready')}
            className="btn btn-gold btn-lg" 
            style={{ marginTop: 24 }}
          >
            <Radio size={18} />
            Clear Hold — Roll When Ready
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
              <div style={{ fontSize: 12, color: '#c9870a', fontWeight: 600 }} className="mono">
                ETA: {dept.eta}
              </div>
            )}
            {dept.blockerCount > 0 && (
              <div style={{ fontSize: 12, color: '#c53030', fontWeight: 600, marginTop: 6 }}>
                {dept.blockerCount} blocker{dept.blockerCount > 1 ? 's' : ''}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: 10, marginTop: 20, flexWrap: 'wrap' }}>
        <button className="btn btn-secondary">
          <Clock size={16} /> Send 5-Min Check-in
        </button>
        <button className="btn btn-secondary">
          <ArrowRight size={16} /> Reorder Next Setup
        </button>
        <button className="btn btn-danger">
          <AlertCircle size={16} /> Escalate Blocker
        </button>
      </div>
    </div>
  );
}
