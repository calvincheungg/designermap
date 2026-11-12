/**
 * Core data model.
 *
 * Source of truth:
 *   - houses.ts    → one entry per fashion house (location, logo, founding info)
 *   - designers.ts → one entry per designer, with their `career` (list of tenures)
 *
 * Everything else (a house's list of creative directors, a designer's "moves"
 * between houses) is derived from those two files in data/index.ts, so each fact
 * is only written down once.
 */

export interface HouseData {
  name: string;
  founded?: number;
  founder?: string;
  /** Used to cluster / colour houses in the graph (e.g. all Paris houses together). */
  city: string;
  country: string;
  /** Filename inside public/logos/, e.g. "dior.svg". Omit to show initials. */
  logo?: string;
  /** Optional brand color used for the initials badge + timeline accents. */
  color?: string;
  parentGroup?: string;
  notes?: string;
  sources?: string[];
}

export type Role =
  | 'Creative Director'
  | 'Artistic Director'
  | 'Co-Creative Director'
  | 'Head Designer'
  | 'Menswear Director'
  | 'Womenswear Director'
  | 'Founder'
  | 'Other';

export interface Tenure<HouseId extends string = string> {
  house: HouseId;
  role: Role;
  /** Optional free-text detail, e.g. "Dior Homme" or "Rive Gauche womenswear". */
  roleDetail?: string;
  start: number;
  /** `null` = current. `undefined` = unknown / still researching. */
  end?: number | null;
  /** Mark years you haven't confirmed yet so they show a "~" in the UI. */
  approximate?: boolean;
  notes?: string;
  sources?: string[];
}

export interface DesignerData<HouseId extends string = string> {
  name: string;
  born?: number;
  died?: number;
  nationality?: string;
  /** Order doesn't matter; it's sorted by start year when displayed. */
  career: Tenure<HouseId>[];
  notes?: string;
  sources?: string[];
}

/* ---------- Derived shapes (built in data/index.ts) ---------- */

export interface House extends HouseData {
  id: string;
}

export interface Designer extends DesignerData {
  id: string;
}

/** A tenure joined with its designer — what a house's timeline shows. */
export interface HouseTenure extends Tenure {
  designerId: string;
}

/** A designer going from one house to the next in their career. */
export interface Move {
  designerId: string;
  from: Tenure;
  to: Tenure;
  /** The year they started at the new house. */
  year: number;
}
