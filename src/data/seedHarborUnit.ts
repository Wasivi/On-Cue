import type { Production, CostumeChange, CostumeChangeUsage } from '../types';

// Fictional demo data matching docs/WARDROBE-SOP.md and the sample call
// sheet / production schedule in sample-data/ — Detective Vale's Change 4
// carries Episode 1's rain-tower damage into Episode 2 (the SOP's own
// carry-over example), and Ana Reyes's blood level escalates across the
// dock scenes. Loaded in place of src/data/seed.ts when Onboarding
// recognizes one of the Harbor Unit sample files, so what you upload is
// what the Wardrobe screen actually shows.

export const harborUnitProduction: Production = {
  title: 'Harbor Unit',
  episode: '102',
  episodeTitle: 'Undertow',
  shootDay: 6,
  season: 1,
  location: 'Pier 14, NYC Harbor District',
  callTime: '6:00 AM',
  firstShot: '7:30 AM',
  wrapTarget: '9:30 PM',
  currentTime: '8:10 PM',
  weather: 'Overcast, 54°F — 20% chance of rain',
  overallReadiness: 64,
  currentSetup: {
    id: '14A',
    scene: 14,
    setupNumber: '14A',
    description: 'Vale and Reyes confront the tip on the dock',
    location: 'Pier 14 — Dock (Exterior)',
    targetRoll: '8:30 PM',
    currentState: 'hold',
    takes: [],
    departmentStatuses: []
  }
};

// Episode -> scene-number lookup for the usage rollup below. A real
// costume_change_usage reads this from the scenes/productions join
// (supabase/migrations/0002_wardrobe_depth.sql); this is that same math
// done client-side until the app is wired to Supabase.
const SCENE_EPISODE: Record<string, number> = {
  '38': 1, '39': 1, '40': 1, '41': 1, '42': 1,
  '11': 2, '12': 2, '13': 2, '14': 2, '15': 2, '19': 2
};

export const harborUnitCostumeChanges: CostumeChange[] = [
  {
    id: 'cc-vale-4',
    productionId: 'harbor-unit',
    characterName: 'Det. Mara Vale',
    actorName: 'T. Marchetti',
    changeNumber: 4,
    storyDayId: 'Story Night 4',
    items: [
      { name: 'Olive trench coat', color: 'Olive', fabric: 'Wool blend', type: 'Outerwear' },
      { name: 'Cream button-down shirt', color: 'Cream', fabric: 'Cotton', type: 'Top' },
      { name: 'Dark denim', color: 'Indigo', fabric: 'Denim', type: 'Bottom' },
      { name: 'Brown leather belt', color: 'Brown', fabric: 'Leather', type: 'Accessory' },
      { name: 'Black boots', color: 'Black', fabric: 'Leather', type: 'Footwear' }
    ],
    multiplesCount: 3,
    multipleStates: [
      { label: 'Dry', state: 'clean, pressed' },
      { label: 'Damp', state: 'in use' },
      { label: 'Soaked', state: 'standby, drying' }
    ],
    currentMultipleInUse: 'Damp',
    hazards: ['Rain tower (Ep1 Sc.41-42)', 'Mud fall (Ep2 Sc.14)'],
    storyReasoning: "Vale's been in the field since Episode 1 — the coat has to read as never having come off. Carrying the damage across episodes is what tells the audience no time has passed.",
    fittingStatus: 'fitted',
    continuityNotes: [
      'Left cuff frayed from Ep1 Sc.42 dock railing — keep frayed, do not repair',
      'Mud line on hem sits 2in from the bottom, matching the Ep1 final-state photo'
    ],
    sceneIds: ['38', '39', '40', '41', '42', '11', '12', '13', '14', '15']
  },
  {
    id: 'cc-reyes-2',
    productionId: 'harbor-unit',
    characterName: 'Ana Reyes',
    actorName: 'K. Oduya',
    changeNumber: 2,
    storyDayId: 'Story Night 4',
    items: [
      { name: 'Charcoal field jacket', color: 'Charcoal', fabric: 'Cotton twill', type: 'Outerwear' },
      { name: 'Grey thermal', color: 'Grey', fabric: 'Cotton', type: 'Top' },
      { name: 'Black tactical pants', color: 'Black', fabric: 'Ripstop', type: 'Bottom' }
    ],
    multiplesCount: 4,
    multipleStates: [
      { label: 'Clean', state: 'standby' },
      { label: 'Blood — light', state: 'in use' },
      { label: 'Blood — heavy', state: 'standby' },
      { label: 'Torn sleeve', state: 'standby' }
    ],
    currentMultipleInUse: 'Blood — light',
    hazards: ['Blood rig (Ep2 Sc.14–15, progressive)'],
    storyReasoning: "Reyes gets hurt on the dock in Scene 14 — the blood has to escalate take to take, scene to scene, or the injury reads as fake.",
    fittingStatus: 'issue',
    continuityNotes: ['Blood level must match the continuity photo from the last printed take before advancing it'],
    sceneIds: ['12', '14', '15']
  },
  {
    id: 'cc-kade-1',
    productionId: 'harbor-unit',
    characterName: 'Sgt. Theo Kade',
    actorName: 'D. Brennan',
    changeNumber: 1,
    storyDayId: 'Story Night 4',
    items: [
      { name: 'Navy harbor-unit jacket', color: 'Navy', fabric: 'Nylon shell', type: 'Outerwear' },
      { name: 'Grey henley', color: 'Grey', fabric: 'Cotton', type: 'Top' },
      { name: 'Black cargo pants', color: 'Black', fabric: 'Ripstop', type: 'Bottom' }
    ],
    multiplesCount: 1,
    multipleStates: [{ label: 'Dry', state: 'clean, pressed' }],
    currentMultipleInUse: 'Dry',
    hazards: [],
    storyReasoning: 'Kade is Vale\'s backup on the dock — plain, department-issue, no distinguishing detail. He is support, not story focus, and the costume should read that way.',
    fittingStatus: 'fitted',
    continuityNotes: ['Jacket zipped to the second toggle in every take this scene'],
    sceneIds: ['14', '15']
  },
  {
    id: 'cc-silva-1',
    productionId: 'harbor-unit',
    characterName: 'Warden Silva',
    actorName: 'R. Bianchi',
    changeNumber: 1,
    storyDayId: 'Story Night 4',
    items: [
      { name: 'Weathered canvas coat', color: 'Faded green', fabric: 'Waxed canvas', type: 'Outerwear' },
      { name: 'Flannel shirt', color: 'Rust plaid', fabric: 'Flannel', type: 'Top' },
      { name: 'Work boots', color: 'Brown', fabric: 'Leather', type: 'Footwear' }
    ],
    multiplesCount: 1,
    multipleStates: [{ label: 'Worn', state: 'standby' }],
    currentMultipleInUse: 'Worn',
    hazards: [],
    storyReasoning: 'Silva only appears once, at the end of the dock scene — the coat has to establish "dock worker, doesn\'t belong in this conversation" in a single shot, with no earlier scene to build on.',
    fittingStatus: 'fitted',
    continuityNotes: ['One-scene character — no reset needed, no multiples beyond this single worn coat'],
    sceneIds: ['15']
  },
  {
    id: 'cc-dray-1',
    productionId: 'harbor-unit',
    characterName: 'Capt. Elena Dray',
    actorName: 'M. Alvarez',
    changeNumber: 1,
    storyDayId: 'Story Night 4',
    items: [
      { name: 'Service-blue uniform shirt', color: 'Navy', fabric: 'Twill', type: 'Top' },
      { name: 'Captain\'s bars', color: 'Silver', fabric: 'Metal', type: 'Accessory' },
      { name: 'Black uniform slacks', color: 'Black', fabric: 'Wool blend', type: 'Bottom' }
    ],
    multiplesCount: 1,
    multipleStates: [{ label: 'Pressed', state: 'clean, pressed' }],
    currentMultipleInUse: 'Pressed',
    hazards: [],
    storyReasoning: 'Dray is the institutional pressure bearing down on Vale — the uniform has to read sharper and more buttoned-up than anything Vale wears in the field, so the power difference is visible before either of them says a word.',
    fittingStatus: 'fitted',
    continuityNotes: ['Bars sit level, two fingers below the collar seam in every take'],
    sceneIds: ['11']
  },
  {
    id: 'cc-price-1',
    productionId: 'harbor-unit',
    characterName: 'Oswin Price',
    actorName: 'J. Halvorsen',
    changeNumber: 1,
    storyDayId: 'Story Day 5',
    items: [
      { name: 'Rumpled grey suit jacket', color: 'Grey', fabric: 'Wool', type: 'Outerwear' },
      { name: 'Open-collar dress shirt', color: 'White', fabric: 'Cotton', type: 'Top' },
      { name: 'Dress trousers', color: 'Charcoal', fabric: 'Wool', type: 'Bottom' }
    ],
    multiplesCount: 1,
    multipleStates: [{ label: 'Rumpled', state: 'standby' }],
    currentMultipleInUse: 'Rumpled',
    hazards: [],
    storyReasoning: "Price needs to look like money that's stopped being careful — expensive clothes gone slightly to seed is the visual shorthand for a man under pressure, no tie, collar open, one step from unraveling.",
    fittingStatus: 'pending',
    continuityNotes: ['Fitting not yet confirmed — flag to 1st AD before Scene 19 is scheduled'],
    sceneIds: ['19']
  }
];

export const harborUnitUsage: CostumeChangeUsage[] = harborUnitCostumeChanges.map(cc => {
  const episodes = new Set(cc.sceneIds.map(id => SCENE_EPISODE[id]).filter(Boolean));
  return {
    costumeChangeId: cc.id,
    characterName: cc.characterName,
    changeNumber: cc.changeNumber,
    sceneCount: cc.sceneIds.length,
    episodeCount: episodes.size
  };
});
