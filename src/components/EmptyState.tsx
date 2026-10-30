import { FileText, Inbox } from 'lucide-react';
import { useApp } from '../App';

// What a screen shows when it has nothing real to show. Another show's
// data never stands in. Two cases: no call sheet loaded at all, or a call
// sheet with nothing recorded yet for this part of the day.

export function NoCallSheet() {
  const { setPage } = useApp();
  return (
    <div style={{ padding: '32px 28px', maxWidth: 640 }}>
      <div className="card" style={{ padding: 32, textAlign: 'center' }}>
        <FileText size={28} style={{ color: 'var(--muted-dim)', marginBottom: 12 }} />
        <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)', marginBottom: 8 }}>
          No call sheet loaded yet
        </h2>
        <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 20 }}>
          Upload today's call sheet and every screen fills in from it: the show and its logo, call
          times, scenes, cast, and each department's notes.
        </p>
        <button onClick={() => setPage('onboarding')} className="btn btn-primary">
          Upload Call Sheet
        </button>
      </div>
    </div>
  );
}

export function NothingYet({ title, body }: { title: string; body: string }) {
  return (
    <div style={{ padding: '32px 28px', maxWidth: 640 }}>
      <div className="card" style={{ padding: 32, textAlign: 'center' }}>
        <Inbox size={28} style={{ color: 'var(--muted-dim)', marginBottom: 12 }} />
        <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)', marginBottom: 8 }}>{title}</h2>
        <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>{body}</p>
      </div>
    </div>
  );
}
