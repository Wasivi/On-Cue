import { useApp } from '../App';
import { Upload, FileSpreadsheet, Sparkles, CheckCircle, ArrowRight, FileQuestion } from 'lucide-react';
import { useRef, useState } from 'react';
import type { ProductionData } from '../types';
import { sampleForFile, templateSample } from '../data/samples';
import { scenesInOrder, showLine } from '../data/derive';

const CALL_SHEET_TYPES = '.pdf,.xls,.xlsx,.csv';
const SCHEDULE_TYPES = '.pdf,.xls,.xlsx,.csv,.mmms';

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`;

export default function Onboarding() {
  const { setPage, production, loadProduction } = useApp();
  const [step, setStep] = useState<'choose' | 'importing' | 'done' | 'unreadable'>('choose');
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState<string | null>(null);
  // What the import read, shown line by line while the progress bar runs.
  const [incoming, setIncoming] = useState<ProductionData | null>(null);

  // Reading any uploaded call sheet isn't built yet (BUILD_SPEC.md). Until
  // it is, a sample's own files are recognized by name and load what
  // reading them produces, and any other file gets an honest "can't read
  // this yet" instead of a pretend import. Picking the file is real either
  // way: a person chooses their own file, not a canned demo.
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startImport = (data: ProductionData, name: string | null) => {
    setFileName(name);
    setIncoming(data);
    setProgress(0);
    setStep('importing');
    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 15;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        setTimeout(() => {
          loadProduction(data);
          setStep('done');
        }, 400);
      }
      setProgress(Math.min(p, 100));
    }, 300);
  };

  const pickFile = (accept: string) => {
    if (fileInputRef.current) fileInputRef.current.accept = accept;
    fileInputRef.current?.click();
  };

  const onFileChosen = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const data = sampleForFile(file.name);
    if (!data) {
      setFileName(file.name);
      setStep('unreadable');
      return;
    }
    startImport(data, file.name);
  };

  // Each line names something the import actually found on the sheet,
  // and lights up as the progress bar passes it.
  const cs = incoming?.callSheet;
  const readLines = cs ? [
    { at: 10, text: `${cs.show.title}: ${cs.show.logoUrl ? 'logo and show details found' : 'show details found'}` },
    { at: 25, text: `${plural(cs.crew.length, 'crew lead')} recognized` },
    { at: 40, text: `${plural(cs.cast.length, 'cast member')} recognized` },
    { at: 55, text: `${plural(cs.locations.length, 'location')} found` },
    { at: 70, text: `${plural(scenesInOrder(cs).length, 'scene')} in shooting order` },
    { at: 85, text: `${plural(cs.departmentNotes.length, 'department note')} sent to their departments` },
    ...(cs.safety.length > 0 ? [{ at: 92, text: `${plural(cs.safety.length, 'safety briefing')} flagged for everyone` }] : []),
  ] : [];

  // The show only takes over the header once it has actually loaded.
  const loaded = step === 'done' ? production : null;
  const loadedShow = loaded?.callSheet.show;

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '60px 24px' }}>
      {/* One hidden file input, shared by every upload button. pickFile()
          sets its accept list right before opening it. */}
      <input ref={fileInputRef} type="file" onChange={onFileChosen} style={{ display: 'none' }} />

      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        {loadedShow?.logoUrl ? (
          <img
            src={loadedShow.logoUrl}
            alt={`${loadedShow.title} logo`}
            style={{ display: 'block', height: 56, width: 'auto', maxWidth: 260, margin: '0 auto 12px' }}
          />
        ) : (
          <div style={{ color: 'var(--bronze-text)', fontSize: 21, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>
            {loadedShow ? loadedShow.title : 'Start the Day'}
          </div>
        )}
        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: 'italic', fontSize: 28, fontWeight: 700, marginBottom: 8, letterSpacing: '-0.01em', color: 'var(--ink-warm)' }}>
          Create Today's Set
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 15, fontWeight: 700 }}>
          {loaded ? showLine(loaded.callSheet) : "Upload today's call sheet. Every screen builds from it."}
        </p>
      </div>

      {step === 'choose' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Zigzag: this one sits flush left, the next starts further
              right (roughly under where "Call" falls in this label), the
              third moves back — a staggered column, not a flush stack. */}
          <button onClick={() => pickFile(CALL_SHEET_TYPES)} className="card" style={{
            padding: '8px 20px', textAlign: 'left', cursor: 'pointer', border: '1px solid var(--border)',
            display: 'flex', alignItems: 'flex-start', gap: 16, background: 'var(--surface)',
            borderRadius: 28, width: '88%', marginLeft: 0
          }}>
            <div style={{ padding: 10, borderRadius: 8, background: 'rgba(138,180,199,0.16)', color: 'var(--teal-text)' }}>
              <Upload size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4, color: 'var(--ink)' }}>Upload Call Sheet</h3>
              <p style={{ fontSize: 13, color: 'var(--muted)' }}>PDF, Excel, or CSV. Reads the show and its logo, call times, scenes, cast, crew, and department notes.</p>
            </div>
            <ArrowRight size={18} style={{ marginLeft: 'auto', color: 'var(--muted-dim)', marginTop: 4 }} />
          </button>

          <button onClick={() => pickFile(SCHEDULE_TYPES)} className="card" style={{
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

          <button onClick={() => startImport(templateSample, null)} className="card" style={{
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
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4, color: 'var(--ink)' }}>
            {fileName ? 'Reading your call sheet...' : 'Building sample shoot day...'}
          </h3>
          {fileName && (
            <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>{fileName}</p>
          )}
          {!fileName && <div style={{ marginBottom: 20 }} />}
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, textAlign: 'left', maxWidth: 360, margin: '0 auto' }}>
            {readLines.map(line => (
              <div key={line.text} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: progress > line.at ? 'var(--ink)' : 'var(--muted-dim)' }}>
                <CheckCircle size={14} style={{ color: progress > line.at ? 'var(--teal-text)' : 'var(--muted-dim)', flexShrink: 0 }} />
                {line.text}
              </div>
            ))}
          </div>
        </div>
      )}

      {step === 'unreadable' && (
        <div className="card" style={{ padding: 40, textAlign: 'center' }}>
          <FileQuestion size={40} style={{ color: 'var(--bronze-text)', marginBottom: 16 }} />
          <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8, color: 'var(--ink)', overflowWrap: 'anywhere' }}>
            On-Cue can't read {fileName} yet
          </h3>
          <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 24, maxWidth: 460, marginLeft: 'auto', marginRight: 'auto' }}>
            Right now it reads its sample call sheet ({templateSample.callSheet.show.title}). Reading any
            show's call sheet is the next step: an assistant drafts the day from the file, and the
            production office checks it before anyone sees it.
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => pickFile(CALL_SHEET_TYPES)} className="btn btn-secondary">
              Choose Another File
            </button>
            <button onClick={() => startImport(templateSample, null)} className="btn btn-primary">
              Load the Sample Instead
            </button>
          </div>
        </div>
      )}

      {step === 'done' && loaded && (
        <div className="card" style={{ padding: 40, textAlign: 'center' }}>
          <CheckCircle size={48} style={{ color: 'var(--teal-text)', marginBottom: 16 }} />
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, color: 'var(--ink)', overflowWrap: 'anywhere' }}>
            {fileName ? `${fileName} imported` : 'Sample shoot day built'}
          </h3>
          <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 24 }}>
            {showLine(loaded.callSheet)} is ready.
          </p>
          <button onClick={() => setPage('myset')} className="btn btn-primary" style={{ padding: '12px 28px', fontSize: 14 }}>
            Review Shoot Day
          </button>
        </div>
      )}
    </div>
  );
}
