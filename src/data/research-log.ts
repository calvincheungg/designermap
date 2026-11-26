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
  // No /brands/ archive; crawled /tags/aape.
  aape: { date: '2026-11-24', complete: true, lastPage: 8, oldestYear: 2012 },
  acneStudios: { date: '2026-11-26', complete: true, lastPage: 27, oldestYear: 2008 },
  // No /brands/ archive; crawled /tags/a-cold-wall.
  aColdWall: { date: '2026-11-24', complete: true, lastPage: 30, oldestYear: 2015 },
  acronym: { date: '2026-11-26', complete: true, lastPage: 20, oldestYear: 2007 },
  aderError: { date: '2026-11-24', complete: true, lastPage: 6, oldestYear: 2017 },
  adidas: { date: '2026-11-19', complete: true, lastPage: 815, oldestYear: 2007 },
  // /brands/ pages don't paginate; crawled /tags/adieu, plus the brand's own news page.
  adieu: { date: '2026-11-20', complete: true, lastPage: 1, oldestYear: 2014 },
  // No /brands/ archive; crawled /tags/adsum.
  adsum: { date: '2026-11-26', complete: true, lastPage: 4, oldestYear: 2017 },
  // No /brands/ archive; crawled /tags/advisory-board-crystals.
  advisoryBoardCrystals: { date: '2026-11-25', complete: true, lastPage: 6, oldestYear: 2016 },
  // /brands/ pages don't paginate; crawled /tags/afew.
  afew: { date: '2026-11-19', complete: true, lastPage: 5, oldestYear: 2011 },
  afVandevorst: { date: '2026-11-25', complete: true, noArchive: true },
  aimeLeonDore: { date: '2026-11-24', complete: true, lastPage: 18, oldestYear: 2014 },
  airwalk: { date: '2026-11-19', complete: true, lastPage: 3, oldestYear: 2009 },
  alexanderWang: { date: '2026-11-26', complete: true, lastPage: 19, oldestYear: 2009 },
  alife: { date: '2026-11-18', complete: true, lastPage: 20, oldestYear: 2007 },
  // No /brands/ archive; crawled /tags/aloha-army.
  alohaArmy: { date: '2026-11-24', complete: true, lastPage: 1, oldestYear: 2009 },
  alphaIndustries: { date: '2026-11-18', complete: true, lastPage: 15, oldestYear: 2008 },
  // /brands/ pages don't paginate; crawled /tags/alpinestars.
  alpinestars: { date: '2026-11-22', complete: true, lastPage: 2, oldestYear: 2009 },
  alyx: { date: '2026-11-24', complete: true, lastPage: 13, oldestYear: 2016 },
  // /brands/ pages redirect; crawled /tags/a-ma-maniere.
  aMaManiere: { date: '2026-11-20', complete: true, lastPage: 13, oldestYear: 2014 },
  ambush: { date: '2026-11-24', complete: true, lastPage: 27, oldestYear: 2008 },
  // No /brands/ archive; crawled /tags/andersson-bell.
  anderssonBell: { date: '2026-11-25', complete: true, lastPage: 2, oldestYear: 2020 },
  andWander: { date: '2026-11-25', complete: true, lastPage: 6, oldestYear: 2016 },
  annaSui: { date: '2026-11-25', complete: true, lastPage: 1, oldestYear: 2010 },
  annDemeulemeester: { date: '2026-11-25', complete: true, lastPage: 7, oldestYear: 2009 },
  // No /brands/ archive; crawled /tags/antihero.
  antiHero: { date: '2026-11-25', complete: true, lastPage: 2, oldestYear: 2014 },
  antiSocialSocialClub: { date: '2026-11-24', complete: true, lastPage: 18, oldestYear: 2015 },
  apc: { date: '2026-11-18', complete: true, lastPage: 33, oldestYear: 2007 },
  arcteryx: { date: '2026-11-25', complete: true, lastPage: 15, oldestYear: 2009 },
  // No /brands/ archive; crawled /tags/aries.
  aries: { date: '2026-11-24', complete: true, lastPage: 9, oldestYear: 2017 },
  // Crawled /tags/arte-antwerp.
  arteAntwerp: { date: '2026-11-24', complete: true, lastPage: 2, oldestYear: 2016 },
  // Crawled /tags/artful-dodger.
  artfulDodger: { date: '2026-11-24', complete: true, lastPage: 1, oldestYear: 2008 },
  asics: { date: '2026-11-18', complete: true, lastPage: 161, oldestYear: 2007 },
  // /brands/ pages redirect; crawled /tags/asphaltgold.
  asphaltgold: { date: '2026-11-20', complete: true, lastPage: 1, oldestYear: 2014 },
  atmos: { date: '2026-11-18', complete: true, lastPage: 45, oldestYear: 2007 },
  // Crawled /tags/aupen.
  aupen: { date: '2026-11-23', complete: true, lastPage: 1, oldestYear: 2024 },
  auralee: { date: '2026-11-25', complete: true, lastPage: 6, oldestYear: 2016 },
  awakeNy: { date: '2026-11-18', complete: true, lastPage: 18, oldestYear: 2014 },
  // No /brands/ archive; crawled /tags/bagjack.
  bagjack: { date: '2026-11-25', complete: true, lastPage: 3, oldestYear: 2007 },
  bait: { date: '2026-11-18', complete: true, lastPage: 17, oldestYear: 2012 },
  balenciaga: { date: '2026-11-25', complete: true, lastPage: 79, oldestYear: 2009 },
  bandOfOutsiders: { date: '2026-11-25', complete: true, lastPage: 11, oldestYear: 2008 },
  bape: { date: '2026-11-22', complete: true, lastPage: 221, oldestYear: 2007 },
  baracuta: { date: '2026-11-24', complete: true, lastPage: 5, oldestYear: 2008 },
  barbour: { date: '2026-11-18', complete: true },
  // /brands/ pages don't paginate; crawled /tags/barneys-new-york.
  barneysNewYork: { date: '2026-11-19', complete: true, lastPage: 7, oldestYear: 2008 },
  beams: { date: '2026-11-23', complete: true, lastPage: 61, oldestYear: 2007 },
  // Crawled /tags/beams-boy.
  beamsBoy: { date: '2026-11-24', complete: true, lastPage: 3, oldestYear: 2008 },
  // No /brands/ archive; crawled /tags/beams-future-archive.
  beamsFutureArchive: { date: '2026-11-25', complete: true, lastPage: 2, oldestYear: 2023 },
  // Crawled /tags/beams-plus.
  beamsPlus: { date: '2026-11-24', complete: true, lastPage: 9, oldestYear: 2009 },
  // /brands/ page redirects; crawled /tags/beams-t.
  beamsT: { date: '2026-11-24', complete: true, lastPage: 6, oldestYear: 2008 },
  // No /brands/ archive; crawled /tags/beautiful-people.
  beautifulPeople: { date: '2026-11-24', complete: true, lastPage: 1, oldestYear: 2012 },
  // No /brands/ archive; crawled /tags/beauty-youth, plus three related tags and /tags/monkey-time.
  beautyAndYouth: { date: '2026-11-24', complete: true, lastPage: 16, oldestYear: 2008 },
  bedwinTheHeartbreakers: { date: '2026-11-24', complete: true, lastPage: 11, oldestYear: 2008 },
  beenTrill: { date: '2026-11-19', complete: true, lastPage: 5, oldestYear: 2012 },
  // No /brands/ archive; crawled /tags/better-gift-shop.
  betterGiftShop: { date: '2026-11-26', complete: true, lastPage: 4, oldestYear: 2017 },
  // No /brands/ archive; crawled /tags/dirk-bikkembergs.
  bikkembergs: { date: '2026-11-25', complete: true, lastPage: 1, oldestYear: 2017 },
  billionaireBoysClub: { date: '2026-11-24', complete: true, lastPage: 40, oldestYear: 2009 },
  birkenstock: { date: '2026-11-19', complete: true, lastPage: 14, oldestYear: 2008 },
  // No /brands/ archive; crawled /tags/blackeyepatch.
  blackEyePatch: { date: '2026-11-24', complete: true, lastPage: 6, oldestYear: 2016 },
  // No /brands/ archive; crawled /tags/black-scale.
  blackScale: { date: '2026-11-25', complete: true, lastPage: 16, oldestYear: 2008 },
  // No /brands/ archive; crawled /tags/blackstock-weber.
  blackstockWeber: { date: '2026-11-25', complete: true, lastPage: 2, oldestYear: 2020 },
  blends: { date: '2026-11-25', complete: true, lastPage: 4, oldestYear: 2009 },
  blumarine: { date: '2026-11-19', complete: true, lastPage: 1, oldestYear: 2023 },
  bodega: { date: '2026-11-24', complete: true, lastPage: 24, oldestYear: 2007 },
  bongo: { date: '2026-11-24', complete: true, noArchive: true },
  // No /brands/ archive; crawled /tags/both, plus the brand's own collaboration pages.
  bothParis: { date: '2026-11-24', complete: true, lastPage: 1, oldestYear: 2016 },
  // /brands/ page redirects; crawled /tags/bounty-hunter.
  bountyHunter: { date: '2026-11-24', complete: true, lastPage: 10, oldestYear: 2007 },
  brainDead: { date: '2026-11-24', complete: true, lastPage: 28, oldestYear: 2015 },
  briefing: { date: '2026-11-24', complete: true, noArchive: true },
  brooks: { date: '2026-11-18', complete: true },
  // Also read the Fashion Press collab list.
  brooksBrothers: { date: '2026-11-24', complete: true, lastPage: 5, oldestYear: 2008 },
  // /brands/ pages don't paginate; crawled /tags/bstn, plus web searches.
  bstn: { date: '2026-11-19', complete: true, lastPage: 2, oldestYear: 2013 },
  burberry: { date: '2026-11-18', complete: true },
  burton: { date: '2026-11-23', complete: true, lastPage: 14, oldestYear: 2007 },
  buscemi: { date: '2026-11-24', complete: true, lastPage: 4, oldestYear: 2013 },
  // No /brands/ archive; crawled /tags/butter-goods.
  butterGoods: { date: '2026-11-26', complete: true, lastPage: 5, oldestYear: 2011 },
  // No /brands/ archive; crawled /tags/buzz-ricksons.
  buzzRicksons: { date: '2026-11-25', complete: true, lastPage: 1, oldestYear: 2017 },
  byborre: { date: '2026-11-26', complete: true, lastPage: 4, oldestYear: 2014 },
  c2h4: { date: '2026-11-25', complete: true, lastPage: 5, oldestYear: 2016 },
  // /brands/ page redirects; crawled /tags/cactus-jack.
  cactusJack: { date: '2026-11-24', complete: true, lastPage: 18, oldestYear: 2018 },
  // Crawled /tags/cactus-plant-flea-market and /tags/cpfm (3 pages).
  cactusPlantFleaMarket: { date: '2026-11-24', complete: true, lastPage: 15, oldestYear: 2016 },
  calvinKlein: { date: '2026-11-18', complete: true },
  // Crawled /tags/camp-high.
  campHigh: { date: '2026-11-24', complete: true, lastPage: 1, oldestYear: 2018 },
  canadaGoose: { date: '2026-11-18', complete: true, lastPage: 10, oldestYear: 2008 },
  // Crawled /tags/capsule; the generic tag is mostly unrelated capsule collections.
  capsule: { date: '2026-11-20', complete: true, lastPage: 4, oldestYear: 2009 },
  carhartt: { date: '2026-11-26', complete: true, lastPage: 28, oldestYear: 2007 },
  carharttWip: { date: '2026-11-24', complete: true, lastPage: 39, oldestYear: 2011 },
  carrots: { date: '2026-11-18', complete: true, lastPage: 4, oldestYear: 2015 },
  cavEmpt: { date: '2026-11-24', complete: true, lastPage: 15, oldestYear: 2014 },
  // No /brands/ archive; crawled /tags/comme-des-garcons-homme.
  cdgHomme: { date: '2026-11-25', complete: true, lastPage: 7, oldestYear: 2012 },
  // No /brands/ archive; crawled /tags/comme-des-garcons-homme-plus.
  cdgHommePlus: { date: '2026-11-24', complete: true, lastPage: 10, oldestYear: 2011 },
  // No /brands/ archive; crawled /tags/play-comme-des-garcons.
  cdgPlay: { date: '2026-11-24', complete: true, lastPage: 1, oldestYear: 2021 },
  cdgShirt: { date: '2026-11-19', complete: true, lastPage: 11, oldestYear: 2011 },
  // No /brands/ archive; crawled /tags/cecilie-bahnsen.
  cecilieBahnsen: { date: '2026-11-25', complete: true, lastPage: 5, oldestYear: 2022 },
  champion: { date: '2026-11-18', complete: true },
  // Crawled /tags/charles-keith.
  charlesKeith: { date: '2026-11-23', complete: true, lastPage: 1, oldestYear: 2021 },
  childrenOfTheDiscordance: { date: '2026-11-25', complete: true, lastPage: 2, oldestYear: 2019 },
  // Crawled /tags/christian-wijnants.
  christianWijnants: { date: '2026-11-24', complete: true, lastPage: 1, oldestYear: 2022 },
  christopherShannon: { date: '2026-11-25', complete: true, lastPage: 4, oldestYear: 2008 },
  // Crawled /tags/chrome and /tags/chrome-industries.
  chromeIndustries: { date: '2026-11-24', complete: true, lastPage: 2, oldestYear: 2008 },
  clarks: { date: '2026-11-24', complete: true, lastPage: 22, oldestYear: 2007 },
  clot: { date: '2026-11-24', complete: true, lastPage: 56, oldestYear: 2007 },
  coach: { date: '2026-11-25', complete: true, lastPage: 8, oldestYear: 2011 },
  coldCulture: { date: '2026-11-24', complete: true, noArchive: true },
  colette: { date: '2026-11-18', complete: true, lastPage: 37, oldestYear: 2007 },
  // No /brands/ archive; crawled /tags/collina-strada.
  collinaStrada: { date: '2026-11-25', complete: true, lastPage: 2, oldestYear: 2020 },
  columbia: { date: '2026-11-24', complete: true, lastPage: 6, oldestYear: 2008 },
  commeDesGarcons: { date: '2026-11-24', complete: true, lastPage: 78, oldestYear: 2007 },
  commonProjects: { date: '2026-11-18', complete: true },
  concepts: { date: '2026-11-19', complete: true, lastPage: 26, oldestYear: 2007 },
  // Pages 154+ were read through the all-caps /tags/CONVERSE/ archive (pages 152–171 and 192–198).
  converse: { date: '2026-11-19', complete: true, lastPage: 198, oldestYear: 2007 },
  // No /brands/ archive; crawled /tags/corteiz.
  corteiz: { date: '2026-11-25', complete: true, lastPage: 5, oldestYear: 2022 },
  // No /brands/ archive; crawled /tags/cote-et-ciel.
  coteEtCiel: { date: '2026-11-25', complete: true, lastPage: 2, oldestYear: 2010 },
  countyOfMilan: { date: '2026-11-25', complete: true, lastPage: 6, oldestYear: 2012 },
  cpCompany: { date: '2026-11-24', complete: true, lastPage: 10, oldestYear: 2009 },
  // Crawled /tags/craig-green.
  craigGreen: { date: '2026-11-24', complete: true, lastPage: 14, oldestYear: 2012 },
  crocs: { date: '2026-11-24', complete: true, lastPage: 34, oldestYear: 2017 },
  crooksAndCastles: { date: '2026-11-26', complete: true, lastPage: 7, oldestYear: 2007 },
  dailyPaper: { date: '2026-11-25', complete: true, lastPage: 8, oldestYear: 2012 },
  danner: { date: '2026-11-24', complete: true, lastPage: 14, oldestYear: 2007 },
  // Crawled /tags/dc-shoes and /tags/dc (9 pages).
  dcShoes: { date: '2026-11-24', complete: true, lastPage: 14, oldestYear: 2007 },
  deluxe: { date: '2026-11-26', complete: true, lastPage: 12, oldestYear: 2008 },
  denham: { date: '2026-11-25', complete: true, lastPage: 2, oldestYear: 2010 },
  // Crawled /tags/denim-tears.
  denimTears: { date: '2026-11-24', complete: true, lastPage: 13, oldestYear: 2016 },
  descente: { date: '2026-11-24', complete: true, lastPage: 3, oldestYear: 2008 },
  desigual: { date: '2026-11-24', complete: true, noArchive: true },
  // Crawled /tags/devilock and /jp/tags/devilock.
  devilock: { date: '2026-11-22', complete: true, lastPage: 5, oldestYear: 2007 },
  // Crawled /tags/diadora.
  diadora: { date: '2026-11-24', complete: true, lastPage: 19, oldestYear: 2008 },
  // No /brands/ archive; crawled /tags/diaspora-skateboards.
  diasporaSkateboards: { date: '2026-11-25', complete: true, lastPage: 2, oldestYear: 2014 },
  dickies: { date: '2026-11-24', complete: true, lastPage: 23, oldestYear: 2007 },
  // /brands/ pages don't paginate; crawled /tags/diemme, plus the brand's own collaborations list.
  diemme: { date: '2026-11-23', complete: true, lastPage: 9, oldestYear: 2009 },
  // /brands/ pages redirect; crawled /tags/dime and /tags/dime-mtl (3 pages).
  dime: { date: '2026-11-23', complete: true, lastPage: 11, oldestYear: 2014 },
  dior: { date: '2026-11-18', complete: true, lastPage: 53, oldestYear: 2008 },
  // No /brands/ archive; crawled /tags/dirk-van-saene.
  dirkVanSaene: { date: '2026-11-25', complete: true, lastPage: 1, oldestYear: 2026 },
  // No /brands/ archive; crawled /tags/district-vision.
  districtVision: { date: '2026-11-26', complete: true, lastPage: 3, oldestYear: 2019 },
  doverStreetMarket: { date: '2026-11-24', complete: true, lastPage: 54, oldestYear: 2007 },
  // No /brands/ archive; crawled /tags/drakes.
  drakes: { date: '2026-11-26', complete: true, lastPage: 2, oldestYear: 2011 },
  driesVanNoten: { date: '2026-11-25', complete: true, lastPage: 12, oldestYear: 2008 },
  drMartens: { date: '2026-11-18', complete: true, lastPage: 36, oldestYear: 2007 },
  // Crawled /tags/dsptch.
  dsptch: { date: '2026-11-24', complete: true, lastPage: 5, oldestYear: 2011 },
  dunhill: { date: '2026-11-23', complete: true, lastPage: 2, oldestYear: 2009 },
  dunst: { date: '2026-11-23', complete: true, noArchive: true },
  // /brands/ page redirects; crawled /tags/duran-lantink.
  duranLantinkLabel: { date: '2026-11-23', complete: true, lastPage: 1, oldestYear: 2019 },
  duroOlowu: { date: '2026-11-23', complete: true, noArchive: true },
  dynamite: { date: '2026-11-23', complete: true, noArchive: true },
  dzhus: { date: '2026-11-23', complete: true, noArchive: true },
  eastpak: { date: '2026-11-24', complete: true, lastPage: 15, oldestYear: 2007 },
  // /brands/ page redirects; crawled /tags/eat-dust, plus the brand's own journal.
  eatDust: { date: '2026-11-23', complete: true, lastPage: 1, oldestYear: 2015 },
  // Crawled /tags/ebbets-field-flannels, /tags/ebbets-field (2 pages) and /tags/ebbets (1 page).
  ebbetsFieldFlannels: { date: '2026-11-23', complete: true, lastPage: 6, oldestYear: 2011 },
  ecco: { date: '2026-11-26', complete: true, lastPage: 1, oldestYear: 2017 },
  eckhausLatta: { date: '2026-11-18', complete: true },
  // /brands/ page redirects; crawled /tags/ecko-unltd, /tags/ecko and /tags/marc-ecko.
  eckoUnltd: { date: '2026-11-23', complete: true, lastPage: 1, oldestYear: 2008 },
  // Crawled /tags/ecole-de-pensee.
  ecoleDePensee: { date: '2026-11-23', complete: true, lastPage: 1, oldestYear: 2017 },
  edwardGreen: { date: '2026-11-24', complete: true, noArchive: true },
  // No /brands/ archive; crawled /tags/8five2.
  eightFive2: { date: '2026-11-25', complete: true, lastPage: 3, oldestYear: 2007 },
  elevenBbs: { date: '2026-11-26', complete: true, lastPage: 5, oldestYear: 2012 },
  elisabettaFranchi: { date: '2026-11-23', complete: true, noArchive: true },
  elizabethAndJames: { date: '2026-11-23', complete: true, noArchive: true },
  // /brands/ page redirects; crawled /tags/elwood.
  elwood: { date: '2026-11-23', complete: true, lastPage: 1, oldestYear: 2008 },
  emmelRefines: { date: '2026-11-23', complete: true, noArchive: true },
  // /brands/ page redirects; crawled /tags/emmi, plus the Fashion Press collab list.
  emmi: { date: '2026-11-24', complete: true, lastPage: 1, oldestYear: 2025 },
  // No /brands/ archive; crawled /tags/emotionally-unavailable and /tags/kb-lee.
  emotionallyUnavailable: { date: '2026-11-24', complete: true, lastPage: 3, oldestYear: 2015 },
  // Crawled /tags/end-clothing.
  endClothing: { date: '2026-11-24', complete: true, lastPage: 14, oldestYear: 2008 },
  // /brands/ page redirects; crawled /tags/enfin-leve.
  enfinLeve: { date: '2026-11-23', complete: true, lastPage: 1, oldestYear: 2014 },
  engineeredGarments: { date: '2026-11-24', complete: true, lastPage: 20, oldestYear: 2008 },
  // No /brands/ archive; crawled /tags/erl.
  erl: { date: '2026-11-25', complete: true, lastPage: 6, oldestYear: 2019 },
  // /brands/ page redirects; crawled /tags/ernest-w-baker.
  ernestWBaker: { date: '2026-11-23', complete: true, lastPage: 1, oldestYear: 2023 },
  essentielAntwerp: { date: '2026-11-25', complete: true, noArchive: true },
  etnies: { date: '2026-11-24', complete: true, lastPage: 5, oldestYear: 2008 },
  // No /brands/ archive; crawled /tags/etudes.
  etudesStudio: { date: '2026-11-25', complete: true, lastPage: 5, oldestYear: 2012 },
  // No /brands/ archive; crawled /tags/everlast.
  everlast: { date: '2026-11-25', complete: true, lastPage: 2, oldestYear: 2008 },
  evisu: { date: '2026-11-25', complete: true, lastPage: 6, oldestYear: 2008 },
  extraButter: { date: '2026-11-19', complete: true, lastPage: 9, oldestYear: 2008 },
  // Crawled /tags/eye-junya-watanabe-man.
  eyeJunyaWatanabeMan: { date: '2026-11-24', complete: true, lastPage: 3, oldestYear: 2008 },
  facetasm: { date: '2026-11-24', complete: true, lastPage: 10, oldestYear: 2010 },
  faherty: { date: '2026-11-19', complete: true, noArchive: true },
  // No /brands/ archive; crawled /tags/farm-rio.
  farmRio: { date: '2026-11-26', complete: true, lastPage: 1, oldestYear: 2024 },
  // No /brands/ archive; crawled /tags/f-ce.
  fce: { date: '2026-11-25', complete: true, lastPage: 2, oldestYear: 2017 },
  // Crawled /brands/f-c-real-bristol (5 pages), /tags/fc-real-bristol (3) and /tags/fcrb (8), plus the Fashion Press collab list.
  fcRealBristol: { date: '2026-11-24', complete: true, lastPage: 8, oldestYear: 2008 },
  fearOfGod: { date: '2026-11-24', complete: true, lastPage: 36, oldestYear: 2014 },
  fendi: { date: '2026-11-25', complete: true, lastPage: 21, oldestYear: 2008 },
  fengChenWang: { date: '2026-11-24', complete: true, lastPage: 6, oldestYear: 2017 },
  fila: { date: '2026-11-18', complete: true },
  fillingPieces: { date: '2026-11-20', complete: true, lastPage: 9, oldestYear: 2011 },
  // /brands/ pages redirect; crawled /tags/fitted-hawaii and /tags/fitted.
  fittedHawaii: { date: '2026-11-23', complete: true, lastPage: 2, oldestYear: 2008 },
  // No /brands/ archive; crawled /tags/f-lagstuf-f.
  fLagstufF: { date: '2026-11-25', complete: true, lastPage: 4, oldestYear: 2016 },
  florentinaLeitnerLabel: { date: '2026-11-25', complete: true, noArchive: true },
  // Crawled /tags/footpatrol.
  footpatrol: { date: '2026-11-24', complete: true, lastPage: 8, oldestYear: 2007 },
  // /brands/ pages redirect; crawled /tags/47 and /tags/47-brand, plus the Japanese /jp/tags/47 (2 pages).
  fortySeven: { date: '2026-11-23', complete: true, lastPage: 4, oldestYear: 2015 },
  // /brands/ pages don't paginate; crawled /tags/fox-racing.
  foxRacing: { date: '2026-11-22', complete: true, lastPage: 2, oldestYear: 2018 },
  // No /brands/ archive; crawled /tags/fr2.
  fr2: { date: '2026-11-25', complete: true, lastPage: 3, oldestYear: 2015 },
  fragmentDesign: { date: '2026-11-18', complete: true },
  // Crawled /tags/frame (one page); /tags/frame-denim doesn't exist. Also read the brand's own collection list.
  frame: { date: '2026-11-23', complete: true, lastPage: 1, oldestYear: 2022 },
  fredPerry: { date: '2026-11-24', complete: true, lastPage: 15, oldestYear: 2007 },
  ftc: { date: '2026-11-20', complete: true, lastPage: 7, oldestYear: 2007 },
  ftp: { date: '2026-11-18', complete: true, lastPage: 2, oldestYear: 2014 },
  // No /brands/ archive; crawled /tags/fucking-awesome.
  fuckingAwesome: { date: '2026-11-25', complete: true, lastPage: 10, oldestYear: 2008 },
  fuct: { date: '2026-11-24', complete: true, lastPage: 11, oldestYear: 2007 },
  // No /brands/ archive; crawled /tags/gallery-dept.
  galleryDept: { date: '2026-11-25', complete: true, lastPage: 2, oldestYear: 2020 },
  // No /brands/ archive; crawled /tags/ganni.
  ganni: { date: '2026-11-26', complete: true, lastPage: 2, oldestYear: 2022 },
  // Also read the Fashion Press collab list.
  gap: { date: '2026-11-24', complete: true, lastPage: 16, oldestYear: 2007 },
  // Crawled /tags/gareth-pugh.
  garethPughLabel: { date: '2026-11-24', complete: true, lastPage: 2, oldestYear: 2009 },
  georgeCox: { date: '2026-11-18', complete: true },
  // No /brands/ archive; crawled /tags/g-h-bass.
  ghBass: { date: '2026-11-25', complete: true, lastPage: 1, oldestYear: 2020 },
  girlsDontCry: { date: '2026-11-25', complete: true, lastPage: 7, oldestYear: 2018 },
  gitmanBros: { date: '2026-11-25', complete: true, lastPage: 1, oldestYear: 2012 },
  givenchy: { date: '2026-11-20', complete: true, lastPage: 36, oldestYear: 2008 },
  gloverall: { date: '2026-11-25', complete: true, lastPage: 2, oldestYear: 2007 },
  // Crawled /tags/god-selection-xxx and /jp/tags/god-selection-xxx.
  godSelectionXxx: { date: '2026-11-22', complete: true, lastPage: 3, oldestYear: 2019 },
  // No /brands/ archive; crawled /tags/golden-bear.
  goldenBear: { date: '2026-11-25', complete: true, lastPage: 4, oldestYear: 2010 },
  // No /brands/ archive; crawled /tags/golf-le-fleur.
  golfLeFleur: { date: '2026-11-25', complete: true, lastPage: 8, oldestYear: 2017 },
  goodenough: { date: '2026-11-22', complete: true, lastPage: 5, oldestYear: 2007 },
  // /brands/ pages redirect; crawled /tags/goodhood and /tags/the-goodhood-store (3 pages).
  goodhood: { date: '2026-11-23', complete: true, lastPage: 12, oldestYear: 2008 },
  // No /brands/ archive; crawled /tags/gosha-rubchinskiy.
  goshaRubchinskiy: { date: '2026-11-24', complete: true, lastPage: 21, oldestYear: 2013 },
  gramicci: { date: '2026-11-24', complete: true, lastPage: 7, oldestYear: 2011 },
  // No /brands/ archive; crawled /tags/green-label-relaxing.
  greenLabelRelaxing: { date: '2026-11-26', complete: true, lastPage: 1, oldestYear: 2008 },
  gregory: { date: '2026-11-23', complete: true, lastPage: 2, oldestYear: 2008 },
  // No /brands/ archive; crawled /tags/ground-y.
  groundY: { date: '2026-11-26', complete: true, lastPage: 1, oldestYear: 2018 },
  // Also crawled /brands/casio (48 pages) and the G-Central collaboration tag (2015+).
  gShock: { date: '2026-11-24', complete: true, lastPage: 53, oldestYear: 2007 },
  gucci: { date: '2026-11-24', complete: true, lastPage: 86, oldestYear: 2008 },
  guess: { date: '2026-11-22', complete: true, lastPage: 7, oldestYear: 2012 },
  // /brands/ pages redirect; crawled /tags/habitat and /tags/habitat-skateboards.
  habitat: { date: '2026-11-24', complete: true, lastPage: 1, oldestYear: 2010 },
  hanes: { date: '2026-11-26', complete: true, lastPage: 2, oldestYear: 2010 },
  // No /brands/ archive; crawled /tags/hanon.
  hanon: { date: '2026-11-24', complete: true, lastPage: 8, oldestYear: 2011 },
  // Crawled /tags/harris-reed.
  harrisReedLabel: { date: '2026-11-24', complete: true, lastPage: 1, oldestYear: 2022 },
  harrisTweed: { date: '2026-11-24', complete: true, lastPage: 6, oldestYear: 2009 },
  havaianas: { date: '2026-11-24', complete: true, lastPage: 2, oldestYear: 2012 },
  haven: { date: '2026-11-24', complete: true, lastPage: 18, oldestYear: 2008 },
  // /brands/ pages redirect; crawled /tags/hbx.
  hbx: { date: '2026-11-20', complete: true, lastPage: 97, oldestYear: 2015 },
  headPorter: { date: '2026-11-24', complete: true, lastPage: 26, oldestYear: 2007 },
  hellstar: { date: '2026-11-18', complete: true, lastPage: 1, oldestYear: 2026 },
  hellyHansen: { date: '2026-11-25', complete: true, lastPage: 5, oldestYear: 2008 },
  // No /brands/ archive; crawled /tags/heron-preston.
  heronPreston: { date: '2026-11-24', complete: true, lastPage: 21, oldestYear: 2008 },
  herschelSupply: { date: '2026-11-18', complete: true },
  highsAndLows: { date: '2026-11-19', complete: true, lastPage: 3, oldestYear: 2010 },
  // Crawled /tags/hiking-patrol, plus the brand's own collection list.
  hikingPatrol: { date: '2026-11-23', complete: true, lastPage: 2, oldestYear: 2022 },
  hm: { date: '2026-11-18', complete: true, lastPage: 20, oldestYear: 2008 },
  // No /brands/ archive; crawled /tags/hobo.
  hobo: { date: '2026-11-25', complete: true, lastPage: 11, oldestYear: 2008 },
  // No /brands/ archive; crawled /tags/hoka.
  hoka: { date: '2026-11-24', complete: true, lastPage: 10, oldestYear: 2019 },
  // /brands/ pages don't paginate; crawled /tags/holzweiler (2 pages) plus the brand's own collaborations page.
  holzweiler: { date: '2026-11-19', complete: true, lastPage: 2, oldestYear: 2017 },
  // /brands/ pages redirect; crawled /tags/hombre-nino and /jp/tags/hombre-nino (2 pages).
  hombreNino: { date: '2026-11-23', complete: true, lastPage: 2, oldestYear: 2012 },
  // No /brands/ archive; crawled /tags/howlin and /tags/howlin-by-morrison.
  howlin: { date: '2026-11-25', complete: true, lastPage: 1, oldestYear: 2011 },
  huf: { date: '2026-11-24', complete: true, lastPage: 50, oldestYear: 2006 },
  // Also read the Fashion Press collab list.
  humanMade: { date: '2026-11-24', complete: true, lastPage: 33, oldestYear: 2010 },
  // No /brands/ archive; crawled /tags/hummel.
  hummel: { date: '2026-11-26', complete: true, lastPage: 3, oldestYear: 2010 },
  // No /brands/ archive; crawled /tags/hunter.
  hunter: { date: '2026-11-25', complete: true, lastPage: 1, oldestYear: 2015 },
  // Crawled /tags/huntsman.
  huntsman: { date: '2026-11-24', complete: true, lastPage: 1, oldestYear: 2023 },
  hyke: { date: '2026-11-25', complete: true, lastPage: 3, oldestYear: 2015 },
  // /brands/ pages don't paginate; crawled /tags/hysteric-glamour plus the Fashion Press collab list.
  hystericGlamour: { date: '2026-11-19', complete: true, lastPage: 9, oldestYear: 2007 },
  // No /brands/ archive; crawled /tags/icecream.
  icecream: { date: '2026-11-25', complete: true, lastPage: 7, oldestYear: 2010 },
  // /brands/ pages redirect; crawled /tags/icny.
  icny: { date: '2026-11-23', complete: true, lastPage: 4, oldestYear: 2014 },
  ifSixWasNine: { date: '2026-11-25', complete: true, noArchive: true },
  // /brands/ pages redirect; crawled /tags/illest and /tags/fatlace.
  illest: { date: '2026-11-24', complete: true, lastPage: 2, oldestYear: 2011 },
  // Also crawled /tags/in4mation (8 pages), which adds 2015–17 articles.
  in4mation: { date: '2026-11-23', complete: true, lastPage: 8, oldestYear: 2007 },
  // No /brands/ archive; crawled /tags/ines-de-la-fressange.
  inesDeLaFressange: { date: '2026-11-26', complete: true, lastPage: 1, oldestYear: 2017 },
  // Crawled /tags/invincible.
  invincible: { date: '2026-11-24', complete: true, lastPage: 10, oldestYear: 2010 },
  // No /brands/ archive; crawled /tags/izzue.
  izzue: { date: '2026-11-25', complete: true, lastPage: 2, oldestYear: 2009 },
  // Crawled /tags/jackthreads.
  jackThreads: { date: '2026-11-24', complete: true, lastPage: 1, oldestYear: 2012 },
  // No /brands/ archive; crawled /tags/jacquemus.
  jacquemus: { date: '2026-11-26', complete: true, lastPage: 14, oldestYear: 2017 },
  jamesPerse: { date: '2026-11-19', complete: true, lastPage: 1, oldestYear: 2013 },
  // No /brands/ archive; crawled /tags/jan-jan-van-essche.
  janJanVanEssche: { date: '2026-11-25', complete: true, lastPage: 1, oldestYear: 2011 },
  // No /brands/ archive; crawled /tags/jansport.
  janSport: { date: '2026-11-25', complete: true, lastPage: 4, oldestYear: 2008 },
  // Crawled /tags/j-crew.
  jCrew: { date: '2026-11-24', complete: true, lastPage: 10, oldestYear: 2008 },
  // No /brands/ archive; crawled /tags/jeremy-scott.
  jeremyScottLabel: { date: '2026-11-24', complete: true, lastPage: 22, oldestYear: 2008 },
  jilSander: { date: '2026-11-25', complete: true, lastPage: 17, oldestYear: 2008 },
  // No /brands/ archive; crawled /tags/jjjjound.
  jjjjound: { date: '2026-11-24', complete: true, lastPage: 21, oldestYear: 2016 },
  jmWeston: { date: '2026-11-26', complete: true, noArchive: true },
  // Crawled /tags/joe-boxer.
  joeBoxer: { date: '2026-11-24', complete: true, lastPage: 1, oldestYear: 2017 },
  // No /brands/ archive; crawled /tags/john-varvatos.
  johnVarvatos: { date: '2026-11-25', complete: true, lastPage: 3, oldestYear: 2008 },
  jordanBrand: { date: '2026-11-24', complete: true, lastPage: 462, oldestYear: 2007 },
  // /brands/ pages redirect; crawled /tags/journal-standard and relume, their /jp/ tags, the Fashion Press lists and BAYCREW'S PR TIMES archive (2014+).
  journalStandard: { date: '2026-11-23', complete: true, lastPage: 8, oldestYear: 2009 },
  // /brands/ pages redirect; crawled /tags/juice.
  juice: { date: '2026-11-20', complete: true, lastPage: 6, oldestYear: 2008 },
  julieKegelsLabel: { date: '2026-11-25', complete: true, noArchive: true },
  // No /brands/ archive; crawled /tags/junya-watanabe-man.
  junyaWatanabeMan: { date: '2026-11-24', complete: true, lastPage: 10, oldestYear: 2012 },
  justDon: { date: '2026-11-23', complete: true, lastPage: 7, oldestYear: 2013 },
  juunJ: { date: '2026-11-25', complete: true, lastPage: 5, oldestYear: 2010 },
  jwAnderson: { date: '2026-11-18', complete: true },
  kahala: { date: '2026-11-23', complete: true, noArchive: true },
  // Crawled /tags/kangol.
  kangol: { date: '2026-11-24', complete: true, lastPage: 8, oldestYear: 2007 },
  kanuk: { date: '2026-11-19', complete: true, lastPage: 1, oldestYear: 2021 },
  kappa: { date: '2026-11-18', complete: true, lastPage: 10, oldestYear: 2016 },
  // /brands/ page redirects; crawled /tags/kaptain-sunshine, plus the Fashion Press collab list.
  kaptainSunshine: { date: '2026-11-24', complete: true, lastPage: 3, oldestYear: 2015 },
  // No /brands/ archive; crawled /tags/karhu.
  karhu: { date: '2026-11-26', complete: true, lastPage: 8, oldestYear: 2012 },
  // Crawled /tags/kartik-research and /tags/karu-research (1 page each).
  kartikResearch: { date: '2026-11-23', complete: true, lastPage: 1, oldestYear: 2023 },
  // No /brands/ archive; crawled /tags/keds.
  keds: { date: '2026-11-26', complete: true, lastPage: 3, oldestYear: 2009 },
  // /brands/ page redirects; crawled /tags/keen, plus the Fashion Press collab list.
  keen: { date: '2026-11-24', complete: true, lastPage: 6, oldestYear: 2012 },
  kenzo: { date: '2026-11-26', complete: true, lastPage: 22, oldestYear: 2010 },
  // /brands/ pages redirect; crawled /tags/kicks-lab.
  kicksLab: { date: '2026-11-20', complete: true, lastPage: 2, oldestYear: 2008 },
  // /brands/ page redirects; crawled /tags/kiko-kostadinov.
  kikoKostadinov: { date: '2026-11-24', complete: true, lastPage: 20, oldestYear: 2015 },
  // No /brands/ archive; crawled /tags/kinetics.
  kinetics: { date: '2026-11-25', complete: true, lastPage: 4, oldestYear: 2007 },
  kipling: { date: '2026-11-25', complete: true, noArchive: true },
  // Hypebeast has almost no Kith articles from May 2021 to Apr 2024; covered by kith.com's collection index.
  kith: { date: '2026-11-24', complete: true, lastPage: 64, oldestYear: 2011 },
  // Crawled /brands/ksubi (4 pages) and the fuller /tags/ksubi.
  ksubi: { date: '2026-11-24', complete: true, lastPage: 5, oldestYear: 2008 },
  kSwiss: { date: '2026-11-26', complete: true, lastPage: 6, oldestYear: 2008 },
  kWay: { date: '2026-11-24', complete: true, lastPage: 3, oldestYear: 2008 },
  laCollection: { date: '2026-11-25', complete: true, noArchive: true },
  lacoste: { date: '2026-11-19', complete: true, lastPage: 25, oldestYear: 2007 },
  // Crawled /tags/laformela.
  laformela: { date: '2026-11-24', complete: true, lastPage: 1, oldestYear: 2018 },
  // Crawled /tags/lane-crawford.
  laneCrawford: { date: '2026-11-24', complete: true, lastPage: 4, oldestYear: 2008 },
  // No /brands/ archive; crawled /tags/lanvin.
  lanvin: { date: '2026-11-26', complete: true, lastPage: 20, oldestYear: 2008 },
  // No /brands/ archive; crawled /tags/le-coq-sportif.
  leCoqSportif: { date: '2026-11-24', complete: true, lastPage: 7, oldestYear: 2010 },
  // Crawled /tags/lee.
  lee: { date: '2026-11-24', complete: true, lastPage: 7, oldestYear: 2008 },
  levis: { date: '2026-11-19', complete: true, lastPage: 79, oldestYear: 2007 },
  lgb: { date: '2026-11-25', complete: true, noArchive: true },
  // No /brands/ archive; crawled /tags/liberty and /tags/liberty-london (2 pages).
  libertyLondon: { date: '2026-11-24', complete: true, lastPage: 5, oldestYear: 2008 },
  // No /brands/ archive; crawled /tags/limi-feu.
  limiFeu: { date: '2026-11-26', complete: true, lastPage: 1, oldestYear: 2020 },
  littleTokyoTableTennis: { date: '2026-11-18', complete: true, lastPage: 1, oldestYear: 2022 },
  londonFog: { date: '2026-11-24', complete: true, noArchive: true },
  loopwheeler: { date: '2026-11-22', complete: true, lastPage: 6, oldestYear: 2008 },
  louisVuitton: { date: '2026-11-26', complete: true, lastPage: 129, oldestYear: 2008 },
  // No /brands/ archive; crawled /tags/ludovic-de-saint-sernin.
  ludovicDeSaintSerninLabel: { date: '2026-11-25', complete: true, lastPage: 2, oldestYear: 2018 },
  // Crawled /tags/lyle-scott and /tags/lyle-and-scott (1 page).
  lyleScott: { date: '2026-11-24', complete: true, lastPage: 2, oldestYear: 2013 },
  // /brands/ pages redirect; crawled /tags/maap.
  maap: { date: '2026-11-23', complete: true, lastPage: 2, oldestYear: 2021 },
  madewell: { date: '2026-11-25', complete: true, noArchive: true },
  // No /brands/ archive; crawled /tags/madhappy.
  madhappy: { date: '2026-11-24', complete: true, lastPage: 4, oldestYear: 2017 },
  // No /brands/ archive; crawled /tags/madness.
  madness: { date: '2026-11-24', complete: true, lastPage: 7, oldestYear: 2014 },
  // Crawled /tags/magic-stick and /jp/tags/magic-stick.
  magicStick: { date: '2026-11-22', complete: true, lastPage: 5, oldestYear: 2010 },
  maharishi: { date: '2026-11-25', complete: true, lastPage: 24, oldestYear: 2007 },
  // Also crawled /tags/kitsune (10 pages), plus the Fashion Press collab list.
  maisonKitsune: { date: '2026-11-24', complete: true, lastPage: 11, oldestYear: 2008 },
  maisonMargiela: { date: '2026-11-24', complete: true, lastPage: 38, oldestYear: 2015 },
  // Crawled /tags/maison-mihara-yasuhiro, /tags/mihara-yasuhiro and /tags/mihara, plus the Fashion Press collab list.
  maisonMiharaYasuhiro: { date: '2026-11-24', complete: true, lastPage: 6, oldestYear: 2008 },
  // No /brands/ archive; crawled /tags/marina-yee.
  marinaYeeLabel: { date: '2026-11-25', complete: true, lastPage: 1, oldestYear: 2018 },
  marineSerre: { date: '2026-11-26', complete: true, lastPage: 6, oldestYear: 2017 },
  // No /brands/ archive; crawled /tags/mark-mcnairy.
  markMcNairy: { date: '2026-11-26', complete: true, lastPage: 18, oldestYear: 2009 },
  // Also read the Fashion Press collab list.
  marni: { date: '2026-11-24', complete: true, lastPage: 12, oldestYear: 2010 },
  martineRose: { date: '2026-11-24', complete: true, lastPage: 16, oldestYear: 2010 },
  mastermindJapan: { date: '2026-11-24', complete: true, lastPage: 40, oldestYear: 2007 },
  // Also crawled /tags/mastermind-japan (41 pages), plus the Fashion Press collab list.
  mastermindWorld: { date: '2026-11-24', complete: true, lastPage: 5, oldestYear: 2017 },
  // No /brands/ archive; crawled /tags/master-piece.
  masterPiece: { date: '2026-11-24', complete: true, lastPage: 10, oldestYear: 2009 },
  // No /brands/ archive; crawled /tags/masu.
  masu: { date: '2026-11-25', complete: true, lastPage: 1, oldestYear: 2017 },
  // /brands/ pages don't paginate; crawled /tags/matchesfashion.
  matchesFashion: { date: '2026-11-19', complete: true, lastPage: 10, oldestYear: 2015 },
  // No /brands/ archive; crawled /tags/matin-kim.
  matinKim: { date: '2026-11-25', complete: true, lastPage: 1, oldestYear: 2023 },
  // /brands/ pages redirect; crawled /tags/maui-jim.
  mauiJim: { date: '2026-11-23', complete: true, lastPage: 1, oldestYear: 2024 },
  // No /brands/ archive; crawled /tags/meanswhile.
  meanswhile: { date: '2026-11-24', complete: true, lastPage: 4, oldestYear: 2014 },
  medicomToy: { date: '2026-11-25', complete: true, lastPage: 98, oldestYear: 2007 },
  // /brands/ pages redirect; crawled /tags/merrell and /tags/merrell-1trl (4 pages).
  merrell: { date: '2026-11-23', complete: true, lastPage: 8, oldestYear: 2010 },
  // No /brands/ archive; crawled /tags/midnight-studios.
  midnightStudios: { date: '2026-11-26', complete: true, lastPage: 9, oldestYear: 2014 },
  minaPerhonen: { date: '2026-11-26', complete: true, noArchive: true },
  // No /brands/ archive; crawled /tags/minedenim.
  minedenim: { date: '2026-11-24', complete: true, lastPage: 1, oldestYear: 2017 },
  mintdesigns: { date: '2026-11-26', complete: true, noArchive: true },
  // Crawled /tags/mishka and /tags/mishka-nyc.
  mishka: { date: '2026-11-24', complete: true, lastPage: 15, oldestYear: 2007 },
  missoni: { date: '2026-11-25', complete: true, lastPage: 8, oldestYear: 2009 },
  mitaSneakers: { date: '2026-11-18', complete: true, lastPage: 15, oldestYear: 2007 },
  // Crawled /tags/mitchell-ness and /tags/mitchell-and-ness (2 pages).
  mitchellAndNess: { date: '2026-11-23', complete: true, lastPage: 13, oldestYear: 2007 },
  // No /brands/ archive; crawled /tags/miyagihidetaka.
  miyagihidetaka: { date: '2026-11-25', complete: true, lastPage: 2, oldestYear: 2020 },
  mizuno: { date: '2026-11-24', complete: true, lastPage: 17, oldestYear: 2008 },
  // No /brands/ archive; crawled /tags/mm6-maison-margiela.
  mm6: { date: '2026-11-25', complete: true, lastPage: 7, oldestYear: 2016 },
  moncler: { date: '2026-11-18', complete: true, lastPage: 38, oldestYear: 2008 },
  monkeyTime: { date: '2026-11-24', complete: true, lastPage: 8, oldestYear: 2009 },
  // No /brands/ archive; crawled /tags/mountain-hardwear.
  mountainHardwear: { date: '2026-11-26', complete: true, lastPage: 1, oldestYear: 2015 },
  // No /brands/ archive; crawled /tags/mountain-research.
  mountainResearch: { date: '2026-11-26', complete: true, lastPage: 5, oldestYear: 2009 },
  // No /brands/ archive; crawled /tags/mr-porter.
  mrPorter: { date: '2026-11-25', complete: true, lastPage: 15, oldestYear: 2010 },
  mulberry: { date: '2026-11-26', complete: true, lastPage: 1, oldestYear: 2009 },
  // Crawled /tags/namacheko.
  namacheko: { date: '2026-11-24', complete: true, lastPage: 2, oldestYear: 2017 },
  // Also read the Fashion Press collab list.
  nanamica: { date: '2026-11-24', complete: true, lastPage: 16, oldestYear: 2008 },
  nanga: { date: '2026-11-18', complete: true, lastPage: 5, oldestYear: 2016 },
  needles: { date: '2026-11-18', complete: true, lastPage: 29, oldestYear: 2009 },
  neighborhood: { date: '2026-11-24', complete: true, lastPage: 94, oldestYear: 2007 },
  nepenthes: { date: '2026-11-26', complete: true, lastPage: 13, oldestYear: 2008 },
  // Pages 212+ were read through the all-caps /tags/NEW-BALANCE/ archive (pages 205–344).
  newBalance: { date: '2026-11-19', complete: true, lastPage: 344, oldestYear: 2007 },
  // Also crawled the Japanese /jp/tags/new-era (25 pages) and the Fashion Press collab list.
  newEra: { date: '2026-11-23', complete: true, lastPage: 82, oldestYear: 2007 },
  nexusVII: { date: '2026-11-18', complete: true, lastPage: 10, oldestYear: 2010 },
  nHoolywood: { date: '2026-11-24', complete: true, lastPage: 14, oldestYear: 2008 },
  // No /brands/ archive; crawled /tags/nicholas-daley.
  nicholasDaley: { date: '2026-11-26', complete: true, lastPage: 5, oldestYear: 2016 },
  // /brands/ and /tags/ archives are capped at page 833 (Mar 2019); 1999–Mar 2019 covered by web searches only.
  nike: { date: '2026-11-22', complete: true, lastPage: 833, oldestYear: 2019 },
  nikeAcg: { date: '2026-11-22', complete: true, lastPage: 29, oldestYear: 2008 },
  noah: { date: '2026-11-18', complete: true, lastPage: 23, oldestYear: 2015 },
  // No /brands/ archive; crawled /tags/noir-kei-ninomiya.
  noirKeiNinomiya: { date: '2026-11-25', complete: true, lastPage: 1, oldestYear: 2018 },
  // No /brands/ archive; crawled /tags/nomarhythm-textile.
  nomarhythmTextile: { date: '2026-11-25', complete: true, lastPage: 2, oldestYear: 2025 },
  nonnative: { date: '2026-11-18', complete: true, lastPage: 28, oldestYear: 2007 },
  // No /brands/ archive; crawled /tags/norse-projects.
  norseProjects: { date: '2026-11-24', complete: true, lastPage: 15, oldestYear: 2009 },
  // /brands/ pages don't paginate; crawled /tags/notre.
  notre: { date: '2026-11-19', complete: true, lastPage: 4, oldestYear: 2015 },
  // Crawled /tags/nude-project.
  nudeProject: { date: '2026-11-24', complete: true, lastPage: 1, oldestYear: 2025 },
  nudieJeans: { date: '2026-11-22', complete: true, lastPage: 3, oldestYear: 2010 },
  numberNine: { date: '2026-11-24', complete: true, lastPage: 8, oldestYear: 2007 },
  oakley: { date: '2026-11-24', complete: true, lastPage: 29, oldestYear: 2007 },
  oamc: { date: '2026-11-25', complete: true, lastPage: 14, oldestYear: 2014 },
  oddFuture: { date: '2026-11-24', complete: true, lastPage: 30, oldestYear: 2011 },
  offWhite: { date: '2026-11-24', complete: true, lastPage: 120, oldestYear: 2013 },
  // No /brands/ archive; crawled /tags/oliver-peoples.
  oliverPeoples: { date: '2026-11-26', complete: true, lastPage: 5, oldestYear: 2008 },
  // Crawled /tags/oliver-spencer.
  oliverSpencerLabel: { date: '2026-11-24', complete: true, lastPage: 3, oldestYear: 2009 },
  onitsukaTiger: { date: '2026-11-18', complete: true },
  // No /brands/ archive; crawled /tags/online-ceramics.
  onlineCeramics: { date: '2026-11-25', complete: true, lastPage: 3, oldestYear: 2018 },
  onlyNy: { date: '2026-11-22', complete: true, lastPage: 6, oldestYear: 2008 },
  onRunning: { date: '2026-11-18', complete: true },
  openingCeremony: { date: '2026-11-18', complete: true, lastPage: 32, oldestYear: 2008 },
  // No /brands/ archive; crawled /tags/originalfake.
  originalFake: { date: '2026-11-24', complete: true, lastPage: 33, oldestYear: 2007 },
  osiris: { date: '2026-11-22', complete: true, lastPage: 1, oldestYear: 2009 },
  ourLegacy: { date: '2026-11-18', complete: true, lastPage: 16, oldestYear: 2009 },
  // No /brands/ archive; crawled /tags/our-legacy-work-shop.
  ourLegacyWorkShop: { date: '2026-11-25', complete: true, lastPage: 6, oldestYear: 2018 },
  // No /brands/ archive; crawled /tags/outdoor-products.
  outdoorProducts: { date: '2026-11-24', complete: true, lastPage: 1, oldestYear: 2012 },
  ovo: { date: '2026-11-22', complete: true, lastPage: 35, oldestYear: 2010 },
  packer: { date: '2026-11-19', complete: true, lastPage: 10, oldestYear: 2011 },
  // /brands/ pages don't paginate; crawled /tags/palace-skateboards to page 56 (Jun 2018), then the all-caps /tags/PALACE/ archive pages 75–101.
  palace: { date: '2026-11-19', complete: true, lastPage: 101, oldestYear: 2010 },
  palladium: { date: '2026-11-18', complete: true, lastPage: 7, oldestYear: 2009 },
  palmAngels: { date: '2026-11-24', complete: true, lastPage: 13, oldestYear: 2014 },
  // Crawled /tags/paper-planes.
  paperPlanes: { date: '2026-11-24', complete: true, lastPage: 1, oldestYear: 2010 },
  // No /brands/ archive; crawled /tags/paraboot.
  paraboot: { date: '2026-11-24', complete: true, lastPage: 3, oldestYear: 2008 },
  pariaFarzanehLabel: { date: '2026-11-18', complete: true, lastPage: 3, oldestYear: 2017 },
  parra: { date: '2026-11-26', complete: true, lastPage: 17, oldestYear: 2007 },
  // No /brands/ archive; crawled /tags/pas-normal-studios.
  pasNormalStudios: { date: '2026-11-26', complete: true, lastPage: 3, oldestYear: 2020 },
  patagonia: { date: '2026-11-22', complete: true, lastPage: 7, oldestYear: 2009 },
  patta: { date: '2026-11-24', complete: true, lastPage: 38, oldestYear: 2008 },
  paulSmith: { date: '2026-11-18', complete: true },
  paynterJacketCo: { date: '2026-11-25', complete: true, noArchive: true },
  // No /brands/ archive; crawled /tags/peaceminusone.
  peaceminusone: { date: '2026-11-25', complete: true, lastPage: 8, oldestYear: 2016 },
  // Crawled /tags/p-e-nation.
  peNation: { date: '2026-11-24', complete: true, lastPage: 1, oldestYear: 2018 },
  pendleton: { date: '2026-11-24', complete: true, lastPage: 14, oldestYear: 2007 },
  penfield: { date: '2026-11-26', complete: true, lastPage: 7, oldestYear: 2007 },
  // No /brands/ archive; crawled /tags/pam.
  perksAndMini: { date: '2026-11-24', complete: true, lastPage: 6, oldestYear: 2007 },
  perryEllis: { date: '2026-11-18', complete: true },
  // /brands/ page redirects; crawled /tags/petit-bateau, plus the Fashion Press collab list.
  petitBateau: { date: '2026-11-24', complete: true, lastPage: 1, oldestYear: 2009 },
  // Crawled /tags/pf-flyers and /tags/p-f-flyers (1 page), plus the brand's own collection list.
  pfFlyers: { date: '2026-11-23', complete: true, lastPage: 9, oldestYear: 2007 },
  // No /brands/ archive; crawled /tags/phenomenon.
  phenomenon: { date: '2026-11-24', complete: true, lastPage: 7, oldestYear: 2008 },
  // No /brands/ archive; crawled /tags/pilgrim-surf-supply.
  pilgrimSurfSupply: { date: '2026-11-26', complete: true, lastPage: 1, oldestYear: 2014 },
  placesPlusFaces: { date: '2026-11-18', complete: true, lastPage: 2, oldestYear: 2015 },
  // Crawled /tags/pleasures.
  pleasures: { date: '2026-11-23', complete: true, lastPage: 23, oldestYear: 2015 },
  pointerBrand: { date: '2026-11-25', complete: true, noArchive: true },
  pointerFootwear: { date: '2026-11-25', complete: true, lastPage: 8, oldestYear: 2008 },
  // /brands/ pages don't paginate; crawled /tags/polar-skate-co.
  polarSkateCo: { date: '2026-11-20', complete: true, lastPage: 2, oldestYear: 2014 },
  poloRalphLauren: { date: '2026-11-22', complete: true },
  pony: { date: '2026-11-24', complete: true, lastPage: 5, oldestYear: 2007 },
  popTradingCompany: { date: '2026-11-18', complete: true },
  porterYoshida: { date: '2026-11-17', complete: true },
  prada: { date: '2026-11-26', complete: true, lastPage: 46, oldestYear: 2008 },
  primitive: { date: '2026-11-26', complete: true, lastPage: 7, oldestYear: 2008 },
  // No /brands/ archive; crawled /tags/pro-keds.
  proKeds: { date: '2026-11-24', complete: true, lastPage: 7, oldestYear: 2008 },
  // /brands/ pages redirect; crawled /tags/proleta-re-art and /jp/tags/proleta-re-art.
  proletaReArt: { date: '2026-11-23', complete: true, lastPage: 1, oldestYear: 2022 },
  publicSchool: { date: '2026-11-25', complete: true, lastPage: 13, oldestYear: 2008 },
  // Pages 171-175 were read through the uppercase /tags/PUMA/ archive (pages 171-178).
  puma: { date: '2026-11-18', complete: true, lastPage: 178, oldestYear: 2007 },
  pyerMoss: { date: '2026-11-25', complete: true, lastPage: 7, oldestYear: 2014 },
  rafSimonsLabel: { date: '2026-11-24', complete: true, lastPage: 60, oldestYear: 2007 },
  rains: { date: '2026-11-26', complete: true, lastPage: 5, oldestYear: 2013 },
  raisedByWolves: { date: '2026-11-26', complete: true, lastPage: 4, oldestYear: 2008 },
  ralphLauren: { date: '2026-11-22', complete: true },
  randomIdentities: { date: '2026-11-19', complete: true, lastPage: 2, oldestYear: 2019 },
  // /brands/ page redirects; crawled /tags/ray-beams, plus the Fashion Press collab list.
  rayBeams: { date: '2026-11-24', complete: true, lastPage: 1, oldestYear: 2018 },
  // No /brands/ archive; crawled /tags/realtree.
  realtree: { date: '2026-11-24', complete: true, lastPage: 3, oldestYear: 2009 },
  // Crawled /tags/rebel8.
  rebel8: { date: '2026-11-24', complete: true, lastPage: 5, oldestYear: 2008 },
  // No /brands/ archive; crawled /tags/red-wing.
  redWing: { date: '2026-11-24', complete: true, lastPage: 9, oldestYear: 2007 },
  // Pages 171+ were read through the uppercase /tags/Reebok/ archive (pages 171-195).
  reebok: { date: '2026-11-18', complete: true, lastPage: 195, oldestYear: 2007 },
  // No /brands/ archive; crawled /tags/regal-shoe-co.
  regalShoeCo: { date: '2026-11-25', complete: true, lastPage: 1, oldestYear: 2025 },
  reigningChamp: { date: '2026-11-24', complete: true, lastPage: 15, oldestYear: 2007 },
  repetto: { date: '2026-11-19', complete: true, noArchive: true },
  // No /brands/ archive; crawled /tags/retrosuperfuture.
  retrosuperfuture: { date: '2026-11-25', complete: true, lastPage: 5, oldestYear: 2011 },
  // /brands/ pages redirect; crawled /tags/reyn-spooner.
  reynSpooner: { date: '2026-11-23', complete: true, lastPage: 1, oldestYear: 2010 },
  // /brands/ page redirects; crawled /tags/rick-owens, /tags/drkshdw and /tags/rick-owens-drkshdw, plus the Fashion Press collab list.
  rickOwens: { date: '2026-11-24', complete: true, lastPage: 44, oldestYear: 2009 },
  rimowa: { date: '2026-11-19', complete: true, lastPage: 20, oldestYear: 2008 },
  // No /brands/ archive; crawled /tags/robert-geller.
  robertGellerLabel: { date: '2026-11-26', complete: true, lastPage: 6, oldestYear: 2008 },
  rocawear: { date: '2026-11-24', complete: true, lastPage: 1, oldestYear: 2012 },
  // No /brands/ archive; crawled /tags/rodarte.
  rodarte: { date: '2026-11-25', complete: true, lastPage: 1, oldestYear: 2009 },
  roots: { date: '2026-11-18', complete: true },
  rothco: { date: '2026-11-18', complete: true, lastPage: 1, oldestYear: 2012 },
  // No /brands/ archive; crawled /tags/rowing-blazers.
  rowingBlazers: { date: '2026-11-25', complete: true, lastPage: 6, oldestYear: 2018 },
  // /brands/ pages redirect; crawled /tags/rsvp-gallery.
  rsvpGallery: { date: '2026-11-20', complete: true, lastPage: 8, oldestYear: 2009 },
  // No /brands/ archive; crawled /tags/russell-athletic.
  russellAthletic: { date: '2026-11-26', complete: true, lastPage: 2, oldestYear: 2015 },
  sacai: { date: '2026-11-24', complete: true, lastPage: 42, oldestYear: 2010 },
  saintAlfred: { date: '2026-11-19', complete: true, lastPage: 4, oldestYear: 2007 },
  saintLaurent: { date: '2026-11-26', complete: true, lastPage: 35, oldestYear: 2008 },
  // No /brands/ archive; crawled /tags/saint-michael.
  saintMichael: { date: '2026-11-24', complete: true, lastPage: 4, oldestYear: 2020 },
  saintwoods: { date: '2026-11-19', complete: true, lastPage: 3, oldestYear: 2016 },
  salomon: { date: '2026-11-24', complete: true, lastPage: 40, oldestYear: 2012 },
  // No /brands/ archive; crawled /tags/samsonite, plus the Fashion Press collab list.
  samsonite: { date: '2026-11-24', complete: true, lastPage: 1, oldestYear: 2008 },
  // No /brands/ archive; crawled /tags/sandy-liang.
  sandyLiang: { date: '2026-11-26', complete: true, lastPage: 2, oldestYear: 2020 },
  // Crawled /tags/santa-cruz and /jp/tags/santa-cruz.
  santaCruzSkateboards: { date: '2026-11-22', complete: true, lastPage: 3, oldestYear: 2008 },
  // Crawled /tags/saturdays-nyc, /tags/saturdays-surf-nyc (4 pages) and /tags/saturdays-surf (1 page), plus the Fashion Press collab list.
  saturdaysNyc: { date: '2026-11-24', complete: true, lastPage: 8, oldestYear: 2010 },
  saucony: { date: '2026-11-18', complete: true },
  // Crawled /tags/schott.
  schott: { date: '2026-11-24', complete: true, lastPage: 7, oldestYear: 2008 },
  seanJohn: { date: '2026-11-24', complete: true, lastPage: 1, oldestYear: 2016 },
  // No /brands/ archive; crawled /tags/sebago.
  sebago: { date: '2026-11-25', complete: true, lastPage: 7, oldestYear: 2008 },
  // No /brands/ archive; crawled /tags/shinyakozuka and /tags/shinya-kozuka.
  shinyakozuka: { date: '2026-11-24', complete: true, lastPage: 1, oldestYear: 2015 },
  sixEightSix: { date: '2026-11-25', complete: true, lastPage: 4, oldestYear: 2007 },
  // No /brands/ archive; crawled /tags/size.
  sizeShop: { date: '2026-11-24', complete: true, lastPage: 30, oldestYear: 2008 },
  // No /brands/ archive; crawled /tags/skims.
  skims: { date: '2026-11-25', complete: true, lastPage: 8, oldestYear: 2019 },
  // No /brands/ archive; crawled /tags/sky-high-farm.
  skyHighFarmGoods: { date: '2026-11-24', complete: true, lastPage: 2, oldestYear: 2020 },
  // No /brands/ archive; crawled /tags/slam-jam.
  slamJam: { date: '2026-11-24', complete: true, lastPage: 20, oldestYear: 2008 },
  sneakerFreaker: { date: '2026-11-19', complete: true, lastPage: 9, oldestYear: 2008 },
  sneakersnstuff: { date: '2026-11-19', complete: true, lastPage: 14, oldestYear: 2009 },
  // No /brands/ archive; crawled /tags/snidel and the Fashion Press collab list.
  snidel: { date: '2026-11-24', complete: true, lastPage: 1, oldestYear: 2015 },
  // Also read the Fashion Press collab list.
  snowPeak: { date: '2026-11-24', complete: true, lastPage: 13, oldestYear: 2012 },
  // /brands/ pages don't paginate; crawled /tags/social-status.
  socialStatus: { date: '2026-11-19', complete: true, lastPage: 8, oldestYear: 2012 },
  // Crawled /tags/solebox.
  solebox: { date: '2026-11-24', complete: true, lastPage: 12, oldestYear: 2007 },
  solovair: { date: '2026-11-18', complete: true },
  // Crawled /brands/song-for-the-mute (4 pages) and the fuller /tags/song-for-the-mute.
  songForTheMute: { date: '2026-11-24', complete: true, lastPage: 5, oldestYear: 2009 },
  // No /brands/ archive; crawled /tags/sophnet.
  sophnet: { date: '2026-11-24', complete: true, lastPage: 53, oldestYear: 2007 },
  // No /brands/ archive; crawled /tags/sorel.
  sorel: { date: '2026-11-25', complete: true, lastPage: 2, oldestYear: 2008 },
  south2West8: { date: '2026-11-24', complete: true, lastPage: 5, oldestYear: 2013 },
  sperry: { date: '2026-11-22', complete: true, lastPage: 7, oldestYear: 2008 },
  spitfire: { date: '2026-11-25', complete: true, lastPage: 3, oldestYear: 2010 },
  // Crawled /tags/s-r-studio-la-ca and /tags/sterling-ruby.
  srStudio: { date: '2026-11-24', complete: true, lastPage: 5, oldestYear: 2014 },
  // Read through the /tags/ssense/ archive (/brands/ssense/page/N repeats page 1).
  ssense: { date: '2026-11-19', complete: true, lastPage: 45, oldestYear: 2012 },
  ssur: { date: '2026-11-25', complete: true, lastPage: 7, oldestYear: 2007 },
  // No /brands/ archive; crawled /tags/ssz.
  ssz: { date: '2026-11-25', complete: true, lastPage: 1, oldestYear: 2018 },
  staple: { date: '2026-11-18', complete: true, lastPage: 16, oldestYear: 2007 },
  stellaMcCartney: { date: '2026-11-18', complete: true, lastPage: 5, oldestYear: 2011 },
  // Crawled /tags/stephan-schneider.
  stephanSchneider: { date: '2026-11-24', complete: true, lastPage: 1, oldestYear: 2009 },
  // Crawled /tags/stepney-workers-club, plus the brand's own blog.
  stepneyWorkersClub: { date: '2026-11-23', complete: true, lastPage: 2, oldestYear: 2018 },
  stoneIsland: { date: '2026-11-18', complete: true, lastPage: 49, oldestYear: 2008 },
  // No /brands/ archive; crawled /tags/stray-rats.
  strayRats: { date: '2026-11-25', complete: true, lastPage: 5, oldestYear: 2011 },
  // /brands/ page redirects; crawled /tags/studio-seven and /jp/tags/studio-seven (2 pages each) and /tags/seven, plus the Fashion Press collab list and the brand's own news (2021+).
  studioSeven: { date: '2026-11-24', complete: true, lastPage: 2, oldestYear: 2016 },
  // Pages 89+ were read through the all-caps /tags/STUSSY/ archive (pages 98–173).
  stussy: { date: '2026-11-19', complete: true, lastPage: 173, oldestYear: 2007 },
  stutterheim: { date: '2026-11-25', complete: true, lastPage: 2, oldestYear: 2011 },
  subu: { date: '2026-11-18', complete: true, lastPage: 2, oldestYear: 2020 },
  // /brands/ pages redirect; crawled /tags/sugarhill.
  sugarhill: { date: '2026-11-23', complete: true, lastPage: 1, oldestYear: 2019 },
  suicoke: { date: '2026-11-24', complete: true, lastPage: 22, oldestYear: 2014 },
  supreme: { date: '2026-11-19', complete: true, lastPage: 199, oldestYear: 2007 },
  suspiciousAntwerp: { date: '2026-11-25', complete: true, noArchive: true },
  swarovski: { date: '2026-11-24', complete: true, lastPage: 11, oldestYear: 2007 },
  sweatyBetty: { date: '2026-11-24', complete: true, noArchive: true },
  syte: { date: '2026-11-20', complete: true, lastPage: 2, oldestYear: 2012 },
  // No /brands/ archive; crawled /tags/tailor-toyo.
  tailorToyo: { date: '2026-11-25', complete: true, lastPage: 1, oldestYear: 2016 },
  // No /brands/ archive; crawled /tags/taion.
  taion: { date: '2026-11-26', complete: true, lastPage: 1, oldestYear: 2020 },
  tannerGoods: { date: '2026-11-26', complete: true, lastPage: 5, oldestYear: 2010 },
  // Crawled /tags/tellason.
  tellason: { date: '2026-11-24', complete: true, lastPage: 1, oldestYear: 2012 },
  tenCorsoComo: { date: '2026-11-19', complete: true, lastPage: 4, oldestYear: 2008 },
  tenDeep: { date: '2026-11-18', complete: true, lastPage: 10, oldestYear: 2011 },
  teva: { date: '2026-11-24', complete: true, lastPage: 4, oldestYear: 2012 },
  thebeMagugu: { date: '2026-11-18', complete: true, lastPage: 1, oldestYear: 2019 },
  // /brands/ pages don't paginate; crawled /tags/the-broken-arm.
  theBrokenArm: { date: '2026-11-20', complete: true, lastPage: 3, oldestYear: 2014 },
  // Pages 28+ were read through the all-caps /tags/THE-HUNDREDS/ archive (pages 32–49).
  theHundreds: { date: '2026-11-19', complete: true, lastPage: 49, oldestYear: 2007 },
  theNorthFace: { date: '2026-11-18', complete: true },
  theNorthFacePurpleLabel: { date: '2026-11-24', complete: true, lastPage: 11, oldestYear: 2010 },
  // Crawled /tags/takahiromiyashitathesoloist, /tags/takahiromiyashita-the-soloist (3 pages) and /tags/the-soloist (1 page).
  theSoloist: { date: '2026-11-24', complete: true, lastPage: 5, oldestYear: 2012 },
  // No /brands/ archive; crawled /tags/032c.
  thirtyTwoC: { date: '2026-11-25', complete: true, lastPage: 11, oldestYear: 2011 },
  thisisneverthat: { date: '2026-11-24', complete: true, lastPage: 12, oldestYear: 2013 },
  thomBrowne: { date: '2026-11-25', complete: true, lastPage: 29, oldestYear: 2008 },
  thrasher: { date: '2026-11-24', complete: true, lastPage: 12, oldestYear: 2008 },
  // No /brands/ archive; crawled /tags/thug-club.
  thugClub: { date: '2026-11-25', complete: true, lastPage: 3, oldestYear: 2022 },
  tiffanyAndCo: { date: '2026-11-25', complete: true, lastPage: 13, oldestYear: 2009 },
  // Crawled /tags/tilley.
  tilley: { date: '2026-11-24', complete: true, lastPage: 1, oldestYear: 2020 },
  timberland: { date: '2026-11-18', complete: true, lastPage: 42, oldestYear: 2007 },
  timex: { date: '2026-11-25', complete: true, lastPage: 15, oldestYear: 2008 },
  // /brands/ page redirects; crawled /tags/todd-snyder.
  toddSnyder: { date: '2026-11-24', complete: true, lastPage: 8, oldestYear: 2012 },
  // No /brands/ archive; crawled /tags/toga.
  toga: { date: '2026-11-24', complete: true, lastPage: 3, oldestYear: 2009 },
  tommyBahama: { date: '2026-11-23', complete: true, noArchive: true },
  tommyHilfiger: { date: '2026-11-18', complete: true },
  tommyJeans: { date: '2026-11-25', complete: true, lastPage: 2, oldestYear: 2017 },
  // No /brands/ archive; crawled /tags/tomorrowland (mostly the music festival).
  tomorrowland: { date: '2026-11-25', complete: true, lastPage: 3, oldestYear: 2010 },
  // Crawled /tags/tom-sachs.
  tomSachsStudio: { date: '2026-11-20', complete: true, lastPage: 17, oldestYear: 2008 },
  // No /brands/ archive; crawled /tags/topologie.
  topologie: { date: '2026-11-26', complete: true, lastPage: 1, oldestYear: 2024 },
  toriRichard: { date: '2026-11-23', complete: true, noArchive: true },
  // /brands/ pages don't paginate; crawled /tags/tres-bien.
  tresBien: { date: '2026-11-19', complete: true, lastPage: 8, oldestYear: 2010 },
  trickers: { date: '2026-11-19', complete: true, lastPage: 10, oldestYear: 2008 },
  // No /brands/ archive; crawled /tags/tripster.
  tripster: { date: '2026-11-24', complete: true, lastPage: 1, oldestYear: 2010 },
  // No /brands/ archive; crawled /tags/tsumori-chisato.
  tsumoriChisato: { date: '2026-11-26', complete: true, lastPage: 1, oldestYear: 2008 },
  // No /brands/ archive; crawled /tags/tumi.
  tumi: { date: '2026-11-25', complete: true, lastPage: 7, oldestYear: 2009 },
  // Crawled /tags/24karats.
  twentyFourKarats: { date: '2026-11-24', complete: true, lastPage: 1, oldestYear: 2012 },
  // No /brands/ archive; crawled /tags/24-kilates.
  twentyFourKilates: { date: '2026-11-25', complete: true, lastPage: 4, oldestYear: 2007 },
  // Crawled /tags/ubiq, which mixes the Philadelphia shop with the Japanese footwear label UBIQ.
  ubiq: { date: '2026-11-24', complete: true, lastPage: 11, oldestYear: 2007 },
  ugg: { date: '2026-11-18', complete: true, lastPage: 12, oldestYear: 2008 },
  umbro: { date: '2026-11-18', complete: true, lastPage: 13, oldestYear: 2007 },
  undefeated: { date: '2026-11-18', complete: true, lastPage: 66, oldestYear: 2007 },
  underArmour: { date: '2026-11-25', complete: true, lastPage: 34, oldestYear: 2011 },
  undercover: { date: '2026-11-22', complete: true, lastPage: 88, oldestYear: 2007 },
  uniformExperiment: { date: '2026-11-24', complete: true, lastPage: 27, oldestYear: 2007 },
  // No /brands/ archive; crawled /tags/union-los-angeles.
  unionLosAngeles: { date: '2026-11-24', complete: true, lastPage: 11, oldestYear: 2012 },
  uniqlo: { date: '2026-11-24', complete: true, lastPage: 40, oldestYear: 2007 },
  // /brands/ pages redirect; crawled /tags/united-arrows.
  unitedArrows: { date: '2026-11-23', complete: true, lastPage: 20, oldestYear: 2007 },
  unitedArrowsAndSons: { date: '2026-11-24', complete: true, lastPage: 9, oldestYear: 2010 },
  // No /brands/ archive; crawled /tags/universal-works.
  universalWorks: { date: '2026-11-24', complete: true, lastPage: 6, oldestYear: 2010 },
  // Crawled /tags/upper-playground.
  upperPlayground: { date: '2026-11-24', complete: true, lastPage: 8, oldestYear: 2007 },
  // /brands/ page redirects; crawled /tags/urban-research, plus the Fashion Press collab list.
  urbanResearch: { date: '2026-11-24', complete: true, lastPage: 2, oldestYear: 2010 },
  valentino: { date: '2026-11-25', complete: true, lastPage: 17, oldestYear: 2009 },
  // Crawled /tags/van-cleef-arpels.
  vanCleefArpels: { date: '2026-11-24', complete: true, lastPage: 1, oldestYear: 2024 },
  // No /brands/ archive; crawled /tags/vanquish.
  vanquish: { date: '2026-11-25', complete: true, lastPage: 6, oldestYear: 2008 },
  vans: { date: '2026-11-22', complete: true, lastPage: 266, oldestYear: 2007 },
  // No /brands/ archive; crawled /tags/vanson-leathers.
  vansonLeathers: { date: '2026-11-26', complete: true, lastPage: 2, oldestYear: 2009 },
  // No /brands/ archive; crawled /tags/veja.
  veja: { date: '2026-11-26', complete: true, lastPage: 4, oldestYear: 2010 },
  // No /brands/ archive; crawled /tags/veronique-branquinho.
  veroniqueBranquinhoLabel: { date: '2026-11-25', complete: true, lastPage: 1, oldestYear: 2009 },
  versace: { date: '2026-11-18', complete: true },
  vetements: { date: '2026-11-19', complete: true, lastPage: 31, oldestYear: 2015 },
  viberg: { date: '2026-11-25', complete: true, lastPage: 5, oldestYear: 2008 },
  vineyardVines: { date: '2026-11-18', complete: true, noArchive: true },
  // Also read the Fashion Press collab list.
  visvim: { date: '2026-11-24', complete: true, lastPage: 110, oldestYear: 2007 },
  vivienneWestwood: { date: '2026-11-25', complete: true, lastPage: 10, oldestYear: 2008 },
  vlone: { date: '2026-11-22', complete: true, lastPage: 9, oldestYear: 2015 },
  wackoMaria: { date: '2026-11-17', complete: true },
  // /brands/ pages don't paginate; crawled /tags/wales-bonner.
  walesBonner: { date: '2026-11-22', complete: true, lastPage: 10, oldestYear: 2016 },
  walterVanBeirendonck: { date: '2026-11-25', complete: true, lastPage: 4, oldestYear: 2011 },
  // No /brands/ archive; crawled /tags/wasted-youth.
  wastedYouth: { date: '2026-11-25', complete: true, lastPage: 6, oldestYear: 2018 },
  // Crawled /tags/wax-london.
  waxLondon: { date: '2026-11-24', complete: true, lastPage: 1, oldestYear: 2021 },
  whiteMountaineering: { date: '2026-11-22', complete: true, lastPage: 30, oldestYear: 2008 },
  // Crawled /tags/whiz, /tags/whiz-limited (5 pages) and /tags/whizlimited (1 page), plus the Fashion Press collab list.
  whizLimited: { date: '2026-11-24', complete: true, lastPage: 6, oldestYear: 2007 },
  // Crawled /tags/wildside-yohji-yamamoto.
  wildsideYohjiYamamoto: { date: '2026-11-20', complete: true, lastPage: 4, oldestYear: 2022 },
  // Crawled /tags/wind-and-sea and the Japanese /jp/tags/wind-and-sea (6 pages).
  windAndSea: { date: '2026-11-22', complete: true, lastPage: 8, oldestYear: 2019 },
  // No /brands/ archive; crawled /tags/wolfs-head.
  wolfsHead: { date: '2026-11-24', complete: true, lastPage: 4, oldestYear: 2008 },
  woodWood: { date: '2026-11-24', complete: true, lastPage: 17, oldestYear: 2007 },
  woolrich: { date: '2026-11-24', complete: true, lastPage: 6, oldestYear: 2010 },
  wrangler: { date: '2026-11-24', complete: true, lastPage: 5, oldestYear: 2009 },
  wtaps: { date: '2026-11-18', complete: true, lastPage: 41, oldestYear: 2007 },
  // No /brands/ archive; crawled /tags/xlarge.
  xlarge: { date: '2026-11-24', complete: true, lastPage: 21, oldestYear: 2007 },
  yeezy: { date: '2026-11-26', complete: true, lastPage: 75, oldestYear: 2014 },
  // No /brands/ archive; crawled /tags/ymc.
  ymc: { date: '2026-11-25', complete: true, lastPage: 10, oldestYear: 2008 },
  yohjiYamamoto: { date: '2026-11-20', complete: true, lastPage: 46, oldestYear: 2008 },
  // Crawled /tags/yohji-yamamoto-pour-homme.
  yohjiYamamotoPourHomme: { date: '2026-11-20', complete: true, lastPage: 2, oldestYear: 2017 },
  yoichiNagasawa: { date: '2026-11-26', complete: true, noArchive: true },
  // Crawled /tags/youths-in-balaclava.
  youthsInBalaclava: { date: '2026-11-23', complete: true, lastPage: 1, oldestYear: 2018 },
  // No /brands/ archive; crawled /tags/y-project.
  yProject: { date: '2026-11-26', complete: true, lastPage: 5, oldestYear: 2017 },
  // No /brands/ archive (404); crawled /tags/ys.
  ys: { date: '2026-11-20', complete: true, lastPage: 3, oldestYear: 2014 },
  zegna: { date: '2026-11-18', complete: true },
  // No /brands/ archive; crawled /tags/zellerfeld.
  zellerfeld: { date: '2026-11-25', complete: true, lastPage: 4, oldestYear: 2021 },
} satisfies Partial<Record<HouseId, CollabSearch>>;
