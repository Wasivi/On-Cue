import type { CallSheet, ProductionData } from '../../types';
import callSheetData from './harbor-unit-ep2-call-sheet.json';
import logoUrl from './harbor-unit-logo.svg';
import valeHeadshot from '../../../sample-data/headshots/det-mara-vale.jpg';
import reyesHeadshot from '../../../sample-data/headshots/ana-reyes.jpg';
import kadeHeadshot from '../../../sample-data/headshots/sgt-theo-kade.jpg';
import drayHeadshot from '../../../sample-data/headshots/capt-elena-dray.jpg';
import priceHeadshot from '../../../sample-data/headshots/oswin-price.jpg';
import silvaHeadshot from '../../../sample-data/headshots/warden-silva.jpg';

// Harbor Unit, Episode 2 "Undertow", Shoot Day 6 — a fictional production,
// and the one sample call sheet this prototype can read. Three parts, kept
// apart because they come from three different places on a real show:
//   - callSheet: what reading sample-data/harbor-unit-ep2-call-sheet.pdf
//     produces (the JSON beside this file, word for word from the sheet)
//   - day: what On-Cue has recorded since crew call — it's 8:10 PM, Setup
//     14A on the dock is on HOLD
//   - prep: Wardrobe's costume plot (docs/WARDROBE-SOP.md), the cast
//     headshots, and the UPM's budget, all entered before the shoot day

// The JSON can only name its logo file; the bundled URL is filled in here.
const callSheet: CallSheet = {
  ...(callSheetData as CallSheet),
  show: { ...callSheetData.show, logoUrl },
};

export const harborUnitSample: ProductionData = {
  id: 'harbor-unit-ep2-day6',
  callSheet,

  day: {
    currentTime: '8:10 PM',
    // The latest wrap that still gives the advance schedule's 1:00 PM call
    // its 10-hour turnaround.
    wrapTarget: '3:00 AM',
    currentSetup: {
      id: '14A',
      scene: '14',
      setupNumber: '14A',
      description: 'Dolly master — Vale and Reyes confront the tip on the dock while Kade covers from the gangway',
      targetRoll: '8:30 PM',
      currentState: 'hold',
      takes: [
        {
          number: 1,
          result: 'noGood',
          causes: ['Lighting adjustment'],
          notes: 'Condor backlight flared into the lens at the end of the dolly move',
          duration: 58,
          timestamp: '7:52 PM'
        },
        {
          number: 2,
          result: 'noGood',
          causes: ['Sound'],
          notes: 'Picture boat idling under the dialogue — marine coordinator cutting the engine for the next take',
          duration: 44,
          timestamp: '7:59 PM'
        },
        {
          number: 3,
          result: 'hold',
          causes: ['Continuity'],
          notes: "Reyes's blood read heavier than the approved lookbook photo — wardrobe resetting to the light multiple",
          duration: 41,
          timestamp: '8:06 PM'
        }
      ],
      // AD Command sorts these itself (blockers first, then newest), so
      // the order written here doesn't matter.
      departmentStatuses: [
        {
          department: 'Wardrobe',
          status: 'inProgress',
          eta: '3 min',
          owner: 'Celeste Ibarra, Wardrobe Supervisor',
          blockerCount: 1,
          currentTask: "Resetting Reyes to the light blood multiple to match the approved lookbook photo",
          timestamp: '8:07 PM',
          history: [{ note: "Vale's Change 4 dressed damp and muddy per the costume bible, matched to the Ep 1 Scene 42 photos", timestamp: '6:40 PM' }]
        },
        {
          department: 'Lighting',
          status: 'inProgress',
          eta: '4 min',
          owner: 'Oren Blatt, Gaffer',
          blockerCount: 1,
          currentTask: 'Flagging the condor backlight off the lens for the end of the dolly move',
          timestamp: '8:04 PM',
          history: [{ note: 'HMIs and condors set at the dock during second meal for Scene 14', timestamp: '7:25 PM' }]
        },
        {
          department: 'Set/Props',
          status: 'inProgress',
          eta: '6 min',
          owner: 'Marcus Dietrich, Property Master',
          blockerCount: 1,
          currentTask: 'Holding the picture boat on its mark with the engine off — Marine Safety Warden on the radio',
          timestamp: '8:02 PM',
          history: [{ note: 'Picture boat fueled and positioned at the pier end', timestamp: '7:22 PM' }]
        },
        {
          department: 'Talent',
          status: 'ready',
          owner: 'Petra Lindqvist, 2nd AD',
          blockerCount: 0,
          currentTask: 'Vale, Reyes, and Kade on set. Silva in holding for Scene 15, getting a separate safety brief (arrived after 6:15 PM)',
          timestamp: '7:58 PM'
        },
        {
          department: 'Sound',
          status: 'ready',
          owner: 'Devon Ashcroft, Sound Mixer',
          blockerCount: 0,
          currentTask: 'Boom and lavs set, wind protection on; engine-off window agreed with the marine coordinator',
          timestamp: '8:03 PM'
        },
        {
          department: 'Camera',
          status: 'ready',
          owner: 'Renata Soto, DP',
          blockerCount: 0,
          currentTask: "A camera on the dolly master, B camera tight on Reyes; stunt double's marks set at the dock edge",
          timestamp: '7:55 PM'
        },
        {
          department: 'Location',
          status: 'ready',
          owner: 'Ruth Calloway, Marine Safety Warden',
          blockerCount: 0,
          currentTask: 'Safety brief held at 6:15 PM; life vests on everyone within 15 feet of the water',
          timestamp: '6:31 PM'
        }
      ]
    },
    board: { predictedRoll: '8:30 PM', currentHold: '9 min', nextSceneRisk: '+15 min late' },
    roleActions: {
      '1st AD': {
        action: 'Coordinate the reset: lighting, wardrobe, and the picture boat',
        detail: 'Three blockers on 14A. Lighting ETA 4 min, Wardrobe ETA 3 min, Props ETA 6 min. Predicted roll 8:30 PM. Scene 15 is at risk: the boat has to be staged for its run before Silva can work.',
        target: '8:30 PM'
      },
      'Gaffer': {
        action: 'Flag the condor backlight off the lens',
        detail: 'Take 1 flared at the end of the dolly move: the condor HMI backlight catches the lens as camera lands on Reyes. Add a solid on the condor basket or boom down two feet, then check through A camera.',
        target: '8:14 PM'
      },
      'Wardrobe': {
        action: "Reset Reyes's blood to the approved lookbook photo — Scene 14, Change 2",
        detail: "Take 3 read heavier than the lookbook photo. Back to the 'Blood — light' multiple and check it against the photo before the next take. Vale stays in Change 4, damp and muddy per the costume bible.",
        target: '8:13 PM'
      },
      'Script Supervisor': {
        action: 'Log Take 3 and slate Take 4',
        detail: "Slate 14A, Take 3: HOLD for Reyes's blood continuity. Take 2: no good on boat noise under the dialogue. Note the blood reset in the continuity log.",
        target: 'Slate 14A Take 4'
      },
      'Director': {
        action: 'Review Take 3 — the confrontation on the dock',
        detail: "Take 3 played well until the continuity stop. If the blood reset holds, you can pick up from Reyes's line instead of going from the top.",
        target: 'Decision by 8:15 PM'
      },
      'Producer': {
        action: 'Schedule risk: Scene 15 may start 15 minutes late',
        detail: "Current hold: 9 minutes. Lighting, wardrobe, and boat resets in progress. Tomorrow's 1:00 PM call needs a 3:00 AM wrap for the 10-hour turnaround.",
        target: 'Monitor'
      },
      'UPM': {
        action: 'Overtime watch: night exterior with marine crew',
        detail: "Hold at 9 minutes. Marine crew and the safety boat are on the clock until wrap. Tomorrow's 1:00 PM call holds only with a 3:00 AM wrap.",
        target: 'Monitor'
      },
      'Talent Assistant': {
        action: 'Talent: Silva in holding, Reyes in a wardrobe reset',
        detail: 'R. Bianchi (Silva) arrived after the 6:15 PM dock safety brief — get Silva briefed by the Marine Safety Warden before Scene 15. K. Oduya (Reyes) is with wardrobe on set.',
        target: 'Ready by 8:25 PM'
      },
      'DP': {
        action: 'Camera ready. Waiting on the condor flag and the boat.',
        detail: "A camera on the dolly master, B camera tight on Reyes. The stunt double's marks are set at the dock edge for the fall.",
        target: 'Roll at 8:30 PM'
      },
      'Props': {
        action: 'Hold the picture boat on its mark, engine off',
        detail: "Take 2 caught the boat's engine under the dialogue. The Marine Safety Warden has the engine off. Keep the boat at the pier end for Scene 15's pull-away.",
        target: '8:16 PM'
      },
      'Art Department': {
        action: 'Check the dock dressing against the Episode 1 photos',
        detail: 'Scenes 12 and 13 are done, and the evidence-room file cases are logged on the contact sheet. Crates and netting on the dock should match the Ep 1 Scene 41–42 photos.',
        target: '8:20 PM'
      }
    },
    whatChanged: [
      { kind: 'stop', text: "Take 3 stopped at 0:41 — Reyes's blood read heavier than the lookbook photo", time: '8:06 PM' },
      { kind: 'alert', text: 'DP flagged lighting: the condor backlight flares at the end of the dolly move', time: '8:04 PM' },
      { kind: 'alert', text: 'Picture boat engine off — it was running under the dialogue in Take 2', time: '8:01 PM' }
    ],
    timeLoss: [
      { cause: 'Lighting adjustment', minutes: 14, setupCount: 3 },
      { cause: 'Continuity', minutes: 9, setupCount: 2 },
      { cause: 'Sound', minutes: 6, setupCount: 2 },
      { cause: 'Props / set reset', minutes: 5, setupCount: 1 },
      { cause: 'Actor performance / line', minutes: 4, setupCount: 1 },
      { cause: 'Camera / focus', minutes: 3, setupCount: 1 }
    ],
    setupHistory: [
      { setup: '14A', takes: 3, usable: 0, issue: 'Lighting, boat noise, blood continuity', current: true },
      { setup: '12A', takes: 4, usable: 2, issue: 'Props: evidence file cases reset' },
      { setup: '11A', takes: 3, usable: 2, issue: 'Lighting' },
      { setup: '13A', takes: 2, usable: 2, issue: 'None' },
      { setup: '19B', takes: 5, usable: 1, issue: "Wardrobe: Price's jacket pinned between takes" }
    ],
    insight: "Lighting has held 3 of today's 6 setups, and the boat has to be staged for Scene 15 anyway. Staging it during this reset could recover 10 to 15 minutes before the 3:00 AM turnaround line.",
    lighting: {
      patternAlert: "Lighting has held 3 of today's 6 setups. Pre-rig the Scene 15 boat-run lighting while the boat is being staged.",
      etaTrackRecord: [
        { setup: '19A', result: 'onTime' },
        { setup: '19B', result: 'onTime' },
        { setup: '13A', result: 'onTime' },
        { setup: '11A', result: 'late' },
        { setup: '12A', result: 'onTime' }
      ],
      equipment: [
        { name: 'Generator A', status: 'Running · 82% load · HMIs and condors on the dock', tone: 'ok' },
        { name: 'Condors', status: 'Two up at the pier end · backlight flag going on', tone: 'watch' },
        { name: 'Cable Run', status: 'Taped along the pier · kept back from the water', tone: 'ok' },
        { name: 'Rain Cover', status: 'Standing by · 20% chance of rain', tone: 'watch' }
      ],
      checklist: [
        'Condor backlight flagged off the lens',
        'HMI key balanced for the dolly master',
        'Dock practicals dimmed to 40%',
        "Cable run taped and kept back from the water's edge",
        'Life vests on everyone working within 15 feet of the edge',
        'Fire extinguisher at the generator'
      ]
    }
  },

  prep: {
    // Detective Vale's Change 4 carries Episode 1's rain-tower damage into
    // Episode 2 (the SOP's own carry-over example); Ana Reyes's blood level
    // escalates on the dock.
    costumePlot: [
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
        hazards: ['Blood rig (Ep2 Sc.14, progressive)'],
        storyReasoning: 'Reyes gets hurt on the dock in Scene 14 — the blood has to escalate take to take, and carry into every scene after, or the injury reads as fake.',
        fittingStatus: 'issue',
        continuityNotes: ['Blood level must match the continuity photo from the last printed take before advancing it'],
        sceneIds: ['12', '14']
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
    ],
    // Episode for each scene number — what costume_change_usage reads from
    // the scenes/productions join (supabase/migrations/0002_wardrobe_depth.sql).
    sceneEpisodes: {
      '38': 1, '39': 1, '40': 1, '41': 1, '42': 1,
      '11': 2, '12': 2, '13': 2, '14': 2, '15': 2, '19': 2
    },
    headshots: {
      1: valeHeadshot,
      2: reyesHeadshot,
      3: kadeHeadshot,
      4: drayHeadshot,
      5: priceHeadshot,
      6: silvaHeadshot
    },
    budget: {
      costPerMinuteLost: 850,
      departments: [
        { department: 'Camera', allocated: 42000, spent: 36800 },
        { department: 'Lighting', allocated: 34000, spent: 31900 },
        { department: 'Set/Props', allocated: 21000, spent: 18750 },
        { department: 'Talent', allocated: 58000, spent: 52100 },
        { department: 'Wardrobe', allocated: 18000, spent: 14300 },
        { department: 'Sound', allocated: 14000, spent: 11200 },
        { department: 'Marine & Safety', allocated: 16000, spent: 15200 },
        { department: 'Location', allocated: 22000, spent: 21400 }
      ]
    }
  }
};
