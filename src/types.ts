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

import type { HouseTags } from './data/tags';
import type { GroupId } from './data/groups';
import type { CountryCode } from './data/countries';

/** [latitude, longitude] */
export type LatLng = [lat: number, lng: number];

export interface HouseData {
  name: string;
  /** Editorial filter tags for the house overall, rather than a particular era. */
  tags: HouseTags;
  founded?: number;
  founder?: string;
  /** Places the house on the world map; must be a key in data/cities.ts. */
  city: string;
  country: CountryCode;
  /** The brand's official site, full URL, e.g. "https://www.loewe.com". */
  website?: string;
  /** Instagram handle without the "@", e.g. "loewe". Shown as a link under the website. */
  instagram?: string;
  /**
   * The brand's label/logo, shown in its square on the map and in the
   * Properties window. Either a filename inside public/logos/ (e.g. "dior.svg")
   * or a full image URL. Omit it, or if the image can't load, and the square
   * shows the house's initials instead.
   */
  logo?: string;
  /**
   * How the logo sits in its frame. "contain" (default) leaves a small margin;
   * "fill" scales it to the frame's full inside edge to edge. Either way, any
   * space left over is painted in the logo's own background colour.
   */
  logoFit?: 'contain' | 'fill';
  /** Optional brand color used for the initials badge + timeline accents. */
  color?: string;
  parentGroup?: GroupId;
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
  /** Family / owner running the house before the creative-director era. */
  | 'Head of House'
  | 'Other';

export interface Tenure<HouseId extends string = string> {
  house: HouseId;
  role: Role;
  /** Optional free-text detail, e.g. "Dior Homme" or "Rive Gauche womenswear". */
  roleDetail?: string;
  /** Omit when the role is confirmed but its start year is unknown. */
  start?: number;
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
  /** They kept the `from` role alongside the new one (e.g. their own label). */
  concurrent: boolean;
}
