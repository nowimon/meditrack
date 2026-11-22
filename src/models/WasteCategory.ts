/**
 * Biomedical Waste Categories as per Biomedical Waste Management Rules:
 * - Yellow: Infectious, pathological, chemical, pharmaceutical waste (Incineration / Deep burial)
 * - Red: Contaminated recyclable plastics (tubing, bottles, IV tubes) (Autoclaving / Shredding)
 * - White (Translucent): Needles, scalpels, sharps (Sterilization & Dry heat / Encapsulation)
 * - Blue: Broken glassware, cytotoxic vials, metallic implants (Disinfection / Recycling)
 */

export type WasteColorCode = 'YELLOW' | 'RED' | 'WHITE' | 'BLUE';

export interface WasteCategory {
  id: WasteColorCode;
  name: string;
  treatmentMethod: string;
  urgencyWeight: number; // 4: Highest (Yellow), 3: High (Red), 2: Med (White), 1: Standard (Blue)
  badgeColor: string;
  description: string;
}

export const WASTE_CATEGORIES: Record<WasteColorCode, WasteCategory> = {
  YELLOW: {
    id: 'YELLOW',
    name: 'Yellow (Anatomical & Pathological)',
    treatmentMethod: 'High-Temperature Incineration',
    urgencyWeight: 4,
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    description: 'Highly infectious waste, anatomical tissues, expired drugs, chemical waste.',
  },
  RED: {
    id: 'RED',
    name: 'Red (Contaminated Recyclable Plastics)',
    treatmentMethod: 'Autoclaving & Shredding',
    urgencyWeight: 3,
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
    description: 'Disposable tubing, catheters, IV sets, specimen containers.',
  },
  WHITE: {
    id: 'WHITE',
    name: 'White (Sharps & Blades)',
    treatmentMethod: 'Autoclave & Sharp Encapsulation',
    urgencyWeight: 2,
    badgeColor: 'bg-slate-100 text-slate-800 border-slate-300',
    description: 'Needles, scalpels, blades, contaminated sharp metal instruments.',
  },
  BLUE: {
    id: 'BLUE',
    name: 'Blue (Glassware & Implants)',
    treatmentMethod: 'Sodium Hypochlorite Disinfection',
    urgencyWeight: 1,
    badgeColor: 'bg-sky-100 text-sky-800 border-sky-300',
    description: 'Medicine vials, ampoules, glassware, contaminated metallic implants.',
  },
};
