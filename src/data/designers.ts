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
    ],
  },
  stellaMcCartney: {
    name: 'Stella McCartney',
    born: 1971,
    nationality: 'British',
    career: [{ house: 'chloe', role: 'Creative Director', start: 1997, end: 2001 }],
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
    career: [{ house: 'jilSander', role: 'Creative Director', start: 2025, end: null }],
  },

  mariaGraziaChiuri: {
    name: 'Maria Grazia Chiuri',
    born: 1964,
    nationality: 'Italian',
    career: [
      { house: 'valentino', role: 'Co-Creative Director', start: 2008, end: 2016 },
      { house: 'dior', role: 'Artistic Director', start: 2016, end: 2025 },
    ],
  },
  pierpaoloPiccioli: {
    name: 'Pierpaolo Piccioli',
    born: 1967,
    nationality: 'Italian',
    career: [
      { house: 'valentino', role: 'Co-Creative Director', start: 2008, end: 2016 },
      { house: 'valentino', role: 'Creative Director', start: 2016, end: 2024 },
      { house: 'balenciaga', role: 'Creative Director', start: 2025, end: null },
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
    career: [{ house: 'yohjiYamamoto', role: 'Founder', start: 1972, end: null }],
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
    // End year left unknown: he stepped back from designing the main line well before 2022.
    career: [{ house: 'isseyMiyake', role: 'Founder', start: 1970 }],
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
    career: [{ house: 'sacai', role: 'Founder', start: 1999, end: null }],
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
    career: [{ house: 'robertoCavalli', role: 'Creative Director', start: 2015, end: 2016 }],
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
    career: [{ house: 'wooyoungmi', role: 'Creative Director', start: 2014, end: null }],
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
    career: [{ house: 'kenzo', role: 'Creative Director', start: 2019, end: 2021 }],
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
    ],
  },
  virgilAbloh: {
    name: 'Virgil Abloh',
    nationality: 'American',
    career: [
      { house: 'louisVuitton', role: 'Artistic Director', roleDetail: 'Menswear', start: 2018, end: 2021 },
    ],
  },
  pharrellWilliams: {
    name: 'Pharrell Williams',
    nationality: 'American',
    career: [
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
} satisfies Record<string, DesignerData<HouseId>>;

export type DesignerId = keyof typeof designers;
