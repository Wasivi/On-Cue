import { useRef, useState } from 'react';
import { castLooks, production } from '../data/seed';
import { useApp } from '../App';
import { CheckCircle, AlertCircle, Camera, Clock, ArrowRight, ChevronDown } from 'lucide-react';

export default function WardrobeTalent() {
  const { setActorReady, lightingReady, setHoldState } = useApp();
  const setup = production.currentSetup;
  const [castIndex, setCastIndex] = useState(0);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [photos, setPhotos] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const capturingLabel = useRef<string | null>(null);
  const look = castLooks[castIndex];

  // Clicking a photo slot opens the device's own camera — the file input's
  // `capture` attribute is what triggers that prompt, not something we can
  // fake with a styled button alone.
  const openCamera = (label: string) => {
    capturingLabel.current = label;
    fileInputRef.current?.click();
  };
  const onPhotoTaken = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const label = capturingLabel.current;
    if (file && label) {
      setPhotos(prev => ({ ...prev, [label]: URL.createObjectURL(file) }));
    }
    e.target.value = '';
  };

  return (
    <div style={{ padding: '32px 28px', maxWidth: 840 }}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={onPhotoTaken}
        style={{ display: 'none' }}
      />

      <div style={{ marginBottom: 24 }}>
        {/* White, like the wordmark — this sits on the page's gradient.
            A dot instead of "&" — too decorative for this system. */}
        <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 4, color: '#ffffff' }}>
          Wardrobe · Talent
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 14 }}>
          {production.title} · Character Continuity · Scene {setup.scene} · Setup {setup.setupNumber}
        </p>
      </div>

      {/* Character card */}
      <div className="card" style={{ padding: 24, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 20 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 12,
            background: 'linear-gradient(135deg, #4a6741 0%, #8b7355 50%, #2d3748 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 24, fontWeight: 700, flexShrink: 0
          }}>
            {look.character.split(' ').map(w => w[0]).slice(-2).join('')}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Cast picker — any character in the scene, not one fixed
                name. Whoever's up next changes shoot to shoot. */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setPickerOpen(v => !v)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6, border: 'none', background: 'none',
                  cursor: 'pointer', padding: 0, marginBottom: 4
                }}
              >
                <h2 style={{ fontSize: 18, fontWeight: 700 }}>{look.character}</h2>
                <ChevronDown size={16} style={{ color: 'var(--text-muted)', transform: pickerOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
              </button>

              {pickerOpen && (
                <div style={{
                  position: 'absolute', top: '100%', left: 0, zIndex: 20,
                  width: 260, background: 'var(--workspace-surface)', border: '1px solid var(--border)',
                  borderRadius: 10, padding: 6, boxShadow: '0 12px 28px rgba(10,20,30,0.18)'
                }}>
                  {castLooks.map((c, i) => (
                    <button
                      key={c.character}
                      onClick={() => { setCastIndex(i); setPickerOpen(false); }}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
                        width: '100%', textAlign: 'left', padding: '8px 10px', borderRadius: 6, border: 'none',
                        background: i === castIndex ? 'var(--teal-light)' : 'transparent',
                        color: i === castIndex ? 'var(--teal)' : 'var(--text-primary)',
                        fontSize: 13, fontWeight: i === castIndex ? 600 : 500, cursor: 'pointer'
                      }}
                    >
                      {c.character}
                      {c.resetRequired && <AlertCircle size={13} style={{ color: 'var(--red)', flexShrink: 0 }} />}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              Scene {look.scene} · Look {look.lookNumber}
            </div>
            <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {look.items.map(item => (
                <span key={item} style={{ padding: '4px 10px', background: 'var(--workspace-bg)', borderRadius: 6, fontSize: 12, fontWeight: 500 }}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Continuity notes */}
        <div style={{ background: 'var(--workspace-bg)', borderRadius: 10, padding: 16, marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 12 }}>
            Continuity State
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {look.continuityNotes.map((note, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13 }}>
                <Camera size={14} style={{ color: 'var(--violet)', marginTop: 2, flexShrink: 0 }} />
                <span>{note}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Photo slots — tapping one asks for the device's camera */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 }}>
          {['Front', 'Back', 'Detail: Cuff'].map((label) => (
            <button
              key={label}
              onClick={() => openCamera(label)}
              style={{
                aspectRatio: '4/3', background: photos[label] ? `center/cover no-repeat url(${photos[label]})` : '#e5e2dc',
                borderRadius: 8, border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexDirection: 'column', gap: 6, position: 'relative', overflow: 'hidden'
              }}
            >
              {!photos[label] && <Camera size={20} style={{ color: 'var(--text-muted)' }} />}
              <span style={{
                fontSize: 11, fontWeight: 500,
                color: photos[label] ? '#fff' : 'var(--text-muted)',
                textShadow: photos[label] ? '0 1px 3px rgba(0,0,0,0.6)' : 'none'
              }}>
                {label}
              </span>
            </button>
          ))}
        </div>

        {/* Reset alert */}
        {look.resetRequired && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: 12,
            background: 'var(--red-light)', borderRadius: 8, marginBottom: 16
          }}>
            <AlertCircle size={16} style={{ color: 'var(--red)', flexShrink: 0 }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--red)' }}>
              Reset required before next take — dampness from rain tower
            </span>
          </div>
        )}

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => { setActorReady(true); if (lightingReady) setHoldState('ready'); }}
            className="btn btn-primary"
          >
            <CheckCircle size={16} /> Actor Ready
          </button>
          <button className="btn btn-secondary">
            <AlertCircle size={16} /> Continuity Issue
          </button>
          <button className="btn btn-danger">
            <Clock size={16} /> Reset Needed
          </button>
        </div>
      </div>

      {/* Scene timeline */}
      <div className="card" style={{ padding: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginBottom: 16 }}>
          Scene-to-Scene Look Timeline
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflowX: 'auto' }}>
          {[
            { scene: '39', look: 'Look 1', desc: 'Dry, clean', status: 'done' },
            { scene: '40', look: 'Look 2', desc: 'Jacket off', status: 'done' },
            { scene: '41', look: 'Look 2A', desc: 'Sleeve tear added', status: 'done' },
            { scene: '42', look: 'Look 3', desc: 'Rain dampness', status: 'current' },
            { scene: '43', look: 'Look 3', desc: 'Dampness drying', status: 'upcoming' },
          ].map((item, i, arr) => (
            <div key={item.scene} style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: item.status === 'current' ? 'var(--teal)' : item.status === 'upcoming' ? 'var(--border)' : 'var(--teal-light)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: item.status === 'current' ? '#fff' : item.status === 'upcoming' ? 'var(--text-muted)' : 'var(--teal)',
                  fontSize: 11, fontWeight: 700, margin: '0 auto 6px'
                }}>
                  {item.scene}
                </div>
                <div style={{ fontSize: 11, fontWeight: 600 }}>{item.look}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{item.desc}</div>
              </div>
              {i < arr.length - 1 && <ArrowRight size={14} style={{ color: 'var(--border)', flexShrink: 0 }} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
