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
  champion: { date: '2026-11-18', complete: true },
  commonProjects: { date: '2026-11-18', complete: true },
  eckhausLatta: { date: '2026-11-18', complete: true },
  fila: { date: '2026-11-18', complete: true },
  fragmentDesign: { date: '2026-11-18', complete: true },
  georgeCox: { date: '2026-11-18', complete: true },
  herschelSupply: { date: '2026-11-18', complete: true },
  jwAnderson: { date: '2026-11-18', complete: true },
  kappa: { date: '2026-11-18', complete: true, lastPage: 10, oldestYear: 2016 },
  // Pages 29–30 and 46+ returned empty responses; 2019 (p29–30) and pre-Nov 2013 covered by web searches only.
  levis: { date: '2026-11-18', complete: false, lastPage: 45, oldestYear: 2013 },
  littleTokyoTableTennis: { date: '2026-11-18', complete: true, lastPage: 1, oldestYear: 2022 },
  needles: { date: '2026-11-18', complete: true, lastPage: 29, oldestYear: 2009 },
  // Pages past 134 wouldn't load; earlier years were covered by web searches only.
  newBalance: { date: '2026-11-18', complete: false, lastPage: 134, oldestYear: 2021 },
  nexusVII: { date: '2026-11-18', complete: true, lastPage: 10, oldestYear: 2010 },
  onitsukaTiger: { date: '2026-11-18', complete: true },
  onRunning: { date: '2026-11-18', complete: true },
  // /brands/ pages don't paginate; /tags/palace-skateboards pages 6+ returned empty responses.
  // Earlier years covered by web searches and existing records only.
  palace: { date: '2026-11-18', complete: false, lastPage: 5, oldestYear: 2026 },
  palladium: { date: '2026-11-18', complete: true, lastPage: 7, oldestYear: 2009 },
  paulSmith: { date: '2026-11-18', complete: true },
  perryEllis: { date: '2026-11-18', complete: true },
  poloRalphLauren: { date: '2026-11-18', complete: true },
  popTradingCompany: { date: '2026-11-18', complete: true },
  porterYoshida: { date: '2026-11-17', complete: true },
  ralphLauren: { date: '2026-11-18', complete: true },
  roots: { date: '2026-11-18', complete: true },
  saucony: { date: '2026-11-18', complete: true },
  solovair: { date: '2026-11-18', complete: true },
  stoneIsland: { date: '2026-11-18', complete: true, lastPage: 49, oldestYear: 2008 },
  // Pages 30–35 (2018–2020) and 54+ returned empty responses; pre-2015 covered by web searches only.
  stussy: { date: '2026-11-18', complete: false, lastPage: 53, oldestYear: 2015 },
  theNorthFace: { date: '2026-11-18', complete: true },
  timberland: { date: '2026-11-18', complete: true, lastPage: 42, oldestYear: 2007 },
  tommyHilfiger: { date: '2026-11-18', complete: true },
  ugg: { date: '2026-11-18', complete: true, lastPage: 12, oldestYear: 2008 },
  versace: { date: '2026-11-18', complete: true },
  vineyardVines: { date: '2026-11-18', complete: true, noArchive: true },
  wackoMaria: { date: '2026-11-17', complete: true },
  zegna: { date: '2026-11-18', complete: true },
} satisfies Partial<Record<HouseId, CollabSearch>>;
