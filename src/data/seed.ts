import type { Production, CharacterLook, TimeLoss, RetakeCause } from '../types';

export const production: Production = {
  title: 'Harbor Unit',
  episode: '104',
  shootDay: 12,
  location: 'Brooklyn Loft',
  callTime: '5:30 AM',
  firstShot: '7:15 AM',
  wrapTarget: '8:30 PM',
  currentTime: '10:35 AM',
  weather: 'Light rain risk after 3:00 PM',
  overallReadiness: 78,
  currentSetup: {
    id: '14B',
    scene: 42,
    setupNumber: '14B',
    description: 'Medium two-shot at kitchen island',
    location: 'Loft Kitchen',
    targetRoll: '10:42 AM',
    currentState: 'hold',
    takes: [
      {
        number: 1,
        result: 'noGood',
        causes: ['Actor performance / line'],
        notes: 'Actor missed cue',
        duration: 42,
        timestamp: '10:08 AM'
      },
      {
        number: 2,
        result: 'hold',
        causes: ['Lighting adjustment'],
        notes: 'Key light too hot on face',
        duration: 38,
        timestamp: '10:14 AM'
      },
      {
        number: 3,
        result: 'noGood',
        causes: ['Camera / focus', 'Actor performance / line'],
        notes: 'Rack focus missed, line flub',
        duration: 45,
        timestamp: '10:21 AM'
      },
      {
        number: 4,
        result: 'incomplete',
        causes: ['Sound', 'Time / interruption'],
        notes: 'Elevated train noise, then PA walked through frame',
        duration: 28,
        timestamp: '10:27 AM'
      },
      {
        number: 5,
        result: 'noGood',
        causes: ['Actor performance / line', 'Lighting adjustment'],
        notes: 'Actor missed final line. Key light shifted during movement.',
        duration: 38,
        timestamp: '10:32 AM'
      },
      {
        number: 6,
        result: 'hold',
        causes: ['Director wants another option'],
        notes: 'Director wants softer emotional read',
        duration: 52,
        timestamp: '10:38 AM'
      }
    ],
    departmentStatuses: [
      {
        department: 'Camera',
        status: 'ready',
        owner: 'Sarah Chen, 1st AC',
        blockerCount: 0,
        currentTask: 'Camera package confirmed, lens checked'
      },
      {
        department: 'Sound',
        status: 'ready',
        owner: 'Marcus Webb, Sound Mixer',
        blockerCount: 0,
        currentTask: 'Boom positioned, lavs checked'
      },
      {
        department: 'Set/Props',
        status: 'ready',
        owner: 'Jenna Park, Set Decorator',
        blockerCount: 0,
        currentTask: 'Kitchen dressed, props on marks'
      },
      {
        department: 'Lighting',
        status: 'inProgress',
        eta: '3 min',
        owner: 'Rico Torres, Gaffer',
        blockerCount: 1,
        currentTask: 'Adjust key light for actor mark 2'
      },
      {
        department: 'Talent',
        status: 'inProgress',
        eta: '4 min',
        owner: 'Dana Lee, 2nd AD',
        blockerCount: 1,
        currentTask: 'Actor reset — line rehearsal'
      },
      {
        department: 'Wardrobe',
        status: 'ready',
        owner: 'Maya Johnson, Key Costumer',
        blockerCount: 0,
        currentTask: 'Look 3 continuity confirmed'
      },
      {
        department: 'Location',
        status: 'ready',
        owner: 'Alex Rivera, Location Manager',
        blockerCount: 0,
        currentTask: 'Permit active, neighbors notified'
      }
    ]
  }
};

export const detectiveValeLook: CharacterLook = {
  character: 'Detective Vale',
  scene: 42,
  lookNumber: 3,
  items: ['Olive trench coat', 'Cream shirt', 'Dark denim jeans', 'Brown leather belt', 'Black boots'],
  continuityNotes: [
    'Coat damp on left shoulder (from rain tower in previous scene)',
    'Left cuff rolled once',
    'Belt buckle slightly askew (character choice)',
    'Boots scuffed on right toe'
  ],
  fittingStatus: 'fitted',
  resetRequired: true
};

export const timeLossData: TimeLoss[] = [
  { cause: 'Actor performance / line', minutes: 11, setupCount: 3 },
  { cause: 'Lighting adjustment', minutes: 9, setupCount: 3 },
  { cause: 'Camera / focus', minutes: 3, setupCount: 1 },
  { cause: 'Sound', minutes: 2, setupCount: 1 },
  { cause: 'Time / interruption', minutes: 2, setupCount: 1 },
  { cause: 'Director wants another option', minutes: 5, setupCount: 1 }
];

export const retakeCauses: RetakeCause[] = [
  'Actor performance / line',
  'Lighting adjustment',
  'Camera / focus',
  'Sound',
  'Continuity',
  'Props / set reset',
  'Director wants another option',
  'Technical issue',
  'Time / interruption',
  'Other'
];

export const roleDescriptions: Record<string, string> = {
  '1st AD': 'Full readiness board, timing, blockers, next setup',
  'Director': 'Current setup, take count, creative/actor status',
  'DP': 'Shot/setup, camera readiness, lighting state, visual issue',
  'Gaffer': 'Lighting tasks, power alerts, equipment/cable needs',
  'Script Supervisor': 'Slate, take number, continuity, notes, take quality',
  'Wardrobe': 'Actors needed next, look, continuity photos, reset notes',
  'Talent Assistant': 'Call, scene, wardrobe/makeup readiness, private note',
  'Producer': 'High-level schedule risk, delay cause, cost/time impact'
};

export const callSheetData = {
  crewCount: 46,
  castCount: 8,
  locations: 3,
  scenesScheduled: 18,
  departmentAssignments: 12,
  parkingZones: 4
};
