import { useApp } from '../App';
import type { Role } from '../types';
import { roleDescriptions } from '../data/reference';
import { castNames, clock, findScene, nextItem, notesForRole, shootDate, showLine } from '../data/derive';
import { NoCallSheet } from '../components/EmptyState';
import {
  Clock, MapPin, AlertCircle, CheckCircle, XCircle, ChevronRight,
  ShieldAlert, Sunset, Utensils, Hospital, CalendarClock
} from 'lucide-react';

type RoleButton = { label: string; primary?: boolean; danger?: boolean; onClick?: () => void };

// One labeled block of the call sheet card. Same shape for every fact, so
// whatever a show's sheet does or doesn't include, the card stays even.
function Fact({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted-dim)', marginBottom: 6 }}>
        {icon}
        {label}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 13, color: 'var(--ink)', lineHeight: 1.45 }}>
        {children}
      </div>
    </div>
  );
}

export default function MySet() {
  const { role, holdState, setLightingReady, setActorReady, setPage, production } = useApp();
  if (!production) return <NoCallSheet />;

  const { callSheet: cs, day } = production;
  const setup = day?.currentSetup;
  const scene = setup ? findScene(cs, setup.scene) : undefined;
  const location = cs.locations[0];
  const action = day?.roleActions[role];
  const myNotes = notesForRole(cs, role);
  // Next on the call sheet: whatever follows the scene being shot now, or
  // the day's first item if no setup has been called yet.
  const upcoming = setup ? nextItem(cs, setup.scene) : cs.schedule[0];

  // What each role can do from here. These are the same on every show; only
  // the task text above them comes from the day's record.
  const buttonsFor = (r: Role): RoleButton[] => {
    switch (r) {
      case 'Gaffer':
        return [
          // Only sets this department's own flag — the HOLD->READY
          // transition is the 1st AD's alone, via AD Command's gated
          // "Clear Hold" button, never an automatic side effect here.
          { label: 'Lighting Ready', primary: true, onClick: () => setLightingReady(true) },
          { label: 'Need 5 Minutes' },
          { label: 'Equipment Issue', danger: true }
        ];
      case 'Wardrobe':
        return [
          { label: 'Actor Ready', primary: true, onClick: () => setActorReady(true) },
          { label: 'Continuity Issue', danger: true },
          { label: 'Reset Needed', danger: true }
        ];
      case 'Script Supervisor':
        return [{ label: 'Print', primary: true }, { label: 'Hold' }, { label: 'No Good', danger: true }];
      case 'Director':
        return [{ label: 'Go Again', primary: true }, { label: 'Move On' }, { label: 'Tighter Shot' }];
      case 'Producer':
        return [
          { label: 'Approve Escalation', primary: true },
          { label: 'View Budget Impact', onClick: () => setPage('budget') }
        ];
      case 'UPM':
        return [
          { label: 'View Budget Impact', primary: true, onClick: () => setPage('budget') },
          { label: 'Flag Overtime Risk' }
        ];
      case 'Talent Assistant':
        return [
          { label: 'Talent in Holding', primary: true, onClick: () => setActorReady(true) },
          { label: 'Need More Time' },
          { label: 'Talent Issue', danger: true }
        ];
      case 'DP':
        return [{ label: 'Camera Ready', primary: true }, { label: 'Visual Issue', danger: true }];
      case 'Props':
      case 'Art Department':
        return [{ label: 'Reset Done', primary: true }, { label: 'Need 5 Minutes' }, { label: 'Continuity Issue', danger: true }];
      default: // 1st AD
        return [
          { label: 'Send 5-Min Check-in', primary: true },
          { label: 'Reorder Next Setup' },
          { label: 'Escalate', danger: true }
        ];
    }
  };

  return (
    <div style={{ padding: '32px 28px', maxWidth: 840 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <span className={`pill ${holdState === 'hold' ? 'pill-hold' : holdState === 'ready' ? 'pill-ready' : 'pill-wait'}`}>
            {holdState === 'hold' ? <AlertCircle size={12} /> : holdState === 'ready' ? <CheckCircle size={12} /> : <Clock size={12} />}
            {holdState === 'hold' ? 'HOLD' : holdState === 'ready' ? 'READY TO ROLL' : 'ROLLING'}
          </span>
          <span style={{ color: 'var(--muted-dim)', fontSize: 13 }}>
            {roleDescriptions[role]}
          </span>
        </div>
        <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: 'italic', fontSize: 22, fontWeight: 700, color: 'var(--ink-warm)', marginBottom: 4 }}>
          My Set
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 14 }}>
          {showLine(cs)} · {shootDate(cs)}
        </p>
      </div>

      {/* NOW card — a lamp leads the label, not a border stripe */}
      {setup && (
        <div className="card" style={{ padding: 24, marginBottom: 16 }}>
          <div className="section-label" style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: holdState === 'hold' ? 'var(--stop-red)' : holdState === 'ready' ? 'var(--teal)' : 'var(--gold)', flexShrink: 0 }} />
            NOW
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 20, fontWeight: 700, color: 'var(--ink)' }}>Setup {setup.setupNumber}</span>
            <span style={{ color: 'var(--muted)', fontSize: 14 }}>·</span>
            <span style={{ fontSize: 14, color: 'var(--muted)' }}>Scene {setup.scene}</span>
            {scene && (
              <>
                <span style={{ color: 'var(--muted)', fontSize: 14 }}>·</span>
                <span style={{ fontSize: 14, color: 'var(--muted)' }}>{scene.intExt} {scene.set} · {scene.dayNight}</span>
              </>
            )}
          </div>
          <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16 }}>
            {setup.description}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--ink)' }}>
              <Clock size={14} style={{ color: 'var(--muted-dim)' }} />
              <span className="mono">Target roll: {setup.targetRoll}</span>
            </div>
            {location && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--ink)' }}>
                <MapPin size={14} style={{ color: 'var(--muted-dim)' }} />
                <span>{location.name}{location.address ? `, ${location.address}` : ''}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* YOUR ACTION */}
      <div className="card" style={{ padding: 24, marginBottom: 16 }}>
        <div className="section-label">YOUR ACTION</div>
        {action ? (
          <>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--ink)', marginBottom: 8 }}>{action.action}</h3>
            <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 16 }}>
              {action.detail}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <Clock size={14} style={{ color: 'var(--bronze-text)' }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--bronze-text)' }} className="mono">
                Target ready: {action.target}
              </span>
            </div>
          </>
        ) : (
          <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 16 }}>
            Nothing assigned to you right now. Your department's notes from today's call sheet are below.
          </p>
        )}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {buttonsFor(role).map((btn, i) => (
            <button
              key={i}
              onClick={btn.onClick}
              className={`btn ${btn.primary ? 'btn-primary' : btn.danger ? 'btn-danger' : 'btn-secondary'}`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* WHAT CHANGED */}
      {day && (
        <div className="card" style={{ padding: 24, marginBottom: 16 }}>
          <div className="section-label">WHAT CHANGED</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {day.whatChanged.map((change, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: 'var(--ink)' }}>
                {change.kind === 'stop'
                  ? <XCircle size={14} style={{ color: 'var(--stop-red)', marginTop: 2, flexShrink: 0 }} />
                  : <AlertCircle size={14} style={{ color: 'var(--bronze)', marginTop: 2, flexShrink: 0 }} />}
                <span>{change.text}</span>
                <span className="mono" style={{ marginLeft: 'auto', paddingLeft: 8, fontSize: 11, color: 'var(--muted-dim)', whiteSpace: 'nowrap' }}>{change.time}</span>
              </div>
            ))}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13 }}>
              <Clock size={14} style={{ color: 'var(--muted-dim)', marginTop: 2, flexShrink: 0 }} />
              <span style={{ color: 'var(--muted)' }}>Next status check in 3 minutes</span>
            </div>
          </div>
        </div>
      )}

      {/* UP NEXT — straight from the call sheet's shooting order */}
      <div className="card" style={{ padding: 24, marginBottom: 16 }}>
        <div className="section-label">UP NEXT</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          {upcoming ? (
            upcoming.kind === 'scene' ? (
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>
                  Scene {upcoming.scene} — {upcoming.intExt} {upcoming.set} · {upcoming.dayNight}
                </div>
                <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>
                  {castNames(cs, upcoming)} · {upcoming.pages} pg{upcoming.notes ? ` · ${upcoming.notes}` : ''}
                </div>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>
                  {clock(upcoming.time)} — {upcoming.title}
                </div>
                <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>
                  {upcoming.who}{upcoming.notes ? ` · ${upcoming.notes}` : ''}
                </div>
              </div>
            )
          ) : (
            <div style={{ fontSize: 14, color: 'var(--muted)' }}>Last scene on today's call sheet.</div>
          )}
          <ChevronRight size={18} style={{ color: 'var(--muted-dim)', flexShrink: 0 }} />
        </div>
      </div>

      {/* Department notes — each role sees its own department's notes in
          full (broadcast status, scope detail); leads see every department. */}
      {myNotes.length > 0 && (
        <div className="card" style={{ padding: 24, marginBottom: 16 }}>
          <div className="section-label">FROM TODAY'S CALL SHEET</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {myNotes.map(dept => (
              <div key={dept.department}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)', marginBottom: 6 }}>
                  {dept.department}
                  {dept.owners.length > 0 && (
                    <span style={{ fontWeight: 400, color: 'var(--muted-dim)' }}> · {dept.owners.join(', ')}</span>
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {dept.notes.map((note, i) => (
                    <div key={i} style={{ fontSize: 13, color: 'var(--ink)', lineHeight: 1.5, paddingLeft: 10, borderLeft: '2px solid var(--border-strong)' }}>
                      {note.subject && <span style={{ fontWeight: 600 }}>{note.subject}: </span>}
                      {note.text}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TODAY'S CALL SHEET — the facts everyone shares */}
      <div className="card" style={{ padding: 24, marginBottom: 16 }}>
        <div className="section-label">TODAY'S CALL SHEET · {shootDate(cs, 'long')}</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 18, marginBottom: cs.safety.length ? 18 : 0 }}>
          <Fact icon={<Clock size={12} />} label="Calls">
            {cs.calls.map(c => (
              <div key={c.label}>{c.label} <span className="mono" style={{ fontWeight: 600 }}>{clock(c.time)}</span></div>
            ))}
          </Fact>
          {cs.meals.length > 0 && (
            <Fact icon={<Utensils size={12} />} label="Meals">
              {cs.meals.map(m => (
                <div key={m.label}>
                  {m.label} <span className="mono" style={{ fontWeight: 600 }}>{clock(m.time)}</span>
                  {m.note && <div style={{ fontSize: 12, color: 'var(--muted)' }}>{m.note}</div>}
                </div>
              ))}
            </Fact>
          )}
          {(cs.sunset || cs.weather) && (
            <Fact icon={<Sunset size={12} />} label="Light & Weather">
              {cs.sunset && (
                <div>
                  Sunset <span className="mono" style={{ fontWeight: 600 }}>{clock(cs.sunset)}</span>
                  {cs.twilightEnds && <> · Twilight ends <span className="mono" style={{ fontWeight: 600 }}>{clock(cs.twilightEnds)}</span></>}
                </div>
              )}
              {cs.lightNote && <div style={{ fontSize: 12, color: 'var(--muted)' }}>{cs.lightNote}</div>}
              {cs.weather && <div>{cs.weather}</div>}
            </Fact>
          )}
          {cs.locations.map(loc => (
            <Fact key={loc.name} icon={<MapPin size={12} />} label="Location">
              <div style={{ fontWeight: 600 }}>{loc.name}{loc.detail ? ` (${loc.detail})` : ''}</div>
              {loc.address && <div>{loc.address}</div>}
              {loc.parking.map(p => <div key={p} style={{ fontSize: 12, color: 'var(--muted)' }}>{p}</div>)}
            </Fact>
          ))}
          {cs.hospital && (
            <Fact icon={<Hospital size={12} />} label="Nearest Hospital">
              <div style={{ fontWeight: 600 }}>{cs.hospital.name}</div>
              {cs.hospital.address && <div>{cs.hospital.address}</div>}
              {cs.hospital.distance && <div style={{ fontSize: 12, color: 'var(--muted)' }}>{cs.hospital.distance}</div>}
            </Fact>
          )}
        </div>
        {cs.safety.map((s, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'flex-start', gap: 10, padding: 12, marginTop: i > 0 ? 8 : 0,
            background: 'rgba(230,184,0,0.12)', borderRadius: 8, border: '1px solid rgba(230,184,0,0.3)'
          }}>
            <ShieldAlert size={16} style={{ color: 'var(--bronze-text)', flexShrink: 0, marginTop: 1 }} />
            <span style={{ fontSize: 13, color: 'var(--ink)', lineHeight: 1.5 }}>
              <span style={{ fontWeight: 700, color: 'var(--bronze-text)' }}>
                {s.time ? `${clock(s.time)} · ` : ''}{s.title}.
              </span>{' '}
              {s.detail}
            </span>
          </div>
        ))}
      </div>

      {/* TOMORROW — the call sheet's advance schedule */}
      {cs.advance && (
        <div className="card" style={{ padding: 24 }}>
          <div className="section-label" style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <CalendarClock size={12} />
            TOMORROW
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)' }}>
            {cs.advance.callTime && <>Call <span className="mono">{clock(cs.advance.callTime)}</span> · </>}
            Scenes {cs.advance.scenes.join(', ')}
          </div>
          {cs.advance.locations.length > 0 && (
            <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>{cs.advance.locations.join(' · ')}</div>
          )}
          {cs.advance.note && (
            <div style={{ fontSize: 12, color: 'var(--muted-dim)', marginTop: 4 }}>{cs.advance.note}</div>
          )}
        </div>
      )}
    </div>
  );
}
