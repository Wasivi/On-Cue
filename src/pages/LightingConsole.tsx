import { useApp } from '../App';
import { findScene } from '../data/derive';
import { NoCallSheet } from '../components/EmptyState';
import { useEffect, useRef, useState } from 'react';
import { Zap, AlertTriangle, CheckCircle, Clock, Power, Cable, Sun, Camera, Check, X } from 'lucide-react';

// The real fix for "the AD walks to the lighting truck instead of trusting
// the app" isn't a video feed — that's video village's job. It's giving the
// AD two things an app actually can: a visible track record (has this
// gaffer's ETA been right before?) and photo evidence of the current state,
// so checking the app is genuinely as good as walking over. Both come from
// the day's record, never from this screen.

// Equipment names differ show to show, so the icon is picked by what the
// name says, not by a fixed list.
function equipmentIcon(name: string) {
  if (/generator|power/i.test(name)) return Power;
  if (/cable/i.test(name)) return Cable;
  if (/rain|weather|sun/i.test(name)) return Sun;
  return Zap;
}

export default function LightingConsole() {
  const { setLightingReady, production } = useApp();

  const [showCamera, setShowCamera] = useState(false);
  const [capturedShot, setCapturedShot] = useState<string | null>(null);
  const [referencePhoto, setReferencePhoto] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const stopStream = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
  };

  const openCamera = async () => {
    setCapturedShot(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream;
      setShowCamera(true);
    } catch {
      fileInputRef.current?.click();
    }
  };

  useEffect(() => {
    if (showCamera && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [showCamera]);

  useEffect(() => () => stopStream(), []);

  const captureShot = () => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0);
    stopStream();
    setCapturedShot(canvas.toDataURL('image/jpeg', 0.9));
  };

  const confirmReady = () => {
    // Reachable straight from the live-video screen via the "skip photo"
    // button, not just after captureShot() (which already stops the
    // stream) — without this, skipping the photo leaked the camera.
    stopStream();
    if (capturedShot) setReferencePhoto(capturedShot);
    setShowCamera(false);
    setCapturedShot(null);
    // Only sets this department's own flag — the HOLD->READY transition
    // is the 1st AD's alone, via AD Command's gated "Clear Hold" button,
    // never an automatic side effect of another department going ready.
    setLightingReady(true);
  };

  const cancelCamera = () => {
    stopStream();
    setShowCamera(false);
    setCapturedShot(null);
  };

  const onFileCaptured = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReferencePhoto(URL.createObjectURL(file));
      setLightingReady(true);
    }
    e.target.value = '';
  };

  if (!production) return <NoCallSheet />;
  const { callSheet: cs, day } = production;
  const setup = day?.currentSetup;
  const scene = setup ? findScene(cs, setup.scene) : undefined;
  const task = day?.roleActions['Gaffer'];
  const lighting = day?.lighting;
  const trackRecord = lighting?.etaTrackRecord ?? [];

  return (
    <div style={{ padding: '32px 28px', maxWidth: 720 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: 'italic', fontSize: 22, fontWeight: 700, color: 'var(--ink-warm)', marginBottom: 4 }}>
          Lighting Console
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 14 }}>
          Gaffer view · {setup ? `Setup ${setup.setupNumber} · Scene ${setup.scene}` : cs.show.title}
        </p>
      </div>

      {/* Alert */}
      {lighting?.patternAlert && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12, padding: 16,
          background: 'rgba(201,162,39,0.14)', borderRadius: 10, marginBottom: 20, border: '1px solid rgba(201,162,39,0.3)'
        }}>
          <AlertTriangle size={20} style={{ color: 'var(--bronze-text)', flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--bronze-text)' }}>Pattern Alert</div>
            <div style={{ fontSize: 12, color: 'var(--bronze-text)' }}>
              {lighting.patternAlert}
            </div>
          </div>
        </div>
      )}

      {/* Task card — a lamp leads the label, not a border stripe */}
      <div className="card" style={{ padding: 24, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted-dim)', marginBottom: 12 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--bronze)', flexShrink: 0 }} />
          Current Task
        </div>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink)', marginBottom: 8 }}>
          {task ? task.action : 'No lighting task right now'}
        </h3>
        {task && (
          <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 16 }}>
            {task.detail}
          </p>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12, flexWrap: 'wrap' }}>
          {task && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
              <Clock size={14} style={{ color: 'var(--bronze-text)' }} />
              <span style={{ fontWeight: 600, color: 'var(--bronze-text)' }} className="mono">Target: {task.target}</span>
            </div>
          )}
          {setup && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--ink)' }}>
              <Sun size={14} style={{ color: 'var(--muted-dim)' }} />
              <span>Scene {setup.scene}{scene ? ` · ${scene.intExt} ${scene.set} · ${scene.dayNight}` : ''}</span>
            </div>
          )}
        </div>

        {/* ETA track record — the actual fix for "the AD walks over instead
            of trusting the app": a visible history of whether this gaffer's
            stated ETAs have held up. Trust the number because it's been
            right before, not because a button looks confident. */}
        {trackRecord.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, padding: '8px 12px', background: 'var(--paper)', borderRadius: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--muted-dim)' }}>
            ETA track record
          </span>
          <div style={{ display: 'flex', gap: 4 }}>
            {trackRecord.map((r, i) => (
              <span
                key={i}
                title={`Setup ${r.setup} — ${r.result === 'onTime' ? 'on time' : 'ran late'}`}
                style={{
                  width: 18, height: 18, borderRadius: '50%',
                  background: r.result === 'onTime' ? 'rgba(138,180,199,0.18)' : 'rgba(226,73,60,0.14)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
              >
                {r.result === 'onTime'
                  ? <Check size={11} style={{ color: 'var(--teal-text)' }} />
                  : <X size={11} style={{ color: 'var(--stop-red-text)' }} />}
              </span>
            ))}
          </div>
          <span style={{ fontSize: 12, color: 'var(--muted)' }}>
            {trackRecord.filter(r => r.result === 'onTime').length}/{trackRecord.length} on time, last {trackRecord.length} setups
          </span>
        </div>
        )}

        {/* Reference photo — evidence the AD can check instead of walking
            to the lighting truck. Attached the same moment the status is
            set, same principle as the Wardrobe contact sheet. */}
        {referencePhoto && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, padding: 10, background: 'var(--paper)', borderRadius: 8 }}>
            <img src={referencePhoto} alt="Lighting reference" style={{ width: 56, height: 42, objectFit: 'cover', borderRadius: 6 }} />
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink)' }}>Reference photo attached</div>
              <div style={{ fontSize: 11, color: 'var(--muted-dim)' }}>Visible to AD, DP, and Director without walking over</div>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={openCamera}
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
      {lighting && lighting.equipment.length > 0 && (
        <div className="card" style={{ padding: 24, marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted-dim)', marginBottom: 16 }}>
            Power & Equipment
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
            {lighting.equipment.map(item => {
              const Icon = equipmentIcon(item.name);
              return (
                <div key={item.name} style={{ padding: 14, background: 'var(--paper)', borderRadius: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <Icon size={14} style={{ color: item.tone === 'watch' ? 'var(--bronze-text)' : 'var(--teal-text)' }} />
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink)' }}>{item.name}</span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>{item.status}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Equipment checklist */}
      {lighting && lighting.checklist.length > 0 && (
        <div className="card" style={{ padding: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted-dim)', marginBottom: 16 }}>
            Setup Checklist
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {lighting.checklist.map((item, i) => (
              <label key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 10, background: 'var(--paper)', borderRadius: 6, cursor: 'pointer', fontSize: 13, color: 'var(--ink)' }}>
                <input type="checkbox" style={{ width: 16, height: 16, accentColor: 'var(--teal-text)' }} />
                <span>{item}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={onFileCaptured}
        style={{ display: 'none' }}
      />

      {/* Camera — marking ready and attaching proof are one action, same
          principle as the Wardrobe contact sheet. */}
      {showCamera && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'rgba(6,15,20,0.92)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16,
          padding: 24
        }}>
          <div style={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>Lighting reference{setup ? ` — Setup ${setup.setupNumber}` : ''}</div>

          {!capturedShot ? (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{ maxWidth: '100%', maxHeight: '60vh', borderRadius: 12, background: '#000' }}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <button
                  onClick={cancelCamera}
                  title="Cancel"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: 48, height: 48, borderRadius: 24, border: 'none',
                    background: 'rgba(255,255,255,0.12)', color: '#fff', cursor: 'pointer'
                  }}
                >
                  <X size={22} />
                </button>
                <button
                  onClick={captureShot}
                  title="Capture"
                  style={{
                    width: 66, height: 66, borderRadius: 33, cursor: 'pointer',
                    background: '#fff', border: '4px solid rgba(255,255,255,0.4)'
                  }}
                />
                <button
                  onClick={confirmReady}
                  title="Skip photo, mark ready anyway"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: 48, height: 48, borderRadius: 24, border: '1px solid rgba(255,255,255,0.3)',
                    background: 'none', color: '#fff', cursor: 'pointer'
                  }}
                >
                  <Camera size={18} style={{ opacity: 0.5 }} />
                </button>
              </div>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>Right button skips the photo and marks ready anyway</span>
            </>
          ) : (
            <div style={{ width: '100%', maxWidth: 420, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <img src={capturedShot} alt="" style={{ width: '100%', maxHeight: '45vh', objectFit: 'contain', borderRadius: 12, background: '#000' }} />
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={() => setCapturedShot(null)}
                  style={{ flex: 1, padding: '10px 0', borderRadius: 6, border: '1px solid rgba(255,255,255,0.25)', background: 'none', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                >
                  Retake
                </button>
                <button
                  onClick={confirmReady}
                  style={{ flex: 2, padding: '10px 0', borderRadius: 6, border: 'none', background: 'var(--gold)', color: '#0a0e17', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
                >
                  Confirm Ready
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
