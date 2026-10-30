import type {
  CallSheet, CastMember, CostumeChangeUsage, DepartmentNotes, ProductionPrep,
  Role, ScheduleItem, ScheduledScene
} from '../types';

// Everything a screen needs to say about the loaded show, worked out from
// the call sheet rather than written into the screen, so the same screen
// works for whichever show's call sheet was uploaded.

/** '18:15' → '6:15 PM'. Anything not in 24-hour form passes through as printed. */
export function clock(t: string | undefined): string {
  if (!t) return '';
  const m = t.match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return t;
  const h = parseInt(m[1], 10) % 24;
  return `${h % 12 === 0 ? 12 : h % 12}:${m[2]} ${h >= 12 ? 'PM' : 'AM'}`;
}

/** '2:14 PM' → minutes since midnight, so lists can sort on the actual time. */
export function minutesOf(t: string): number {
  const m = t.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!m) return 0;
  let h = parseInt(m[1], 10);
  const min = parseInt(m[2], 10);
  const ap = m[3].toUpperCase();
  if (ap === 'PM' && h !== 12) h += 12;
  if (ap === 'AM' && h === 12) h = 0;
  return h * 60 + min;
}

/** 'Harbor Unit · Episode 2 "Undertow" · Shoot Day 6 of 15' */
export function showLine(cs: CallSheet): string {
  const episode = [
    cs.show.episodeNumber && `Episode ${cs.show.episodeNumber}`,
    cs.show.episodeTitle && `"${cs.show.episodeTitle}"`
  ].filter(Boolean).join(' ');
  const day = `Shoot Day ${cs.shootDay}${cs.totalShootDays ? ` of ${cs.totalShootDays}` : ''}`;
  return [cs.show.title, episode, day].filter(Boolean).join(' · ');
}

/** The shoot date: 'Oct 23, 2026', or 'Friday, October 23, 2026' in long form. */
export function shootDate(cs: CallSheet, form: 'short' | 'long' = 'short'): string {
  const d = new Date(`${cs.date}T12:00:00`);
  if (isNaN(d.getTime())) return cs.date;
  return d.toLocaleDateString('en-US', form === 'long'
    ? { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }
    : { month: 'short', day: 'numeric', year: 'numeric' });
}

export function scenesInOrder(cs: CallSheet): ScheduledScene[] {
  return cs.schedule.filter((item): item is ScheduledScene => item.kind === 'scene');
}

export function findScene(cs: CallSheet, scene: string): ScheduledScene | undefined {
  return scenesInOrder(cs).find(s => s.scene === scene);
}

/** Whatever comes after this scene in the shooting order: the next scene,
 *  or a timed event (a safety brief) if one sits in between. */
export function nextItem(cs: CallSheet, scene: string): ScheduleItem | undefined {
  const i = cs.schedule.findIndex(item => item.kind === 'scene' && item.scene === scene);
  return i >= 0 ? cs.schedule[i + 1] : undefined;
}

/** What a scene row calls a character: 'Det. Mara Vale' → 'Vale'. */
export function shortName(character: string): string {
  const words = character.trim().split(/\s+/);
  return words[words.length - 1];
}

export function castInScene(cs: CallSheet, scene: ScheduledScene): CastMember[] {
  return scene.castIds
    .map(id => cs.cast.find(c => c.id === id))
    .filter((c): c is CastMember => c !== undefined);
}

/** 'Vale, Reyes, Kade' */
export function castNames(cs: CallSheet, scene: ScheduledScene): string {
  return castInScene(cs, scene).map(c => shortName(c.character)).join(', ');
}

/** The crew member whose role matches: crewName(cs, /gaffer/i) → 'Oren Blatt'. */
export function crewName(cs: CallSheet, role: RegExp): string | undefined {
  return cs.crew.find(c => role.test(c.role))?.name;
}

// Which department notes each role gets in full: broadcast status, scope
// detail (docs/GOVERNANCE-MODEL.md). Matched on the department's own
// heading, because every show's call sheet names its departments a little
// differently ("Camera & Lighting", "Grip & Electric", "Costume").
const NOTES_FOR_ROLE: Record<Role, RegExp | 'all'> = {
  '1st AD': 'all',
  'Director': 'all',
  'Producer': 'all',
  'UPM': 'all',
  'DP': /camera|photograph|light|electric|grip/i,
  'Gaffer': /light|electric|grip|g&e/i,
  'Script Supervisor': /continuity|script|wardrobe|costume|prop/i,
  'Wardrobe': /wardrobe|costume/i,
  'Talent Assistant': /talent|cast|wardrobe|costume|hair|make-?up/i,
  'Props': /prop/i,
  'Art Department': /\bart\b|set dress|construction/i,
};

export function notesForRole(cs: CallSheet, role: Role): DepartmentNotes[] {
  const match = NOTES_FOR_ROLE[role];
  return match === 'all' ? cs.departmentNotes : cs.departmentNotes.filter(d => match.test(d.department));
}

/** The call sheet's notes about one character ("Det. Vale: ..." filed under Vale). */
export function notesAbout(cs: CallSheet, character: string, department: RegExp): string[] {
  const name = shortName(character);
  return cs.departmentNotes
    .filter(d => department.test(d.department))
    .flatMap(d => d.notes)
    .filter(n => n.subject?.includes(name))
    .map(n => n.text);
}

/** costume_change_usage, worked out here until the app reads it from Supabase. */
export function costumeUsage(prep: ProductionPrep): CostumeChangeUsage[] {
  return prep.costumePlot.map(cc => {
    const episodes = new Set(cc.sceneIds.map(id => prep.sceneEpisodes[id]).filter(Boolean));
    return {
      costumeChangeId: cc.id,
      characterName: cc.characterName,
      changeNumber: cc.changeNumber,
      sceneCount: cc.sceneIds.length,
      episodeCount: episodes.size
    };
  });
}
