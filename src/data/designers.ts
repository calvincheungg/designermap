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
      { house: 'karlLagerfeldLabel', role: 'Founder', roleDetail: 'Founder, designer', start: 1984, end: 2019 },
      { house: 'balmain', role: 'Other', roleDetail: 'Assistant to Pierre Balmain', start: 1955, end: 1958 },
      { house: 'patou', role: 'Head Designer', start: 1958, end: 1963, sources: ['https://www.patou.com/pages/history-jean-patou', 'https://www.comitecolbert.com/en/members/patou/'] },
      { house: 'chloe', role: 'Head Designer', start: 1964, end: 1983, approximate: true },
      { house: 'fendi', role: 'Creative Director', start: 1965, end: 2019 },
      { house: 'chanel', role: 'Creative Director', start: 1983, end: 2019 },
      { house: 'chloe', role: 'Head Designer', start: 1992, end: 1997, notes: 'Second stint at Chloé.' },
    ],
  },
  virginieViard: {
    name: 'Virginie Viard',
    nationality: 'French',
    career: [
      { house: 'chanel', role: 'Other', roleDetail: 'Karl Lagerfeld\'s studio', start: 1987, end: 1992 },
      { house: 'chloe', role: 'Other', roleDetail: 'Karl Lagerfeld\'s studio', start: 1992, end: 1997, approximate: true },
      { house: 'chanel', role: 'Other', roleDetail: 'Director of Karl Lagerfeld\'s creative studio', start: 1997, end: 2019 },
      { house: 'chanel', role: 'Creative Director', start: 2019, end: 2024 },
    ],
  },
  matthieuBlazy: {
    name: 'Matthieu Blazy',
    nationality: 'French-Belgian',
    career: [
      { house: 'rafSimonsLabel', role: 'Other', roleDetail: 'Menswear designer', start: 2007, end: 2011, approximate: true },
      { house: 'maisonMargiela', role: 'Other', roleDetail: 'Designer, Artisanal and women\'s ready-to-wear', start: 2011, end: 2014, approximate: true },
      { house: 'celine', role: 'Other', roleDetail: 'Senior designer under Phoebe Philo', start: 2014, end: 2016, approximate: true },
      { house: 'calvinKlein', role: 'Other', roleDetail: 'Design director, women\'s ready-to-wear, under Raf Simons', start: 2016, end: 2019 },
      { house: 'bottegaVeneta', role: 'Other', roleDetail: 'Ready-to-wear design director', start: 2020, end: 2021 },
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
      { house: 'gucci', role: 'Other', roleDetail: 'Chief designer, women\'s ready-to-wear', start: 1990, end: 1994, notes: 'Recruited by Dawn Mello.' },
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
      { house: 'saintLaurent', role: 'Menswear Director', roleDetail: 'YSL Rive Gauche Homme', start: 1997, end: 2000 },
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
      { house: 'chloe', role: 'Other', roleDetail: 'Design assistant to Stella McCartney', start: 1997, end: 2001 },
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
      { house: 'calvinKlein', role: 'Other', roleDetail: 'Womenswear designer', start: 1993, end: 1997 },
      { house: 'ralphLauren', role: 'Other', roleDetail: 'Senior menswear designer, Purple Label', start: 1997, end: 2000 },
      { house: 'gucci', role: 'Other', roleDetail: 'Senior womenswear designer under Tom Ford', start: 2000, end: 2005, approximate: true },
      { house: 'chloe', role: 'Creative Director', start: 2011, end: 2017 },
      { house: 'givenchy', role: 'Artistic Director', start: 2017, end: 2020 },
    ],
    notes: 'Creative director of Pringle of Scotland 2005–2011.',
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
      { house: 'alexanderMcQueen', role: 'Other', roleDetail: 'Assistant to Lee McQueen, then head of womenswear design', start: 1996, end: 2010 },
      { house: 'alexanderMcQueen', role: 'Creative Director', start: 2010, end: 2023 },
      { house: 'givenchy', role: 'Creative Director', start: 2024, end: null },
    ],
  },
  seanMcGirr: {
    name: 'Seán McGirr',
    nationality: 'Irish',
    career: [
      { house: 'driesVanNoten', role: 'Other', roleDetail: 'Womenswear designer', start: 2018, end: 2020, approximate: true },
      { house: 'jwAnderson', role: 'Other', roleDetail: 'Head of ready-to-wear', start: 2020, end: 2023, approximate: true },
      { house: 'alexanderMcQueen', role: 'Creative Director', start: 2023, end: 2026, notes: 'Appointed October 2023; departure announced October 2026.' },
    ],
  },
  danielLee: {
    name: 'Daniel Lee',
    born: 1986,
    nationality: 'British',
    career: [
      { house: 'maisonMargiela', role: 'Other', roleDetail: 'Intern', start: 2009, end: 2009, approximate: true, notes: 'While a student; exact year unconfirmed.' },
      { house: 'balenciaga', role: 'Other', roleDetail: 'Intern under Nicolas Ghesquière', start: 2010, end: 2010, approximate: true, notes: 'While a student; exact year unconfirmed.' },
      { house: 'celine', role: 'Other', roleDetail: 'Director of ready-to-wear under Phoebe Philo', start: 2012, end: 2018 },
      { house: 'bottegaVeneta', role: 'Creative Director', start: 2018, end: 2021 },
      { house: 'burberry', role: 'Creative Director', start: 2022, end: null },
    ],
    notes: 'Briefly at Donna Karan in New York before joining Celine.',
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
    career: [
      { house: 'gucci', role: 'Other', roleDetail: 'Design director, alongside Tom Ford', start: 2000, end: 2000, approximate: true },
      { house: 'jilSander', role: 'Creative Director', start: 2000, end: 2003 },
    ],
  },
  rodolfoPaglialunga: {
    name: 'Rodolfo Paglialunga',
    career: [
      { house: 'prada', role: 'Other', roleDetail: 'Womenswear designer', start: 1998, end: 2008, approximate: true, notes: 'Dates from memory; not confirmed by a source.' },
      { house: 'jilSander', role: 'Creative Director', start: 2014, end: 2017 },
    ],
  },
  lucieMeier: {
    name: 'Lucie Meier',
    career: [
      { house: 'louisVuitton', role: 'Other', roleDetail: 'Designer under Marc Jacobs', start: 2007, end: 2012 },
      { house: 'balenciaga', role: 'Other', roleDetail: 'Head designer', start: 2012, end: 2014 },
      { house: 'dior', role: 'Other', roleDetail: 'Senior designer', start: 2014, end: 2015 },
      { house: 'dior', role: 'Co-Creative Director', roleDetail: 'Interim, with Serge Ruffieux', start: 2015, end: 2016 },
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
      { house: 'supreme', role: 'Head Designer', start: 2005, end: 2013, approximate: true },
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
    career: [
      { house: 'bottegaVeneta', role: 'Other', roleDetail: 'Menswear designer', start: 2005, end: 2006, approximate: true },
      { house: 'gucci', role: 'Other', roleDetail: 'Menswear designer, later senior design roles', start: 2007, end: 2023, approximate: true },
      { house: 'jilSander', role: 'Creative Director', start: 2025, end: null },
      { house: 'bally', role: 'Creative Director', start: 2024, end: 2025 },
    ],
  },

  mariaGraziaChiuri: {
    name: 'Maria Grazia Chiuri',
    born: 1964,
    nationality: 'Italian',
    career: [
      { house: 'fendi', role: 'Other', roleDetail: 'Accessories designer, with Pierpaolo Piccioli', start: 1989, end: 1999 },
      { house: 'valentino', role: 'Other', roleDetail: 'Accessories creative director, with Pierpaolo Piccioli', start: 1999, end: 2008 },
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
      { house: 'fendi', role: 'Other', roleDetail: 'Accessories designer, with Maria Grazia Chiuri', start: 1989, end: 1999 },
      { house: 'valentino', role: 'Other', roleDetail: 'Accessories creative director, with Maria Grazia Chiuri', start: 1999, end: 2008 },
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
      { house: 'balenciaga', role: 'Other', roleDetail: 'Outside designer (wedding and funeral dresses for licensees)', start: 1995, end: 1997, approximate: true },
      { house: 'jeanPaulGaultier', role: 'Other', roleDetail: 'Design assistant', start: 1990, end: 1992 },
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
    career: [
      { house: 'commeDesGarcons', role: 'Other', roleDetail: 'Pattern-maker', start: 1989, end: 1997, approximate: true },
      { house: 'sacai', role: 'Founder', start: 1999, end: null },
      { house: 'jeanPaulGaultier', role: 'Other', roleDetail: 'Guest couture designer', start: 2021, end: 2021 },
    ],
  },
  junichiAbe: {
    name: 'Junichi Abe',
    nationality: 'Japanese',
    career: [
      {
        house: 'commeDesGarcons', role: 'Other', roleDetail: 'Tricot pattern-maker', start: 1989, end: 1992, approximate: true,
        notes: 'Joined Tricot Comme des Garçons in 1989 before moving to Junya Watanabe’s team. Transfer year is approximate, based on the line’s launch.',
        sources: ['https://businessoffashion-businessoffashion-prod.web.arc-cdn.net/articles/news-analysis/the-children-of-comme/', 'https://www.fhcm.paris/en/house/junya-watanabe'],
      },
      {
        house: 'junyaWatanabe', role: 'Other', roleDetail: 'Design team', start: 1992, end: 1994, approximate: true,
        notes: 'Worked on Junya Watanabe’s early team before co-founding PPCM in 1994. Start year is approximate.',
        sources: ['https://www.interviewmagazine.com/fashion/junichi-abe', 'https://www.fhcm.paris/en/house/junya-watanabe'],
      },
      { house: 'kolor', role: 'Founder', start: 2004, end: null },
    ],
    notes: 'Married to sacai founder Chitose Abe; they met while working on Junya Watanabe’s team. This is a family connection, rather than a role at sacai. Co-founded PPCM in 1994 before launching kolor in 2004.',
    sources: ['https://www.interviewmagazine.com/fashion/junichi-abe', 'https://www.cultura.gob.es/mtraje/en/visita/visita-virtual/disenadores-actuales-pasarela/conjunto-kolor.html'],
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
    career: [
      { house: 'ferragamo', role: 'Other', roleDetail: 'Menswear designer, then head of menswear', start: 2000, end: 2010, approximate: true },
      { house: 'ferragamo', role: 'Creative Director', start: 2010, end: 2016, approximate: true },
    ],
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
    career: [
      { house: 'jeanPaulGaultier', role: 'Other', roleDetail: 'Design assistant', start: 1992, end: 2000 },
      { house: 'robertoCavalli', role: 'Other', roleDetail: 'Designer', start: 2002, end: 2005, approximate: true },
      { house: 'robertoCavalli', role: 'Creative Director', start: 2015, end: 2016 },
      { house: 'emilioPucci', role: 'Creative Director', start: 2008, end: 2015 },
    ],
    notes: 'Creative director of Emanuel Ungaro 2005–2008.',
  },
  paulSurridge: {
    name: 'Paul Surridge',
    nationality: 'British',
    career: [
      { house: 'calvinKlein', role: 'Other', roleDetail: 'Designer', start: 1995, end: 1999, approximate: true, notes: '"1990s"; exact years unconfirmed.' },
      { house: 'burberry', role: 'Other', roleDetail: 'Senior menswear designer', start: 2003, end: 2007, approximate: true },
      { house: 'jilSander', role: 'Other', roleDetail: 'Head of menswear under Raf Simons', start: 2007, end: 2011, approximate: true },
      { house: 'zegna', role: 'Creative Director', roleDetail: 'Z Zegna (sub-label)', start: 2011, end: 2014 },
      { house: 'robertoCavalli', role: 'Creative Director', start: 2017, end: 2019 },
    ],
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
    career: [
      { house: 'saintLaurent', role: 'Womenswear Director', roleDetail: 'YSL Rive Gauche', start: 1998, end: 1999 },
      { house: 'lanvin', role: 'Artistic Director', start: 2001, end: 2015 },
    ],
  },
  bouchraJarrar: {
    name: 'Bouchra Jarrar',
    nationality: 'French',
    career: [
      { house: 'balenciaga', role: 'Other', roleDetail: 'Head of creative studio under Nicolas Ghesquière', start: 1996, end: 2006 },
      { house: 'lanvin', role: 'Artistic Director', start: 2016, end: 2017 },
    ],
    notes: 'Founded her own label, Bouchra Jarrar, in 2010.',
  },
  olivierLapidus: {
    name: 'Olivier Lapidus',
    nationality: 'French',
    career: [{ house: 'lanvin', role: 'Artistic Director', start: 2017, end: 2018 }],
  },
  brunoSialelli: {
    name: 'Bruno Sialelli',
    nationality: 'French',
    career: [
      { house: 'loewe', role: 'Other', roleDetail: 'Head of menswear design under Jonathan Anderson', start: 2016, end: 2019 },
      { house: 'lanvin', role: 'Creative Director', start: 2019, end: 2023 },
    ],
  },
  peterCopping: {
    name: 'Peter Copping',
    nationality: 'British',
    career: [
      { house: 'louisVuitton', role: 'Other', roleDetail: 'Studio director under Marc Jacobs', start: 1997, end: 2009, approximate: true },
      { house: 'lanvin', role: 'Artistic Director', start: 2024, end: null },
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
    career: [
      { house: 'maisonMargiela', role: 'Other', roleDetail: 'Designer, later head of MM6 and menswear design', start: 2000, end: 2010, approximate: true },
      { house: 'annDemeulemeester', role: 'Other', roleDetail: 'Designer', start: 2010, end: 2013 },
      { house: 'annDemeulemeester', role: 'Creative Director', start: 2013, end: 2020, approximate: true },
    ],
  },
  ludovicDeSaintSernin: {
    name: 'Ludovic de Saint Sernin',
    nationality: 'French',
    career: [
      { house: 'balmain', role: 'Other', roleDetail: 'Design studio under Olivier Rousteing', start: 2013, end: 2016, approximate: true, notes: 'Dates from memory; not confirmed by a source.' },
      { house: 'annDemeulemeester', role: 'Creative Director', start: 2022, end: 2023, approximate: true },
    ],
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
    career: [
      { house: 'driesVanNoten', role: 'Other', roleDetail: 'Womenswear designer', start: 2018, end: 2024, approximate: true },
      { house: 'driesVanNoten', role: 'Creative Director', start: 2024, end: null },
    ],
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
      { house: 'jeanPaulGaultier', role: 'Other', roleDetail: 'Design assistant', start: 1984, end: 1987, notes: 'Some sources give 1985 as the start.' },
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
      { house: 'patou', role: 'Other', roleDetail: 'Studio designer under Michel Goma', start: 1972, end: 1974, sources: ['https://www.fhcm.paris/en/news/jean-jacques-picart-fashion-is-but-the-expression-of-the-spirit-of-the-times'] },
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
      { house: 'maisonMargiela', role: 'Other', roleDetail: 'Designer', start: 2005, end: 2008 },
      { house: 'celine', role: 'Other', roleDetail: 'Senior designer under Phoebe Philo', start: 2008, end: 2011 },
      { house: 'theRow', role: 'Other', roleDetail: "Women's design director", start: 2011, end: 2014, approximate: true },
      { house: 'hermes', role: 'Womenswear Director', start: 2014, end: null },
    ],
  },

  /* ---------- Jean Paul Gaultier ---------- */
  glennMartens: {
    name: 'Glenn Martens',
    nationality: 'Belgian',
    career: [
      { house: 'jeanPaulGaultier', role: 'Other', roleDetail: 'Junior designer, women\'s pre-collections and menswear', start: 2008, end: 2012, approximate: true },
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
    career: [
      { house: 'balenciaga', role: 'Other', roleDetail: 'Apprentice', start: 1956, end: 1961, approximate: true },
      { house: 'lanvin', role: 'Other', roleDetail: 'Couture assistant to Antonio del Castillo', start: 1961, end: 1963 },
      { house: 'balmain', role: 'Creative Director', roleDetail: 'Haute couture', start: 1993, end: 2002 },
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
        role: 'Other',
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
    career: [
      { house: 'versace', role: 'Other', roleDetail: 'Designer, ready-to-wear and couture', start: 1998, end: 2007, approximate: true, notes: 'Nine years at Versace.' },
      { house: 'rochas', role: 'Artistic Director', start: 2008, end: 2013, notes: 'Named November 2008.' },
      { house: 'schiaparelli', role: 'Creative Director', start: 2013, end: 2014 },
    ],
    notes: 'Earlier at Lawrence Steele and Dolce & Gabbana; creative director of Halston (2007–2008).',
  },
  bertrandGuyon: {
    name: 'Bertrand Guyon',
    nationality: 'French',
    career: [
      { house: 'valentino', role: 'Other', roleDetail: 'Couture design director / senior couture designer', start: 2007, end: 2015, approximate: true },
      { house: 'schiaparelli', role: 'Head Designer', roleDetail: 'Design director (led the house)', start: 2015, end: 2019 },
    ],
  },
  danielRoseberry: {
    name: 'Daniel Roseberry',
    nationality: 'American',
    career: [
      { house: 'thomBrowne', role: 'Other', roleDetail: 'Design director', start: 2008, end: 2019, approximate: true },
      { house: 'schiaparelli', role: 'Creative Director', start: 2019, end: null },
    ],
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
      { house: 'rafSimonsLabel', role: 'Other', roleDetail: 'First assistant, then senior head designer', start: 2002, end: 2005, approximate: true },
      { house: 'jilSander', role: 'Other', roleDetail: 'Design director under Raf Simons', start: 2005, end: 2012, approximate: true },
      { house: 'dior', role: 'Other', roleDetail: 'Design director (couture, ready-to-wear, accessories) under Raf Simons', start: 2012, end: 2015 },
      { house: 'calvinKlein', role: 'Creative Director', roleDetail: 'Under chief creative officer Raf Simons', start: 2016, end: 2018 },
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
      { house: 'commeDesGarcons', role: 'Other', roleDetail: 'Sales associate', start: 2009, end: 2010, approximate: true },
      { house: 'jacquemus', role: 'Founder', roleDetail: 'Founder, creative director', start: 2009, end: null },
    ],
  },
  marineSerre: {
    name: 'Marine Serre',
    born: 1991,
    nationality: 'French',
    career: [
      { house: 'alexanderMcQueen', role: 'Other', roleDetail: 'Intern under Sarah Burton', start: 2013, end: 2013 },
      { house: 'maisonMargiela', role: 'Other', roleDetail: 'Intern under Matthieu Blazy', start: 2014, end: 2014 },
      { house: 'dior', role: 'Other', roleDetail: 'Intern under Raf Simons', start: 2015, end: 2015 },
      { house: 'balenciaga', role: 'Other', roleDetail: 'Junior designer / design assistant under Demna', start: 2016, end: 2017 },
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
      { house: 'celine', role: 'Other', roleDetail: 'Designer under Phoebe Philo', start: 2014, end: 2017, approximate: true },
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
      { house: 'miuMiu', role: 'Other', roleDetail: 'Design team; design director (ready-to-wear) and image director from 2023', start: 2010, end: 2025, notes: 'Left January 2025 for Versace.' },
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
      { house: 'armani', role: 'Other', roleDetail: 'Menswear assistant', start: 1993, end: 1995, approximate: true, notes: 'Dates from memory; not confirmed by a source.' },
      { house: 'prada', role: 'Other', roleDetail: 'Design assistant, menswear and Miu Miu', start: 1995, end: 2000, approximate: true },
      { house: 'saintLaurent', role: 'Other', roleDetail: 'Design director under Tom Ford', start: 2000, end: 2004 },
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
    career: [
      { house: 'givenchy', role: 'Other', roleDetail: 'Senior menswear designer under Riccardo Tisci', start: 2010, end: 2012 },
      { house: 'brioni', role: 'Creative Director', start: 2012, end: 2015, approximate: true },
    ],
    notes: 'Earlier menswear roles at Hermès (senior designer), Louis Vuitton, Burberry and Alexander McQueen.',
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
    career: [
      { house: 'prada', role: 'Other', roleDetail: 'Design team under Miuccia Prada', start: 2008, end: 2015, approximate: true },
      { house: 'marni', role: 'Creative Director', start: 2016, end: 2025, notes: 'Stepped down June 2025.' },
    ],
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
      { house: 'missoni', role: 'Founder', roleDetail: 'Co-founder and creative lead with Ottavio Missoni', start: 1953, end: 1997 },
    ],
  },
  ottavioMissoni: {
    name: 'Ottavio Missoni',
    born: 1921,
    died: 2013,
    nationality: 'Italian',
    career: [{ house: 'missoni', role: 'Founder', roleDetail: 'Co-founder and creative lead with Rosita Missoni', start: 1953, end: 1997 }],
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
      { house: 'missoni', role: 'Creative Director', roleDetail: 'Interim Creative Director', start: 2021, end: 2022, notes: 'With Missoni since 1998.' },
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
  andreaPompilio: {
    name: 'Andrea Pompilio',
    nationality: 'Italian',
    career: [
      {
        house: 'canali',
        role: 'Other',
        roleDetail: 'Creative consultant',
        start: 2014,
        end: 2016,
        notes: 'March 2014 – April 2016: the first outside designer Canali hired (four collections).',
      },
    ],
  },
  hyunWookLee: {
    name: 'Hyun-Wook Lee',
    career: [
      {
        house: 'canali',
        role: 'Head Designer',
        roleDetail: 'Head of design, all product categories',
        start: 2017,
        notes: 'Joined from Berluti and Ermenegildo Zegna; first single designer over every category.',
      },
    ],
  },
  alessioLillocci: {
    name: 'Alessio Lillocci',
    nationality: 'Italian',
    career: [
      {
        house: 'brunelloCucinelli',
        role: 'Head Designer',
        roleDetail: "Head of men's style",
        start: 2003,
        end: 2024,
        approximate: true,
        notes: 'Almost 21 years at Brunello Cucinelli.',
      },
      {
        house: 'prada',
        role: 'Other',
        roleDetail: "Men's ready-to-wear collections director",
        start: 2024,
        end: 2024,
        notes: 'February–August 2024.',
      },
      {
        house: 'canali',
        role: 'Creative Director',
        start: 2026,
        end: null,
        notes: 'Named May 2026; first full collection Spring/Summer 2027.',
      },
    ],
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
      { house: 'gucci', role: 'Other', roleDetail: 'Designer, later head designer of womenswear (under Giannini and Michele)', start: 2004, end: 2023 },
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
      { house: 'arcteryx', role: 'Founder', start: 1989, end: 1995 },
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
      { house: 'diesel', role: 'Artistic Director', start: 2013, end: 2017 },
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
      { house: 'patou', role: 'Head Designer', start: 1953, end: 1957, approximate: true, notes: 'Comité Colbert dates this tenure 1953–1957; FHCM gives 1954–1958.', sources: ['https://www.comitecolbert.com/en/members/patou/', 'https://www.fhcm.paris/en/news/jean-jacques-picart-fashion-is-but-the-expression-of-the-spirit-of-the-times'] },
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
      { house: 'fendi', role: 'Other', roleDetail: 'Accessories designer', start: 1997, end: 2002, approximate: true },
      { house: 'gucci', role: 'Other', roleDetail: 'Handbag design director, then accessories creative director', start: 2002, end: 2006 },
      { house: 'gucci', role: 'Creative Director', start: 2006, end: 2014 },
    ],
  },
  sabatoDeSarno: {
    name: 'Sabato De Sarno',
    nationality: 'Italian',
    career: [
      { house: 'prada', role: 'Other', roleDetail: 'Designer', start: 2005, end: 2007, approximate: true },
      { house: 'dolceGabbana', role: 'Other', roleDetail: 'Designer', start: 2007, end: 2009, approximate: true },
      { house: 'valentino', role: 'Other', roleDetail: "Designer, later fashion director (men's and women's)", start: 2009, end: 2023 },
      { house: 'gucci', role: 'Creative Director', start: 2023, end: 2025 },
    ],
  },
  alessandraFacchinetti: {
    name: 'Alessandra Facchinetti',
    nationality: 'Italian',
    career: [
      { house: 'miuMiu', role: 'Other', roleDetail: 'Designer, Miu Miu / Prada', start: 1994, end: 2000, approximate: true, notes: 'Dates from memory; not confirmed by a source.' },
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
      { house: 'schiaparelli', role: 'Other', roleDetail: 'Boutique designer', start: 1947, end: 1951 },
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
      { house: 'oakley', role: 'Creative Director', roleDetail: 'Apparel, Footwear and Accessories', start: 2026, end: null, notes: 'Appointment announced March 26, 2026. Directs apparel, footwear and accessories, working alongside Chief Visionary Officer Travis Scott.', sources: ['https://oakley-media-hub.prezly.com/matthew-m-williams-named-creative-director-apparel-footwear-and-accessories-at-oakley-as-travis-scott-continues-the-brands-chief-visionary-officer-journey'] },
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
      { house: 'patou', role: 'Head Designer', start: 1963, end: 1974, approximate: true, notes: 'Historical dates vary around the transition to Angelo Tarlazzi. Jean Paul Gaultier worked in his studio, rather than leading the house.', sources: ['https://www.encyclopedia.com/fashion/encyclopedias-almanacs-transcripts-and-maps/patou-jean', 'https://www.patou.com/pages/history-jean-patou'] },
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
      { house: 'balenciaga', role: 'Other', roleDetail: 'Designer under Nicolas Ghesquière', start: 2002, end: 2012, approximate: true },
      { house: 'louisVuitton', role: 'Other', roleDetail: 'Women\'s ready-to-wear creative director under Nicolas Ghesquière', start: 2013, end: 2017, approximate: true },
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
      { house: 'chloe', role: 'Other', roleDetail: 'Design team, starting under Phoebe Philo', start: 2005, end: 2008, approximate: true, notes: 'Exact years unclear in sources.' },
      { house: 'chloe', role: 'Other', roleDetail: 'Design director under Clare Waight Keller', start: 2013, end: 2016, approximate: true },
      { house: 'saintLaurent', role: 'Other', roleDetail: 'Women\'s ready-to-wear design director', start: 2016, end: 2023, approximate: true },
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
      { house: 'hermes', role: 'Other', roleDetail: 'Women\'s ready-to-wear designer', start: 1990, end: 1997, approximate: true },
      { house: 'bottegaVeneta', role: 'Creative Director', start: 2001, end: 2018 },
    ],
  },
  louiseTrotter: {
    name: 'Louise Trotter',
    nationality: 'British',
    career: [
      {
        house: 'calvinKlein',
        role: 'Womenswear Director',
        roleDetail: 'Director of ready-to-wear (head of womenswear)',
        start: 2001,
        end: 2003,
        approximate: true,
      },
      {
        house: 'tommyHilfiger',
        role: 'Womenswear Director',
        roleDetail: 'SVP creative director, womenswear',
        start: 2004,
        end: 2007,
        approximate: true,
      },
      { house: 'lacoste', role: 'Creative Director', start: 2018, end: 2023 },
      { house: 'carven', role: 'Creative Director', start: 2023, end: 2024, notes: 'Joined February 2023; left in December 2024 for Bottega Veneta.' },
      { house: 'bottegaVeneta', role: 'Creative Director', start: 2025, end: null },
    ],
    notes: 'Also Whistles (buying and design director), Gap (VP womenswear design), Jigsaw (creative director, 2007) and Joseph (creative director, 2009–2018).',
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
      { house: 'balenciaga', role: 'Other', roleDetail: 'Designer under Nicolas Ghesquière', start: 2004, end: 2008 },
      { house: 'celine', role: 'Other', roleDetail: 'Design director, ready-to-wear, under Phoebe Philo', start: 2008, end: 2018 },
      { house: 'ralphLauren', role: 'Creative Director', roleDetail: 'Polo Ralph Lauren womenswear (sub-label)', start: 2018, end: 2024 },
      { house: 'celine', role: 'Creative Director', start: 2025, end: null },
    ],
  },
  stuartVevers: {
    name: 'Stuart Vevers',
    nationality: 'British',
    career: [
      { house: 'calvinKlein', role: 'Other', roleDetail: 'Accessories designer', start: 1996, end: 1998, approximate: true, notes: 'Exact years unconfirmed; order of roles is documented.' },
      { house: 'bottegaVeneta', role: 'Other', roleDetail: 'Accessories designer', start: 1998, end: 2000, approximate: true, notes: 'Exact years unconfirmed.' },
      { house: 'givenchy', role: 'Other', roleDetail: 'Accessories designer', start: 2000, end: 2002, approximate: true, notes: 'Exact years unconfirmed.' },
      { house: 'louisVuitton', role: 'Other', roleDetail: 'Accessories designer under Marc Jacobs', start: 2002, end: 2004, approximate: true, notes: 'Exact years unconfirmed.' },
      { house: 'mulberry', role: 'Creative Director', start: 2005, end: 2007, approximate: true },
      { house: 'loewe', role: 'Creative Director', start: 2008, end: 2013 },
      { house: 'coach', role: 'Creative Director', roleDetail: 'Executive creative director', start: 2013, end: null },
    ],
  },
  jackMcCollough: {
    name: 'Jack McCollough',
    nationality: 'American',
    career: [
      { house: 'marcJacobs', role: 'Other', roleDetail: 'Design intern', start: 2001, end: 2001, approximate: true, notes: 'While at Parsons; exact year unconfirmed.' },
      { house: 'loewe', role: 'Co-Creative Director', roleDetail: 'with Lazaro Hernandez', start: 2025, end: null },
      { house: 'proenzaSchouler', role: 'Founder', roleDetail: 'Co-founder, co-creative director with Lazaro Hernandez', start: 2002, end: 2025 },
    ],
  },
  lazaroHernandez: {
    name: 'Lazaro Hernandez',
    nationality: 'American',
    career: [
      { house: 'michaelKors', role: 'Other', roleDetail: 'Design intern', start: 2000, end: 2000, approximate: true, notes: 'While at Parsons; exact year unconfirmed.' },
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
      { house: 'patou', role: 'Head Designer', start: 1981, end: 1987, notes: 'Joined in November 1981; left to establish his own couture house.', sources: ['https://www.fhcm.paris/en/news/jean-jacques-picart-fashion-is-but-the-expression-of-the-spirit-of-the-times', 'https://www.comitecolbert.com/en/members/patou/'] },
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
      { house: 'msgm', role: 'Founder', roleDetail: 'Founder, creative director', start: 2009, end: null },
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
      { house: 'dior', role: 'Other', roleDetail: 'Menswear designer, 30 Montaigne line', start: 2001, end: 2002, approximate: true },
      { house: 'givenchy', role: 'Other', roleDetail: 'First menswear assistant (incl. interim team before Riccardo Tisci)', start: 2002, end: 2008, approximate: true },
      { house: 'marcJacobs', role: 'Other', roleDetail: 'Menswear designer', start: 2008, end: 2009, approximate: true },
      { house: 'amiParis', role: 'Founder', roleDetail: 'Founder, creative director', start: 2011, end: null },
    ],
  },
  kikoKostadinovDesigner: {
    name: 'Kiko Kostadinov',
    nationality: 'Bulgarian',
    career: [
      { house: 'kikoKostadinov', role: 'Founder', roleDetail: 'Founder, designer', start: 2016, end: null },
      { house: 'asics', role: 'Other', roleDetail: 'SportStyle footwear curator and design partner, Kiko Kostadinov Studio', start: 2020, end: null, notes: 'Collaboration began in 2018; the expanded curatorial partnership was announced in October 2020. This is a SportStyle partnership, not creative direction of the whole ASICS company.', sources: ['https://corp.asics.com/jp/press/article/2020-10-02', 'https://www.asics.com/ie/en-ie/asics-sportstyle-kiko-kostadinov/'] },
    ],
  },
  levTanju: {
    name: 'Lev Tanju',
    nationality: 'British',
    career: [
      { house: 'palace', role: 'Founder', roleDetail: 'Founder', start: 2009, end: null },
      { house: 'fila', role: 'Creative Director', roleDetail: 'FILA+ line', start: 2024, end: null, notes: 'Appointment announced in January 2024. Directs the FILA+ collection rather than the entire FILA brand; exact end date unconfirmed.', sources: ['https://www.fantasticman.com/articles/lev-tanju/', 'https://www.sgieurope.com/brands/first-fila-summer-collection-released/109286.article'] },
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
      { house: 'gucci', role: 'Other', roleDetail: 'Creative consultant, then VP of menswear (from 2001), under Tom Ford', start: 1996, end: 2004 },
      { house: 'gucci', role: 'Menswear Director', roleDetail: 'Creative director of menswear', start: 2004, end: 2006, notes: 'Some sources give 2007 as the end.' },
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
      { house: 'ralphLauren', role: 'Other', roleDetail: 'Designer, RLX', start: 1999, end: 2004 },
      { house: 'calvinKlein', role: 'Other', roleDetail: 'Senior vice president of design, menswear', start: 2021, end: 2024 },
      { house: 'willyChavarria', role: 'Founder', roleDetail: 'Founder, designer', start: 2015, end: null },
    ],
    notes: 'Design director at American Eagle Outfitters after Ralph Lauren.',
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
      { house: 'oscarDeLaRentaHouse', role: 'Other', roleDetail: 'Oscar de la Renta\'s design team, later design director', start: 2003, end: 2015, approximate: true },
      { house: 'oscarDeLaRentaHouse', role: 'Co-Creative Director', roleDetail: 'with Fernando Garcia', start: 2016, end: null },
    ],
  },
  fernandoGarcia: {
    name: 'Fernando Garcia',
    nationality: 'Dominican-American',
    career: [
      { house: 'oscarDeLaRentaHouse', role: 'Other', roleDetail: 'Design team', start: 2009, end: 2015, approximate: true },
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
      { house: 'rochas', role: 'Creative Director', start: 2002, end: 2006 },
      { house: 'ninaRicci', role: 'Creative Director', start: 2006, end: 2009 },
    ],
  },
  guillaumeHenry: {
    name: 'Guillaume Henry',
    nationality: 'French',
    career: [
      { house: 'carven', role: 'Creative Director', start: 2009, end: 2014 },
      { house: 'ninaRicci', role: 'Creative Director', start: 2015, end: 2018 },
      { house: 'patou', role: 'Artistic Director', start: 2018, end: 2026, notes: 'Appointed September 2018; departure announced February 2026.', sources: ['https://www.patou.com/pages/present-guillaume-henry', 'https://www.vogue.fr/article/guillaume-henry-depart-patou'] },
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
    career: [
      { house: 'gucci', role: 'Other', roleDetail: 'Senior womenswear designer under Tom Ford', start: 1996, end: 2001 },
      { house: 'burberry', role: 'Creative Director', start: 2001, end: 2018 },
    ],
  },

  /* ---------- London & New York independents ---------- */
  martineRose: {
    name: 'Martine Rose',
    nationality: 'British',
    career: [
      { house: 'balenciaga', role: 'Other', roleDetail: 'Menswear consultant under Demna', start: 2015, end: 2018, approximate: true },
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
      { house: 'oscarDeLaRentaHouse', role: 'Other', roleDetail: 'Assistant to Oscar de la Renta (incl. Pierre Balmain couture)', start: 1993, end: 1998, approximate: true },
      { house: 'gucci', role: 'Other', roleDetail: 'Senior designer under Tom Ford', start: 1998, end: 2002, approximate: true },
      { house: 'calvinKlein', role: 'Creative Director', roleDetail: "Women's Collection", start: 2003, end: 2016 },
    ],
  },
  italoZucchelli: {
    name: 'Italo Zucchelli',
    career: [
      { house: 'jilSander', role: 'Other', roleDetail: 'Menswear designer', start: 1998, end: 2000, approximate: true, notes: 'About two years; exact years unconfirmed.' },
      { house: 'calvinKlein', role: 'Other', roleDetail: 'Menswear designer', start: 2000, end: 2004, approximate: true, notes: 'Sources give 1998–2001 for his start.' },
      { house: 'calvinKlein', role: 'Creative Director', roleDetail: "Calvin Klein Collection men's (sub-label)", start: 2004, end: 2016 },
    ],
  },
  veronicaLeoni: {
    name: 'Veronica Leoni',
    career: [
      { house: 'jilSander', role: 'Other', roleDetail: 'Head of knitwear under Raf Simons', start: 2009, end: 2012, approximate: true },
      { house: 'celine', role: 'Other', roleDetail: 'Designer under Phoebe Philo', start: 2014, end: 2017, approximate: true },
      { house: 'theRow', role: 'Other', roleDetail: 'Designer', start: 2021, approximate: true },
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
    notes: 'Founded her label Quira. Also reported as womenswear design lead for Moncler 1952 (unverified).',
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
      { house: 'fendi', role: 'Other', roleDetail: 'Intern, alongside Kanye West', start: 2009, end: 2009 },
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
      { house: 'maisonMargiela', role: 'Other', roleDetail: 'Womenswear designer', start: 2009, end: 2013 },
      { house: 'louisVuitton', role: 'Other', roleDetail: 'Senior designer, women\'s ready-to-wear', start: 2013, end: 2014 },
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
      { house: 'fendi', role: 'Other', roleDetail: 'Accessories designer', start: 1997, end: 2002, approximate: true },
      { house: 'gucci', role: 'Other', roleDetail: 'Accessories designer, then associate creative director', start: 2002, end: 2015 },
      { house: 'gucci', role: 'Creative Director', start: 2015, end: 2022 },
      { house: 'valentino', role: 'Creative Director', start: 2024, end: null },
    ],
  },
  jonathanAnderson: {
    name: 'Jonathan Anderson',
    born: 1984,
    nationality: 'Northern Irish',
    career: [
      { house: 'prada', role: 'Other', roleDetail: 'Visual merchandiser', start: 2005, end: 2008, approximate: true },
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
    career: [
      { house: 'tommyHilfiger', role: 'Other', roleDetail: 'Senior VP, marketing and design', start: 1993, end: 1996, approximate: true },
      { house: 'coach', role: 'Creative Director', roleDetail: 'Executive creative director', start: 1996, end: 2013 },
    ],
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
      { house: 'balenciaga', role: 'Other', roleDetail: 'Designer under Nicolas Ghesquière', start: 2008, end: 2012 },
      { house: 'dior', role: 'Other', roleDetail: 'Designer under Raf Simons', start: 2012, end: 2014, approximate: true, notes: 'Short stint.' },
      {
        house: 'louisVuitton',
        role: 'Other',
        roleDetail: 'Womenswear designer under Nicolas Ghesquière',
        start: 2015,
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
    career: [
      { house: 'pyerMoss', role: 'Founder', roleDetail: 'Founder, creative director', start: 2013, end: null },
      { house: 'reebok', role: 'Creative Director', roleDetail: 'Vice President of Creative Direction', start: 2020, end: 2022, notes: 'Appointed in September 2020; departure effective March 1, 2022. Earlier Reebok collaborations began in 2017.', sources: ['https://cfda.com/news/what-kerby-jean-raymonds-new-role-at-reebok-means-for-fashion/', 'https://fashionista.com/2022/02/kerby-jean-raymond-global-creative-director-departure'] },
    ],
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
    career: [
      { house: 'yeezy', role: 'Other', roleDetail: 'Consultant on Yeezy Season 1; art director for Yeezy shows', start: 2015, end: 2016, approximate: true, notes: 'Joined Kanye West’s DONDA creative team in 2014 after leaving Nike; consultant rather than full-time staff.' },
      { house: 'heronPreston', role: 'Founder', roleDetail: 'Founder, creative director', start: 2017, end: null },
    ],
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
      { house: 'adidas', role: 'Creative Director', roleDetail: 'Sport Style division', start: 2010, end: 2018, sources: ['https://www.fashion-council-germany.org/team/dirk-sch%C3%B6nberger'] },
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
      { house: 'saintLaurent', role: 'Other', roleDetail: 'Assistant to Hedi Slimane', start: 1998, end: 2000, approximate: true },
      { house: 'dior', role: 'Other', roleDetail: 'Assistant to Hedi Slimane, Dior Homme', start: 2000, end: 2004, approximate: true },
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
    career: [
      { house: 'yeezy', role: 'Other', roleDetail: 'Uncredited "ghost" creative, with Dylan Richards', start: 2016, end: 2020, approximate: true, notes: 'About four years before launching Entire Studios in October 2020.' },
      { house: 'entireStudios', role: 'Founder', roleDetail: 'Co-founder, co-creative director', start: 2020, end: null },
    ],
  },
  dylanRichards: {
    name: 'Dylan Richards',
    nationality: 'New Zealander',
    career: [
      { house: 'yeezy', role: 'Other', roleDetail: 'Uncredited "ghost" creative, with Sebastian Hunt', start: 2016, end: 2020, approximate: true, notes: 'About four years before launching Entire Studios in October 2020.' },
      { house: 'entireStudios', role: 'Founder', roleDetail: 'Co-founder, co-creative director', start: 2020, end: null },
    ],
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
    career: [
      { house: 'dior', role: 'Co-Creative Director', roleDetail: 'Interim, with Lucie Meier', start: 2015, end: 2016 },
      { house: 'carven', role: 'Creative Director', start: 2017, end: 2018, approximate: true },
    ],
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
    career: [
      { house: 'fendi', role: 'Other', roleDetail: 'Intern, alongside Virgil Abloh', start: 2009, end: 2009 },
      { house: 'yeezy', role: 'Founder', roleDetail: 'Founder, creative director', start: 2015, end: null },
    ],
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
    career: [
      { house: 'aimeLeonDore', role: 'Founder', roleDetail: 'Founder, creative director', start: 2014, end: null },
      { house: 'newBalance', role: 'Creative Director', roleDetail: 'Made in USA line', start: 2021, end: null, notes: 'Appointment announced April 2021, with the first collection launching in 2022. Remit covers Made in USA, not all New Balance products.', sources: ['https://newbalance.newsmarket.com/product-news/teddy-santis-named-creative-director-of-new-balance-made-in-usa/s/c97fb578-022f-4ea7-ae44-2565d3dc0050', 'https://www.soleretriever.com/news/articles/new-balance-made-in-usa-fall-winter-2026-official-unveiling-release-date'] },
    ],
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
    career: [
      { house: 'michaelKors', role: 'Other', roleDetail: 'Designer', start: 1990, end: 2002, approximate: true },
      { house: 'tods', role: 'Creative Director', start: 2006, end: 2012 },
    ],
    notes: 'Founded his own label, Derek Lam, in 2003.',
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
    career: [
      { house: 'isseyMiyake', role: 'Other', roleDetail: 'Design team', start: 2007, end: 2019 },
      { house: 'isseyMiyake', role: 'Head Designer', roleDetail: "Women's collection", start: 2019, end: null },
    ],
  },
  taigaTakahashiDesigner: {
    name: 'Taiga Takahashi',
    died: 2022,
    nationality: 'Japanese',
    career: [{ house: 'taigaTakahashi', role: 'Founder', roleDetail: 'Founder, designer', start: 2017, end: 2022 }],
    notes: 'Died April 2022, aged 27. Known for his “applied archaeology” approach to historical garments.',
  },
  angelChenDesigner: {
    name: 'Angel Chen',
    born: 1991,
    nationality: 'Chinese',
    career: [{ house: 'angelChen', role: 'Founder', roleDetail: 'Founder, designer', start: 2014, end: null }],
    notes: 'Also known as Chen Anqi. Central Saint Martins graduate; on Netflix’s Next in Fashion (2020).',
  },
  ziggyChenDesigner: {
    name: 'Ziggy Chen',
    nationality: 'Chinese',
    career: [{ house: 'ziggyChen', role: 'Founder', roleDetail: 'Founder, designer', start: 2012, end: null }],
    notes: 'Born Chen Xiang.',
  },
  robertWunDesigner: {
    name: 'Robert Wun',
    nationality: 'Hong Kong',
    career: [{ house: 'robertWun', role: 'Founder', roleDetail: 'Founder, designer', start: 2014, end: null }],
    notes: 'London College of Fashion graduate (2012).',
  },
  hunKim: {
    name: 'Hun Kim',
    career: [
      {
        house: 'ralphLauren',
        role: 'Other',
        roleDetail: 'Senior design role',
        start: 2008,
        end: 2011,
        approximate: true,
        notes: 'Years unconfirmed; came after Converse and before Tommy Hilfiger.',
      },
      {
        house: 'tommyHilfiger',
        role: 'Other',
        roleDetail: 'Head designer',
        start: 2011,
        end: 2015,
        approximate: true,
        notes: 'Years unconfirmed.',
      },
      {
        house: 'karlLagerfeldLabel',
        role: 'Head Designer',
        roleDetail: 'Design director; leads creative direction with Carine Roitfeld since Lagerfeld’s death',
        start: 2015,
        end: null,
        notes: 'Hand-picked by Karl Lagerfeld; worked closely with him for about five years.',
      },
    ],
    notes: 'Earlier senior role at Converse.',
  },
  dingyunZhangDesigner: {
    name: 'Dingyun Zhang',
    nationality: 'Chinese',
    career: [
      {
        house: 'yeezy',
        role: 'Other',
        roleDetail: 'Designer (YEEZY 700 series), with design director Steven Smith',
        start: 2016,
        end: 2020,
        approximate: true,
        notes: 'Hired by Kanye West in 2016 while still a student; showed custom YEEZY Foam Runners at his 2020 CSM show.',
      },
      { house: 'dingyunZhang', role: 'Founder', roleDetail: 'Founder, designer', start: 2021, end: null },
    ],
    notes: 'Born in Inner Mongolia, raised in Beijing; Central Saint Martins graduate (2020). Worked in London and Los Angeles before moving to Shanghai.',
  },
  keiNinomiya: {
    name: 'Kei Ninomiya',
    nationality: 'Japanese',
    career: [
      { house: 'commeDesGarcons', role: 'Other', roleDetail: 'Pattern-maker', start: 2008, end: 2012 },
      { house: 'noirKeiNinomiya', role: 'Founder', roleDetail: 'Founder, designer', start: 2012, end: null },
    ],
  },
  mowalolaOgunlesi: {
    name: 'Mowalola Ogunlesi',
    nationality: 'Nigerian-British',
    career: [
      { house: 'mowalola', role: 'Founder', roleDetail: 'Founder, designer', start: 2017, end: null, approximate: true },
      {
        house: 'yeezy',
        role: 'Other',
        roleDetail: 'Design director, Yeezy Gap',
        start: 2020,
        end: 2022,
        notes: 'Appointed June 2020; left by mid-2022 to focus on her own label.',
      },
    ],
  },
  marcelRochas: {
    name: 'Marcel Rochas',
    born: 1902,
    died: 1955,
    nationality: 'French',
    career: [{ house: 'rochas', role: 'Founder', start: 1925, end: 1955 }],
  },
  peterOBrien: {
    name: "Peter O'Brien",
    career: [
      {
        house: 'rochas',
        role: 'Creative Director',
        roleDetail: 'Revived ready-to-wear for Wella',
        start: 1990,
        end: 2002,
        approximate: true,
        notes: 'End year assumed from Theyskens’ arrival.',
      },
    ],
  },
  alessandroDellAcqua: {
    name: "Alessandro Dell'Acqua",
    nationality: 'Italian',
    career: [{ house: 'rochas', role: 'Creative Director', start: 2013, end: 2020, notes: 'Last collection February 2020.' }],
    notes: 'Founder of N°21.',
  },
  charlesDeVilmorin: {
    name: 'Charles de Vilmorin',
    nationality: 'French',
    career: [{ house: 'rochas', role: 'Creative Director', start: 2021, end: 2023, notes: 'Contract not renewed; left April 2023.' }],
  },
  alessandroVigilante: {
    name: 'Alessandro Vigilante',
    nationality: 'Italian',
    career: [
      {
        house: 'rochas',
        role: 'Creative Director',
        roleDetail: 'Ready-to-wear',
        start: 2023,
        end: null,
        notes: 'Announced December 2023.',
      },
    ],
    notes: 'Previously at Dolce & Gabbana, Gucci and The Attico (from 2020); sixteen years under other creative directors.',
  },
  katieBecker: {
    name: 'Katie Becker',
    career: [
      { house: 'arcteryx', role: 'Creative Director', roleDetail: 'Chief creative officer', start: 2020, end: null },
    ],
  },
  conroyNachtigall: {
    name: 'Conroy Nachtigall',
    career: [
      { house: 'arcteryxVeilance', role: 'Creative Director', roleDetail: 'Founding creative lead', start: 2009, end: 2013 },
    ],
  },
  larsMcKinnon: {
    name: 'Lars McKinnon',
    career: [{ house: 'arcteryxVeilance', role: 'Other', roleDetail: 'Designer', start: 2013, end: 2016 }],
  },
  takaKasuga: {
    name: 'Taka Kasuga',
    career: [
      { house: 'arcteryxVeilance', role: 'Creative Director', roleDetail: 'Design director', start: 2015, end: 2024, approximate: true },
    ],
  },
  benStubbington: {
    name: 'Ben Stubbington',
    career: [
      {
        house: 'arcteryxVeilance',
        role: 'Creative Director',
        start: 2025,
        end: null,
        notes: 'Appointed 2025; reported involvement from 2024.',
      },
    ],
  },
  neilBarrett: {
    name: 'Neil Barrett',
    born: 1965,
    nationality: 'British',
    career: [
      { house: 'gucci', role: 'Other', roleDetail: 'Senior menswear designer', start: 1989, end: 1994, approximate: true, notes: 'About five years in Florence after graduating.' },
      { house: 'prada', role: 'Other', roleDetail: "Created and led Prada's first designer menswear line", start: 1995, end: 1999, approximate: true },
      { house: 'neilBarrettLabel', role: 'Founder', roleDetail: 'Founder, creative director', start: 1999, end: null },
    ],
  },
  fabioZambernardi: {
    name: 'Fabio Zambernardi',
    nationality: 'Italian',
    career: [
      {
        house: 'prada',
        role: 'Other',
        roleDetail: 'Collaborator; show design director from 1997, design fashion coordinator from 1999',
        start: 1981,
        end: 2002,
      },
      { house: 'prada', role: 'Other', roleDetail: 'Design director', start: 2002, end: 2023, notes: 'Stepped back October 2023.' },
      { house: 'miuMiu', role: 'Other', roleDetail: 'Design director', start: 2002, end: 2023, notes: 'Succeeded at Miu Miu by Dario Vitale.' },
    ],
  },
  paulHelbers: {
    name: 'Paul Helbers',
    nationality: 'Dutch',
    career: [
      { house: 'maisonMargiela', role: 'Other', roleDetail: 'Studio director, menswear', start: 1999, end: 2005, approximate: true },
      {
        house: 'louisVuitton',
        role: 'Menswear Director',
        roleDetail: 'Head of menswear under Marc Jacobs',
        start: 2006,
        end: 2011,
        notes: 'Some sources give 2005 as the start; titles vary (style director, men’s creative director).',
      },
    ],
    notes: 'Later consulted (incl. Erdos), launched his own label Helbers (2016), grew The Row’s menswear, and co-founded FFORME.',
  },
  kansaiYamamotoDesigner: {
    name: 'Kansai Yamamoto',
    born: 1944,
    died: 2020,
    nationality: 'Japanese',
    career: [{ house: 'kansaiYamamoto', role: 'Founder', roleDetail: 'Founder, designer', start: 1971, end: 2020 }],
  },
  douglasTompkins: {
    name: 'Douglas Tompkins',
    born: 1943,
    died: 2015,
    nationality: 'American',
    career: [{ house: 'theNorthFace', role: 'Founder', roleDetail: 'Co-founder with Susie Tompkins', start: 1966, end: 1967, approximate: true }],
    notes: 'Later co-founded Esprit and became a conservationist.',
  },
  susieTompkinsBuell: {
    name: 'Susie Tompkins Buell',
    nationality: 'American',
    career: [{ house: 'theNorthFace', role: 'Founder', roleDetail: 'Co-founder with Douglas Tompkins', start: 1966, end: 1967, approximate: true }],
    notes: 'Later co-founded Esprit.',
  },
  eiichiroHomma: {
    name: 'Eiichiro Homma',
    nationality: 'Japanese',
    career: [
      { house: 'goldwin', role: 'Other', roleDetail: 'Marketing', start: 1982, end: 1983 },
      {
        house: 'hellyHansen',
        role: 'Other',
        roleDetail: 'Brand director of design, Helly Hansen marine line (Goldwin licence, Japan)',
        start: 1983,
        end: 2001,
        notes: 'Known for his neon nylon sailing jackets.',
      },
      { house: 'goldwin', role: 'Other', roleDetail: 'New business development, outdoor sportswear division', start: 2001, end: 2003 },
      { house: 'nanamica', role: 'Founder', roleDetail: 'Co-founder with Takashi Imaki, creative director', start: 2003, end: null },
      { house: 'theNorthFacePurpleLabel', role: 'Creative Director', roleDetail: 'Heads the line for nanamica', start: 2003, end: null },
    ],
  },
  tosakuNishida: {
    name: 'Tosaku Nishida',
    nationality: 'Japanese',
    career: [{ house: 'goldwin', role: 'Founder', start: 1950 }],
  },
  akioNishida: {
    name: 'Akio Nishida',
    nationality: 'Japanese',
    career: [{ house: 'goldwin', role: 'Head of House', roleDetail: 'Chairman; founder’s son', start: 2000, end: null }],
  },
  hellyJuellHansen: {
    name: 'Helly Juell Hansen',
    died: 1914,
    nationality: 'Norwegian',
    career: [{ house: 'hellyHansen', role: 'Founder', roleDetail: 'Co-founder with Maren Margarethe Hansen', start: 1877, end: 1914 }],
  },
  marenMargaretheHansen: {
    name: 'Maren Margarethe Hansen',
    nationality: 'Norwegian',
    career: [{ house: 'hellyHansen', role: 'Founder', roleDetail: 'Co-founder with Helly Juell Hansen', start: 1877 }],
  },
  yvonChouinard: {
    name: 'Yvon Chouinard',
    born: 1938,
    nationality: 'American',
    career: [{ house: 'patagonia', role: 'Founder', start: 1973, end: null }],
    notes: 'Founded with his wife Malinda Chouinard; earlier founded Chouinard Equipment.',
  },
  timHamilton: {
    name: 'Tim Hamilton',
    nationality: 'American',
    career: [
      { house: 'ralphLauren', role: 'Other', roleDetail: 'Designer, Polo Sport', start: 1995, end: 2000, approximate: true, notes: 'Years unconfirmed.' },
      {
        house: 'theNorthFace',
        role: 'Creative Director',
        roleDetail: 'Head of global creative',
        start: 2017,
        end: 2024,
        notes: 'Appointed October 2017; left March 2024 to become Nike’s global VP of design.',
      },
      { house: 'nike', role: 'Other', roleDetail: 'Vice President of men’s apparel design', start: 2024, notes: 'Appointment confirmed by a Nike spokesperson in March 2024. Exact end date unconfirmed.', sources: ['https://www.fashiondive.com/news/nike-tim-hamilton-vice-president-mens-apparel-design/711175/'] },
    ],
    notes: 'Also worked at Gap, J.Crew and Madewell, and ran his own label.',
  },
  /* ---------- Selected design and business leaders of recently added houses ---------- */
  mariaErixonLevin: {
    name: 'Maria Erixon Levin',
    nationality: 'Swedish',
    career: [
      {
        house: 'nudieJeans', role: 'Founder', roleDetail: 'Co-founder and original creative director', start: 2001,
        notes: 'The brand’s 2015 report identifies her as creative director; its 2016 report describes a senior adviser/creative-director role. The end of her active creative leadership is unconfirmed.',
        sources: ['https://www.nudiejeans.com/en-SE/info/about', 'https://a.storyblok.com/f/329889/x/eaf9512730/nudie-jeans-sustainability-report-2015.pdf', 'https://a.storyblok.com/f/329889/x/c95b398483/nudie-jeans-sustainability-report-2016.pdf'],
      },
    ],
  },
  joakimLevin: {
    name: 'Joakim Levin',
    nationality: 'Swedish',
    career: [
      {
        house: 'nudieJeans', role: 'Founder', roleDetail: 'Co-founder; CEO confirmed in 2026', start: 2001, end: null,
        notes: '2001 is the co-founding year, not a confirmed CEO appointment date. Identified as CEO in the brand’s February 2026 living-wage policy.',
        sources: ['https://www.nudiejeans.com/en-SE/info/about', 'https://a.storyblok.com/f/329889/x/7f52c1c523/nudie-jeans-living-wage-policy-2026.pdf'],
      },
    ],
  },
  remyAlexisRichard: {
    name: 'Rémy-Alexis Richard',
    nationality: 'French',
    career: [
      {
        house: 'paraboot', role: 'Founder', roleDetail: 'Founder and shoemaker', start: 1908,
        notes: 'Started the footwear business in 1908; registered the Paraboot name in 1927. Exact leadership end date unconfirmed.',
        sources: ['https://www.paraboot.com/en/the-brand/history/'],
      },
    ],
  },
  julienRichard: {
    name: 'Julien Richard',
    nationality: 'French',
    career: [
      {
        house: 'paraboot', role: 'Head of House', roleDetail: 'Family leader and product developer', start: 1946, end: 1979, approximate: true,
        notes: 'Joined in 1937; described as leading the company in its 1946 history entry. Handed full control to Michel at the end of 1979; exact leadership start is unconfirmed.',
        sources: ['https://www.paraboot.com/en/the-brand/history/'],
      },
    ],
  },
  michelRichard: {
    name: 'Michel Richard',
    nationality: 'French',
    career: [
      {
        house: 'paraboot', role: 'Head of House', roleDetail: 'Family business leader', start: 1979,
        notes: 'Joined management in 1973 and took full control at the end of 1979. Led the turnaround following the 1983 bankruptcy filing. End of this leadership tenure unconfirmed.',
        sources: ['https://www.paraboot.com/en/the-brand/history/'],
      },
    ],
  },
  clementineColinRichard: {
    name: 'Clémentine Colin-Richard',
    nationality: 'French',
    career: [
      {
        house: 'paraboot', role: 'Other', roleDetail: 'Collections leadership, fourth-generation family member', start: 2000,
        notes: 'The company history places her arrival in collections in 2000. The end date of that particular role is unconfirmed.',
        sources: ['https://www.paraboot-pro.com/contenu/notre-histoire-c2.html'],
      },
    ],
  },
  leviStrauss: {
    name: 'Levi Strauss',
    nationality: 'German-American',
    career: [
      {
        house: 'levis', role: 'Founder', start: 1853,
        sources: ['https://www.levistrauss.com/who-we-are/history/'],
      },
    ],
  },
  karynHillman: {
    name: 'Karyn Hillman',
    career: [
      {
        house: 'levis', role: 'Other', roleDetail: 'Chief Product Officer', start: 2013, end: null,
        notes: 'Appointed in August 2013. Oversees product vision and design; remit expanded to merchandising in 2025, with promotion to executive vice president in February 2026.',
        sources: ['https://www.levistrauss.com/wp-content/uploads/2019/03/The-Levis-Brand-Announces-New-Global-Leadership-Appointments.pdf', 'https://www.levistrauss.com/who-we-are/leadership/karyn-hillman/', 'https://www.levistrauss.com/wp-content/uploads/2025/02/Press-Release_Leadership-Changes_2_11_25.pdf', 'https://www.sec.gov/Archives/edgar/data/94845/000130817926000050/levi_courtesy-pdf.pdf'],
      },
    ],
  },
  jonathanCheung: {
    name: 'Jonathan Cheung',
    career: [
      {
        house: 'levis', role: 'Head Designer', roleDetail: 'Head of global design, menswear and womenswear', start: 2013,
        notes: 'Joined Made & Crafted in 2009, then held a merchandising role. Appointed head of design in August 2013, reporting to Karyn Hillman; later became SVP of design and design innovation. No longer at Levi’s when appointed to Lululemon in 2024; precise departure year is unconfirmed.',
        sources: ['https://www.levistrauss.com/wp-content/uploads/2019/03/The-Levis-Brand-Announces-New-Global-Leadership-Appointments.pdf', 'https://fashionunited.com/news/people/lululemon-names-jonathan-cheung-global-creative-director/2024011557866'],
      },
      { house: 'lululemon', role: 'Creative Director', roleDetail: 'Global Creative Director', start: 2024, notes: 'Appointed in January 2024; remit expanded in May 2024 to report directly to the CEO and oversee design, innovation and product development. Exact end date unconfirmed.', sources: ['https://fashionunited.com/news/people/lululemon-names-jonathan-cheung-global-creative-director/2024011557866', 'https://s24.q4cdn.com/538403808/files/doc_news/lululemon-Announces-Evolved-Structure-of-Product-and-Brand-Teams-2024.pdf'] },
    ],
  },
  michelleGass: {
    name: 'Michelle Gass',
    career: [
      {
        house: 'levis', role: 'Other', roleDetail: 'President and CEO, Levi Strauss & Co.', start: 2024, end: null,
        notes: 'Assumed the CEO role on January 29, 2024. A corporate executive role rather than a creative-director appointment.',
        sources: ['https://www.levistrauss.com/wp-content/uploads/2024/01/Michelle-First-Day-Release_1.21.24.pdf', 'https://www.levistrauss.com/who-we-are/leadership/'],
      },
    ],
  },
  jeanPatou: {
    name: 'Jean Patou',
    died: 1936,
    nationality: 'French',
    career: [
      {
        house: 'patou', role: 'Founder', roleDetail: 'Founder and couturier', start: 1914, end: 1936,
        sources: ['https://www.patou.com/pages/history-jean-patou', 'https://www.encyclopedia.com/fashion/encyclopedias-almanacs-transcripts-and-maps/patou-jean'],
      },
    ],
  },
  paulMorszeck: {
    name: 'Paul Morszeck',
    nationality: 'German',
    career: [
      {
        house: 'rimowa', role: 'Founder', roleDetail: 'Founder and luggage maker', start: 1898,
        notes: 'Founded the original Cologne workshop. Exact end of leadership tenure unconfirmed.',
        sources: ['https://www.rimowa.com/heritage', 'https://www.lvmh.com/en/our-maisons/fashion-leather-good/rimowa'],
      },
    ],
  },
  alexandreArnault: {
    name: 'Alexandre Arnault',
    nationality: 'French',
    career: [
      {
        house: 'rimowa', role: 'Other', roleDetail: 'CEO', start: 2017, end: 2021,
        notes: 'Led the brand after the LVMH acquisition; succeeded as CEO in January 2021.',
        sources: ['https://www.rimowadesignprize.com/en/archive/2024/jury', 'https://www.vogue.com/article/how-rimowa-followed-lvmhs-tried-and-tested-formula-for-growth'],
      },
    ],
  },
  hectorMuelas: {
    name: 'Héctor Muelas',
    career: [
      {
        house: 'rimowa', role: 'Other', roleDetail: 'Chief Brand Officer', start: 2017, end: 2019,
        notes: 'Led brand creative, advertising, digital, social and public relations during Rimowa’s repositioning.',
        sources: ['https://www.oneclub.org/awards/theoneshow/-judge/2508/hector-muelas', 'https://fashionunited.com/news/people/rimowa-adds-hector-muelas-as-chief-brand-officer/2017061616234', 'https://www.vogue.com/article/the-vogue-business-people-moves-tracker'],
      },
    ],
  },
  rockyJacob: {
    name: 'Rocky Jacob',
    career: [
      {
        house: 'rimowa', role: 'Other', roleDetail: 'Chief Product Officer', start: 2017,
        notes: 'Appointed in June 2017 to oversee product design, engineering and production. Subsequently left; exact departure date unconfirmed.',
        sources: ['https://tn.fashionnetwork.com/newsPdf/downloadPdf/?id=844280', 'https://www.linkedin.com/posts/rocky-jacob-05945723_rimowa-is-hiring-for-key-roles-we-are-looking-activity-6369752543236542464-M-qY'],
      },
    ],
  },
  /* ---------- Sportswear: founders, creative leaders and senior product roles ---------- */
  francoisSalomon: {
    name: 'François Salomon',
    nationality: 'French',
    career: [{
      house: 'salomon', role: 'Founder', roleDetail: 'Founder of the family workshop', start: 1947,
      sources: ['https://assets.ctfassets.net/7iktyqnb7v9e/5GpMjYflH8Ex5TMY6q0Cmu/d5e5785440a6b7042bf41d93371ece0a/salomon-impact-report-2023_en.pdf'],
    }],
  },
  guillaumeMeyzenq: {
    name: 'Guillaume Meyzenq',
    career: [{
      house: 'salomon', role: 'Other', roleDetail: 'President and CEO; formerly Chief Product Officer', start: 2025, end: null,
      notes: 'CEO appointment effective January 1, 2025. Previously led the brand’s footwear business and served as Chief Product Officer.',
      sources: ['https://www.amersports.com/newsroom/amer-sports-announces-key-leadership-changes/'],
    }],
  },
  philKnight: {
    name: 'Phil Knight',
    nationality: 'American',
    career: [{
      house: 'nike', role: 'Founder', roleDetail: 'Co-founder, Blue Ribbon Sports / Nike', start: 1964,
      notes: 'Co-founded the business with Bill Bowerman in January 1964. This entry records the founding rather than a dated CEO tenure.',
      sources: ['https://about.nike.com/en-GB/magazine/the-handshake-that-started-it-all'],
    }],
  },
  billBowerman: {
    name: 'Bill Bowerman',
    nationality: 'American',
    career: [{
      house: 'nike', role: 'Founder', roleDetail: 'Co-founder and footwear innovator', start: 1964,
      sources: ['https://about.nike.com/en-GB/magazine/the-handshake-that-started-it-all'],
    }],
  },
  tinkerHatfield: {
    name: 'Tinker Hatfield',
    nationality: 'American',
    career: [{
      house: 'nike', role: 'Other', roleDetail: 'Designer; later Vice President of Creative Concepts', start: 1981,
      notes: 'Joined Nike as an architect in 1981 before becoming a footwear designer. The Smithsonian identified him as VP of Creative Concepts in 2019; the exact promotion and departure dates are unconfirmed.',
      sources: ['https://www.cooperhewitt.org/2019/09/26/nda-20-yrs-qa-with-tinker-hatfield/'],
    }],
  },
  adiDassler: {
    name: 'Adolf "Adi" Dassler',
    nationality: 'German',
    career: [{
      house: 'adidas', role: 'Founder', roleDetail: 'Founder and sports-shoe developer', start: 1949, end: 1978,
      sources: ['https://www.adidas-group.com/en/about/history', 'https://www.adidassler.org/de/leben-und-werk/zeitstrahl'],
    }],
  },
  nicGalway: {
    name: 'Nic Galway',
    career: [{
      house: 'adidas', role: 'Other', roleDetail: 'Vice President of Global Design, adidas Originals', start: 2014,
      notes: 'Joined adidas in 1999 and became VP of global design in 2014. Later served as SVP of global design; exact end of this tenure is unconfirmed.',
      sources: ['https://preview.thenewsmarket.com/Previews/ADID/DocumentAssets/414716.pdf', 'https://businessoffashion-businessoffashion-prod.web.arc-cdn.net/people/nic-galway/'],
    }],
  },
  williamRiley: {
    name: 'William J. Riley',
    career: [{
      house: 'newBalance', role: 'Founder', roleDetail: 'Founder, New Balance Arch Support Company', start: 1906,
      sources: ['https://newbalance.newsmarket.com/corporate/new-balance-corporate-fact-sheet/s/54b3b010-e49e-4bcd-a877-9705728b251a'],
    }],
  },
  kihachiroOnitsuka: {
    name: 'Kihachiro Onitsuka',
    nationality: 'Japanese',
    career: [{
      house: 'asics', role: 'Founder', roleDetail: 'Founder of the predecessor Onitsuka business', start: 1949,
      notes: 'ASICS was formed through a merger in 1977; this entry follows the brand’s Onitsuka origins.',
      sources: ['https://corp.asics.com/en/about_asics/history', 'https://corp.asics.com/en/stories/history01'],
    }],
  },
  joeFoster: {
    name: 'Joe Foster',
    nationality: 'British',
    career: [{
      house: 'reebok', role: 'Founder', roleDetail: 'Co-founder with Jeff Foster', start: 1958,
      notes: 'Established Mercury Sports Footwear in Bury with his brother in 1958; the Reebok name followed in 1960.',
      sources: ['https://www.reebokthefounder.com/'],
    }],
  },
  jeffFoster: {
    name: 'Jeff Foster',
    nationality: 'British',
    career: [{
      house: 'reebok', role: 'Founder', roleDetail: 'Co-founder with Joe Foster', start: 1958,
      sources: ['https://www.reebokthefounder.com/'],
    }],
  },
  wendyKula: {
    name: 'Wendy Kula',
    career: [{
      house: 'saucony', role: 'Other', roleDetail: 'Chief Marketing Officer', start: 2026, end: null,
      notes: 'Appointed in May 2026 to lead global marketing across performance running, lifestyle and culture.',
      sources: ['https://investors.wolverineworldwide.com/news/news-details/2026/Saucony-Appoints-Wendy-Kula-as-Chief-Marketing-Officer/default.aspx'],
    }],
  },
  rihachiMizuno: {
    name: 'Rihachi Mizuno',
    nationality: 'Japanese',
    died: 1970,
    career: [{
      house: 'mizuno', role: 'Founder', roleDetail: 'Co-founder and sports-equipment developer', start: 1906, end: 1970,
      sources: ['https://corp.mizuno.com/en/about/history', 'https://corp.mizuno.com/en/zaidan/about'],
    }],
  },
  rizoMizuno: {
    name: 'Rizo Mizuno',
    nationality: 'Japanese',
    career: [{
      house: 'mizuno', role: 'Founder', roleDetail: 'Co-founder with Rihachi Mizuno', start: 1906,
      sources: ['https://corp.mizuno.com/en/about/history'],
    }],
  },
  akitoMizuno: {
    name: 'Akito Mizuno',
    nationality: 'Japanese',
    career: [{
      house: 'mizuno', role: 'Other', roleDetail: 'President and Representative Director', start: 2006, end: null,
      notes: 'Appointed president in June 2006; identified in that role in the company’s 2025 annual securities report.',
      sources: ['https://corp.mizuno.com/en/about/history', 'https://corp.mizuno.com/system/files/ir/2025-10/Mizuno%20112th%20Annual%20Securities%20Report.pdf'],
    }],
  },
  kevinPlank: {
    name: 'Kevin Plank',
    nationality: 'American',
    career: [{
      house: 'underArmour', role: 'Founder', start: 1996, end: null,
      notes: 'Founded Under Armour in 1996. Returned as president and CEO in April 2024 after serving as Executive Chair and Brand Chief from 2020 to March 2024.',
      sources: ['https://about.underarmour.com/en/our-company/history.html', 'https://about.underarmour.com/en/investors/corporate-governance.html'],
    }],
  },
  timCoppens: {
    name: 'Tim Coppens',
    nationality: 'Belgian',
    career: [{
      house: 'underArmour', role: 'Creative Director', roleDetail: 'Executive Creative Director, UAS line', start: 2016, end: 2018,
      notes: 'Directed the UAS fashion line rather than the entire Under Armour brand; departure was announced ahead of the Spring 2018 collection.',
      sources: ['https://cdn-static.findly.com/wp-content/uploads/sites/39/2016/06/UA_News_2016_6_2_UA_Biz.pdf', 'https://fashionista.com/2017/10/under-armour-revenue-sales-decline-q3-2017'],
    }],
  },
  rudolfDassler: {
    name: 'Rudolf Dassler',
    nationality: 'German',
    career: [{
      house: 'puma', role: 'Founder', roleDetail: 'Founder and sports-shoe manufacturer', start: 1948,
      sources: ['https://about.puma.com/en/puma/puma-timeline', 'https://www.sfmoma.org/artist/puma/'],
    }],
  },
  rihanna: {
    name: 'Rihanna',
    nationality: 'Barbadian',
    career: [
      {
        house: 'puma', role: 'Creative Director', roleDetail: 'Women’s collections / Fenty x Puma', start: 2014, end: 2018,
        notes: 'Appointment announced in December 2014; partnership covered women’s collections and Fenty x Puma rather than all Puma products.',
        sources: ['https://about.puma.com/en/newsroom/news/rihanna-partner-puma', 'https://about.puma.com/en/newsroom/news/fenty-x-puma-officially-back-rihanna-launches-avanti'],
      },
      {
        house: 'fenty', role: 'Founder', roleDetail: 'Founder, CEO and Artistic Director', start: 2019, end: 2021,
        notes: 'Led the LVMH-backed fashion maison until its operations were suspended in February 2021.',
        sources: ['https://montfort.london/wp-content/uploads/2019/06/LVMH-announces-the-fast-approaching-launch-of-a-new-luxury-Maison-developed-by-Robyn-Rihanna-Fenty.pdf', 'https://www.vogue.com/article/rihanna-fenty-launch-paris-pop-up', 'https://uk.investing.com/news/stock-market-news/lvmh-rihanna-to-pause-fenty-fashion-venture-focus-on-lingerie-cosmetics-2299242'],
      },
      {
        house: 'puma', role: 'Creative Director', roleDetail: 'Fenty x Puma', start: 2023,
        notes: 'Returned for a multi-year Fenty x Puma partnership in 2023. Exact end date of the renewed partnership is unconfirmed.',
        sources: ['https://about.puma.com/en/newsroom/news/fenty-x-puma-officially-back-rihanna-launches-avanti', 'https://annual-report.puma.com/2023/en/company-overview/sportstyle/index.html'],
      },
    ],
  },
  hamiltonCarhartt: {
    name: 'Hamilton Carhartt',
    nationality: 'American',
    died: 1937,
    career: [{
      house: 'carhartt', role: 'Founder', roleDetail: 'Founder and workwear developer', start: 1889, end: 1937,
      sources: ['https://www.carhartt.com/carhartt-history', 'https://www.detroithistorical.org/learn/online-research/encyclopedia-of-detroit/carhartt-hamilton'],
    }],
  },
  markValade: {
    name: 'Mark Valade',
    nationality: 'American',
    career: [{
      house: 'carhartt', role: 'Other', roleDetail: 'President, fourth-generation family leadership', start: 1998,
      notes: 'Became president in 1998; this records the documented appointment, with the end of that particular tenure unconfirmed.',
      sources: ['https://www.carhartt.com/carhartt-history'],
    }],
  },
  akeNordin: {
    name: 'Åke Nordin',
    nationality: 'Swedish',
    died: 2013,
    career: [{
      house: 'fjallraven', role: 'Founder', roleDetail: 'Founder and outdoor-equipment inventor', start: 1960, end: 2013,
      notes: 'Developed framed backpacks before founding Fjällräven in 1960. This entry records the founder’s association, not a continuous CEO appointment.',
      sources: ['https://www.fenixoutdoor.com/wp-content/uploads/2026/03/ANNUAL-REPORT-2025_FINAL.pdf', 'https://www.sverigesradio.se/artikel/5745877'],
    }],
  },
  eddieBauer: {
    name: 'Eddie Bauer',
    nationality: 'American',
    career: [{
      house: 'eddieBauer', role: 'Founder', roleDetail: 'Founder and outdoor-clothing inventor', start: 1920, end: 1968,
      notes: 'Founded the Seattle shop in 1920; retired and sold his interest in 1968.',
      sources: ['https://www.historylink.org/file/1671', 'https://corporate.authentic.com/press-releases/eddie-bauer-next-adventure-return-first-ascent'],
    }],
  },
  /* ---------- Skate, streetwear and sportswear additions ---------- */
  paulVanDoren: {
    name: 'Paul Van Doren',
    nationality: 'American',
    career: [{
      house: 'vans', role: 'Founder', roleDetail: 'Co-founder, Van Doren Rubber Company', start: 1966,
      sources: ['https://www.vans.com/en-us/about', 'https://www.foxla.com/news/vans-co-founder-paul-van-doren-dead-at-90'],
    }],
  },
  jimVanDoren: {
    name: 'Jim Van Doren',
    nationality: 'American',
    career: [{
      house: 'vans', role: 'Founder', roleDetail: 'Co-founder with Paul Van Doren and partners', start: 1966,
      sources: ['https://www.foxla.com/news/vans-co-founder-paul-van-doren-dead-at-90'],
    }],
  },
  marquisMillsConverse: {
    name: 'Marquis Mills Converse',
    nationality: 'American',
    career: [{
      house: 'converse', role: 'Founder', roleDetail: 'Founder, Converse Rubber Shoe Company', start: 1908,
      sources: ['https://www.converse.com/c/converse-history', 'https://about.nike.com/en/magazine/converse-chuck-taylor-all-star-iconic-sneaker-true-history'],
    }],
  },
  clintOgbenna: {
    name: 'Clint Ogbenna (Clint419)',
    career: [{
      house: 'corteiz', role: 'Founder', roleDetail: 'Founder and creative lead', start: 2017,
      sources: ['https://www.arts.ac.uk/colleges/london-college-of-fashion/stories/lcf24-tamara-aiyads-the-power-of-cultural-branding-shines-a-light-on-corteizs-hold-on-gen-z', 'https://www.goat.com/editorial/beginners-guide-to-corteiz'],
    }],
  },
  cynthiaLu: {
    name: 'Cynthia Lu',
    career: [{
      house: 'billionaireBoysClub', role: 'Other', roleDetail: 'PR team', start: 2012,
      notes: 'Joined the public-relations office in 2012, before later working with i am OTHER and as Pharrell Williams’s assistant and stylist. Exact end of the BBC role is unconfirmed.',
      sources: ['https://www.gq.com/story/cactus-plant-flea-market-cynthia-lu', 'https://www.sneakerfreaker.com/features/cactus-plant-flea-market-explained'],
    }, {
      house: 'cactusPlantFleaMarket', role: 'Founder', roleDetail: 'Founder and designer', start: 2015, end: null,
      sources: ['https://www.highsnobiety.com/tag/cactus-plant-flea-market/', 'https://milled.com/union-los-angeles/union-los-angeles-x-cactus-plant-flea-market-QR4IuAoOdrxgnURr'],
    }],
  },
  simonFeinbloom: {
    name: 'Simon Feinbloom',
    career: [{
      house: 'champion', role: 'Founder', roleDetail: 'Co-founder, Knickerbocker Knitting Mills', start: 1919,
      notes: 'Founded the business with Bill and Abe; his sons inherited it in 1922.',
      sources: ['https://www.champion.com/pages/about-champion'],
    }],
  },
  billFeinbloom: {
    name: 'Bill Feinbloom',
    career: [{
      house: 'champion', role: 'Founder', roleDetail: 'Co-founder and product innovator', start: 1919,
      notes: 'With Abe, inherited the company in 1922. Developed the Champacraft flocking process for printed athletic apparel.',
      sources: ['https://www.champion.com/pages/about-champion'],
    }],
  },
  abeFeinbloom: {
    name: 'Abe Feinbloom',
    career: [{
      house: 'champion', role: 'Founder', roleDetail: 'Co-founder and teamwear business leader', start: 1919,
      notes: 'With Bill, inherited the company in 1922; helped establish the brand’s early teamwear business.',
      sources: ['https://www.champion.com/pages/about-champion'],
    }],
  },
  olivierBernhard: {
    name: 'Olivier Bernhard',
    nationality: 'Swiss',
    career: [{
      house: 'onRunning', role: 'Founder', roleDetail: 'Co-founder and product-development leader', start: 2010, end: null,
      sources: ['https://www.sec.gov/Archives/edgar/data/1858985/000185898526000008/onholdingag-20251231.htm', 'https://press.on-running.com/on-co-founders-to-lead-next-chapter-of-growth-as-co-ceos-94j2uq'],
    }],
  },
  davidAllemann: {
    name: 'David Allemann',
    nationality: 'Swiss',
    career: [{
      house: 'onRunning', role: 'Founder', roleDetail: 'Co-founder; later Executive Co-Chairman and Co-CEO', start: 2010, end: null,
      notes: '2010 records the founding, not the start of the co-CEO position. Served as Executive Co-Chairman from 2021; the co-CEO transition was announced in 2026.',
      sources: ['https://www.sec.gov/Archives/edgar/data/1858985/000185898526000008/onholdingag-20251231.htm', 'https://press.on-running.com/on-co-founders-to-lead-next-chapter-of-growth-as-co-ceos-94j2uq', 'https://investors.on-running.com/governance/'],
    }],
  },
  casparCoppetti: {
    name: 'Caspar Coppetti',
    nationality: 'Swiss',
    career: [{
      house: 'onRunning', role: 'Founder', roleDetail: 'Co-founder; later Executive Co-Chairman and Co-CEO', start: 2010, end: null,
      notes: '2010 records the founding, not the start of the co-CEO position. Served as Executive Co-Chairman from 2021; the co-CEO transition was announced in 2026.',
      sources: ['https://www.sec.gov/Archives/edgar/data/1858985/000185898526000008/onholdingag-20251231.htm', 'https://press.on-running.com/on-co-founders-to-lead-next-chapter-of-growth-as-co-ceos-94j2uq', 'https://investors.on-running.com/governance/'],
    }],
  },
  haroldHumphreys: {
    name: 'Harold Humphreys',
    nationality: 'British',
    career: [{
      house: 'umbro', role: 'Founder', roleDetail: 'Co-founder with Wallace Humphreys', start: 1924,
      sources: ['https://www.umbro.com/en/our-story/'],
    }],
  },
  wallaceHumphreys: {
    name: 'Wallace Humphreys',
    nationality: 'British',
    career: [{
      house: 'umbro', role: 'Founder', roleDetail: 'Co-founder with Harold Humphreys', start: 1924,
      sources: ['https://www.umbro.com/en/our-story/'],
    }],
  },
  maurizioVitale: {
    name: 'Maurizio Vitale',
    nationality: 'Italian',
    career: [{
      house: 'kappa', role: 'Head of House', roleDetail: 'Family business leader; launched Robe di Kappa', start: 1967,
      notes: 'Relaunched the inherited Maglificio Calzificio Torinese business with Robe di Kappa in 1967. The company itself dates to 1916; exact leadership end date unconfirmed.',
      sources: ['https://www.basicpress.com/contenuti/media/resultMedia.asp?ID=148729'],
    }],
  },
  chipWilson: {
    name: 'Chip Wilson',
    nationality: 'Canadian',
    career: [{
      house: 'lululemon', role: 'Founder', start: 1998,
      notes: 'Founded Lululemon in Vancouver; this entry records the founding, not an ongoing executive appointment.',
      sources: ['https://www.lululemon.com.hk/en-hk/content/history/history.html', 'https://corporate.lululemon.com/about-us/our-history'],
    }],
  },
  takeoIshimoto: {
    name: 'Takeo Ishimoto',
    nationality: 'Japanese',
    career: [{
      house: 'descente', role: 'Founder', roleDetail: 'Founder of predecessor Tsuruya', start: 1935,
      notes: 'Founded Tsuruya in 1935; the Descente brand launched in 1957.',
      sources: ['https://www.descente.co.jp/en/company/history/'],
    }],
  },
  marcelloDanieli: {
    name: 'Marcello Danieli',
    nationality: 'Italian',
    career: [{
      house: 'diadora', role: 'Founder', roleDetail: 'Co-founder of the original footwear workshop', start: 1948,
      notes: 'Started the workshop with Rinaldo Menegon in 1948; established Calzaturificio Diadora after the partners separated in 1967.',
      sources: ['https://www.museodelmarchioitaliano.it/diadora/', 'https://www.diadora.com/history/'],
    }],
  },
  rinaldoMenegon: {
    name: 'Rinaldo Menegon',
    nationality: 'Italian',
    career: [{
      house: 'diadora', role: 'Founder', roleDetail: 'Co-founder of the predecessor workshop', start: 1948, end: 1967,
      notes: 'The partners separated in 1967; Danieli subsequently established Calzaturificio Diadora.',
      sources: ['https://www.museodelmarchioitaliano.it/diadora/'],
    }],
  },
  /* ---------- Outdoor and running additions ---------- */
  yukioYamai: {
    name: 'Yukio Yamai',
    nationality: 'Japanese',
    died: 1992,
    career: [{
      house: 'snowPeak', role: 'Founder', roleDetail: 'Founder and outdoor-equipment developer', start: 1958, end: 1992,
      sources: ['https://ir.snowpeak.co.jp/en/history/'],
    }],
  },
  lisaYamai: {
    name: 'Lisa Yamai',
    nationality: 'Japanese',
    career: [{
      house: 'snowPeak', role: 'Head Designer', roleDetail: 'Apparel design and development', start: 2014,
      notes: 'Led the first apparel line, launched in 2014; the source describes her design work in 2019. Exact end of the apparel design tenure unconfirmed.',
      sources: ['https://www.snowpeak.com/blogs/explore/get-to-know-lisa-yamai'],
    }],
  },
  keitaIkeuchi: {
    name: 'Keita Ikeuchi',
    nationality: 'Japanese',
    career: [{
      house: 'isseyMiyake', role: 'Other', roleDetail: 'Menswear design and product development',
      notes: 'Worked at Issey Miyake Men before co-founding and wander in 2011. Tenure dates are unconfirmed.',
      sources: ['https://www.tokyo-fashion-award.jp/winners/andwander.php', 'https://keitaikeuchi.com/'],
    }, {
      house: 'andWander', role: 'Founder', roleDetail: 'Co-founder and designer', start: 2011,
      sources: ['https://www.andwander.com/about-us.html', 'https://www.tokyo-fashion-award.jp/winners/andwander.php'],
    }],
  },
  mihokoMori: {
    name: 'Mihoko Mori',
    nationality: 'Japanese',
    career: [{
      house: 'isseyMiyake', role: 'Other', roleDetail: 'Design team',
      notes: 'Worked at Issey Miyake before becoming a freelance designer and co-founding and wander in 2011. Tenure dates are unconfirmed.',
      sources: ['https://www.tokyo-fashion-award.jp/winners/andwander.php', 'https://www.andwander.com/about-us.html'],
    }, {
      house: 'andWander', role: 'Founder', roleDetail: 'Co-founder and designer', start: 2011,
      sources: ['https://www.andwander.com/about-us.html', 'https://www.tokyo-fashion-award.jp/winners/andwander.php'],
    }],
  },
  maurizioQuaglia: {
    name: 'Maurizio Quaglia',
    career: [{
      house: 'roa', role: 'Head Designer', roleDetail: 'Co-creator and technical footwear designer', start: 2015,
      notes: 'Developed the original footwear concept with Slam Jam’s creative team. Exact end date unconfirmed.',
      sources: ['https://selectshopframe.com/blogs/frame-zine/about-brand-roa'],
    }],
  },
  jimJannard: {
    name: 'Jim Jannard',
    nationality: 'American',
    career: [{
      house: 'oakley', role: 'Founder', roleDetail: 'Founder and product inventor', start: 1975,
      sources: ['https://www.oakley.com/en-us/lp/heritage'],
    }],
  },
  travisScott: {
    name: 'Travis Scott',
    nationality: 'American',
    career: [{
      house: 'oakley', role: 'Other', roleDetail: 'Chief Visionary Officer', start: 2025, end: null,
      notes: 'Multi-year creative partnership announced June 23, 2025, with his Cactus Jack team. This role is distinct from Matthew M. Williams’s apparel, footwear and accessories creative directorship.',
      sources: ['https://oakley-media-hub.prezly.com/oakley-names-travis-scott-chief-visionary-announcing-multi-year-partnership-to-reimagine-the-future', 'https://oakley-media-hub.prezly.com/matthew-m-williams-named-creative-director-apparel-footwear-and-accessories-at-oakley-as-travis-scott-continues-the-brands-chief-visionary-officer-journey'],
    }],
  },
  bricePartouche: {
    name: 'Brice Partouche',
    nationality: 'French',
    career: [{
      house: 'satisfy', role: 'Founder', roleDetail: 'Founder and creative director', start: 2015,
      sources: ['https://presse.bpifrance.fr/bpifrance-entre-au-capital-de-satisfy-marque-creative-francaise-de-running-premium/'],
    }],
  },
  mikeGraham: {
    name: 'Mike Graham',
    nationality: 'American',
    career: [{
      house: 'gramicci', role: 'Founder', roleDetail: 'Founder and climbing-apparel designer', start: 1982,
      sources: ['https://gramicci.com/pages/about', 'https://www.itochu.co.jp/en/news/press/2014/140711.html'],
    }],
  },
  tomDaly: {
    name: 'Tom Daly',
    career: [{
      house: 'districtVision', role: 'Founder', roleDetail: 'Co-founder with Max Vallot', start: 2015, end: null,
      sources: ['https://districtvision.com/pages/company', 'https://www.cosmotog.com/collections/district-vision'],
    }],
  },
  maxVallot: {
    name: 'Max Vallot',
    career: [{
      house: 'districtVision', role: 'Founder', roleDetail: 'Co-founder with Tom Daly', start: 2015, end: null,
      sources: ['https://districtvision.com/pages/company', 'https://www.cosmotog.com/collections/district-vision'],
    }],
  },
  simonMottram: {
    name: 'Simon Mottram',
    nationality: 'British',
    career: [{
      house: 'rapha', role: 'Founder', start: 2004,
      sources: ['https://www.prnewswire.com/news-releases/rapha-strengthens-leadership-position-and-growth-ambitions-with-investment-from-rzc-639161213.html'],
    }],
  },
  lukeScheybeler: {
    name: 'Luke Scheybeler',
    nationality: 'British',
    career: [{
      house: 'rapha', role: 'Founder', roleDetail: 'Co-founder and creative director', start: 2004, end: 2009,
      sources: ['https://www.scheybeler.com/rapha', 'https://www.designweek.co.uk/rapha-building-a-brand-through-creativity/'],
    }],
  },
  franMillar: {
    name: 'Fran Millar',
    career: [{
      house: 'rapha', role: 'Other', roleDetail: 'CEO', start: 2024, end: 2026,
      notes: 'Appointed in September 2024; departure reported in September 2026.',
      sources: ['https://content.rapha.cc/ch/fr/company-information/leadership', 'https://www.bikeradar.com/news/rapha-ceo-fran-millar-leaves-company-after-two-years'],
    }],
  },
  charlesParsons: {
    name: 'Charles Parsons',
    nationality: 'British',
    career: [{
      house: 'karrimor', role: 'Founder', roleDetail: 'Co-founder of the original bag-making business', start: 1946,
      sources: ['https://www.karrimor.com/customerservices/otherinformation/aboutus'],
    }],
  },
  maryParsons: {
    name: 'Mary Parsons',
    nationality: 'British',
    career: [{
      house: 'karrimor', role: 'Founder', roleDetail: 'Co-founder of the original bag-making business', start: 1946,
      sources: ['https://www.karrimor.com/customerservices/otherinformation/aboutus'],
    }],
  },
  graceDavies: {
    name: 'Grace Davies',
    nationality: 'British',
    career: [{
      house: 'karrimor', role: 'Founder', roleDetail: 'Co-founder of the original bag-making business', start: 1946,
      sources: ['https://www.karrimor.com/customerservices/otherinformation/aboutus'],
    }],
  },
  dennisSignor: {
    name: 'Dennis Signor',
    nationality: 'Italian',
    career: [{
      house: 'diemme', role: 'Founder', roleDetail: 'Co-founder and footwear maker', start: 1992,
      sources: ['https://diemme.com/pages/our-story', 'https://www.melagence.com/news/30-years-of-diemme'],
    }],
  },
  maicoSignor: {
    name: 'Maico Signor',
    nationality: 'Italian',
    career: [{
      house: 'diemme', role: 'Founder', roleDetail: 'Co-founder and footwear maker', start: 1992,
      sources: ['https://diemme.com/pages/our-story', 'https://www.melagence.com/news/30-years-of-diemme'],
    }],
  },
  isamuTatsuno: {
    name: 'Isamu Tatsuno',
    nationality: 'Japanese',
    career: [{
      house: 'montbell', role: 'Founder', roleDetail: 'Co-founder and outdoor-equipment developer', start: 1975,
      sources: ['https://www.montbell.co.uk/pages/about-montbell', 'https://montbelloutdoor.com.au/pages/about-us'],
    }],
  },
  fumiakiMasaki: {
    name: 'Fumiaki Masaki',
    nationality: 'Japanese',
    career: [{
      house: 'montbell', role: 'Founder', roleDetail: 'Co-founder with Isamu Tatsuno and Sachiko Masuo', start: 1975,
      sources: ['https://montbelloutdoor.com.au/pages/about-us'],
    }],
  },
  sachikoMasuo: {
    name: 'Sachiko Masuo',
    nationality: 'Japanese',
    career: [{
      house: 'montbell', role: 'Founder', roleDetail: 'Co-founder with Isamu Tatsuno and Fumiaki Masaki', start: 1975,
      sources: ['https://montbelloutdoor.com.au/pages/about-us'],
    }],
  },
  paulLamfrom: {
    name: 'Paul Lamfrom',
    career: [{
      house: 'columbia', role: 'Founder', roleDetail: 'Founder of Columbia Hat Company', start: 1938,
      sources: ['https://www.columbia.com/our-story/'],
    }],
  },
  gertBoyle: {
    name: 'Gert Boyle',
    career: [{
      house: 'columbia', role: 'Head of House', roleDetail: 'President and family business leader', start: 1970, end: 1988,
      notes: 'Led the company as president from 1970 to 1988; also helped develop its outdoor products and became the face of its advertising.',
      sources: ['https://investor.columbia.com/sec-filings/annual-reports/content/0000893877-99-000199/0000893877-99-000199.pdf', 'https://www.columbia.com/our-story/'],
    }],
  },
  bernardGantmacher: {
    name: 'Bernard Gantmacher',
    career: [{
      house: 'gant', role: 'Founder', roleDetail: 'Co-founder and shirtmaker', start: 1949,
      sources: ['https://career.gant.com/en', 'https://www.gant.de/campaign/geschichte'],
    }],
  },
  martyGant: {
    name: 'Marty Gant',
    career: [{
      house: 'gant', role: 'Founder', roleDetail: 'Co-founder with Bernard and Elliot', start: 1949,
      sources: ['https://career.gant.com/en', 'https://www.gant.de/campaign/geschichte'],
    }],
  },
  elliotGant: {
    name: 'Elliot Gant',
    career: [{
      house: 'gant', role: 'Founder', roleDetail: 'Co-founder with Bernard and Marty', start: 1949,
      sources: ['https://career.gant.com/en', 'https://www.gant.de/campaign/geschichte'],
    }],
  },
  christopherBastin: {
    name: 'Christopher Bastin',
    nationality: 'Swedish',
    career: [
      {
        house: 'acneStudios', role: 'Other', roleDetail: 'Product development and buying',
        notes: 'Worked at Acne after H&M, before joining GANT in 2005. Exact tenure dates are unconfirmed.',
        sources: ['https://elpais.com/eps/2025-02-04/el-disenador-sueco-que-reinvento-el-estilo-pijo-americano-nunca-vas-a-parecer-un-payaso-nunca-vas-a-parecer-aburrido.html'],
      },
      {
        house: 'gant', role: 'Other', roleDetail: 'Shirt designer; later head of design for GANT Rugger', start: 2005, end: 2012,
        notes: 'Joined as a shirt designer in 2005, took on GANT Rugger in 2009, and became creative director of the full brand in 2012.',
        sources: ['https://www.kingmagazine.se/intervjuer/christopher-bastin-gant-intervju/1800459'],
      },
      {
        house: 'gant', role: 'Creative Director', start: 2012, end: 2015,
        sources: ['https://www.kingmagazine.se/intervjuer/christopher-bastin-gant-intervju/1800459'],
      },
      {
        house: 'gant', role: 'Artistic Director', roleDetail: 'Global Artistic Director', start: 2019, end: 2023, approximate: true,
        notes: 'Returned in 2019; the transition to Global Creative Director is approximately 2023, based on the February 2026 departure report describing three years in that role.',
        sources: ['https://www.retailgazette.co.uk/blog/2019/09/gant-ex-creative-director-returns-global-artistic-director/', 'https://www.habit.se/article/view/1210693/christopher_bastin_lamnar_gant'],
      },
      {
        house: 'gant', role: 'Creative Director', roleDetail: 'Global Creative Director', start: 2023, end: 2026, approximate: true,
        notes: 'Start year is approximate; departure reported in February 2026.',
        sources: ['https://www.habit.se/article/view/1210693/christopher_bastin_lamnar_gant'],
      },
    ],
  },
  michaelBastian: {
    name: 'Michael Bastian',
    nationality: 'American',
    career: [
      {
        house: 'ralphLauren', role: 'Other', roleDetail: 'Earlier role at Polo Ralph Lauren',
        notes: 'Worked at Polo Ralph Lauren before becoming men’s fashion director at Bergdorf Goodman and subsequently launching his own label. Exact tenure dates and job title at Polo are unconfirmed.',
        sources: ['https://fashionunited.uk/v1/fashion/gant-by-michael-bastian/2010062910334'],
      },
      {
        house: 'gant', role: 'Other', roleDetail: 'Designer, GANT by Michael Bastian collaboration', start: 2010, end: 2014,
        notes: 'Designed the co-branded menswear and womenswear line; final collection was autumn/winter 2014.',
        sources: ['https://fashionunited.uk/v1/fashion/gant-by-michael-bastian/2010062910334', 'https://fashionunited.uk/v1/design/gant-by-michael-bastian-comes-to-an-end/201402035557'],
      },
      {
        house: 'brooksBrothers', role: 'Creative Director', start: 2020, end: null,
        sources: ['https://cfda.com/news/michael-bastian-appointed-creative-director-of-brooks-brothers/', 'https://www.brooksbrothers.com/lookbook-spring-summer-2026.html'],
      },
    ],
    notes: 'Also served as interim creative director at Ted Baker in 2020, between the GANT collaboration and Brooks Brothers.',
    sources: ['https://cfda.com/news/michael-bastian-appointed-creative-director-of-brooks-brothers/'],
  },
  nathanSwartz: {
    name: 'Nathan Swartz',
    career: [{
      house: 'timberland', role: 'Founder', roleDetail: 'Shoemaker and founder of the predecessor business', start: 1952,
      notes: 'Bought a stake in the Abington Shoe Company in 1952, before the Timberland brand name was introduced.',
      sources: ['https://www.timberland.com.au/yellow-boot'],
    }],
  },
  sidneySwartz: {
    name: 'Sidney Swartz',
    career: [{
      house: 'timberland', role: 'Other', roleDetail: 'President and CEO', start: 1986, end: 1998,
      notes: 'Introduced the original Timberland waterproof boot in 1973 before later serving as president and CEO.',
      sources: ['https://www.timberland.com.au/yellow-boot', 'https://www.nhd.uscourts.gov/sites/default/files/Opinions/13/13NH044.pdf'],
    }],
  },
  jeffreySwartz: {
    name: 'Jeffrey Swartz',
    career: [{
      house: 'timberland', role: 'Other', roleDetail: 'President and CEO', start: 1998, end: 2011,
      sources: ['https://www.nhd.uscourts.gov/sites/default/files/Opinions/13/13NH044.pdf'],
    }],
  },
  viktorHorsting: {
    name: 'Viktor Horsting',
    nationality: 'Dutch',
    career: [{
      house: 'viktorAndRolf', role: 'Founder', roleDetail: 'Co-founder and co-creative director', start: 1993, end: null,
      sources: ['https://www.viktor-rolf.com/pages/about-us', 'https://www.otb.net/en/news/otb-acquires-100-of-viktor-and-rolf'],
    }],
  },
  rolfSnoeren: {
    name: 'Rolf Snoeren',
    nationality: 'Dutch',
    career: [{
      house: 'viktorAndRolf', role: 'Founder', roleDetail: 'Co-founder and co-creative director', start: 1993, end: null,
      sources: ['https://www.viktor-rolf.com/pages/about-us', 'https://www.otb.net/en/news/otb-acquires-100-of-viktor-and-rolf'],
    }],
  },
  pietroLoroPiana: {
    name: 'Pietro Loro Piana',
    nationality: 'Italian',
    career: [{
      house: 'loroPiana', role: 'Founder', roleDetail: 'Founder of the textile company', start: 1924, end: 1941,
      sources: ['https://www.lvmh.com/our-maisons/fashion-leather-good/loro-piana', 'https://siusa-archivi.cultura.gov.it/cgi-bin/siusa/pagina.pl?Chiave=54341&RicLin=en&RicSez=prodenti&RicTipoScheda=pe'],
    }],
  },
  francoLoroPiana: {
    name: 'Franco Loro Piana',
    nationality: 'Italian',
    career: [{
      house: 'loroPiana', role: 'Head of House', roleDetail: 'Family business leader', start: 1941,
      notes: 'Took over leadership in 1941; his sons Sergio and Pier Luigi succeeded him during the 1970s. Exact end year unconfirmed.',
      sources: ['https://siusa-archivi.cultura.gov.it/cgi-bin/siusa/pagina.pl?Chiave=54341&RicLin=en&RicSez=prodenti&RicTipoScheda=pe', 'https://www.retearchivibiellesi.it/entita/372-lanificio-ing-loro-piana-amp-c?i=56'],
    }],
  },
  sergioLoroPiana: {
    name: 'Sergio Loro Piana',
    nationality: 'Italian',
    career: [{
      house: 'loroPiana', role: 'Other', roleDetail: 'Co-chief executive and family business leader', end: 2013,
      notes: 'Led the company with Pier Luigi from the 1970s; exact start year unconfirmed. Both became vice-presidents following the LVMH acquisition in December 2013.',
      sources: ['https://www.lvmh.com/our-maisons/fashion-leather-good/loro-piana', 'https://www.globenewswire.com/news-release/2013/12/05/1775598/0/en/LVMH-GROUP-ACQUISITION-OF-LORO-PIANA-GAINS-FINAL-APPROVALS.html'],
    }],
  },
  pierLuigiLoroPiana: {
    name: 'Pier Luigi Loro Piana',
    nationality: 'Italian',
    career: [{
      house: 'loroPiana', role: 'Other', roleDetail: 'Co-chief executive and family business leader', end: 2013,
      notes: 'Led the company with Sergio from the 1970s; exact start year unconfirmed. Both became vice-presidents following the LVMH acquisition in December 2013.',
      sources: ['https://www.lvmh.com/our-maisons/fashion-leather-good/loro-piana', 'https://www.globenewswire.com/news-release/2013/12/05/1775598/0/en/LVMH-GROUP-ACQUISITION-OF-LORO-PIANA-GAINS-FINAL-APPROVALS.html'],
    }],
  },
  evaKorsten: {
    name: 'Eva Korsten',
    career: [{
      house: 'yumeYume', role: 'Founder', roleDetail: 'Co-founder and creative director', start: 2018,
      notes: 'Began developing the brand with Dave Hendriks in 2018; commercial launch followed in 2020. Identified as creative director in her 2023 interview; exact end date unconfirmed.',
      sources: ['https://www.harpersbazaar.com/nl/carriere/a42264019/eva-korsten-co-founder-yume-yume/', 'https://fablstyle.com/yume-yume-a-wonderland-of-artistry-and-subversive-beauty-an-interview-with-eva-korsten-creative-director-co-founder/'],
    }],
  },
  daveHendriks: {
    name: 'Dave Hendriks',
    career: [{
      house: 'yumeYume', role: 'Founder', roleDetail: 'Co-founder with Eva Korsten', start: 2018,
      notes: 'Began developing the brand in 2018; commercial launch followed in 2020.',
      sources: ['https://www.harpersbazaar.com/nl/carriere/a42264019/eva-korsten-co-founder-yume-yume/', 'https://www.ssense.com/en-nl/women/designers/yume-yume'],
    }],
  },
} satisfies Record<string, DesignerData<HouseId>>;

export type DesignerId = keyof typeof designers;
