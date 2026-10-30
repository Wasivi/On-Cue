import type { RetakeCause } from '../types';

// Reference lists every production shares. Nothing show-specific belongs
// here; that comes from the loaded call sheet (src/data/samples/).

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
  'Producer': 'High-level schedule risk, delay cause, cost/time impact',
  'Props': 'Set/prop continuity, clearance tracking, reset notes',
  'Art Department': 'Set dressing continuity, reset notes',
  'UPM': 'Budget exposure, cost impact by cause, department spend'
};
