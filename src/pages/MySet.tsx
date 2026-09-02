import { useApp } from '../App';
import { production, roleDescriptions } from '../data/seed';
import { Clock, MapPin, AlertCircle, CheckCircle, XCircle, ChevronRight, Shield } from 'lucide-react';

export default function MySet() {
  const { role, holdState, lightingReady, actorReady, setLightingReady, setActorReady, setHoldState } = useApp();
  const setup = production.currentSetup;

  const getRoleContent = () => {
    switch (role) {
      case 'Gaffer':
        return {
          action: 'Adjust key light for tactical vest exposure at mark 3',
          detail: 'Current: "DSI" patch on vest blown out in Take 5. Key light (Arri SkyPanel S60) shifted when Ray hit mark 3. Drop intensity 20%, flag right edge.',
          target: '2:40 PM',
          buttons: [
            { label: 'Lighting Ready', primary: true, onClick: () => { setLightingReady(true); if (actorReady) setHoldState('ready'); } },
            { label: 'Need 5 Minutes', primary: false, onClick: () => {} },
            { label: 'Equipment Issue', primary: false, danger: true, onClick: () => {} }
          ]
        };
      case 'Wardrobe':
        return {
          action: 'Confirm OA tactical vest continuity — Scene 23, Look 2',
          detail: 'Vest has dust smudge on right shoulder from door breach in Scene 19. Left knee pad shifted during Take 5 — needs repositioning. DSI patch must face camera.',
          target: '2:38 PM',
          buttons: [
            { label: 'Actor Ready', primary: true, onClick: () => { setActorReady(true); if (lightingReady) setHoldState('ready'); } },
            { label: 'Continuity Issue', primary: false, danger: true, onClick: () => {} },
            { label: 'Reset Needed', primary: false, danger: true, onClick: () => {} }
          ]
        };
      case 'Script Supervisor':
        return {
          action: 'Record Take 5 outcome and slate next',
          detail: `Slate: ${setup.scene}-${setup.setupNumber} | Take: 5 | Last: NO GOOD — Elena line flub on "Freeze — DSI!", key light shifted.`,
          target: 'Slate 23-23B Take 6',
          buttons: [
            { label: 'Print', primary: true, onClick: () => {} },
            { label: 'Hold', primary: false, onClick: () => {} },
            { label: 'No Good', primary: false, danger: true, onClick: () => {} }
          ]
        };
      case 'Director':
        return {
          action: 'Review Take 5 — Elena line delivery',
          detail: 'Line flub on "Freeze — DSI!" at 00:42. DP requests lighting correction for tactical vest exposure. Option for tighter two-shot available.',
          target: 'Decision by 2:40 PM',
          buttons: [
            { label: 'Go Again', primary: true, onClick: () => {} },
            { label: 'Move On', primary: false, onClick: () => {} },
            { label: 'Tighter Shot', primary: false, onClick: () => {} }
          ]
        };
      case 'Producer':
        return {
          action: 'Schedule risk: Scene 24 may move 15 min late',
          detail: 'Current hold: 12 minutes. Lighting + props reset in progress. Background holding for 45 min. Daily page count at risk if hold extends past 20 min.',
          target: 'Monitor',
          buttons: [
            { label: 'Approve Escalation', primary: true, onClick: () => {} },
            { label: 'View Budget Impact', primary: false, onClick: () => {} }
          ]
        };
      case 'Talent Assistant':
        return {
          action: 'Talent reset: Marcus Vance (Ray)',
          detail: 'Return to Trailer B for line rehearsal — "Freeze — DSI!" delivery. Tactical vest dust continuity check. Hair/makeup touch-up.',
          target: 'Ready by 2:38 PM',
          buttons: [
            { label: 'Talent in Holding', primary: true, onClick: () => { setActorReady(true); if (lightingReady) setHoldState('ready'); } },
            { label: 'Need More Time', primary: false, onClick: () => {} },
            { label: 'Talent Issue', primary: false, danger: true, onClick: () => {} }
          ]
        };
      case 'DP':
        return {
          action: 'Camera ready. Await lighting correction for vest exposure.',
          detail: 'Lens: 32mm T2.0 | Steadicam balanced for tactical entry. Focus marks set for door breach to suspect. DSI patch blown out — needs flag.',
          target: 'Roll at 2:45 PM',
          buttons: [
            { label: 'Camera Ready', primary: true, onClick: () => {} },
            { label: 'Visual Issue', primary: false, danger: true, onClick: () => {} }
          ]
        };
      default: // 1st AD
        return {
          action: 'Coordinate reset: lighting + props + talent',
          detail: 'Three blockers active. Lighting ETA 4 min. Props ETA 2 min. Talent ETA 3 min. Predicted roll: 2:45 PM. Scene 24 at risk.',
          target: '2:45 PM',
          buttons: [
            { label: 'Send 5-Min Check-in', primary: true, onClick: () => {} },
            { label: 'Reorder Next Setup', primary: false, onClick: () => {} },
            { label: 'Escalate', primary: false, danger: true, onClick: () => {} }
          ]
        };
    }
  };

  const content = getRoleContent();

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
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <Shield size={20} style={{ color: '#1a5f7a' }} />
          <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em' }}>
            My Set
          </h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
          {production.title} · S{production.season}E{production.episode} "{production.episodeTitle}" · Shoot Day {production.shootDay}
        </p>
      </div>

      {/* NOW card */}
      <div className="card" style={{ padding: 24, marginBottom: 16, borderLeft: `3px solid ${holdState === 'hold' ? '#c53030' : holdState === 'ready' ? '#1a5f7a' : '#7c3aed'}` }}>
        <div className="section-label">NOW</div>
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
            <span>Riverside Collision Center, Long Island City</span>
          </div>
        </div>
      </div>

      {/* YOUR ACTION */}
      <div className="card" style={{ padding: 24, marginBottom: 16 }}>
        <div className="section-label">YOUR ACTION</div>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>{content.action}</h3>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>
          {content.detail}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
          <Clock size={14} style={{ color: '#c9870a' }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: '#c9870a' }} className="mono">
            Target ready: {content.target}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {content.buttons.map((btn, i) => (
            <button
              key={i}
              onClick={btn.onClick}
              className={`btn ${btn.primary ? 'btn-primary' : btn.danger ? 'btn-danger' : 'btn-secondary'}`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* WHAT CHANGED */}
      <div className="card" style={{ padding: 24, marginBottom: 16 }}>
        <div className="section-label">WHAT CHANGED</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13 }}>
            <XCircle size={14} style={{ color: '#c53030', marginTop: 2, flexShrink: 0 }} />
            <span>Take 5 stopped at 00:42 — Elena line flub on "Freeze — DSI!"</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13 }}>
            <AlertCircle size={14} style={{ color: '#c9870a', marginTop: 2, flexShrink: 0 }} />
            <span>Lighting adjustment requested by DP — DSI patch blown out on tactical vest</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13 }}>
            <AlertCircle size={14} style={{ color: '#c9870a', marginTop: 2, flexShrink: 0 }} />
            <span>Props reset required — armorer verifying blanks after Take 3</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13 }}>
            <Clock size={14} style={{ color: 'var(--text-muted)', marginTop: 2, flexShrink: 0 }} />
            <span style={{ color: 'var(--text-secondary)' }}>Next status check in 3 minutes</span>
          </div>
        </div>
      </div>

      {/* UP NEXT */}
      <div className="card" style={{ padding: 24 }}>
        <div className="section-label">UP NEXT</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Scene 24 — Suspect interrogation</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>Setup 24A · Two-shot interrogation room · Est. 3:15 PM</div>
          </div>
          <ChevronRight size={18} style={{ color: 'var(--text-muted)' }} />
        </div>
      </div>
    </div>
  );
}
