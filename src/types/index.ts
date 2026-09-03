export type Role = 
  | '1st AD' 
  | 'Director' 
  | 'DP' 
  | 'Gaffer' 
  | 'Script Supervisor' 
  | 'Wardrobe' 
  | 'Talent Assistant' 
  | 'Producer';

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
