import type { Production, CharacterLook, TimeLoss, RetakeCause } from '../types';

export const production: Production = {
  title: 'DSI',
  episode: '809',
  episodeTitle: 'Lone Wolf',
  shootDay: 9,
  season: 8,
  location: 'NYC — Multiple Units',
  callTime: '6:00 AM',
  firstShot: '7:30 AM',
  wrapTarget: '9:00 PM',
  currentTime: '2:15 PM',
  weather: 'Overcast, 68°F — possible rain after 6 PM',
  overallReadiness: 72,
  currentSetup: {
    id: '23B',
    scene: 23,
    setupNumber: '23B',
    description: 'Tactical entry — warehouse corridor, Ray and Elena advancing on suspect',
    location: 'Riverside Collision Center — Long Island City',
    targetRoll: '2:45 PM',
    currentState: 'hold',
    takes: [
      {
        number: 1,
        result: 'noGood',
        causes: ['Actor performance / line'],
        notes: 'Ray hesitated at door breach — timing off with tactical team',
        duration: 52,
        timestamp: '1:48 PM'
      },
      {
        number: 2,
        result: 'hold',
        causes: ['Lighting adjustment'],
        notes: 'Key light too hot on tactical vests — "DSI" patch blown out',
        duration: 48,
        timestamp: '1:56 PM'
      },
      {
        number: 3,
        result: 'noGood',
        causes: ['Camera / focus', 'Props / set reset'],
        notes: 'Steadicam missed rack focus to suspect. Prop gun needed reload reset.',
        duration: 61,
        timestamp: '2:05 PM'
      },
      {
        number: 4,
        result: 'incomplete',
        causes: ['Sound', 'Time / interruption'],
        notes: 'Helicopter overhead from LaGuardia flight path. PA walked through background.',
        duration: 35,
        timestamp: '2:11 PM'
      },
      {
        number: 5,
        result: 'noGood',
        causes: ['Actor performance / line', 'Lighting adjustment'],
        notes: 'Elena line flub on "Freeze — DSI!" Key light shifted when Ray hit mark 3.',
        duration: 47,
        timestamp: '2:18 PM'
      }
    ],
    // Newest first isn't hand-ordered here — ADCommand sorts this list by
    // `timestamp` itself, so the array order below doesn't matter; these
    // times are what actually drive the feed.
    departmentStatuses: [
      {
        department: 'Set/Props',
        status: 'inProgress',
        eta: '2 min',
        owner: 'Jenna Park, Set Decorator',
        blockerCount: 1,
        currentTask: 'Prop weapons reset — armorer verifying blanks',
        timestamp: '2:14 PM',
        history: [{ note: 'Reported ready, then flagged for armorer recheck after mag swap', timestamp: '2:08 PM' }]
      },
      {
        department: 'Lighting',
        status: 'inProgress',
        eta: '4 min',
        owner: 'Rico Torres, Gaffer',
        blockerCount: 1,
        currentTask: 'Adjust key light for tactical vest exposure at mark 3',
        timestamp: '2:12 PM',
        history: [{ note: 'Key light flagged too hot on tactical patch during Take 2', timestamp: '1:56 PM' }]
      },
      {
        department: 'Talent',
        status: 'inProgress',
        eta: '3 min',
        owner: 'Dana Lee, 2nd AD',
        blockerCount: 1,
        currentTask: 'Marcus line rehearsal — "Freeze — DSI!" reset',
        timestamp: '2:10 PM',
        history: [{ note: 'Line flub on Take 5, requested one more pass', timestamp: '2:03 PM' }]
      },
      {
        department: 'Wardrobe',
        status: 'ready',
        owner: 'Maya Johnson, Key Costumer',
        blockerCount: 0,
        currentTask: 'Tactical vests checked — DSI patches aligned, knee pads set',
        timestamp: '2:05 PM',
        history: [{ note: 'Vests pulled for inspection ahead of setup 23B', timestamp: '1:47 PM' }]
      },
      {
        department: 'Sound',
        status: 'ready',
        owner: 'Marcus Webb, Sound Mixer',
        blockerCount: 0,
        currentTask: 'Boom positioned, lavs on principals, helicopter window logged',
        timestamp: '2:01 PM'
      },
      {
        department: 'Camera',
        status: 'ready',
        owner: 'Sarah Chen, 1st AC',
        blockerCount: 0,
        currentTask: 'Steadicam balanced, lens checked, focus marks set',
        timestamp: '1:58 PM'
      },
      {
        department: 'Location',
        status: 'ready',
        owner: 'Alex Rivera, Location Manager',
        blockerCount: 0,
        currentTask: 'Permit active, Riverside Collision Center locked, neighbors notified',
        timestamp: '1:52 PM'
      }
    ]
  }
};

// The full cast, not one fixed character — Wardrobe needs to be able to
// pick whoever's actually in the next scene, and that changes shoot to
// shoot.
export const castLooks: CharacterLook[] = [
  {
    character: 'Special Agent Ray Castillo',
    scene: 23,
    lookNumber: 2,
    items: ['DSI tactical vest (yellow lettering)', 'Navy blue tactical shirt', 'Black cargo pants', 'Black tactical boots', 'Glock 19 holster', 'Radio earpiece'],
    continuityNotes: [
      'Vest has dust smudge on right shoulder from door breach in Scene 19',
      'Left knee pad shifted during previous take — needs repositioning',
      'Radio earpiece wire visible on left side — do not tuck in',
      'Boots have concrete dust from warehouse floor'
    ],
    fittingStatus: 'fitted',
    resetRequired: true
  },
  {
    character: 'Special Agent Elena Cross',
    scene: 23,
    lookNumber: 2,
    items: ['DSI tactical vest (yellow lettering)', 'Charcoal tactical shirt', 'Black cargo pants', 'Black tactical boots', 'Sidearm holster', 'Radio earpiece'],
    continuityNotes: [
      'Hair tie visible in Scene 22 — must match going into 23',
      'Vest strap tightened one notch after wardrobe check'
    ],
    fittingStatus: 'fitted',
    resetRequired: false
  },
  {
    character: 'Warren Locke',
    scene: 23,
    lookNumber: 1,
    items: ['Grey work jacket', 'Stained white t-shirt', 'Dark denim', 'Work boots'],
    continuityNotes: [
      'Jacket tear on left sleeve from Scene 19 stunt — practical, do not repair',
      'Boots need fresh mud application before each take'
    ],
    fittingStatus: 'issue',
    resetRequired: true
  },
  {
    character: 'Miles Ferro',
    scene: 23,
    lookNumber: 1,
    items: ['DSI windbreaker', 'Plain navy tee', 'Khaki pants', 'Duty boots'],
    continuityNotes: [
      'Windbreaker zipper stuck at 3/4 in most recent take'
    ],
    fittingStatus: 'pending',
    resetRequired: false
  }
];

export const agentLook: CharacterLook = castLooks[0];

export const timeLossData: TimeLoss[] = [
  { cause: 'Actor performance / line', minutes: 14, setupCount: 3 },
  { cause: 'Lighting adjustment', minutes: 11, setupCount: 3 },
  { cause: 'Props / set reset', minutes: 6, setupCount: 2 },
  { cause: 'Camera / focus', minutes: 4, setupCount: 1 },
  { cause: 'Sound', minutes: 3, setupCount: 1 },
  { cause: 'Time / interruption', minutes: 3, setupCount: 1 }
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
  crewCount: 87,
  castCount: 12,
  locations: 4,
  scenesScheduled: 22,
  departmentAssignments: 16,
  parkingZones: 6,
  pictureVehicles: 3,
  backgroundCount: 45
};

export const productionLocations = [
  { name: 'Riverside Collision Center', address: '42-18 Northern Blvd, Long Island City, Queens', type: 'Interior — Warehouse', scenes: [23, 24, 25] },
  { name: 'City Federal Building', address: '400 Liberty Plaza, Manhattan', type: 'Exterior — DSI Building', scenes: [12, 18] },
  { name: 'Central Park — Bethesda Terrace', address: 'Mid-Park at 72nd St, Manhattan', type: 'Exterior — Park', scenes: [8, 9] },
  { name: 'Broadway Stages — Stage TV-1', address: '311 West 34th St, Manhattan', type: 'Interior — DSI Bullpen', scenes: [1, 2, 3, 4, 5, 6, 7] }
];

export const castCallTimes = [
  { actor: 'Dana Whitfield (Elena Cross)', call: '6:00 AM', ready: '7:00 AM', holding: 'Trailer A' },
  { actor: 'Marcus Vance (Ray Castillo)', call: '6:00 AM', ready: '7:00 AM', holding: 'Trailer B' },
  { actor: 'Aaron Blake (Warren Locke)', call: '8:00 AM', ready: '9:00 AM', holding: 'Trailer C' },
  { actor: 'Tyler Reed (Miles Ferro)', call: '10:00 AM', ready: '11:00 AM', holding: 'Trailer D' }
];
