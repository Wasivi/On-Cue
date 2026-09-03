import { useApp } from '../App';
import { Upload, FileSpreadsheet, Sparkles, CheckCircle, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { callSheetData, production } from '../data/seed';

export default function Onboarding() {
  const { setPage } = useApp();
  const [step, setStep] = useState<'choose' | 'importing' | 'done'>('choose');
  const [progress, setProgress] = useState(0);

  const startImport = () => {
    setStep('importing');
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 15;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        setTimeout(() => setStep('done'), 400);
      }
      setProgress(Math.min(p, 100));
    }, 300);
  };

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '60px 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        {/* No separate mark here — Layout already puts one next to "On
            Cue" at the top of every page, this one was a redundant second
            copy. One mark, made to carry the weight, instead of two. */}
        {/* Bigger — already Playfair by inheritance, just needed more
            presence. */}
        <div style={{ color: '#e6b800', fontSize: 21, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>
          DSI PRODUCTION
        </div>
        {/* White, like the "On Cue" wordmark — this sits directly on the
            page's dark-to-light gradient now, not a white background. */}
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, letterSpacing: '-0.02em', color: '#ffffff' }}>
          Create Today's Set
        </h1>
        {/* Show name leads, then season/episode/day — the show itself was
            missing before, only the episode info showed. */}
        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 15, fontWeight: 700 }}>
          {production.title} · S{production.season}E{production.episode} "{production.episodeTitle}" · Shoot Day {production.shootDay} · NYC
        </p>
      </div>

      {step === 'choose' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Zigzag: this one sits flush left, the next starts further
              right (roughly under where "Call" falls in this label), the
              third moves back — a staggered column, not a flush stack. */}
          <button onClick={startImport} className="card" style={{
            padding: '8px 20px', textAlign: 'left', cursor: 'pointer', border: '1px solid var(--border)',
            display: 'flex', alignItems: 'flex-start', gap: 16, background: 'var(--workspace-surface)',
            borderRadius: 28, width: '88%', marginLeft: 0
          }}>
            <div style={{ padding: 10, borderRadius: 8, background: '#e0f2f7', color: '#1a5f7a' }}>
              <Upload size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Upload Call Sheet</h3>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>PDF, Excel, or CSV. Extracts crew, cast, locations, scenes, parking, and tactical equipment.</p>
            </div>
            <ArrowRight size={18} style={{ marginLeft: 'auto', color: 'var(--text-muted)', marginTop: 4 }} />
          </button>

          <button onClick={startImport} className="card" style={{
            padding: '8px 20px', textAlign: 'left', cursor: 'pointer', border: '1px solid var(--border)',
            display: 'flex', alignItems: 'flex-start', gap: 16, background: 'var(--workspace-surface)',
            borderRadius: 28, width: 'calc(68% + 55px)', marginLeft: '30%'
          }}>
            <div style={{ padding: 10, borderRadius: 8, background: '#ede9fe', color: '#553c9a' }}>
              <FileSpreadsheet size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Import Production Schedule</h3>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Movie Magic, StudioBinder, or spreadsheet export with scene breakdowns.</p>
            </div>
            <ArrowRight size={18} style={{ marginLeft: 'auto', color: 'var(--text-muted)', marginTop: 4 }} />
          </button>

          <button onClick={startImport} className="card" style={{
            padding: '8px 20px', textAlign: 'left', cursor: 'pointer', border: '1px solid var(--border)',
            display: 'flex', alignItems: 'flex-start', gap: 16, background: 'var(--workspace-surface)',
            borderRadius: 28, width: '76%', alignSelf: 'center'
          }}>
            <div style={{ padding: 10, borderRadius: 8, background: '#fef6e6', color: '#c9870a' }}>
              <Sparkles size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Start With a Template</h3>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Build a sample DSI shoot day in 2 minutes with fictional data.</p>
            </div>
            <ArrowRight size={18} style={{ marginLeft: 'auto', color: 'var(--text-muted)', marginTop: 4 }} />
          </button>
        </div>
      )}

      {step === 'importing' && (
        <div className="card" style={{ padding: 40, textAlign: 'center' }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 24 }}>Processing DSI call sheet...</h3>
          <div style={{
            height: 6, borderRadius: 3, background: '#e5e2dc',
            overflow: 'hidden', marginBottom: 24
          }}>
            <div style={{
              height: '100%', width: `${progress}%`,
              background: '#1a5f7a',
              borderRadius: 3,
              transition: 'width 0.3s ease'
            }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, textAlign: 'left', maxWidth: 340, margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: progress > 20 ? 'var(--text-primary)' : 'var(--text-muted)' }}>
              <CheckCircle size={14} style={{ color: progress > 20 ? '#1a5f7a' : 'var(--text-muted)' }} />
              {callSheetData.crewCount} crew members recognized
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: progress > 40 ? 'var(--text-primary)' : 'var(--text-muted)' }}>
              <CheckCircle size={14} style={{ color: progress > 40 ? '#1a5f7a' : 'var(--text-muted)' }} />
              {callSheetData.castCount} cast members recognized
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: progress > 55 ? 'var(--text-primary)' : 'var(--text-muted)' }}>
              <CheckCircle size={14} style={{ color: progress > 55 ? '#1a5f7a' : 'var(--text-muted)' }} />
              {callSheetData.locations} locations found
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: progress > 70 ? 'var(--text-primary)' : 'var(--text-muted)' }}>
              <CheckCircle size={14} style={{ color: progress > 70 ? '#1a5f7a' : 'var(--text-muted)' }} />
              {callSheetData.scenesScheduled} scenes scheduled
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: progress > 85 ? 'var(--text-primary)' : 'var(--text-muted)' }}>
              <CheckCircle size={14} style={{ color: progress > 85 ? '#1a5f7a' : 'var(--text-muted)' }} />
              {callSheetData.departmentAssignments} department assignments created
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: progress > 92 ? 'var(--text-primary)' : 'var(--text-muted)' }}>
              <CheckCircle size={14} style={{ color: progress > 92 ? '#1a5f7a' : 'var(--text-muted)' }} />
              {callSheetData.pictureVehicles} picture vehicles assigned
            </div>
          </div>
        </div>
      )}

      {step === 'done' && (
        <div className="card" style={{ padding: 40, textAlign: 'center' }}>
          <CheckCircle size={48} style={{ color: '#1a5f7a', marginBottom: 16 }} />
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Call sheet imported</h3>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 24 }}>
            DSI · S8E9 "Lone Wolf" · Shoot Day 9 is ready.
          </p>
          <button onClick={() => setPage('myset')} className="btn btn-primary" style={{ padding: '12px 28px', fontSize: 14 }}>
            Review Shoot Day
          </button>
        </div>
      )}
    </div>
  );
}
