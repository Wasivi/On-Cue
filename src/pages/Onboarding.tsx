import { useApp } from '../App';
import { Upload, FileSpreadsheet, Sparkles, CheckCircle, ArrowRight } from 'lucide-react';
import { useRef, useState } from 'react';
import { callSheetData } from '../data/seed';
import Wordmark from '../components/Wordmark';

export default function Onboarding() {
  const { setPage } = useApp();
  const [step, setStep] = useState<'choose' | 'importing' | 'done'>('choose');
  const [progress, setProgress] = useState(0);
  const [sourceLabel, setSourceLabel] = useState('a fictional template');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startImport = (label?: string) => {
    setSourceLabel(label ?? 'a fictional template');
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

  const handleFilePicked = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    startImport(file ? file.name : undefined);
    e.target.value = '';
  };

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '60px 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <Wordmark size={32} light={false} />
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, letterSpacing: '-0.02em' }}>
          Create Today's Set
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
          How do you want to start Shoot Day 12?
        </p>
      </div>

      {step === 'choose' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.xlsx,.xls,.csv"
            onChange={handleFilePicked}
            style={{ display: 'none' }}
          />

          <button onClick={() => fileInputRef.current?.click()} className="card" style={{
            padding: 24, textAlign: 'left', cursor: 'pointer', border: '1px solid var(--border)',
            display: 'flex', alignItems: 'flex-start', gap: 16, background: 'var(--workspace-surface)'
          }}>
            <div style={{ padding: 10, borderRadius: 3, background: 'var(--teal-light)', color: 'var(--teal)' }}>
              <Upload size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Upload Call Sheet</h3>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>PDF, Excel, or CSV. AI extracts crew, cast, locations, scenes, and parking.</p>
            </div>
            <ArrowRight size={18} style={{ marginLeft: 'auto', color: 'var(--text-muted)', marginTop: 4 }} />
          </button>

          <button onClick={() => fileInputRef.current?.click()} className="card" style={{
            padding: 24, textAlign: 'left', cursor: 'pointer', border: '1px solid var(--border)',
            display: 'flex', alignItems: 'flex-start', gap: 16, background: 'var(--workspace-surface)'
          }}>
            <div style={{ padding: 10, borderRadius: 3, background: 'var(--violet-light)', color: 'var(--violet)' }}>
              <FileSpreadsheet size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Import Production Schedule</h3>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Movie Magic, StudioBinder, or spreadsheet export.</p>
            </div>
            <ArrowRight size={18} style={{ marginLeft: 'auto', color: 'var(--text-muted)', marginTop: 4 }} />
          </button>

          <button onClick={() => startImport()} className="card" style={{
            padding: 24, textAlign: 'left', cursor: 'pointer', border: '1px solid var(--border)',
            display: 'flex', alignItems: 'flex-start', gap: 16, background: 'var(--workspace-surface)'
          }}>
            <div style={{ padding: 10, borderRadius: 3, background: 'var(--amber-light)', color: 'var(--amber)' }}>
              <Sparkles size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Start With a Template</h3>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Build a sample shoot day in 2 minutes with fictional data.</p>
            </div>
            <ArrowRight size={18} style={{ marginLeft: 'auto', color: 'var(--text-muted)', marginTop: 4 }} />
          </button>
        </div>
      )}

      {step === 'importing' && (
        <div className="card" style={{ padding: 40, textAlign: 'center' }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Processing {sourceLabel}...</h3>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>
            This prototype simulates AI extraction locally — no file leaves your browser.
          </p>
          <div style={{
            height: 6, borderRadius: 2, background: 'var(--border)',
            overflow: 'hidden', marginBottom: 24
          }}>
            <div style={{
              height: '100%', width: '100%',
              background: 'var(--teal)',
              borderRadius: 2,
              transform: `scaleX(${progress / 100})`,
              transformOrigin: 'left',
              transition: 'transform 0.3s ease'
            }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, textAlign: 'left', maxWidth: 320, margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: progress > 20 ? 'var(--text-primary)' : 'var(--text-muted)' }}>
              <CheckCircle size={14} style={{ color: progress > 20 ? 'var(--teal)' : 'var(--text-muted)' }} />
              {callSheetData.crewCount} crew members recognized
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: progress > 40 ? 'var(--text-primary)' : 'var(--text-muted)' }}>
              <CheckCircle size={14} style={{ color: progress > 40 ? 'var(--teal)' : 'var(--text-muted)' }} />
              {callSheetData.castCount} cast members recognized
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: progress > 55 ? 'var(--text-primary)' : 'var(--text-muted)' }}>
              <CheckCircle size={14} style={{ color: progress > 55 ? 'var(--teal)' : 'var(--text-muted)' }} />
              {callSheetData.locations} locations found
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: progress > 70 ? 'var(--text-primary)' : 'var(--text-muted)' }}>
              <CheckCircle size={14} style={{ color: progress > 70 ? 'var(--teal)' : 'var(--text-muted)' }} />
              {callSheetData.scenesScheduled} scenes scheduled
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: progress > 85 ? 'var(--text-primary)' : 'var(--text-muted)' }}>
              <CheckCircle size={14} style={{ color: progress > 85 ? 'var(--teal)' : 'var(--text-muted)' }} />
              {callSheetData.departmentAssignments} department assignments created
            </div>
          </div>
        </div>
      )}

      {step === 'done' && (
        <div className="card" style={{ padding: 40, textAlign: 'center' }}>
          <CheckCircle size={48} style={{ color: 'var(--teal)', marginBottom: 16 }} />
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Call sheet imported</h3>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 24 }}>
            Harbor Unit · Episode 104 · Shoot Day 12 is ready.
          </p>
          <button onClick={() => setPage('myset')} className="btn btn-primary" style={{ padding: '12px 28px', fontSize: 14 }}>
            Review Shoot Day
          </button>
        </div>
      )}
    </div>
  );
}
