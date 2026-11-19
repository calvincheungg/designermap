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
  adidas: { date: '2026-11-19', complete: true, lastPage: 815, oldestYear: 2007 },
  airwalk: { date: '2026-11-19', complete: true, lastPage: 3, oldestYear: 2009 },
  alife: { date: '2026-11-18', complete: true, lastPage: 20, oldestYear: 2007 },
  alphaIndustries: { date: '2026-11-18', complete: true, lastPage: 15, oldestYear: 2008 },
  apc: { date: '2026-11-18', complete: true, lastPage: 33, oldestYear: 2007 },
  asics: { date: '2026-11-18', complete: true, lastPage: 161, oldestYear: 2007 },
  atmos: { date: '2026-11-18', complete: true, lastPage: 45, oldestYear: 2007 },
  awakeNy: { date: '2026-11-18', complete: true, lastPage: 18, oldestYear: 2014 },
  bait: { date: '2026-11-18', complete: true, lastPage: 17, oldestYear: 2012 },
  barbour: { date: '2026-11-18', complete: true },
  beenTrill: { date: '2026-11-19', complete: true, lastPage: 5, oldestYear: 2012 },
  birkenstock: { date: '2026-11-19', complete: true, lastPage: 14, oldestYear: 2008 },
  blumarine: { date: '2026-11-19', complete: true, lastPage: 1, oldestYear: 2023 },
  brooks: { date: '2026-11-18', complete: true },
  burberry: { date: '2026-11-18', complete: true },
  calvinKlein: { date: '2026-11-18', complete: true },
  canadaGoose: { date: '2026-11-18', complete: true, lastPage: 10, oldestYear: 2008 },
  carrots: { date: '2026-11-18', complete: true, lastPage: 4, oldestYear: 2015 },
  cdgShirt: { date: '2026-11-19', complete: true, lastPage: 11, oldestYear: 2011 },
  champion: { date: '2026-11-18', complete: true },
  colette: { date: '2026-11-18', complete: true, lastPage: 37, oldestYear: 2007 },
  commonProjects: { date: '2026-11-18', complete: true },
  concepts: { date: '2026-11-19', complete: true, lastPage: 26, oldestYear: 2007 },
  // Pages 154+ were read through the all-caps /tags/CONVERSE/ archive (pages 152–171 and 192–198).
  converse: { date: '2026-11-19', complete: true, lastPage: 198, oldestYear: 2007 },
  dior: { date: '2026-11-18', complete: true, lastPage: 53, oldestYear: 2008 },
  drMartens: { date: '2026-11-18', complete: true, lastPage: 36, oldestYear: 2007 },
  eckhausLatta: { date: '2026-11-18', complete: true },
  extraButter: { date: '2026-11-19', complete: true, lastPage: 9, oldestYear: 2008 },
  faherty: { date: '2026-11-19', complete: true, noArchive: true },
  fila: { date: '2026-11-18', complete: true },
  fragmentDesign: { date: '2026-11-18', complete: true },
  ftp: { date: '2026-11-18', complete: true, lastPage: 2, oldestYear: 2014 },
  georgeCox: { date: '2026-11-18', complete: true },
  hellstar: { date: '2026-11-18', complete: true, lastPage: 1, oldestYear: 2026 },
  herschelSupply: { date: '2026-11-18', complete: true },
  highsAndLows: { date: '2026-11-19', complete: true, lastPage: 3, oldestYear: 2010 },
  hm: { date: '2026-11-18', complete: true, lastPage: 20, oldestYear: 2008 },
  // /brands/ pages don't paginate; crawled /tags/holzweiler (2 pages) plus the brand's own collaborations page.
  holzweiler: { date: '2026-11-19', complete: true, lastPage: 2, oldestYear: 2017 },
  jamesPerse: { date: '2026-11-19', complete: true, lastPage: 1, oldestYear: 2013 },
  jwAnderson: { date: '2026-11-18', complete: true },
  kappa: { date: '2026-11-18', complete: true, lastPage: 10, oldestYear: 2016 },
  lacoste: { date: '2026-11-19', complete: true, lastPage: 25, oldestYear: 2007 },
  levis: { date: '2026-11-19', complete: true, lastPage: 79, oldestYear: 2007 },
  littleTokyoTableTennis: { date: '2026-11-18', complete: true, lastPage: 1, oldestYear: 2022 },
  mitaSneakers: { date: '2026-11-18', complete: true, lastPage: 15, oldestYear: 2007 },
  moncler: { date: '2026-11-18', complete: true, lastPage: 38, oldestYear: 2008 },
  nanga: { date: '2026-11-18', complete: true, lastPage: 5, oldestYear: 2016 },
  needles: { date: '2026-11-18', complete: true, lastPage: 29, oldestYear: 2009 },
  // Pages 212+ were read through the all-caps /tags/NEW-BALANCE/ archive (pages 205–344).
  newBalance: { date: '2026-11-19', complete: true, lastPage: 344, oldestYear: 2007 },
  nexusVII: { date: '2026-11-18', complete: true, lastPage: 10, oldestYear: 2010 },
  noah: { date: '2026-11-18', complete: true, lastPage: 23, oldestYear: 2015 },
  nonnative: { date: '2026-11-18', complete: true, lastPage: 28, oldestYear: 2007 },
  onitsukaTiger: { date: '2026-11-18', complete: true },
  onRunning: { date: '2026-11-18', complete: true },
  openingCeremony: { date: '2026-11-18', complete: true, lastPage: 32, oldestYear: 2008 },
  ourLegacy: { date: '2026-11-18', complete: true, lastPage: 16, oldestYear: 2009 },
  packer: { date: '2026-11-19', complete: true, lastPage: 10, oldestYear: 2011 },
  // /brands/ pages don't paginate; crawled /tags/palace-skateboards to page 56 (Jun 2018), then the all-caps /tags/PALACE/ archive pages 75–101.
  palace: { date: '2026-11-19', complete: true, lastPage: 101, oldestYear: 2010 },
  palladium: { date: '2026-11-18', complete: true, lastPage: 7, oldestYear: 2009 },
  pariaFarzanehLabel: { date: '2026-11-18', complete: true, lastPage: 3, oldestYear: 2017 },
  paulSmith: { date: '2026-11-18', complete: true },
  perryEllis: { date: '2026-11-18', complete: true },
  placesPlusFaces: { date: '2026-11-18', complete: true, lastPage: 2, oldestYear: 2015 },
  poloRalphLauren: { date: '2026-11-18', complete: true },
  popTradingCompany: { date: '2026-11-18', complete: true },
  porterYoshida: { date: '2026-11-17', complete: true },
  // Pages 171-175 were read through the uppercase /tags/PUMA/ archive (pages 171-178).
  puma: { date: '2026-11-18', complete: true, lastPage: 178, oldestYear: 2007 },
  ralphLauren: { date: '2026-11-18', complete: true },
  randomIdentities: { date: '2026-11-19', complete: true, lastPage: 2, oldestYear: 2019 },
  // Pages 171+ were read through the uppercase /tags/Reebok/ archive (pages 171-195).
  reebok: { date: '2026-11-18', complete: true, lastPage: 195, oldestYear: 2007 },
  repetto: { date: '2026-11-19', complete: true, noArchive: true },
  roots: { date: '2026-11-18', complete: true },
  rothco: { date: '2026-11-18', complete: true, lastPage: 1, oldestYear: 2012 },
  saintAlfred: { date: '2026-11-19', complete: true, lastPage: 4, oldestYear: 2007 },
  saucony: { date: '2026-11-18', complete: true },
  sneakerFreaker: { date: '2026-11-19', complete: true, lastPage: 9, oldestYear: 2008 },
  sneakersnstuff: { date: '2026-11-19', complete: true, lastPage: 14, oldestYear: 2009 },
  solovair: { date: '2026-11-18', complete: true },
  // Read through the /tags/ssense/ archive (/brands/ssense/page/N repeats page 1).
  ssense: { date: '2026-11-19', complete: true, lastPage: 45, oldestYear: 2012 },
  staple: { date: '2026-11-18', complete: true, lastPage: 16, oldestYear: 2007 },
  stellaMcCartney: { date: '2026-11-18', complete: true, lastPage: 5, oldestYear: 2011 },
  stoneIsland: { date: '2026-11-18', complete: true, lastPage: 49, oldestYear: 2008 },
  // Pages 89+ were read through the all-caps /tags/STUSSY/ archive (pages 98–173).
  stussy: { date: '2026-11-19', complete: true, lastPage: 173, oldestYear: 2007 },
  subu: { date: '2026-11-18', complete: true, lastPage: 2, oldestYear: 2020 },
  tenCorsoComo: { date: '2026-11-19', complete: true, lastPage: 4, oldestYear: 2008 },
  tenDeep: { date: '2026-11-18', complete: true, lastPage: 10, oldestYear: 2011 },
  thebeMagugu: { date: '2026-11-18', complete: true, lastPage: 1, oldestYear: 2019 },
  // Pages 28+ were read through the all-caps /tags/THE-HUNDREDS/ archive (pages 32–49).
  theHundreds: { date: '2026-11-19', complete: true, lastPage: 49, oldestYear: 2007 },
  theNorthFace: { date: '2026-11-18', complete: true },
  timberland: { date: '2026-11-18', complete: true, lastPage: 42, oldestYear: 2007 },
  tommyHilfiger: { date: '2026-11-18', complete: true },
  trickers: { date: '2026-11-19', complete: true, lastPage: 10, oldestYear: 2008 },
  ugg: { date: '2026-11-18', complete: true, lastPage: 12, oldestYear: 2008 },
  umbro: { date: '2026-11-18', complete: true, lastPage: 13, oldestYear: 2007 },
  undefeated: { date: '2026-11-18', complete: true, lastPage: 66, oldestYear: 2007 },
  versace: { date: '2026-11-18', complete: true },
  vetements: { date: '2026-11-19', complete: true, lastPage: 31, oldestYear: 2015 },
  vineyardVines: { date: '2026-11-18', complete: true, noArchive: true },
  wackoMaria: { date: '2026-11-17', complete: true },
  wtaps: { date: '2026-11-18', complete: true, lastPage: 41, oldestYear: 2007 },
  zegna: { date: '2026-11-18', complete: true },
} satisfies Partial<Record<HouseId, CollabSearch>>;
