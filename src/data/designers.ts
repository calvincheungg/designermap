import type { DesignerData } from '../types';
import type { HouseId } from './houses';

/**
 * Designers and their careers. The object key is the designer id.
 *
 * Each `career` entry is one tenure at one house. Moves between houses are
 * derived automatically by sorting the career by start year, so all you
 * record is where they were and when.
 *
 *   end: 2016  → left in 2016
 *   end: null  → current
 *   (no end)   → unknown, still researching
 *   approximate: true → years not yet confirmed (shown with "~")
 *
 * ⚠️ STARTER DATA, written from memory. Verify each entry and add `sources`.
 */
export const designers = {
  yvesSaintLaurent: {
    name: 'Yves Saint Laurent',
    born: 1936,
    died: 2008,
    nationality: 'French',
    career: [
      { house: 'dior', role: 'Artistic Director', start: 1957, end: 1960 },
      { house: 'saintLaurent', role: 'Founder', start: 1961, end: 2002 },
    ],
  },
  karlLagerfeld: {
    name: 'Karl Lagerfeld',
    born: 1933,
    died: 2019,
    nationality: 'German',
    career: [
      { house: 'chloe', role: 'Head Designer', start: 1964, end: 1983, approximate: true },
      { house: 'fendi', role: 'Creative Director', start: 1965, end: 2019 },
      { house: 'chanel', role: 'Creative Director', start: 1983, end: 2019 },
      { house: 'chloe', role: 'Head Designer', start: 1992, end: 1997, notes: 'Second stint at Chloé.' },
    ],
  },
  virginieViard: {
    name: 'Virginie Viard',
    nationality: 'French',
    career: [{ house: 'chanel', role: 'Creative Director', start: 2019, end: 2024 }],
  },
  matthieuBlazy: {
    name: 'Matthieu Blazy',
    nationality: 'French-Belgian',
    career: [
      { house: 'bottegaVeneta', role: 'Creative Director', start: 2021, end: 2024 },
      {
        house: 'chanel',
        role: 'Artistic Director',
        start: 2025,
        end: null,
        notes: 'Appointed Dec 2024.',
      },
    ],
  },
  tomFord: {
    name: 'Tom Ford',
    born: 1961,
    nationality: 'American',
    career: [
      { house: 'gucci', role: 'Creative Director', start: 1994, end: 2004 },
      {
        house: 'saintLaurent',
        role: 'Creative Director',
        roleDetail: 'YSL Rive Gauche',
        start: 1999,
        end: 2004,
      },
      { house: 'tomFord', role: 'Founder', roleDetail: 'Founder, creative director', start: 2005, end: 2023 },
    ],
  },
  hediSlimane: {
    name: 'Hedi Slimane',
    born: 1968,
    nationality: 'French',
    career: [
      { house: 'dior', role: 'Menswear Director', roleDetail: 'Dior Homme', start: 2000, end: 2007 },
      { house: 'saintLaurent', role: 'Creative Director', start: 2012, end: 2016 },
      { house: 'celine', role: 'Artistic Director', start: 2018, end: 2024 },
    ],
  },
  anthonyVaccarello: {
    name: 'Anthony Vaccarello',
    nationality: 'Belgian',
    career: [{ house: 'saintLaurent', role: 'Creative Director', start: 2016, end: null }],
  },
  phoebePhilo: {
    name: 'Phoebe Philo',
    born: 1973,
    nationality: 'British',
    career: [
      { house: 'chloe', role: 'Creative Director', start: 2001, end: 2006 },
      { house: 'celine', role: 'Creative Director', start: 2008, end: 2017 },
      { house: 'phoebePhiloLabel', role: 'Founder', roleDetail: 'Founder, creative director', start: 2023, end: null },
    ],
  },
  stellaMcCartney: {
    name: 'Stella McCartney',
    born: 1971,
    nationality: 'British',
    career: [{ house: 'chloe', role: 'Creative Director', start: 1997, end: 2001 },
      { house: 'stellaMcCartney', role: 'Founder', roleDetail: 'Founder, creative director', start: 2001, end: null },
    ],
  },
  clareWaightKeller: {
    name: 'Clare Waight Keller',
    nationality: 'British',
    career: [
      { house: 'chloe', role: 'Creative Director', start: 2011, end: 2017 },
      { house: 'givenchy', role: 'Artistic Director', start: 2017, end: 2020 },
    ],
  },
  alexanderMcQueen: {
    name: 'Alexander McQueen',
    born: 1969,
    died: 2010,
    nationality: 'British',
    career: [
      { house: 'alexanderMcQueen', role: 'Founder', start: 1992, end: 2010 },
      { house: 'givenchy', role: 'Creative Director', start: 1996, end: 2001 },
    ],
  },
  johnGalliano: {
    name: 'John Galliano',
    born: 1960,
    nationality: 'British',
    career: [
      { house: 'johnGalliano', role: 'Founder', roleDetail: 'Founder, creative director', start: 1984, end: 2011 },
      { house: 'givenchy', role: 'Creative Director', start: 1995, end: 1996 },
      { house: 'dior', role: 'Creative Director', start: 1996, end: 2011 },
      { house: 'maisonMargiela', role: 'Creative Director', start: 2014, end: 2024 },
    ],
  },
  riccardoTisci: {
    name: 'Riccardo Tisci',
    born: 1974,
    nationality: 'Italian',
    career: [
      { house: 'givenchy', role: 'Creative Director', start: 2005, end: 2017 },
      { house: 'burberry', role: 'Creative Director', start: 2018, end: 2022 },
    ],
  },
  sarahBurton: {
    name: 'Sarah Burton',
    born: 1974,
    nationality: 'British',
    career: [
      { house: 'alexanderMcQueen', role: 'Creative Director', start: 2010, end: 2023 },
      { house: 'givenchy', role: 'Creative Director', start: 2024, end: null },
    ],
  },
  seanMcGirr: {
    name: 'Seán McGirr',
    nationality: 'Irish',
    career: [{ house: 'alexanderMcQueen', role: 'Creative Director', start: 2023, end: null }],
  },
  danielLee: {
    name: 'Daniel Lee',
    born: 1986,
    nationality: 'British',
    career: [
      { house: 'bottegaVeneta', role: 'Creative Director', start: 2018, end: 2021 },
      { house: 'burberry', role: 'Creative Director', start: 2022, end: null },
    ],
  },
  rafSimons: {
    name: 'Raf Simons',
    born: 1968,
    nationality: 'Belgian',
    career: [
      { house: 'jilSander', role: 'Creative Director', start: 2005, end: 2012 },
      { house: 'dior', role: 'Artistic Director', start: 2012, end: 2015 },
      {
        house: 'calvinKlein',
        role: 'Creative Director',
        roleDetail: 'Chief Creative Officer, all divisions',
        start: 2016,
        end: 2018,
        notes: 'Departed December 2018.',
      },
      {
        house: 'prada',
        role: 'Co-Creative Director',
        roleDetail: 'with Miuccia Prada',
        start: 2020,
        end: null,
      },
      { house: 'rafSimonsLabel', role: 'Founder', roleDetail: 'Founder, designer', start: 1995, end: 2022 },
    ],
  },
  /* ---------- Prada lineage ---------- */
  marioPrada: {
    name: 'Mario Prada & family',
    nationality: 'Italian',
    career: [
      {
        house: 'prada',
        role: 'Founder',
        roleDetail: 'founding-era family leadership',
        start: 1913,
        end: 1978,
      },
    ],
  },
  miucciaPrada: {
    name: 'Miuccia Prada',
    born: 1949,
    nationality: 'Italian',
    career: [
      { house: 'prada', role: 'Creative Director', start: 1978, end: 2020 },
      { house: 'miuMiu', role: 'Founder', start: 1993, end: null },
      {
        house: 'prada',
        role: 'Co-Creative Director',
        roleDetail: 'with Raf Simons',
        start: 2020,
        end: null,
      },
    ],
  },

  /* ---------- Jil Sander lineage ---------- */
  jilSander: {
    name: 'Jil Sander',
    born: 1943,
    nationality: 'German',
    career: [
      { house: 'jilSander', role: 'Founder', start: 1968, end: 2000 },
      { house: 'jilSander', role: 'Creative Director', start: 2003, end: 2004, notes: 'First return.' },
      { house: 'jilSander', role: 'Creative Director', start: 2012, end: 2013, notes: 'Second return.' },
    ],
  },
  milanVukmirovic: {
    name: 'Milan Vukmirovic',
    career: [{ house: 'jilSander', role: 'Creative Director', start: 2000, end: 2003 }],
  },
  rodolfoPaglialunga: {
    name: 'Rodolfo Paglialunga',
    career: [{ house: 'jilSander', role: 'Creative Director', start: 2014, end: 2017 }],
  },
  lucieMeier: {
    name: 'Lucie Meier',
    career: [
      {
        house: 'jilSander',
        role: 'Co-Creative Director',
        roleDetail: 'with Luke Meier',
        start: 2017,
        end: 2025,
      },
    ],
  },
  lukeMeier: {
    name: 'Luke Meier',
    career: [
      { house: 'oamc', role: 'Founder', start: 2013, end: 2024 },
      {
        house: 'jilSander',
        role: 'Co-Creative Director',
        roleDetail: 'with Lucie Meier',
        start: 2017,
        end: 2025,
      },
    ],
  },
  simoneBellotti: {
    name: 'Simone Bellotti',
    career: [{ house: 'jilSander', role: 'Creative Director', start: 2025, end: null },
      { house: 'bally', role: 'Creative Director', start: 2024, end: 2025 },
    ],
  },

  mariaGraziaChiuri: {
    name: 'Maria Grazia Chiuri',
    born: 1964,
    nationality: 'Italian',
    career: [
      { house: 'valentino', role: 'Co-Creative Director', start: 2008, end: 2016 },
      { house: 'dior', role: 'Artistic Director', start: 2016, end: 2025 },
      { house: 'fendi', role: 'Creative Director', roleDetail: 'Chief creative officer', start: 2025, end: null, notes: 'Named October 2025; began her career at Fendi as an accessories designer.' },
    ],
  },
  pierpaoloPiccioli: {
    name: 'Pierpaolo Piccioli',
    born: 1967,
    nationality: 'Italian',
    career: [
      { house: 'valentino', role: 'Co-Creative Director', start: 2008, end: 2016 },
      { house: 'valentino', role: 'Creative Director', start: 2016, end: 2024 },
      { house: 'balenciaga', role: 'Creative Director', start: 2025, end: 2026 },
    ],
  },
  nicolasGhesquiere: {
    name: 'Nicolas Ghesquière',
    born: 1971,
    nationality: 'French',
    career: [
      { house: 'balenciaga', role: 'Creative Director', start: 1997, end: 2012 },
      {
        house: 'louisVuitton',
        role: 'Artistic Director',
        roleDetail: 'Womenswear',
        start: 2013,
        end: null,
      },
    ],
  },
  marcJacobs: {
    name: 'Marc Jacobs',
    born: 1963,
    nationality: 'American',
    career: [
      { house: 'marcJacobs', role: 'Founder', roleDetail: 'Founder, creative director', start: 1984, end: null },
      {
        house: 'louisVuitton',
        role: 'Creative Director',
        roleDetail: 'Womenswear & menswear',
        start: 1997,
        end: 2013,
      },
    ],
  },

  rickOwens: {
    name: 'Rick Owens',
    born: 1962,
    nationality: 'American',
    career: [{ house: 'rickOwens', role: 'Founder', start: 1994, end: null }],
  },

  /* ---------- Japanese designers ---------- */
  yohjiYamamoto: {
    name: 'Yohji Yamamoto',
    born: 1943,
    nationality: 'Japanese',
    career: [
      { house: 'yohjiYamamoto', role: 'Founder', start: 1972, end: null },
      { house: 'y3', role: 'Creative Director', start: 2002, end: null },
    ],
  },
  reiKawakubo: {
    name: 'Rei Kawakubo',
    born: 1942,
    nationality: 'Japanese',
    career: [{ house: 'commeDesGarcons', role: 'Founder', start: 1969, end: null }],
  },
  junyaWatanabe: {
    name: 'Junya Watanabe',
    born: 1961,
    nationality: 'Japanese',
    career: [
      {
        house: 'commeDesGarcons',
        role: 'Other',
        roleDetail: 'Pattern cutter, then Tricot line designer',
        start: 1984,
        end: null,
        approximate: true,
      },
      { house: 'junyaWatanabe', role: 'Founder', start: 1992, end: null },
    ],
  },
  isseyMiyake: {
    name: 'Issey Miyake',
    born: 1938,
    died: 2022,
    nationality: 'Japanese',
    career: [{ house: 'isseyMiyake', role: 'Founder', roleDetail: 'Founder, creative director', start: 1970, end: 1999 }],
  },
  junTakahashi: {
    name: 'Jun Takahashi',
    born: 1969,
    nationality: 'Japanese',
    career: [{ house: 'undercover', role: 'Founder', start: 1990, end: null }],
  },
  chitoseAbe: {
    name: 'Chitose Abe',
    born: 1965,
    nationality: 'Japanese',
    career: [{ house: 'sacai', role: 'Founder', start: 1999, end: null },
      { house: 'jeanPaulGaultier', role: 'Other', roleDetail: 'Guest couture designer', start: 2021, end: 2021 },
    ],
  },
  junichiAbe: {
    name: 'Junichi Abe',
    nationality: 'Japanese',
    career: [{ house: 'kolor', role: 'Founder', start: 2004, end: null }],
  },
  miharaYasuhiro: {
    name: 'Mihara Yasuhiro',
    born: 1972,
    nationality: 'Japanese',
    career: [{ house: 'maisonMiharaYasuhiro', role: 'Founder', start: 1997, end: null }],
  },
  hirokiNakamura: {
    name: 'Hiroki Nakamura',
    nationality: 'Japanese',
    career: [{ house: 'visvim', role: 'Founder', start: 2000, end: null }],
  },
  tatsuroHorikawa: {
    name: 'Tatsuro Horikawa',
    nationality: 'Japanese',
    career: [{ house: 'julius', role: 'Founder', start: 2001, end: null, approximate: true }],
  },
  nigo: {
    name: 'Nigo',
    born: 1970,
    nationality: 'Japanese',
    career: [
      { house: 'bape', role: 'Founder', roleDetail: 'Founder, creative director', start: 1993, end: 2013 },
      { house: 'billionaireBoysClub', role: 'Founder', roleDetail: 'Co-founder with Pharrell Williams', start: 2003 },
      { house: 'humanMade', role: 'Founder', start: 2010, end: null },
      { house: 'kenzo', role: 'Artistic Director', start: 2021, end: null },
    ],
  },

  /* ---------- Ferragamo lineage ---------- */
  salvatoreFerragamo: {
    name: 'Salvatore Ferragamo',
    born: 1898,
    died: 1960,
    nationality: 'Italian',
    career: [{ house: 'ferragamo', role: 'Founder', start: 1927, end: 1960 }],
  },
  fiammaFerragamo: {
    name: 'Fiamma Ferragamo',
    nationality: 'Italian',
    career: [
      {
        house: 'ferragamo',
        role: 'Head Designer',
        roleDetail: "Women's shoes and accessories",
        start: 1960,
        end: 1998,
        approximate: true,
      },
    ],
  },
  massimilianoGiornetti: {
    name: 'Massimiliano Giornetti',
    nationality: 'Italian',
    career: [{ house: 'ferragamo', role: 'Creative Director', start: 2010, end: 2016, approximate: true }],
  },
  paulAndrew: {
    name: 'Paul Andrew',
    nationality: 'British',
    career: [{ house: 'ferragamo', role: 'Creative Director', start: 2016, end: 2021, approximate: true }],
  },
  maximilianDavis: {
    name: 'Maximilian Davis',
    nationality: 'British',
    career: [{ house: 'ferragamo', role: 'Creative Director', start: 2022, end: null }],
  },

  /* ---------- Roberto Cavalli lineage ---------- */
  robertoCavalli: {
    name: 'Roberto Cavalli',
    born: 1940,
    died: 2024,
    nationality: 'Italian',
    career: [{ house: 'robertoCavalli', role: 'Founder', start: 1970, end: 2015 }],
  },
  peterDundas: {
    name: 'Peter Dundas',
    nationality: 'Norwegian',
    career: [{ house: 'robertoCavalli', role: 'Creative Director', start: 2015, end: 2016 },
      { house: 'emilioPucci', role: 'Creative Director', start: 2008, end: 2015 },
    ],
  },
  paulSurridge: {
    name: 'Paul Surridge',
    nationality: 'British',
    career: [{ house: 'robertoCavalli', role: 'Creative Director', start: 2017, end: 2019 }],
  },
  faustoPuglisi: {
    name: 'Fausto Puglisi',
    nationality: 'Italian',
    career: [{ house: 'robertoCavalli', role: 'Creative Director', start: 2020, end: null }],
  },

  /* ---------- Lanvin lineage ---------- */
  jeanneLanvin: {
    name: 'Jeanne Lanvin',
    born: 1867,
    died: 1946,
    nationality: 'French',
    career: [{ house: 'lanvin', role: 'Founder', start: 1889, end: 1946 }],
  },
  antonioDelCastillo: {
    name: 'Antonio del Castillo',
    nationality: 'Spanish',
    career: [{ house: 'lanvin', role: 'Creative Director', start: 1950, end: 1963 }],
  },
  julesFrancoisCrahay: {
    name: 'Jules-François Crahay',
    nationality: 'Belgian',
    career: [{ house: 'lanvin', role: 'Creative Director', start: 1963, end: 1984 },
      { house: 'ninaRicci', role: 'Head Designer', start: 1959, end: 1963, approximate: true },
    ],
  },
  maryllLanvin: {
    name: 'Maryll Lanvin',
    career: [{ house: 'lanvin', role: 'Creative Director', start: 1985, end: 1989, approximate: true }],
  },
  claudeMontana: {
    name: 'Claude Montana',
    born: 1947,
    died: 2024,
    nationality: 'French',
    career: [{ house: 'lanvin', role: 'Creative Director', start: 1990, end: 1992, approximate: true }],
  },
  ocimarVersolato: {
    name: 'Ocimar Versolato',
    born: 1961,
    died: 2017,
    nationality: 'Brazilian',
    career: [{ house: 'lanvin', role: 'Creative Director', start: 1996, end: 1998, approximate: true }],
  },
  cristinaOrtiz: {
    name: 'Cristina Ortiz',
    nationality: 'Spanish',
    career: [{ house: 'lanvin', role: 'Creative Director', start: 1998, end: 2001, approximate: true }],
  },
  alberElbaz: {
    name: 'Alber Elbaz',
    born: 1961,
    died: 2021,
    nationality: 'Israeli',
    career: [{ house: 'lanvin', role: 'Artistic Director', start: 2001, end: 2015 }],
  },
  bouchraJarrar: {
    name: 'Bouchra Jarrar',
    nationality: 'French',
    career: [{ house: 'lanvin', role: 'Artistic Director', start: 2016, end: 2017 }],
  },
  olivierLapidus: {
    name: 'Olivier Lapidus',
    nationality: 'French',
    career: [{ house: 'lanvin', role: 'Artistic Director', start: 2017, end: 2018 }],
  },
  brunoSialelli: {
    name: 'Bruno Sialelli',
    nationality: 'French',
    career: [{ house: 'lanvin', role: 'Creative Director', start: 2019, end: 2023 }],
  },
  peterCopping: {
    name: 'Peter Copping',
    nationality: 'British',
    career: [{ house: 'lanvin', role: 'Artistic Director', start: 2024, end: null },
      { house: 'ninaRicci', role: 'Creative Director', start: 2009, end: 2014 },
      { house: 'oscarDeLaRentaHouse', role: 'Creative Director', start: 2014, end: 2016 },
    ],
  },

  /* ---------- Vivienne Westwood lineage ---------- */
  vivienneWestwood: {
    name: 'Vivienne Westwood',
    born: 1941,
    died: 2022,
    nationality: 'British',
    career: [{ house: 'vivienneWestwood', role: 'Founder', start: 1971, end: 2022 }],
  },
  andreasKronthaler: {
    name: 'Andreas Kronthaler',
    born: 1966,
    nationality: 'Austrian',
    career: [
      {
        house: 'vivienneWestwood',
        role: 'Creative Director',
        start: 2016,
        end: null,
        approximate: true,
        notes:
          "Led the main line as 'Andreas Kronthaler for Vivienne Westwood' from 2016; sole creative director after Westwood's death in December 2022.",
      },
    ],
  },

  /* ---------- Ann Demeulemeester lineage ---------- */
  annDemeulemeester: {
    name: 'Ann Demeulemeester',
    born: 1959,
    nationality: 'Belgian',
    career: [{ house: 'annDemeulemeester', role: 'Founder', start: 1985, end: 2013 }],
  },
  sebastienMeunier: {
    name: 'Sébastien Meunier',
    nationality: 'French',
    career: [{ house: 'annDemeulemeester', role: 'Creative Director', start: 2013, end: 2020, approximate: true }],
  },
  ludovicDeSaintSernin: {
    name: 'Ludovic de Saint Sernin',
    nationality: 'French',
    career: [{ house: 'annDemeulemeester', role: 'Creative Director', start: 2022, end: 2023, approximate: true }],
  },
  stefanoGallici: {
    name: 'Stefano Gallici',
    nationality: 'Italian',
    career: [{ house: 'annDemeulemeester', role: 'Creative Director', start: 2024, end: null }],
  },

  /* ---------- Dries Van Noten lineage ---------- */
  driesVanNoten: {
    name: 'Dries Van Noten',
    born: 1958,
    nationality: 'Belgian',
    career: [{ house: 'driesVanNoten', role: 'Founder', start: 1986, end: 2024 }],
  },
  julianKlausner: {
    name: 'Julian Klausner',
    nationality: 'Canadian',
    career: [{ house: 'driesVanNoten', role: 'Creative Director', start: 2024, end: null }],
  },

  /* ---------- Antwerp Six ---------- */
  walterVanBeirendonck: {
    name: 'Walter Van Beirendonck',
    born: 1957,
    nationality: 'Belgian',
    career: [
      {
        house: 'walterVanBeirendonck',
        role: 'Founder',
        roleDetail: 'Founder, creative director',
        start: 1983,
        end: null,
      },
    ],
  },
  dirkBikkembergs: {
    name: 'Dirk Bikkembergs',
    born: 1959,
    nationality: 'Belgian',
    // Still researching when he stepped back from the label.
    career: [{ house: 'bikkembergs', role: 'Founder', roleDetail: 'Founder, creative director', start: 1985 }],
  },

  /* ---------- Independent labels ---------- */
  lynaTy: {
    name: 'Lyna Ty',
    nationality: 'Australian',
    career: [
      {
        house: 'songForTheMute',
        role: 'Founder',
        roleDetail: 'Co-founder, designer',
        start: 2009,
        end: null,
      },
    ],
  },
  melvinTanaya: {
    name: 'Melvin Tanaya',
    nationality: 'Australian',
    career: [{ house: 'songForTheMute', role: 'Founder', roleDetail: 'Co-founder', start: 2009, end: null }],
  },
  saeedAlRubeyi: {
    name: 'Saeed Al-Rubeyi',
    nationality: 'British',
    career: [
      {
        house: 'storyMfg',
        role: 'Founder',
        roleDetail: 'Co-founder, co-creative director with Katy Al-Rubeyi',
        start: 2013,
        end: null,
      },
    ],
  },
  katyAlRubeyi: {
    name: 'Katy Al-Rubeyi',
    nationality: 'British',
    career: [
      {
        house: 'storyMfg',
        role: 'Founder',
        roleDetail: 'Co-founder, co-creative director with Saeed Al-Rubeyi',
        start: 2013,
        end: null,
      },
    ],
  },

  /* ---------- Founder-led ---------- */
  jerryLorenzo: {
    name: 'Jerry Lorenzo',
    born: 1977,
    nationality: 'American',
    career: [{ house: 'fearOfGod', role: 'Founder', roleDetail: 'Founder, creative director', start: 2013, end: null }],
  },
  nobuhikoKitamura: {
    name: 'Nobuhiko Kitamura',
    born: 1962,
    nationality: 'Japanese',
    career: [
      { house: 'hystericGlamour', role: 'Founder', roleDetail: 'Founder, creative director', start: 1984, end: null },
    ],
  },

  /* ---------- American labels ---------- */
  ralphLaurenDesigner: {
    name: 'Ralph Lauren',
    born: 1939,
    nationality: 'American',
    career: [
      { house: 'ralphLauren', role: 'Founder', roleDetail: 'Founder, chief creative officer', start: 1967, end: null },
    ],
  },
  gregLauren: {
    name: 'Greg Lauren',
    nationality: 'American',
    career: [
      { house: 'gregLauren', role: 'Founder', roleDetail: 'Founder, creative director', start: 2011, end: null },
    ],
  },
  donnaKaran: {
    name: 'Donna Karan',
    born: 1948,
    nationality: 'American',
    career: [{ house: 'dkny', role: 'Founder', start: 1989, end: 2015 }],
  },
  daoYiChow: {
    name: 'Dao-Yi Chow',
    nationality: 'American',
    career: [
      { house: 'dkny', role: 'Co-Creative Director', roleDetail: 'with Maxwell Osborne', start: 2015, end: 2017 },
    ],
  },
  maxwellOsborne: {
    name: 'Maxwell Osborne',
    nationality: 'American',
    career: [
      { house: 'dkny', role: 'Co-Creative Director', roleDetail: 'with Dao-Yi Chow', start: 2015, end: 2017 },
    ],
  },
  peterHawkings: {
    name: 'Peter Hawkings',
    nationality: 'British',
    career: [{ house: 'tomFord', role: 'Creative Director', start: 2023, end: 2024 }],
  },
  haiderAckermann: {
    name: 'Haider Ackermann',
    nationality: 'French',
    career: [{ house: 'tomFord', role: 'Creative Director', start: 2024, end: null },
      { house: 'jeanPaulGaultier', role: 'Other', roleDetail: 'Guest couture designer', start: 2023, end: 2023 },
      { house: 'canadaGoose', role: 'Creative Director', start: 2023, end: 2024 },
      { house: 'berluti', role: 'Creative Director', start: 2016, end: 2018 },
      { house: 'haiderAckermannLabel', role: 'Founder', roleDetail: 'Founder, designer', start: 2003, approximate: true },
    ],
  },
  thomBrowne: {
    name: 'Thom Browne',
    born: 1965,
    nationality: 'American',
    career: [
      { house: 'thomBrowne', role: 'Founder', roleDetail: 'Founder, creative director', start: 2001, end: null },
      { house: 'brooksBrothers', role: 'Other', roleDetail: 'Black Fleece line', start: 2007, end: 2015, approximate: true },
      { house: 'moncler', role: 'Creative Director', roleDetail: 'Moncler Gamme Bleu (menswear)', start: 2009, end: 2017 },
    ],
  },
  maryKateOlsen: {
    name: 'Mary-Kate Olsen',
    born: 1986,
    nationality: 'American',
    career: [
      {
        house: 'theRow',
        role: 'Founder',
        roleDetail: 'Co-founder, co-creative director with Ashley Olsen',
        start: 2006,
        end: null,
      },
    ],
  },
  ashleyOlsen: {
    name: 'Ashley Olsen',
    born: 1986,
    nationality: 'American',
    career: [
      {
        house: 'theRow',
        role: 'Founder',
        roleDetail: 'Co-founder, co-creative director with Mary-Kate Olsen',
        start: 2006,
        end: null,
      },
    ],
  },
  catherineHolstein: {
    name: 'Catherine Holstein',
    nationality: 'American',
    career: [
      { house: 'khaite', role: 'Founder', roleDetail: 'Founder, creative director', start: 2016, end: null },
    ],
  },
  mikeAmiri: {
    name: 'Mike Amiri',
    nationality: 'American',
    career: [
      { house: 'amiri', role: 'Founder', roleDetail: 'Founder, creative director', start: 2014, end: null },
    ],
  },
  jamesJebbia: {
    name: 'James Jebbia',
    nationality: 'American',
    career: [{ house: 'supreme', role: 'Founder', start: 1994, end: null }],
  },

  /* ---------- DSquared2 ---------- */
  deanCaten: {
    name: 'Dean Caten',
    born: 1964,
    nationality: 'Canadian',
    career: [
      {
        house: 'dsquared2',
        role: 'Founder',
        roleDetail: 'Co-founder, co-creative director with Dan Caten',
        start: 1995,
        end: null,
      },
    ],
  },
  danCaten: {
    name: 'Dan Caten',
    born: 1964,
    nationality: 'Canadian',
    career: [
      {
        house: 'dsquared2',
        role: 'Founder',
        roleDetail: 'Co-founder, co-creative director with Dean Caten',
        start: 1995,
        end: null,
      },
    ],
  },

  /* ---------- Hermès lineage ---------- */
  thierryHermes: {
    name: 'Thierry Hermès',
    born: 1801,
    died: 1878,
    nationality: 'French',
    career: [{ house: 'hermes', role: 'Founder', roleDetail: 'Harness workshop', start: 1837 }],
  },
  veroniqueNichanian: {
    name: 'Véronique Nichanian',
    nationality: 'French',
    career: [
      {
        house: 'hermes',
        role: 'Menswear Director',
        start: 1988,
        end: 2026,
        approximate: true,
        notes: 'Succeeded by Grace Wales Bonner.',
      },
    ],
  },
  martinMargiela: {
    name: 'Martin Margiela',
    born: 1957,
    nationality: 'Belgian',
    career: [
      { house: 'maisonMargiela', role: 'Founder', roleDetail: 'Founder, creative director', start: 1988, end: 2009 },
      { house: 'mm6', role: 'Founder', roleDetail: 'Diffusion line', start: 1997, end: 2009 },
      { house: 'hermes', role: 'Womenswear Director', start: 1997, end: 2003 },
    ],
  },
  jeanPaulGaultier: {
    name: 'Jean Paul Gaultier',
    born: 1952,
    nationality: 'French',
    career: [
      { house: 'jeanPaulGaultier', role: 'Founder', roleDetail: 'Founder, creative director', start: 1982, end: 2020 },
      { house: 'hermes', role: 'Womenswear Director', start: 2003, end: 2010 },
    ],
  },
  pierreAlexisDumas: {
    name: 'Pierre-Alexis Dumas',
    nationality: 'French',
    career: [{ house: 'hermes', role: 'Artistic Director', roleDetail: 'Whole house', start: 2005, end: null }],
  },
  christopheLemaire: {
    name: 'Christophe Lemaire',
    born: 1965,
    nationality: 'French',
    career: [
      { house: 'lemaire', role: 'Founder', roleDetail: 'Founder, creative director', start: 1990, end: null, approximate: true },
      { house: 'lacoste', role: 'Artistic Director', start: 2001, end: 2010 },
      { house: 'hermes', role: 'Womenswear Director', start: 2010, end: 2014 },
    ],
  },
  sarahLinhTran: {
    name: 'Sarah-Linh Tran',
    nationality: 'French',
    career: [
      {
        house: 'lemaire',
        role: 'Co-Creative Director',
        roleDetail: 'with Christophe Lemaire',
        start: 2014,
        end: null,
        approximate: true,
      },
    ],
  },
  nadegeVanhee: {
    name: 'Nadège Vanhée',
    nationality: 'French',
    career: [
      { house: 'theRow', role: 'Head Designer', roleDetail: 'Design director', start: 2011, end: 2014, approximate: true },
      { house: 'hermes', role: 'Womenswear Director', start: 2014, end: null },
    ],
  },

  /* ---------- Jean Paul Gaultier ---------- */
  glennMartens: {
    name: 'Glenn Martens',
    nationality: 'Belgian',
    career: [
      { house: 'jeanPaulGaultier', role: 'Other', roleDetail: 'Guest couture designer', start: 2022, end: 2022 },
      { house: 'maisonMargiela', role: 'Creative Director', start: 2025, end: null },
      { house: 'diesel', role: 'Creative Director', start: 2020, end: null },
      { house: 'yProject', role: 'Creative Director', start: 2013, end: 2025 },
    ],
  },
  duranLantink: {
    name: 'Duran Lantink',
    nationality: 'Dutch',
    career: [{ house: 'jeanPaulGaultier', role: 'Creative Director', start: 2025, end: null }],
  },

  /* ---------- Balmain lineage ---------- */
  pierreBalmain: {
    name: 'Pierre Balmain',
    born: 1914,
    died: 1982,
    nationality: 'French',
    career: [{ house: 'balmain', role: 'Founder', start: 1945, end: 1982 }],
  },
  erikMortensen: {
    name: 'Erik Mortensen',
    nationality: 'Danish',
    career: [{ house: 'balmain', role: 'Creative Director', start: 1982, end: 1990 }],
  },
  hervePierre: {
    name: 'Hervé Pierre',
    nationality: 'French',
    career: [
      { house: 'balmain', role: 'Creative Director', roleDetail: 'Ready-to-wear & haute couture', start: 1990, end: 1992 },
    ],
  },
  oscarDeLaRenta: {
    name: 'Oscar de la Renta',
    born: 1932,
    died: 2014,
    nationality: 'Dominican-American',
    career: [{ house: 'balmain', role: 'Creative Director', roleDetail: 'Haute couture', start: 1993, end: 2002 },
      { house: 'oscarDeLaRentaHouse', role: 'Founder', roleDetail: 'Founder, designer', start: 1965, end: 2014 },
    ],
  },
  laurentMercier: {
    name: 'Laurent Mercier',
    nationality: 'French',
    career: [{ house: 'balmain', role: 'Creative Director', start: 2002, end: 2003 }],
  },
  peggyHuynhKinh: {
    name: 'Peggy Huynh Kinh',
    nationality: 'French',
    career: [
      {
        house: 'balmain',
        role: 'Womenswear Director',
        roleDetail: "Women's ready-to-wear & accessories",
        start: 1982,
        end: 1986,
      },
    ],
  },
  christopheLebourg: {
    name: 'Christophe Lebourg',
    nationality: 'French',
    career: [{ house: 'balmain', role: 'Creative Director', start: 2003, end: 2006 }],
  },
  christopheDecarnin: {
    name: 'Christophe Decarnin',
    nationality: 'French',
    career: [
      {
        house: 'balmain',
        role: 'Creative Director',
        start: 2005,
        end: 2011,
        notes: 'Some sources give 2006 as his start year.',
      },
    ],
  },
  olivierRousteing: {
    name: 'Olivier Rousteing',
    born: 1985,
    nationality: 'French',
    career: [
      {
        house: 'robertoCavalli',
        role: 'Head Designer',
        roleDetail: 'Womenswear design team',
        start: 2003,
        end: 2008,
        approximate: true,
      },
      {
        house: 'balmain',
        role: 'Other',
        roleDetail: 'Designer under Christophe Decarnin',
        start: 2009,
        end: 2011,
        approximate: true,
      },
      { house: 'balmain', role: 'Creative Director', start: 2011, end: 2025, notes: 'Announced his departure on 5 November 2025.' },
      { house: 'jeanPaulGaultier', role: 'Other', roleDetail: 'Guest couture designer', start: 2022, end: 2022 },
    ],
  },

  antoninTron: {
    name: 'Antonin Tron',
    nationality: 'French',
    career: [
      { house: 'balmain', role: 'Creative Director', start: 2025, end: null, notes: 'Announced 12 November 2025.' },
    ],
  },

  /* ---------- Schiaparelli lineage ---------- */
  elsaSchiaparelli: {
    name: 'Elsa Schiaparelli',
    born: 1890,
    died: 1973,
    nationality: 'Italian',
    career: [{ house: 'schiaparelli', role: 'Founder', start: 1927, end: 1954 }],
  },
  marcoZanini: {
    name: 'Marco Zanini',
    nationality: 'Italian',
    career: [{ house: 'schiaparelli', role: 'Creative Director', start: 2013, end: 2014 }],
  },
  bertrandGuyon: {
    name: 'Bertrand Guyon',
    nationality: 'French',
    career: [{ house: 'schiaparelli', role: 'Creative Director', start: 2015, end: 2019 }],
  },
  danielRoseberry: {
    name: 'Daniel Roseberry',
    nationality: 'American',
    career: [{ house: 'schiaparelli', role: 'Creative Director', start: 2019, end: null }],
  },

  /* ---------- Alaïa lineage ---------- */
  azzedineAlaia: {
    name: 'Azzedine Alaïa',
    died: 2017,
    nationality: 'Tunisian-French',
    career: [{ house: 'alaia', role: 'Founder', start: 1981, end: 2017 }],
  },
  pieterMulier: {
    name: 'Pieter Mulier',
    nationality: 'Belgian',
    career: [
      { house: 'alaia', role: 'Creative Director', start: 2021, end: 2026, approximate: true },
      {
        house: 'versace',
        role: 'Creative Director',
        roleDetail: 'Chief creative officer',
        start: 2026,
        end: null,
        notes: 'First appointment under Prada Group ownership; effective 1 July 2026.',
      },
    ],
  },

  /* ---------- Founder-led Paris labels ---------- */
  isabelMarant: {
    name: 'Isabel Marant',
    born: 1967,
    nationality: 'French',
    career: [
      { house: 'isabelMarant', role: 'Founder', roleDetail: 'Founder, creative director', start: 1994, end: null },
    ],
  },
  simonPorteJacquemus: {
    name: 'Simon Porte Jacquemus',
    born: 1990,
    nationality: 'French',
    career: [
      { house: 'jacquemus', role: 'Founder', roleDetail: 'Founder, creative director', start: 2009, end: null },
    ],
  },
  marineSerre: {
    name: 'Marine Serre',
    born: 1991,
    nationality: 'French',
    career: [
      { house: 'marineSerre', role: 'Founder', roleDetail: 'Founder, creative director', start: 2017, end: null },
    ],
  },
  charafTajer: {
    name: 'Charaf Tajer',
    nationality: 'French-Moroccan',
    career: [
      { house: 'casablanca', role: 'Founder', roleDetail: 'Founder, creative director', start: 2018, end: null },
    ],
  },

  /* ---------- Stockholm & New York ---------- */
  jonnyJohansson: {
    name: 'Jonny Johansson',
    nationality: 'Swedish',
    career: [
      { house: 'acneStudios', role: 'Founder', roleDetail: 'Co-founder, creative director', start: 1996, end: null },
    ],
  },
  peterDo: {
    name: 'Peter Do',
    nationality: 'Vietnamese-American',
    career: [
      { house: 'peterDo', role: 'Founder', roleDetail: 'Founder, creative director', start: 2018, end: null },
      { house: 'helmutLang', role: 'Creative Director', start: 2023, end: 2024 },
    ],
  },

  /* ---------- Italian houses ---------- */
  gianniVersace: {
    name: 'Gianni Versace',
    born: 1946,
    died: 1997,
    nationality: 'Italian',
    career: [{ house: 'versace', role: 'Founder', start: 1978, end: 1997 }],
  },
  donatellaVersace: {
    name: 'Donatella Versace',
    born: 1955,
    nationality: 'Italian',
    career: [{ house: 'versace', role: 'Creative Director', start: 1997, end: 2025 }],
  },
  darioVitale: {
    name: 'Dario Vitale',
    nationality: 'Italian',
    career: [
      {
        house: 'versace',
        role: 'Creative Director',
        start: 2025,
        end: 2025,
        notes: 'Appointed March 2025 (from Miu Miu); left December 2025 after Prada Group bought Versace.',
      },
    ],
  },
  domenicoDolce: {
    name: 'Domenico Dolce',
    born: 1958,
    nationality: 'Italian',
    career: [
      { house: 'dolceGabbana', role: 'Founder', roleDetail: 'Co-founder, co-creative director with Stefano Gabbana', start: 1985, end: null },
    ],
  },
  stefanoGabbana: {
    name: 'Stefano Gabbana',
    born: 1962,
    nationality: 'Italian',
    career: [
      { house: 'dolceGabbana', role: 'Founder', roleDetail: 'Co-founder, co-creative director with Domenico Dolce', start: 1985, end: null },
    ],
  },
  giorgioArmani: {
    name: 'Giorgio Armani',
    born: 1934,
    died: 2025,
    nationality: 'Italian',
    career: [{ house: 'armani', role: 'Founder', roleDetail: 'Founder, creative director', start: 1975, end: 2025 }],
  },
  silvanaArmani: {
    name: 'Silvana Armani',
    nationality: 'Italian',
    career: [{ house: 'armani', role: 'Womenswear Director', start: 2025, end: null, approximate: true }],
  },
  leoDellOrco: {
    name: "Leo Dell'Orco",
    nationality: 'Italian',
    career: [{ house: 'armani', role: 'Menswear Director', start: 2025, end: null, approximate: true }],
  },
  ermenegildoZegna: {
    name: 'Ermenegildo Zegna',
    born: 1892,
    died: 1966,
    nationality: 'Italian',
    career: [{ house: 'zegna', role: 'Founder', roleDetail: 'Wool mill', start: 1910 }],
  },
  stefanoPilati: {
    name: 'Stefano Pilati',
    born: 1965,
    nationality: 'Italian',
    career: [
      { house: 'saintLaurent', role: 'Creative Director', start: 2004, end: 2012 },
      { house: 'zegna', role: 'Creative Director', start: 2013, end: 2016 },
    ],
  },
  alessandroSartori: {
    name: 'Alessandro Sartori',
    nationality: 'Italian',
    career: [
      { house: 'zegna', role: 'Head Designer', roleDetail: 'Z Zegna creative director', start: 2003, end: 2011, approximate: true },
      { house: 'berluti', role: 'Artistic Director', start: 2011, end: 2016 },
      { house: 'zegna', role: 'Artistic Director', start: 2016, end: null },
    ],
  },
  nazarenoFonticoli: {
    name: 'Nazareno Fonticoli',
    nationality: 'Italian',
    career: [{ house: 'brioni', role: 'Founder', roleDetail: 'Co-founder, master tailor', start: 1945 }],
  },
  gaetanoSavini: {
    name: 'Gaetano Savini',
    nationality: 'Italian',
    career: [{ house: 'brioni', role: 'Founder', roleDetail: 'Co-founder', start: 1945 }],
  },
  brendanMullane: {
    name: 'Brendan Mullane',
    nationality: 'British',
    career: [{ house: 'brioni', role: 'Creative Director', start: 2012, end: 2015, approximate: true }],
  },
  justinOShea: {
    name: "Justin O'Shea",
    nationality: 'Australian',
    career: [{ house: 'brioni', role: 'Creative Director', start: 2016, end: 2016 }],
  },
  ninaMariaNitsche: {
    name: 'Nina-Maria Nitsche',
    nationality: 'German',
    career: [{ house: 'brioni', role: 'Creative Director', start: 2017, end: 2019, approximate: true }],
  },
  consueloCastiglioni: {
    name: 'Consuelo Castiglioni',
    nationality: 'Swiss-Italian',
    career: [{ house: 'marni', role: 'Founder', roleDetail: 'Founder, creative director', start: 1994, end: 2016 }],
  },
  francescoRisso: {
    name: 'Francesco Risso',
    nationality: 'Italian',
    career: [{ house: 'marni', role: 'Creative Director', start: 2016, end: 2025, notes: 'Stepped down June 2025.' }],
  },
  renzoRosso: {
    name: 'Renzo Rosso',
    born: 1955,
    nationality: 'Italian',
    career: [{ house: 'diesel', role: 'Founder', start: 1978, end: null }],
  },
  massimoOsti: {
    name: 'Massimo Osti',
    born: 1944,
    died: 2005,
    nationality: 'Italian',
    career: [
      { house: 'cpCompany', role: 'Founder', roleDetail: 'Founder, designer', start: 1971, end: 1994, approximate: true },
      { house: 'stoneIsland', role: 'Founder', roleDetail: 'Founder, designer', start: 1982, end: 1995, approximate: true },
    ],
  },
  morenoFerrari: {
    name: 'Moreno Ferrari',
    nationality: 'Italian',
    career: [{ house: 'cpCompany', role: 'Head Designer', start: 1994, end: 2010, approximate: true }],
  },
  paulHarvey: {
    name: 'Paul Harvey',
    nationality: 'British',
    career: [{ house: 'stoneIsland', role: 'Head Designer', start: 1996, end: 2008 }],
  },
  francescoRagazzi: {
    name: 'Francesco Ragazzi',
    nationality: 'Italian',
    career: [
      { house: 'palmAngels', role: 'Founder', roleDetail: 'Founder, creative director', start: 2015, end: null },
    ],
  },
  rositaMissoni: {
    name: 'Rosita Missoni',
    born: 1931,
    nationality: 'Italian',
    career: [
      { house: 'missoni', role: 'Founder', roleDetail: 'Co-founder with Ottavio Missoni, designer', start: 1953, end: 1997 },
    ],
  },
  ottavioMissoni: {
    name: 'Ottavio Missoni',
    born: 1921,
    died: 2013,
    nationality: 'Italian',
    career: [{ house: 'missoni', role: 'Founder', roleDetail: 'Co-founder with Rosita Missoni', start: 1953 }],
  },
  angelaMissoni: {
    name: 'Angela Missoni',
    nationality: 'Italian',
    career: [{ house: 'missoni', role: 'Creative Director', start: 1997, end: 2021 }],
  },
  albertoCaliri: {
    name: 'Alberto Caliri',
    nationality: 'Italian',
    career: [
      { house: 'missoni', role: 'Creative Director', start: 2021, end: 2022, notes: 'With Missoni since 1998.' },
      { house: 'missoni', role: 'Creative Director', start: 2024, end: null, notes: 'Returned October 2024.' },
    ],
  },
  filippoGrazioli: {
    name: 'Filippo Grazioli',
    nationality: 'Italian',
    career: [{ house: 'missoni', role: 'Creative Director', start: 2022, end: 2024 }],
  },
  achilleMaramotti: {
    name: 'Achille Maramotti',
    born: 1927,
    died: 2005,
    nationality: 'Italian',
    career: [{ house: 'maxMara', role: 'Founder', start: 1951, end: 2005 }],
  },
  ianGriffiths: {
    name: 'Ian Griffiths',
    nationality: 'British',
    career: [{ house: 'maxMara', role: 'Creative Director', start: 2005, end: null, approximate: true }],
  },
  canaliFamily: {
    name: 'Giovanni & Giacomo Canali',
    nationality: 'Italian',
    career: [{ house: 'canali', role: 'Founder', roleDetail: 'Founding brothers', start: 1934 }],
  },
  francescaRinaldo: {
    name: 'Francesca Rinaldo',
    nationality: 'Italian',
    career: [{ house: 'goldenGoose', role: 'Founder', roleDetail: 'Co-founder with Alessandro Gallo', start: 2000 }],
  },
  alessandroGallo: {
    name: 'Alessandro Gallo',
    nationality: 'Italian',
    career: [{ house: 'goldenGoose', role: 'Founder', roleDetail: 'Co-founder with Francesca Rinaldo', start: 2000 }],
  },
  francoMoschino: {
    name: 'Franco Moschino',
    born: 1950,
    died: 1994,
    nationality: 'Italian',
    career: [{ house: 'moschino', role: 'Founder', start: 1983, end: 1994 }],
  },
  rossellaJardini: {
    name: 'Rossella Jardini',
    nationality: 'Italian',
    career: [{ house: 'moschino', role: 'Creative Director', start: 1994, end: 2013 }],
  },
  jeremyScott: {
    name: 'Jeremy Scott',
    born: 1975,
    nationality: 'American',
    career: [
      { house: 'jeremyScottLabel', role: 'Founder', roleDetail: 'Founder, designer', start: 1997, end: null },
      { house: 'moschino', role: 'Creative Director', start: 2013, end: 2023 },
    ],
  },
  davideRenne: {
    name: 'Davide Renne',
    died: 2023,
    nationality: 'Italian',
    career: [
      {
        house: 'moschino',
        role: 'Creative Director',
        start: 2023,
        end: 2023,
        notes: 'Died weeks after his appointment, before showing a collection.',
      },
    ],
  },
  adrianAppiolaza: {
    name: 'Adrian Appiolaza',
    nationality: 'Argentine',
    career: [{ house: 'moschino', role: 'Creative Director', start: 2024, end: null }],
  },
  gimmoEtro: {
    name: 'Gimmo Etro',
    nationality: 'Italian',
    career: [{ house: 'etro', role: 'Founder', start: 1968 }],
  },
  veronicaEtro: {
    name: 'Veronica Etro',
    nationality: 'Italian',
    career: [{ house: 'etro', role: 'Womenswear Director', start: 2000, end: 2022, approximate: true }],
  },
  keanEtro: {
    name: 'Kean Etro',
    nationality: 'Italian',
    career: [{ house: 'etro', role: 'Menswear Director', start: 1990, end: 2022, approximate: true }],
  },
  marcoDeVincenzo: {
    name: 'Marco De Vincenzo',
    nationality: 'Italian',
    career: [{ house: 'etro', role: 'Creative Director', start: 2022, end: null }],
  },

  /* ---------- UK, Nordic, Australian, North American & European labels ---------- */
  simoneRochaDesigner: {
    name: 'Simone Rocha',
    born: 1986,
    nationality: 'Irish',
    career: [{ house: 'simoneRocha', role: 'Founder', roleDetail: 'Founder, creative director', start: 2010, end: null }],
  },
  paulSmithDesigner: {
    name: 'Paul Smith',
    born: 1946,
    nationality: 'British',
    career: [{ house: 'paulSmith', role: 'Founder', roleDetail: 'Founder, creative director', start: 1970, end: null }],
  },
  margaretHowellDesigner: {
    name: 'Margaret Howell',
    born: 1946,
    nationality: 'British',
    career: [{ house: 'margaretHowell', role: 'Founder', roleDetail: 'Founder, creative director', start: 1970, end: null }],
  },
  jockumHallin: {
    name: 'Jockum Hallin',
    nationality: 'Swedish',
    career: [{ house: 'ourLegacy', role: 'Founder', roleDetail: 'Co-founder, co-creative director', start: 2005, end: null }],
  },
  christopherNying: {
    name: 'Christopher Nying',
    nationality: 'Swedish',
    career: [{ house: 'ourLegacy', role: 'Founder', roleDetail: 'Co-founder, co-creative director', start: 2005, end: null }],
  },
  maxSchiller: {
    name: 'Max Schiller',
    nationality: 'Swedish',
    career: [{ house: 'eytys', role: 'Founder', roleDetail: 'Co-founder, creative director', start: 2013, end: null }],
  },
  jonathanHirschfeld: {
    name: 'Jonathan Hirschfeld',
    nationality: 'Swedish',
    career: [{ house: 'eytys', role: 'Founder', roleDetail: 'Co-founder', start: 2013, end: null }],
  },
  markusSchwartz: {
    name: 'Markus Schwartz',
    nationality: 'Swedish',
    career: [
      { house: 'tigerOfSweden', role: 'Founder', roleDetail: 'Co-founder with Hjalmar Nordström', start: 1903 },
    ],
  },
  hjalmarNordstrom: {
    name: 'Hjalmar Nordström',
    nationality: 'Swedish',
    career: [
      { house: 'tigerOfSweden', role: 'Founder', roleDetail: 'Co-founder with Markus Schwartz', start: 1903 },
    ],
  },
  fransTruelsen: {
    name: 'Frans Truelsen',
    nationality: 'Danish',
    career: [
      { house: 'ganni', role: 'Founder', roleDetail: 'Founded as a cashmere label', start: 2000, end: 2009 },
    ],
  },
  ditteReffstrup: {
    name: 'Ditte Reffstrup',
    nationality: 'Danish',
    career: [
      { house: 'ganni', role: 'Creative Director', start: 2009, end: null },
    ],
  },
  tobiasSlothIvarsen: {
    name: 'Tobias Sloth Ivarsen',
    nationality: 'Danish',
    career: [{ house: 'norseProjects', role: 'Founder', roleDetail: 'Co-founder', start: 2004, end: null }],
  },
  antonKirkHauge: {
    name: 'Anton Kirk Hauge',
    nationality: 'Danish',
    career: [{ house: 'norseProjects', role: 'Founder', roleDetail: 'Co-founder', start: 2004, end: null }],
  },
  mikkelGronnebaek: {
    name: 'Mikkel Grønnebæk',
    nationality: 'Danish',
    career: [{ house: 'norseProjects', role: 'Founder', roleDetail: 'Co-founder', start: 2004, end: null }],
  },
  nickyZimmermann: {
    name: 'Nicky Zimmermann',
    nationality: 'Australian',
    career: [{ house: 'zimmermann', role: 'Founder', roleDetail: 'Co-founder, creative director', start: 1991, end: null }],
  },
  simoneZimmermann: {
    name: 'Simone Zimmermann',
    nationality: 'Australian',
    career: [{ house: 'zimmermann', role: 'Founder', roleDetail: 'Co-founder', start: 1991, end: null }],
  },
  georgeGorrow: {
    name: 'George Gorrow',
    nationality: 'Australian',
    career: [{ house: 'ksubi', role: 'Founder', roleDetail: 'Co-founder', start: 1999, end: null }],
  },
  danSingle: {
    name: 'Dan Single',
    nationality: 'Australian',
    career: [{ house: 'ksubi', role: 'Founder', roleDetail: 'Co-founder', start: 1999, end: null }],
  },
  dionLeeDesigner: {
    name: 'Dion Lee',
    nationality: 'Australian',
    career: [{ house: 'dionLee', role: 'Founder', roleDetail: 'Founder, creative director', start: 2009, end: 2024 }],
  },
  samTick: {
    name: 'Sam Tick',
    nationality: 'Canadian',
    career: [
      { house: 'canadaGoose', role: 'Founder', roleDetail: 'Founded Metro Sportswear', start: 1957 },
    ],
  },
  daveLane: {
    name: 'Dave Lane',
    nationality: 'Canadian',
    career: [
      { house: 'arcteryx', role: 'Founder', start: 1989 },
    ],
  },
  hugoBossFounder: {
    name: 'Hugo Boss',
    born: 1885,
    died: 1948,
    nationality: 'German',
    career: [
      { house: 'hugoBoss', role: 'Founder', start: 1924, end: 1948 },
    ],
  },
  jasonWu: {
    name: 'Jason Wu',
    born: 1982,
    nationality: 'Taiwanese-American',
    career: [
      { house: 'hugoBoss', role: 'Artistic Director', roleDetail: 'Boss womenswear', start: 2013, end: 2016, approximate: true },
    ],
  },
  ingoWilts: {
    name: 'Ingo Wilts',
    nationality: 'German',
    career: [
      {
        house: 'hugoBoss',
        role: 'Creative Director',
        roleDetail: 'Chief Brand Officer',
        start: 2016,
        end: 2023,
        approximate: true,
        notes: 'Led Boss design for years before becoming Chief Brand Officer.',
      },
    ],
  },
  marcoFalcioni: {
    name: 'Marco Falcioni',
    nationality: 'Italian',
    career: [
      {
        house: 'hugoBoss',
        role: 'Creative Director',
        roleDetail: 'Senior Vice President, Creative Direction',
        start: 2023,
        end: null,
        approximate: true,
      },
    ],
  },
  cosimaGadient: {
    name: 'Cosima Gadient',
    nationality: 'Swiss',
    career: [{ house: 'ottolinger', role: 'Founder', roleDetail: 'Co-founder, co-creative director', start: 2015, end: null }],
  },
  christaBosch: {
    name: 'Christa Bösch',
    nationality: 'Swiss',
    career: [{ house: 'ottolinger', role: 'Founder', roleDetail: 'Co-founder, co-creative director', start: 2015, end: null }],
  },
  benjaminHuseby: {
    name: 'Benjamin Alexander Huseby',
    nationality: 'Norwegian',
    career: [{ house: 'gmbh', role: 'Founder', roleDetail: 'Co-founder, co-creative director', start: 2016, end: null }],
  },
  serhatIsik: {
    name: 'Serhat Işık',
    nationality: 'German',
    career: [{ house: 'gmbh', role: 'Founder', roleDetail: 'Co-founder, co-creative director', start: 2016, end: null }],
  },
  irisVanHerpenDesigner: {
    name: 'Iris van Herpen',
    born: 1984,
    nationality: 'Dutch',
    career: [{ house: 'irisVanHerpen', role: 'Founder', roleDetail: 'Founder, creative director', start: 2007, end: null }],
  },
  helmutLangDesigner: {
    name: 'Helmut Lang',
    born: 1956,
    nationality: 'Austrian',
    career: [
      { house: 'helmutLang', role: 'Founder', roleDetail: 'Founder, creative director', start: 1986, end: 2005 },
    ],
  },
  michaelColovos: {
    name: 'Michael Colovos',
    nationality: 'American',
    career: [
      { house: 'helmutLang', role: 'Co-Creative Director', roleDetail: 'with Nicole Colovos', start: 2007, end: 2014, approximate: true },
    ],
  },
  nicoleColovos: {
    name: 'Nicole Colovos',
    nationality: 'American',
    career: [
      { house: 'helmutLang', role: 'Co-Creative Director', roleDetail: 'with Michael Colovos', start: 2007, end: 2014, approximate: true },
    ],
  },
  shayneOliver: {
    name: 'Shayne Oliver',
    nationality: 'American',
    career: [
      {
        house: 'hoodByAir',
        role: 'Founder',
        roleDetail: 'Co-founder, creative director',
        start: 2006,
        end: null,
        notes: 'Label on hiatus 2017–2024.',
      },
      { house: 'helmutLang', role: 'Other', roleDetail: 'Designer-in-residence', start: 2017, end: 2018, approximate: true },
    ],
  },
  carlFranzBally: {
    name: 'Carl Franz Bally',
    born: 1821,
    died: 1899,
    nationality: 'Swiss',
    career: [
      { house: 'bally', role: 'Founder', start: 1851 },
    ],
  },
  pabloCoppola: {
    name: 'Pablo Coppola',
    nationality: 'Argentine',
    career: [
      { house: 'bally', role: 'Creative Director', start: 2016, end: 2018, approximate: true },
    ],
  },
  rhuigiVillasenor: {
    name: 'Rhuigi Villaseñor',
    nationality: 'American',
    career: [
      { house: 'rhude', role: 'Founder', roleDetail: 'Founder, creative director', start: 2015, end: null },
      { house: 'bally', role: 'Creative Director', start: 2022, end: 2023 },
    ],
  },
  yohanSerfaty: {
    name: 'Yohan Serfaty',
    died: 2013,
    nationality: 'French',
    career: [
      { house: 'yProject', role: 'Founder', start: 2010, end: 2013 },
    ],
  },
  reidBaker: {
    name: 'Reid Baker',
    nationality: 'American',
    career: [{ house: 'ernestWBaker', role: 'Founder', roleDetail: 'Co-founder, co-creative director', start: 2017, end: null }],
  },
  inesAmorim: {
    name: 'Inês Amorim',
    nationality: 'Portuguese',
    career: [{ house: 'ernestWBaker', role: 'Founder', roleDetail: 'Co-founder, co-creative director', start: 2017, end: null }],
  },
  thierryMugler: {
    name: 'Thierry Mugler',
    born: 1948,
    died: 2022,
    nationality: 'French',
    career: [
      { house: 'mugler', role: 'Founder', roleDetail: 'Founder, creative director', start: 1974, end: 2002 },
    ],
  },
  nicolaFormichetti: {
    name: 'Nicola Formichetti',
    nationality: 'Italian-Japanese',
    career: [
      { house: 'mugler', role: 'Creative Director', start: 2010, end: 2013 },
    ],
  },
  davidKoma: {
    name: 'David Koma',
    nationality: 'Georgian-British',
    career: [
      { house: 'mugler', role: 'Creative Director', start: 2013, end: 2017 },
      { house: 'blumarine', role: 'Creative Director', start: 2024, end: null },
    ],
  },
  caseyCadwallader: {
    name: 'Casey Cadwallader',
    nationality: 'American',
    career: [
      { house: 'mugler', role: 'Creative Director', start: 2017, end: 2024 },
    ],
  },
  miguelCastroFreitas: {
    name: 'Miguel Castro Freitas',
    nationality: 'Portuguese',
    career: [
      { house: 'mugler', role: 'Creative Director', start: 2025, end: null, approximate: true },
    ],
  },
  sandraSandor: {
    name: 'Sandra Sándor',
    nationality: 'Hungarian',
    career: [{ house: 'nanushka', role: 'Founder', roleDetail: 'Founder, creative director', start: 2005, end: null }],
  },
  alejandroGomezPalomo: {
    name: 'Alejandro Gómez Palomo',
    nationality: 'Spanish',
    career: [{ house: 'palomoSpain', role: 'Founder', roleDetail: 'Founder, creative director', start: 2015, end: null }],
  },

  /* ---------- Copenhagen ---------- */
  juliusJuul: {
    name: 'Julius Juul',
    nationality: 'Danish',
    career: [{ house: 'heliotEmil', role: 'Founder', roleDetail: 'Co-founder with Victor Juul', start: 2017, end: null }],
  },
  victorJuul: {
    name: 'Victor Juul',
    nationality: 'Danish',
    career: [{ house: 'heliotEmil', role: 'Founder', roleDetail: 'Co-founder with Julius Juul', start: 2017, end: null }],
  },
  sigurdBank: {
    name: 'Sigurd Bank',
    nationality: 'Danish',
    career: [{ house: 'mfpen', role: 'Founder', roleDetail: 'Founder, creative director', start: 2016, end: null }],
  },

  /* ---------- Tokyo streetwear & menswear ---------- */
  shinsukeTakizawa: {
    name: 'Shinsuke Takizawa',
    nationality: 'Japanese',
    career: [{ house: 'neighborhood', role: 'Founder', roleDetail: 'Founder, creative director', start: 1994, end: null }],
  },
  takahiroMiyashita: {
    name: 'Takahiro Miyashita',
    born: 1973,
    nationality: 'Japanese',
    career: [
      { house: 'numberNine', role: 'Founder', roleDetail: 'Founder, designer', start: 1996, end: 2009 },
      { house: 'theSoloist', role: 'Founder', roleDetail: 'Founder, designer', start: 2010, end: null },
    ],
  },
  masaakiHonma: {
    name: 'Masaaki Honma',
    nationality: 'Japanese',
    career: [{ house: 'mastermindJapan', role: 'Founder', roleDetail: 'Founder, designer', start: 1997, end: null }],
  },
  atsuhikoMori: {
    name: 'Atsuhiko Mori',
    nationality: 'Japanese',
    career: [{ house: 'wackoMaria', role: 'Founder', roleDetail: 'Co-founder with Keiji Ishizuka', start: 2005, end: null }],
  },
  keijiIshizuka: {
    name: 'Keiji Ishizuka',
    nationality: 'Japanese',
    career: [{ house: 'wackoMaria', role: 'Founder', roleDetail: 'Co-founder with Atsuhiko Mori', start: 2005, end: null }],
  },
  ryoKashiwazaki: {
    name: 'Ryo Kashiwazaki',
    nationality: 'Japanese',
    career: [{ house: 'henderScheme', role: 'Founder', roleDetail: 'Founder, designer', start: 2010, end: null }],
  },
  sk8thing: {
    name: 'Sk8thing',
    nationality: 'Japanese',
    career: [{ house: 'cavEmpt', role: 'Founder', roleDetail: 'Co-founder, designer', start: 2011, end: null }],
  },
  tobyFeltwell: {
    name: 'Toby Feltwell',
    nationality: 'British',
    career: [{ house: 'cavEmpt', role: 'Founder', roleDetail: 'Co-founder', start: 2011, end: null }],
  },
  fumitoGanryu: {
    name: 'Fumito Ganryu',
    nationality: 'Japanese',
    career: [
      {
        house: 'commeDesGarcons',
        role: 'Head Designer',
        roleDetail: 'Ganryu line',
        start: 2008,
        end: 2017,
        approximate: true,
      },
      { house: 'fumitoGanryu', role: 'Founder', roleDetail: 'Founder, designer', start: 2017, end: null },
    ],
  },
  kazumaShigematsu: {
    name: 'Kazuma Shigematsu',
    nationality: 'Japanese',
    // Start year approximate (label launched around 2020); confirm and drop the ~.
    career: [{ house: 'aPresse', role: 'Founder', roleDetail: 'Founder, creative director', start: 2020, end: null, approximate: true }],
  },
  kiichiroAsakawa: {
    name: 'Kiichiro Asakawa',
    nationality: 'Japanese',
    // Start year approximate; confirm and drop the ~.
    career: [
      { house: 'ssstein', role: 'Founder', roleDetail: 'Founder, creative director', start: 2016, end: null, approximate: true },
    ],
  },
  norioTerada: {
    name: 'Norio Terada',
    nationality: 'Japanese',
    career: [{ house: 'yoke', role: 'Founder', roleDetail: 'Founder, creative director', start: 2018, end: null }],
  },
  kanameNagaoka: {
    name: 'Kaname Nagaoka',
    nationality: 'Japanese',
    career: [{ house: 'south2West8', role: 'Founder', roleDetail: 'Founder, designer', start: 2002, end: null }],
  },
  shinsukeKojima: {
    name: 'Shinsuke Kojima',
    nationality: 'Japanese',
    // Start year approximate; confirm and drop the ~.
    career: [
      { house: 'kaptainSunshine', role: 'Founder', roleDetail: 'Founder, creative director', start: 2013, end: null, approximate: true },
    ],
  },
  daikiSuzuki: {
    name: 'Daiki Suzuki',
    nationality: 'Japanese',
    career: [
      { house: 'engineeredGarments', role: 'Founder', roleDetail: 'Founder, designer', start: 1999, end: null },
    ],
  },

  /* ---------- Los Angeles labels ---------- */
  richardStark: {
    name: 'Richard Stark',
    nationality: 'American',
    career: [{ house: 'chromeHearts', role: 'Founder', roleDetail: 'Co-founder, creative director', start: 1988, end: null }],
  },
  gregChait: {
    name: 'Greg Chait',
    nationality: 'American',
    career: [{ house: 'theElderStatesman', role: 'Founder', roleDetail: 'Founder, creative director', start: 2007, end: null }],
  },
  henriAlexanderLevy: {
    name: 'Henri Alexander Levy',
    nationality: 'American',
    career: [
      { house: 'enfantsRichesDeprimes', role: 'Founder', roleDetail: 'Founder, creative director', start: 2012, end: null },
    ],
  },
  johnElliottDesigner: {
    name: 'John Elliott',
    nationality: 'American',
    career: [{ house: 'johnElliott', role: 'Founder', roleDetail: 'Founder, creative director', start: 2012, end: null }],
  },
  guillermoAndrade: {
    name: 'Guillermo Andrade',
    nationality: 'American',
    // Start year approximate; confirm and drop the ~.
    career: [
      { house: 'fourTwoFour', role: 'Founder', roleDetail: 'Founder, creative director', start: 2014, end: null, approximate: true },
    ],
  },
  kyleNg: {
    name: 'Kyle Ng',
    nationality: 'American',
    career: [{ house: 'brainDead', role: 'Founder', roleDetail: 'Co-founder with Ed Davis', start: 2014, end: null }],
  },
  edDavis: {
    name: 'Ed Davis',
    nationality: 'British',
    career: [{ house: 'brainDead', role: 'Founder', roleDetail: 'Co-founder with Kyle Ng', start: 2014, end: null }],
  },
  josueThomas: {
    name: 'Josué Thomas',
    nationality: 'American',
    career: [{ house: 'galleryDept', role: 'Founder', roleDetail: 'Founder, creative director', start: 2016, end: null }],
  },
  eliRussellLinnetz: {
    name: 'Eli Russell Linnetz',
    nationality: 'American',
    career: [{ house: 'erl', role: 'Founder', roleDetail: 'Founder, creative director', start: 2018, end: null }],
  },

  shawnStussy: {
    name: 'Shawn Stussy',
    born: 1954,
    nationality: 'American',
    career: [{ house: 'stussy', role: 'Founder', roleDetail: 'Founder, designer', start: 1980, end: 1996 }],
  },
  christianLouboutinDesigner: {
    name: 'Christian Louboutin',
    born: 1963,
    nationality: 'French',
    career: [
      { house: 'christianLouboutin', role: 'Founder', roleDetail: 'Founder, creative director', start: 1991, end: null },
    ],
  },

  /* ---------- Founders & eras for established houses ---------- */
  christianDior: {
    name: 'Christian Dior',
    born: 1905,
    died: 1957,
    nationality: 'French',
    career: [
      { house: 'dior', role: 'Founder', start: 1946, end: 1957 },
    ],
  },
  marcBohan: {
    name: 'Marc Bohan',
    born: 1926,
    nationality: 'French',
    career: [
      { house: 'dior', role: 'Artistic Director', start: 1961, end: 1989 },
    ],
  },
  gianfrancoFerre: {
    name: 'Gianfranco Ferré',
    born: 1944,
    died: 2007,
    nationality: 'Italian',
    career: [
      { house: 'dior', role: 'Artistic Director', start: 1989, end: 1996 },
    ],
  },
  guccioGucci: {
    name: 'Guccio Gucci',
    born: 1881,
    died: 1953,
    nationality: 'Italian',
    career: [
      { house: 'gucci', role: 'Founder', start: 1921, end: 1953 },
    ],
  },
  fridaGiannini: {
    name: 'Frida Giannini',
    nationality: 'Italian',
    career: [
      { house: 'gucci', role: 'Creative Director', start: 2006, end: 2014 },
    ],
  },
  sabatoDeSarno: {
    name: 'Sabato De Sarno',
    nationality: 'Italian',
    career: [
      { house: 'gucci', role: 'Creative Director', start: 2023, end: 2025 },
    ],
  },
  alessandraFacchinetti: {
    name: 'Alessandra Facchinetti',
    nationality: 'Italian',
    career: [
      { house: 'gucci', role: 'Womenswear Director', start: 2004, end: 2005 },
      { house: 'moncler', role: 'Creative Director', roleDetail: 'Moncler Gamme Rouge (womenswear)', start: 2006, end: 2008 },
      { house: 'valentino', role: 'Creative Director', start: 2008, end: 2008 },
      { house: 'tods', role: 'Womenswear Director', start: 2013, end: 2016 },
    ],
  },
  valentinoGaravani: {
    name: 'Valentino Garavani',
    born: 1932,
    nationality: 'Italian',
    career: [
      { house: 'valentino', role: 'Founder', roleDetail: 'Founder, designer', start: 1960, end: 2008 },
    ],
  },
  cocoChanel: {
    name: 'Gabrielle "Coco" Chanel',
    born: 1883,
    died: 1971,
    nationality: 'French',
    career: [
      { house: 'chanel', role: 'Founder', start: 1910, end: 1971, notes: 'The house was closed from 1939 to 1954.' },
    ],
  },
  hubertDeGivenchy: {
    name: 'Hubert de Givenchy',
    born: 1927,
    died: 2018,
    nationality: 'French',
    career: [
      { house: 'givenchy', role: 'Founder', start: 1952, end: 1995 },
    ],
  },
  julienMacdonald: {
    name: 'Julien Macdonald',
    nationality: 'British',
    career: [
      { house: 'givenchy', role: 'Creative Director', start: 2001, end: 2004 },
    ],
  },
  matthewMWilliams: {
    name: 'Matthew M. Williams',
    nationality: 'American',
    career: [
      { house: 'alyx', role: 'Founder', roleDetail: 'Founder, designer', start: 2015, end: null },
      { house: 'givenchy', role: 'Creative Director', start: 2020, end: 2023 },
    ],
  },
  cristobalBalenciaga: {
    name: 'Cristóbal Balenciaga',
    born: 1895,
    died: 1972,
    nationality: 'Spanish',
    career: [
      { house: 'balenciaga', role: 'Founder', start: 1917, end: 1968 },
    ],
  },
  michelGoma: {
    name: 'Michel Goma',
    nationality: 'French',
    career: [
      { house: 'balenciaga', role: 'Creative Director', start: 1987, end: 1992, approximate: true },
    ],
  },
  josephusThimister: {
    name: 'Josephus Thimister',
    nationality: 'Dutch',
    career: [
      { house: 'balenciaga', role: 'Creative Director', start: 1992, end: 1997, approximate: true },
    ],
  },
  gabyAghion: {
    name: 'Gaby Aghion',
    born: 1921,
    died: 2014,
    nationality: 'French',
    career: [
      { house: 'chloe', role: 'Founder', start: 1952 },
    ],
  },
  martineSitbon: {
    name: 'Martine Sitbon',
    nationality: 'French',
    career: [
      { house: 'chloe', role: 'Creative Director', start: 1987, end: 1991, approximate: true },
    ],
  },
  pauloMelimAndersson: {
    name: 'Paulo Melim Andersson',
    nationality: 'Swedish',
    career: [
      { house: 'chloe', role: 'Creative Director', start: 2006, end: 2008 },
    ],
  },
  hannahMacGibbon: {
    name: 'Hannah MacGibbon',
    nationality: 'British',
    career: [
      { house: 'chloe', role: 'Creative Director', start: 2008, end: 2011 },
    ],
  },
  natachaRamsayLevi: {
    name: 'Natacha Ramsay-Levi',
    nationality: 'French',
    career: [
      { house: 'chloe', role: 'Creative Director', start: 2017, end: 2020 },
    ],
  },
  gabrielaHearst: {
    name: 'Gabriela Hearst',
    nationality: 'Uruguayan',
    career: [
      { house: 'gabrielaHearstLabel', role: 'Founder', roleDetail: 'Founder, creative director', start: 2015, end: null },
      { house: 'chloe', role: 'Creative Director', start: 2020, end: 2023 },
    ],
  },
  chemenaKamali: {
    name: 'Chemena Kamali',
    nationality: 'German',
    career: [
      { house: 'chloe', role: 'Creative Director', start: 2023, end: null },
    ],
  },
  micheleTaddei: {
    name: 'Michele Taddei',
    nationality: 'Italian',
    career: [
      { house: 'bottegaVeneta', role: 'Founder', roleDetail: 'Co-founder with Renzo Zengiaro', start: 1966 },
    ],
  },
  renzoZengiaro: {
    name: 'Renzo Zengiaro',
    nationality: 'Italian',
    career: [
      { house: 'bottegaVeneta', role: 'Founder', roleDetail: 'Co-founder with Michele Taddei', start: 1966 },
    ],
  },
  tomasMaier: {
    name: 'Tomas Maier',
    nationality: 'German',
    career: [
      { house: 'bottegaVeneta', role: 'Creative Director', start: 2001, end: 2018 },
    ],
  },
  louiseTrotter: {
    name: 'Louise Trotter',
    nationality: 'British',
    career: [
      { house: 'lacoste', role: 'Creative Director', start: 2018, end: 2023 },
      { house: 'carven', role: 'Creative Director', start: 2023, end: 2024, notes: 'Joined February 2023; left in December 2024 for Bottega Veneta.' },
      { house: 'bottegaVeneta', role: 'Creative Director', start: 2025, end: null },
    ],
  },
  fendiFounders: {
    name: 'Adele & Edoardo Fendi',
    nationality: 'Italian',
    career: [
      { house: 'fendi', role: 'Founder', roleDetail: 'Founding couple', start: 1925 },
    ],
  },
  silviaVenturiniFendi: {
    name: 'Silvia Venturini Fendi',
    nationality: 'Italian',
    career: [
      { house: 'fendi', role: 'Artistic Director', roleDetail: 'Accessories & menswear; whole house from 2024', start: 1994, end: 2025, approximate: true },
    ],
  },
  celineVipiana: {
    name: 'Céline Vipiana',
    nationality: 'French',
    career: [
      { house: 'celine', role: 'Founder', start: 1945 },
    ],
  },
  michaelKorsDesigner: {
    name: 'Michael Kors',
    born: 1959,
    nationality: 'American',
    career: [
      { house: 'michaelKors', role: 'Founder', roleDetail: 'Founder, creative director', start: 1981, end: null },
      { house: 'celine', role: 'Creative Director', start: 1997, end: 2004 },
    ],
  },
  michaelRider: {
    name: 'Michael Rider',
    nationality: 'American',
    career: [
      { house: 'celine', role: 'Creative Director', start: 2025, end: null },
    ],
  },
  stuartVevers: {
    name: 'Stuart Vevers',
    nationality: 'British',
    career: [
      { house: 'mulberry', role: 'Creative Director', start: 2005, end: 2007, approximate: true },
      { house: 'loewe', role: 'Creative Director', start: 2008, end: 2013 },
      { house: 'coach', role: 'Creative Director', roleDetail: 'Executive creative director', start: 2013, end: null },
    ],
  },
  jackMcCollough: {
    name: 'Jack McCollough',
    nationality: 'American',
    career: [
      { house: 'loewe', role: 'Co-Creative Director', roleDetail: 'with Lazaro Hernandez', start: 2025, end: null },
      { house: 'proenzaSchouler', role: 'Founder', roleDetail: 'Co-founder, co-creative director with Lazaro Hernandez', start: 2002, end: 2025 },
    ],
  },
  lazaroHernandez: {
    name: 'Lazaro Hernandez',
    nationality: 'American',
    career: [
      { house: 'loewe', role: 'Co-Creative Director', roleDetail: 'with Jack McCollough', start: 2025, end: null },
      { house: 'proenzaSchouler', role: 'Founder', roleDetail: 'Co-founder, co-creative director with Jack McCollough', start: 2002, end: 2025 },
    ],
  },

  /* ---------- New houses ---------- */
  ibrahimKamara: {
    name: 'Ibrahim Kamara',
    nationality: 'Sierra Leonean-British',
    career: [
      { house: 'offWhite', role: 'Artistic Director', roleDetail: 'Art & image director', start: 2022, approximate: true },
    ],
  },
  sebastienMeyer: {
    name: 'Sébastien Meyer',
    nationality: 'French',
    career: [
      { house: 'coperni', role: 'Founder', roleDetail: 'Co-founder, co-creative director with Arnaud Vaillant', start: 2013, end: null },
      { house: 'courreges', role: 'Co-Creative Director', roleDetail: 'with Arnaud Vaillant', start: 2015, end: 2017 },
    ],
  },
  arnaudVaillant: {
    name: 'Arnaud Vaillant',
    nationality: 'French',
    career: [
      { house: 'coperni', role: 'Founder', roleDetail: 'Co-founder, co-creative director with Sébastien Meyer', start: 2013, end: null },
      { house: 'courreges', role: 'Co-Creative Director', roleDetail: 'with Sébastien Meyer', start: 2015, end: 2017 },
    ],
  },
  emilioPucciDesigner: {
    name: 'Emilio Pucci',
    born: 1914,
    died: 1992,
    nationality: 'Italian',
    career: [
      { house: 'emilioPucci', role: 'Founder', start: 1947, end: 1992 },
    ],
  },
  christianLacroix: {
    name: 'Christian Lacroix',
    born: 1951,
    nationality: 'French',
    career: [
      { house: 'emilioPucci', role: 'Creative Director', start: 2002, end: 2005 },
    ],
  },
  matthewWilliamson: {
    name: 'Matthew Williamson',
    nationality: 'British',
    career: [
      { house: 'emilioPucci', role: 'Creative Director', start: 2005, end: 2008 },
    ],
  },
  massimoGiorgetti: {
    name: 'Massimo Giorgetti',
    nationality: 'Italian',
    career: [
      { house: 'emilioPucci', role: 'Creative Director', start: 2015, end: 2017 },
    ],
  },
  camilleMiceli: {
    name: 'Camille Miceli',
    nationality: 'French',
    career: [
      { house: 'emilioPucci', role: 'Artistic Director', start: 2021, approximate: true },
    ],
  },
  jeanTouitou: {
    name: 'Jean Touitou',
    nationality: 'French',
    career: [
      { house: 'apc', role: 'Founder', roleDetail: 'Founder, designer', start: 1987, end: null },
    ],
  },
  alexandreMattiussi: {
    name: 'Alexandre Mattiussi',
    nationality: 'French',
    career: [
      { house: 'amiParis', role: 'Founder', roleDetail: 'Founder, creative director', start: 2011, end: null },
    ],
  },
  kikoKostadinovDesigner: {
    name: 'Kiko Kostadinov',
    nationality: 'Bulgarian',
    career: [
      { house: 'kikoKostadinov', role: 'Founder', roleDetail: 'Founder, designer', start: 2016, end: null },
    ],
  },
  levTanju: {
    name: 'Lev Tanju',
    nationality: 'British',
    career: [
      { house: 'palace', role: 'Founder', roleDetail: 'Founder', start: 2009, end: null },
    ],
  },
  reneRamillon: {
    name: 'René Ramillon',
    nationality: 'French',
    career: [
      { house: 'moncler', role: 'Founder', roleDetail: 'Co-founder with André Vincent', start: 1952 },
    ],
  },
  remoRuffini: {
    name: 'Remo Ruffini',
    nationality: 'Italian',
    career: [
      { house: 'moncler', role: 'Other', roleDetail: 'Chairman, creative lead', start: 2003, end: null },
    ],
  },
  masayukiIno: {
    name: 'Masayuki Ino',
    nationality: 'Japanese',
    career: [
      { house: 'doublet', role: 'Founder', roleDetail: 'Founder, designer', start: 2012, end: null },
    ],
  },
  fengChenWangDesigner: {
    name: 'Feng Chen Wang',
    nationality: 'Chinese',
    career: [
      { house: 'fengChenWang', role: 'Founder', roleDetail: 'Founder, designer', start: 2015, end: null },
    ],
  },
  umaWangDesigner: {
    name: 'Uma Wang',
    nationality: 'Chinese',
    career: [
      { house: 'umaWang', role: 'Founder', roleDetail: 'Founder, designer', start: 2005, end: null },
    ],
  },
  gildasLoaec: {
    name: 'Gildas Loaëc',
    nationality: 'French',
    career: [
      { house: 'maisonKitsune', role: 'Founder', roleDetail: 'Co-founder with Masaya Kuroki', start: 2002, end: null },
    ],
  },
  masayaKuroki: {
    name: 'Masaya Kuroki',
    nationality: 'Japanese',
    career: [
      { house: 'maisonKitsune', role: 'Founder', roleDetail: 'Co-founder with Gildas Loaëc', start: 2002, end: null },
    ],
  },
  erdemMoralioglu: {
    name: 'Erdem Moralıoğlu',
    nationality: 'Canadian-British',
    career: [
      { house: 'erdem', role: 'Founder', roleDetail: 'Founder, creative director', start: 2005, end: null },
    ],
  },
  mollyGoddardDesigner: {
    name: 'Molly Goddard',
    nationality: 'British',
    career: [
      { house: 'mollyGoddard', role: 'Founder', roleDetail: 'Founder, designer', start: 2014, end: null },
    ],
  },
  charlesJeffrey: {
    name: 'Charles Jeffrey',
    nationality: 'British',
    career: [
      { house: 'charlesJeffreyLoverboy', role: 'Founder', roleDetail: 'Founder, designer', start: 2015, end: null },
    ],
  },
  alfredDunhill: {
    name: 'Alfred Dunhill',
    born: 1872,
    died: 1959,
    nationality: 'British',
    career: [
      { house: 'dunhill', role: 'Founder', start: 1893 },
    ],
  },
  johnRay: {
    name: 'John Ray',
    nationality: 'British',
    career: [
      { house: 'dunhill', role: 'Creative Director', start: 2013, end: 2017, approximate: true },
    ],
  },
  markWeston: {
    name: 'Mark Weston',
    nationality: 'British',
    career: [
      { house: 'dunhill', role: 'Creative Director', start: 2017, end: 2023 },
    ],
  },
  simonHolloway: {
    name: 'Simon Holloway',
    nationality: 'British',
    career: [
      { house: 'jimmyChoo', role: 'Co-Creative Director', roleDetail: 'with Sandra Choi', start: 2011, end: 2013 },
      { house: 'dunhill', role: 'Creative Director', start: 2023, end: null },
    ],
  },
  willyChavarriaDesigner: {
    name: 'Willy Chavarria',
    nationality: 'American',
    career: [
      { house: 'willyChavarria', role: 'Founder', roleDetail: 'Founder, designer', start: 2015, end: null },
    ],
  },
  telfarClemens: {
    name: 'Telfar Clemens',
    nationality: 'Liberian-American',
    career: [
      { house: 'telfar', role: 'Founder', roleDetail: 'Founder, designer', start: 2005, end: null },
    ],
  },

  /* ---------- New York, Paris & Tokyo additions ---------- */
  rachelScott: {
    name: 'Rachel Scott',
    nationality: 'Jamaican-American',
    career: [
      { house: 'proenzaSchouler', role: 'Creative Director', start: 2025, end: null, approximate: true },
    ],
  },
  lauraKim: {
    name: 'Laura Kim',
    nationality: 'South Korean-American',
    career: [
      { house: 'oscarDeLaRentaHouse', role: 'Co-Creative Director', roleDetail: 'with Fernando Garcia', start: 2016, end: null },
    ],
  },
  fernandoGarcia: {
    name: 'Fernando Garcia',
    nationality: 'Dominican-American',
    career: [
      { house: 'oscarDeLaRentaHouse', role: 'Co-Creative Director', roleDetail: 'with Laura Kim', start: 2016, end: null },
    ],
  },
  ninaRicciDesigner: {
    name: 'Nina Ricci',
    born: 1883,
    died: 1970,
    nationality: 'Italian-French',
    career: [
      { house: 'ninaRicci', role: 'Founder', roleDetail: 'Co-founder with her son Robert Ricci', start: 1932, end: 1959, approximate: true },
    ],
  },
  gerardPipart: {
    name: 'Gérard Pipart',
    nationality: 'French',
    career: [
      { house: 'ninaRicci', role: 'Head Designer', start: 1964, end: 1998, approximate: true },
    ],
  },
  larsNilsson: {
    name: 'Lars Nilsson',
    nationality: 'Swedish',
    career: [
      { house: 'ninaRicci', role: 'Creative Director', start: 2003, end: 2006 },
    ],
  },
  olivierTheyskens: {
    name: 'Olivier Theyskens',
    nationality: 'Belgian',
    career: [
      { house: 'ninaRicci', role: 'Creative Director', start: 2006, end: 2009 },
    ],
  },
  guillaumeHenry: {
    name: 'Guillaume Henry',
    nationality: 'French',
    career: [
      { house: 'carven', role: 'Creative Director', start: 2009, end: 2014 },
      { house: 'ninaRicci', role: 'Creative Director', start: 2015, end: 2018 },
    ],
  },
  rushemyBotter: {
    name: 'Rushemy Botter',
    nationality: 'Dutch-Curaçaoan',
    career: [
      { house: 'botter', role: 'Founder', roleDetail: 'Co-founder with Lisi Herrebrugh', start: 2017, end: null },
      { house: 'ninaRicci', role: 'Co-Creative Director', roleDetail: 'with Lisi Herrebrugh', start: 2018, end: 2022, approximate: true },
    ],
  },
  lisiHerrebrugh: {
    name: 'Lisi Herrebrugh',
    nationality: 'Dutch-Dominican',
    career: [
      { house: 'botter', role: 'Founder', roleDetail: 'Co-founder with Rushemy Botter', start: 2017, end: null },
      { house: 'ninaRicci', role: 'Co-Creative Director', roleDetail: 'with Rushemy Botter', start: 2018, end: 2022, approximate: true },
    ],
  },
  harrisReed: {
    name: 'Harris Reed',
    nationality: 'British',
    career: [
      { house: 'ninaRicci', role: 'Creative Director', start: 2022, approximate: true },
    ],
  },
  hiromichiOchiai: {
    name: 'Hiromichi Ochiai',
    nationality: 'Japanese',
    career: [
      { house: 'facetasm', role: 'Founder', roleDetail: 'Founder, designer', start: 2007, end: null },
    ],
  },
  keizoShimizu: {
    name: 'Keizo Shimizu',
    nationality: 'Japanese',
    career: [
      { house: 'needles', role: 'Founder', roleDetail: 'Founder, designer (Nepenthes)', start: 2003, end: null, approximate: true },
    ],
  },
  takayukiFujii: {
    name: 'Takayuki Fujii',
    nationality: 'Japanese',
    career: [
      { house: 'nonnative', role: 'Founder', roleDetail: 'Designer', start: 1999, end: null, approximate: true },
    ],
  },
  yosukeAizawa: {
    name: 'Yosuke Aizawa',
    nationality: 'Japanese',
    career: [
      { house: 'junyaWatanabe', role: 'Other', roleDetail: 'Designer under Junya Watanabe', start: 2000, end: 2006, approximate: true },
      { house: 'whiteMountaineering', role: 'Founder', roleDetail: 'Founder, designer', start: 2006, end: null },
    ],
  },

  /* ---------- Burberry lineage ---------- */
  thomasBurberry: {
    name: 'Thomas Burberry',
    nationality: 'British',
    // Founder, kept separate from the modern creative-director sequence.
    career: [{ house: 'burberry', role: 'Founder', start: 1856 }],
  },
  robertoMenichetti: {
    name: 'Roberto Menichetti',
    nationality: 'Italian',
    career: [
      { house: 'burberry', role: 'Creative Director', start: 1998, end: 2001, approximate: true },
    ],
  },
  christopherBailey: {
    name: 'Christopher Bailey',
    nationality: 'British',
    career: [{ house: 'burberry', role: 'Creative Director', start: 2001, end: 2018 }],
  },

  /* ---------- London & New York independents ---------- */
  martineRose: {
    name: 'Martine Rose',
    nationality: 'British',
    career: [
      { house: 'martineRose', role: 'Founder', roleDetail: 'Founder, creative director', start: 2007, end: null },
      { house: 'balenciaga', role: 'Creative Director', start: 2026, end: null},
    ],
  },
  craigGreen: {
    name: 'Craig Green',
    nationality: 'British',
    career: [
      { house: 'craigGreen', role: 'Founder', roleDetail: 'Founder, creative director', start: 2012, end: null },
    ],
  },
  graceWalesBonner: {
    name: 'Grace Wales Bonner',
    nationality: 'British',
    career: [
      { house: 'walesBonner', role: 'Founder', roleDetail: 'Founder, creative director', start: 2014, end: null },
      {
        house: 'hermes',
        role: 'Menswear Director',
        roleDetail: "Creative director, men's ready-to-wear",
        start: 2026,
        end: null,
        approximate: true,
        notes: 'Succeeded Véronique Nichanian.',
      },
    ],
  },
  emilyAdamsBode: {
    name: 'Emily Adams Bode Aujla',
    nationality: 'American',
    career: [{ house: 'bode', role: 'Founder', roleDetail: 'Founder, creative director', start: 2016, end: null }],
  },

  /* ---------- Korean designers ---------- */
  wooYoungMi: {
    name: 'Woo Young-mi',
    nationality: 'South Korean',
    career: [
      { house: 'wooyoungmi', role: 'Founder', roleDetail: 'Founder, creative director', start: 2002, end: null },
    ],
  },
  katieChung: {
    name: 'Katie Chung',
    career: [
      { house: 'wooyoungmi', role: 'Creative Director', start: 2014, end: null },
      {
        house: 'mcm',
        role: 'Co-Creative Director',
        roleDetail: 'Creative director (Seoul), with Tina Lutz',
        start: 2023,
        end: null,
        notes: 'Appointed June 2023, alongside her role at Wooyoungmi.',
      },
    ],
  },
  aderErrorCollective: {
    name: 'ADER ERROR design collective',
    // The brand is run by an anonymous multidisciplinary collective, not a named designer.
    career: [
      {
        house: 'aderError',
        role: 'Founder',
        roleDetail: 'Anonymous multidisciplinary collective',
        start: 2014,
        end: null,
      },
    ],
  },
  jungWookJun: {
    name: 'Jung Wook-jun',
    nationality: 'South Korean',
    career: [
      { house: 'juunJ', role: 'Founder', roleDetail: 'Founder, creative director', start: 2007, end: null },
    ],
  },
  hyeinSeo: {
    name: 'Hyein Seo',
    nationality: 'South Korean',
    career: [
      { house: 'hyeinSeo', role: 'Founder', roleDetail: 'Co-founder, creative director', start: 2014, end: null },
    ],
  },
  jinhoLee: {
    name: 'Jinho Lee',
    career: [{ house: 'hyeinSeo', role: 'Founder', roleDetail: 'Co-founder', start: 2014, end: null }],
  },
  kanghyukChoi: {
    name: 'Kanghyuk Choi',
    nationality: 'South Korean',
    career: [
      {
        house: 'kanghyuk',
        role: 'Founder',
        roleDetail: 'Co-founder, co-creative director with Sanglak Shon',
        start: 2017,
        end: null,
      },
    ],
  },
  sanglakShon: {
    name: 'Sanglak Shon',
    nationality: 'South Korean',
    career: [
      {
        house: 'kanghyuk',
        role: 'Founder',
        roleDetail: 'Co-founder, co-creative director with Kanghyuk Choi',
        start: 2017,
        end: null,
      },
    ],
  },
  dongjoonLim: {
    name: 'Dongjoon Lim',
    nationality: 'South Korean',
    career: [
      {
        house: 'postArchiveFaction',
        role: 'Founder',
        roleDetail: 'Co-founder, creative director',
        start: 2018,
        end: null,
      },
    ],
  },
  sookyoJeong: {
    name: 'Sookyo Jeong',
    career: [{ house: 'postArchiveFaction', role: 'Founder', roleDetail: 'Co-founder', start: 2018 }],
  },

  /* ---------- Kenzo lineage ---------- */
  kenzoTakada: {
    name: 'Kenzo Takada',
    born: 1939,
    died: 2020,
    nationality: 'Japanese',
    career: [{ house: 'kenzo', role: 'Founder', start: 1970, end: 1999 }],
  },
  gillesRosier: {
    name: 'Gilles Rosier',
    nationality: 'French',
    career: [
      {
        house: 'kenzo',
        role: 'Creative Director',
        roleDetail: 'Womenswear',
        start: 2000,
        end: 2003,
        approximate: true,
      },
    ],
  },
  antonioMarras: {
    name: 'Antonio Marras',
    nationality: 'Italian',
    career: [{ house: 'kenzo', role: 'Creative Director', start: 2003, end: 2011 }],
  },
  carolLim: {
    name: 'Carol Lim',
    nationality: 'American',
    career: [
      { house: 'openingCeremony', role: 'Founder', roleDetail: 'Co-founder with Humberto Leon', start: 2002, end: 2020, approximate: true },
      {
        house: 'kenzo',
        role: 'Co-Creative Director',
        roleDetail: 'with Humberto Leon',
        start: 2011,
        end: 2019,
      },
    ],
  },
  humbertoLeon: {
    name: 'Humberto Leon',
    nationality: 'American',
    career: [
      { house: 'openingCeremony', role: 'Founder', roleDetail: 'Co-founder with Carol Lim', start: 2002, end: 2020, approximate: true },
      {
        house: 'kenzo',
        role: 'Co-Creative Director',
        roleDetail: 'with Carol Lim',
        start: 2011,
        end: 2019,
      },
    ],
  },
  felipeOliveiraBaptista: {
    name: 'Felipe Oliveira Baptista',
    nationality: 'Portuguese',
    career: [
      { house: 'lacoste', role: 'Creative Director', start: 2010, end: 2018 },
      { house: 'kenzo', role: 'Creative Director', start: 2019, end: 2021 },
    ],
  },
  ryotaIwai: {
    name: 'Ryota Iwai',
    nationality: 'Japanese',
    career: [{ house: 'auralee', role: 'Founder', start: 2015, end: null }],
  },
  toshikiyoHirata: {
    name: 'Toshikiyo Hirata',
    nationality: 'Japanese',
    career: [{ house: 'kapital', role: 'Founder', start: 1984, approximate: true }],
  },

  /* ---------- Vetements lineage ---------- */
  guramGvasalia: {
    name: 'Guram Gvasalia',
    nationality: 'Georgian',
    career: [
      {
        house: 'vetements',
        role: 'Creative Director',
        start: 2019,
        end: null,
        notes: 'Led a collective design team 2019–2021 before taking the title himself.',
      },
    ],
  },

  /* ---------- Calvin Klein lineage ---------- */
  calvinKlein: {
    name: 'Calvin Klein',
    nationality: 'American',
    career: [
      {
        house: 'calvinKlein',
        role: 'Founder',
        roleDetail: 'Overall creative direction',
        start: 1968,
        end: 2003,
      },
    ],
  },
  franciscoCosta: {
    name: 'Francisco Costa',
    career: [
      { house: 'calvinKlein', role: 'Creative Director', roleDetail: "Women's Collection", start: 2003, end: 2016 },
    ],
  },
  italoZucchelli: {
    name: 'Italo Zucchelli',
    career: [
      { house: 'calvinKlein', role: 'Creative Director', roleDetail: "Men's Collection", start: 2003, end: 2016 },
    ],
  },
  veronicaLeoni: {
    name: 'Veronica Leoni',
    career: [
      {
        house: 'calvinKlein',
        role: 'Creative Director',
        roleDetail: 'Calvin Klein Collection',
        start: 2024,
        end: 2026,
        notes: 'Appointed May 2024; departed 15 October 2026 after four collections.',
        sources: ['British Vogue'],
      },
    ],
  },

  /* ---------- Louis Vuitton lineage ---------- */
  louisVuitton: {
    name: 'Louis Vuitton',
    nationality: 'French',
    career: [
      {
        house: 'louisVuitton',
        role: 'Founder',
        roleDetail: 'Trunks & leather goods',
        start: 1854,
        end: 1892,
      },
    ],
  },
  georgesVuitton: {
    name: 'Georges Vuitton',
    nationality: 'French',
    career: [
      {
        house: 'louisVuitton',
        role: 'Head of House',
        roleDetail: 'Family leadership',
        start: 1892,
        end: 1936,
      },
    ],
  },
  gastonLouisVuitton: {
    name: 'Gaston-Louis Vuitton',
    nationality: 'French',
    career: [
      {
        house: 'louisVuitton',
        role: 'Head of House',
        roleDetail: 'Family leadership',
        start: 1936,
        end: 1970,
      },
    ],
  },
  kimJones: {
    name: 'Kim Jones',
    nationality: 'British',
    career: [
      { house: 'louisVuitton', role: 'Artistic Director', roleDetail: 'Menswear', start: 2011, end: 2018 },
      { house: 'dunhill', role: 'Creative Director', start: 2008, end: 2011 },
      { house: 'dior', role: 'Artistic Director', roleDetail: 'Dior Men', start: 2018, end: 2025 },
      { house: 'fendi', role: 'Artistic Director', roleDetail: 'Womenswear & couture', start: 2020, end: 2024 },
    ],
  },
  virgilAbloh: {
    name: 'Virgil Abloh',
    nationality: 'American',
    career: [
      { house: 'louisVuitton', role: 'Artistic Director', roleDetail: 'Menswear', start: 2018, end: 2021 },
      { house: 'offWhite', role: 'Founder', roleDetail: 'Founder, creative director', start: 2013, end: 2021 },
    ],
  },
  pharrellWilliams: {
    name: 'Pharrell Williams',
    nationality: 'American',
    career: [
      { house: 'billionaireBoysClub', role: 'Founder', roleDetail: 'Co-founder with Nigo', start: 2003, end: null },
      { house: 'louisVuitton', role: 'Creative Director', roleDetail: 'Menswear', start: 2023, end: null },
    ],
  },
  demna: {
    name: 'Demna',
    born: 1981,
    nationality: 'Georgian',
    career: [
      {
        house: 'vetements',
        role: 'Founder',
        roleDetail: 'Co-founder, creative director',
        start: 2014,
        end: 2019,
      },
      { house: 'balenciaga', role: 'Artistic Director', start: 2015, end: 2025 },
      { house: 'gucci', role: 'Artistic Director', start: 2025, end: null },
    ],
  },
  alessandroMichele: {
    name: 'Alessandro Michele',
    born: 1972,
    nationality: 'Italian',
    career: [
      { house: 'gucci', role: 'Creative Director', start: 2015, end: 2022 },
      { house: 'valentino', role: 'Creative Director', start: 2024, end: null },
    ],
  },
  jonathanAnderson: {
    name: 'Jonathan Anderson',
    born: 1984,
    nationality: 'Northern Irish',
    career: [
      { house: 'jwAnderson', role: 'Founder', start: 2008, end: null },
      { house: 'loewe', role: 'Creative Director', start: 2013, end: 2025 },
      { house: 'dior', role: 'Creative Director', start: 2025, end: null },
    ],
  },
  antoineAsselin: {
    name: 'Antoine Asselin',
    nationality: 'Canadian',
    career: [{ house: 'dime', role: 'Founder', roleDetail: 'Co-founder', start: 2011, end: null, approximate: true }],
  },
  philLavoie: {
    name: 'Phil Lavoie',
    nationality: 'Canadian',
    career: [
      {
        house: 'dime',
        role: 'Founder',
        roleDetail: 'Co-founder; co-creative lead',
        start: 2011,
        end: null,
        approximate: true,
        notes: 'Some campaign credits list him as co-creative director with Vincent Tsang.',
      },
    ],
  },
  vincentTsang: {
    name: 'Vincent Tsang',
    career: [
      {
        house: 'dime',
        role: 'Creative Director',
        roleDetail: 'Early creative lead; creative / artistic director',
        start: 2011,
        end: null,
        notes: 'Shaped Dime’s visual identity, branding and graphics. Last confirmed in the role September 2025.',
      },
    ],
  },
  hardyBlechman: {
    name: 'Hardy Blechman',
    nationality: 'British',
    career: [{ house: 'maharishi', role: 'Founder', roleDetail: 'Founder, creative director', start: 1994, end: null }],
  },
  spencerBaduDesigner: {
    name: 'Spencer Badu',
    nationality: 'Canadian',
    career: [
      { house: 'spencerBadu', role: 'Founder', roleDetail: 'Founder, creative director', start: 2015, end: null, approximate: true },
    ],
  },
  justinSaunders: {
    name: 'Justin Saunders',
    nationality: 'Canadian',
    career: [{ house: 'jjjjound', role: 'Founder', roleDetail: 'Founder, creative director', start: 2006, end: null }],
  },
  drake: {
    name: 'Drake',
    born: 1986,
    nationality: 'Canadian',
    career: [{ house: 'ovo', role: 'Founder', roleDetail: 'Co-founder', start: 2008, end: null }],
  },
  oliverElKhatib: {
    name: 'Oliver El-Khatib',
    nationality: 'Canadian',
    career: [{ house: 'ovo', role: 'Founder', roleDetail: 'Co-founder', start: 2008, end: null }],
  },
  noahShebib: {
    name: 'Noah "40" Shebib',
    born: 1983,
    nationality: 'Canadian',
    career: [{ house: 'ovo', role: 'Founder', roleDetail: 'Co-founder', start: 2008, end: null }],
  },
  billGaytten: {
    name: 'Bill Gaytten',
    nationality: 'British',
    career: [
      {
        house: 'johnGalliano',
        role: 'Creative Director',
        start: 2011,
        end: 2014,
        notes: 'Galliano’s long-time right hand; took over after Galliano’s dismissal in 2011.',
      },
    ],
  },
  rogerSaul: {
    name: 'Roger Saul',
    nationality: 'British',
    career: [{ house: 'mulberry', role: 'Founder', start: 1971, end: 2002, approximate: true }],
  },
  emmaHill: {
    name: 'Emma Hill',
    nationality: 'British',
    career: [{ house: 'mulberry', role: 'Creative Director', start: 2008, end: 2013 }],
  },
  johnnyCoca: {
    name: 'Johnny Coca',
    nationality: 'Spanish',
    career: [{ house: 'mulberry', role: 'Creative Director', start: 2015, end: 2019 }],
  },
  jadenSmith: {
    name: 'Jaden Smith',
    born: 1998,
    nationality: 'American',
    career: [
      {
        house: 'christianLouboutin',
        role: 'Creative Director',
        roleDetail: 'Menswear',
        start: 2025,
        end: null,
        notes: 'Appointed January 2025, alongside founder Christian Louboutin. Also founded the label MSFTSrep.',
      },
    ],
  },

  /* ---------- Coach, Lacoste, Courrèges, Tommy Hilfiger, Barbour… ---------- */
  bonnieCashin: {
    name: 'Bonnie Cashin',
    born: 1908,
    died: 2000,
    nationality: 'American',
    career: [{ house: 'coach', role: 'Head Designer', start: 1962, end: 1974 }],
  },
  reedKrakoff: {
    name: 'Reed Krakoff',
    born: 1964,
    nationality: 'American',
    career: [{ house: 'coach', role: 'Creative Director', roleDetail: 'Executive creative director', start: 1996, end: 2013 }],
  },
  reneLacoste: {
    name: 'René Lacoste',
    born: 1904,
    died: 1996,
    nationality: 'French',
    career: [{ house: 'lacoste', role: 'Founder', roleDetail: 'Co-founder with André Gillier', start: 1933 }],
  },
  pelagiaKolotouros: {
    name: 'Pelagia Kolotouros',
    nationality: 'American',
    career: [{ house: 'lacoste', role: 'Creative Director', start: 2023, end: null }],
  },
  andreCourreges: {
    name: 'André Courrèges',
    born: 1923,
    died: 2016,
    nationality: 'French',
    career: [{ house: 'courreges', role: 'Founder', start: 1961 }],
  },
  yolandaZobel: {
    name: 'Yolanda Zobel',
    nationality: 'German',
    career: [{ house: 'courreges', role: 'Artistic Director', start: 2018, end: 2020 }],
  },
  nicolasDiFelice: {
    name: 'Nicolas Di Felice',
    born: 1983,
    nationality: 'Belgian',
    career: [
      {
        house: 'louisVuitton',
        role: 'Other',
        roleDetail: 'Womenswear designer under Nicolas Ghesquière',
        start: 2014,
        end: 2020,
        approximate: true,
      },
      { house: 'courreges', role: 'Artistic Director', start: 2020, end: null },
    ],
  },
  tommyHilfiger: {
    name: 'Tommy Hilfiger',
    born: 1951,
    nationality: 'American',
    career: [{ house: 'tommyHilfiger', role: 'Founder', roleDetail: 'Founder, principal designer', start: 1985, end: null }],
  },
  kerbyJeanRaymond: {
    name: 'Kerby Jean-Raymond',
    born: 1986,
    nationality: 'American',
    career: [{ house: 'pyerMoss', role: 'Founder', roleDetail: 'Founder, creative director', start: 2013, end: null }],
  },
  brunelloCucinelli: {
    name: 'Brunello Cucinelli',
    born: 1953,
    nationality: 'Italian',
    career: [{ house: 'brunelloCucinelli', role: 'Founder', roleDetail: 'Founder, creative director', start: 1978, end: null }],
  },
  johnBarbour: {
    name: 'John Barbour',
    died: 1918,
    nationality: 'Scottish',
    career: [{ house: 'barbour', role: 'Founder', start: 1894, end: 1918 }],
  },

  /* ---------- Streetwear: Supreme alumni, NY, London, Amsterdam, Tokyo ---------- */
  tremaineEmory: {
    name: 'Tremaine Emory',
    nationality: 'American',
    career: [
      { house: 'denimTears', role: 'Founder', roleDetail: 'Founder, creative director', start: 2019, end: null },
      { house: 'supreme', role: 'Creative Director', start: 2022, end: 2023, notes: 'Appointed February 2022; resigned August 2023.' },
    ],
  },
  brendonBabenzien: {
    name: 'Brendon Babenzien',
    nationality: 'American',
    career: [
      { house: 'supreme', role: 'Creative Director', start: 2000, end: 2015, approximate: true },
      { house: 'noah', role: 'Founder', roleDetail: 'Co-founder, creative director', start: 2015, end: null },
    ],
    notes: 'Also creative director of J.Crew menswear from 2021.',
  },
  estelleBaileyBabenzien: {
    name: 'Estelle Bailey-Babenzien',
    nationality: 'American',
    career: [{ house: 'noah', role: 'Founder', roleDetail: 'Co-founder', start: 2015, end: null }],
  },
  angeloBaque: {
    name: 'Angelo Baque',
    nationality: 'American',
    career: [
      { house: 'supreme', role: 'Other', roleDetail: 'Brand director', start: 2005, end: 2017, approximate: true },
      { house: 'awakeNy', role: 'Founder', roleDetail: 'Founder, creative director', start: 2012, end: null, approximate: true },
    ],
  },
  heronPreston: {
    name: 'Heron Preston',
    born: 1983,
    nationality: 'American',
    career: [{ house: 'heronPreston', role: 'Founder', roleDetail: 'Founder, creative director', start: 2017, end: null }],
  },
  samuelRoss: {
    name: 'Samuel Ross',
    born: 1991,
    nationality: 'British',
    career: [
      {
        house: 'offWhite',
        role: 'Other',
        roleDetail: 'Assistant to Virgil Abloh',
        start: 2013,
        end: 2015,
        approximate: true,
      },
      { house: 'aColdWall', role: 'Founder', roleDetail: 'Founder, creative director', start: 2015, end: null },
    ],
  },
  ronnieFieg: {
    name: 'Ronnie Fieg',
    born: 1982,
    nationality: 'American',
    career: [{ house: 'kith', role: 'Founder', roleDetail: 'Founder, creative director', start: 2011, end: null }],
  },
  edsonSabajo: {
    name: 'Edson Sabajo',
    nationality: 'Dutch',
    career: [{ house: 'patta', role: 'Founder', roleDetail: 'Co-founder', start: 2004, end: null }],
  },
  guillaumeSchmidt: {
    name: 'Guillaume Schmidt',
    nationality: 'Dutch',
    career: [{ house: 'patta', role: 'Founder', roleDetail: 'Co-founder', start: 2004, end: null }],
  },
  tetsuNishiyama: {
    name: 'Tetsu Nishiyama',
    nationality: 'Japanese',
    career: [{ house: 'wtaps', role: 'Founder', roleDetail: 'Founder, creative director', start: 1996, end: null }],
  },
  hiroshiFujiwara: {
    name: 'Hiroshi Fujiwara',
    born: 1964,
    nationality: 'Japanese',
    career: [
      { house: 'fragmentDesign', role: 'Founder', start: 2003, end: null },
      { house: 'uniformExperiment', role: 'Founder', roleDetail: 'Co-founder with Hirofumi Kiyonaga', start: 2004, end: null, approximate: true },
    ],
  },

  /* ---------- 032c, ACRONYM, MCM, Goyard, Berluti, Jimmy Choo ---------- */
  jorgKoch: {
    name: 'Jörg Koch',
    nationality: 'German',
    career: [{ house: 'thirtyTwoC', role: 'Founder', roleDetail: 'Founder, editor-in-chief', start: 2000, end: null }],
  },
  mariaKoch: {
    name: 'Maria Koch',
    career: [
      { house: 'thirtyTwoC', role: 'Creative Director', roleDetail: '032c apparel', start: 2016, end: null, approximate: true },
    ],
  },
  errolsonHugh: {
    name: 'Errolson Hugh',
    nationality: 'Canadian',
    career: [
      { house: 'acronym', role: 'Founder', roleDetail: 'Co-founder, designer', start: 1994, end: null },
      { house: 'stoneIsland', role: 'Other', roleDetail: 'Designer, Stone Island Shadow Project', start: 2008, approximate: true },
    ],
  },
  michaelaSachenbacher: {
    name: 'Michaela Sachenbacher',
    nationality: 'German',
    career: [{ house: 'acronym', role: 'Founder', roleDetail: 'Co-founder', start: 1994, end: null }],
  },
  michaelCromer: {
    name: 'Michael Cromer',
    nationality: 'German',
    career: [{ house: 'mcm', role: 'Founder', start: 1976 }],
  },
  michaelMichalsky: {
    name: 'Michael Michalsky',
    born: 1967,
    nationality: 'German',
    career: [
      {
        house: 'mcm',
        role: 'Creative Director',
        start: 2006,
        end: 2013,
        notes: 'Appointed when Sung-Joo Kim relaunched MCM in 2006. Previously adidas global creative director.',
      },
    ],
  },
  adrianMargelist: {
    name: 'Adrian Josef Margelist',
    career: [
      {
        house: 'mcm',
        role: 'Creative Director',
        roleDetail: 'Chief creative officer',
        start: 2013,
        end: 2016,
        notes: 'Left for Liebeskind Berlin in early 2016.',
      },
    ],
  },
  dirkSchonberger: {
    name: 'Dirk Schönberger',
    nationality: 'German',
    career: [
      {
        house: 'mcm',
        role: 'Creative Director',
        roleDetail: 'Global creative officer; global brand officer from 2022',
        start: 2018,
        end: 2023,
        notes: 'Joined from adidas (creative director from 2010); set up MCM’s Berlin design studio. Left February 2023.',
      },
    ],
  },
  tinaLutz: {
    name: 'Tina Lutz',
    career: [
      {
        house: 'mcm',
        role: 'Co-Creative Director',
        roleDetail: 'Global creative lead (Milan), with Katie Chung',
        start: 2023,
        end: null,
        notes: 'Appointed June 2023.',
      },
    ],
  },
  francoisGoyard: {
    name: 'François Goyard',
    nationality: 'French',
    career: [{ house: 'goyard', role: 'Founder', start: 1853, end: 1885 }],
  },
  edmondGoyard: {
    name: 'Edmond Goyard',
    nationality: 'French',
    career: [
      { house: 'goyard', role: 'Head of House', roleDetail: 'House leader and historical creative director', start: 1885, end: 1937 },
    ],
  },
  robertGoyard: {
    name: 'Robert Goyard',
    nationality: 'French',
    career: [
      {
        house: 'goyard',
        role: 'Head of House',
        roleDetail: 'House leader',
        start: 1937,
        end: 1979,
        notes: 'Formal creative-director title unconfirmed.',
      },
    ],
  },
  goyardFamily: {
    name: 'Goyard family',
    nationality: 'French',
    career: [
      {
        house: 'goyard',
        role: 'Head of House',
        roleDetail: 'Family leadership',
        start: 1979,
        end: 1998,
        notes: 'Individual creative appointments unclear. Jean-Michel Signoles bought the house in 1998.',
      },
    ],
  },
  ericBlanchi: {
    name: 'Eric Blanchi',
    career: [{ house: 'goyard', role: 'Creative Director', start: 2011, end: null, approximate: true }],
  },
  alessandroBerluti: {
    name: 'Alessandro Berluti',
    nationality: 'Italian',
    career: [{ house: 'berluti', role: 'Founder', start: 1895 }],
  },
  olgaBerluti: {
    name: 'Olga Berluti',
    born: 1949,
    nationality: 'French',
    career: [{ house: 'berluti', role: 'Head of House', roleDetail: 'Family head of design', start: 1970, end: 2011, approximate: true, notes: 'Joined the family workshop young; led design until Alessandro Sartori arrived in 2011.' }],
  },
  krisVanAssche: {
    name: 'Kris Van Assche',
    born: 1976,
    nationality: 'Belgian',
    career: [
      { house: 'krisVanAsscheLabel', role: 'Founder', roleDetail: 'Founder, designer', start: 2005, end: 2015 },
      { house: 'dior', role: 'Menswear Director', roleDetail: 'Dior Homme', start: 2007, end: 2018 },
      { house: 'berluti', role: 'Artistic Director', start: 2018, end: 2021 },
      { house: 'krisVanAsscheLabel', role: 'Founder', roleDetail: 'Relaunched the label', start: 2026, end: null },
    ],
  },
  jimmyChoo: {
    name: 'Jimmy Choo',
    born: 1948,
    nationality: 'Malaysian',
    career: [{ house: 'jimmyChoo', role: 'Founder', roleDetail: 'Co-founder, original shoemaker and creative influence', start: 1996, end: 2001 }],
  },
  tamaraMellon: {
    name: 'Tamara Mellon',
    born: 1967,
    nationality: 'British',
    career: [{ house: 'jimmyChoo', role: 'Founder', roleDetail: 'Co-founder, chief creative officer', start: 1996, end: 2011 }],
  },
  sandraChoi: {
    name: 'Sandra Choi',
    nationality: 'British',
    career: [
      { house: 'jimmyChoo', role: 'Head Designer', roleDetail: 'Founding design director', start: 1996, end: 2011 },
      { house: 'jimmyChoo', role: 'Co-Creative Director', roleDetail: 'with Simon Holloway', start: 2011, end: 2013 },
      { house: 'jimmyChoo', role: 'Creative Director', roleDetail: 'Sole creative director', start: 2013, end: null },
    ],
    notes: 'Jimmy Choo’s niece; has overseen the collections since the company was founded.',
  },
  yutaHosokawa: {
    name: 'Yuta Hosokawa',
    nationality: 'Japanese',
    career: [
      { house: 'readymade', role: 'Founder', roleDetail: 'Founder, designer', start: 2013, end: null, approximate: true },
      {
        house: 'saintMichael',
        role: 'Founder',
        roleDetail: 'Co-founder with Cali Thornhill DeWitt',
        start: 2019,
        end: null,
        approximate: true,
      },
    ],
  },
  caliThornhillDeWitt: {
    name: 'Cali Thornhill DeWitt',
    nationality: 'Canadian',
    career: [
      {
        house: 'saintMichael',
        role: 'Founder',
        roleDetail: 'Co-founder, artist',
        start: 2019,
        end: null,
        approximate: true,
      },
    ],
  },

  /* ---------- R13, Nahmias, Eckhaus Latta, FA, Noon Goons, Entire Studios, Second/Layer ---------- */
  chrisLeba: {
    name: 'Chris Leba',
    nationality: 'American',
    career: [{ house: 'r13', role: 'Founder', roleDetail: 'Founder, creative director', start: 2009, end: null }],
  },
  doniNahmias: {
    name: 'Doni Nahmias',
    nationality: 'American',
    career: [{ house: 'nahmias', role: 'Founder', roleDetail: 'Founder, creative director', start: 2018, end: null }],
  },
  mikeEckhaus: {
    name: 'Mike Eckhaus',
    nationality: 'American',
    career: [{ house: 'eckhausLatta', role: 'Founder', roleDetail: 'Co-founder, co-designer with Zoe Latta', start: 2011, end: null }],
  },
  zoeLatta: {
    name: 'Zoe Latta',
    nationality: 'American',
    career: [{ house: 'eckhausLatta', role: 'Founder', roleDetail: 'Co-founder, co-designer with Mike Eckhaus', start: 2011, end: null }],
  },
  jasonDill: {
    name: 'Jason Dill',
    nationality: 'American',
    career: [{ house: 'fuckingAwesome', role: 'Founder', roleDetail: 'Founder, creative director', start: 2001, end: null }],
  },
  anthonyVanEngelen: {
    name: 'Anthony Van Engelen',
    nationality: 'American',
    career: [{ house: 'fuckingAwesome', role: 'Founder', roleDetail: 'Co-owner of the skateboard company', start: 2014, end: null }],
  },
  kurtNarmore: {
    name: 'Kurt Narmore',
    nationality: 'American',
    career: [{ house: 'noonGoons', role: 'Founder', roleDetail: 'Founder', start: 2016, end: null }],
  },
  sebastianHunt: {
    name: 'Sebastian Hunt',
    nationality: 'New Zealander',
    career: [{ house: 'entireStudios', role: 'Founder', roleDetail: 'Co-founder, co-creative director', start: 2020, end: null }],
  },
  dylanRichards: {
    name: 'Dylan Richards',
    nationality: 'New Zealander',
    career: [{ house: 'entireStudios', role: 'Founder', roleDetail: 'Co-founder, co-creative director', start: 2020, end: null }],
    notes: 'Also credited as Dylan Richards Diaz.',
  },
  joshuaWillis: {
    name: 'Joshua Willis',
    nationality: 'American',
    career: [{ house: 'secondLayer', role: 'Founder', roleDetail: 'Co-founder', start: 2013, end: null, approximate: true }],
  },
  jacobWillis: {
    name: 'Jacob Willis',
    nationality: 'American',
    career: [{ house: 'secondLayer', role: 'Founder', roleDetail: 'Co-founder', start: 2013, end: null, approximate: true }],
  },
  anthonyFranco: {
    name: 'Anthony Franco',
    nationality: 'American',
    career: [{ house: 'secondLayer', role: 'Founder', roleDetail: 'Co-founder, designer', start: 2013, end: null, approximate: true }],
    notes: 'Also known as Ant De Padovane. Former lead designer at Stüssy.',
  },

  /* ---------- Alexander Wang, Carven, Opening Ceremony, Yeezy, Brooks Brothers… ---------- */
  alexanderWangDesigner: {
    name: 'Alexander Wang',
    born: 1983,
    nationality: 'American',
    career: [
      { house: 'alexanderWang', role: 'Founder', roleDetail: 'Founder, creative director', start: 2005, end: null },
      { house: 'balenciaga', role: 'Creative Director', start: 2012, end: 2015 },
    ],
  },
  marieLouiseCarven: {
    name: 'Marie-Louise Carven',
    born: 1909,
    died: 2015,
    nationality: 'French',
    career: [{ house: 'carven', role: 'Founder', start: 1945 }],
  },
  alexisMartial: {
    name: 'Alexis Martial',
    nationality: 'French',
    career: [
      { house: 'carven', role: 'Co-Creative Director', roleDetail: 'Womenswear, with Adrien Caillaudaud', start: 2014, end: 2016 },
    ],
  },
  adrienCaillaudaud: {
    name: 'Adrien Caillaudaud',
    nationality: 'French',
    career: [
      { house: 'carven', role: 'Co-Creative Director', roleDetail: 'Womenswear, with Alexis Martial', start: 2014, end: 2016 },
    ],
  },
  barnabeHardy: {
    name: 'Barnabé Hardy',
    nationality: 'French',
    career: [{ house: 'carven', role: 'Menswear Director', start: 2015, end: 2016, approximate: true }],
  },
  sergeRuffieux: {
    name: 'Serge Ruffieux',
    nationality: 'Swiss',
    career: [{ house: 'carven', role: 'Creative Director', start: 2017, end: 2018, approximate: true }],
  },
  markThomas: {
    name: 'Mark Thomas',
    nationality: 'British',
    career: [
      {
        house: 'carven',
        role: 'Creative Director',
        start: 2025,
        end: 2026,
        notes: 'Joined in 2023 as head of sartorial and creative collaborations; creative director from March 2025; left April 2026.',
      },
    ],
  },
  kanyeWest: {
    name: 'Kanye West',
    born: 1977,
    nationality: 'American',
    career: [{ house: 'yeezy', role: 'Founder', roleDetail: 'Founder, creative director', start: 2015, end: null }],
  },
  henrySandsBrooks: {
    name: 'Henry Sands Brooks',
    born: 1772,
    died: 1833,
    nationality: 'American',
    career: [{ house: 'brooksBrothers', role: 'Founder', start: 1818, end: 1833 }],
  },
  zacPosen: {
    name: 'Zac Posen',
    born: 1980,
    nationality: 'American',
    career: [{ house: 'brooksBrothers', role: 'Creative Director', start: 2014, end: 2020 }],
    notes: 'Later creative director of Gap Inc. (2024).',
  },
  yoonAhn: {
    name: 'Yoon Ahn',
    born: 1977,
    nationality: 'Korean-American',
    career: [
      { house: 'ambush', role: 'Founder', roleDetail: 'Co-founder, creative director', start: 2008, end: null },
      {
        house: 'dior',
        role: 'Other',
        roleDetail: 'Jewellery: Dior Men from 2018; head of Dior jewellery from 2025',
        start: 2018,
        end: null,
        approximate: true,
      },
    ],
  },
  verbal: {
    name: 'Verbal',
    nationality: 'Japanese',
    career: [{ house: 'ambush', role: 'Founder', roleDetail: 'Co-founder', start: 2008, end: null }],
  },
  teddySantis: {
    name: 'Teddy Santis',
    nationality: 'American',
    career: [{ house: 'aimeLeonDore', role: 'Founder', roleDetail: 'Founder, creative director', start: 2014, end: null }],
    notes: 'Creative director of New Balance Made in USA from 2021.',
  },
  filippoDellaValle: {
    name: 'Filippo Della Valle',
    nationality: 'Italian',
    career: [{ house: 'tods', role: 'Founder', roleDetail: 'Family shoemaking workshop', start: 1920, approximate: true }],
  },
  derekLam: {
    name: 'Derek Lam',
    born: 1966,
    nationality: 'American',
    career: [{ house: 'tods', role: 'Creative Director', start: 2006, end: 2012 }],
  },
  andreaIncontri: {
    name: 'Andrea Incontri',
    nationality: 'Italian',
    career: [{ house: 'tods', role: 'Menswear Director', start: 2014, end: 2019 }],
  },
  walterChiapponi: {
    name: 'Walter Chiapponi',
    nationality: 'Italian',
    career: [
      { house: 'tods', role: 'Creative Director', roleDetail: 'First to oversee the whole line', start: 2019, end: 2023 },
      { house: 'blumarine', role: 'Creative Director', start: 2023, end: 2024, notes: 'One season; left March 2024.' },
    ],
  },
  matteoTamburini: {
    name: 'Matteo Tamburini',
    nationality: 'Italian',
    career: [
      {
        house: 'tods',
        role: 'Creative Director',
        start: 2023,
        end: 2026,
        notes: 'Joined from Bottega Veneta; Tod’s announced his departure in November 2026.',
      },
    ],
  },
  goshaRubchinskiy: {
    name: 'Gosha Rubchinskiy',
    born: 1984,
    nationality: 'Russian',
    career: [
      { house: 'goshaRubchinskiy', role: 'Founder', roleDetail: 'Founder, designer', start: 2008, end: null },
      { house: 'paccbet', role: 'Founder', roleDetail: 'Co-founder with Tolia Titaev', start: 2016, end: null },
      {
        house: 'yeezy',
        role: 'Head Designer',
        roleDetail: 'Head of design',
        start: 2023,
        end: 2025,
        notes: 'Named December 2023; ended the collaboration February 2025.',
      },
    ],
  },
  hirofumiKiyonaga: {
    name: 'Hirofumi Kiyonaga',
    nationality: 'Japanese',
    career: [
      { house: 'sophnet', role: 'Founder', roleDetail: 'Founder, designer', start: 1998, end: null, approximate: true },
      { house: 'uniformExperiment', role: 'Founder', roleDetail: 'Co-founder with Hiroshi Fujiwara', start: 2004, end: null, approximate: true },
    ],
  },
  toliaTitaev: {
    name: 'Tolia Titaev',
    nationality: 'Russian',
    career: [{ house: 'paccbet', role: 'Founder', roleDetail: 'Co-founder, pro skateboarder', start: 2016, end: null }],
  },
  andreyArtyomov: {
    name: 'Andrey Artyomov',
    nationality: 'Russian',
    career: [{ house: 'walkOfShame', role: 'Founder', roleDetail: 'Founder, designer', start: 2011, end: null }],
    notes: 'Also spelled Artemov. Previously worked in fashion media (L’Officiel Russia, Tatler, Dazed & Confused Russia).',
  },
  meryllRogge: {
    name: 'Meryll Rogge',
    nationality: 'Belgian',
    career: [{ house: 'marni', role: 'Creative Director', start: 2025, end: null }],
    notes: 'Previously at Dries Van Noten; won the 2025 ANDAM Fashion Award.',
  },
  marioGrauso: {
    name: 'Mario Grauso',
    nationality: 'Italian',
    career: [{ house: 'bally', role: 'Creative Director', start: 2025, end: null, approximate: true }],
    notes: 'Ex-Gucci; joined Bally owner Regent in April 2025 before taking over creative direction.',
  },

  /* ---------- AVAVAV … Carhartt WIP ---------- */
  beateKarlsson: {
    name: 'Beate Karlsson',
    nationality: 'Swedish',
    career: [
      { house: 'avavav', role: 'Founder', roleDetail: 'Co-founder, creative director', start: 2020, end: null, approximate: true, notes: 'Co-owner from January 2023.' },
    ],
  },
  johannaBlom: {
    name: 'Johanna Blom',
    nationality: 'Swedish',
    career: [
      { house: 'avavav', role: 'Founder', roleDetail: 'Co-founder, CEO', start: 2020, end: null, approximate: true },
    ],
  },
  desireeHeiss: {
    name: 'Desiree Heiss',
    nationality: 'German',
    career: [
      { house: 'bless', role: 'Founder', roleDetail: 'Co-founder with Ines Kaag', start: 1997, end: null },
    ],
  },
  inesKaag: {
    name: 'Ines Kaag',
    nationality: 'German',
    career: [
      { house: 'bless', role: 'Founder', roleDetail: 'Co-founder with Desiree Heiss', start: 1997, end: null },
    ],
  },
  fredPerryDesigner: {
    name: 'Fred Perry',
    born: 1909,
    nationality: 'British',
    career: [
      { house: 'fredPerry', role: 'Founder', roleDetail: 'Co-founder with Tibby Wegner', start: 1952, end: 1995, approximate: true },
    ],
    notes: 'Tennis champion; died 1995.',
  },
  jannikDavidsen: {
    name: 'Jannik Wikkelsø Davidsen',
    nationality: 'Danish',
    career: [
      { house: 'hanKjobenhavn', role: 'Founder', roleDetail: 'Founder, creative director', start: 2008, end: null },
    ],
  },
  hedMaynerDesigner: {
    name: 'Hed Mayner',
    nationality: 'Israeli',
    career: [
      { house: 'hedMayner', role: 'Founder', roleDetail: 'Founder, designer', start: 2015, end: null },
    ],
  },
  colmDillane: {
    name: 'Colm Dillane',
    nationality: 'American',
    career: [
      { house: 'kidSuper', role: 'Founder', roleDetail: 'Founder, creative director', start: 2010, end: null },
      { house: 'louisVuitton', role: 'Other', roleDetail: 'Guest designer, menswear Fall/Winter 2023', start: 2023, end: 2023 },
    ],
  },
  eunhyeShin: {
    name: 'Eunhye Shin',
    nationality: 'South Korean',
    career: [
      { house: 'le17septembre', role: 'Founder', roleDetail: 'Founder, designer', start: 2013, end: null },
    ],
  },
  hungLa: {
    name: 'Hung La',
    nationality: 'Vietnamese-American',
    career: [
      { house: 'luuDan', role: 'Founder', roleDetail: 'Founder, designer', start: 2021, end: null },
    ],
    notes: 'Trained under Nicolas Ghesquière and Phoebe Philo.',
  },
  jessicaJungWe11done: {
    name: 'Jessica Jung',
    nationality: 'South Korean',
    career: [
      { house: 'we11done', role: 'Founder', roleDetail: 'Co-founder with Dami Kwon', start: 2015, end: null },
    ],
  },
  damiKwon: {
    name: 'Dami Kwon',
    nationality: 'South Korean',
    career: [
      { house: 'we11done', role: 'Founder', roleDetail: 'Co-founder with Jessica Jung', start: 2015, end: null },
    ],
  },
  venedaCarterDesigner: {
    name: 'Veneda Carter',
    nationality: 'Danish',
    career: [
      { house: 'venedaCarter', role: 'Founder', roleDetail: 'Founder, designer', start: 2021, end: null, approximate: true },
    ],
    notes: 'Copenhagen-born stylist and model, based in Los Angeles.',
  },
  victoriaBeckhamDesigner: {
    name: 'Victoria Beckham',
    born: 1974,
    nationality: 'British',
    career: [
      { house: 'victoriaBeckham', role: 'Founder', roleDetail: 'Founder, creative director', start: 2008, end: null },
    ],
  },
  marcusWainwright: {
    name: 'Marcus Wainwright',
    nationality: 'British',
    career: [
      { house: 'ragAndBone', role: 'Founder', roleDetail: 'Co-founder; CEO, then chief brand officer', start: 2002, end: 2023 },
    ],
  },
  davidNeville: {
    name: 'David Neville',
    nationality: 'British',
    career: [
      { house: 'ragAndBone', role: 'Founder', roleDetail: 'Co-founder, co-CEO', start: 2002, end: 2016 },
    ],
  },
  brandonSvarc: {
    name: 'Brandon Svarc',
    nationality: 'Canadian',
    career: [
      { house: 'nakedAndFamous', role: 'Founder', roleDetail: 'Founder, designer', start: 2008, end: null },
    ],
  },
  annaMolinari: {
    name: 'Anna Molinari',
    nationality: 'Italian',
    career: [
      { house: 'blumarine', role: 'Founder', roleDetail: 'Co-founder, designer', start: 1977, end: 2019, approximate: true },
    ],
  },
  gianpaoloTarabini: {
    name: 'Gianpaolo Tarabini',
    nationality: 'Italian',
    career: [
      { house: 'blumarine', role: 'Founder', roleDetail: 'Co-founder', start: 1977 },
    ],
  },
  nicolaBrognano: {
    name: 'Nicola Brognano',
    nationality: 'Italian',
    career: [
      { house: 'blumarine', role: 'Creative Director', start: 2019, end: 2023, notes: 'Left October 2023; known for the Y2K revival.' },
    ],
  },
  dohunKim: {
    name: 'Dohun Kim',
    nationality: 'South Korean',
    career: [
      { house: 'anderssonBell', role: 'Founder', roleDetail: 'Founder, creative director', start: 2014, end: null },
    ],
  },
  annaSuiDesigner: {
    name: 'Anna Sui',
    born: 1964,
    nationality: 'American',
    career: [
      { house: 'annaSui', role: 'Founder', roleDetail: 'Founder, designer', start: 1981, end: null },
    ],
  },
  edwinFaeh: {
    name: 'Edwin Faeh',
    nationality: 'Swiss',
    career: [
      { house: 'carharttWip', role: 'Founder', roleDetail: 'Co-founder with Salomée Faeh', start: 1989, end: null },
    ],
  },
  salomeeFaeh: {
    name: 'Salomée Faeh',
    nationality: 'Swiss',
    career: [
      { house: 'carharttWip', role: 'Founder', roleDetail: 'Co-founder with Edwin Faeh', start: 1989, end: null },
    ],
  },
  hannahRoseDalton: {
    name: 'Hannah Rose Dalton',
    nationality: 'Canadian',
    career: [
      { house: 'matieresFecales', role: 'Founder', roleDetail: 'Co-founder, co-creative director with Steven Raj Bhaskaran', start: 2016, end: null },
    ],
  },
  stevenRajBhaskaran: {
    name: 'Steven Raj Bhaskaran',
    nationality: 'Canadian',
    career: [
      { house: 'matieresFecales', role: 'Founder', roleDetail: 'Co-founder, co-creative director with Hannah Rose Dalton', start: 2016, end: null },
    ],
  },
  giambattistaValli: {
    name: 'Giambattista Valli',
    born: 1966,
    nationality: 'Italian',
    career: [
      { house: 'moncler', role: 'Creative Director', roleDetail: 'Moncler Gamme Rouge (womenswear)', start: 2008, end: 2017 },
    ],
  },
  naokiTakizawa: {
    name: 'Naoki Takizawa',
    nationality: 'Japanese',
    career: [{ house: 'isseyMiyake', role: 'Creative Director', start: 1999, end: 2006 }],
  },
  daiFujiwara: {
    name: 'Dai Fujiwara',
    nationality: 'Japanese',
    career: [{ house: 'isseyMiyake', role: 'Creative Director', start: 2006, end: 2011 }],
  },
  yoshiyukiMiyamae: {
    name: 'Yoshiyuki Miyamae',
    nationality: 'Japanese',
    career: [{ house: 'isseyMiyake', role: 'Head Designer', roleDetail: "Women's collection", start: 2011, end: 2019 }],
  },
  satoshiKondo: {
    name: 'Satoshi Kondo',
    nationality: 'Japanese',
    career: [{ house: 'isseyMiyake', role: 'Head Designer', roleDetail: "Women's collection", start: 2019, end: null }],
  },
  taigaTakahashiDesigner: {
    name: 'Taiga Takahashi',
    died: 2022,
    nationality: 'Japanese',
    career: [{ house: 'taigaTakahashi', role: 'Founder', roleDetail: 'Founder, designer', start: 2017, end: 2022 }],
    notes: 'Died April 2022, aged 27. Known for his “applied archaeology” approach to historical garments.',
  },
} satisfies Record<string, DesignerData<HouseId>>;

export type DesignerId = keyof typeof designers;
