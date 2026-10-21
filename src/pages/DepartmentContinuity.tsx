import { useEffect, useRef, useState } from 'react';
import { production } from '../data/seed';
import { useApp } from '../App';
import { Camera, Plus, X, AlertCircle } from 'lucide-react';

type Dept = 'props' | 'art';

interface ContinuityEntry {
  id: string;
  department: Dept;
  itemName: string;
  note: string;
  dataUrl: string;
  timestamp: string;
  isFood: boolean;
  brandNote: string;
}

const TABS: { key: Dept; label: string }[] = [
  { key: 'props', label: 'Props' },
  { key: 'art', label: 'Art Department' },
];

// One role per tab owns the write — matches continuity_items' insert
// policy in 0001_initial_schema.sql exactly, so a role that isn't Props
// or Art Department gets the read-only view, same principle as the
// 1st AD gate on AD Command.
const OWNING_ROLE: Record<Dept, string> = { props: 'Props', art: 'Art Department' };

function nowLabel() {
  return new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

export default function DepartmentContinuity() {
  const { role } = useApp();
  const setup = production.currentSetup;
  const [activeTab, setActiveTab] = useState<Dept>('props');
  const [entries, setEntries] = useState<ContinuityEntry[]>([]);
  const [openEntry, setOpenEntry] = useState<ContinuityEntry | null>(null);

  // Add-item flow: name the item (and, for Props, flag food/branded goods
  // needing a clearance note) before the camera opens — same shape as
  // continuity_items, just without a character attached.
  const [adding, setAdding] = useState(false);
  const [draftName, setDraftName] = useState('');
  const [draftIsFood, setDraftIsFood] = useState(false);
  const [draftBrandNote, setDraftBrandNote] = useState('');
  const [capturing, setCapturing] = useState(false);
  const [capturedShot, setCapturedShot] = useState<string | null>(null);
  const [draftNote, setDraftNote] = useState('');

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canCapture = role === OWNING_ROLE[activeTab];
  const sheet = entries.filter(e => e.department === activeTab);

  const stopStream = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
  };

  const startAdd = () => {
    setAdding(true);
    setDraftName('');
    setDraftIsFood(false);
    setDraftBrandNote('');
  };

  const openCamera = async () => {
    if (!draftName.trim()) return;
    setAdding(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream;
      setCapturing(true);
    } catch {
      fileInputRef.current?.click();
    }
  };

  useEffect(() => {
    if (capturing && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [capturing]);

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

  const onFileCaptured = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCapturedShot(URL.createObjectURL(file));
      setCapturing(true);
    }
    e.target.value = '';
  };

  const saveEntry = () => {
    if (!capturedShot) return;
    const entry: ContinuityEntry = {
      id: `${Date.now()}`,
      department: activeTab,
      itemName: draftName.trim(),
      note: draftNote.trim(),
      dataUrl: capturedShot,
      timestamp: nowLabel(),
      isFood: draftIsFood,
      brandNote: draftBrandNote.trim(),
    };
    setEntries(prev => [...prev, entry]);
    closeCamera();
  };

  const closeCamera = () => {
    stopStream();
    setCapturing(false);
    setCapturedShot(null);
    setDraftNote('');
  };

  return (
    <div style={{ padding: '32px 28px', maxWidth: 840 }}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={onFileCaptured}
        style={{ display: 'none' }}
      />

      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: 'italic', fontSize: 22, fontWeight: 700, color: 'var(--ink-warm)', marginBottom: 4 }}>
          Set &amp; Props Continuity
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 14 }}>
          {production.title} · Scene {setup.scene} · Setup {setup.setupNumber}
          {!canCapture && ' · read-only for your role'}
        </p>
      </div>

      {/* Tabs — one shared screen, same continuity_items shape, filtered
          by department instead of three separate bespoke pages. */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            style={{
              padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600,
              border: '1px solid', cursor: 'pointer',
              borderColor: activeTab === t.key ? 'var(--teal-text)' : 'var(--border)',
              background: activeTab === t.key ? 'rgba(138,180,199,0.14)' : 'var(--surface)',
              color: activeTab === t.key ? 'var(--teal-text)' : 'var(--muted)',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="card" style={{ padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted-dim)' }}>
            Contact Sheet — {TABS.find(t => t.key === activeTab)?.label}
          </div>
          <span style={{ fontSize: 11, color: 'var(--muted-dim)' }}>{sheet.length} item{sheet.length === 1 ? '' : 's'}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 10 }}>
          {sheet.map(entry => (
            <button
              key={entry.id}
              onClick={() => setOpenEntry(entry)}
              style={{
                aspectRatio: '4/3', background: `center/cover no-repeat url(${entry.dataUrl})`,
                borderRadius: 8, border: '1px solid var(--border)', cursor: 'pointer',
                position: 'relative', overflow: 'hidden', padding: 0
              }}
            >
              <div style={{
                position: 'absolute', left: 0, right: 0, bottom: 0,
                padding: '4px 6px', background: 'linear-gradient(0deg, rgba(6,15,20,0.85), transparent)',
                textAlign: 'left'
              }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: '#fff' }}>{entry.itemName}</div>
                <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.75)' }} className="mono">{entry.timestamp}</div>
              </div>
              {entry.isFood && (
                <div style={{ position: 'absolute', top: 4, right: 4, width: 6, height: 6, borderRadius: '50%', background: 'var(--gold)' }} title="Food / branded prop — clearance note attached" />
              )}
            </button>
          ))}

          {canCapture && (
            !adding ? (
              <button
                onClick={startAdd}
                style={{
                  aspectRatio: '4/3', background: 'var(--paper-deep)', borderRadius: 8,
                  border: '1px dashed var(--border-strong)', cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4
                }}
              >
                <Plus size={18} style={{ color: 'var(--muted-dim)' }} />
                <span style={{ fontSize: 11, color: 'var(--muted)' }}>Add Item</span>
              </button>
            ) : (
              <div style={{
                aspectRatio: '4/3', background: 'var(--paper-deep)', borderRadius: 8,
                border: '1px solid var(--border-strong)', padding: 8,
                display: 'flex', flexDirection: 'column', gap: 6, justifyContent: 'center'
              }}>
                <input
                  autoFocus
                  value={draftName}
                  onChange={e => setDraftName(e.target.value)}
                  placeholder="Item name…"
                  style={{ width: '100%', padding: '4px 6px', fontSize: 11, borderRadius: 4, border: '1px solid var(--border-strong)', background: 'var(--surface)', color: 'var(--ink)' }}
                />
                {activeTab === 'props' && (
                  <label style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: 'var(--muted)', cursor: 'pointer' }}>
                    <input type="checkbox" checked={draftIsFood} onChange={e => setDraftIsFood(e.target.checked)} style={{ accentColor: 'var(--teal-text)' }} />
                    Food / branded prop
                  </label>
                )}
                {activeTab === 'props' && draftIsFood && (
                  <input
                    value={draftBrandNote}
                    onChange={e => setDraftBrandNote(e.target.value)}
                    placeholder="e.g. fake brand — no clearance"
                    style={{ width: '100%', padding: '4px 6px', fontSize: 10, borderRadius: 4, border: '1px solid var(--border-strong)', background: 'var(--surface)', color: 'var(--ink)' }}
                  />
                )}
                <div style={{ display: 'flex', gap: 4 }}>
                  <button
                    disabled={!draftName.trim()}
                    onClick={openCamera}
                    style={{
                      flex: 1, padding: '4px 0', borderRadius: 4, border: 'none',
                      background: 'var(--gold)', color: '#0a0e17', fontSize: 10, fontWeight: 700,
                      cursor: draftName.trim() ? 'pointer' : 'default', opacity: draftName.trim() ? 1 : 0.5
                    }}
                  >
                    Use
                  </button>
                  <button
                    onClick={() => setAdding(false)}
                    style={{ padding: '4px 8px', borderRadius: 4, border: 'none', background: 'none', color: 'var(--muted-dim)', fontSize: 10, cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )
          )}
        </div>

        {sheet.length === 0 && !adding && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, fontSize: 12, color: 'var(--muted-dim)' }}>
            <AlertCircle size={13} />
            No continuity items logged yet for {TABS.find(t => t.key === activeTab)?.label.toLowerCase()}.
          </div>
        )}
      </div>

      {/* Camera + note — same flow as Wardrobe's contact sheet. */}
      {capturing && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(6,15,20,0.92)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: 24
        }}>
          <div style={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>{draftName}</div>
          {!capturedShot ? (
            <>
              <video ref={videoRef} autoPlay playsInline muted style={{ maxWidth: '100%', maxHeight: '60vh', borderRadius: 12, background: '#000' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <button onClick={closeCamera} title="Cancel" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 48, height: 48, borderRadius: 24, border: 'none', background: 'rgba(255,255,255,0.12)', color: '#fff', cursor: 'pointer' }}>
                  <X size={22} />
                </button>
                <button onClick={captureShot} title="Capture" style={{ width: 66, height: 66, borderRadius: 33, cursor: 'pointer', background: '#fff', border: '4px solid rgba(255,255,255,0.4)' }} />
              </div>
            </>
          ) : (
            <div style={{ width: '100%', maxWidth: 420, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <img src={capturedShot} alt="" style={{ width: '100%', maxHeight: '45vh', objectFit: 'contain', borderRadius: 12, background: '#000' }} />
              <textarea
                autoFocus
                value={draftNote}
                onChange={e => setDraftNote(e.target.value)}
                placeholder="Add a continuity note (optional)"
                rows={3}
                style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.08)', color: '#fff', fontSize: 13, resize: 'none', fontFamily: "'Playfair Display', Georgia, serif" }}
              />
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setCapturedShot(null)} style={{ flex: 1, padding: '10px 0', borderRadius: 6, border: '1px solid rgba(255,255,255,0.25)', background: 'none', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  Retake
                </button>
                <button onClick={saveEntry} style={{ flex: 2, padding: '10px 0', borderRadius: 6, border: 'none', background: 'var(--gold)', color: '#0a0e17', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                  Save to Contact Sheet
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Opened item — full view + its note */}
      {openEntry && (
        <div onClick={() => setOpenEntry(null)} style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(6,15,20,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div onClick={e => e.stopPropagation()} style={{ maxWidth: 440, width: '100%', background: 'var(--surface)', borderRadius: 12, overflow: 'hidden' }}>
            <img src={openEntry.dataUrl} alt="" style={{ width: '100%', maxHeight: '50vh', objectFit: 'contain', background: '#000' }} />
            <div style={{ padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--ink)' }}>{openEntry.itemName}</span>
                <span className="mono" style={{ fontSize: 11, color: 'var(--muted-dim)' }}>{openEntry.timestamp}</span>
              </div>
              <p style={{ fontSize: 13, color: openEntry.note ? 'var(--ink)' : 'var(--muted-dim)', fontStyle: openEntry.note ? 'normal' : 'italic', marginBottom: openEntry.isFood ? 8 : 0 }}>
                {openEntry.note || 'No note added.'}
              </p>
              {openEntry.isFood && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, padding: 8, background: 'rgba(230,184,0,0.12)', borderRadius: 6, fontSize: 12, color: 'var(--bronze-text)' }}>
                  <AlertCircle size={13} style={{ flexShrink: 0, marginTop: 1 }} />
                  <span>Food / branded prop{openEntry.brandNote ? ` — ${openEntry.brandNote}` : ''}</span>
                </div>
              )}
              <button onClick={() => setOpenEntry(null)} style={{ marginTop: 10, padding: '7px 14px', borderRadius: 6, border: '1px solid var(--border-strong)', background: 'none', color: 'var(--ink)', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {!canCapture && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16, fontSize: 12, color: 'var(--muted-dim)' }}>
          <Camera size={13} />
          Only {OWNING_ROLE[activeTab]} can add items on this tab — you're viewing read-only.
        </div>
      )}
    </div>
  );
}
