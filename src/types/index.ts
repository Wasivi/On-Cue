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

export type AgentEventKind = 'ready' | 'hold' | 'roll' | 'take' | 'info';

export interface AgentEvent {
  id: string;
  time: string;
  role: Role;
  action: string;
  detail: string;
  kind: AgentEventKind;
}
