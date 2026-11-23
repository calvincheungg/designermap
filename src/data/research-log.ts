import type { HouseId } from './houses';

/**
 * Research bookkeeping only: which brands have had a full collaboration search
 * (see "Collaboration-only lookups" in docs/brand-research.md). It tells
 * later searches where they can stop. The site reads it in one place: Statistics'
 * Rising and cooling lists only fully searched brands (ui/stats-data.ts).
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
  // /brands/ pages don't paginate; crawled /tags/adieu, plus the brand's own news page.
  adieu: { date: '2026-11-20', complete: true, lastPage: 1, oldestYear: 2014 },
  // /brands/ pages don't paginate; crawled /tags/afew.
  afew: { date: '2026-11-19', complete: true, lastPage: 5, oldestYear: 2011 },
  airwalk: { date: '2026-11-19', complete: true, lastPage: 3, oldestYear: 2009 },
  alife: { date: '2026-11-18', complete: true, lastPage: 20, oldestYear: 2007 },
  alphaIndustries: { date: '2026-11-18', complete: true, lastPage: 15, oldestYear: 2008 },
  // /brands/ pages don't paginate; crawled /tags/alpinestars.
  alpinestars: { date: '2026-11-22', complete: true, lastPage: 2, oldestYear: 2009 },
  // /brands/ pages redirect; crawled /tags/a-ma-maniere.
  aMaManiere: { date: '2026-11-20', complete: true, lastPage: 13, oldestYear: 2014 },
  apc: { date: '2026-11-18', complete: true, lastPage: 33, oldestYear: 2007 },
  asics: { date: '2026-11-18', complete: true, lastPage: 161, oldestYear: 2007 },
  // /brands/ pages redirect; crawled /tags/asphaltgold.
  asphaltgold: { date: '2026-11-20', complete: true, lastPage: 1, oldestYear: 2014 },
  atmos: { date: '2026-11-18', complete: true, lastPage: 45, oldestYear: 2007 },
  awakeNy: { date: '2026-11-18', complete: true, lastPage: 18, oldestYear: 2014 },
  bait: { date: '2026-11-18', complete: true, lastPage: 17, oldestYear: 2012 },
  bape: { date: '2026-11-22', complete: true, lastPage: 221, oldestYear: 2007 },
  barbour: { date: '2026-11-18', complete: true },
  // /brands/ pages don't paginate; crawled /tags/barneys-new-york.
  barneysNewYork: { date: '2026-11-19', complete: true, lastPage: 7, oldestYear: 2008 },
  beams: { date: '2026-11-23', complete: true, lastPage: 61, oldestYear: 2007 },
  beenTrill: { date: '2026-11-19', complete: true, lastPage: 5, oldestYear: 2012 },
  birkenstock: { date: '2026-11-19', complete: true, lastPage: 14, oldestYear: 2008 },
  blumarine: { date: '2026-11-19', complete: true, lastPage: 1, oldestYear: 2023 },
  brooks: { date: '2026-11-18', complete: true },
  // /brands/ pages don't paginate; crawled /tags/bstn, plus web searches.
  bstn: { date: '2026-11-19', complete: true, lastPage: 2, oldestYear: 2013 },
  burberry: { date: '2026-11-18', complete: true },
  burton: { date: '2026-11-23', complete: true, lastPage: 14, oldestYear: 2007 },
  calvinKlein: { date: '2026-11-18', complete: true },
  canadaGoose: { date: '2026-11-18', complete: true, lastPage: 10, oldestYear: 2008 },
  // Crawled /tags/capsule; the generic tag is mostly unrelated capsule collections.
  capsule: { date: '2026-11-20', complete: true, lastPage: 4, oldestYear: 2009 },
  carrots: { date: '2026-11-18', complete: true, lastPage: 4, oldestYear: 2015 },
  cdgShirt: { date: '2026-11-19', complete: true, lastPage: 11, oldestYear: 2011 },
  champion: { date: '2026-11-18', complete: true },
  colette: { date: '2026-11-18', complete: true, lastPage: 37, oldestYear: 2007 },
  commonProjects: { date: '2026-11-18', complete: true },
  concepts: { date: '2026-11-19', complete: true, lastPage: 26, oldestYear: 2007 },
  // Pages 154+ were read through the all-caps /tags/CONVERSE/ archive (pages 152–171 and 192–198).
  converse: { date: '2026-11-19', complete: true, lastPage: 198, oldestYear: 2007 },
  // Crawled /tags/devilock and /jp/tags/devilock.
  devilock: { date: '2026-11-22', complete: true, lastPage: 5, oldestYear: 2007 },
  // /brands/ pages don't paginate; crawled /tags/diemme, plus the brand's own collaborations list.
  diemme: { date: '2026-11-23', complete: true, lastPage: 9, oldestYear: 2009 },
  // /brands/ pages redirect; crawled /tags/dime and /tags/dime-mtl (3 pages).
  dime: { date: '2026-11-23', complete: true, lastPage: 11, oldestYear: 2014 },
  dior: { date: '2026-11-18', complete: true, lastPage: 53, oldestYear: 2008 },
  drMartens: { date: '2026-11-18', complete: true, lastPage: 36, oldestYear: 2007 },
  dunhill: { date: '2026-11-23', complete: true, lastPage: 2, oldestYear: 2009 },
  dunst: { date: '2026-11-23', complete: true, noArchive: true },
  // /brands/ page redirects; crawled /tags/duran-lantink.
  duranLantinkLabel: { date: '2026-11-23', complete: true, lastPage: 1, oldestYear: 2019 },
  duroOlowu: { date: '2026-11-23', complete: true, noArchive: true },
  dynamite: { date: '2026-11-23', complete: true, noArchive: true },
  dzhus: { date: '2026-11-23', complete: true, noArchive: true },
  // /brands/ page redirects; crawled /tags/eat-dust, plus the brand's own journal.
  eatDust: { date: '2026-11-23', complete: true, lastPage: 1, oldestYear: 2015 },
  // Crawled /tags/ebbets-field-flannels, /tags/ebbets-field (2 pages) and /tags/ebbets (1 page).
  ebbetsFieldFlannels: { date: '2026-11-23', complete: true, lastPage: 6, oldestYear: 2011 },
  eckhausLatta: { date: '2026-11-18', complete: true },
  // /brands/ page redirects; crawled /tags/ecko-unltd, /tags/ecko and /tags/marc-ecko.
  eckoUnltd: { date: '2026-11-23', complete: true, lastPage: 1, oldestYear: 2008 },
  // Crawled /tags/ecole-de-pensee.
  ecoleDePensee: { date: '2026-11-23', complete: true, lastPage: 1, oldestYear: 2017 },
  elisabettaFranchi: { date: '2026-11-23', complete: true, noArchive: true },
  elizabethAndJames: { date: '2026-11-23', complete: true, noArchive: true },
  // /brands/ page redirects; crawled /tags/elwood.
  elwood: { date: '2026-11-23', complete: true, lastPage: 1, oldestYear: 2008 },
  emmelRefines: { date: '2026-11-23', complete: true, noArchive: true },
  // /brands/ page redirects; crawled /tags/enfin-leve.
  enfinLeve: { date: '2026-11-23', complete: true, lastPage: 1, oldestYear: 2014 },
  // /brands/ page redirects; crawled /tags/ernest-w-baker.
  ernestWBaker: { date: '2026-11-23', complete: true, lastPage: 1, oldestYear: 2023 },
  extraButter: { date: '2026-11-19', complete: true, lastPage: 9, oldestYear: 2008 },
  faherty: { date: '2026-11-19', complete: true, noArchive: true },
  fila: { date: '2026-11-18', complete: true },
  fillingPieces: { date: '2026-11-20', complete: true, lastPage: 9, oldestYear: 2011 },
  // /brands/ pages redirect; crawled /tags/47 and /tags/47-brand, plus the Japanese /jp/tags/47 (2 pages).
  fortySeven: { date: '2026-11-23', complete: true, lastPage: 4, oldestYear: 2015 },
  // /brands/ pages don't paginate; crawled /tags/fox-racing.
  foxRacing: { date: '2026-11-22', complete: true, lastPage: 2, oldestYear: 2018 },
  fragmentDesign: { date: '2026-11-18', complete: true },
  // Crawled /tags/frame (one page); /tags/frame-denim doesn't exist. Also read the brand's own collection list.
  frame: { date: '2026-11-23', complete: true, lastPage: 1, oldestYear: 2022 },
  ftc: { date: '2026-11-20', complete: true, lastPage: 7, oldestYear: 2007 },
  ftp: { date: '2026-11-18', complete: true, lastPage: 2, oldestYear: 2014 },
  georgeCox: { date: '2026-11-18', complete: true },
  givenchy: { date: '2026-11-20', complete: true, lastPage: 36, oldestYear: 2008 },
  // Crawled /tags/god-selection-xxx and /jp/tags/god-selection-xxx.
  godSelectionXxx: { date: '2026-11-22', complete: true, lastPage: 3, oldestYear: 2019 },
  goodenough: { date: '2026-11-22', complete: true, lastPage: 5, oldestYear: 2007 },
  // /brands/ pages redirect; crawled /tags/goodhood and /tags/the-goodhood-store (3 pages).
  goodhood: { date: '2026-11-23', complete: true, lastPage: 12, oldestYear: 2008 },
  gregory: { date: '2026-11-23', complete: true, lastPage: 2, oldestYear: 2008 },
  guess: { date: '2026-11-22', complete: true, lastPage: 7, oldestYear: 2012 },
  // /brands/ pages redirect; crawled /tags/hbx.
  hbx: { date: '2026-11-20', complete: true, lastPage: 97, oldestYear: 2015 },
  hellstar: { date: '2026-11-18', complete: true, lastPage: 1, oldestYear: 2026 },
  herschelSupply: { date: '2026-11-18', complete: true },
  highsAndLows: { date: '2026-11-19', complete: true, lastPage: 3, oldestYear: 2010 },
  // Crawled /tags/hiking-patrol, plus the brand's own collection list.
  hikingPatrol: { date: '2026-11-23', complete: true, lastPage: 2, oldestYear: 2022 },
  hm: { date: '2026-11-18', complete: true, lastPage: 20, oldestYear: 2008 },
  // /brands/ pages don't paginate; crawled /tags/holzweiler (2 pages) plus the brand's own collaborations page.
  holzweiler: { date: '2026-11-19', complete: true, lastPage: 2, oldestYear: 2017 },
  // /brands/ pages redirect; crawled /tags/hombre-nino and /jp/tags/hombre-nino (2 pages).
  hombreNino: { date: '2026-11-23', complete: true, lastPage: 2, oldestYear: 2012 },
  // /brands/ pages don't paginate; crawled /tags/hysteric-glamour plus the Fashion Press collab list.
  hystericGlamour: { date: '2026-11-19', complete: true, lastPage: 9, oldestYear: 2007 },
  // /brands/ pages redirect; crawled /tags/icny.
  icny: { date: '2026-11-23', complete: true, lastPage: 4, oldestYear: 2014 },
  jamesPerse: { date: '2026-11-19', complete: true, lastPage: 1, oldestYear: 2013 },
  // /brands/ pages redirect; crawled /tags/journal-standard and relume, their /jp/ tags, the Fashion Press lists and BAYCREW'S PR TIMES archive (2014+).
  journalStandard: { date: '2026-11-23', complete: true, lastPage: 8, oldestYear: 2009 },
  // /brands/ pages redirect; crawled /tags/juice.
  juice: { date: '2026-11-20', complete: true, lastPage: 6, oldestYear: 2008 },
  justDon: { date: '2026-11-23', complete: true, lastPage: 7, oldestYear: 2013 },
  jwAnderson: { date: '2026-11-18', complete: true },
  kanuk: { date: '2026-11-19', complete: true, lastPage: 1, oldestYear: 2021 },
  kappa: { date: '2026-11-18', complete: true, lastPage: 10, oldestYear: 2016 },
  // Crawled /tags/kartik-research and /tags/karu-research (1 page each).
  kartikResearch: { date: '2026-11-23', complete: true, lastPage: 1, oldestYear: 2023 },
  // /brands/ pages redirect; crawled /tags/kicks-lab.
  kicksLab: { date: '2026-11-20', complete: true, lastPage: 2, oldestYear: 2008 },
  lacoste: { date: '2026-11-19', complete: true, lastPage: 25, oldestYear: 2007 },
  levis: { date: '2026-11-19', complete: true, lastPage: 79, oldestYear: 2007 },
  littleTokyoTableTennis: { date: '2026-11-18', complete: true, lastPage: 1, oldestYear: 2022 },
  loopwheeler: { date: '2026-11-22', complete: true, lastPage: 6, oldestYear: 2008 },
  // /brands/ pages redirect; crawled /tags/maap.
  maap: { date: '2026-11-23', complete: true, lastPage: 2, oldestYear: 2021 },
  // Crawled /tags/magic-stick and /jp/tags/magic-stick.
  magicStick: { date: '2026-11-22', complete: true, lastPage: 5, oldestYear: 2010 },
  // /brands/ pages don't paginate; crawled /tags/matchesfashion.
  matchesFashion: { date: '2026-11-19', complete: true, lastPage: 10, oldestYear: 2015 },
  // /brands/ pages redirect; crawled /tags/merrell and /tags/merrell-1trl (4 pages).
  merrell: { date: '2026-11-23', complete: true, lastPage: 8, oldestYear: 2010 },
  mitaSneakers: { date: '2026-11-18', complete: true, lastPage: 15, oldestYear: 2007 },
  // Crawled /tags/mitchell-ness and /tags/mitchell-and-ness (2 pages).
  mitchellAndNess: { date: '2026-11-23', complete: true, lastPage: 13, oldestYear: 2007 },
  moncler: { date: '2026-11-18', complete: true, lastPage: 38, oldestYear: 2008 },
  nanga: { date: '2026-11-18', complete: true, lastPage: 5, oldestYear: 2016 },
  needles: { date: '2026-11-18', complete: true, lastPage: 29, oldestYear: 2009 },
  // Pages 212+ were read through the all-caps /tags/NEW-BALANCE/ archive (pages 205–344).
  newBalance: { date: '2026-11-19', complete: true, lastPage: 344, oldestYear: 2007 },
  // Also crawled the Japanese /jp/tags/new-era (25 pages) and the Fashion Press collab list.
  newEra: { date: '2026-11-23', complete: true, lastPage: 82, oldestYear: 2007 },
  nexusVII: { date: '2026-11-18', complete: true, lastPage: 10, oldestYear: 2010 },
  // /brands/ and /tags/ archives are capped at page 833 (Mar 2019); 1999–Mar 2019 covered by web searches only.
  nike: { date: '2026-11-22', complete: true, lastPage: 833, oldestYear: 2019 },
  nikeAcg: { date: '2026-11-22', complete: true, lastPage: 29, oldestYear: 2008 },
  noah: { date: '2026-11-18', complete: true, lastPage: 23, oldestYear: 2015 },
  nonnative: { date: '2026-11-18', complete: true, lastPage: 28, oldestYear: 2007 },
  // /brands/ pages don't paginate; crawled /tags/notre.
  notre: { date: '2026-11-19', complete: true, lastPage: 4, oldestYear: 2015 },
  nudieJeans: { date: '2026-11-22', complete: true, lastPage: 3, oldestYear: 2010 },
  onitsukaTiger: { date: '2026-11-18', complete: true },
  onlyNy: { date: '2026-11-22', complete: true, lastPage: 6, oldestYear: 2008 },
  onRunning: { date: '2026-11-18', complete: true },
  openingCeremony: { date: '2026-11-18', complete: true, lastPage: 32, oldestYear: 2008 },
  osiris: { date: '2026-11-22', complete: true, lastPage: 1, oldestYear: 2009 },
  ourLegacy: { date: '2026-11-18', complete: true, lastPage: 16, oldestYear: 2009 },
  ovo: { date: '2026-11-22', complete: true, lastPage: 35, oldestYear: 2010 },
  packer: { date: '2026-11-19', complete: true, lastPage: 10, oldestYear: 2011 },
  // /brands/ pages don't paginate; crawled /tags/palace-skateboards to page 56 (Jun 2018), then the all-caps /tags/PALACE/ archive pages 75–101.
  palace: { date: '2026-11-19', complete: true, lastPage: 101, oldestYear: 2010 },
  palladium: { date: '2026-11-18', complete: true, lastPage: 7, oldestYear: 2009 },
  pariaFarzanehLabel: { date: '2026-11-18', complete: true, lastPage: 3, oldestYear: 2017 },
  patagonia: { date: '2026-11-22', complete: true, lastPage: 7, oldestYear: 2009 },
  paulSmith: { date: '2026-11-18', complete: true },
  perryEllis: { date: '2026-11-18', complete: true },
  // Crawled /tags/pf-flyers and /tags/p-f-flyers (1 page), plus the brand's own collection list.
  pfFlyers: { date: '2026-11-23', complete: true, lastPage: 9, oldestYear: 2007 },
  placesPlusFaces: { date: '2026-11-18', complete: true, lastPage: 2, oldestYear: 2015 },
  // Crawled /tags/pleasures.
  pleasures: { date: '2026-11-23', complete: true, lastPage: 23, oldestYear: 2015 },
  // /brands/ pages don't paginate; crawled /tags/polar-skate-co.
  polarSkateCo: { date: '2026-11-20', complete: true, lastPage: 2, oldestYear: 2014 },
  poloRalphLauren: { date: '2026-11-22', complete: true },
  popTradingCompany: { date: '2026-11-18', complete: true },
  porterYoshida: { date: '2026-11-17', complete: true },
  // /brands/ pages redirect; crawled /tags/proleta-re-art and /jp/tags/proleta-re-art.
  proletaReArt: { date: '2026-11-23', complete: true, lastPage: 1, oldestYear: 2022 },
  // Pages 171-175 were read through the uppercase /tags/PUMA/ archive (pages 171-178).
  puma: { date: '2026-11-18', complete: true, lastPage: 178, oldestYear: 2007 },
  ralphLauren: { date: '2026-11-22', complete: true },
  randomIdentities: { date: '2026-11-19', complete: true, lastPage: 2, oldestYear: 2019 },
  // Pages 171+ were read through the uppercase /tags/Reebok/ archive (pages 171-195).
  reebok: { date: '2026-11-18', complete: true, lastPage: 195, oldestYear: 2007 },
  repetto: { date: '2026-11-19', complete: true, noArchive: true },
  rimowa: { date: '2026-11-19', complete: true, lastPage: 20, oldestYear: 2008 },
  roots: { date: '2026-11-18', complete: true },
  rothco: { date: '2026-11-18', complete: true, lastPage: 1, oldestYear: 2012 },
  // /brands/ pages redirect; crawled /tags/rsvp-gallery.
  rsvpGallery: { date: '2026-11-20', complete: true, lastPage: 8, oldestYear: 2009 },
  saintAlfred: { date: '2026-11-19', complete: true, lastPage: 4, oldestYear: 2007 },
  saintwoods: { date: '2026-11-19', complete: true, lastPage: 3, oldestYear: 2016 },
  // Crawled /tags/santa-cruz and /jp/tags/santa-cruz.
  santaCruzSkateboards: { date: '2026-11-22', complete: true, lastPage: 3, oldestYear: 2008 },
  saucony: { date: '2026-11-18', complete: true },
  sneakerFreaker: { date: '2026-11-19', complete: true, lastPage: 9, oldestYear: 2008 },
  sneakersnstuff: { date: '2026-11-19', complete: true, lastPage: 14, oldestYear: 2009 },
  // /brands/ pages don't paginate; crawled /tags/social-status.
  socialStatus: { date: '2026-11-19', complete: true, lastPage: 8, oldestYear: 2012 },
  solovair: { date: '2026-11-18', complete: true },
  sperry: { date: '2026-11-22', complete: true, lastPage: 7, oldestYear: 2008 },
  // Read through the /tags/ssense/ archive (/brands/ssense/page/N repeats page 1).
  ssense: { date: '2026-11-19', complete: true, lastPage: 45, oldestYear: 2012 },
  staple: { date: '2026-11-18', complete: true, lastPage: 16, oldestYear: 2007 },
  stellaMcCartney: { date: '2026-11-18', complete: true, lastPage: 5, oldestYear: 2011 },
  // Crawled /tags/stepney-workers-club, plus the brand's own blog.
  stepneyWorkersClub: { date: '2026-11-23', complete: true, lastPage: 2, oldestYear: 2018 },
  stoneIsland: { date: '2026-11-18', complete: true, lastPage: 49, oldestYear: 2008 },
  // Pages 89+ were read through the all-caps /tags/STUSSY/ archive (pages 98–173).
  stussy: { date: '2026-11-19', complete: true, lastPage: 173, oldestYear: 2007 },
  subu: { date: '2026-11-18', complete: true, lastPage: 2, oldestYear: 2020 },
  // /brands/ pages redirect; crawled /tags/sugarhill.
  sugarhill: { date: '2026-11-23', complete: true, lastPage: 1, oldestYear: 2019 },
  supreme: { date: '2026-11-19', complete: true, lastPage: 199, oldestYear: 2007 },
  syte: { date: '2026-11-20', complete: true, lastPage: 2, oldestYear: 2012 },
  tenCorsoComo: { date: '2026-11-19', complete: true, lastPage: 4, oldestYear: 2008 },
  tenDeep: { date: '2026-11-18', complete: true, lastPage: 10, oldestYear: 2011 },
  thebeMagugu: { date: '2026-11-18', complete: true, lastPage: 1, oldestYear: 2019 },
  // /brands/ pages don't paginate; crawled /tags/the-broken-arm.
  theBrokenArm: { date: '2026-11-20', complete: true, lastPage: 3, oldestYear: 2014 },
  // Pages 28+ were read through the all-caps /tags/THE-HUNDREDS/ archive (pages 32–49).
  theHundreds: { date: '2026-11-19', complete: true, lastPage: 49, oldestYear: 2007 },
  theNorthFace: { date: '2026-11-18', complete: true },
  timberland: { date: '2026-11-18', complete: true, lastPage: 42, oldestYear: 2007 },
  tommyHilfiger: { date: '2026-11-18', complete: true },
  // Crawled /tags/tom-sachs.
  tomSachsStudio: { date: '2026-11-20', complete: true, lastPage: 17, oldestYear: 2008 },
  // /brands/ pages don't paginate; crawled /tags/tres-bien.
  tresBien: { date: '2026-11-19', complete: true, lastPage: 8, oldestYear: 2010 },
  trickers: { date: '2026-11-19', complete: true, lastPage: 10, oldestYear: 2008 },
  ugg: { date: '2026-11-18', complete: true, lastPage: 12, oldestYear: 2008 },
  umbro: { date: '2026-11-18', complete: true, lastPage: 13, oldestYear: 2007 },
  undefeated: { date: '2026-11-18', complete: true, lastPage: 66, oldestYear: 2007 },
  undercover: { date: '2026-11-22', complete: true, lastPage: 88, oldestYear: 2007 },
  // /brands/ pages redirect; crawled /tags/united-arrows.
  unitedArrows: { date: '2026-11-23', complete: true, lastPage: 20, oldestYear: 2007 },
  vans: { date: '2026-11-22', complete: true, lastPage: 266, oldestYear: 2007 },
  versace: { date: '2026-11-18', complete: true },
  vetements: { date: '2026-11-19', complete: true, lastPage: 31, oldestYear: 2015 },
  vineyardVines: { date: '2026-11-18', complete: true, noArchive: true },
  vlone: { date: '2026-11-22', complete: true, lastPage: 9, oldestYear: 2015 },
  wackoMaria: { date: '2026-11-17', complete: true },
  // /brands/ pages don't paginate; crawled /tags/wales-bonner.
  walesBonner: { date: '2026-11-22', complete: true, lastPage: 10, oldestYear: 2016 },
  whiteMountaineering: { date: '2026-11-22', complete: true, lastPage: 30, oldestYear: 2008 },
  // Crawled /tags/wildside-yohji-yamamoto.
  wildsideYohjiYamamoto: { date: '2026-11-20', complete: true, lastPage: 4, oldestYear: 2022 },
  // Crawled /tags/wind-and-sea and the Japanese /jp/tags/wind-and-sea (6 pages).
  windAndSea: { date: '2026-11-22', complete: true, lastPage: 8, oldestYear: 2019 },
  wtaps: { date: '2026-11-18', complete: true, lastPage: 41, oldestYear: 2007 },
  yohjiYamamoto: { date: '2026-11-20', complete: true, lastPage: 46, oldestYear: 2008 },
  // Crawled /tags/yohji-yamamoto-pour-homme.
  yohjiYamamotoPourHomme: { date: '2026-11-20', complete: true, lastPage: 2, oldestYear: 2017 },
  // No /brands/ archive (404); crawled /tags/ys.
  ys: { date: '2026-11-20', complete: true, lastPage: 3, oldestYear: 2014 },
  zegna: { date: '2026-11-18', complete: true },
} satisfies Partial<Record<HouseId, CollabSearch>>;
