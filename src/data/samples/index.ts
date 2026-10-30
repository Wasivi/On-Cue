import type { ProductionData } from '../../types';
import { harborUnitSample } from './harborUnit';

// The call sheets this prototype can read. Reading any uploaded file isn't
// built yet (BUILD_SPEC.md); until it is, a sample's own files are
// recognized by name and load what reading them produces. Adding a show
// means adding an entry here, with no change to any screen.
const SAMPLES: { matches: RegExp; data: ProductionData }[] = [
  { matches: /harbor-unit/i, data: harborUnitSample },
];

export function sampleForFile(fileName: string): ProductionData | null {
  return SAMPLES.find(s => s.matches.test(fileName))?.data ?? null;
}

/** "Start With a Template": a ready-made shoot day built from fictional data. */
export const templateSample: ProductionData = harborUnitSample;
