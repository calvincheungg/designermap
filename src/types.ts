/**
 * Core data model.
 *
 * Source of truth:
 *   - houses.ts    → one entry per fashion house (location, logo, founding info)
 *   - designers.ts → one entry per designer, with their `career` (list of tenures)
 *   - collaborations.ts → one entry per dated collaboration between brands
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

export interface RegionalAffiliation {
  group: GroupId;
  territory: string;
  relationship: 'Licensing and distribution' | 'Regional operations';
  sources: readonly string[];
}

/** Founding city, when the brand's current base is a different city. */
export interface HouseOrigin {
  /** Must be a key in data/cities.ts. */
  city: string;
  country: CountryCode;
}

/**
 * One dated change in a brand's history, listed oldest first. Founding and
 * the Ended year come from `founded`/`closed`; current ownership stays in
 * `parentGroup`, which must match the latest acquisition or spin-off.
 * `approximate` marks an inferred or unconfirmed year.
 */
export type HouseEvent =
  /** Moved its base to `city` (a cities.ts key). Omit `year` when no source dates the move. */
  | { type: 'moved'; year?: number; city: string; country: CountryCode; approximate?: boolean }
  /** Bought by a company: `group` links its profile; `buyer` names it when it differs or has no profile. */
  | { type: 'acquired'; year: number; group?: GroupId; buyer?: string; stake?: string; approximate?: boolean }
  /** Separated from its owner into `group`/`buyer`, or became independent when neither is given. */
  | { type: 'spunOff'; year: number; group?: GroupId; buyer?: string; approximate?: boolean }
  | { type: 'renamed'; year: number; name: string; approximate?: boolean }
  /** A past closure, bankruptcy or dormant period; the current `closed` year is shown as Ended instead. */
  | { type: 'closed'; year: number; label?: string; approximate?: boolean }
  /** Reopened or relaunched after a closure or dormancy. */
  | { type: 'relaunched'; year: number; label?: string; approximate?: boolean }
  | { type: 'other'; year: number; label: string; approximate?: boolean };

export interface HouseData {
  name: string;
  /** Alternate or historical names accepted by Find. */
  aliases?: readonly string[];
  /** Editorial filter tags for the house overall, rather than a particular era. */
  tags: HouseTags;
  founded?: number;
  /** Confirmed shutdown or current-pause year; displayed as Ended. Omit for active brands or an unknown end year. */
  closed?: number;
  /** Designer profile IDs; names are resolved from designers.ts, never copied. */
  founders?: readonly string[];
  /** Corporate or collective founders, separate from individual designers. */
  founderOrganization?: string;
  founderGroup?: GroupId;
  founderHouse?: string;
  /** Places the house on the world map; must be a key in data/cities.ts. */
  city: string;
  country: CountryCode;
  /** Founding city when it differs from `city`; the map can show brands here instead. */
  origin?: HouseOrigin;
  /** Moves, acquisitions and other dated changes, oldest first. A brand with an `origin` lists its move to `city`. */
  history?: readonly HouseEvent[];
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
  /** Brand-family relationship, distinct from legal ownership and founding. */
  parentHouse?: string;
  /** Regional business relationships; these do not imply global ownership. */
  regionalAffiliations?: readonly RegionalAffiliation[];
  notes?: string;
  sources?: string[];
}

/** One release or project; repeat partnerships can have separate entries by year. */
export interface CollaborationData<HouseId extends string = string> {
  /** Participating house IDs, each listed once. At least two are required. */
  houses: readonly [HouseId, HouseId, ...HouseId[]];
  /** Release year, rather than the announcement year. */
  year: number;
  /** Optional collection or project title. Brand names remain in houses.ts. */
  name?: string;
  notes?: string;
  sources?: readonly string[];
}

export interface Collaboration extends CollaborationData {
  id: string;
}

export type Role =
  | 'CEO'
  | 'President'
  | 'Managing Director'
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
