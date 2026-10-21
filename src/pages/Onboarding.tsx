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
        <div style={{ color: 'var(--bronze-text)', fontSize: 21, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>
          {production.title}
        </div>
        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: 'italic', fontSize: 28, fontWeight: 700, marginBottom: 8, letterSpacing: '-0.01em', color: 'var(--ink-warm)' }}>
          Create Today's Set
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 15, fontWeight: 700 }}>
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
            display: 'flex', alignItems: 'flex-start', gap: 16, background: 'var(--surface)',
            borderRadius: 28, width: '88%', marginLeft: 0
          }}>
            <div style={{ padding: 10, borderRadius: 8, background: 'rgba(138,180,199,0.16)', color: 'var(--teal-text)' }}>
              <Upload size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4, color: 'var(--ink)' }}>Upload Call Sheet</h3>
              <p style={{ fontSize: 13, color: 'var(--muted)' }}>PDF, Excel, or CSV. Extracts crew, cast, locations, scenes, parking, and tactical equipment.</p>
            </div>
            <ArrowRight size={18} style={{ marginLeft: 'auto', color: 'var(--muted-dim)', marginTop: 4 }} />
          </button>

          <button onClick={startImport} className="card" style={{
            padding: '8px 20px', textAlign: 'left', cursor: 'pointer', border: '1px solid var(--border)',
            display: 'flex', alignItems: 'flex-start', gap: 16, background: 'var(--surface)',
            borderRadius: 28, width: 'calc(68% + 55px)', marginLeft: '30%'
          }}>
            <div style={{ padding: 10, borderRadius: 8, background: 'rgba(201,162,39,0.16)', color: 'var(--bronze-text)' }}>
              <FileSpreadsheet size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4, color: 'var(--ink)' }}>Import Production Schedule</h3>
              <p style={{ fontSize: 13, color: 'var(--muted)' }}>Movie Magic, StudioBinder, or spreadsheet export with scene breakdowns.</p>
            </div>
            <ArrowRight size={18} style={{ marginLeft: 'auto', color: 'var(--muted-dim)', marginTop: 4 }} />
          </button>

          <button onClick={startImport} className="card" style={{
            padding: '8px 20px', textAlign: 'left', cursor: 'pointer', border: '1px solid var(--border)',
            display: 'flex', alignItems: 'flex-start', gap: 16, background: 'var(--surface)',
            borderRadius: 28, width: '76%', alignSelf: 'center'
          }}>
            <div style={{ padding: 10, borderRadius: 8, background: 'rgba(230,184,0,0.16)', color: 'var(--bronze-text)' }}>
              <Sparkles size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4, color: 'var(--ink)' }}>Start With a Template</h3>
              <p style={{ fontSize: 13, color: 'var(--muted)' }}>Build a sample shoot day in 2 minutes with fictional data.</p>
            </div>
            <ArrowRight size={18} style={{ marginLeft: 'auto', color: 'var(--muted-dim)', marginTop: 4 }} />
          </button>
        </div>
      )}

      {step === 'importing' && (
        <div className="card" style={{ padding: 40, textAlign: 'center' }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 24, color: 'var(--ink)' }}>Processing call sheet...</h3>
          <div style={{
            height: 6, borderRadius: 3, background: 'var(--border)',
            overflow: 'hidden', marginBottom: 24
          }}>
            <div style={{
              height: '100%', width: '100%',
              background: 'var(--gold)',
              borderRadius: 3,
              transform: `scaleX(${progress / 100})`,
              transformOrigin: 'left',
              transition: 'transform 0.3s ease'
            }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, textAlign: 'left', maxWidth: 340, margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: progress > 20 ? 'var(--ink)' : 'var(--muted-dim)' }}>
              <CheckCircle size={14} style={{ color: progress > 20 ? 'var(--teal-text)' : 'var(--muted-dim)' }} />
              {callSheetData.crewCount} crew members recognized
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: progress > 40 ? 'var(--ink)' : 'var(--muted-dim)' }}>
              <CheckCircle size={14} style={{ color: progress > 40 ? 'var(--teal-text)' : 'var(--muted-dim)' }} />
              {callSheetData.castCount} cast members recognized
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: progress > 55 ? 'var(--ink)' : 'var(--muted-dim)' }}>
              <CheckCircle size={14} style={{ color: progress > 55 ? 'var(--teal-text)' : 'var(--muted-dim)' }} />
              {callSheetData.locations} locations found
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: progress > 70 ? 'var(--ink)' : 'var(--muted-dim)' }}>
              <CheckCircle size={14} style={{ color: progress > 70 ? 'var(--teal-text)' : 'var(--muted-dim)' }} />
              {callSheetData.scenesScheduled} scenes scheduled
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: progress > 85 ? 'var(--ink)' : 'var(--muted-dim)' }}>
              <CheckCircle size={14} style={{ color: progress > 85 ? 'var(--teal-text)' : 'var(--muted-dim)' }} />
              {callSheetData.departmentAssignments} department assignments created
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: progress > 92 ? 'var(--ink)' : 'var(--muted-dim)' }}>
              <CheckCircle size={14} style={{ color: progress > 92 ? 'var(--teal-text)' : 'var(--muted-dim)' }} />
              {callSheetData.pictureVehicles} picture vehicles assigned
            </div>
          </div>
        </div>
      )}

      {step === 'done' && (
        <div className="card" style={{ padding: 40, textAlign: 'center' }}>
          <CheckCircle size={48} style={{ color: 'var(--teal-text)', marginBottom: 16 }} />
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: 'var(--ink)' }}>Call sheet imported</h3>
          <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 24 }}>
            {production.title} · S{production.season}E{production.episode} "{production.episodeTitle}" · Shoot Day {production.shootDay} is ready.
          </p>
          <button onClick={() => setPage('myset')} className="btn btn-primary" style={{ padding: '12px 28px', fontSize: 14 }}>
            Review Shoot Day
          </button>
        </div>
      )}
    </div>
  );
}
