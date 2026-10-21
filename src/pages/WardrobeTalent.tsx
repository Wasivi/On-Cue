import { useEffect, useRef, useState } from 'react';
import { castLooks, production } from '../data/seed';
import { useApp } from '../App';
import { CheckCircle, AlertCircle, Camera, Clock, ArrowRight, ChevronDown, X, Plus } from 'lucide-react';

interface ContinuityPhoto {
  id: string;
  dataUrl: string;
  label: string;
  note: string;
  timestamp: string;
}

// Front and Back are always offered — everything else is typed in by
// whoever's capturing, not picked from a fixed list. A cuff today might
// be a torn patch or a mud stain tomorrow; the label should say what it
// actually is, not what a hardcoded array guessed it might be.
const QUICK_LABELS = ['Front', 'Back'];

function nowLabel() {
  return new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

export default function WardrobeTalent() {
  const { setActorReady, lightingReady, setHoldState } = useApp();
  const setup = production.currentSetup;
  const [castIndex, setCastIndex] = useState(0);
  const [pickerOpen, setPickerOpen] = useState(false);

  // One growing contact sheet per character — not three overwritable
  // slots. Every photo taken over the whole shoot day stays, the way a
  // real wardrobe continuity contact sheet accumulates shot by shot.
  const [photosByCharacter, setPhotosByCharacter] = useState<Record<string, ContinuityPhoto[]>>({});
  const [openPhoto, setOpenPhoto] = useState<ContinuityPhoto | null>(null);

  // Capture flow: pick a label -> camera -> review + optional note -> save.
  // Writing and photographing are one action, not two separate steps —
  // the note step sits right inside the same camera overlay.
  const [addingLabel, setAddingLabel] = useState(false);
  const [customLabel, setCustomLabel] = useState('');
  const [cameraLabel, setCameraLabel] = useState<string | null>(null);
  const [capturedShot, setCapturedShot] = useState<string | null>(null);
  const [draftNote, setDraftNote] = useState('');

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const capturingLabel = useRef<string | null>(null);
  const look = castLooks[castIndex];
  const sheet = photosByCharacter[look.character] ?? [];

  const stopStream = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
  };

  // A live camera feed — works on a laptop's built-in webcam as well as a
  // phone's camera. The file input's `capture` attribute (kept below) only
  // reliably opens a camera on mobile; on desktop it just shows a file
  // picker, so getUserMedia is the actual fix, with the file input as a
  // fallback if the browser blocks camera access or has none at all.
  const openCamera = async (label: string) => {
    setAddingLabel(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      streamRef.current = stream;
      setCameraLabel(label);
    } catch {
      capturingLabel.current = label;
      fileInputRef.current?.click();
    }
  };

  useEffect(() => {
    if (cameraLabel && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [cameraLabel]);

  useEffect(() => () => stopStream(), []);

  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video || !cameraLabel) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0);
    stopStream();
    setCapturedShot(canvas.toDataURL('image/jpeg', 0.9));
  };

  const saveShot = () => {
    if (!capturedShot || !cameraLabel) return;
    const entry: ContinuityPhoto = {
      id: `${Date.now()}`,
      dataUrl: capturedShot,
      label: cameraLabel,
      note: draftNote.trim(),
      timestamp: nowLabel(),
    };
    setPhotosByCharacter(prev => ({
      ...prev,
      [look.character]: [...(prev[look.character] ?? []), entry],
    }));
    closeCamera();
  };

  const closeCamera = () => {
    stopStream();
    setCameraLabel(null);
    setCapturedShot(null);
    setDraftNote('');
  };

  const onPhotoTaken = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const label = capturingLabel.current;
    if (file && label) {
      setCapturedShot(URL.createObjectURL(file));
      setCameraLabel(label);
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
        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: 'italic', fontSize: 22, fontWeight: 700, color: 'var(--ink-warm)', marginBottom: 4 }}>
          Wardrobe · Talent
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 14 }}>
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
                <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--ink)' }}>{look.character}</h2>
                <ChevronDown size={16} style={{ color: 'var(--muted-dim)', transform: pickerOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
              </button>

              {pickerOpen && (
                <div style={{
                  position: 'absolute', top: '100%', left: 0, zIndex: 20,
                  width: 260, background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: 10, padding: 6, boxShadow: 'var(--shadow-lg)'
                }}>
                  {castLooks.map((c, i) => (
                    <button
                      key={c.character}
                      onClick={() => { setCastIndex(i); setPickerOpen(false); }}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
                        width: '100%', textAlign: 'left', padding: '8px 10px', borderRadius: 6, border: 'none',
                        background: i === castIndex ? 'rgba(138,180,199,0.16)' : 'transparent',
                        color: i === castIndex ? 'var(--teal-text)' : 'var(--ink)',
                        fontSize: 13, fontWeight: i === castIndex ? 600 : 500, cursor: 'pointer'
                      }}
                    >
                      {c.character}
                      {c.resetRequired && <AlertCircle size={13} style={{ color: 'var(--stop-red-text)', flexShrink: 0 }} />}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div style={{ fontSize: 13, color: 'var(--muted)' }}>
              Scene {look.scene} · Look {look.lookNumber}
            </div>
            <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {look.items.map(item => (
                <span key={item} style={{ padding: '4px 10px', background: 'var(--paper)', borderRadius: 6, fontSize: 12, fontWeight: 500, color: 'var(--ink)' }}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Continuity notes — fictional seed notes from before this look
            had a real contact sheet; new notes now live on the photos
            themselves below, same as a real continuity log. */}
        <div style={{ background: 'var(--paper)', borderRadius: 10, padding: 16, marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted-dim)', marginBottom: 12 }}>
            Continuity State
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {look.continuityNotes.map((note, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: 'var(--ink)' }}>
                <Camera size={14} style={{ color: 'var(--teal-text)', marginTop: 2, flexShrink: 0 }} />
                <span>{note}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Contact sheet — a real production term: a grid of every
            continuity photo taken for this character, growing over the
            whole shoot, each one labeled and timestamped like a real
            wardrobe continuity log, not three fixed slots that overwrite
            themselves. */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted-dim)' }}>
              Contact Sheet — {look.character}
            </div>
            <span style={{ fontSize: 11, color: 'var(--muted-dim)' }}>{sheet.length} photo{sheet.length === 1 ? '' : 's'}</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 10 }}>
            {sheet.map(photo => (
              <button
                key={photo.id}
                onClick={() => setOpenPhoto(photo)}
                style={{
                  aspectRatio: '4/3', background: `center/cover no-repeat url(${photo.dataUrl})`,
                  borderRadius: 8, border: '1px solid var(--border)', cursor: 'pointer',
                  position: 'relative', overflow: 'hidden', padding: 0
                }}
              >
                <div style={{
                  position: 'absolute', left: 0, right: 0, bottom: 0,
                  padding: '4px 6px', background: 'linear-gradient(0deg, rgba(6,15,20,0.85), transparent)',
                  textAlign: 'left'
                }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: '#fff' }}>{photo.label}</div>
                  <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.75)' }} className="mono">{photo.timestamp}</div>
                </div>
                {photo.note && (
                  <div style={{ position: 'absolute', top: 4, right: 4, width: 6, height: 6, borderRadius: '50%', background: 'var(--gold)' }} title="Has a note" />
                )}
              </button>
            ))}

            {/* Add Photo tile — label it first (Front/Back or anything
                typed in), then the camera opens. */}
            {!addingLabel ? (
              <button
                onClick={() => setAddingLabel(true)}
                style={{
                  aspectRatio: '4/3', background: 'var(--paper-deep)', borderRadius: 8,
                  border: '1px dashed var(--border-strong)', cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4
                }}
              >
                <Plus size={18} style={{ color: 'var(--muted-dim)' }} />
                <span style={{ fontSize: 11, color: 'var(--muted)' }}>Add Photo</span>
              </button>
            ) : (
              <div style={{
                aspectRatio: '4/3', background: 'var(--paper-deep)', borderRadius: 8,
                border: '1px solid var(--border-strong)', padding: 8,
                display: 'flex', flexDirection: 'column', gap: 6, justifyContent: 'center'
              }}>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {QUICK_LABELS.map(l => (
                    <button key={l} onClick={() => openCamera(l)} style={{
                      padding: '3px 8px', borderRadius: 4, border: '1px solid var(--border-strong)',
                      background: 'var(--surface)', fontSize: 10, fontWeight: 600, color: 'var(--ink)', cursor: 'pointer'
                    }}>{l}</button>
                  ))}
                </div>
                <input
                  autoFocus
                  value={customLabel}
                  onChange={e => setCustomLabel(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && customLabel.trim()) openCamera(customLabel.trim()); }}
                  placeholder="e.g. Cuff, stain…"
                  style={{
                    width: '100%', padding: '4px 6px', fontSize: 11, borderRadius: 4,
                    border: '1px solid var(--border-strong)', background: 'var(--surface)', color: 'var(--ink)'
                  }}
                />
                <div style={{ display: 'flex', gap: 4 }}>
                  <button
                    disabled={!customLabel.trim()}
                    onClick={() => openCamera(customLabel.trim())}
                    style={{
                      flex: 1, padding: '4px 0', borderRadius: 4, border: 'none',
                      background: 'var(--gold)', color: '#0a0e17', fontSize: 10, fontWeight: 700,
                      cursor: customLabel.trim() ? 'pointer' : 'default', opacity: customLabel.trim() ? 1 : 0.5
                    }}
                  >
                    Use
                  </button>
                  <button
                    onClick={() => { setAddingLabel(false); setCustomLabel(''); }}
                    style={{ padding: '4px 8px', borderRadius: 4, border: 'none', background: 'none', color: 'var(--muted-dim)', fontSize: 10, cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Reset alert */}
        {look.resetRequired && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: 12,
            background: 'rgba(226,73,60,0.12)', borderRadius: 8, marginBottom: 16
          }}>
            <AlertCircle size={16} style={{ color: 'var(--stop-red-text)', flexShrink: 0 }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--stop-red-text)' }}>
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
        <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted-dim)', marginBottom: 16 }}>
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
                  background: item.status === 'current' ? 'var(--teal-text)' : item.status === 'upcoming' ? 'var(--border)' : 'rgba(138,180,199,0.16)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: item.status === 'current' ? '#fff' : item.status === 'upcoming' ? 'var(--muted-dim)' : 'var(--teal-text)',
                  fontSize: 11, fontWeight: 700, margin: '0 auto 6px'
                }}>
                  {item.scene}
                </div>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink)' }}>{item.look}</div>
                <div style={{ fontSize: 10, color: 'var(--muted-dim)' }}>{item.desc}</div>
              </div>
              {i < arr.length - 1 && <ArrowRight size={14} style={{ color: 'var(--border-strong)', flexShrink: 0 }} />}
            </div>
          ))}
        </div>
      </div>

      {/* Live camera + note — one continuous flow: shoot, then write the
          note right there, same moment, same screen. */}
      {cameraLabel && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'rgba(6,15,20,0.92)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16,
          padding: 24
        }}>
          <div style={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>{look.character} — {cameraLabel}</div>

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
                  onClick={closeCamera}
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
                  onClick={capturePhoto}
                  title="Capture"
                  style={{
                    width: 66, height: 66, borderRadius: 33, cursor: 'pointer',
                    background: '#fff', border: '4px solid rgba(255,255,255,0.4)'
                  }}
                />
              </div>
            </>
          ) : (
            <div style={{ width: '100%', maxWidth: 420, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <img src={capturedShot} alt="" style={{ width: '100%', maxHeight: '45vh', objectFit: 'contain', borderRadius: 12, background: '#000' }} />
              <textarea
                autoFocus
                value={draftNote}
                onChange={e => setDraftNote(e.target.value)}
                placeholder="Add a note (optional) — e.g. dust smudge on right shoulder"
                rows={3}
                style={{
                  width: '100%', padding: 10, borderRadius: 8, border: '1px solid rgba(255,255,255,0.25)',
                  background: 'rgba(255,255,255,0.08)', color: '#fff', fontSize: 13, resize: 'none',
                  fontFamily: "'Playfair Display', Georgia, serif"
                }}
              />
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={() => setCapturedShot(null)}
                  style={{ flex: 1, padding: '10px 0', borderRadius: 6, border: '1px solid rgba(255,255,255,0.25)', background: 'none', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                >
                  Retake
                </button>
                <button
                  onClick={saveShot}
                  style={{ flex: 2, padding: '10px 0', borderRadius: 6, border: 'none', background: 'var(--gold)', color: '#0a0e17', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
                >
                  Save to Contact Sheet
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Opened photo — full view + its note */}
      {openPhoto && (
        <div
          onClick={() => setOpenPhoto(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(6,15,20,0.92)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24
          }}
        >
          <div onClick={e => e.stopPropagation()} style={{ maxWidth: 440, width: '100%', background: 'var(--surface)', borderRadius: 12, overflow: 'hidden' }}>
            <img src={openPhoto.dataUrl} alt="" style={{ width: '100%', maxHeight: '50vh', objectFit: 'contain', background: '#000' }} />
            <div style={{ padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)' }}>{look.character} — {openPhoto.label}</span>
                <span className="mono" style={{ fontSize: 11, color: 'var(--muted-dim)' }}>{openPhoto.timestamp}</span>
              </div>
              <p style={{ fontSize: 13, color: openPhoto.note ? 'var(--ink)' : 'var(--muted-dim)', fontStyle: openPhoto.note ? 'normal' : 'italic' }}>
                {openPhoto.note || 'No note added.'}
              </p>
              <button
                onClick={() => setOpenPhoto(null)}
                style={{ marginTop: 10, padding: '7px 14px', borderRadius: 6, border: '1px solid var(--border-strong)', background: 'none', color: 'var(--ink)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
