export type Role =
  | '1st AD'
  | 'Director'
  | 'DP'
  | 'Gaffer'
  | 'Script Supervisor'
  | 'Wardrobe'
  | 'Talent Assistant'
  | 'Producer'
  | 'Props'
  | 'Art Department'
  | 'UPM';

export type Department =
  | 'Camera'
  | 'Sound'
  | 'Set/Props'
  | 'Lighting'
  | 'Talent'
  | 'Wardrobe'
  | 'Location';

export type TakeResult = 'print' | 'hold' | 'noGood' | 'incomplete';

export type RetakeCause =
  | 'Actor performance / line'
  | 'Lighting adjustment'
  | 'Camera / focus'
  | 'Sound'
  | 'Continuity'
  | 'Props / set reset'
  | 'Director wants another option'
  | 'Technical issue'
  | 'Time / interruption'
  | 'Other';

// ============================================================================
// The call sheet. Every show's call sheet says the same kinds of things —
// who, where, when, in what order — so this one shape fits any of them.
// Whatever the import reads from an uploaded call sheet lands here, and
// every screen takes its show-specific facts (title, logo, times, scenes,
// cast, notes) from it. Nothing about a particular show lives in a page.
// Times stay exactly as printed ('06:00'); screens format them for display.
// ============================================================================

export interface CallSheet {
  show: {
    title: string;
    episodeNumber?: string;
    episodeTitle?: string;
    season?: number;
    productionCompany?: string;
    /** The show's logo, as printed at the top of its call sheet. */
    logoUrl?: string;
  };
  /** The shoot date, ISO format ('2026-10-23'). */
  date: string;
  shootDay: number;
  totalShootDays?: number;
  status?: string;
  /** General, crew, and shooting call, in the order the sheet lists them. */
  calls: CallTime[];
  meals: CallTime[];
  weather?: string;
  sunset?: string;
  twilightEnds?: string;
  /** Any condition the sheet attaches to the light, e.g. when night work may start. */
  lightNote?: string;
  hospital?: { name: string; address?: string; distance?: string };
  /** Safety notes everyone gets, whatever their department. */
  safety: SafetyNote[];
  locations: CallSheetLocation[];
  /** The shooting order: scenes, plus timed events (a safety brief, a company move) between them. */
  schedule: ScheduleItem[];
  cast: CastMember[];
  crew: CrewMember[];
  departmentNotes: DepartmentNotes[];
  advance?: AdvanceSchedule;
}

export interface CallTime {
  label: string;
  time: string;
  note?: string;
}

export interface SafetyNote {
  time?: string;
  title: string;
  detail: string;
}

export interface CallSheetLocation {
  name: string;
  detail?: string;
  address?: string;
  parking: string[];
}

export interface ScheduledScene {
  kind: 'scene';
  scene: string;
  /** As printed — 'INT', 'EXT', 'INT/EXT'. */
  intExt: string;
  set: string;
  /** As printed — 'DAY', 'NIGHT', 'DUSK'... */
  dayNight: string;
  /** Cast list numbers (CastMember.id) of everyone in the scene. */
  castIds: number[];
  pages: string;
  notes?: string;
}

export interface ScheduledEvent {
  kind: 'event';
  time: string;
  title: string;
  who: string;
  dayNight?: string;
  notes?: string;
}

export type ScheduleItem = ScheduledScene | ScheduledEvent;

export interface CastMember {
  /** The cast list number the scene rows refer to. */
  id: number;
  actor: string;
  character: string;
  status: string;
  pickup?: string;
  hmu?: string;
  onSet?: string;
}

export interface CrewMember {
  role: string;
  name: string;
}

/** One department's block of notes, as the call sheet groups them. A note
 *  can name who it's about ("Det. Vale: ...") — `subject` keeps that apart
 *  from the note itself so a screen can file it under the right person. */
export interface DepartmentNotes {
  department: string;
  owners: string[];
  notes: { subject?: string; text: string }[];
}

export interface AdvanceSchedule {
  callTime?: string;
  note?: string;
  locations: string[];
  scenes: string[];
}

// ============================================================================
// The day's record — what On-Cue itself has captured since crew call: the
// current setup, its takes, each department's live status, what each role
// is working on. None of this is on a call sheet; it accumulates as people
// work (in Supabase, once connected). A show with nothing recorded yet has
// no DayRecord, and screens say so instead of borrowing another show's.
// ============================================================================

export interface DepartmentStatus {
  department: Department;
  status: 'ready' | 'inProgress' | 'notReady';
  eta?: string;
  owner: string;
  blockerCount: number;
  currentTask: string;
  /** When this status was last reported — every entry is timestamped so
   *  the feed can always sort newest-first instead of showing one fixed
   *  snapshot order. */
  timestamp: string;
  /** Earlier reports for this department, most recent first — what "···
   *  More" reveals. Most people only care what's true right now; this is
   *  for the rare moment someone actually wants the history. */
  history?: { note: string; timestamp: string }[];
}

export interface Take {
  number: number;
  result: TakeResult;
  causes: RetakeCause[];
  notes: string;
  duration: number; // seconds
  timestamp: string;
}

/** Where the setup is shot comes from its scene on the call sheet, so a
 *  setup only carries what the call sheet can't know. */
export interface Setup {
  id: string;
  scene: string;
  setupNumber: string;
  description: string;
  targetRoll: string;
  currentState: 'ready' | 'hold' | 'rolling' | 'cut';
  takes: Take[];
  departmentStatuses: DepartmentStatus[];
}

/** What one role should be doing right now — My Set's "Your Action". */
export interface RoleAction {
  action: string;
  detail: string;
  target: string;
}

export interface ChangeNote {
  kind: 'stop' | 'alert';
  text: string;
  time: string;
}

export interface SetupSummary {
  setup: string;
  takes: number;
  usable: number;
  issue: string;
  current?: boolean;
}

export interface LightingState {
  patternAlert?: string;
  etaTrackRecord: { setup: string; result: 'onTime' | 'late' }[];
  equipment: { name: string; status: string; tone: 'ok' | 'watch' }[];
  checklist: string[];
}

export interface DayRecord {
  currentTime: string;
  wrapTarget?: string;
  currentSetup: Setup;
  board: { predictedRoll: string; currentHold: string; nextSceneRisk?: string; backgroundHold?: string };
  roleActions: Partial<Record<Role, RoleAction>>;
  whatChanged: ChangeNote[];
  timeLoss: TimeLoss[];
  setupHistory: SetupSummary[];
  /** A recovery suggestion drafted by an agent — a person decides whether to act on it. */
  insight?: string;
  lighting?: LightingState;
}

export interface TimeLoss {
  cause: RetakeCause;
  minutes: number;
  setupCount: number;
}

// ============================================================================
// Prep — what departments enter once, before the shoot day (BUILD_SPEC.md
// decision 5): Wardrobe's costume plot, the talent department's headshots,
// the UPM's budget. Not on the call sheet either; it belongs to the show.
// ============================================================================

/** A day inside the story the audience is watching — not a shoot day, not
 *  an episode (docs/WARDROBE-SOP.md §1). Same story day means same clothes,
 *  damage and all, even across episodes. */
export interface StoryDayInfo {
  id: string;
  productionId: string;
  label: string; // e.g. 'Story Night 4'
  continuesFromStoryDayId?: string;
  note?: string;
}

export interface CostumeItem {
  name: string;
  color: string;
  fabric?: string;
  type?: string;
}

export interface MultipleState {
  label: string; // e.g. 'dry', 'damp', 'soaked'
  state: string; // e.g. 'clean', 'in use', 'needs cleaning'
}

/** The real unit of the costume plot (docs/WARDROBE-SOP.md §2): one
 *  complete look for one character, numbered across the season. Structured
 *  color/fabric per item (Lighting reads color via scene_color_palette),
 *  a story_reasoning field for *why* the look exists, and sceneIds so
 *  "how many scenes/episodes is this used in" is a lookup, not a hand
 *  count (see costume_change_usage). */
export interface CostumeChange {
  id: string;
  productionId: string;
  characterName: string;
  actorName: string; // who's actually in front of the camera — the call sheet's CAST table pairs these two
  changeNumber: number; // numbered across the season, not per episode
  storyDayId?: string;
  items: CostumeItem[];
  multiplesCount: number;
  multipleStates: MultipleState[];
  currentMultipleInUse?: string;
  hazards: string[];
  storyReasoning?: string;
  fittingStatus: 'fitted' | 'pending' | 'issue';
  continuityNotes: string[];
  carryOverFromChangeId?: string;
  sceneIds: string[];
}

/** Matches costume_change_usage — the director's "how many scenes/episodes
 *  is this costume in" question, pre-computed instead of hand-counted. */
export interface CostumeChangeUsage {
  costumeChangeId: string;
  characterName: string;
  changeNumber: number;
  sceneCount: number;
  episodeCount: number;
}

/** Matches scene_color_palette — the narrow, color-only slice other
 *  departments (Lighting, DP) read instead of the full CostumeChange. */
export interface SceneColorEntry {
  sceneId: string;
  sceneNumber: string;
  characterName: string;
  itemName: string;
  color: string;
}

export interface ProductionPrep {
  costumePlot: CostumeChange[];
  /** Which episode each scene number belongs to, for the costume usage rollup. */
  sceneEpisodes: Record<string, number>;
  /** Cast list number → headshot. From the talent department, not the call sheet. */
  headshots: Record<number, string>;
  budget?: {
    /** A rough blended "hot cost" for a minute lost — not a real rate. */
    costPerMinuteLost: number;
    departments: { department: string; allocated: number; spent: number }[];
  };
}

/** Everything the app knows about the show whose call sheet is loaded. */
export interface ProductionData {
  id: string;
  callSheet: CallSheet;
  day?: DayRecord;
  prep?: ProductionPrep;
}
