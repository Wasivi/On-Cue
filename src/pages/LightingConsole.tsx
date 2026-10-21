import { useApp } from '../App';
import { production } from '../data/seed';
import { useEffect, useRef, useState } from 'react';
import { Zap, AlertTriangle, CheckCircle, Clock, Power, Cable, Sun, Camera, Check, X } from 'lucide-react';

// The real fix for "the AD walks to the lighting truck instead of trusting
// the app" isn't a video feed — that's video village's job. It's giving the
// AD two things an app actually can: a visible track record (has this
// gaffer's ETA been right before?) and photo evidence of the current state,
// so checking the app is genuinely as good as walking over.
const ETA_TRACK_RECORD: { setup: string; result: 'onTime' | 'late' }[] = [
  { setup: '11A', result: 'onTime' },
  { setup: '12B', result: 'onTime' },
  { setup: '13A', result: 'late' },
  { setup: '13B', result: 'onTime' },
  { setup: '14A', result: 'onTime' },
];

export default function LightingConsole() {
  const { setLightingReady, actorReady, setHoldState } = useApp();
  const setup = production.currentSetup;

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
    setLightingReady(true);
    if (actorReady) setHoldState('ready');
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
      if (actorReady) setHoldState('ready');
    }
    e.target.value = '';
  };

  return (
    <div style={{ padding: '32px 28px', maxWidth: 720 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: 'italic', fontSize: 22, fontWeight: 700, color: 'var(--ink-warm)', marginBottom: 4 }}>
          Lighting Console
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 14 }}>
          Gaffer view · Setup {setup.setupNumber} · Scene {setup.scene}
        </p>
      </div>

      {/* Alert */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12, padding: 16,
        background: 'rgba(201,162,39,0.14)', borderRadius: 10, marginBottom: 20, border: '1px solid rgba(201,162,39,0.3)'
      }}>
        <AlertTriangle size={20} style={{ color: 'var(--bronze-text)', flexShrink: 0 }} />
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--bronze-text)' }}>Pattern Alert</div>
          <div style={{ fontSize: 12, color: 'var(--bronze-text)' }}>
            Lighting contributed to delays in 3 of the past 5 setups. Consider pre-lighting Scene 43 while talent resets.
          </div>
        </div>
      </div>

      {/* Task card — a lamp leads the label, not a border stripe */}
      <div className="card" style={{ padding: 24, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted-dim)', marginBottom: 12 }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--bronze)', flexShrink: 0 }} />
          Current Task
        </div>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink)', marginBottom: 8 }}>
          Adjust key light for actor mark 2
        </h3>
        <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 16 }}>
          Key light (Arri SkyPanel S60) shifted during actor movement in Take 5. Move 18 inches camera-left. Soften to match f/2.8 exposure. Check no spill on background window.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
            <Clock size={14} style={{ color: 'var(--bronze-text)' }} />
            <span style={{ fontWeight: 600, color: 'var(--bronze-text)' }} className="mono">Target: 10:40 AM</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--ink)' }}>
            <Sun size={14} style={{ color: 'var(--muted-dim)' }} />
            <span>Scene 42 · Loft Kitchen</span>
          </div>
        </div>

        {/* ETA track record — the actual fix for "the AD walks over instead
            of trusting the app": a visible history of whether this gaffer's
            stated ETAs have held up. Trust the number because it's been
            right before, not because a button looks confident. */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, padding: '8px 12px', background: 'var(--paper)', borderRadius: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--muted-dim)' }}>
            ETA track record
          </span>
          <div style={{ display: 'flex', gap: 4 }}>
            {ETA_TRACK_RECORD.map((r, i) => (
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
            {ETA_TRACK_RECORD.filter(r => r.result === 'onTime').length}/{ETA_TRACK_RECORD.length} on time, last 5 setups
          </span>
        </div>

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
      <div className="card" style={{ padding: 24, marginBottom: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted-dim)', marginBottom: 16 }}>
          Power & Equipment
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          <div style={{ padding: 14, background: 'var(--paper)', borderRadius: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <Power size={14} style={{ color: 'var(--teal-text)' }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink)' }}>Generator A</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>Running · 78% load · 12 hrs fuel</div>
          </div>
          <div style={{ padding: 14, background: 'var(--paper)', borderRadius: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <Cable size={14} style={{ color: 'var(--teal-text)' }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink)' }}>Cable Run</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>Clear · Route marked · No trip hazards</div>
          </div>
          <div style={{ padding: 14, background: 'var(--paper)', borderRadius: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <Zap size={14} style={{ color: 'var(--teal-text)' }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink)' }}>Condor</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>Stowed · Not needed for this setup</div>
          </div>
          <div style={{ padding: 14, background: 'var(--paper)', borderRadius: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <Sun size={14} style={{ color: 'var(--bronze-text)' }} />
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink)' }}>Rain Tower</span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>Standing by · Water catch required</div>
          </div>
        </div>
      </div>

      {/* Equipment checklist */}
      <div className="card" style={{ padding: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted-dim)', marginBottom: 16 }}>
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
            <label key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 10, background: 'var(--paper)', borderRadius: 6, cursor: 'pointer', fontSize: 13, color: 'var(--ink)' }}>
              <input type="checkbox" style={{ width: 16, height: 16, accentColor: 'var(--teal-text)' }} />
              <span>{item}</span>
            </label>
          ))}
        </div>
      </div>

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
          <div style={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>Lighting reference — Setup {setup.setupNumber}</div>

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
