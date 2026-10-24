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

export interface Setup {
  id: string;
  scene: number;
  setupNumber: string;
  description: string;
  location: string;
  targetRoll: string;
  currentState: 'ready' | 'hold' | 'rolling' | 'cut';
  takes: Take[];
  departmentStatuses: DepartmentStatus[];
}

export interface CharacterLook {
  character: string;
  scene: number;
  lookNumber: number;
  items: string[];
  continuityNotes: string[];
  fittingStatus: 'fitted' | 'pending' | 'issue';
  resetRequired: boolean;
}

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
 *  complete look for one character, numbered across the season. This is
 *  the richer replacement CharacterLook was flagged as missing — structured
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

export interface Production {
  title: string;
  episode: string;
  episodeTitle?: string;
  season?: number;
  shootDay: number;
  location: string;
  callTime: string;
  firstShot: string;
  wrapTarget: string;
  currentTime: string;
  currentSetup: Setup;
  weather: string;
  overallReadiness: number;
}

export interface TimeLoss {
  cause: RetakeCause;
  minutes: number;
  setupCount: number;
}
