import type { HouseId } from './houses';

/**
 * Research bookkeeping only: which brands have had a full collaboration search
 * (see "Collaboration-only lookups" in docs/brand-research.md). The site never
 * reads this file; it tells later searches where they can stop.
 *
 * Hypebeast archives list newest first, so a repeat search only needs to crawl
 * back to `date`, then run the cheap neutral and reverse-lookup searches again.
 */
export interface CollabSearch {
  /** Day the search finished, YYYY-MM-DD. */
  date: string;
  /** False when the archive crawl stopped before its last page. */
  complete: boolean;
  /** Last Hypebeast archive page read, when recorded (the resume point if incomplete). */
  lastPage?: number;
  /** Oldest article year the crawl reached, when recorded. */
  oldestYear?: number;
  /** The brand has no Hypebeast archive; only web searches were run. */
  noArchive?: true;
}

// Entries without lastPage/oldestYear were backfilled from git history.
export const collabSearches = {
  alphaIndustries: { date: '2026-11-18', complete: true, lastPage: 15, oldestYear: 2008 },
  awakeNy: { date: '2026-11-18', complete: true, lastPage: 18, oldestYear: 2014 },
  barbour: { date: '2026-11-18', complete: true },
  brooks: { date: '2026-11-18', complete: true },
  burberry: { date: '2026-11-18', complete: true },
  calvinKlein: { date: '2026-11-18', complete: true },
  canadaGoose: { date: '2026-11-18', complete: true, lastPage: 10, oldestYear: 2008 },
  champion: { date: '2026-11-18', complete: true },
  commonProjects: { date: '2026-11-18', complete: true },
  dior: { date: '2026-11-18', complete: true, lastPage: 53, oldestYear: 2008 },
  drMartens: { date: '2026-11-18', complete: true, lastPage: 36, oldestYear: 2007 },
  eckhausLatta: { date: '2026-11-18', complete: true },
  fila: { date: '2026-11-18', complete: true },
  fragmentDesign: { date: '2026-11-18', complete: true },
  georgeCox: { date: '2026-11-18', complete: true },
  herschelSupply: { date: '2026-11-18', complete: true },
  jwAnderson: { date: '2026-11-18', complete: true },
  kappa: { date: '2026-11-18', complete: true, lastPage: 10, oldestYear: 2016 },
  // Archive ends at page 79 (2007). Pages 67–72 (2008–2009) still return empty responses; pre-Nov 2013 gaps otherwise filled.
  levis: { date: '2026-11-18', complete: false, lastPage: 79, oldestYear: 2007 },
  littleTokyoTableTennis: { date: '2026-11-18', complete: true, lastPage: 1, oldestYear: 2022 },
  moncler: { date: '2026-11-18', complete: true, lastPage: 38, oldestYear: 2008 },
  nanga: { date: '2026-11-18', complete: true, lastPage: 5, oldestYear: 2016 },
  needles: { date: '2026-11-18', complete: true, lastPage: 29, oldestYear: 2009 },
  // Read to page 238 (Oct 2016). Still empty: 160–162, 172–175, 200–203, 213–216, 228–229 and 239+ (end not yet found).
  newBalance: { date: '2026-11-18', complete: false, lastPage: 238, oldestYear: 2016 },
  nexusVII: { date: '2026-11-18', complete: true, lastPage: 10, oldestYear: 2010 },
  onitsukaTiger: { date: '2026-11-18', complete: true },
  onRunning: { date: '2026-11-18', complete: true },
  // /brands/ pages don't paginate; crawled /tags/palace-skateboards to page 43 (Aug 2020).
  // Still empty: 30–33 (early 2022) and 44+ (end not yet found); earlier years covered by web searches only.
  palace: { date: '2026-11-18', complete: false, lastPage: 43, oldestYear: 2020 },
  palladium: { date: '2026-11-18', complete: true, lastPage: 7, oldestYear: 2009 },
  pariaFarzanehLabel: { date: '2026-11-18', complete: true, lastPage: 3, oldestYear: 2017 },
  paulSmith: { date: '2026-11-18', complete: true },
  perryEllis: { date: '2026-11-18', complete: true },
  poloRalphLauren: { date: '2026-11-18', complete: true },
  popTradingCompany: { date: '2026-11-18', complete: true },
  porterYoshida: { date: '2026-11-17', complete: true },
  ralphLauren: { date: '2026-11-18', complete: true },
  roots: { date: '2026-11-18', complete: true },
  saucony: { date: '2026-11-18', complete: true },
  solovair: { date: '2026-11-18', complete: true },
  staple: { date: '2026-11-18', complete: true, lastPage: 16, oldestYear: 2007 },
  stellaMcCartney: { date: '2026-11-18', complete: true, lastPage: 5, oldestYear: 2011 },
  stoneIsland: { date: '2026-11-18', complete: true, lastPage: 49, oldestYear: 2008 },
  // Read to page 87 (Oct 2012). Still empty: 75–80 (2013) and 88+ (end not yet found).
  stussy: { date: '2026-11-18', complete: false, lastPage: 87, oldestYear: 2012 },
  tenDeep: { date: '2026-11-18', complete: true, lastPage: 10, oldestYear: 2011 },
  thebeMagugu: { date: '2026-11-18', complete: true, lastPage: 1, oldestYear: 2019 },
  theNorthFace: { date: '2026-11-18', complete: true },
  timberland: { date: '2026-11-18', complete: true, lastPage: 42, oldestYear: 2007 },
  tommyHilfiger: { date: '2026-11-18', complete: true },
  ugg: { date: '2026-11-18', complete: true, lastPage: 12, oldestYear: 2008 },
  umbro: { date: '2026-11-18', complete: true, lastPage: 13, oldestYear: 2007 },
  versace: { date: '2026-11-18', complete: true },
  vineyardVines: { date: '2026-11-18', complete: true, noArchive: true },
  wackoMaria: { date: '2026-11-17', complete: true },
  zegna: { date: '2026-11-18', complete: true },
} satisfies Partial<Record<HouseId, CollabSearch>>;
