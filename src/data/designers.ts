import type { DesignerData } from '../types';
import type { HouseId } from './houses';

/**
 * Designers and their careers. The object key is the designer id.
 *
 * Each `career` entry is one tenure at one house. Moves between houses are
 * derived automatically by sorting the career by start year, so all you
 * record is where they were and when.
 * Exclude one-off collaborations and capsules: they are not career tenures.
 * See CLAUDE.md for the project rule on collaboration connections.
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
      {
        house: 'pringleOfScotland',
        role: 'Creative Director',
        start: 2005,
        end: 2011,
        sources: ['https://www.vogue.co.uk/article/clare-waight-keller-resigns-from-pringle-of-scotland'],
      },
      {
        house: 'uniqlo',
        role: 'Other',
        roleDetail: 'Designer, Uniqlo : C',
        start: 2023,
        end: 2024,
        sources: ['https://www.fastretailing.com/eng/group/news/2409041100.html'],
      },
      {
        house: 'uniqlo',
        role: 'Creative Director',
        start: 2024,
        end: null,
        sources: ['https://www.fastretailing.com/eng/group/news/2409041100.html'],
      },
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
      {
        house: 'donnaKaran',
        role: 'Other',
        roleDetail: 'Design team in New York',
        end: 2012,
        notes: 'Worked at Donna Karan before joining Celine in 2012; exact start year unconfirmed.',
        sources: ['https://www.kering.com/api/download-file/?path=kering_EN_presse_communique_daniel_lee_appointed_creative_director_bottega_veneta_20180615_pdf_d9f52c24ce.pdf'],
      },
      { house: 'celine', role: 'Other', roleDetail: 'Director of ready-to-wear under Phoebe Philo', start: 2012, end: 2018 },
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
      {
        house: 'uniqlo',
        role: 'Other',
        roleDetail: '+J collaboration',
        start: 2009,
        end: 2011,
        notes: 'Personal collaboration with Jil Sander; distinct from the JIL SANDER fashion house.',
        sources: ['https://www.fastretailing.com/eng/group/news/1106231700.html'],
      },
      {
        house: 'uniqlo',
        role: 'Other',
        roleDetail: '+J collaboration, second chapter',
        start: 2020,
        end: 2021,
        sources: ['https://www.uniqlo.com/jp/ja/contents/corp/press-release/2021/10/21102111_21fwj.html'],
      },
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
      {
        house: 'vionnet',
        role: 'Creative Director',
        start: 2009,
        end: 2011,
        sources: ['https://www.vogue.co.uk/article/vionnet-rodolfo-paglialunga-leaves-croce-twins'],
      },
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
      {
        house: 'billionaireBoysClub',
        role: 'Founder',
        roleDetail: 'Co-founder with Pharrell Williams',
        start: 2003,
        end: 2011,
      },
      {
        house: 'icecream',
        role: 'Founder',
        roleDetail: 'Co-founder with Pharrell Williams',
        start: 2004,
        end: 2011,
        sources: ['https://www.bbcicecream.com/pages/about', 'https://hufworldwide.com/blogs/lookbooks/huf-x-bbc-icecream'],
      },
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
    career: [
      {
        house: 'donnaKaran',
        role: 'Founder',
        roleDetail: 'Co-founder and chief designer',
        start: 1984,
        end: 2015,
        sources: ['https://www.sec.gov/Archives/edgar/data/1012369/000091205701511432/a2047213z10-ka.txt', 'https://www.vogue.com/article/donna-karan-leaves-donna-karan-international'],
      },
      {
        house: 'dkny',
        role: 'Founder',
        start: 1989,
        end: 2015
      },
    ],
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
      {
        house: 'elizabethAndJames',
        role: 'Founder',
        roleDetail: 'Co-founder and co-creative director with Ashley Olsen',
        start: 2007,
        end: 2019,
        notes: 'Co-creative leadership was confirmed again in the 2019 Kohl’s partnership announcement. Exact end year unconfirmed.',
        sources: ['https://cfda.com/member/ashley-olsen/', 'https://investors.kohls.com/news/news-details/2019/Elizabeth-and-James-and-Kohls-Announce-Exclusive-Partnership-/default.aspx'],
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
      {
        house: 'elizabethAndJames',
        role: 'Founder',
        roleDetail: 'Co-founder and co-creative director with Mary-Kate Olsen',
        start: 2007,
        end: 2019,
        notes: 'Co-creative leadership was confirmed again in the 2019 Kohl’s partnership announcement. Exact end year unconfirmed.',
        sources: ['https://cfda.com/member/ashley-olsen/', 'https://investors.kohls.com/news/news-details/2019/Elizabeth-and-James-and-Kohls-Announce-Exclusive-Partnership-/default.aspx'],
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
      {
        house: 'uniqlo',
        role: 'Artistic Director',
        roleDetail: 'Uniqlo U and Paris R&D center',
        start: 2016,
        end: 2026,
        sources: ['https://www.fastretailing.com/eng/group/news/1807241530.html', 'https://www.lemonde.fr/en/m-le-mag/article/2026/08/30/uniqlo-u-s-christophe-lemaire-and-sarah-linh-tran-leave-the-helm-the-line-was-designed-so-it-would-not-end-with-us_6756977_117.html'],
      },
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
      {
        house: 'uniqlo',
        role: 'Other',
        roleDetail: 'Co-designer, Uniqlo and Lemaire collaboration',
        start: 2015,
        end: 2016,
        sources: ['https://www.fastretailing.com/eng/group/news/1503031700.html'],
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
      {
        house: 'rabanne',
        role: 'Creative Director',
        start: 2026,
        end: null,
        notes: 'Appointed in July 2026; first runway collection scheduled for March 2027.',
        sources: ['https://www.puig.com/en/newsroom/Rabanne-appoints-Olivier-Rousteing-as-Creative%20Director/'],
      },
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
      {
        house: 'pigalleParis',
        role: 'Founder',
        roleDetail: 'Co-founder',
        start: 2008,
        notes: 'Co-founding role documented by Le Monde. Departure date is unconfirmed.',
        sources: ['https://www.lemonde.fr/m-styles/article/2020/12/07/kitsch-bourgeois-streetwear-casablanca-la-jeune-marque-qui-monte_6062426_4497319.html'],
      },
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
    career: [{ house: 'brioni', role: 'Creative Director', start: 2017, end: 2018, sources: ['https://www.ilcentro.it/pescara/brioni-cambia-e-si-affida-a-un-creativo-austriaco-1.2020765'] }],
  },
  norbertStumpfl: {
    name: 'Norbert Stumpfl',
    nationality: 'Austrian',
    career: [
      { house: 'lanvin', role: 'Other', roleDetail: 'Menswear designer alongside Lucas Ossendrijver', start: 2005, end: 2014, sources: ['https://www.ilcentro.it/pescara/brioni-cambia-e-si-affida-a-un-creativo-austriaco-1.2020765', 'https://www.wallpaper.com/fashion-beauty/brioni-norbert-stumpfl-interview-2023'] },
      { house: 'balenciaga', role: 'Other', roleDetail: 'Head designer, menswear', start: 2014, end: 2016, sources: ['https://www.ilcentro.it/pescara/brioni-cambia-e-si-affida-a-un-creativo-austriaco-1.2020765'] },
      { house: 'adidas', role: 'Other', roleDetail: 'Freelance designer', notes: 'Freelance work for Adidas and Louis Vuitton is reported within 2016–2017; individual dates are unconfirmed.', sources: ['https://www.ilcentro.it/pescara/brioni-cambia-e-si-affida-a-un-creativo-austriaco-1.2020765'] },
      { house: 'louisVuitton', role: 'Other', roleDetail: 'Freelance designer under Kim Jones', notes: 'Between Balenciaga and Berluti; freelance work for Adidas and Louis Vuitton is reported within 2016–2017.', sources: ['https://www.ilcentro.it/pescara/brioni-cambia-e-si-affida-a-un-creativo-austriaco-1.2020765', 'https://www.vogue.com/fashion-shows/fall-2019-menswear/brioni'] },
      { house: 'berluti', role: 'Other', roleDetail: 'Design director under Haider Ackermann', start: 2017, end: 2018, sources: ['https://www.ilcentro.it/pescara/brioni-cambia-e-si-affida-a-un-creativo-austriaco-1.2020765', 'https://www.vogue.com/fashion-shows/fall-2019-menswear/brioni'] },
      { house: 'brioni', role: 'Creative Director', roleDetail: 'Design Director', start: 2018, end: 2025, sources: ['https://www.ilcentro.it/pescara/brioni-cambia-e-si-affida-a-un-creativo-austriaco-1.2020765', 'https://www.pambianconews.com/2025/12/09/le-strade-di-brioni-e-norbert-stumpfl-si-separano-dopo-sette-anni-468039/'] },
      { house: 'palZileri', role: 'Creative Director', start: 2026, end: null, notes: 'Appointed November 13, 2026 to oversee all collections and the brand image; debut collection Fall/Winter 2027.', sources: ['https://it.linkedin.com/company/pal-zileri', 'https://www.ansa.it/sito/notizie/cultura/moda/2026/11/13/norbert-stumpfl-e-il-nuovo-direttore-creativo-di-pal-zileri_a682c994-170c-4e4e-b88b-307940103d12.html'] },
    ],
  },
  gianfrancoBarizza: {
    name: 'Gianfranco Barizza',
    nationality: 'Italian',
    career: [{ house: 'palZileri', role: 'Other', roleDetail: 'Co-founder through Forall Confezioni', sources: ['https://www.viacavour.ca/pages/pal-zileri'] }],
  },
  aronneMiola: {
    name: 'Aronne Miola',
    nationality: 'Italian',
    career: [{ house: 'palZileri', role: 'Other', roleDetail: 'Co-founder through Forall Confezioni', sources: ['https://www.viacavour.ca/pages/pal-zileri'] }],
  },
  mauroRavizzaKrieger: {
    name: 'Mauro Ravizza Krieger',
    career: [
      { house: 'loroPiana', role: 'Other', roleDetail: 'Design role', sources: ['https://fashionunited.uk/news/people/mauro-ravizza-krieger-exits-creative-director-role-at-pal-zileri/2017060724751'] },
      { house: 'herno', role: 'Other', roleDetail: 'Design role', sources: ['https://fashionunited.uk/news/people/mauro-ravizza-krieger-exits-creative-director-role-at-pal-zileri/2017060724751'] },
      { house: 'palZileri', role: 'Creative Director', start: 2014, end: 2017, sources: ['https://fashionunited.uk/news/people/mauro-ravizza-krieger-exits-creative-director-role-at-pal-zileri/2017060724751'] },
    ],
    notes: 'Also worked for Caruso and Luciano Barbera; dates and exact earlier titles unconfirmed.',
  },
  roccoIannone: {
    name: 'Rocco Iannone',
    born: 1984,
    nationality: 'Italian',
    career: [
      { house: 'dolceGabbana', role: 'Other', roleDetail: 'Designer', start: 2006, sources: ['https://www.istitutomarangoni.com/en/im-mentors/rocco-iannone'] },
      { house: 'armani', role: 'Other', roleDetail: 'Giorgio Armani Uomo design team and special projects', end: 2017, sources: ['https://www.istitutomarangoni.com/en/im-mentors/rocco-iannone'] },
      { house: 'palZileri', role: 'Creative Director', start: 2017, end: 2019, sources: ['https://www.istitutomarangoni.com/en/im-mentors/rocco-iannone', 'https://hu.fashionnetwork.com/newsPdf/downloadPdf/?id=1154213'] },
    ],
    notes: 'Joined Ferrari as creative director for brand diversification in November 2019; Ferrari is not currently in the dataset.',
    sources: ['https://www.istitutomarangoni.com/en/im-mentors/rocco-iannone'],
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
        house: 'onitsukaTiger',
        role: 'Creative Director',
        start: 2017,
        end: null,
        notes: 'Creative directorship follows his earlier collaboration work; the collaboration itself is not recorded as a separate tenure.',
        sources: ['https://www.istitutomarangoni.com/en/alumni/stories/andrea-pompilio', 'https://www.onitsukatiger.com/es/en-es/onitsukatiger-store-locator'],
      },
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
    career: [
      {
        house: 'nigelCabourn',
        role: 'Other',
        sources: ['https://www.cabourn.com/en-us/blogs/journal/the-heritage-post-nigel-cabourn'],
        start: 1973,
        end: 1975,
        approximate: true,
        roleDetail: 'Sales agent for Cricket (later Nigel Cabourn)',
      },
      { house: 'paulSmith', role: 'Founder', roleDetail: 'Founder, creative director', start: 1970, end: null },
    ],
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
    career: [
      {
        house: 'stussy',
        role: 'Founder',
        roleDetail: 'Founder, designer',
        start: 1980,
        end: 1996,
      },
      {
        house: 'sDouble',
        role: 'Founder',
        roleDetail: 'Founder and designer',
        start: 2008,
        end: 2016,
        sources: ['https://sdouble-au.com/pages/catalogue', 'https://uk.complex.com/style/a/jaelaniturnerwilliams/shawn-stussy-revamps-sdouble'],
      },
      {
        house: 'sDouble',
        role: 'Creative Director',
        roleDetail: 'Founder and designer — revival',
        start: 2024,
        end: null,
        sources: ['https://sdouble-au.com/pages/catalogue', 'https://www.slnofficial.com/post/shawn-stussys-s-double-is-back'],
      },
    ],
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
      {
        house: 'mackintosh',
        role: 'Creative Director',
        sources: ['https://www.mackintosh.com/blogs/journal/journal-mackintosh-0001'],
        start: 2017,
        roleDetail: 'Mackintosh 0001 recurring premium line',
      },
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
      { house: 'americanEagle', role: 'Head Designer', roleDetail: 'Design director', notes: 'Employment confirmed by his first-person career account. The CFDA places the role within 2002–2012, which conflicts with the existing Ralph Lauren chronology; exact dates remain unresolved.', sources: ['https://www.highsnobiety.com/p/willy-chavarria/', 'https://cfda.com/member/willy-chavarria/'] },
      { house: 'calvinKlein', role: 'Other', roleDetail: 'Senior vice president of design, menswear', start: 2021, end: 2024 },
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
      {
        house: 'costumeNational',
        role: 'Other',
        roleDetail: 'Early design-team role',
        notes: 'Foundational experience at Costume National in Italy, confirmed by her CFDA biography; exact tenure dates and job title unconfirmed.',
        sources: ['https://cfda.com/member/rachel-scott/'],
      },
      {
        house: 'diotima',
        role: 'Founder',
        roleDetail: 'Founder and designer',
        start: 2021,
        end: null,
        sources: ['https://cfda.com/member/rachel-scott/'],
      },
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
      {
        house: 'icecream',
        role: 'Founder',
        roleDetail: 'Co-founder with Nigo',
        start: 2004,
        end: null,
        sources: ['https://www.bbcicecream.com/pages/about', 'https://hufworldwide.com/blogs/lookbooks/huf-x-bbc-icecream'],
      },
      {
        house: 'gStar',
        role: 'Other',
        roleDetail: 'Co-owner and creative partner',
        start: 2016,
        notes: 'Co-ownership and creative involvement announced in February 2016 after the RAW for the Oceans collaboration. Exact end year of this role unconfirmed; current majority ownership is recorded on the house.',
        sources: ['https://www.prnewswire.com/news-releases/pharrell-williams-announced-as-co-owner-of-g-star-raw-300217048.html'],
      },
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
      {
        house: 'gap',
        role: 'Other',
        roleDetail: 'Collaborating designer, Yeezy Gap Engineered by Balenciaga',
        start: 2022,
        end: 2022,
        notes: 'Designed the collaboration with Ye through his Balenciaga role; a project-specific partnership.',
        sources: ['https://www.vogue.com/article/ye-gap-engineered-by-balenciaga', 'https://www.vogue.com/slideshow/ye-and-demna-reveal-yeezy-gap-engineered-by-balenciaga'],
      },
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
      {
        house: 'uniqlo',
        role: 'Other',
        roleDetail: 'JW Anderson collaboration',
        start: 2017,
        notes: 'Recurring collaboration rather than creative direction of Uniqlo as a whole. Exact end date unconfirmed.',
        sources: ['https://www.fastretailing.com/eng/group/news/1707181800.html'],
      },
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
      {
        house: 'jCrew',
        role: 'Menswear Director',
        sources: ['https://www.jcrew.com/r/feature/mens/introducing-brendon-babenzien'],
        start: 2021,
        end: null,
        roleDetail: 'Men’s creative director',
      },
      { house: 'supreme', role: 'Creative Director', start: 2000, end: 2015, approximate: true },
      { house: 'noah', role: 'Founder', roleDetail: 'Co-founder, creative director', start: 2015, end: null },
    ],
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
      { house: 'mammut', role: 'Creative Director', roleDetail: 'Chief creative officer, product and marketing', start: 2017, end: 2020, sources: ['https://www.schuhkurier.de/mammut-meldet-wechsel-in-der-geschaeftsleitung/', 'https://www.the-spin-off.com/news/stories/The-Brands-How-haute-couture-inspired-Burtons-new-most-responsible-jacket--17695'] },
      { house: 'burton', role: 'Creative Director', roleDetail: 'Executive creative director, including the China joint venture', start: 2020, end: 2022, sources: ['https://www.boardsportsource.com/burton-brings-aboard-new-marketing-exec-creative-director/', 'https://www.the-spin-off.com/news/stories/The-Brands-How-haute-couture-inspired-Burtons-new-most-responsible-jacket--17695'] },
      { house: 'burton', role: 'Creative Director', roleDetail: 'Chief brand officer, overseeing creative and brand marketing', start: 2022, notes: 'Promoted in June 2022; exact end year unconfirmed.', sources: ['https://www.the-spin-off.com/news/stories/The-Brands-How-haute-couture-inspired-Burtons-new-most-responsible-jacket--17695'] },
    ],
    notes: 'Also held creative leadership roles at Esprit, Navyboot and Liebeskind Berlin. Subsequently became CEO of Jet Set; those brands are not currently in the dataset.',
    sources: ['https://www.schuhkurier.de/mammut-meldet-wechsel-in-der-geschaeftsleitung/', 'https://profashionals.de/nachgefragt/wir-wollen-the-cherry-on-the-cake-sein/'],
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
      {
        house: 'gap',
        role: 'Other',
        roleDetail: 'Retail employee, Chicago store',
        notes: 'Worked in a Gap store as a teenager; exact employment years unconfirmed.',
        sources: ['https://investors.gapinc.com/press-releases/news-details/2020/Kanye-West-Teams-with-Gap/default.aspx'],
      },
      { house: 'fendi', role: 'Other', roleDetail: 'Intern, alongside Virgil Abloh', start: 2009, end: 2009 },
      { house: 'yeezy', role: 'Founder', roleDetail: 'Founder, creative director', start: 2015, end: null },
      {
        house: 'gap',
        role: 'Other',
        roleDetail: 'Creative lead and partner, Yeezy Gap',
        start: 2020,
        end: 2022,
        notes: 'Directed Yeezy’s design studio for the co-branded line, announced in June 2020 with products launching in 2021. Gap announced the partnership’s end in September 2022 and removed products in October; this role concerned Yeezy Gap rather than creative direction of Gap overall.',
        sources: ['https://investors.gapinc.com/press-releases/news-details/2020/Kanye-West-Teams-with-Gap/default.aspx', 'https://www.gapinc.com/en-us/articles/2022/10/statement-on-yeezy-partnership'],
      },
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
    career: [
      {
        house: 'brooksBrothers',
        role: 'Creative Director',
        start: 2014,
        end: 2020
      },
      {
        house: 'gap',
        role: 'Other',
        roleDetail: 'GapStudio creative direction',
        start: 2025,
        sources: ['https://www.gapinc.com/es-us/articles/2025/09/the-next-chapter-in-gap-s-legacy-of-iconic-campaig'],
      },
    ],
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
    career: [{
      house: 'goldwin',
      role: 'President',
      roleDetail: 'President and representative director',
      start: 2000,
      end: 2020,
      notes: 'Became president in June 2000 and moved to chairman in April 2020 when Takao Watanabe succeeded him.',
      sources: ['https://corp.goldwin.co.jp/eng/cgi/wordpress/wp-content/uploads/2020/02/20200212_1500.pdf', 'https://about.goldwin.co.jp/eng/cms/wp-content/themes/goldwin2024/assets/pdf/ir/integrated/goldwin_integrated2024_en_spread.pdf'],
    }],
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
        house: 'levis', role: 'Head Designer', roleDetail: 'Head of global design, menswear and womenswear', start: 2013, end: null,
        notes: 'Joined Made & Crafted in 2009, then held a merchandising role. Appointed head of design in August 2013, reporting to Karyn Hillman; later became SVP of design and design innovation. No longer at Levi’s when appointed to Lululemon in 2024; precise departure year is unconfirmed.',
        sources: ['https://www.levistrauss.com/wp-content/uploads/2019/03/The-Levis-Brand-Announces-New-Global-Leadership-Appointments.pdf', 'https://fashionunited.com/news/people/lululemon-names-jonathan-cheung-global-creative-director/2024011557866'],
      },
      { house: 'lululemon', role: 'Creative Director', roleDetail: 'Global Creative Director', start: 2024, end: null, notes: 'Appointed in January 2024; remit expanded in May 2024 to report directly to the CEO and oversee design, innovation and product development. Exact end date unconfirmed.', sources: ['https://fashionunited.com/news/people/lululemon-names-jonathan-cheung-global-creative-director/2024011557866', 'https://s24.q4cdn.com/538403808/files/doc_news/lululemon-Announces-Evolved-Structure-of-Product-and-Brand-Teams-2024.pdf'] },
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
      house: 'salomon', role: 'CEO', roleDetail: 'President and CEO; formerly Chief Product Officer', start: 2025, end: null,
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
      house: 'onitsukaTiger', role: 'Founder', roleDetail: 'Founder of the original Onitsuka shoe business', start: 1949, end: 1977,
      notes: 'The original business merged into ASICS in 1977. This is the historical brand lineage; the fashion-brand revival followed in 2002.',
      sources: ['https://www.onitsukatiger.com/us/en-us/brand/75th-anniversary/history-1st', 'https://corp.asics.com/en/about_asics/history'],
    }, {
      house: 'asics', role: 'Founder', roleDetail: 'Co-founder of ASICS through the Onitsuka, GTO and JELENK merger', start: 1977,
      notes: 'Continuation of the original Onitsuka business under the newly formed ASICS corporation, rather than a move between unrelated employers.',
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
      house: 'mizuno', role: 'President', roleDetail: 'President and Representative Director', start: 2006, end: null,
      notes: 'Appointed president in June 2006; identified in that role in the company’s 2025 annual securities report.',
      sources: ['https://corp.mizuno.com/en/about/history', 'https://corp.mizuno.com/system/files/ir/2025-10/Mizuno%20112th%20Annual%20Securities%20Report.pdf'],
    }],
  },
  kevinPlank: {
    name: 'Kevin Plank',
    nationality: 'American',
    career: [{
      house: 'underArmour', role: 'Founder', start: 1996, end: null,
      sources: ['https://about.underarmour.com/en/our-company/history.html', 'https://about.underarmour.com/en/investors/corporate-governance.html'],
    },
      {
        house: 'underArmour',
        role: 'CEO',
        roleDetail: 'President and CEO — returning tenure',
        start: 2024,
        end: null,
        notes: 'Returned as president and CEO on April 1, 2024 after serving as executive chair and brand chief.',
        sources: ['https://about.underarmour.com/en/stories/2024/03/under-armour-announces-leadership-transition.html', 'https://about.underarmour.com/en/investors/corporate-governance.html'],
      },
    ],
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
      house: 'onRunning', role: 'Founder', roleDetail: 'Co-founder', start: 2010, end: null,
      sources: ['https://www.sec.gov/Archives/edgar/data/1858985/000185898526000008/onholdingag-20251231.htm', 'https://press.on-running.com/on-co-founders-to-lead-next-chapter-of-growth-as-co-ceos-94j2uq', 'https://investors.on-running.com/governance/'],
    },
      {
        house: 'onRunning',
        role: 'CEO',
        roleDetail: 'Co-CEO and executive co-chairman',
        start: 2026,
        end: null,
        notes: 'Co-CEO appointment effective May 1, 2026, alongside Caspar Coppetti.',
        sources: ['https://investors.on-running.com/news/news-details/2026/On-Co-Founders-to-Lead-Next-Chapter-of-Growth-as-Co-CEOs/default.aspx'],
      },
    ],
  },
  casparCoppetti: {
    name: 'Caspar Coppetti',
    nationality: 'Swiss',
    career: [{
      house: 'onRunning', role: 'Founder', roleDetail: 'Co-founder', start: 2010, end: null,
      sources: ['https://www.sec.gov/Archives/edgar/data/1858985/000185898526000008/onholdingag-20251231.htm', 'https://press.on-running.com/on-co-founders-to-lead-next-chapter-of-growth-as-co-ceos-94j2uq', 'https://investors.on-running.com/governance/'],
    },
      {
        house: 'onRunning',
        role: 'CEO',
        roleDetail: 'Co-CEO and executive co-chairman',
        start: 2026,
        end: null,
        notes: 'Co-CEO appointment effective May 1, 2026, alongside David Allemann.',
        sources: ['https://investors.on-running.com/news/news-details/2026/On-Co-Founders-to-Lead-Next-Chapter-of-Growth-as-Co-CEOs/default.aspx'],
      },
    ],
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
      house: 'rapha', role: 'CEO', roleDetail: 'CEO', start: 2024, end: 2026,
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
  soniaRykiel: {
    name: 'Sonia Rykiel',
    career: [
      {
        house: 'soniaRykiel',
        role: 'Founder',
        roleDetail: 'Founder and creative lead',
        start: 1968,
        end: 1995,
        sources: ['https://www.giii.com/pages/brand/sonia-rykiel', 'https://businessoffashion-businessoffashion-prod.web.arc-cdn.net/articles/news-analysis/sonia-rykiel-dies-at-86/'],
      },
    ],
  },
  nathalieRykiel: {
    name: 'Nathalie Rykiel',
    career: [
      {
        house: 'soniaRykiel',
        role: 'Artistic Director',
        roleDetail: 'President and artistic director; role documented in 2009, exact tenure dates unconfirmed',
        sources: ['https://www.interviewmagazine.com/fashion/sonia-rykiel-40th-anniversary'],
      },
    ],
  },
  julieDeLibran: {
    name: 'Julie de Libran',
    career: [
      {
        house: 'soniaRykiel',
        role: 'Artistic Director',
        roleDetail: 'Artistic director',
        start: 2014,
        end: 2019,
        sources: ['https://www.vogue.fr/fashion/article/julie-de-libran-is-no-longer-creative-director-at-sonia-rykiel'],
      },
      {
        house: 'prada',
        role: 'Other',
        roleDetail: 'Womenswear design team',
        start: 1998,
        end: 2008,
        sources: ['https://www.vogue.com/article/julie-de-libran-sonia-rykiel'],
      },
      {
        house: 'louisVuitton',
        role: 'Other',
        roleDetail: 'Womenswear studio, cruise and pre-fall collections',
        start: 2008,
        end: 2014,
        sources: ['https://www.vogue.co.uk/article/julie-de-libran-new-sonia-rykiel-designer-former-louis-vuitton'],
      },
    ],
  },
  carolinaHerrera: {
    name: 'Carolina Herrera',
    career: [
      {
        house: 'carolinaHerrera',
        role: 'Founder',
        roleDetail: 'Founder and creative director',
        start: 1981,
        end: 2018,
        sources: ['https://cfda.com/member/carolina-herrera/'],
      },
    ],
  },
  wesGordon: {
    name: 'Wes Gordon',
    career: [
      {
        house: 'oscarDeLaRentaHouse',
        role: 'Other',
        roleDetail: 'Design intern during studies at Central Saint Martins',
        notes: 'Before graduating in 2009; exact internship years unconfirmed.',
        sources: ['https://cfda.com/wp-content/uploads/2025/05/CFDA-Annual-Report-2016.pdf'],
      },
      {
        house: 'tomFord',
        role: 'Other',
        roleDetail: 'Design intern during studies at Central Saint Martins',
        notes: 'Before graduating in 2009; exact internship years unconfirmed.',
        sources: ['https://cfda.com/wp-content/uploads/2025/05/CFDA-Annual-Report-2016.pdf'],
      },
      {
        house: 'carolinaHerrera',
        role: 'Other',
        roleDetail: 'Creative consultant',
        start: 2017,
        end: 2018,
        sources: ['https://cfda.com/member/wes-gordon/'],
      },
      {
        house: 'carolinaHerrera',
        role: 'Creative Director',
        roleDetail: 'Creative director',
        start: 2018,
        end: null,
        sources: ['https://cfda.com/member/wes-gordon/'],
      },
    ],
  },
  elieSaab: {
    name: 'Elie Saab',
    career: [
      {
        house: 'elieSaab',
        role: 'Founder',
        roleDetail: 'Founder and creative director',
        start: 1982,
        end: null,
        sources: ['https://eliesaab.com/pages/about-us'],
      },
    ],
  },
  madeleineVionnet: {
    name: 'Madeleine Vionnet',
    career: [
      {
        house: 'vionnet',
        role: 'Founder',
        roleDetail: 'Founder and couturier',
        start: 1912,
        end: 1939,
        sources: ['https://www.vam.ac.uk/articles/madeleine-vionnet-an-introduction'],
      },
    ],
  },
  maryQuant: {
    name: 'Mary Quant',
    career: [
      {
        house: 'maryQuant',
        role: 'Founder',
        roleDetail: 'Co-founder and designer',
        start: 1955,
        end: 2000,
        sources: ['https://www.vam.ac.uk/articles/introducing-mary-quant'],
      },
    ],
  },
  alexanderPlunketGreene: {
    name: 'Alexander Plunket Greene',
    career: [
      {
        house: 'maryQuant',
        role: 'Founder',
        roleDetail: 'Co-founder',
        start: 1955,
        sources: ['https://maryquant.com/pages/herstory'],
      },
    ],
  },
  archieMcNair: {
    name: 'Archie McNair',
    career: [
      {
        house: 'maryQuant',
        role: 'Founder',
        roleDetail: 'Co-founder',
        start: 1955,
        sources: ['https://maryquant.com/pages/herstory'],
      },
    ],
  },
  cnWilliamson: {
    name: 'C. N. Williamson',
    career: [
      {
        house: 'dickies',
        role: 'Founder',
        roleDetail: 'Co-founder',
        start: 1922,
        sources: ['https://dickiesaustralia.com/pages/history'],
      },
    ],
  },
  eeDickie: {
    name: 'E. E. Dickie',
    career: [
      {
        house: 'dickies',
        role: 'Founder',
        roleDetail: 'Co-founder',
        start: 1922,
        sources: ['https://dickiesaustralia.com/pages/history'],
      },
    ],
  },
  tadashiYanai: {
    name: 'Tadashi Yanai',
    career: [
      {
        house: 'uniqlo',
        role: 'Founder',
        roleDetail: 'Founder; subsequently chairman and CEO of parent Fast Retailing',
        start: 1984,
        sources: ['https://usjapantomodachi.org/en/about-us/donors/tadashi-yanai/'],
      },
    ],
  },
  pacoRabanne: {
    name: 'Paco Rabanne',
    career: [
      {
        house: 'rabanne',
        role: 'Founder',
        roleDetail: 'Founder and designer',
        start: 1966,
        sources: ['https://www.puig.com/en/history/'],
      },
    ],
  },
  julienDossena: {
    name: 'Julien Dossena',
    career: [
      {
        house: 'rabanne',
        role: 'Creative Director',
        roleDetail: 'Creative director',
        start: 2013,
        end: 2026,
        sources: ['https://www.vogue.it/magazine/notizie-del-giorno/2013/08/julien-dossena-nuovo-designer-per-paco-rabanne', 'https://theindustry.beauty/julien-dossena-exits-rabanne-after-13-years-as-creative-director/'],
      },
      {
        house: 'balenciaga',
        role: 'Other',
        roleDetail: 'Design team under Nicolas Ghesquière',
        start: 2008,
        end: 2012,
        sources: ['https://www.vogue.it/magazine/notizie-del-giorno/2013/08/julien-dossena-nuovo-designer-per-paco-rabanne'],
      },
    ],
  },
  donaldFisher: {
    name: 'Donald Fisher',
    career: [
      {
        house: 'gap',
        role: 'Founder',
        roleDetail: 'Co-founder',
        start: 1969,
        sources: ['https://www.gapinc.com/en-us/about/history'],
      },
    ],
  },
  dorisFisher: {
    name: 'Doris Fisher',
    career: [
      {
        house: 'gap',
        role: 'Founder',
        roleDetail: 'Co-founder',
        start: 1969,
        sources: ['https://www.gapinc.com/en-us/about/history'],
      },
    ],
  },
  henryDavidLee: {
    name: 'Henry David Lee',
    career: [
      {
        house: 'lee',
        role: 'Founder',
        roleDetail: 'Founder',
        start: 1889,
        sources: ['https://eu.lee.com/be-nl/history.html'],
      },
    ],
  },
  rodeoBen: {
    name: 'Rodeo Ben (Bernard Lichtenstein)',
    career: [
      {
        house: 'wrangler',
        role: 'Other',
        roleDetail: 'Designer of the original Wrangler cowboy jeans',
        start: 1947,
        sources: ['https://www.wrangler.com/history.html'],
      },
    ],
  },
  hisaoManabe: {
    name: 'Hisao Manabe',
    career: [
      {
        house: 'momotaro',
        role: 'Founder',
        roleDetail: 'Founder',
        start: 2006,
        sources: ['https://www.tjf.or.jp/clicknippon/en/mywayyourway/08/post-19.php'],
      },
    ],
  },
  shinichiHaraki: {
    name: 'Shinichi Haraki',
    career: [
      {
        house: 'ironHeart',
        role: 'Founder',
        roleDetail: 'Founder',
        start: 2002,
        sources: ['https://www.ironheart.jp/pages/%E4%BC%9A%E7%A4%BE%E6%A6%82%E8%A6%81-1'],
      },
    ],
  },
  fayeToogood: {
    name: 'Faye Toogood',
    career: [
      {
        house: 'toogood',
        role: 'Founder',
        roleDetail: 'Co-founder and clothing designer',
        start: 2013,
        end: 2026,
        sources: ['https://www.vogue.co.uk/fashion/article/toogood-sustainable-british-brand', 'https://www.scarletjones.com.au/blogs/news/toogood-ss26'],
      },
    ],
  },
  ericaToogood: {
    name: 'Erica Toogood',
    career: [
      {
        house: 'toogood',
        role: 'Founder',
        roleDetail: 'Co-founder and clothing designer',
        start: 2013,
        end: 2026,
        sources: ['https://www.vogue.co.uk/fashion/article/toogood-sustainable-british-brand', 'https://www.scarletjones.com.au/blogs/news/toogood-ss26'],
      },
    ],
  },
  karlOskarOlsen: {
    name: 'Karl-Oskar Olsen',
    career: [
      {
        house: 'woodWood',
        role: 'Founder',
        roleDetail: 'Co-founder',
        start: 2002,
        sources: ['https://www.woodwood.com/sv-se/about-woodwood'],
      },
    ],
  },
  brianSSJensen: {
    name: 'Brian SS Jensen',
    career: [
      {
        house: 'woodWood',
        role: 'Founder',
        roleDetail: 'Co-founder',
        start: 2002,
        sources: ['https://www.woodwood.com/sv-se/about-woodwood'],
      },
    ],
  },
  magnusCarstensen: {
    name: 'Magnus Carstensen',
    career: [
      {
        house: 'woodWood',
        role: 'Founder',
        roleDetail: 'Co-founder',
        start: 2002,
        sources: ['https://www.woodwood.com/sv-se/about-woodwood'],
      },
    ],
  },
  nickWakeman: {
    name: 'Nick Wakeman',
    career: [
      {
        house: 'diesel',
        role: 'Other',
        roleDetail: 'Early design role',
        notes: 'Before Studio Nicholson; exact tenure years unconfirmed.',
        sources: ['https://www.lemonde.fr/m-styles/article/2024/11/02/nick-wakeman-le-fil-du-temps_6372687_4497319.html'],
      },
      {
        house: 'paraboot',
        role: 'Other',
        roleDetail: 'Studio Nicholson x Paraboot footwear collaboration',
        start: 2024,
        notes: 'Studio Nicholson collaboration under its founder and creative director; not employment at Paraboot.',
        sources: ['https://japan.studionicholson.com/blogs/%E3%83%8B%E3%83%A5%E3%83%BC%E3%82%B9/studio-nicholson-x-parabooot'],
      },
      {
        house: 'studioNicholson',
        role: 'Founder',
        roleDetail: 'Founder and creative director',
        start: 2010,
        end: null,
        sources: ['https://www.studionicholson.com/blogs/features/celebrating-15-years-of-studio-nicholson'],
      },
    ],
  },
  cecilieBahnsen: {
    name: 'Cecilie Bahnsen',
    career: [
      {
        house: 'johnGalliano',
        role: 'Other',
        roleDetail: 'Design assistant and print designer',
        notes: 'Internship followed by an assistant role before her Royal College of Art MA; exact years unconfirmed.',
        sources: ['https://www.fhcm.paris/fr/news/cecilie-bahnsens-power-in-dressing', 'https://www.harpersbazaar.com/uk/fashion/a30497653/cecilie-bahnsen-designer-interview/'],
      },
      {
        house: 'erdem',
        role: 'Other',
        roleDetail: 'Design assistant',
        start: 2010,
        end: 2014,
        approximate: true,
        notes: 'Approximately four years at Erdem after completing her MA in 2010.',
        sources: ['https://repository.falmouth.ac.uk/3498/3/True%20to%20Form%20Cecilie%20Bahnsen%20Sculptural%20Fashion%20for%20Classic%20Opulence%20SEBC.pdf', 'https://www.elle.se/mode/just-nu-intervju-cecilie-bahnsen/4376121'],
      },
      {
        house: 'asics',
        role: 'Other',
        roleDetail: 'Footwear collaboration, Cecilie Bahnsen x ASICS',
        start: 2023,
        notes: 'Dates refer to the Spring/Summer 2023 collaboration launch; this is a partnership rather than an in-house design appointment.',
        sources: ['https://ceciliebahnsen.com/ja/pages/asics'],
      },
      {
        house: 'theNorthFace',
        role: 'Other',
        roleDetail: 'Cecilie Bahnsen x The North Face collaboration',
        start: 2025,
        notes: 'Spring/Summer 2025 collection; announced on the runway in 2024.',
        sources: ['https://www.showstudio.com/cms/documents/3380/Cecilie_Bahnsen_SS25_Press_Release.pdf'],
      },
      {
        house: 'uniqlo',
        role: 'Other',
        roleDetail: 'UNIQLO and Cecilie Bahnsen collaboration',
        start: 2026,
        notes: 'Shapes of Poetry capsule; collaboration rather than creative direction of Uniqlo.',
        sources: ['https://ceciliebahnsen.com/pages/cecilie-bahnsen-x-uniqlo'],
      },
      {
        house: 'cecilieBahnsen',
        role: 'Founder',
        roleDetail: 'Founder and creative director',
        start: 2015,
        end: null,
        sources: ['https://ceciliebahnsen.com/pages/about-cecilie-bahnsen'],
      },
    ],
  },
  carolChristianPoell: {
    name: 'Carol Christian Poell',
    career: [
      {
        house: 'carolChristianPoell',
        role: 'Founder',
        roleDetail: 'Co-founder and designer',
        start: 1994,
        approximate: true,
        sources: ['https://research.ucreative.ac.uk/734/1/UCA_Staff_Research_2011_web.pdf'],
      },
    ],
  },
  sergioSimone: {
    name: 'Sergio Simone',
    career: [
      {
        house: 'carolChristianPoell',
        role: 'Founder',
        roleDetail: 'Co-founder',
        start: 1994,
        approximate: true,
        sources: ['https://ukdps.uwestminster-ro.tmp.accesstomemory.org/actor/browse?page=23&repository=123090&sf_culture=en&sort=lastUpdated&sortDir=asc'],
      },
    ],
  },
  borisBidjanSaberi: {
    name: 'Boris Bidjan Saberi',
    career: [
      {
        house: 'salomon',
        role: 'Other',
        roleDetail: 'Footwear collaboration with Boris Bidjan Saberi and 11 by BBS',
        start: 2016,
        notes: 'Development began in 2016; the first model launched in Spring 2017. This is a design partnership, not a Salomon creative directorship.',
        sources: ['https://www.salomon.com/es-es/sg/a/more-than-gorpcore'],
      },
      {
        house: 'borisBidjanSaberi',
        role: 'Founder',
        roleDetail: 'Founder and designer',
        start: 2007,
        end: 2025,
        approximate: true,
        sources: ['https://sabukaru.online/articles/looking-to-the-past-to-innovate-the-future-a-talk-with-boris-bidjan-saberi', 'https://pausemag.co.uk/2025/05/boris-bidjan-saberi-closes-down-brand-after-20-years/'],
      },
      {
        house: 'elevenBbs',
        role: 'Founder',
        roleDetail: 'Founder and designer of the secondary line',
        start: 2013,
        approximate: true,
        sources: ['https://sabukaru.online/articles/looking-to-the-past-to-innovate-the-future-a-talk-with-boris-bidjan-saberi', 'https://salomon.com.au/pages/boris-bidjan-saberi'],
      },
    ],
  },
  guidoGuidi: {
    name: 'Guido Guidi',
    career: [
      {
        house: 'guidi',
        role: 'Founder',
        roleDetail: 'Co-founder of the original tannery',
        start: 1896,
        sources: ['https://guidi.it/pages/about-guidi'],
      },
    ],
  },
  giovanniRosellini: {
    name: 'Giovanni Rosellini',
    career: [
      {
        house: 'guidi',
        role: 'Founder',
        roleDetail: 'Co-founder of the original tannery',
        start: 1896,
        sources: ['https://guidi.it/pages/about-guidi'],
      },
    ],
  },
  ginoUlivo: {
    name: 'Gino Ulivo',
    career: [
      {
        house: 'guidi',
        role: 'Founder',
        roleDetail: 'Co-founder of the original tannery',
        start: 1896,
        sources: ['https://guidi.it/pages/about-guidi'],
      },
    ],
  },
  ruggeroGuidi: {
    name: 'Ruggero Guidi',
    career: [
      {
        house: 'guidi',
        role: 'Other',
        roleDetail: 'Tannery leadership; exact start year unconfirmed',
        end: null,
        sources: ['https://guidi.it/pages/about-guidi'],
      },
    ],
  },
  bajowoo: {
    name: 'Bajowoo',
    career: [
      {
        house: 'ninetyNinePercentIs',
        role: 'Founder',
        roleDetail: 'Founder and designer',
        start: 2012,
        sources: ['https://rakutenfashionweektokyo.com/en/topics/interview/bajowoo/'],
      },
    ],
  },
  robertPringle: {
    name: 'Robert Pringle',
    career: [
      {
        house: 'pringleOfScotland',
        role: 'Founder',
        roleDetail: 'Founder',
        start: 1815,
        sources: ['https://pringlescotland.com/pages/history-of-hosiery'],
      },
    ],
  },
  patrickRobinson: {
    name: 'Patrick Robinson',
    nationality: 'American',
    career: [
      {
        house: 'armani',
        role: 'Head Designer',
        roleDetail: 'Design director, Le Collezioni White Label',
        start: 1990,
        end: 1994,
        sources: ['https://www.gapinc.com/en-us/articles/2007/05/gap-inc-names-patrick-robinson-head-of-design-of-g'],
      },
      {
        house: 'rabanne',
        role: 'Artistic Director',
        roleDetail: 'Paco Rabanne',
        start: 2005,
        end: 2007,
        sources: ['https://www.gapinc.com/en-us/articles/2007/05/gap-inc-names-patrick-robinson-head-of-design-of-g'],
      },
      {
        house: 'gap',
        role: 'Head Designer',
        roleDetail: 'Executive vice president of design, Gap Adult and GapBody',
        start: 2007,
        end: 2011,
        sources: ['https://www.gapinc.com/en-us/articles/2007/05/gap-inc-names-patrick-robinson-head-of-design-of-g', 'https://www.gapinc.com/ja-jp/articles/2011/05/gap-inc-announces-change-in-design-leadership-at-g'],
      },
    ],
  },
  rebekkaBay: {
    name: 'Rebekka Bay',
    nationality: 'Danish',
    career: [
      {
        house: 'cos',
        role: 'Creative Director',
        start: 2006,
        end: 2011,
        notes: 'Creative development began before the brand’s first store opened in 2007.',
        sources: ['https://company.marimekko.com/app/uploads/2017/12/CV-Rebekka-Bay_en.pdf'],
      },
      {
        house: 'gap',
        role: 'Creative Director',
        roleDetail: 'Creative director and executive vice president, Global Design',
        start: 2012,
        end: 2015,
        sources: ['https://www.gapinc.com/en-us/articles/2012/09/gap-inc-announces-rebekka-bay-as-creative-director', 'https://www.uniqlo.com/ph/en/contents/collaboration/uniqloxmarimekko/24ss/article/01/'],
      },
      {
        house: 'uniqlo',
        role: 'Other',
        roleDetail: 'Marimekko creative director for the UNIQLO x Marimekko Summer 2024 collaboration',
        start: 2024,
        end: 2024,
        notes: 'Represents her Marimekko role in this capsule; not an in-house Uniqlo appointment.',
        sources: ['https://www.uniqlo.com/ph/en/contents/collaboration/uniqloxmarimekko/24ss/article/01/'],
      },
    ],
  },
  alistairCarr: {
    name: 'Alistair Carr',
    nationality: 'British',
    career: [
      {
        house: 'chloe',
        role: 'Other',
        roleDetail: 'Design team',
        notes: 'Earlier career role; exact tenure years unconfirmed.',
        sources: ['https://www.elle.com/uk/fashion/news/a7180/pringle-and-alistair-carr-part-ways/'],
      },
      {
        house: 'balenciaga',
        role: 'Other',
        roleDetail: 'Designer under Nicolas Ghesquière',
        end: 2011,
        notes: 'Joined Pringle from Balenciaga in March 2011; Balenciaga start year unconfirmed.',
        sources: ['https://www.vogue.com/article/paris-designer-alistair-carr-takes-the-helm-at-pringle-of-scotland'],
      },
      {
        house: 'pringleOfScotland',
        role: 'Head Designer',
        roleDetail: 'Design director',
        start: 2011,
        end: 2012,
        sources: ['https://www.vogue.com/article/paris-designer-alistair-carr-takes-the-helm-at-pringle-of-scotland', 'https://www.elle.com/uk/fashion/news/a7180/pringle-and-alistair-carr-part-ways/'],
      },
    ],
  },
  massimoNicosia: {
    name: 'Massimo Nicosia',
    nationality: 'Italian',
    career: [
      {
        house: 'pringleOfScotland',
        role: 'Menswear Director',
        roleDetail: 'First stint, leading menswear under Clare Waight Keller',
        start: 2008,
        notes: 'Subsequently left for Nicole Farhi and later returned; exact dates of the first departure and return unconfirmed.',
        sources: ['https://www.fidaworldwide.com/pages/massimo-nicosia'],
      },
      {
        house: 'pringleOfScotland',
        role: 'Head Designer',
        roleDetail: 'Design director, menswear and womenswear',
        start: 2014,
        sources: ['https://www.fidaworldwide.com/pages/massimo-nicosia'],
      },
      {
        house: 'zegna',
        role: 'Other',
        roleDetail: 'Head of design under artistic director Alessandro Sartori',
        start: 2017,
        notes: 'Appointment documented in July 2017; exact end year unconfirmed.',
        sources: ['https://www.fidaworldwide.com/pages/massimo-nicosia'],
      },
    ],
  },
  sophiaKokosalaki: {
    name: 'Sophia Kokosalaki',
    nationality: 'Greek',
    career: [
      {
        house: 'vionnet',
        role: 'Creative Director',
        roleDetail: 'Creative director of the revived house',
        start: 2006,
        end: 2007,
        sources: ['https://www.vogue.co.uk/article/sophias-confirmed', 'https://www.interviewmagazine.com/fashion/vionnet-fw-2014'],
      },
      {
        house: 'diesel',
        role: 'Womenswear Director',
        roleDetail: 'Creative director, Diesel Black Gold womenswear',
        start: 2009,
        end: 2012,
        sources: ['https://www.vogue.co.uk/article/sophia-kokosalaki-leaves-diesel-black-gold'],
      },
    ],
  },
  josVanTilburg: {
    name: 'Jos van Tilburg',
    nationality: 'Dutch',
    career: [{
      house: 'gStar',
      role: 'Founder',
      start: 1989,
      sources: ['https://www.whp-global.com/pages/brands', 'https://www.whp-global.com/blogs/brand-news/whp-global-to-acquire-global-denim-brand-g-star-raw'],
    }],
  },
  pierreMorisset: {
    name: 'Pierre Morisset',
    nationality: 'French',
    career: [{
      house: 'gStar',
      role: 'Other',
      roleDetail: 'Designer of the original Elwood jeans',
      start: 1995,
      end: 1995,
      notes: 'Records the original design project documented in a Dutch court judgment; the Elwood jeans launched in 1996. His broader G-Star design career extended beyond this project.',
      sources: ['https://www.uitspraken.nl/uitspraak/rechtbank-dordrecht/civiel-recht/civiel-recht-overig/kort-geding/ecli-nl-rbdor-2009-bj5203', 'https://www.vogue.fr/mode/promotion/g-star-nouvelle-collection-anatomic-denim-jeans'],
    }],
  },
  aitorThroup: {
    name: 'Aitor Throup',
    nationality: 'Argentine-British',
    career: [
      {
        house: 'stoneIsland',
        role: 'Other',
        roleDetail: 'Collaborative designer, Modular Anatomy and Articulated Anatomy',
        start: 2008,
        end: 2008,
        notes: 'Special projects presented in 2008 for Autumn/Winter 2008 and Spring/Summer 2009.',
        sources: ['https://trendland.com/wp-content/uploads/2011/05/Aitor_Throup_biog.pdf'],
      },
      {
        house: 'cpCompany',
        role: 'Other',
        roleDetail: 'Designer, 20th-anniversary Mille Miglia jacket project',
        start: 2009,
        end: 2009,
        sources: ['https://trendland.com/wp-content/uploads/2011/05/Aitor_Throup_biog.pdf'],
      },
      {
        house: 'umbro',
        role: 'Other',
        roleDetail: 'Creative consultant, Tailored by Umbro and England football kits',
        start: 2008,
        notes: 'Consultancy began in 2008; exact end year unconfirmed.',
        sources: ['https://www.complex.com/style/a/jian-deleon/interview-aitor-throup-talks-sportswear-superheroes-and-umbro-archive-research-project', 'https://www.designboom.com/design/tailored-by-umbro-aitor-throup-interview/'],
      },
      {
        house: 'gStar',
        role: 'Other',
        roleDetail: 'Creative consultant and RAW Research development',
        start: 2013,
        end: 2016,
        sources: ['https://fashionunited.com/news/people/aitor-throup-steps-down-from-executive-creative-director-role-at-g-star-raw/2018042020768'],
      },
      {
        house: 'gStar',
        role: 'Creative Director',
        roleDetail: 'Executive creative director',
        start: 2016,
        end: 2018,
        sources: ['https://somethingcurated.com/2017/10/17/interview-aitor-throup-artist-designer-creative-director/', 'https://fashionunited.com/news/people/aitor-throup-steps-down-from-executive-creative-director-role-at-g-star-raw/2018042020768'],
      },
    ],
  },
  stephanWeiss: {
    name: 'Stephan Weiss',
    career: [{
      house: 'donnaKaran',
      role: 'Founder',
      roleDetail: 'Co-founder and business partner',
      start: 1984,
      sources: ['https://www.sec.gov/Archives/edgar/data/1012369/000091205701511432/a2047213z10-ka.txt'],
    }],
  },
  chrisSpantoPrintup: {
    name: 'Chris “Spanto” Printup',
    nationality: 'American',
    died: 2023,
    career: [{
      house: 'bornXRaised',
      role: 'Founder',
      roleDetail: 'Co-founder with Alex “2Tone” Erdmann',
      start: 2013,
      end: 2023,
      sources: ['https://www.nikesb.com/the-vault/sail-box-era/born-x-raised', 'https://www.vogue.com/article/spanto-born-x-raised-family-friends-remember-his-legacy'],
    }],
  },
  alex2ToneErdmann: {
    name: 'Alex “2Tone” Erdmann',
    career: [
      {
        house: 'bornXRaised',
        role: 'Founder',
        roleDetail: 'Co-founder with Chris “Spanto” Printup',
        start: 2013,
        sources: ['https://www.nikesb.com/the-vault/sail-box-era/born-x-raised'],
      },
    ],
  },
  alexJamesPleasures: {
    name: 'Alex James',
    career: [
      {
        house: 'pleasures',
        role: 'Founder',
        roleDetail: 'Co-founder and designer with Vlad Elkin',
        start: 2015,
        sources: ['https://www.sneakerfreaker.com/features/puma-pleasures-ss24-interview-price-buy-release-date', 'https://www.thepopmanifesto.com/stories/one-step-beyond'],
      },
    ],
  },
  vladElkin: {
    name: 'Vlad Elkin',
    career: [{
      house: 'pleasures',
      role: 'Founder',
      roleDetail: 'Co-founder with Alex James',
      start: 2015,
      sources: ['https://www.sneakerfreaker.com/features/puma-pleasures-ss24-interview-price-buy-release-date', 'https://www.thepopmanifesto.com/stories/one-step-beyond'],
    }],
  },
  virginiaBurlina: {
    name: 'Virginia Burlina',
    nationality: 'Italian',
    career: [
      {
        house: 'driesVanNoten',
        role: 'Other',
        roleDetail: 'Studio designer, collection research and development',
        end: 2018,
        notes: 'Worked closely with Dries Van Noten on collection themes, hand sketching and draping before moving to Burberry in June 2018. Exact start year unconfirmed.',
        sources: ['https://itsweb.org/updates-from-the-its-finalists-the-evolution-of-careers-shaping-the-fashion-industry/', 'https://old.itsweb.org/img/15anniversary/ITS2016-Past-finalists.pdf'],
      },
      {
        house: 'burberry',
        role: 'Other',
        roleDetail: 'Womenswear designer, runway collections',
        start: 2018,
        notes: 'Accepted the role in June 2018; exact end year unconfirmed.',
        sources: ['https://itsweb.org/updates-from-the-its-finalists-the-evolution-of-careers-shaping-the-fashion-industry/'],
      },
      {
        house: 'loewe',
        role: 'Other',
        roleDetail: 'Head designer, womenswear runway under Jonathan Anderson',
        notes: 'Identified as a former Loewe head designer in an October 2024 interview with ITS founder Barbara Franchin; exact tenure years unconfirmed.',
        sources: ['https://itsweb.org/wp-content/uploads/Fashion-Magazine-_011024.pdf'],
      },
      {
        house: 'acneStudios',
        role: 'Other',
        roleDetail: 'Head of womenswear and accessories design',
        notes: 'Role documented in October 2024 by ITS founder Barbara Franchin, following her Loewe work; exact appointment and departure years unconfirmed.',
        sources: ['https://itsweb.org/wp-content/uploads/Fashion-Magazine-_011024.pdf', 'https://itsweb.org/its-contest/the-network/past-finalists-today/finalists-in-brand/'],
      },
      {
        house: 'maisonMargiela',
        role: 'Other',
        roleDetail: 'Head designer',
        notes: 'Described as her most recent role in October 2026 reporting; exact appointment and departure dates unconfirmed.',
        sources: ['https://puck.news/fashion/2026/10/and-the-new-mcqueen-designer-is', 'https://crfashionbook.com/article/creative-director-changes-2026-whos-next-in-fashion/'],
      },
    ],
    notes: 'Antwerp-trained designer and ITS 2014 finalist. Reported in October and November 2026 as a prospective successor to Seán McGirr at McQueen; an official appointment could not be confirmed as of November 13, 2026. The reported McQueen move is not recorded as an established tenure.',
    sources: ['https://itsweb.org/updates-from-the-its-finalists-the-evolution-of-careers-shaping-the-fashion-industry/', 'https://puck.news/fashion/2026/11/the-mets-safe-bet-and-pierpaolos-official-exit', 'https://crfashionbook.com/article/creative-director-changes-2026-whos-next-in-fashion/'],
  },
  veraWang: {
    name: 'Vera Wang',
    nationality: 'American',
    career: [
      {
        house: 'ralphLauren',
        role: 'Other',
        roleDetail: 'Design director',
        start: 1987,
        end: 1989,
        notes: 'Joined after her editorial career at Vogue, before opening her own bridal salon. Exact end year unconfirmed.',
        sources: ['https://www.verawang.com/pages/about', 'https://goldhouse.org/people/vera-wang/'],
      },
      {
        house: 'veraWang',
        role: 'Founder',
        roleDetail: 'Founder and chief creative officer',
        start: 1990,
        end: null,
        notes: 'Continued as founder and chief creative officer following WHP Global’s acquisition of the brand’s intellectual property.',
        sources: ['https://www.verawang.com/pages/about', 'https://www.prnewswire.com/news-releases/whp-global-completes-acquisition-of-vera-wang-brand-302353735.html'],
      },
    ],
  },
  ennioCapasa: {
    name: 'Ennio Capasa',
    nationality: 'Italian',
    career: [
      {
        house: 'yohjiYamamoto',
        role: 'Other',
        roleDetail: 'Assistant designer in Tokyo',
        notes: 'Worked with Yohji Yamamoto before founding Costume National; exact employment years unconfirmed.',
        sources: ['https://www.houyhnhnm.jp/en/news/72499/', 'https://fashiongear.fibre2fashion.com/brand-story/costume-national/about-the-founder.asp'],
      },
      {
        house: 'costumeNational',
        role: 'Founder',
        roleDetail: 'Co-founder and creative director',
        start: 1986,
        end: 2016,
        notes: 'Led design across Costume National, Costume National Homme and C’N’C; departed in March 2016.',
        sources: ['https://www.vogue.com/article/costume-national-founders-exit-brand', 'https://fashiongear.fibre2fashion.com/brand-story/costume-national/about-the-founder.asp'],
      },
    ],
  },
  carloCapasa: {
    name: 'Carlo Capasa',
    nationality: 'Italian',
    career: [{
      house: 'costumeNational',
      role: 'Other',
      roleDetail: 'Co-founder and chief executive officer',
      start: 1986,
      end: 2016,
      notes: 'Business leadership alongside his brother Ennio, who led creative direction. Left the company in March 2016.',
      sources: ['https://www.fhcm.paris/sites/default/files/news/files/biography-eng-_compressed.pdf', 'https://www.vogue.com/article/costume-national-founders-exit-brand'],
    }],
  },
  kojiUdo: {
    name: 'Koji Udo',
    nationality: 'Japanese',
    career: [{
      house: 'costumeNational',
      role: 'Menswear Director',
      roleDetail: 'Creative director, menswear',
      start: 2017,
      end: 2020,
      notes: 'Appointed alongside womenswear director Yasutoshi Ezumi. Departed when their contracts ended; the internal design team took over for Autumn/Winter 2020–21.',
      sources: ['https://www.houyhnhnm.jp/en/news/72499/', 'https://www.pambianconews.com/2020/03/16/costume-national-perde-i-direttori-creativi-288652/'],
    }],
  },
  yasutoshiEzumi: {
    name: 'Yasutoshi Ezumi',
    nationality: 'Japanese',
    career: [
      {
        house: 'alexanderMcQueen',
        role: 'Other',
        roleDetail: 'Assistant designer',
        notes: 'Earlier role confirmed by his official biography; exact employment years unconfirmed.',
        sources: ['https://ezumi.jp/pages/about'],
      },
      {
        house: 'costumeNational',
        role: 'Womenswear Director',
        roleDetail: 'Creative director, womenswear',
        start: 2017,
        end: 2020,
        notes: 'Appointed alongside menswear director Koji Udo. Departed when their contracts ended; the internal design team took over for Autumn/Winter 2020–21.',
        sources: ['https://www.houyhnhnm.jp/en/news/72499/', 'https://www.pambianconews.com/2020/03/16/costume-national-perde-i-direttori-creativi-288652/'],
      },
    ],
  },
  georgesMarciano: {
    name: 'Georges Marciano',
    career: [
      {
        house: 'guess',
        role: 'Founder',
        roleDetail: 'Co-founder',
        start: 1981,
        sources: ['https://content.guess.com/guessus/guessworld/html/ourstory.html', 'https://www.latimes.com/archives/la-xpm-1993-08-03-fi-19657-story.html'],
        end: 1993,
      },
    ],
  },
  mauriceMarciano: {
    name: 'Maurice Marciano',
    career: [
      {
        house: 'guess',
        role: 'Founder',
        roleDetail: 'Co-founder',
        start: 1981,
        sources: ['https://content.guess.com/guessus/guessworld/html/ourstory.html'],
      },
    ],
  },
  armandMarciano: {
    name: 'Armand Marciano',
    career: [
      {
        house: 'guess',
        role: 'Founder',
        roleDetail: 'Co-founder',
        start: 1981,
        sources: ['https://content.guess.com/guessus/guessworld/html/ourstory.html'],
      },
    ],
  },
  paulMarciano: {
    name: 'Paul Marciano',
    career: [
      {
        house: 'guess',
        role: 'Founder',
        roleDetail: 'Co-founder',
        start: 1981,
        sources: ['https://content.guess.com/guessus/guessworld/html/ourstory.html'],
      },
      {
        house: 'guess',
        role: 'Other',
        roleDetail: 'Chief creative officer',
        end: null,
        notes: 'Confirmed in the January 2026 acquisition announcement; exact start year of this title unconfirmed.',
        sources: ['https://corporate.authentic.com/press-releases/authentic-guess-transaction-private'],
      },
    ],
  },
  davidChu: {
    name: 'David Chu',
    career: [
      {
        house: 'nautica',
        role: 'Founder',
        roleDetail: 'Founder and designer',
        start: 1983,
        end: 2003,
        sources: ['https://www.nautica.com/about-us.html/', 'https://www.committee100.org/members/davidchu/'],
      },
    ],
  },
  akioHasegawa: {
    name: 'Akio Hasegawa',
    career: [
      {
        house: 'nautica',
        role: 'Creative Director',
        roleDetail: 'Nautica Japan',
        start: 2020,
        end: 2023,
        notes: 'Regional creative direction for the Japanese relaunch; not a global Nautica appointment.',
        sources: ['https://www.houyhnhnm.jp/en/news/375534/', 'https://www.fashionsnap.com/article/2023-12-29/nautica-hasegawa-step-down/'],
      },
    ],
  },
  mindyMeads: {
    name: 'Mindy Meads',
    career: [
      {
        house: 'aeropostale',
        role: 'Other',
        roleDetail: 'President and chief merchandising officer; later co-chief executive',
        start: 2007,
        end: 2010,
        sources: ['https://www.sec.gov/Archives/edgar/data/1168213/000095012307003437/y31670e8vk.htm', 'https://www.sec.gov/Archives/edgar/data/863456/000090266412001206/p12-1602exhibit7.htm'],
      },
    ],
  },
  paulSperry: {
    name: 'Paul A. Sperry',
    career: [
      {
        house: 'sperry',
        role: 'Founder',
        roleDetail: 'Founder and boat-shoe designer',
        start: 1935,
        sources: ['https://www.sperrylife.com/about-us/'],
      },
    ],
  },
  richardWoolcott: {
    name: 'Richard “Wooly” Woolcott',
    career: [
      {
        house: 'volcom',
        role: 'Founder',
        roleDetail: 'Co-founder',
        start: 1991,
        sources: ['https://www.volcom.com/pages/about'],
      },
      {
        house: 'quiksilver',
        role: 'Other',
        roleDetail: 'Marketing and promotions',
        notes: 'Worked at Quiksilver before founding Volcom in 1991; exact employment years unconfirmed.',
        sources: ['https://www.sec.gov/Archives/edgar/data/1324570/000089256905000316/a07646orsv1.htm'],
      },
    ],
  },
  tuckerHall: {
    name: 'Tucker Hall',
    career: [
      {
        house: 'volcom',
        role: 'Founder',
        roleDetail: 'Co-founder',
        start: 1991,
        sources: ['https://www.volcom.com/pages/about'],
      },
    ],
  },
  pamelaSkaistLevy: {
    name: 'Pamela Skaist-Levy',
    career: [
      {
        house: 'juicyCouture',
        role: 'Founder',
        roleDetail: 'Co-founder and designer',
        start: 1995,
        approximate: true,
        notes: 'Start follows the brand’s current 1995 dating; histories also reference earlier business origins and a later launch.',
        sources: ['https://www.acaddys.com/juicy-couture', 'https://juicycouture.com/collections/juicy-couture-30th-birthday'],
      },
    ],
  },
  gelaNashTaylor: {
    name: 'Gela Nash-Taylor',
    career: [
      {
        house: 'juicyCouture',
        role: 'Founder',
        roleDetail: 'Co-founder and designer',
        start: 1995,
        approximate: true,
        notes: 'Start follows the brand’s current 1995 dating; histories also reference earlier business origins and a later launch.',
        sources: ['https://www.acaddys.com/juicy-couture', 'https://juicycouture.com/collections/juicy-couture-30th-birthday'],
      },
    ],
  },
  gordonMerchant: {
    name: 'Gordon Merchant',
    career: [
      {
        house: 'billabong',
        role: 'Founder',
        roleDetail: 'Co-founder and boardshorts designer',
        start: 1973,
        sources: ['https://announcements.asx.com.au/asxpdf/20131223/pdf/42ltpv1blz70n0.pdf'],
      },
    ],
  },
  renaMerchant: {
    name: 'Rena Merchant',
    career: [
      {
        house: 'billabong',
        role: 'Founder',
        roleDetail: 'Co-founder',
        start: 1973,
        sources: ['https://announcements.asx.com.au/asxpdf/20131223/pdf/42ltpv1blz70n0.pdf'],
      },
    ],
  },
  alanGreen: {
    name: 'Alan Green',
    career: [
      {
        house: 'quiksilver',
        role: 'Founder',
        roleDetail: 'Co-founder and boardshorts designer',
        start: 1969,
        sources: ['https://quiksilver.com.sg/pages/corporate-info'],
      },
    ],
  },
  johnLaw: {
    name: 'John Law',
    career: [
      {
        house: 'quiksilver',
        role: 'Founder',
        roleDetail: 'Co-founder',
        start: 1969,
        sources: ['https://quiksilver.com.sg/pages/corporate-info'],
      },
    ],
  },
  geneMontesano: {
    name: 'Gene Montesano',
    career: [
      {
        house: 'luckyBrand',
        role: 'Founder',
        roleDetail: 'Co-founder',
        start: 1990,
        sources: ['https://www.morrisjames.com/assets/htmldocuments/0002%20First%20Day%20Affidavit.pdf'],
      },
    ],
  },
  barryPerlman: {
    name: 'Barry Perlman',
    career: [
      {
        house: 'luckyBrand',
        role: 'Founder',
        roleDetail: 'Co-founder',
        start: 1990,
        sources: ['https://www.morrisjames.com/assets/htmldocuments/0002%20First%20Day%20Affidavit.pdf'],
      },
    ],
  },
  reaLaccone: {
    name: 'Rea Laccone',
    career: [
      {
        house: 'vince',
        role: 'Founder',
        roleDetail: 'Co-founder and creative lead',
        start: 2002,
        end: 2013,
        sources: ['https://investors.vince.com/press-releases/press-release-details/2015/Vince-Holding-Corp-Announces-Consulting-Agreement-With-Co-Founders-Rea-Laccone-And-Christopher-LaPolice/default.aspx'],
      },
      {
        house: 'vince',
        role: 'Other',
        roleDetail: 'Returning creative consultant',
        start: 2015,
        end: 2017,
        sources: ['https://investors.vince.com/press-releases/press-release-details/2015/Vince-Holding-Corp-Announces-Consulting-Agreement-With-Co-Founders-Rea-Laccone-And-Christopher-LaPolice/default.aspx', 'https://fashionunited.com/news/fashion/vince-founders-decide-to-leave-the-company/2017021414690'],
      },
    ],
  },
  christopherLaPolice: {
    name: 'Christopher LaPolice',
    career: [
      {
        house: 'vince',
        role: 'Other',
        roleDetail: 'Co-founder and business leader',
        start: 2002,
        end: 2013,
        sources: ['https://investors.vince.com/press-releases/press-release-details/2015/Vince-Holding-Corp-Announces-Consulting-Agreement-With-Co-Founders-Rea-Laccone-And-Christopher-LaPolice/default.aspx'],
      },
      {
        house: 'vince',
        role: 'Other',
        roleDetail: 'Returning creative consultant',
        start: 2015,
        end: 2017,
        sources: ['https://investors.vince.com/press-releases/press-release-details/2015/Vince-Holding-Corp-Announces-Consulting-Agreement-With-Co-Founders-Rea-Laccone-And-Christopher-LaPolice/default.aspx', 'https://fashionunited.com/news/fashion/vince-founders-decide-to-leave-the-company/2017021414690'],
      },
    ],
  },
  patTenore: {
    name: 'Pat “PM” Tenore',
    career: [
      {
        house: 'rvca',
        role: 'Founder',
        roleDetail: 'Founder and designer',
        start: 2000,
        sources: ['https://cincokings.com/catalogs/rvca_presskit.pdf'],
      },
    ],
  },
  conanHayes: {
    name: 'Conan Hayes',
    career: [
      {
        house: 'rvca',
        role: 'Founder',
        roleDetail: 'Co-founder',
        start: 2000,
        sources: ['https://www.skatedeluxe.com/en/b/rvca-shop'],
      },
    ],
  },
  charlesMaskLewis: {
    name: 'Charles “Mask” Lewis Jr.',
    career: [
      {
        house: 'tapout',
        role: 'Founder',
        roleDetail: 'Co-founder',
        start: 1997,
        sources: ['https://tapout.com/about/'],
      },
    ],
  },
  danCaldwell: {
    name: 'Dan “Punkass” Caldwell',
    career: [
      {
        house: 'tapout',
        role: 'Founder',
        roleDetail: 'Co-founder',
        start: 1997,
        sources: ['https://tapout.com/about/'],
      },
    ],
  },
  timKatz: {
    name: 'Tim “Skyskrape” Katz',
    career: [
      {
        house: 'tapout',
        role: 'Founder',
        roleDetail: 'Co-founder',
        start: 1997,
        sources: ['https://tapout.com/about/'],
      },
    ],
  },
  johnnySchillereff: {
    name: 'Johnny Schillereff',
    career: [
      {
        house: 'element',
        role: 'Founder',
        roleDetail: 'Founder and creative lead',
        start: 1992,
        end: 2020,
        sources: ['https://www.element.com.ar/quienes-somos/', 'https://schillprojects.com/pages/about'],
      },
    ],
  },
  jeffreyLubell: {
    name: 'Jeffrey Lubell',
    career: [
      {
        house: 'trueReligion',
        role: 'Founder',
        roleDetail: 'Co-founder, chief executive and creative director',
        start: 2002,
        end: 2013,
        sources: ['https://www.sec.gov/Archives/edgar/data/1160858/000101143813000200/exhibit_99-1true.htm'],
      },
    ],
  },
  kymGold: {
    name: 'Kym Gold (Kymberly Lubell)',
    career: [
      {
        house: 'trueReligion',
        role: 'Founder',
        roleDetail: 'Co-founder',
        start: 2002,
        end: 2007,
        sources: ['https://labusinessjournal.com/news/weekly-news/buttoned/', 'https://labusinessjournal.com/news/co-founder-exits-true-religion/'],
      },
    ],
  },
  robinChretien: {
    name: 'Robin Chretien',
    career: [
      {
        house: 'robinsJean',
        role: 'Founder',
        roleDetail: 'Founder and designer',
        start: 2005,
        sources: ['https://robinsjean.com/pages/about-us'],
      },
    ],
    notes: 'Previously designed for Blue Cult and Hudson before establishing Robin’s Jean; those brands are not currently represented in the map.',
  },
  rayKelvin: {
    name: 'Ray Kelvin',
    nationality: 'British',
    career: [{
      house: 'tedBaker',
      role: 'Founder',
      roleDetail: 'Founder and chief executive officer',
      start: 1988,
      end: 2019,
      sources: ['https://www.leadersmag.com/issues/2011.2_apr/Lifestyle/LEADERS-Ray-Kelvin-Ted-Baker.html', 'https://www.rte.ie/news/business/2019/0304/1034119-ted-baker-ceo/'],
    }],
  },
  anthonyCuthbertson: {
    name: 'Anthony Cuthbertson',
    career: [{
      house: 'tedBaker',
      role: 'Creative Director',
      roleDetail: 'Global creative director',
      start: 2020,
      notes: 'Appointment announced in May 2020; joined in November 2020 according to the company’s 2021 annual report. End year unconfirmed.',
      sources: ['https://corporate.authentic.com/s/Ted-Baker-plc-Audited-Accounts-for-the-financial-year-ended-30-January.pdf'],
    }],
  },
  ryanOConnor: {
    name: 'Ryan O’Connor',
    career: [{
      house: 'ripndip',
      role: 'Founder',
      start: 2009,
      sources: ['https://ripndip.com/pages/about-us'],
    }],
  },
  cyrusClark: {
    name: 'Cyrus Clark',
    nationality: 'British',
    career: [{
      house: 'clarks',
      role: 'Founder',
      roleDetail: 'Co-founder with James Clark',
      start: 1825,
      sources: ['https://www.clarks.com/en-cy/about-us'],
    }],
  },
  jamesClark: {
    name: 'James Clark',
    nationality: 'British',
    career: [{
      house: 'clarks',
      role: 'Founder',
      roleDetail: 'Co-founder with Cyrus Clark',
      start: 1825,
      sources: ['https://www.clarks.com/en-cy/about-us'],
    }],
  },
  kenBlock: {
    name: 'Ken Block',
    career: [{
      house: 'dcShoes',
      role: 'Founder',
      roleDetail: 'Co-founder with Damon Way',
      start: 1994,
      sources: ['https://cdn.dcshoes.com.ar/sobre-nosotros', 'https://www.thehenryford.org/docs/thehenryfordlibraries/innovator-transcripts/ken-block-interview.pdf'],
    }],
  },
  damonWay: {
    name: 'Damon Way',
    career: [{
      house: 'dcShoes',
      role: 'Founder',
      roleDetail: 'Co-founder with Ken Block',
      start: 1994,
      sources: ['https://cdn.dcshoes.com.ar/sobre-nosotros'],
    }],
  },
  prathanPoopat: {
    name: 'Prathan Poopat',
    career: [{
      house: 'commonProjects',
      role: 'Founder',
      roleDetail: 'Co-founder and designer',
      start: 2004,
      sources: ['https://kith.com/blogs/discover/common-projects-classics', 'https://www.sneakerfreaker.com/news/common-projects-the-perfect-sneaker'],
    }],
  },
  flavioGirolami: {
    name: 'Flavio Girolami',
    career: [{
      house: 'commonProjects',
      role: 'Founder',
      roleDetail: 'Co-founder and creative consultant',
      start: 2004,
      sources: ['https://kith.com/blogs/discover/common-projects-classics', 'https://www.mrporter.com/en-us/journal/fashion/why-common-projects-isnt-just-about-shoes-698692'],
    }],
  },
  robertGodley: {
    name: 'Robert Godley',
    career: [{
      house: 'psychoBunny',
      role: 'Founder',
      roleDetail: 'Co-founder and designer',
      start: 2005,
      sources: ['https://www.itochu.co.jp/en/news/press/2016/160727.html'],
    }],
  },
  robertGoldman: {
    name: 'Robert Goldman',
    career: [{
      house: 'psychoBunny',
      role: 'Founder',
      roleDetail: 'Co-founder with Robert Godley',
      start: 2005,
      sources: ['https://www.prweb.com/releases/menswear-disruptor-psycho-bunny-propels-2022-global-retail-expansion-842726367.html', 'https://www.itochu.co.jp/en/news/press/2016/160727.html'],
    }],
  },
  keithHufnagel: {
    name: 'Keith Hufnagel',
    career: [{
      house: 'huf',
      role: 'Founder',
      roleDetail: 'Founder',
      start: 2002,
      sources: ['https://hufworldwide.com/blogs/news/the-creative-report-keith-hufnagel-interview'],
    }],
  },
  nickTershay: {
    name: 'Nick Tershay (Nick Diamond)',
    career: [{
      house: 'diamondSupplyCo',
      role: 'Founder',
      roleDetail: 'Founder',
      start: 1998,
      sources: ['https://skatenewswire.com/nick-tershay-wwd-interview/'],
    }],
  },
  dennisCalvero: {
    name: 'Dennis Calvero',
    career: [{
      house: 'crooksAndCastles',
      role: 'Founder',
      roleDetail: 'Co-founder',
      start: 2002,
      sources: ['https://mlgbrands.com/crooks-and-castles.html'],
    }],
  },
  robertPanlilio: {
    name: 'Robert Panlilio',
    career: [{
      house: 'crooksAndCastles',
      role: 'Founder',
      roleDetail: 'Co-founder',
      start: 2002,
      sources: ['https://mlgbrands.com/crooks-and-castles.html'],
    }],
  },
  bobbyHundreds: {
    name: 'Bobby Kim (Bobby Hundreds)',
    career: [{
      house: 'theHundreds',
      role: 'Founder',
      roleDetail: 'Co-founder',
      start: 2003,
      sources: ['https://thehundreds.com/pages/about'],
    }],
  },
  benHundreds: {
    name: 'Ben Shenassafar (Ben Hundreds)',
    career: [{
      house: 'theHundreds',
      role: 'Founder',
      roleDetail: 'Co-founder',
      start: 2003,
      sources: ['https://thehundreds.com/pages/about'],
    }],
  },
  shepardFairey: {
    name: 'Shepard Fairey',
    career: [{
      house: 'obey',
      role: 'Founder',
      roleDetail: 'Founder',
      start: 2001,
      sources: ['https://obeyclothing.com/pages/about'],
    }],
  },
  jamesBond: {
    name: 'James Bond',
    career: [{
      house: 'undefeated',
      role: 'Founder',
      roleDetail: 'Co-founder',
      start: 2002,
      sources: ['https://www.dazeddigital.com/fashion/article/37357/1/how-undefeated-became-los-angeles-accidental-sneaker-mecca-nike-james-bond'],
    }],
  },
  eddieCruz: {
    name: 'Eddie Cruz',
    career: [{
      house: 'undefeated',
      role: 'Founder',
      roleDetail: 'Co-founder',
      start: 2002,
      sources: ['https://www.dazeddigital.com/fashion/article/37357/1/how-undefeated-became-los-angeles-accidental-sneaker-mecca-nike-james-bond'],
    }],
  },
  melZiegler: {
    name: 'Mel Ziegler',
    career: [{
      house: 'bananaRepublic',
      role: 'Founder',
      roleDetail: 'Co-founder',
      start: 1978,
      sources: ['https://www.gapinc.com/en-us/about/banana-republic?lv=true'],
    }],
  },
  patriciaZiegler: {
    name: 'Patricia Ziegler',
    career: [{
      house: 'bananaRepublic',
      role: 'Founder',
      roleDetail: 'Co-founder',
      start: 1978,
      sources: ['https://www.gapinc.com/en-us/about/banana-republic?lv=true'],
    }],
  },
  joeMimran: {
    name: 'Joe Mimran',
    career: [{
      house: 'clubMonaco',
      role: 'Founder',
      roleDetail: 'Co-founder',
      start: 1985,
      sources: ['https://www.alfredsung.com/club-monaco'],
    }],
  },
  saulMimran: {
    name: 'Saul Mimran',
    career: [{
      house: 'clubMonaco',
      role: 'Founder',
      roleDetail: 'Co-founder',
      start: 1985,
      sources: ['https://www.alfredsung.com/club-monaco'],
    }],
  },
  alfredSung: {
    name: 'Alfred Sung',
    career: [{
      house: 'clubMonaco',
      role: 'Founder',
      roleDetail: 'Co-founder',
      start: 1985,
      sources: ['https://www.alfredsung.com/club-monaco'],
    }],
  },
  brianHill: {
    name: 'Brian Hill',
    career: [{
      house: 'aritzia',
      role: 'Founder',
      roleDetail: 'Founder',
      start: 1984,
      sources: ['https://www.aritzia.com/en/aritzia/corporate-hub/about-us/our-history'],
    }],
  },
  dannyHarris: {
    name: 'Danny Harris',
    career: [{
      house: 'aloYoga',
      role: 'Founder',
      roleDetail: 'Co-founder',
      start: 2007,
      sources: ['https://www.alshaya.com/eng/media-centre/alshaya-news/alo-yoga-to-debut-in-dubai-in-partnership-with-alshaya-group/'],
    },
      {
        house: 'aloYoga',
        role: 'CEO',
        roleDetail: 'Chief executive officer',
        end: null,
        notes: 'Identified as Alo’s CEO in the January 2026 international CEO announcement; exact start year of this title unconfirmed.',
        sources: ['https://sgbonline.com/alo-yoga-appointes-international-ceo/'],
      },
    ],
  },
  marcoDeGeorge: {
    name: 'Marco DeGeorge',
    career: [{
      house: 'aloYoga',
      role: 'Founder',
      roleDetail: 'Co-founder',
      start: 2007,
      sources: ['https://www.alshaya.com/eng/media-centre/alshaya-news/alo-yoga-to-debut-in-dubai-in-partnership-with-alshaya-group/'],
    }],
  },
  craigAtkinson: {
    name: 'Craig Atkinson',
    career: [{
      house: 'reigningChamp',
      role: 'Founder',
      roleDetail: 'Co-founder',
      start: 2007,
      sources: ['https://investors.aritzia.com/investor-news/press-release-details/2021/Aritzia-accelerates-expansion-into-mens-with-acquisition-of-premium-athletic-wear-brand-Reigning-Champ/default.aspx'],
    },
      {
        house: 'reigningChamp',
        role: 'CEO',
        roleDetail: 'Chief executive officer',
        notes: 'Confirmed as CEO in Aritzia’s 2021 acquisition announcement. Exact tenure dates and current status unconfirmed.',
        sources: ['https://investors.aritzia.com/investor-news/press-release-details/2021/Aritzia-accelerates-expansion-into-mens-with-acquisition-of-premium-athletic-wear-brand-Reigning-Champ/default.aspx'],
      },
    ],
  },
  chrisNordee: {
    name: 'Chris Nordee',
    career: [{
      house: 'reigningChamp',
      role: 'Founder',
      roleDetail: 'Co-founder',
      start: 2007,
      sources: ['https://investors.aritzia.com/investor-news/press-release-details/2021/Aritzia-accelerates-expansion-into-mens-with-acquisition-of-premium-athletic-wear-brand-Reigning-Champ/default.aspx'],
    }],
  },
  amancioOrtega: {
    name: 'Amancio Ortega',
    career: [{
      house: 'zara',
      role: 'Founder',
      roleDetail: 'Co-founder',
      start: 1975,
      sources: ['https://www.cbsnews.com/news/zara-co-founder-rosalia-mera-dies-at-69/'],
    }],
  },
  rosaliaMera: {
    name: 'Rosalía Mera',
    career: [{
      house: 'zara',
      role: 'Founder',
      roleDetail: 'Co-founder',
      start: 1975,
      sources: ['https://www.cbsnews.com/news/zara-co-founder-rosalia-mera-dies-at-69/'],
    }],
  },
  erlingPersson: {
    name: 'Erling Persson',
    career: [{
      house: 'hm',
      role: 'Founder',
      roleDetail: 'Founder',
      start: 1947,
      sources: ['https://hmgroup.com/about-us/history/'],
    }],
  },
  samuelGelber: {
    name: 'Samuel Gelber',
    career: [{
      house: 'alphaIndustries',
      role: 'Founder',
      roleDetail: 'Founder',
      start: 1959,
      sources: ['https://www.alphaindustries.com/pages/history-of-alpha'],
    }],
  },
  nicolasMermoud: {
    name: 'Nicolas Mermoud',
    career: [{
      house: 'hoka',
      role: 'Founder',
      roleDetail: 'Co-founder',
      start: 2009,
      sources: ['https://cl.hoka.com/la-historia-de-hoka/'],
    }],
  },
  jeanLucDiard: {
    name: 'Jean-Luc Diard',
    career: [{
      house: 'hoka',
      role: 'Founder',
      roleDetail: 'Co-founder',
      start: 2009,
      sources: ['https://cl.hoka.com/la-historia-de-hoka/'],
    }],
  },
  johnBrooksGoldenberg: {
    name: 'John Brooks Goldenberg',
    career: [{
      house: 'brooks',
      role: 'Founder',
      roleDetail: 'Founder',
      start: 1914,
      sources: ['https://www.itochu.co.jp/en/news/press/2019/190411.html'],
    }],
  },
  karinGustafsson: {
    name: 'Karin Gustafsson',
    career: [{
      house: 'cos',
      role: 'Head Designer',
      roleDetail: 'Design director',
      notes: 'Title confirmed in Vogue Business’s 2025 interview and correction; exact start year of this title unconfirmed.',
      sources: ['https://www.vogue.com/article/inside-coss-elevation-strategy'],
    }],
  },
  pierreBerge: {
    name: "Pierre Bergé",
    career: [{
      house: 'saintLaurent',
      role: 'Founder',
    }],
  },
  sergioGaleotti: {
    name: "Sergio Galeotti",
    career: [{
      house: 'armani',
      role: 'Founder',
    }],
  },
  andreVincent: {
    name: "André Vincent",
    career: [{
      house: 'moncler',
      role: 'Founder',
    }],
  },
  robertRicci: {
    name: "Robert Ricci",
    career: [{
      house: 'ninaRicci',
      role: 'Founder',
    }],
  },
  johnBowman: {
    name: "John Bowman",
    career: [{
      house: 'chromeHearts',
      role: 'Founder',
    }],
  },
  leonardKamhout: {
    name: "Leonard Kamhout",
    career: [{
      house: 'chromeHearts',
      role: 'Founder',
    }],
  },
  robertDuffy: {
    name: "Robert Duffy",
    career: [{
      house: 'marcJacobs',
      role: 'Founder',
      sources: ["https://www.whp-global.com/pages/brands", "https://www.globenewswire.com/news-release/2026/09/01/3354592/0/en/whp-global-and-g-iii-apparel-group-complete-acquisition-of-marc-jacobs.html"],
    }],
  },
  milesCahn: {
    name: "Miles Cahn",
    career: [{
      house: 'coach',
      role: 'Other',
      roleDetail: 'Early owner and brand builder',
    }],
  },
  lillianCahn: {
    name: "Lillian Cahn",
    career: [{
      house: 'coach',
      role: 'Other',
      roleDetail: 'Early owner and brand builder',
    }],
  },
  andreGillier: {
    name: "André Gillier",
    career: [{
      house: 'lacoste',
      role: 'Founder',
    }],
  },
  raulLopez: {
    name: "Raul Lopez",
    career: [{
      house: 'hoodByAir',
      role: 'Founder',
    }],
  },
  tibbyWegner: {
    name: "Tibby Wegner",
    career: [{
      house: 'fredPerry',
      role: 'Founder',
    }],
  },
  takashiImaki: {
    name: "Takashi Imaki",
    career: [{
      house: 'nanamica',
      role: 'Founder',
    }],
  },
  gordonLee: {
    name: "Gordon Lee",
    career: [{
      house: 'vans',
      role: 'Founder',
      sources: ["https://vfc.com/brands/vans", "https://www.vans.com/en-us/about", "https://www.foxla.com/news/vans-co-founder-paul-van-doren-dead-at-90", "https://www.latimes.com/socal/daily-pilot/news/story/2019-12-13/vans-approval-expand-headquarters-costa-mesa"],
    }],
  },
  sergeDElia: {
    name: "Serge D’Elia",
    career: [{
      house: 'vans',
      role: 'Founder',
      sources: ["https://vfc.com/brands/vans", "https://www.vans.com/en-us/about", "https://www.foxla.com/news/vans-co-founder-paul-van-doren-dead-at-90", "https://www.latimes.com/socal/daily-pilot/news/story/2019-12-13/vans-approval-expand-headquarters-costa-mesa"],
    }],
  },
  jeffClyman: {
    name: 'Jeff Clyman',
    career: [{
      house: 'avirex',
      role: 'Founder',
      start: 1975,
      end: 2006,
      sources: ['https://seams.org/wp-content/uploads/2019/12/Member-Spotlight-Cockpit-USA.pdf', 'https://www.fashionpress.jp/en/brands/1761'],
    }],
  },
  irvingSchott: {
    name: 'Irving Schott',
    career: [{
      house: 'schott',
      role: 'Founder',
      roleDetail: 'Co-founder with Jack Schott; creator of the Perfecto motorcycle jacket',
      start: 1913,
      sources: ['https://www.schottnyc.com/pages/story'],
    }],
  },
  jackSchott: {
    name: 'Jack Schott',
    career: [{
      house: 'schott',
      role: 'Founder',
      roleDetail: 'Co-founder with Irving Schott',
      start: 1913,
      sources: ['https://www.schottnyc.com/pages/story'],
    }],
  },
  maikoKurogouchi: {
    name: 'Maiko Kurogouchi',
    born: 1985,
    nationality: 'Japanese',
    career: [
      {
        house: 'isseyMiyake',
        role: 'Other',
        roleDetail: 'Womenswear design team',
        notes: 'Designed womenswear before establishing her own label in 2010; exact employment years unconfirmed.',
        sources: ['https://www.fhcm.paris/fr/news/mames-memory-of-homeland', 'https://openers.jp/en/lounge/lounge_art/20171'],
      },
      {
        house: 'mameKurogouchi',
        role: 'Founder',
        roleDetail: 'Founder and designer',
        start: 2010,
        end: null,
        sources: ['https://www.mamekurogouchi.com/pages/about', 'https://fashion-prize-of-tokyo.jp/winner_mame.php'],
      },
    ],
  },
  mikeCirker: {
    name: 'Mike Cirker',
    career: [{
      house: 'alphaIndustries',
      role: 'CEO',
      roleDetail: 'Chief executive officer',
      start: 2011,
      end: null,
      notes: 'Third-generation leader of the family business, succeeding his father Alan Cirker. Business leadership rather than a creative-director appointment.',
      sources: ['https://nasdaqcenter.org/2021/11/16/foe-mike-cirker-alpha-industries/', 'https://www.alphaindustries.com/blogs/alpha-stories-military/mike-cirker-ceo', 'https://www.tsi-holdings.com/pdf/241011_ALPHA_4_EN.pdf'],
    }],
  },
  elliottHill: {
    name: 'Elliott Hill',
    career: [
      {
        house: 'nike',
        role: 'Other',
        roleDetail: 'Commercial leadership and earlier Nike roles',
        start: 1988,
        end: 2020,
        notes: 'Worked at Nike before retiring in 2020; returned as CEO in October 2024.',
        sources: ['https://about.nike.com/en/company/people/elliott-hill', 'https://about.nike.com/en-GB/newsroom/releases/nike-inc-announces-return-of-long-time-nike-veteran-elliott-hill-as-president-ceo'],
      },
      {
        house: 'nike',
        role: 'CEO',
        roleDetail: 'President and CEO',
        start: 2024,
        end: null,
        notes: 'Appointment effective October 14, 2024.',
        sources: ['https://about.nike.com/en-GB/newsroom/releases/nike-inc-announces-return-of-long-time-nike-veteran-elliott-hill-as-president-ceo', 'https://about.nike.com/en/company/people/elliott-hill'],
      },
    ],
  },
  markParker: {
    name: 'Mark Parker',
    career: [
      {
        house: 'nike',
        role: 'Other',
        roleDetail: 'Footwear designer and product leadership',
        start: 1979,
        end: 2006,
        sources: ['https://about.nike.com/en/company/people/mark-parker'],
      },
      {
        house: 'nike',
        role: 'CEO',
        roleDetail: 'President and CEO',
        start: 2006,
        end: 2020,
        notes: 'Became executive chairman when John Donahoe succeeded him in January 2020.',
        sources: ['https://about.nike.com/en/newsroom/releases/board-member-john-donahoe-will-succeed-mark-parker-as-president-and-ceo-in-2020-parker-to-become-executive-chairman', 'https://about.nike.com/en/company/people/mark-parker'],
      },
    ],
  },
  johnDonahoe: {
    name: 'John Donahoe',
    career: [
      {
        house: 'nike',
        role: 'CEO',
        roleDetail: 'President and CEO',
        start: 2020,
        end: 2024,
        notes: 'Served from January 13, 2020 to October 13, 2024.',
        sources: ['https://about.nike.com/en/newsroom/releases/board-member-john-donahoe-will-succeed-mark-parker-as-president-and-ceo-in-2020-parker-to-become-executive-chairman', 'https://about.nike.com/en-GB/newsroom/releases/nike-inc-announces-return-of-long-time-nike-veteran-elliott-hill-as-president-ceo'],
      },
    ],
  },
  bjornGulden: {
    name: 'Bjørn Gulden',
    career: [
      {
        house: 'puma',
        role: 'CEO',
        roleDetail: 'Chief executive officer',
        start: 2013,
        end: 2022,
        sources: ['https://www.adidas-group.com/en/about/executive-board'],
      },
      {
        house: 'adidas',
        role: 'CEO',
        roleDetail: 'Chief executive officer',
        start: 2023,
        end: null,
        notes: 'Appointment effective January 1, 2023 after leading Puma.',
        sources: ['https://www.adidas-group.com/en/about/executive-board'],
      },
    ],
  },
  arthurHoeld: {
    name: 'Arthur Hoeld',
    career: [
      {
        house: 'adidas',
        role: 'Other',
        roleDetail: 'Executive leadership; most recently chief sales officer',
        end: 2025,
        notes: 'Held several management roles at adidas before joining Puma; exact start year of the recorded executive tenure unconfirmed.',
        sources: ['https://about.puma.com/en/puma/our-management'],
      },
      {
        house: 'puma',
        role: 'CEO',
        roleDetail: 'Chief executive officer',
        start: 2025,
        end: null,
        notes: 'Became CEO in July 2025.',
        sources: ['https://about.puma.com/en/puma/our-management'],
      },
    ],
  },
  joePreston: {
    name: 'Joe Preston',
    career: [
      {
        house: 'newBalance',
        role: 'CEO',
        roleDetail: 'President and CEO',
        start: 2019,
        end: null,
        notes: 'Succeeded Rob DeMartini following his December 31, 2018 departure.',
        sources: ['https://newbalance.newsmarket.com/LATEST-NEWS/new-balance-announces-global-leadership-progression---joe-preston-to-succeed-rob-demartini-as-new-ba/s/19f2d353-2541-417c-9d9b-1dc4727df8d6', 'https://newbalance.newsmarket.com/index?categoryid=34642&handler=leadershippanel', 'https://www.sportsbusinessjournal.com/Journal/Issues/2018/12/03/People-and-Pop-Culture/Thinking-Back-Looking-Ahead/'],
      },
    ],
  },
  yasuhitoHirota: {
    name: 'Yasuhito Hirota',
    career: [
      {
        house: 'asics',
        role: 'CEO',
        roleDetail: 'Chief executive officer; later chairman and CEO',
        start: 2022,
        end: null,
        notes: 'Added the CEO title in March 2022 after serving as president and COO; subsequently became chairman and CEO.',
        sources: ['https://corp.asics.com/en/press/article/2022-02-18', 'https://corp.asics.com/en/about_asics/practical_information'],
      },
    ],
  },
  robinGreen: {
    name: 'Robin Green',
    career: [
      {
        house: 'nike',
        role: 'Other',
        roleDetail: 'Global vice president, men’s running and fitness',
        end: 2024,
        notes: 'Most recent role in a 17-year Nike career; exact start year of this title unconfirmed.',
        sources: ['https://ir.deckers.com/news-events/press-releases/detail/244/deckers-brands-names-robin-green-as-president-of-hoka'],
      },
      {
        house: 'hoka',
        role: 'President',
        roleDetail: 'President, HOKA',
        start: 2024,
        end: null,
        notes: 'Appointment effective February 12, 2024. Brand president reporting to Deckers leadership, not CEO of the parent company.',
        sources: ['https://ir.deckers.com/news-events/press-releases/detail/244/deckers-brands-names-robin-green-as-president-of-hoka', 'https://ir.deckers.com/company-information/executive-team'],
      },
    ],
  },
  danSheridan: {
    name: 'Dan Sheridan',
    career: [
      {
        house: 'brooks',
        role: 'CEO',
        roleDetail: 'Chief executive officer',
        start: 2024,
        end: null,
        notes: 'Succeeded Jim Weber on April 26, 2024.',
        sources: ['https://www.brooksrunning.com/en_us/03-12-2024/', 'https://www.brooksrunning.com/on/demandware.static/-/Sites/default/dw88abaadd/cms-content/Project/ADT/Brooks%20Running/Landing/2023/Spring-2023/running-transparency/2024_Corporate_Responsibility_Report.pdf'],
      },
    ],
  },
  jimWeber: {
    name: 'Jim Weber',
    career: [
      {
        house: 'brooks',
        role: 'CEO',
        roleDetail: 'Chief executive officer',
        start: 2001,
        end: 2024,
        notes: 'Succeeded by Dan Sheridan on April 26, 2024.',
        sources: ['https://www.brooksrunning.com/en_us/03-12-2024/'],
      },
    ],
  },
  martinHoffmann: {
    name: 'Martin Hoffmann',
    career: [
      {
        house: 'onRunning',
        role: 'CEO',
        roleDetail: 'Co-CEO and CFO; sole CEO from July 2025',
        start: 2021,
        end: 2026,
        notes: 'Served as co-CEO before becoming sole CEO on July 1, 2025. Stepped down May 1, 2026; advisory work afterward is separate from the CEO tenure.',
        sources: ['https://press.on-running.com/on-announces-leadership-evolution', 'https://investors.on-running.com/news/news-details/2026/On-Co-Founders-to-Lead-Next-Chapter-of-Growth-as-Co-CEOs/default.aspx'],
      },
    ],
  },
  aaronCain: {
    name: 'Aaron Cain',
    career: [
      {
        house: 'nike',
        role: 'Other',
        roleDetail: 'Global vice president and general manager, Nike Men’s',
        end: 2025,
        notes: 'Most recent Nike role before becoming Converse CEO; exact start year of this title unconfirmed.',
        sources: ['https://about.nike.com/en/company/people/aaron-cain'],
      },
      {
        house: 'converse',
        role: 'CEO',
        roleDetail: 'President and CEO',
        start: 2025,
        end: null,
        notes: 'Appointed in July 2025, succeeding Jared Carver. Leads Converse rather than Nike as a whole.',
        sources: ['https://about.nike.com/en/company/people/aaron-cain', 'https://www.retaildive.com/news/nike-names-aaron-cain-ceo-converse-jared-carver-exits/752800/'],
      },
    ],
  },
  sunChoe: {
    name: 'Sun Choe',
    career: [
      {
        house: 'lululemon',
        role: 'Other',
        roleDetail: 'Chief product officer',
        start: 2018,
        end: 2024,
        sources: ['https://vfc.com/our-company/global-leadership-team/detail/122223'],
      },
      {
        house: 'vans',
        role: 'President',
        roleDetail: 'Global brand president',
        start: 2024,
        end: null,
        notes: 'Leads Vans globally within VF Corporation.',
        sources: ['https://www.vfc.com/news/press-release/1836/vf-corporation-appoints-sun-choe-as-global-brand-president', 'https://vfc.com/our-company/global-leadership-team/detail/122223'],
      },
    ],
  },
  robGriffiths: {
    name: 'Rob Griffiths',
    career: [
      {
        house: 'saucony',
        role: 'President',
        roleDetail: 'Global brand president',
        start: 2023,
        end: null,
        notes: 'Leads Saucony within Wolverine Worldwide; not the parent-company CEO.',
        sources: ['https://investors.wolverineworldwide.com/news/news-details/2023/Wolverine-Worldwide-Announces-New-Leadership-Appointments-to-Drive-Future-Growth-05-31-2023/default.aspx', 'https://investors.wolverineworldwide.com/news/news-details/2026/Saucony-Unveils-The-Runners-A-Meditation-on-Connection-and-Community/default.aspx'],
      },
    ],
  },
  toddKrinsky: {
    name: 'Todd Krinsky',
    career: [
      {
        house: 'reebok',
        role: 'CEO',
        roleDetail: 'President and CEO',
        start: 2022,
        end: null,
        notes: 'Appointed in September 2022. Continued leading Reebok when its US and European operating business transferred to Galaxy Universal in 2025; distinct from Authentic’s ownership of the brand.',
        sources: ['https://corporate.authentic.com/press-releases/reebok-todd-krinsky-new-ceo', 'https://preview.thenewsmarket.com/Previews/RBOK/DocumentAssets/674166.pdf', 'https://www.sportsbusinessjournal.com/Articles/2025/02/20/galaxy-universal-named-new-owners-of-reeboks-us-european-operations/'],
      },
    ],
  },
  borreHegbom: {
    name: 'Børre Hegbom',
    career: [
      {
        house: 'hellyHansen',
        role: 'President',
        roleDetail: 'Global brand president / global head of Helly Hansen',
        start: 2025,
        end: null,
        notes: 'Appointed global head on October 30, 2025, responsible for Sport and Workwear. Kontoor’s 2026 announcement also identifies him as global brand president.',
        sources: ['https://www.kontoorbrands.com/news-media/press-release/209/kontoor-brands-appoints-brre-hegbom-as-senior-vice', 'https://www.kontoorbrands.com/investors/news-events/press-releases/detail/213/kontoor-brands-to-host-helly-hansen-investor-day-on'],
      },
    ],
  },
  takaoWatanabe: {
    name: 'Takao Watanabe',
    career: [
      {
        house: 'goldwin',
        role: 'CEO',
        roleDetail: 'President and CEO',
        start: 2020,
        end: null,
        notes: 'Became president on April 1, 2020; leads Goldwin Inc., the company behind the Goldwin brand.',
        sources: ['https://corp.goldwin.co.jp/eng/cgi/wordpress/wp-content/uploads/2020/02/20200212_1500.pdf', 'https://about.goldwin.co.jp/eng/about/company'],
      },
    ],
  },
  shuichiKoseki: {
    name: 'Shuichi Koseki',
    career: [
      {
        house: 'descente',
        role: 'President',
        roleDetail: 'President and representative director',
        end: null,
        notes: 'Current corporate president confirmed by the July 2026 company message; exact appointment year unconfirmed.',
        sources: ['https://www.descente.co.jp/en/company/profile/', 'https://www.descente.co.jp/jp/company/message/'],
      },
    ],
  },
  claudioBora: {
    name: 'Claudio Bora',
    career: [
      {
        house: 'diadora',
        role: 'CEO',
        roleDetail: 'Chief executive officer',
        notes: 'CEO confirmed in Diadora’s 2024 sustainability report. Exact start and end years unconfirmed.',
        sources: ['https://www.diadora.com/on/demandware.static/-/Library-Sites-DiadoraSportShared/default/dwf35b047b/attachment/sustainabilityReport/87_2024_Diadora_Sustainability_Report_ENG.pdf'],
      },
    ],
  },
  benedettaPetruzzo: {
    name: 'Benedetta Petruzzo',
    career: [
      {
        house: 'aloYoga',
        role: 'CEO',
        roleDetail: 'International CEO',
        start: 2026,
        end: null,
        notes: 'Appointed in January 2026 to lead international business, reporting to co-founder and CEO Danny Harris. This is an international remit rather than the global CEO role.',
        sources: ['https://sgbonline.com/alo-yoga-appointes-international-ceo/'],
      },
    ],
  },
  yujiroKomatsu: {
    name: 'Yujiro Komatsu',
    career: [
      {
        house: 'undercover',
        role: 'Other',
        roleDetail: 'Leather design and development',
        notes: 'Komatsu describes this work in his fashion-week interview; exact tenure dates are unconfirmed.',
        sources: [
          'https://rakutenfashionweektokyo.com/en/topics/interview/yujiro-komatsu/'
        ]
      },
      {
        house: 'blackmeans',
        role: 'Founder',
        roleDetail: 'Co-founder and designer',
        start: 2008,
        sources: [
          'https://rakutenfashionweektokyo.com/jp/brands/detail/blackmeans/'
        ]
      }
    ],
    notes: 'Previously worked on leather at 20471120 and Undercover; exact dates are unconfirmed.',
    sources: [
      'https://rakutenfashionweektokyo.com/jp/brands/detail/blackmeans/'
    ]
  },
  takayukiAriga: {
    name: 'Takayuki Ariga',
    career: [
      {
        house: 'blackmeans',
        role: 'Founder',
        roleDetail: 'Co-founder',
        start: 2008,
        end: 2019,
        sources: [
          'https://rakutenfashionweektokyo.com/jp/brands/detail/blackmeans/'
        ]
      }
    ],
    sources: [
      'https://rakutenfashionweektokyo.com/jp/brands/detail/blackmeans/'
    ]
  },
  masatomoAriga: {
    name: 'Masatomo Ariga',
    career: [
      {
        house: 'blackmeans',
        role: 'Founder',
        roleDetail: 'Co-founder and designer',
        start: 2008,
        sources: [
          'https://rakutenfashionweektokyo.com/jp/brands/detail/blackmeans/'
        ]
      }
    ],
    sources: [
      'https://rakutenfashionweektokyo.com/jp/brands/detail/blackmeans/'
    ]
  },
  maurizioAmadei: {
    name: 'Maurizio Amadei',
    career: [
      {
        house: 'maPlus',
        role: 'Founder',
        roleDetail: 'Founder and designer',
        start: 2006,
        sources: [
          'https://larmoire-singapore.com/m-a-by-maurizio-amadei-spring-summer-2019-collection/'
        ]
      }
    ],
    notes: 'Previously designed leather goods at Carpe Diem. Exact tenure dates are unconfirmed; that label is not yet in this dataset.',
    sources: [
      'https://larmoire-singapore.com/m-a-by-maurizio-amadei-spring-summer-2019-collection/'
    ]
  },
  brianSmith: {
    name: 'Brian Smith',
    career: [
      {
        house: 'ugg',
        role: 'Founder',
        roleDetail: 'Founder',
        start: 1978,
        end: 1995,
        sources: [
          'https://au.ugg.com/articles/our-history'
        ]
      }
    ],
    sources: [
      'https://au.ugg.com/articles/our-history'
    ]
  },
  johannesBirkenstock: {
    name: 'Johannes Birkenstock',
    career: [
      {
        house: 'birkenstock',
        role: 'Founder',
        roleDetail: 'Shoemaking ancestor; first documented in 1774',
        sources: [
          'https://www.birkenstock-group.com/de/en/about-us/history'
        ]
      }
    ],
    notes: 'The current official history identifies Johannes Birkenstock (1749–1812) as the documented ancestor. The 1774 date is a heritage reference, not a confirmed company-founding tenure.',
    sources: [
      'https://www.birkenstock-group.com/de/en/about-us/history'
    ]
  },
  martinKeen: {
    name: 'Martin Keen',
    career: [
      {
        house: 'keen',
        role: 'Founder',
        roleDetail: 'Co-founder and footwear designer',
        start: 2003,
        sources: [
          'https://www.agi.co.nz/our-brands-1/keen-footwear'
        ]
      }
    ],
    sources: [
      'https://www.agi.co.nz/our-brands-1/keen-footwear'
    ]
  },
  roryFuerst: {
    name: 'Rory Fuerst',
    career: [
      {
        house: 'keen',
        role: 'Founder',
        roleDetail: 'Co-founder',
        start: 2003,
        sources: [
          'https://www.agi.co.nz/our-brands-1/keen-footwear'
        ]
      }
    ],
    sources: [
      'https://www.agi.co.nz/our-brands-1/keen-footwear'
    ]
  },
  arthurChmielewski: {
    name: 'Arthur Chmielewski',
    career: [
      {
        house: 'haven',
        role: 'Creative Director',
        end: null,
        notes: 'Identified as creative director in an August 2026 profile; exact appointment year is unconfirmed.',
        sources: ['https://www.heddels.com/2026/08/haven-history-philosophy-iconic-products/'],
      },
      {
        house: 'haven',
        role: 'Founder',
        roleDetail: 'Co-founder',
        start: 2006,
        sources: [
          'https://havenshop.com/about'
        ]
      }
    ],
    notes: 'Co-founded the retail business in 2006; the own clothing label followed in 2017.',
    sources: [
      'https://havenshop.com/about'
    ]
  },
  danielChmielewski: {
    name: 'Daniel Chmielewski',
    career: [
      {
        house: 'haven',
        role: 'Founder',
        roleDetail: 'Co-founder',
        start: 2006,
        sources: [
          'https://havenshop.com/about'
        ]
      }
    ],
    notes: 'Co-founded the retail business in 2006; the own clothing label followed in 2017.',
    sources: [
      'https://havenshop.com/about'
    ]
  },
  thomasChurch: {
    name: 'Thomas Church',
    career: [
      {
        house: 'churchs',
        role: 'Founder',
        roleDetail: 'Co-founder',
        start: 1873,
        sources: [
          'https://www.church-footwear.com/jp/en/churchs-world/2022/churchs-history.html'
        ]
      }
    ],
    sources: [
      'https://www.church-footwear.com/jp/en/churchs-world/2022/churchs-history.html'
    ]
  },
  elizaChurch: {
    name: 'Eliza Church',
    career: [
      {
        house: 'churchs',
        role: 'Founder',
        roleDetail: 'Co-founder',
        start: 1873,
        sources: [
          'https://www.church-footwear.com/jp/en/churchs-world/2022/churchs-history.html'
        ]
      }
    ],
    sources: [
      'https://www.church-footwear.com/jp/en/churchs-world/2022/churchs-history.html'
    ]
  },
  alfredChurch: {
    name: 'Alfred Church',
    career: [
      {
        house: 'churchs',
        role: 'Founder',
        roleDetail: 'Co-founder',
        start: 1873,
        sources: [
          'https://www.church-footwear.com/jp/en/churchs-world/2022/churchs-history.html'
        ]
      }
    ],
    sources: [
      'https://www.church-footwear.com/jp/en/churchs-world/2022/churchs-history.html'
    ]
  },
  williamChurch: {
    name: 'William Church',
    career: [
      {
        house: 'churchs',
        role: 'Founder',
        roleDetail: 'Co-founder',
        start: 1873,
        sources: [
          'https://www.church-footwear.com/jp/en/churchs-world/2022/churchs-history.html'
        ]
      }
    ],
    sources: [
      'https://www.church-footwear.com/jp/en/churchs-world/2022/churchs-history.html'
    ]
  },
  elbertAllen: {
    name: 'Elbert W. Allen',
    career: [
      {
        house: 'allenEdmonds',
        role: 'Founder',
        roleDetail: 'Founder',
        start: 1922,
        sources: [
          'https://www.allenedmonds.com/the-journal/made-here/our-legacy?icid=BottomNav_OurLegacy'
        ]
      }
    ],
    sources: [
      'https://www.allenedmonds.com/the-journal/made-here/our-legacy?icid=BottomNav_OurLegacy'
    ]
  },
  asapBari: {
    name: 'A$AP Bari (Jabari Shelton)',
    career: [
      {
        house: 'vlone',
        role: 'Founder',
        roleDetail: 'Co-founder and creative designer',
        end: 2022,
        notes: 'Recalled creating VLONE around 2011–12; exact start year is unconfirmed. The brand separated from him in 2022.',
        sources: ['https://www.xxlmag.com/asap-bari-interview-vlone-brand/', 'https://www.wwdjapan.com/articles/1447851'],
      },
    ],
  },
  asapRocky: {
    name: 'A$AP Rocky',
    career: [
      {
        house: 'rayBan',
        role: 'Creative Director',
        roleDetail: 'Ray-Ban Studios',
        start: 2025,
        end: null,
        notes: 'Appointed the first creative director for Ray-Ban Studios in 2025. His continuing role is confirmed by the 2026 Metal Collection campaign; this is a sustained appointment rather than a single capsule.',
        sources: ['https://www.essilorluxottica.com/en/newsroom/stories/ray-ban-names-a-ap-rocky-as-first-ever-creative-director/', 'https://tribecafilm.com/tribecax/official-selections/a-ap-rocky-x-ray-ban-2026'],
      },
      {
        house: 'vlone',
        role: 'Other',
        roleDetail: 'Creative team',
        notes: 'Identified with Bari and Edison Chen as part of the label’s creative core in a 2016 joint interview. Exact tenure dates and title are unconfirmed.',
        sources: ['https://www.highsnobiety.com/p/asap-rocky-asap-bari-vlone-brand/'],
      },
    ],
  },
  edisonChen: {
    name: 'Edison Chen',
    career: [
      {
        house: 'clot',
        role: 'Founder',
        roleDetail: 'Co-founder and creative director',
        start: 2003,
        sources: ['https://juicestore.com/pages/about-us', 'https://www.tatlerasia.com/the-scene/people-parties/kevin-poon-on-the-business-of-being-cool'],
      },
      {
        house: 'vlone',
        role: 'Other',
        roleDetail: 'Design and creative development',
        notes: 'Helped develop the label alongside Bari and Rocky; exact tenure dates are unconfirmed.',
        sources: ['https://www.highsnobiety.com/p/asap-rocky-asap-bari-vlone-brand/', 'https://www.wwdjapan.com/articles/1447851'],
      },
    ],
    notes: 'Co-founder of CLOT and a contributor to VLONE’s early creative development.',
  },
  nataliaMaczek: {
    name: 'Natalia Maczek',
    career: [
      {
        house: 'misbhv',
        role: 'Founder',
        roleDetail: 'Co-founder and designer',
        notes: 'Began the early T-shirt project with Katarzyna Kotnowska. Sources disagree on the founding year.',
        sources: ['https://www.twinfactory.co.uk/girls-who-misbhv/', 'https://www.ssense.com/en-ch/editorial/fashion/operating-off-the-grid-with-misbhv'],
      },
      {
        house: 'misbhv',
        role: 'Head Designer',
        notes: 'Documented as overseeing clothing design in 2018. Exact appointment and end dates are unconfirmed.',
        sources: ['https://www.vogue.com/fashion-shows/fall-2018-menswear/misbhv'],
      },
    ],
  },
  katarzynaKotnowska: {
    name: 'Katarzyna Kotnowska',
    career: [
      {
        house: 'misbhv',
        role: 'Founder',
        roleDetail: 'Early project co-founder',
        notes: 'Named alongside Natalia Maczek in Twin’s 2017 interview. Exact tenure dates are unconfirmed.',
        sources: ['https://www.twinfactory.co.uk/girls-who-misbhv/'],
      },
    ],
  },
  thomasWirski: {
    name: 'Thomas Wirski',
    career: [
      {
        house: 'misbhv',
        role: 'Founder',
        roleDetail: 'Co-founder of the contemporary label',
        notes: 'Maczek describes Wirski joining after her original T-shirt project; the exact year is unconfirmed.',
        sources: ['https://www.ssense.com/en-ch/editorial/fashion/operating-off-the-grid-with-misbhv'],
      },
      {
        house: 'misbhv',
        role: 'Creative Director',
        notes: 'Creative-director title confirmed in 2018; exact appointment and end dates are unconfirmed.',
        sources: ['https://www.vogue.com/fashion-shows/fall-2018-menswear/misbhv'],
      },
    ],
    notes: 'Also known as Tomasz Wirski or Tomek Wirski.',
  },
  georgeHeaton: {
    name: 'George Heaton',
    career: [
      {
        house: 'represent',
        role: 'Founder',
        roleDetail: 'Co-founder and creative director',
        start: 2011,
        sources: ['https://eu.representclo.com/pages/about', 'https://uk.representclo.com/blogs/articles/classic-graphics-the-restock'],
      },
    ],
  },
  mikeHeaton: {
    name: 'Mike Heaton',
    career: [
      {
        house: 'represent',
        role: 'Founder',
        roleDetail: 'Co-founder and creative director',
        start: 2011,
        sources: ['https://eu.representclo.com/pages/about', 'https://uk.representclo.com/blogs/articles/classic-graphics-the-restock'],
      },
    ],
    notes: 'Also known as Michael Heaton.',
  },
  stuartTrevor: {
    name: 'Stuart Trevor',
    career: [
      {
        house: 'allSaints',
        role: 'Founder',
        roleDetail: 'Co-founder and designer',
        start: 1994,
        notes: 'Former founding designer; exact departure year is unconfirmed here.',
        sources: ['https://allsaints.hk/zh/pages/allsaints-brand-story', 'https://stuarttrevor.com/pages/about-stuart'],
      },
    ],
    notes: 'Previously the first designer and main buyer at Reiss. Later co-founded Bolongaro Trevor and launched STUART TREVOR; these labels are not yet in this dataset.',
    sources: ['https://stuarttrevor.com/pages/about-stuart'],
  },
  kaitBolongaro: {
    name: 'Kait Bolongaro',
    career: [
      {
        house: 'allSaints',
        role: 'Founder',
        roleDetail: 'Co-founder and womenswear designer',
        start: 1994,
        notes: 'Former founding designer; exact departure year is unconfirmed here.',
        sources: ['https://allsaints.hk/zh/pages/allsaints-brand-story'],
      },
    ],
  },
  wilBeedle: {
    name: 'Wil Beedle',
    career: [
      {
        house: 'allSaints',
        role: 'Menswear Director',
        start: 2006,
        end: 2012,
        sources: ['https://fashionunited.com/news/people/wil-beedle-exits-allsaints-after-18-years-to-focus-on-shoreditch-ski-club-brand/2021072241169'],
      },
      {
        house: 'allSaints',
        role: 'Creative Director',
        roleDetail: 'Chief creative director',
        start: 2012,
        end: 2021,
        sources: ['https://fashionunited.com/news/people/wil-beedle-exits-allsaints-after-18-years-to-focus-on-shoreditch-ski-club-brand/2021072241169'],
      },
    ],
    notes: 'Later focused on his own outerwear label Shoreditch Ski Club, founded in 2018 and not yet in this dataset.',
    sources: ['https://www.varsity.co.uk/fashion/27252'],
  },
  aaronEsh: {
    name: 'Aaron Esh',
    career: [
      {
        house: 'allSaints',
        role: 'Creative Director',
        roleDetail: 'Chief creative officer — menswear, womenswear and brand image',
        start: 2025,
        end: null,
        sources: ['https://www.theindustry.fashion/east-london-talent-aaron-esh-joins-allsaints-as-chief-creative-officer/', 'https://www.vogue.com/article/can-aaron-esh-make-allsaints-cool-again'],
      },
    ],
    notes: 'Continues his independent namesake label, founded in 2022; it is not yet in this dataset.',
  },
  stephaneAshpool: {
    name: 'Stéphane Ashpool',
    career: [
      {
        house: 'pigalleParis',
        role: 'Founder',
        roleDetail: 'Founder and designer',
        start: 2008,
        sources: ['https://andam.fr/en/laureats/stephane-ashpool/'],
      },
    ],
    notes: 'Winner of the 2015 ANDAM Grand Prix; his mentorship through Chanel is distinct from employment at Chanel.',
  },
  marcBuchanan: {
    name: 'Marc Buchanan',
    career: [
      {
        house: 'pellePelle',
        role: 'Founder',
        roleDetail: 'Founder and designer',
        start: 1978,
        sources: ['https://www.accessnewswire.com/newsroom/en/computers-technology-and-internet/pelle-pelles-return-to-project-show-celebrating-46-years-of-leathe-835626'],
      },
    ],
  },
  nasirMazhar: {
    name: 'Nasir Mazhar',
    career: [
      {
        house: 'nasirMazhar',
        role: 'Founder',
        roleDetail: 'Founder and designer',
        start: 2008,
        sources: ['https://www.eno.org/people/nasir-mazhar-2/', 'https://www.dazeddigital.com/fashion/article/29074/1/nasir-mazhar-just-don-t-call-it-streetwear'],
      },
    ],
    notes: 'A former hairstylist, he first presented hats in 2006 and expanded into full ready-to-wear in 2013. Later opened Fantastic Toiles. Individual headwear collaborations and stage commissions are not employment tenures.',
    sources: ['https://www.eno.org/people/nasir-mazhar-2/', 'https://i-d.co/article/nasir-mazhar-london-fashion-fanastic-toiles-interview/'],
  },
  ciesay: {
    name: 'Ciesay',
    career: [
      {
        house: 'placesPlusFaces',
        role: 'Founder',
        roleDetail: 'Co-founder and photographer',
        start: 2013,
        sources: ['https://www.placesplusfaces.com/pages/about-us', 'https://thehundreds.com/blogs/content/places-plus-faces-capturing-moments'],
      },
    ],
  },
  soulz: {
    name: 'Soulz',
    career: [
      {
        house: 'placesPlusFaces',
        role: 'Founder',
        roleDetail: 'Co-founder and photographer',
        start: 2013,
        sources: ['https://www.placesplusfaces.com/pages/about-us', 'https://thehundreds.com/blogs/content/places-plus-faces-capturing-moments'],
      },
    ],
  },
  tylerTheCreator: {
    name: 'Tyler, the Creator',
    career: [
      {
        house: 'golfWang',
        role: 'Founder',
        roleDetail: 'Founder and designer',
        start: 2011,
        sources: ['https://www.vogue.com/article/tyler-the-creator-golf-wang-fall-collection'],
      },
    ],
    notes: 'Also established the distinct le FLEUR label, which is not yet in this dataset.',
  },
  kevinPoon: {
    name: 'Kevin Poon',
    career: [
      {
        house: 'clot',
        role: 'Founder',
        roleDetail: 'Co-founder',
        start: 2003,
        sources: ['https://www.tatlerasia.com/the-scene/people-parties/kevin-poon-on-the-business-of-being-cool'],
      },
    ],
  },
  billyIp: {
    name: 'Billy Ip',
    career: [
      {
        house: 'clot',
        role: 'Founder',
        roleDetail: 'Founding partner',
        sources: ['https://www.beinghunted.com/v51/features/2006/12_edison_chen_clot/edison_chen_clot.html'],
      },
    ],
  },
  sofiaPrantera: {
    name: 'Sofia Prantera',
    career: [
      {
        house: 'aries',
        role: 'Founder',
        roleDetail: 'Co-founder',
        start: 2010,
        sources: ['https://slamjam.com/en-row/collections/aries-men'],
      },
      {
        house: 'aries',
        role: 'Creative Director',
        end: null,
        notes: 'Creative-director title confirmed by the current official profile; exact appointment year is unconfirmed.',
        sources: ['https://www.ariesarise.com/pages/about-us'],
      },
    ],
    notes: 'Previously worked on Holmes and co-founded Silas; neither label is currently in this dataset.',
  },
  fergusPurcell: {
    name: 'Fergus Purcell (Fergadelic)',
    career: [
      {
        house: 'aries',
        role: 'Founder',
        roleDetail: 'Co-founder and graphic designer',
        start: 2010,
        sources: ['https://slamjam.com/en-row/collections/aries-men', 'https://www.thefader.com/2015/09/03/fergus-purcell-palace-aries-interview'],
      },
      {
        house: 'palace',
        role: 'Other',
        roleDetail: 'Graphic designer',
        notes: 'His 2015 interview discusses continuing work across the brand’s graphics and clothing, beyond creating its Tri-Ferg logo. Exact tenure dates are unconfirmed.',
        sources: ['https://www.thefader.com/2015/09/03/fergus-purcell-palace-aries-interview'],
      },
    ],
    notes: 'Also worked on graphics for Marc by Marc Jacobs and earlier labels including Silas; exact dates and scope of those roles remain unconfirmed.',
  },
  thugMin: {
    name: 'Thug Min (Yeong Min Cho)',
    career: [
      {
        house: 'thugClub',
        role: 'Founder',
        roleDetail: 'Founder and designer',
        start: 2018,
        sources: ['https://www.endclothing.com/en-au/collections/thug-club'],
      },
    ],
    notes: 'Also romanized Young-Min Cho. Stepped back from his representative role in 2025; the end of his creative role is unconfirmed.',
  },
  jiyoolKwon: {
    name: 'Jiyool Kwon',
    career: [
      {
        house: 'thugClub',
        role: 'Head Designer',
        roleDetail: 'Design director',
        start: 2021,
        sources: ['https://www.endclothing.com/en-au/collections/thug-club'],
      },
    ],
    notes: 'Also written Kwon Jiyool or Ji-Yool Kwon. Exact end date is unconfirmed.',
  },
  songZio: {
    name: 'Song Zio',
    career: [
      {
        house: 'songzio',
        role: 'Founder',
        roleDetail: 'Founder and designer',
        start: 1993,
        sources: ['https://www.ajupress.com/view/20260403091730400'],
      },
    ],
    notes: 'Also styled Zio Song. Father of creative director Jay Song.',
  },
  jaySong: {
    name: 'Jay Song (Jay Songzio)',
    career: [
      {
        house: 'songzio',
        role: 'Creative Director',
        end: null,
        notes: 'Current creative direction confirmed in 2026. Reports differ on when his creative remit began; appointment year remains unconfirmed.',
        sources: ['https://www.ajupress.com/view/20260403091730400', 'https://www.fhcm.paris/en/news/songzio-hits-new-high-notes-in-paris-and-abroad'],
      },
    ],
    notes: 'Also known as Song Jae-woo. Son of founder Song Zio; his creative role is distinct from his business leadership.',
  },
  choGiSeok: {
    name: 'Cho Gi-Seok',
    career: [
      {
        house: 'kusikohc',
        role: 'Founder',
        roleDetail: 'Founder and creative direction',
        start: 2016,
        sources: ['https://1granary.com/designers-3/kusikohc-the-defining-moment-of-finding-a-business-partner', 'https://www.ssense.com/en-nl/editorial/fashion/kusikohc-cho-gi-seok-interview-korean-fashion'],
      },
    ],
    notes: 'Photographer, artist and set designer. His commercial photography for other houses does not establish employment at those houses.',
  },
  jadenCho: {
    name: 'Jaden Cho',
    career: [
      {
        house: 'kusikohc',
        role: 'Other',
        roleDetail: 'Early design team',
        start: 2016,
        notes: 'Cho Gi-Seok identifies Jaden as helping with the first season; exact title and departure date are unconfirmed.',
        sources: ['https://1granary.com/designers-3/kusikohc-the-defining-moment-of-finding-a-business-partner'],
      },
    ],
    notes: 'Later established his own label, which is not yet in this dataset.',
  },
  doheeKim: {
    name: 'Dohee Kim',
    career: [
      {
        house: 'xlim',
        role: 'Founder',
        roleDetail: 'Founder and creative director',
        start: 2021,
        end: null,
        sources: ['https://hypebeast.com/2026/1/essentials-xlim-founder-dohee-kim-interview', 'https://www.ssense.com/en-ca/editorial/music/xlim-dean-jey-the-creative-triangle-shaping-fashion-and-sound-in-korea'],
      },
    ],
    notes: 'Also written Kim Dohee or Do Hee Kim. Previously styled musicians including DEAN, Kid Milli and Colde; those artist relationships are distinct from employment at fashion houses.',
  },
  hankookKim: {
    name: 'Hankook Kim',
    career: [
      {
        house: 'gentleMonster',
        role: 'Founder',
        roleDetail: 'Co-founder and creative lead',
        start: 2011,
        notes: 'The founders’ investment announcement identifies Kim as driving the creative side of the business; this does not establish a formal creative-director title or exact end date.',
        sources: ['https://www.lcatterton.com/pdf/2017-LCAsia-GentleMonster.pdf'],
      },
    ],
  },
  jayOh: {
    name: 'Jay Oh',
    career: [
      {
        house: 'gentleMonster',
        role: 'Founder',
        roleDetail: 'Co-founder — business development',
        start: 2011,
        notes: 'Identified as a co-founder providing business expertise, separately from Kim’s creative remit. Exact departure date is unconfirmed.',
        sources: ['https://www.lcatterton.com/pdf/2017-LCAsia-GentleMonster.pdf'],
      },
    ],
  },
  jonasBevacqua: {
    name: 'Jonas Bevacqua',
    died: 2011,
    career: [
      {
        house: 'lrg',
        role: 'Founder',
        roleDetail: 'Co-founder and designer',
        start: 1999,
        end: 2011,
        sources: ['https://l-r-g.com/pages/about-us', 'https://shop-eat-surf-outdoor.com/news/2011-05-sheriff-confirms-bevacqua-death/31474/'],
      },
    ],
  },
  robertWright: {
    name: 'Robert Wright',
    career: [
      {
        house: 'oneill',
        role: 'Other',
        sources: ['https://www.undiscoveredsf.com/blog/filipinos-in-streetwear-az-playbook'],
        roleDetail: 'Design work',
      },
      {
        house: 'quiksilver',
        role: 'Other',
        roleDetail: 'Design work',
        notes: 'Worked in surf apparel before founding LRG. Exact title and tenure dates are unconfirmed.',
        sources: ['https://www.undiscoveredsf.com/blog/filipinos-in-streetwear-az-playbook'],
      },
      {
        house: 'lrg',
        role: 'Founder',
        roleDetail: 'Co-founder and designer',
        start: 1999,
        sources: ['https://l-r-g.com/pages/about-us'],
      },
    ],
    notes: 'Also worked with Katin before LRG; that label is not currently in this dataset.',
    sources: ['https://www.undiscoveredsf.com/blog/filipinos-in-streetwear-az-playbook'],
  },
  megaYabut: {
    name: 'Michael “Mega” Yabut',
    career: [
      {
        house: 'huf',
        role: 'Other',
        roleDetail: 'Retail store manager',
        notes: 'Worked at HUF before and during Black Scale’s early years; departure date is unconfirmed.',
        sources: ['https://www.hufworldwide.jp/blogs/what/20-years-of-huf-hardcover-book-interviews-3'],
      },
      {
        house: 'blackScale',
        role: 'Founder',
        roleDetail: 'Co-founder and designer',
        start: 2007,
        sources: ['https://www.hufworldwide.jp/blogs/what/20-years-of-huf-hardcover-book-interviews-3'],
      },
      {
        house: 'blackScale',
        role: 'Creative Director',
        notes: 'Describes moving into a dedicated creative-director role in his interview with The Hundreds; exact appointment year is unconfirmed.',
        sources: ['https://thehundreds.com/blogs/content/sic-transit-gloria-mundi-an-interview-with-mega-of-black-scale'],
      },
    ],
  },
  alfredDeTagle: {
    name: 'Alfred De Tagle',
    career: [
      {
        house: 'blackScale',
        role: 'Founder',
        roleDetail: 'Co-founder and designer',
        start: 2007,
        sources: ['https://www.hufworldwide.jp/blogs/what/20-years-of-huf-hardcover-book-interviews-3'],
      },
      {
        house: 'blackScale',
        role: 'Other',
        roleDetail: 'Head of graphics',
        notes: 'Mega identifies De Tagle as overseeing graphics; exact tenure dates are unconfirmed.',
        sources: ['https://thehundreds.com/blogs/content/sic-transit-gloria-mundi-an-interview-with-mega-of-black-scale'],
      },
    ],
  },
  robCristofaro: {
    name: 'Rob Cristofaro',
    career: [
      {
        house: 'alife',
        role: 'Founder',
        roleDetail: 'Co-founder and creative direction',
        start: 1999,
        sources: ['https://hypebeast.com/2019/10/alife-rob-cristafaro-treis-hill-interview-business-of-hype-jeffstaple-episode-58', 'https://alifenewyork.com/pages/about'],
      },
    ],
  },
  arnaudDelecolle: {
    name: 'Arnaud Delecolle',
    career: [
      {
        house: 'alife',
        role: 'Founder',
        roleDetail: 'Co-founder',
        start: 1999,
        sources: ['https://hypebeast.com/2019/10/alife-rob-cristafaro-treis-hill-interview-business-of-hype-jeffstaple-episode-58', 'https://alifenewyork.com/pages/about'],
      },
    ],
  },
  tonyArcabascio: {
    name: 'Tony Arcabascio',
    career: [
      {
        house: 'alife',
        role: 'Founder',
        roleDetail: 'Co-founder',
        start: 1999,
        sources: ['https://hypebeast.com/2019/10/alife-rob-cristafaro-treis-hill-interview-business-of-hype-jeffstaple-episode-58', 'https://alifenewyork.com/pages/about'],
      },
    ],
  },
  tammyBrainard: {
    name: 'Tammy Brainard',
    career: [
      {
        house: 'alife',
        role: 'Founder',
        roleDetail: 'Co-founder',
        start: 1999,
        sources: ['https://hypebeast.com/2019/10/alife-rob-cristafaro-treis-hill-interview-business-of-hype-jeffstaple-episode-58', 'https://alifenewyork.com/pages/about'],
      },
    ],
  },
  eliBonerz: {
    name: 'Eli Bonerz',
    career: [
      {
        house: 'xlarge',
        role: 'Founder',
        roleDetail: 'Co-founder',
        start: 1991,
        sources: ['https://xlarge.com/pages/our-story'],
      },
    ],
  },
  adamSilverman: {
    name: 'Adam Silverman',
    career: [
      {
        house: 'xlarge',
        role: 'Founder',
        roleDetail: 'Co-founder',
        start: 1991,
        sources: ['https://xlarge.com/pages/our-story'],
      },
    ],
  },
  paulRodriguez: {
    name: 'Paul Rodriguez',
    career: [
      {
        house: 'primitive',
        role: 'Founder',
        roleDetail: 'Co-founder — retail business and skateboarding company',
        start: 2008,
        sources: ['https://hypebeast.com/2010/5/primitive-essentials', 'https://vidiq.com/youtube-stats/channel/@primitiveskateboarding/about/'],
      },
    ],
    notes: 'Co-founded the original boutique in 2008 and the skateboarding company in 2014. Skate-team sponsorships are separate from creative employment.',
  },
  andyNetkin: {
    name: 'Andy Netkin',
    career: [
      {
        house: 'primitive',
        role: 'Founder',
        roleDetail: 'Co-founder',
        start: 2008,
        sources: ['https://hypebeast.com/2010/5/primitive-essentials', 'https://trimarkgroupholdings.com/portfolio/primitive/'],
      },
    ],
  },
  jubalJones: {
    name: 'Jubal Jones',
    career: [
      {
        house: 'primitive',
        role: 'Founder',
        roleDetail: 'Founding partner',
        start: 2008,
        sources: ['https://trimarkgroupholdings.com/portfolio/primitive/', 'https://hypebeast.com/2010/5/primitive-essentials'],
      },
      {
        house: 'primitive',
        role: 'Creative Director',
        notes: 'Identified as creative director and partner by the brand’s retail distributor. Exact appointment and end dates are unconfirmed.',
        sources: ['https://trimarkgroupholdings.com/portfolio/primitive/'],
      },
    ],
  },
  heathBrinkley: {
    name: 'Heath Brinkley',
    career: [
      {
        house: 'primitive',
        role: 'Founder',
        roleDetail: 'Co-founder — Primitive Skateboarding',
        start: 2014,
        notes: 'The company’s channel description dates the skateboarding company to 2014, separately from the original retail store.',
        sources: ['https://vidiq.com/youtube-stats/channel/@primitiveskateboarding/about/'],
      },
    ],
  },
  micahBelamarich: {
    name: 'Micah Belamarich',
    career: [
      {
        house: 'onlyNy',
        role: 'Founder',
        roleDetail: 'Co-founder and designer',
        start: 2007,
        notes: 'The project began at the end of 2006; first clothing released in 2007, the official founding year.',
        sources: ['https://hypebeast.com/2023/12/only-ny-new-york-city-parks-collab-collection-interview', 'https://onlyny.com/pages/about-us'],
      },
    ],
  },
  julianGoldstein: {
    name: 'Julian Goldstein',
    career: [
      {
        house: 'onlyNy',
        role: 'Founder',
        roleDetail: 'Co-founder',
        start: 2007,
        notes: 'The project began at the end of 2006; first clothing released in 2007, the official founding year.',
        sources: ['https://hypebeast.com/2023/12/only-ny-new-york-city-parks-collab-collection-interview', 'https://onlyny.com/pages/about-us'],
      },
    ],
  },
  lukasWitek: {
    name: 'Lukas Witek',
    career: [
      {
        house: 'onlyNy',
        role: 'Other',
        roleDetail: 'Designer',
        notes: 'Identified as an in-house designer in a 2017 interview. Exact start and end dates are unconfirmed.',
        sources: ['https://www.glossy.co/fashion/new-york-magazine-rolls-out-apparel-line/'],
      },
    ],
  },
  shaunNeff: {
    name: 'Shaun Neff',
    career: [
      {
        house: 'neff',
        role: 'Founder',
        roleDetail: 'Co-founder and creative development',
        start: 2002,
        sources: ['https://neffheadwear.com/pages/old-about', 'https://shop-eat-surf-outdoor.com/news/2012-07-photos-wrap-from-shaun-neff-executive-roundtable/32706/'],
      },
    ],
  },
  joeNeff: {
    name: 'Joe Neff',
    career: [
      {
        house: 'neff',
        role: 'Founder',
        roleDetail: 'Co-founder — business support',
        start: 2002,
        sources: ['https://neffheadwear.com/pages/old-about', 'https://shop-eat-surf-outdoor.com/news/2012-07-photos-wrap-from-shaun-neff-executive-roundtable/32706/'],
      },
    ],
    notes: 'Shaun Neff’s father; his advisory and business role was distinct from Shaun’s creative work.',
  },
  tonyMagnusson: {
    name: 'Tony Magnusson',
    career: [
      {
        house: 'osiris',
        role: 'Founder',
        roleDetail: 'Co-founder',
        start: 1996,
        sources: ['https://news.cision.com/osiris-shoes/about'],
      },
    ],
  },
  tonyChen: {
    name: 'Tony Chen',
    career: [
      {
        house: 'osiris',
        role: 'Founder',
        roleDetail: 'Co-founder',
        start: 1996,
        sources: ['https://news.cision.com/osiris-shoes/about'],
      },
    ],
  },
  dougWeston: {
    name: 'Doug Weston',
    career: [
      {
        house: 'osiris',
        role: 'Founder',
        roleDetail: 'Co-founder',
        start: 1996,
        sources: ['https://news.cision.com/osiris-shoes/about'],
      },
    ],
  },
  brianReid: {
    name: 'Brian Reid',
    career: [
      {
        house: 'osiris',
        role: 'Founder',
        roleDetail: 'Co-founder and footwear designer',
        start: 1996,
        sources: ['https://news.cision.com/osiris-shoes/about'],
      },
      {
        house: 'osiris',
        role: 'Creative Director',
        end: null,
        notes: 'Creative-director title and continued creative involvement confirmed in 2026 collection interviews; exact appointment year is unconfirmed.',
        sources: ['https://www.boardsportsource.com/osiris-skate-footwear-s-s-2026-preview/', 'https://www.boardsportsource.com/osiris-skate-footwear-f-w-2026-preview/'],
      },
    ],
  },
  ericFoss: {
    name: 'Eric Foss',
    career: [
      {
        house: 'affliction',
        role: 'Founder',
        roleDetail: 'Co-founder and designer',
        start: 2005,
        sources: ['https://www.fibre2fashion.com/news/fashion-news/newsdetails.aspx?news_id=3997'],
      },
    ],
  },
  cliftonChason: {
    name: 'Clifton Chason',
    career: [
      {
        house: 'affliction',
        role: 'Founder',
        roleDetail: 'Co-founder and designer',
        start: 2005,
        sources: ['https://www.fibre2fashion.com/news/fashion-news/newsdetails.aspx?news_id=3997'],
      },
    ],
    notes: 'Also spelled Clifton Chasen in some reporting; the launch announcement uses Chason.',
  },
  toddBeard: {
    name: 'Todd Beard',
    career: [
      {
        house: 'affliction',
        role: 'Founder',
        roleDetail: 'Co-founder',
        start: 2005,
        sources: ['https://www.fightmagazine.com/2009/08/affliction-live-fast-die-young/'],
      },
    ],
  },
  courtneyDubar: {
    name: 'Courtney Dubar',
    career: [
      {
        house: 'affliction',
        role: 'Founder',
        roleDetail: 'Co-founder',
        start: 2005,
        sources: ['https://www.ocbj.com/finance/affliction-exec-buys-observatory-theater-santa-ana/'],
      },
    ],
  },
  faustoVitello: {
    name: 'Fausto Vitello',
    died: 2006,
    career: [
      {
        house: 'thrasher',
        role: 'Founder',
        roleDetail: 'Co-founder and publisher',
        start: 1981,
        end: 2006,
        sources: ['https://sfplanning.s3.amazonaws.com/commissions/hpcpackets/LBR%20Sept%2020.pdf', 'https://skateboardinghalloffame.org/shof-2014/fausto-vitello-2014/'],
      },
    ],
    notes: 'Also helped develop Independent Trucks and the Deluxe skateboarding business; those corporate relationships do not establish clothing design tenures.',
  },
  ericSwenson: {
    name: 'Eric Swenson',
    died: 2011,
    career: [
      {
        house: 'thrasher',
        role: 'Founder',
        roleDetail: 'Co-founder and publisher',
        start: 1981,
        end: 2011,
        sources: ['https://sfplanning.s3.amazonaws.com/commissions/hpcpackets/LBR%20Sept%2020.pdf', 'https://skateboardinghalloffame.org/shof-2014/fausto-vitello-2014/'],
      },
    ],
  },
  kevinThatcher: {
    name: 'Kevin Thatcher',
    career: [
      {
        house: 'thrasher',
        role: 'Other',
        roleDetail: 'Founding editor',
        start: 1981,
        notes: 'Magazine editorial role; exact departure year is unconfirmed. This is not a clothing creative-director appointment.',
        sources: ['https://vintageskateboardmagazines.com/Thrasher%28USA%29.html'],
      },
    ],
  },
  neekLurk: {
    name: 'Neek Lurk',
    career: [
      {
        house: 'stussy',
        role: 'Other',
        roleDetail: 'Social media and brand marketing',
        notes: 'Worked at Stüssy before and during the launch of ASSC; exact tenure dates are unconfirmed.',
        sources: ['https://feature.com/blogs/feature-sneaker-boutique/behind-the-brand-anti-social-social-club', 'https://www.highsnobiety.com/tag/anti-social-social-club/'],
      },
      {
        house: 'antiSocialSocialClub',
        role: 'Founder',
        roleDetail: 'Founder and designer',
        start: 2015,
        end: 2022,
        sources: ['https://www.highsnobiety.com/tag/anti-social-social-club/', 'https://businessoffashion-businessoffashion-prod.web.arc-cdn.net/articles/luxury/anti-social-social-club-acquired-by-marquee-brands/'],
      },
    ],
    notes: 'The art project is dated to 2014 by the current owner, separately from the clothing label’s 2015 launch.',
  },
  christianAudigier: {
    name: 'Christian Audigier',
    died: 2015,
    career: [
      {
        house: 'diesel',
        role: 'Other',
        roleDetail: 'Designer',
        notes: 'Earlier design work described in his 2010 interview; exact dates are unconfirmed.',
        sources: ['https://ibiza-style.com/en/christian-audigier-in-ibiza/'],
      },
      {
        house: 'lee',
        role: 'Other',
        roleDetail: 'Designer',
        notes: 'Earlier design work; exact dates are unconfirmed.',
        sources: ['https://ibiza-style.com/en/christian-audigier-in-ibiza/'],
      },
      {
        house: 'levis',
        role: 'Other',
        roleDetail: 'Designer',
        notes: 'Earlier design work; exact dates are unconfirmed.',
        sources: ['https://ibiza-style.com/en/christian-audigier-in-ibiza/'],
      },
      {
        house: 'edHardy',
        role: 'Founder',
        roleDetail: 'Fashion-brand founder and designer',
        start: 2004,
        end: 2011,
        sources: ['https://ttabvue.uspto.gov/ttabvue/ttabvue-91230940-OPP-1.pdf', 'https://apparelnews.media.clients.ellingtoncms.com/news/documents/2015/07/16/CaliforniaApparelNewsPrintEdition_071715.pdf'],
      },
    ],
    notes: 'Previously chief designer at Von Dutch, which is not yet in this dataset. Developed the Ed Hardy fashion brand around licensed tattoo artwork by Don Ed Hardy.',
  },
  donEdHardy: {
    name: 'Don Ed Hardy',
    career: [
      {
        house: 'edHardy',
        role: 'Other',
        roleDetail: 'Namesake artist and artwork licensor',
        notes: 'Licensed tattoo artwork supplied the brand’s visual foundation; this is distinct from an in-house clothing designer appointment.',
        sources: ['https://edhardyoriginals.com/pages/about-us', 'https://ttabvue.uspto.gov/ttabvue/ttabvue-91230940-OPP-1.pdf'],
      },
    ],
  },
  kevinChristiana: {
    name: 'Kevin Christiana',
    career: [
      {
        house: 'edHardy',
        role: 'Creative Director',
        notes: 'Identified as Ed Hardy’s creative director in an October 2025 brand-owner announcement. Exact appointment and end dates are unconfirmed; the single collection discussed there is not a separate tenure.',
        sources: ['https://iconixbrand.com/ed-hardy-x-mgk-debut-limited-edition-collaboration-at-complexcon/'],
      },
    ],
  },
  geoffreyBSmallDesigner: {
    name: 'Geoffrey B. Small',
    career: [
      {
        house: 'geoffreyBSmall',
        role: 'Founder',
        start: 1979,
        sources: ['https://www.linkedin.com/company/geoffrey-b.-small-made-in-italy-s.r.l.'],
      },
    ],
    sources: ['https://www.linkedin.com/company/geoffrey-b.-small-made-in-italy-s.r.l.'],
  },
  tomoakiOkaniwa: {
    name: 'Tomoaki Okaniwa',
    career: [
      {
        house: 'theViridiAnne',
        role: 'Founder',
        start: 2001,
        sources: ['https://thecotton.jp/pages/okaniwa'],
      },
    ],
    sources: ['https://thecotton.jp/pages/okaniwa'],
  },
  soheePark: {
    name: 'Sohee Park',
    career: [
      {
        house: 'missSohee',
        role: 'Founder',
        start: 2020,
        sources: ['https://missohee.com/about'],
        roleDetail: 'Founder, creative director',
        end: null,
      },
      {
        house: 'marcJacobs',
        role: 'Other',
        sources: ['https://www.papermag.com/sohee-park-designer-interview'],
        roleDetail: 'Design intern',
      },
      {
        house: 'mollyGoddard',
        role: 'Other',
        sources: ['https://www.papermag.com/sohee-park-designer-interview'],
        roleDetail: 'Design intern',
      },
    ],
    sources: ['https://missohee.com/about'],
  },
  mohammedAshi: {
    name: 'Mohammed Ashi',
    career: [
      {
        house: 'ashiStudio',
        role: 'Founder',
        start: 2007,
        sources: ['https://www.fhcm.paris/en/house/ashi-studio'],
      },
      {
        house: 'givenchy',
        role: 'Other',
        sources: ['https://www.fhcm.paris/en/news/ashi-studio-mohammed-ashi'],
        roleDetail: 'Couture design experience',
      },
      {
        house: 'elieSaab',
        role: 'Other',
        sources: ['https://www.fhcm.paris/en/news/ashi-studio-mohammed-ashi'],
        roleDetail: 'Couture design experience',
      },
    ],
    sources: ['https://www.fhcm.paris/en/house/ashi-studio'],
  },
  rahulMishraDesigner: {
    name: 'Rahul Mishra',
    career: [
      {
        house: 'rahulMishra',
        role: 'Founder',
        start: 2008,
        sources: ['https://www.manifestmagazine.in/fashion-beauty/features/in-conversation-with-rahul-mishra-and-divya-mishra'],
      },
    ],
    sources: ['https://www.manifestmagazine.in/fashion-beauty/features/in-conversation-with-rahul-mishra-and-divya-mishra'],
  },
  divyaMishra: {
    name: 'Divya Mishra',
    career: [
      {
        house: 'rahulMishra',
        role: 'Founder',
        start: 2008,
        sources: ['https://www.manifestmagazine.in/fashion-beauty/features/in-conversation-with-rahul-mishra-and-divya-mishra'],
      },
    ],
    sources: ['https://www.manifestmagazine.in/fashion-beauty/features/in-conversation-with-rahul-mishra-and-divya-mishra'],
  },
  sofieDHooreDesigner: {
    name: 'Sofie D’Hoore',
    career: [
      {
        house: 'sofieDHoore',
        role: 'Founder',
        start: 1992,
        sources: ['https://ingridvanrenterghem.be/ingridnederlands/sofiedhoorebio.php'],
        roleDetail: 'Co-founder, designer',
      },
    ],
    sources: ['https://ingridvanrenterghem.be/ingridnederlands/sofiedhoorebio.php'],
  },
  chantalSpaas: {
    name: 'Chantal Spaas',
    career: [
      {
        house: 'sofieDHoore',
        role: 'Founder',
        start: 1992,
        sources: ['https://ingridvanrenterghem.be/ingridnederlands/sofiedhoorebio.php'],
        roleDetail: 'Co-founder and business partner, Fashion Ink',
      },
    ],
    sources: ['https://ingridvanrenterghem.be/ingridnederlands/sofiedhoorebio.php'],
  },
  garethCasey: {
    name: 'Gareth Casey',
    career: [
      {
        house: 'caseyCasey',
        role: 'Founder',
        start: 2008,
        sources: ['https://caseycasey.eu/pages/about-gareth'],
      },
    ],
    sources: ['https://caseycasey.eu/pages/about-gareth'],
    notes: 'Previously co-founded Casey Vidalenc with Philippe Vidalenc in 1997; Casey Casey identifies its own beginning as 2008.',
  },
  eliBelovitch: {
    name: 'Eli Belovitch',
    career: [
      {
        house: 'belstaff',
        role: 'Founder',
        start: 1924,
        sources: ['https://belstaff.com/pages/about-us'],
      },
    ],
    sources: ['https://belstaff.com/pages/about-us'],
  },
  harryGrosberg: {
    name: 'Harry Grosberg',
    career: [
      {
        house: 'belstaff',
        role: 'Founder',
        start: 1924,
        sources: ['https://belstaff.com/pages/about-us'],
      },
    ],
    sources: ['https://belstaff.com/pages/about-us'],
  },
  charlesMacintosh: {
    name: 'Charles Macintosh',
    career: [
      {
        house: 'mackintosh',
        role: 'Founder',
        start: 1823,
        sources: ['https://www.mackintosh.com/en-intl/pages/about-us'],
      },
    ],
    sources: ['https://www.mackintosh.com/en-intl/pages/about-us'],
  },
  johnLobbFounder: {
    name: 'John Lobb',
    career: [
      {
        house: 'johnLobb',
        role: 'Founder',
        start: 1866,
        sources: ['https://www.comitecolbert.com/en/members/john-lobb/'],
      },
    ],
    sources: ['https://www.comitecolbert.com/en/members/john-lobb/'],
  },
  johnEmary: {
    name: 'John Emary',
    career: [
      {
        house: 'aquascutum',
        role: 'Founder',
        start: 1851,
        sources: ['https://aquascutum-active.com/pages/about'],
      },
    ],
    sources: ['https://aquascutum-active.com/pages/about'],
  },
  michaelDrake: {
    name: 'Michael Drake',
    career: [
      {
        house: 'aquascutum',
        role: 'Menswear Director',
        sources: ['https://www.permanentstyle.com/2012/03/the-history-of-drakes.html'],
        roleDetail: 'Head of menswear design',
      },
      {
        house: 'drakes',
        role: 'Founder',
        start: 1977,
        sources: ['https://www.drakes.com/pages/about'],
      },
    ],
    sources: ['https://www.drakes.com/pages/about'],
  },
  haroldMorris: {
    name: 'Harold Morris',
    career: [
      {
        house: 'gloverall',
        role: 'Founder',
        start: 1951,
        sources: ['https://www.gloverall.com/pages/heritage'],
      },
    ],
    sources: ['https://www.gloverall.com/pages/heritage'],
  },
  fredaMorris: {
    name: 'Freda Morris',
    career: [
      {
        house: 'gloverall',
        role: 'Founder',
        start: 1951,
        sources: ['https://www.gloverall.com/pages/heritage'],
      },
    ],
    sources: ['https://www.gloverall.com/pages/heritage'],
  },
  thomasHill: {
    name: 'Thomas Hill',
    career: [
      {
        house: 'sunspel',
        role: 'Founder',
        start: 1860,
        sources: ['https://www.sunspel.com/en-eu/pages/our-history'],
      },
    ],
    sources: ['https://www.sunspel.com/en-eu/pages/our-history'],
  },
  cpBishop: {
    name: 'C.P. Bishop',
    career: [
      {
        house: 'pendleton',
        role: 'Founder',
        start: 1909,
        sources: ['https://www.pendleton-usa.com/our-story/'],
      },
    ],
    sources: ['https://www.pendleton-usa.com/our-story/'],
  },
  josephTricker: {
    name: 'Joseph Tricker',
    career: [
      {
        house: 'trickers',
        role: 'Founder',
        start: 1829,
        sources: ['https://trickers.com/pages/history'],
      },
    ],
    sources: ['https://trickers.com/pages/history'],
  },
  thomasFox: {
    name: 'Thomas Fox',
    career: [
      {
        house: 'foxBrothers',
        role: 'Founder',
        start: 1772,
        sources: ['https://foxflannel.com/pages/heritage'],
      },
    ],
    sources: ['https://foxflannel.com/pages/heritage'],
  },
  thomasWere: {
    name: 'Thomas Were',
    career: [
      {
        house: 'foxBrothers',
        role: 'Founder',
        start: 1772,
        sources: ['https://foxflannel.com/pages/heritage'],
      },
    ],
    sources: ['https://foxflannel.com/pages/heritage'],
  },
  emileCamuset: {
    name: 'Émile Camuset',
    career: [
      {
        house: 'leCoqSportif',
        role: 'Founder',
        start: 1882,
        sources: ['https://www.lecoqsportif.com/en-us/pages/our-heritage'],
      },
    ],
    sources: ['https://www.lecoqsportif.com/en-us/pages/our-heritage'],
  },
  edouardBlanchard: {
    name: 'Édouard Blanchard',
    career: [
      {
        house: 'jmWeston',
        role: 'Founder',
        start: 1891,
        sources: ['https://limogeslefeucreatif.fr/ils-nous-font-rayonner/entreprises/jm-weston/'],
      },
    ],
    sources: ['https://limogeslefeucreatif.fr/ils-nous-font-rayonner/entreprises/jm-weston/'],
  },
  arthurCinader: {
    name: 'Arthur Cinader',
    career: [
      {
        house: 'jCrew',
        role: 'Founder',
        start: 1983,
        sources: ['https://www.vanityfair.com/style/2023/03/the-early-days-of-jcrew'],
      },
    ],
    sources: ['https://www.vanityfair.com/style/2023/03/the-early-days-of-jcrew'],
  },
  giuseppeMarenzi: {
    name: 'Giuseppe Marenzi',
    career: [
      {
        house: 'herno',
        role: 'Founder',
        start: 1948,
        sources: ['https://www.herno.com/en-gb/history'],
      },
    ],
    sources: ['https://www.herno.com/en-gb/history'],
  },
  alessandraDiana: {
    name: 'Alessandra Diana',
    career: [
      {
        house: 'herno',
        role: 'Founder',
        start: 1948,
        sources: ['https://www.herno.com/en-gb/history'],
      },
    ],
    sources: ['https://www.herno.com/en-gb/history'],
  },
  yasarCeviker: {
    name: 'Yasar Ceviker',
    career: [
      {
        house: 'aKindOfGuise',
        role: 'Founder',
        start: 2009,
        sources: ['https://akindofguise.com/pages/journey', 'https://www.curatedmenswear.com/brands/a-kind-of-guise/'],
      },
    ],
    sources: ['https://akindofguise.com/pages/journey', 'https://www.curatedmenswear.com/brands/a-kind-of-guise/'],
  },
  susiStreich: {
    name: 'Susi Streich',
    career: [
      {
        house: 'aKindOfGuise',
        role: 'Founder',
        start: 2009,
        sources: ['https://akindofguise.com/pages/journey', 'https://www.curatedmenswear.com/brands/a-kind-of-guise/'],
      },
    ],
    sources: ['https://akindofguise.com/pages/journey', 'https://www.curatedmenswear.com/brands/a-kind-of-guise/'],
  },
  alexanderStutterheim: {
    name: 'Alexander Stutterheim',
    career: [
      {
        house: 'stutterheim',
        role: 'Founder',
        start: 2010,
        sources: ['https://www.alexanderstutterheim.com/about'],
      },
    ],
    sources: ['https://www.alexanderstutterheim.com/about'],
  },
  sorenNielsenSkyt: {
    name: 'Søren Nielsen Skyt',
    career: [
      {
        house: 'snsHerning',
        role: 'Founder',
        start: 1931,
        sources: ['https://lex.dk/S.N.S._Herning'],
        end: 1972,
      },
    ],
    sources: ['https://lex.dk/S.N.S._Herning'],
    born: 1899,
    died: 1972,
  },
  clintonFilson: {
    name: 'Clinton C. Filson',
    career: [
      {
        house: 'filson',
        role: 'Founder',
        start: 1897,
        sources: ['https://www.filson.com/pages/about-us'],
      },
    ],
    sources: ['https://www.filson.com/pages/about-us'],
  },
  samuelSlater: {
    name: 'Samuel Slater',
    career: [
      {
        house: 'goldenBear',
        role: 'Founder',
        start: 1922,
        sources: ['https://www.sf.gov/sites/default/files/2024-11/item_3j._lbr-2016-17-016_golden_bear_sportswear.pdf'],
      },
    ],
    sources: ['https://www.sf.gov/sites/default/files/2024-11/item_3j._lbr-2016-17-016_golden_bear_sportswear.pdf'],
  },
  charlesBeckman: {
    name: 'Charles Beckman',
    career: [
      {
        house: 'redWing',
        role: 'Founder',
        start: 1905,
        sources: ['https://www.redwingshoeco.com/history'],
      },
    ],
    sources: ['https://www.redwingshoeco.com/history'],
  },
  johnShoemaker: {
    name: 'John Shoemaker',
    career: [
      {
        house: 'wesco',
        role: 'Founder',
        start: 1918,
        sources: ['https://www.stitchdown.com/brands/wesco-boots/wesco-boots-interview-history-custom-builds/'],
      },
    ],
    sources: ['https://www.stitchdown.com/brands/wesco-boots/wesco-boots-interview-history-custom-builds/'],
  },
  charlesDanner: {
    name: 'Charles Danner',
    career: [
      {
        house: 'danner',
        role: 'Founder',
        start: 1932,
        sources: ['https://copsproducts.com/wp-content/uploads/2023/10/Danner-SP24-Catalog-DIGITAL-Book-Optimized.pdf'],
      },
    ],
    sources: ['https://copsproducts.com/wp-content/uploads/2023/10/Danner-SP24-Catalog-DIGITAL-Book-Optimized.pdf'],
  },
  jbPiotrowski: {
    name: 'J.B. Piotrowski',
    career: [
      {
        house: 'chippewa',
        role: 'Founder',
        start: 1901,
        sources: ['https://www.chippewaboots.com/en/chippewa-corner/125-years-of-chippewa.html'],
      },
    ],
    sources: ['https://www.chippewaboots.com/en/chippewa-corner/125-years-of-chippewa.html'],
  },
  johnAndrejski: {
    name: 'John Andrejski',
    career: [
      {
        house: 'chippewa',
        role: 'Founder',
        start: 1901,
        sources: ['https://www.chippewaboots.com/en/chippewa-corner/125-years-of-chippewa.html'],
      },
    ],
    sources: ['https://www.chippewaboots.com/en/chippewa-corner/125-years-of-chippewa.html'],
  },
  charlesAlden: {
    name: 'Charles H. Alden',
    career: [
      {
        house: 'alden',
        role: 'Founder',
        start: 1884,
        sources: ['https://www.aldenshoe.com/DrawOnePage.aspx?PageID=2'],
        end: 1933,
      },
    ],
    sources: ['https://www.aldenshoe.com/DrawOnePage.aspx?PageID=2'],
  },
  johnRich: {
    name: 'John Rich',
    career: [
      {
        house: 'woolrich',
        role: 'Founder',
        start: 1830,
        sources: ['https://hl.com/about-us/transactions/woolrich-l-gam-basicnet/'],
      },
    ],
    sources: ['https://hl.com/about-us/transactions/woolrich-l-gam-basicnet/'],
  },
  leonLeonwoodBean: {
    name: 'Leon Leonwood Bean',
    career: [
      {
        house: 'llBean',
        role: 'Founder',
        start: 1912,
        sources: ['https://www.llbean.com/llb/shop/516918?page=company-history'],
      },
    ],
    sources: ['https://www.llbean.com/llb/shop/516918?page=company-history'],
  },
  williamPeterDehen: {
    name: 'William Peter Dehen',
    career: [
      {
        house: 'dehen1920',
        role: 'Founder',
        start: 1920,
        sources: ['https://dehen1920.com/blogs/journal/the-worlds-best-bathing-suit'],
      },
    ],
    sources: ['https://dehen1920.com/blogs/journal/the-worlds-best-bathing-suit'],
  },
  benjaminRussell: {
    name: 'Benjamin Russell',
    career: [
      {
        house: 'russellAthletic',
        role: 'Founder',
        start: 1902,
        sources: ['https://www.russellathletic.com/history'],
      },
    ],
    sources: ['https://www.russellathletic.com/history'],
  },
  ehrhardtKoch: {
    name: 'Ehrhardt Koch',
    career: [
      {
        house: 'newEra',
        role: 'Founder',
        start: 1920,
        sources: ['https://www.neweracap.com.sg/pages/history'],
      },
    ],
    sources: ['https://www.neweracap.com.sg/pages/history'],
  },
  frankMitchell: {
    name: 'Frank P. Mitchell',
    career: [
      {
        house: 'mitchellAndNess',
        role: 'Founder',
        start: 1904,
        sources: ['https://www.mitchellandness.co.nz/pages/about-us'],
      },
    ],
    sources: ['https://www.mitchellandness.co.nz/pages/about-us'],
  },
  charlesNess: {
    name: 'Charles M. Ness',
    career: [
      {
        house: 'mitchellAndNess',
        role: 'Founder',
        start: 1904,
        sources: ['https://www.mitchellandness.co.nz/pages/about-us'],
      },
    ],
    sources: ['https://www.mitchellandness.co.nz/pages/about-us'],
  },
  davidBeckerman: {
    name: 'David Beckerman',
    career: [
      {
        house: 'starter',
        role: 'Founder',
        start: 1971,
        sources: ['https://www.starter.com/pages/about-us'],
      },
    ],
    sources: ['https://www.starter.com/pages/about-us'],
  },
  benShermanFounder: {
    name: 'Ben Sherman',
    career: [
      {
        house: 'benSherman',
        role: 'Founder',
        start: 1963,
        sources: ['https://www.bensherman.co.uk/timeline'],
      },
    ],
    sources: ['https://www.bensherman.co.uk/timeline'],
    notes: 'Born Arthur Benjamin Sugarman; professionally known as Ben Sherman.',
  },
  laurentHompes: {
    name: 'Laurent Hompes',
    career: [
      {
        house: 'scotchAndSoda',
        role: 'Founder',
        start: 1985,
        sources: ['https://www.businessoffashion.com/articles/retail/fashion-brand-retailer-scotch-and-soda-next-chapter-under-new-owner-bluestar-alliance-ceo-interview/'],
      },
    ],
    sources: ['https://www.businessoffashion.com/articles/retail/fashion-brand-retailer-scotch-and-soda-next-chapter-under-new-owner-bluestar-alliance-ceo-interview/'],
  },
  michaelHill: {
    name: 'Michael Hill',
    career: [
      {
        house: 'drakes',
        role: 'Creative Director',
        sources: ['https://www.drakes.com/pages/about'],
        end: null,
      },
    ],
    notes: 'Lead designer and Michael Drake’s understudy before jointly acquiring Drake’s with Mark Cho in 2010. The exact creative-director appointment year is not confirmed.',
  },
  davidTelfer: {
    name: 'David Telfer',
    career: [
      {
        house: 'sunspel',
        role: 'Creative Director',
        sources: ['https://www.linkedin.com/posts/david-telfer-36080546_10-year-anniversary-at-sunspel-this-week-activity-7438501212469145600-pGD2'],
      },
      {
        house: 'sunspel',
        role: 'Other',
        sources: ['https://www.linkedin.com/posts/david-telfer-36080546_10-year-anniversary-at-sunspel-this-week-activity-7438501212469145600-pGD2'],
        start: 2016,
        roleDetail: 'Senior designer; subsequently design director',
      },
    ],
    notes: 'His 2026 account marks ten years at Sunspel. The dates of the separate title changes are not confirmed.',
  },
  paulaGerbase: {
    name: 'Paula Gerbase',
    career: [
      {
        house: 'johnLobb',
        role: 'Artistic Director',
        sources: ['https://www.fccihk.com/publications-news/news/n/news/john-lobb-opens-new-flagship-store-in-hong-kong.html', 'https://www.lemonde.fr/m-styles/article/2023/05/20/a-londres-le-studio-entre-herbes-et-briques-de-la-styliste-paula-gerbase_6174102_4497319.html'],
        start: 2014,
        end: 2020,
      },
    ],
    notes: 'Led John Lobb for six years, before developing her own studio and later joining Georg Jensen. Sources: https://www.marieclaire.com.au/fashion/georg-jensen-unveils-its-first-collection-under-paula-gerbase/.',
  },
  michelPerry: {
    name: 'Michel Perry',
    career: [
      {
        house: 'jmWeston',
        role: 'Artistic Director',
        sources: ['https://www.vogue.fr/vogue-hommes/mode/articles/olivier-saillard-nomination-directeur-artistique-maison-chaussures-j-m-weston/54322'],
        start: 2001,
        end: 2017,
      },
    ],
  },
  olivierSaillard: {
    name: 'Olivier Saillard',
    career: [
      {
        house: 'jmWeston',
        role: 'Artistic Director',
        sources: ['https://www.vogue.fr/vogue-hommes/mode/articles/olivier-saillard-nomination-directeur-artistique-maison-chaussures-j-m-weston/54322'],
        start: 2017,
        roleDetail: 'Artistic director, image and culture',
      },
    ],
    notes: 'Appointed in June 2017; his first work for the house was scheduled for early 2018. Previously directed the Palais Galliera fashion museum.',
  },
  martinCooper: {
    name: 'Martin Cooper',
    career: [
      {
        house: 'belstaff',
        role: 'Creative Director',
        sources: ['https://cfda.com/member/martin-cooper/'],
        roleDetail: 'Chief creative officer',
      },
      {
        house: 'burberry',
        role: 'Other',
        sources: ['https://cfda.com/member/martin-cooper/'],
        roleDetail: 'Vice president and design director, global outerwear',
      },
      {
        house: 'calvinKlein',
        role: 'Other',
        sources: ['https://cfda.com/member/martin-cooper/'],
        roleDetail: 'Women’s design studio',
      },
    ],
    notes: 'Subsequently led design at Lands’ End. Also designed licensed Calvin Klein and Perry Ellis coats at Fairbrooke Enterprises.',
  },
  delphineNinous: {
    name: 'Delphine Ninous',
    career: [
      {
        house: 'belstaff',
        role: 'Womenswear Director',
        sources: ['https://fashionunited.uk/v1/design/belstaff-taps-delphine-ninous-as-head-of-womens-design/201409047020'],
        start: 2014,
        end: 2016,
      },
      {
        house: 'belstaff',
        role: 'Creative Director',
        sources: ['https://fashionunited.com/executive/report/belstaff-appoints-delphine-ninous-as-its-creative-director/2016070111928', 'https://www.thembsgroup.co.uk/external/sean-lehnhardt-moore-named-as-belstaffs-new-creative-director/'],
        start: 2016,
        end: 2018,
      },
      {
        house: 'isabelMarant',
        role: 'Other',
        sources: ['https://fashionunited.uk/v1/design/belstaff-taps-delphine-ninous-as-head-of-womens-design/201409047020'],
        roleDetail: 'Design role',
      },
    ],
    notes: 'Previously design director at Paul & Joe, with design roles at Comptoir des Cotonniers, Diane von Furstenberg and Christian Lacroix.',
  },
  seanLehnhardtMoore: {
    name: 'Sean Lehnhardt-Moore',
    career: [
      {
        house: 'belstaff',
        role: 'Creative Director',
        sources: ['https://www.thembsgroup.co.uk/external/sean-lehnhardt-moore-named-as-belstaffs-new-creative-director/'],
        start: 2018,
      },
      {
        house: 'ralphLauren',
        role: 'Other',
        sources: ['https://www.modaes.com/global/companies/belstaff-continues-management-overhaul-and-hires-former-ralph-lauren-designer'],
        roleDetail: 'Design role',
      },
    ],
  },
  joannaSykes: {
    name: 'Joanna Sykes',
    career: [
      {
        house: 'aquascutum',
        role: 'Creative Director',
        sources: ['https://www.vogue.co.uk/article/aquascutum-new-designer-joanna-sykes', 'https://www.vogue.co.uk/article/joanna-sykes-leaves-aquascutum-new-design-director'],
        start: 2010,
        end: 2012,
      },
      {
        house: 'armani',
        role: 'Other',
        sources: ['https://www.vogue.co.uk/article/aquascutum-new-designer-joanna-sykes'],
        roleDetail: 'Designer',
      },
    ],
    notes: 'Departure announced June 2012: https://www.vogue.co.uk/article/joanna-sykes-leaves-aquascutum-new-design-director. Also designed for Alberta Ferretti, her own label and Matches’ Freda line.',
  },
  michaelHerz: {
    name: 'Michael Herz',
    career: [
      {
        house: 'aquascutum',
        role: 'Womenswear Director',
        sources: ['https://www.vogue.co.uk/article/michael-herz-and-graeme-fidler-leave-aquascutum'],
        start: 2000,
        end: 2010,
      },
      {
        house: 'bally',
        role: 'Co-Creative Director',
        sources: ['https://www.vogue.co.uk/article/aquascutum-new-designer-joanna-sykes'],
        start: 2010,
      },
    ],
  },
  graemeFidler: {
    name: 'Graeme Fidler',
    career: [
      {
        house: 'aquascutum',
        role: 'Menswear Director',
        sources: ['https://www.vogue.co.uk/article/michael-herz-and-graeme-fidler-leave-aquascutum'],
        start: 2002,
        end: 2010,
      },
      {
        house: 'bally',
        role: 'Co-Creative Director',
        sources: ['https://www.vogue.co.uk/article/aquascutum-new-designer-joanna-sykes'],
        start: 2010,
      },
    ],
  },
  emilyCinader: {
    name: 'Emily Cinader',
    career: [
      {
        house: 'jCrew',
        role: 'Other',
        sources: ['https://www.vanityfair.com/style/2023/03/the-early-days-of-jcrew'],
        start: 1983,
        roleDetail: 'Early product development and brand direction',
      },
    ],
    notes: 'Also known by her married name Emily Scott; daughter of founder Arthur Cinader.',
  },
  jennaLyons: {
    name: 'Jenna Lyons',
    career: [
      {
        house: 'jCrew',
        role: 'Other',
        sources: ['https://investors.jcrew.com/static-files/e35b1cfa-7c96-4865-bc39-4267aa71f69f'],
        start: 1990,
        end: 1999,
        roleDetail: 'Assistant designer, designer and design director',
      },
      {
        house: 'jCrew',
        role: 'Womenswear Director',
        sources: ['https://investors.jcrew.com/static-files/e35b1cfa-7c96-4865-bc39-4267aa71f69f'],
        start: 1999,
        end: 2007,
      },
      {
        house: 'jCrew',
        role: 'Creative Director',
        sources: ['https://investors.jcrew.com/static-files/e35b1cfa-7c96-4865-bc39-4267aa71f69f'],
        start: 2007,
        end: 2017,
        roleDetail: 'Creative director; later president and executive creative director',
      },
    ],
    notes: 'Her creative leadership ended in April 2017; she remained an adviser until December. Departure filing: https://www.sec.gov/Archives/edgar/data/1051251/000156459017005984/jcg-8k_20170403.htm.',
  },
  frankMuytjens: {
    name: 'Frank Muytjens',
    career: [
      {
        house: 'jCrew',
        role: 'Menswear Director',
        sources: ['https://www.out.com/out-exclusives/tastemakers/2014/09/10/frank-muytjens-menswear-designer-jcrew'],
        start: 2008,
      },
      {
        house: 'ralphLauren',
        role: 'Other',
        sources: ['https://www.out.com/out-exclusives/tastemakers/2014/09/10/frank-muytjens-menswear-designer-jcrew'],
        roleDetail: 'Design role',
      },
    ],
  },
  olympiaGayot: {
    name: 'Olympia Gayot',
    career: [
      {
        house: 'jCrew',
        role: 'Creative Director',
        sources: ['https://investors.jcrew.com/static-files/6146e337-05ee-4a7e-b0df-902aea9f4b0e'],
        end: null,
        roleDetail: 'Women’s and kids’ creative director',
      },
    ],
    notes: 'Returned to J.Crew after an earlier design-team stint. Appointment date is not confirmed in the cited 2026 brand release.',
  },
  donC: {
    name: 'Don C',
    career: [
      {
        house: 'mitchellAndNess',
        role: 'Creative Director',
        sources: ['https://boardroom.tv/don-c-mitchell-ness-creative-director/'],
        start: 2023,
        roleDetail: 'Creative director of premium products',
      },
    ],
    notes: 'Don Crawley, founder of Just Don; also a creative strategy and design adviser to the Chicago Bulls. His premium-products appointment is a sustained role, distinct from individual collaborations.',
  },
  markWilliams: {
    name: 'Mark Williams',
    career: [
      {
        house: 'benSherman',
        role: 'Creative Director',
        sources: ['https://www.bensherman.co.uk/timeline'],
        end: null,
      },
    ],
  },
  marlouVanEngelen: {
    name: 'Marlou van Engelen',
    career: [
      {
        house: 'scotchAndSoda',
        role: 'Head Designer',
        sources: ['https://www.drapersonline.com/people/exploring-amsterdam-with-scotch-sodas-creative-director'],
        start: 2007,
        end: 2015,
        roleDetail: 'Kidswear head of design',
      },
      {
        house: 'scotchAndSoda',
        role: 'Creative Director',
        sources: ['https://www.drapersonline.com/people/exploring-amsterdam-with-scotch-sodas-creative-director'],
        start: 2015,
      },
    ],
    notes: 'Announced her departure after fifteen years at Scotch & Soda: https://www.linkedin.com/posts/marlou-van-engelen-44725922_teamworkmakesthedreamwork-whataride-ontothenextchapter-activity-6982600315694948352-nSxU. The end year is not confirmed here.',
  },
  toddSnyder: {
    name: 'Todd Snyder',
    career: [
      {
        house: 'woolrich',
        role: 'Creative Director',
        sources: ['https://www.toddsnyder.com/blogs/editorials/woolrich-black-label-by-ts'],
        roleDetail: 'Global creative director, Woolrich Black Label',
      },
      {
        house: 'ralphLauren',
        role: 'Other',
        sources: ['https://www.toddsnyder.com/pages/bio'],
        roleDetail: 'Design role',
      },
      {
        house: 'gap',
        role: 'Other',
        sources: ['https://www.toddsnyder.com/pages/bio'],
        roleDetail: 'Design role',
      },
      {
        house: 'jCrew',
        role: 'Other',
        sources: ['https://www.toddsnyder.com/pages/bio'],
        roleDetail: 'Design role',
      },
    ],
    notes: 'Founder of the Todd Snyder label, launched in 2011. Woolrich Black Label is a recurring collection with an appointed creative role; it is not a one-off capsule.',
  },
  jackONeill: {
    name: 'Jack O’Neill',
    died: 2017,
    career: [
      {
        house: 'oneill',
        role: 'Founder',
        sources: ['https://us.oneill.com/pages/about-jack-oneill'],
        start: 1952,
        end: 2017,
      },
    ],
    sources: ['https://us.oneill.com/pages/about-jack-oneill', 'https://oneillcanada.com/pages/about-jack-o-neill'],
  },
  torstenHochstetter: {
    name: 'Torsten Hochstetter',
    career: [
      {
        house: 'adidas',
        role: 'Other',
        sources: ['https://preview.thenewsmarket.com/Previews/puma/DocumentAssets/293772.pdf'],
        start: 1995,
        end: 2005,
        roleDetail: 'Sports apparel designer; subsequently head of design',
      },
      {
        house: 'adidas',
        role: 'Creative Director',
        sources: ['https://preview.thenewsmarket.com/Previews/puma/DocumentAssets/293772.pdf'],
        start: 2005,
        end: 2007,
        roleDetail: 'Sport Performance',
      },
      {
        house: 'adidas',
        role: 'Creative Director',
        sources: ['https://preview.thenewsmarket.com/Previews/puma/DocumentAssets/293772.pdf'],
        start: 2007,
        end: 2010,
        roleDetail: 'Sport Style',
      },
      {
        house: 'y3',
        role: 'Other',
        sources: ['https://preview.thenewsmarket.com/Previews/puma/DocumentAssets/293772.pdf'],
        start: 2007,
        end: 2010,
        roleDetail: 'Led the Adidas Y-3 creative teams within Adidas Sport Style',
      },
      {
        house: 'oneill',
        role: 'Artistic Director',
        sources: ['https://preview.thenewsmarket.com/Previews/puma/DocumentAssets/293772.pdf'],
        start: 2010,
        end: 2013,
      },
      {
        house: 'puma',
        role: 'Creative Director',
        sources: ['https://preview.thenewsmarket.com/Previews/puma/DocumentAssets/293772.pdf'],
        start: 2013,
        roleDetail: 'Global creative director',
      },
    ],
    notes: 'Previously a designer at S.Oliver from 1993 to 1995. Dates and line responsibilities follow Puma’s official appointment biography; the Puma end year remains unconfirmed.',
    sources: ['https://preview.thenewsmarket.com/Previews/puma/DocumentAssets/293772.pdf'],
  },
  ryanRush: {
    name: 'Ryan Rush',
    career: [
      {
        house: 'oneill',
        role: 'Menswear Director',
        sources: ['https://malakye.com/news/ryan-rush-vp-mens-merchandising-design-at-oneill-2396'],
        roleDetail: 'Vice president, men’s merchandising and design; design director',
      },
    ],
    notes: 'Previously founded Drawls and Dawls and led creative direction at Ezekiel. The cited 2008 interview establishes his O’Neill role, but does not give exact tenure dates.',
    sources: ['https://malakye.com/news/ryan-rush-vp-mens-merchandising-design-at-oneill-2396'],
  },
  jeremyHull: {
    name: 'Jeremy Hull',
    career: [
      {
        house: 'drakes',
        role: 'Founder',
        sources: ['https://www.permanentstyle.com/2012/03/the-history-of-drakes.html'],
        start: 1977,
      },
    ],
    notes: 'Co-founded Drake’s with Michael Drake and Isabel Dickson. Previously Aquascutum’s export sales director; later represented Belvest.',
    sources: ['https://www.permanentstyle.com/2012/03/the-history-of-drakes.html'],
  },
  isabelDickson: {
    name: 'Isabel Dickson',
    career: [
      {
        house: 'drakes',
        role: 'Founder',
        sources: ['https://www.permanentstyle.com/2012/03/the-history-of-drakes.html'],
        start: 1977,
      },
    ],
    notes: 'Co-founded Drake’s and managed its finances after working in export sales administration at Aquascutum.',
    sources: ['https://www.permanentstyle.com/2012/03/the-history-of-drakes.html'],
  },
  pascalMonfort: {
    name: 'Pascal Monfort',
    career: [
      {
        house: 'leCoqSportif',
        role: 'Creative Director',
        sources: ['https://www.linkedin.com/posts/pascalmonfort_le-coq-sportif-announces-its-reset-and-i-activity-7438260305022910466-dU80'],
        end: null,
        roleDetail: 'Chief creative officer',
      },
      {
        house: 'nike',
        role: 'Other',
        sources: ['https://www.youtube.com/watch?v=OuWVyoWE6ew'],
        roleDetail: 'Consumer culture and innovation',
      },
    ],
    notes: 'Founder of REC trends marketing. Announced his Le Coq Sportif appointment in 2026 while continuing to run REC; exact Nike tenure dates remain unconfirmed.',
  },
  yasuharuKuzaki: {
    name: 'Yasuharu Kuzaki',
    career: [
      {
        house: 'aton',
        role: 'Founder',
        sources: ['https://www.ssense.com/ja-jp/editorial/fashion-ja/japanese-clothing-brands?lang=ja', 'https://blog.shipsltd.co.jp/brand/ships/shop/ships-grandfront-osaka/203143c5-9606-494a-966e-b7f541bb5fe0'],
        start: 2016,
      },
      {
        house: 'aton',
        role: 'Creative Director',
        sources: ['https://aton-tokyo.com/en/pages/about'],
        start: 2016,
        end: null,
        roleDetail: 'Brand director',
      },
    ],
    notes: 'Previously directed WORLD BASICS. His practice centres on textile development and close work with producers. Sources: https://www.makes.jp/c/ATON_w.',
  },
  ichikoShimizu: {
    name: 'Ichiko Shimizu',
    career: [
      {
        house: 'aton',
        role: 'Other',
        sources: ['https://www.shipsltd.co.jp/shipsmag/content/happy_woman_2023/', 'https://blog.shipsltd.co.jp/brand/ships/shop/ships-grandfront-osaka/203143c5-9606-494a-966e-b7f541bb5fe0'],
        start: 2016,
        roleDetail: 'Womenswear designer',
      },
    ],
    notes: 'Designed ATON womenswear before launching ESLOW for autumn/winter 2021. The source does not establish the exact ATON departure year; ESLOW is not yet a house in this dataset.',
  },
  takayukiMinami: {
    name: 'Takayuki Minami',
    career: [
      {
        house: 'graphpaper',
        role: 'Founder',
        sources: ['https://asia.graphpaper-tokyo.com/pages/concept'],
        start: 2015,
      },
      {
        house: 'graphpaper',
        role: 'Creative Director',
        sources: ['https://minami.katalok.ooo/ja/about'],
        end: null,
      },
    ],
    sources: ['https://alpha-tokyo.com/message', 'https://minami.katalok.ooo/ja/about'],
    notes: 'Founded alpha as an independent practice in 2008 and incorporated it in 2012. Previously worked at H.P.FRANCE and directed 1LDK; also directs FreshService. Temporary retail projects and collaborations are excluded from career links.',
  },
  daisukeObana: {
    name: 'Daisuke Obana',
    career: [
      {
        house: 'nHoolywood',
        role: 'Founder',
        sources: ['https://n-hoolywood.com/pages/about'],
        start: 2001,
      },
      {
        house: 'nHoolywood',
        role: 'Creative Director',
        sources: ['https://n-hoolywood.com/pages/about'],
        start: 2001,
        end: null,
      },
    ],
    born: 1974,
    sources: ['https://n-hoolywood.com/pages/about'],
    notes: 'Started in vintage retail, helped launch go-getter and developed remade garments before opening Mister Hollywood. The shop and first runway collection predate/follow the label’s 2001 establishment respectively.',
  },
  keigoMurakami: {
    name: 'Keigo Murakami',
    career: [
      {
        house: 'blurhms',
        role: 'Founder',
        sources: ['https://mix.tokyo/blogs/feature/250220_lib_howdesignersmakeclothes-blurhms'],
        start: 2011,
        roleDetail: 'Founder and designer',
      },
    ],
    sources: ['https://mix.tokyo/blogs/feature/250220_lib_howdesignersmakeclothes-blurhms'],
    notes: 'Worked across factory production, textile development, retail and apparel manufacturing before starting blurhms. His interview gives 2011; other histories date the label to 2012.',
  },
  hirokiKishimoto: {
    name: 'Hiroki Kishimoto',
    career: [
      {
        house: 'japanBlueJeans',
        role: 'Founder',
        sources: ['https://robindenim.com/2021/01/ten-years-of-japan-blue-jeans-in-conversation-with-mr-kishimoto/', 'https://urahara-store.com/pages/japan-blue-jeans-first-look'],
        start: 2011,
        roleDetail: 'Brand launch and denim design',
      },
    ],
    sources: ['https://robindenim.com/2021/01/ten-years-of-japan-blue-jeans-in-conversation-with-mr-kishimoto/', 'https://www.japanblue.co.jp/about/history', 'https://urahara-store.com/pages/japan-blue-jeans-first-look'],
    notes: 'Joined Collect as a young textile developer before starting Japan Blue Jeans to demonstrate its fabrics. The company’s official history dates international launch to 2011, despite some accounts using 2010.',
  },
  nigelCabournDesigner: {
    name: 'Nigel Cabourn',
    career: [
      {
        house: 'nigelCabourn',
        role: 'Founder',
        sources: ['https://www.cabourn.com/en-us/blogs/journal/the-heritage-post-nigel-cabourn', 'https://www.cabourn.com/en-it/blogs/journal/announcement-12-6-26'],
        start: 1971,
        end: 2026,
        roleDetail: 'Founder and clothing designer; originally Cricket',
      },
    ],
    died: 2026,
    sources: ['https://www.cabourn.com/en-us/blogs/journal/the-heritage-post-nigel-cabourn', 'https://www.cabourn.com/en-it/blogs/journal/announcement-12-6-26'],
    notes: 'His published retrospective dates Cricket to 1971 and the eponymous renaming to 1984. Kept his studio in the Newcastle area and built collections from military, workwear and expedition archives.',
  },
  emilieCasiez: {
    name: 'Emilie Casiez',
    career: [
      {
        house: 'nigelCabourn',
        role: 'Head Designer',
        sources: ['https://www.cabourn.com/blogs/journal/an-interview-with-women-s-designer-emilie-casiez'],
        roleDetail: 'Designer of the women’s range',
      },
    ],
    sources: ['https://www.cabourn.com/blogs/journal/an-interview-with-women-s-designer-emilie-casiez'],
    notes: 'Ran her own label and shop for ten years, then worked in Tokyo before joining Nigel Cabourn. Exact tenure dates and the name of the earlier Japanese employer are not established by her interview.',
  },
  ichiroNakatsu: {
    name: 'Ichiro Nakatsu',
    career: [
      {
        house: 'orSlow',
        role: 'Founder',
        sources: ['https://www.fashion-press.net/brands/2749/', 'https://www.heddels.com/2025/06/a-conversation-with-orslows-ichiro-nakatsu/'],
        start: 2005,
        roleDetail: 'Founder and head designer',
      },
    ],
    sources: ['https://www.heddels.com/2025/06/a-conversation-with-orslows-ichiro-nakatsu/'],
    notes: 'Developed an interest in denim through vintage clothing, initially making samples himself before moving toward product planning and overseeing production.',
  },
  edwinViberg: {
    name: 'Edwin Viberg',
    career: [
      {
        house: 'viberg',
        role: 'Founder',
        sources: ['https://viberg.com/blogs/journal/the-family-craft'],
        start: 1931,
        roleDetail: 'Founder and bootmaker',
      },
    ],
    sources: ['https://viberg.com/blogs/journal/the-family-craft'],
    notes: 'Learned shoemaking from his father Axel. Founded the company in Shellbrook during the Depression and later moved west to serve British Columbia’s logging industry.',
  },
  brettViberg: {
    name: 'Brett Viberg',
    career: [
      {
        house: 'viberg',
        role: 'Creative Director',
        sources: ['https://viberg.com/blogs/journal/six-panel-cotton-twill-caps'],
        roleDetail: 'Third-generation owner; lead design and product development',
      },
    ],
    sources: ['https://viberg.com/blogs/journal/six-panel-cotton-twill-caps'],
    notes: 'Learned production on the factory floor before expanding international sales and taking on lead design responsibilities. Appointment dates remain unconfirmed.',
  },
  eranElfassy: {
    name: 'Eran Elfassy',
    career: [
      {
        house: 'mackage',
        role: 'Founder',
        sources: ['https://www.forbes.com/sites/josephdeacetis/2020/01/26/meet-mackage-an-outerwear-brand-that-never-spares-the-necessities-of-performance-for-style/'],
        start: 1999,
      },
      {
        house: 'mackage',
        role: 'Co-Creative Director',
        sources: ['https://www.forbes.com/sites/josephdeacetis/2020/01/26/meet-mackage-an-outerwear-brand-that-never-spares-the-necessities-of-performance-for-style/'],
        roleDetail: 'Co-chief creative officer',
      },
    ],
    sources: ['https://www.forbes.com/sites/josephdeacetis/2020/01/26/meet-mackage-an-outerwear-brand-that-never-spares-the-necessities-of-performance-for-style/'],
    notes: 'Developed Mackage from his family’s leather-industry experience. The joint founder interview distinguishes his 1999 launch from Elisa Dahan’s arrival two years later.',
  },
  elisaDahan: {
    name: 'Elisa Dahan',
    career: [
      {
        house: 'mackage',
        role: 'Co-Creative Director',
        sources: ['https://www.forbes.com/sites/josephdeacetis/2020/01/26/meet-mackage-an-outerwear-brand-that-never-spares-the-necessities-of-performance-for-style/', 'https://www.forbes.com/sites/sharonedelson/2022/12/20/former-mackage-co-creative-directors-got-women-covered-with-new-knitwear-brand/'],
        start: 2001,
        roleDetail: 'Co-chief creative officer',
      },
    ],
    sources: ['https://www.forbes.com/sites/josephdeacetis/2020/01/26/meet-mackage-an-outerwear-brand-that-never-spares-the-necessities-of-performance-for-style/', 'https://www.forbes.com/sites/sharonedelson/2022/12/20/former-mackage-co-creative-directors-got-women-covered-with-new-knitwear-brand/'],
    notes: 'Helped build Mackage before leaving to launch Dodiee in 2022. The 2020 joint interview dates her arrival to 2001; other accounts use 2000. Departure is established, but its exact year is not fixed here.',
  },
  noahStern: {
    name: 'Noah Stern',
    career: [
      {
        house: 'mooseKnuckles',
        role: 'Founder',
        sources: ['https://www.cathaycapital.com/moose-knuckles-the-canadian-luxury-outerwear-sportswear-brand-announces-industry-veteran-victor-luis-as-investor-and-executive-chairman/', 'https://www.prnewswire.com/news-releases/moose-knuckles-secures-strategic-investment-from-down-apparel-leader-bosideng-and-current-shareholders-to-fuel-expansion-as-a-global-luxury-outerwear-brand-302270552.html'],
        start: 2009,
      },
    ],
    notes: 'Co-founder. The founders exited as shareholders in the 2024 investment transaction; this does not establish a creative-role departure date.',
  },
  ayalTwik: {
    name: 'Ayal Twik',
    career: [
      {
        house: 'mooseKnuckles',
        role: 'Founder',
        sources: ['https://www.cathaycapital.com/moose-knuckles-the-canadian-luxury-outerwear-sportswear-brand-announces-industry-veteran-victor-luis-as-investor-and-executive-chairman/', 'https://www.prnewswire.com/news-releases/moose-knuckles-secures-strategic-investment-from-down-apparel-leader-bosideng-and-current-shareholders-to-fuel-expansion-as-a-global-luxury-outerwear-brand-302270552.html'],
        start: 2009,
      },
    ],
    notes: 'Co-founder. The founders exited as shareholders in the 2024 investment transaction; this does not establish a creative-role departure date.',
  },
  ludovicoBruno: {
    name: 'Ludovico Bruno',
    career: [
      {
        house: 'moncler',
        role: 'Other',
        sources: ['https://www.designscene.net/2023/10/ludovico-bruno-interview.html'],
        start: 2014,
        end: 2020,
        roleDetail: 'Design team, Gamme Rouge/Gamme Bleu and Moncler Genius',
      },
      {
        house: 'ambush',
        role: 'Other',
        sources: ['https://www.designscene.net/2023/10/ludovico-bruno-interview.html'],
        roleDetail: 'Independent design consultant',
      },
      {
        house: 'mooseKnuckles',
        role: 'Creative Director',
        sources: ['https://moose-knuckles.prezly.com/moose-knuckles-appoints-ludovico-bruno-as-global-creative-director-and-raif-adelberg-as-design-director-marking-a-new-chapter-in-creative-leadership'],
        start: 2025,
        roleDetail: 'Global creative director',
      },
    ],
    sources: ['https://www.designscene.net/2023/10/ludovico-bruno-interview.html', 'https://moose-knuckles.prezly.com/moose-knuckles-appoints-ludovico-bruno-as-global-creative-director-and-raif-adelberg-as-design-director-marking-a-new-chapter-in-creative-leadership'],
    notes: 'Worked at 3.1 Phillip Lim and with Edward Buchanan before Moncler; established an independent consultancy in 2020 and later founded Mordecai. His Moncler work was employment within its design team, not separate roles at the individual Genius collaborators’ labels.',
  },
  raifAdelberg: {
    name: 'Raif Adelberg',
    career: [
      {
        house: 'mooseKnuckles',
        role: 'Head Designer',
        sources: ['https://www.prnewswire.com/news-releases/moose-knuckles-appoints-ludovico-bruno-as-global-creative-director-and-raif-adelberg-as-design-director-marking-a-new-era-of-creative-leadership-302612333.html'],
        start: 2025,
        roleDetail: 'Design director',
      },
    ],
    sources: ['https://www.prnewswire.com/news-releases/moose-knuckles-appoints-ludovico-bruno-as-global-creative-director-and-raif-adelberg-as-design-director-marking-a-new-era-of-creative-leadership-302612333.html'],
    notes: 'Founded wings+horns, Maison François Marie, HER_MAN and the Richard Kidd concept store; also led bag design at Herschel Supply Co. These labels are not yet in the dataset. Collaborations with other brands are excluded from career tenures.',
  },
  yukiMatsuda: {
    name: 'Yuki Matsuda',
    career: [
      {
        house: 'yuketen',
        role: 'Founder',
        sources: ['https://www.yuketen.com/about', 'https://www.megcompany.com/story'],
        start: 1989,
        roleDetail: 'Founder and designer',
      },
    ],
    sources: ['https://www.megcompany.com/story', 'https://www.megcompany.com/home'],
    notes: 'Founded Meg Company in California with support from his partner Megumi. His other labels include Monitaly and Chamula; Meg Company also houses Epperson Mountaineering.',
  },
  yasuhiroKameya: {
    name: 'Yasuhiro Kameya',
    career: [
      {
        house: 'buzzRicksons',
        role: 'Head Designer',
        sources: ['https://www.buzzricksons.jp/news/5919/'],
        roleDetail: 'Head of product planning (企画総括)',
      },
    ],
    sources: ['https://www.buzzricksons.jp/news/5919/'],
    notes: 'Military-clothing researcher and product-planning lead at Buzz Rickson’s. The official byline confirms the role; its appointment year remains unconfirmed.',
  },
  /* ---------- Everlane, French Connection and American Eagle ---------- */
  michaelPreysman: {
    name: 'Michael Preysman',
    career: [{ house: 'everlane', role: 'Other', roleDetail: 'Co-founder', start: 2011, sources: ['https://apnews.com/article/e503f7f613242bb3e41b6624f0fecc5f'] }],
  },
  jesseFarmer: {
    name: 'Jesse Farmer',
    career: [{ house: 'everlane', role: 'Other', roleDetail: 'Co-founder', start: 2011, sources: ['https://apnews.com/article/e503f7f613242bb3e41b6624f0fecc5f'] }],
  },
  mathildeMader: {
    name: 'Mathilde Mader',
    nationality: 'Danish',
    career: [
      { house: 'soniaRykiel', role: 'Other', roleDetail: 'Design team', sources: ['https://thekhc.co/wp-content/uploads/2022/09/Everlane-Article-2.pdf'] },
      { house: 'marni', role: 'Other', roleDetail: 'Design team', sources: ['https://thekhc.co/wp-content/uploads/2022/09/Everlane-Article-2.pdf'] },
      { house: 'mulberry', role: 'Other', roleDetail: 'Design team', sources: ['https://thekhc.co/wp-content/uploads/2022/09/Everlane-Article-2.pdf'] },
      { house: 'everlane', role: 'Creative Director', roleDetail: 'Global creative director, product design', start: 2022, notes: 'Appointment confirmed in 2022 and role in a 2024 interview; current status after the 2026 acquisition remains unconfirmed.', sources: ['https://thekhc.co/wp-content/uploads/2022/09/Everlane-Article-2.pdf', 'https://fashionista.com/2024/03/mathilda-mader-everlane-career-interview'] },
    ],
    notes: 'Previously worked for Vanessa Bruno, Kim Jones’s namesake label and By Malene Birger. Exact dates and titles at earlier employers remain unconfirmed.',
    sources: ['https://thekhc.co/wp-content/uploads/2022/09/Everlane-Article-2.pdf', 'https://fashionista.com/2024/03/mathilda-mader-everlane-career-interview'],
  },
  stephenMarks: {
    name: 'Stephen Marks',
    career: [{ house: 'frenchConnection', role: 'Other', roleDetail: 'Founder', start: 1972, sources: ['https://www.theindustry.fashion/the-interview-french-connections-head-of-design-on-the-new-vision-powering-its-fashion-comeback/'] }],
  },
  nicoleFarhi: {
    name: 'Nicole Farhi',
    born: 1946,
    nationality: 'French',
    career: [{ house: 'frenchConnection', role: 'Head Designer', roleDetail: 'Head of design studio', start: 1978, notes: 'Museum biography dates the London studio leadership to 1978; earlier freelance work with Stephen Marks is also reported. Exact departure date unconfirmed.', sources: ['https://famm.com/en-gb/artists/nicole-farhi-lady-hare-cbe', 'https://opengatecapital.com/news/opengate-capital-acquires-nicole-farhi-fashion-brand-from-french-connection-group/'] }],
    notes: 'Subsequently launched her namesake label with Stephen Marks; later devoted her practice to sculpture. The Nicole Farhi label is not currently in the dataset.',
  },
  helenGallagher: {
    name: 'Helen Gallagher',
    career: [{ house: 'frenchConnection', role: 'Head Designer', roleDetail: 'Head of Design', start: 2023, end: null, sources: ['https://www.theindustry.fashion/the-interview-french-connections-head-of-design-on-the-new-vision-powering-its-fashion-comeback/', 'https://www.theindustry.fashion/in-pictures-french-connection-makes-every-day-your-call-for-aw26-campaign/'] }],
    notes: 'Previously Head of Design at Mint Velvet, 2018–2023; joined French Connection in August 2023.',
  },
  jerrySilverman: {
    name: 'Jerry Silverman',
    career: [{ house: 'americanEagle', role: 'Other', roleDetail: 'Co-founder with brother Mark through Silverman’s Menswear', start: 1977, sources: ['https://www.aeo-inc.com/2019/06/03/adweek-how-american-eagle-captured-the-youth-market-and-never-really-let-go/'] }],
  },
  markSilverman: {
    name: 'Mark Silverman',
    career: [{ house: 'americanEagle', role: 'Other', roleDetail: 'Co-founder with brother Jerry through Silverman’s Menswear', start: 1977, sources: ['https://www.aeo-inc.com/2019/06/03/adweek-how-american-eagle-captured-the-youth-market-and-never-really-let-go/'] }],
  },
  jenniferFoyle: {
    name: 'Jennifer Foyle',
    career: [
      { house: 'gap', role: 'Other', roleDetail: 'Women’s divisional merchandise manager', start: 1999, end: 2003, sources: ['https://d18rn0p25nwr6d.cloudfront.net/CIK-0000919012/ee5a7f8c-aa57-4658-930a-d8538d6bbab1.pdf'] },
      { house: 'jCrew', role: 'Other', roleDetail: 'Merchandising roles, ultimately chief merchandising officer', start: 2003, end: 2009, sources: ['https://d18rn0p25nwr6d.cloudfront.net/CIK-0000919012/ee5a7f8c-aa57-4658-930a-d8538d6bbab1.pdf'] },
      { house: 'americanEagle', role: 'Creative Director', roleDetail: 'Chief Creative Officer, AEO Inc.; oversight of American Eagle design, merchandising and marketing', start: 2020, end: 2021, sources: ['https://www.aeo-inc.com/2020/09/09/american-eagle-outfitters-inc-promotes-jennifer-foyle-to-chief-creative-officer-aeo-inc/amp/', 'https://d18rn0p25nwr6d.cloudfront.net/CIK-0000919012/ee5a7f8c-aa57-4658-930a-d8538d6bbab1.pdf'] },
      { house: 'americanEagle', role: 'Creative Director', roleDetail: 'President and Executive Creative Director, AE and Aerie', start: 2021, end: null, sources: ['https://d18rn0p25nwr6d.cloudfront.net/CIK-0000919012/ee5a7f8c-aa57-4658-930a-d8538d6bbab1.pdf', 'https://www.worldretail-lab.com/speakers/jennifer-foyle'] },
    ],
    notes: 'Her creative leadership covers both American Eagle and Aerie. Earlier roles include Bloomingdale’s and Calypso St. Barth; Aerie is not currently in the dataset.',
  },
  /* ---------- Kiton and Evan Kinori ---------- */
  ciroPaone: {
    name: 'Ciro Paone',
    nationality: 'Italian',
    career: [{ house: 'kiton', role: 'Founder', start: 1968, end: 2021, sources: ['https://kiton.com/pages/kitonism', 'https://mr-mag.com/from-our-july-awards-issue-antonio-paone-the-quality-of-family/'] }],
  },
  antonioDeMatteis: {
    name: 'Antonio De Matteis',
    born: 1964,
    nationality: 'Italian',
    career: [{ house: 'kiton', role: 'Menswear Director', roleDetail: 'Menswear creative direction', notes: 'Joined the company as an agent in 1986 and later became CEO; the start year of his creative role is unconfirmed.', sources: ['https://www.cameramoda.it/en/venice-sustainable-fashion-forum/speaker/2/', 'https://quifinanza.it/lifestyle/kiton-il-battito-silenzioso-del-lusso-fatto-a-mano/938949/'] }],
  },
  mariaGiovannaPaone: {
    name: 'Maria Giovanna Paone',
    nationality: 'Italian',
    career: [{ house: 'kiton', role: 'Womenswear Director', roleDetail: 'Creative director, womenswear', notes: 'Creative appointment year unconfirmed; her company presidency is separate from her womenswear role.', sources: ['https://www.fashionmagazine.it/business/intervista-antonio-de-matteis-kiton-i-numeri-sono-importanti-ma-per-noi-viene-prima-la-qualit-113853', 'https://www.vogue.com/fashion-shows/fall-2018-ready-to-wear/kiton'] }],
  },
  marianoDeMatteis: {
    name: 'Mariano De Matteis',
    nationality: 'Italian',
    career: [{ house: 'kiton', role: 'Co-Creative Director', roleDetail: 'KNT (Kiton New Textures), with Walter De Matteis', start: 2018, sources: ['https://www.niaf.org/wp-content/uploads/2018/06/Matteis-bio.pdf'] }],
  },
  walterDeMatteis: {
    name: 'Walter De Matteis',
    nationality: 'Italian',
    career: [{ house: 'kiton', role: 'Co-Creative Director', roleDetail: 'KNT (Kiton New Textures), with Mariano De Matteis', start: 2018, sources: ['https://www.niaf.org/wp-content/uploads/2018/06/Matteis-bio.pdf'] }],
  },
  evanKinoriDesigner: {
    name: 'Evan Kinori',
    career: [{ house: 'evanKinori', role: 'Founder', roleDetail: 'Founder, designer and patternmaker', start: 2015, end: null, sources: ['https://framacph.com/blogs/stories/frama-x-evan-kinori-carefully-constructed-items', 'https://evankinori.com/pages/about'] }],
    notes: 'Previously worked at Jack/Knife Outfitters in San Francisco; that label is not currently in the dataset.',
    sources: ['https://www.ropedye.com/2015/10/evan-kinori-denim/'],
  },
  /* ---------- Abercrombie & Fitch and Hollister ---------- */
  davidAbercrombie: {
    name: 'David Abercrombie',
    career: [{ house: 'abercrombieFitch', role: 'Other', roleDetail: 'Founder of Abercrombie Co., the original outdoor outfitter', start: 1892, sources: ['https://corporate.abercrombie.com/about-us/'] }],
  },
  ezraFitch: {
    name: 'Ezra Fitch',
    career: [{ house: 'abercrombieFitch', role: 'Other', roleDetail: 'Partner and co-founder of the renamed Abercrombie & Fitch business', start: 1900, sources: ['https://vintagefashionguild.org/resources/item/label/abercrombie-fitch/'] }],
  },
  aaronLevine: {
    name: 'Aaron Levine',
    career: [
      { house: 'clubMonaco', role: 'Menswear Director', roleDetail: 'Vice president, men’s design', start: 2011, end: 2015, approximate: true, notes: 'Reported in June 2015 as leaving after four years; start year is approximate.', sources: ['https://mr-mag.com/aaron-levine-named-mens-design-director-at-abercrombie-fitch/'] },
      { house: 'abercrombieFitch', role: 'Head Designer', roleDetail: 'Head of menswear design; later senior vice president of men’s and women’s design', start: 2015, end: 2021, sources: ['https://mr-mag.com/aaron-levine-named-mens-design-director-at-abercrombie-fitch/', 'https://www.gq.com/story/aaron-levine-brand-launch-fall-2024'] },
    ],
    notes: 'Earlier design work includes Joseph Abboud, Hickey Freeman, Jack Spade and Rogues Gallery. Launched his own label in 2024 and subsequently consulted for Vince, Madewell and Aimé Leon Dore; exact consultation dates and scope remain unconfirmed.',
    sources: ['https://www.gq.com/story/abercrombie-fitch-aaron-levine-designer-profile', 'https://www.gq.com/story/aaron-levine-brand-launch-fall-2024'],
  },
  kristinaSzasz: {
    name: 'Kristina Szasz',
    career: [
      { house: 'levis', role: 'Other', roleDetail: 'Denim design', sources: ['https://fashionista.com/2016/09/abercrombie-fitch-fall-2016'] },
      { house: 'ralphLauren', role: 'Other', roleDetail: 'Denim design, Polo Ralph Lauren', sources: ['https://fashionista.com/2016/09/abercrombie-fitch-fall-2016'] },
      { house: 'tommyHilfiger', role: 'Other', roleDetail: 'Design director, denim', sources: ['https://fashionista.com/2016/09/abercrombie-fitch-fall-2016'] },
      { house: 'abercrombieFitch', role: 'Womenswear Director', roleDetail: 'Head of womenswear design', start: 2015, notes: 'First collection presented for Fall 2016; departure year unconfirmed.', sources: ['https://fashionista.com/2016/09/abercrombie-fitch-fall-2016'] },
    ],
    notes: 'Also held denim design roles at Karl Lagerfeld and Iceberg Jeans, labels not currently in the dataset.',
  },
  lisaLowman: {
    name: 'Lisa Lowman',
    career: [
      { house: 'luckyBrand', role: 'Other', roleDetail: 'Designer', sources: ['https://mr-mag.com/aaron-levine-named-mens-design-director-at-abercrombie-fitch/'] },
      { house: 'hollister', role: 'Womenswear Director', roleDetail: 'Head of design, Hollister Girls', start: 2015, notes: 'Appointment documented in June 2015; end year unconfirmed.', sources: ['https://mr-mag.com/aaron-levine-named-mens-design-director-at-abercrombie-fitch/'] },
    ],
  },
  /* ---------- Napapijri, Icebreaker and Parajumpers ---------- */
  giulianaRosset: {
    name: 'Giuliana Rosset',
    nationality: 'Italian',
    career: [{ house: 'napapijri', role: 'Other', roleDetail: 'Founder; developed Green Sport Monte Bianco into Napapijri', start: 1987, notes: 'Her biography distinguishes the 1987 acquisition of the bag maker from the 1990 creation of the Napapijri clothing brand.', sources: ['https://mayafiles.tase.co.il/rpdf/1227001-1228000/P1227966-02.pdf'] }],
  },
  christopherRaeburn: {
    name: 'Christopher Raeburn',
    nationality: 'British',
    career: [
      { house: 'timberland', role: 'Creative Director', roleDetail: 'Global creative director', start: 2018, end: 2022, sources: ['https://www.fashionpress.jp/en/brands/1866', 'https://blueearthsummit.com/speakers/christopher-raeburn'] },
      { house: 'timberland', role: 'Other', roleDetail: 'Collaborator at large', notes: 'Appointed to a continuing role after leaving global creative direction in 2022; exact end year unconfirmed.', sources: ['https://www.fashionpress.jp/en/brands/1866', 'https://www.pambianconews.com/2023/11/15/christopher-raeburn-e-il-primo-global-creative-director-di-napapijri-389521/'] },
      { house: 'napapijri', role: 'Creative Director', roleDetail: 'Global creative director', start: 2023, end: null, notes: 'Appointed November 2023; first full collection Fall/Winter 2025.', sources: ['https://www.pambianconews.com/2023/11/15/christopher-raeburn-e-il-primo-global-creative-director-di-napapijri-389521/', 'https://blueearthsummit.com/speakers/christopher-raeburn'] },
    ],
    notes: 'Founder and creative director of RÆBURN, which is not currently in the dataset. Continued at Timberland as a collaborator at large after leaving global creative direction; exact dates of that subsequent role remain unconfirmed.',
  },
  jeremyMoon: {
    name: 'Jeremy Moon',
    nationality: 'New Zealander',
    career: [{ house: 'icebreaker', role: 'Other', roleDetail: 'Founder', start: 1995, sources: ['https://na.icebreaker.com/en-us/pages/history'] }],
    notes: 'The merino garments developed by farmers Brian and Fiona Brakenridge helped inspire the business; the official brand history credits Moon as founder.',
    sources: ['https://na.icebreaker.com/en-us/pages/history', 'https://www.iese.edu/media/research/pdfs/ESTUDIO-137.pdf'],
  },
  massimoRossetti: {
    name: 'Massimo Rossetti',
    nationality: 'Italian',
    career: [{ house: 'parajumpers', role: 'Founder', roleDetail: 'Co-founder and creative director with Ape & Partners', start: 2006, sources: ['https://static.classeditori.it/content_upload/pdf_art/2019/005/MF064MFF44.pdf', 'https://shop.mitchellstores.com/style-edit/parajumpers'] }],
  },
  /* ---------- Nobis, Peak Performance, Pajar Canada and RUDSAK ---------- */
  robinYates: {
    name: 'Robin Yates',
    career: [
      { house: 'canadaGoose', role: 'Other', roleDetail: 'Vice president', start: 1998, end: 2006, notes: '1998 start year supplied by the user; 2006 departure confirmed in interview.', sources: ['https://theadultman.com/fashion-and-style/nobis-review/', 'https://www.theindustry.fashion/interview-robin-yates-nobis-and-woods-arctic-brand/'] },
      { house: 'nobis', role: 'Other', roleDetail: 'Co-founder', start: 2007, end: null, sources: ['https://www.vogue.it/uomo-vogue/news/2014/10/nobis', 'https://nobis.com/pages/about-nobis', 'https://www.appareltextilesourcing.com/sessions/fireside-chat-with-robin-yates-a-career-in-canadian-outerwear/'] },
    ],
  },
  kevinAuYeung: {
    name: 'Kevin Au-Yeung',
    career: [{ house: 'nobis', role: 'Other', roleDetail: 'Co-founder', start: 2007, sources: ['https://www.vogue.it/uomo-vogue/news/2014/10/nobis'] }],
  },
  michaelKerr: {
    name: 'Michael Kerr',
    career: [
      { house: 'nike', role: 'Other', roleDetail: 'Design team', sources: ['https://www.wearglobalnetwork.com/news/nobis-introduces-michael-kerr-as-new-design-director/'] },
      { house: 'canadaGoose', role: 'Other', roleDetail: 'Design team', sources: ['https://www.wearglobalnetwork.com/news/nobis-introduces-michael-kerr-as-new-design-director/'] },
      { house: 'theNorthFace', role: 'Other', roleDetail: 'Design team', sources: ['https://www.wearglobalnetwork.com/news/nobis-introduces-michael-kerr-as-new-design-director/'] },
      { house: 'nobis', role: 'Head Designer', roleDetail: 'Senior design director', notes: 'Introduced as the new senior design director in June 2021 with his first collection for Fall/Winter 2021. Exact appointment and departure years unconfirmed.', sources: ['https://mr-mag.com/nobis-unveils-first-collection-from-its-new-senior-design-director/', 'https://www.nobis.ch/blogs/news/nobis-pop-up-store-eastside-geneva'] },
    ],
    notes: 'Also worked on the design team at Roots, a brand not currently in the dataset; exact earlier dates and titles unconfirmed.',
  },
  stefanEngstrom: {
    name: 'Stefan Engström',
    career: [{ house: 'peakPerformance', role: 'Other', roleDetail: 'Co-founder; professional skier', start: 1986, sources: ['https://www.peak-whistler.com/service/about/'] }],
  },
  peterBlom: {
    name: 'Peter Blom',
    career: [{ house: 'peakPerformance', role: 'Other', roleDetail: 'Co-founder; ski-magazine editor', start: 1986, sources: ['https://www.peak-whistler.com/service/about/'] }],
  },
  christerMartensson: {
    name: 'Christer Mårtensson',
    career: [{ house: 'peakPerformance', role: 'Founder', roleDetail: 'Co-founder, art director and designer', start: 1986, sources: ['https://www.peak-whistler.com/service/about/'] }],
  },
  lenaClaesson: {
    name: 'Lena Claesson',
    career: [{ house: 'peakPerformance', role: 'Head Designer', roleDetail: 'Design director', notes: 'Role documented in the owner’s 2013/14 annual report. Start and departure years unconfirmed; subsequently co-founded Huski Wear in 2020.', sources: ['https://www.icgroup.net/wp-content/uploads/UK_AnnualReport_13_14.pdf', 'https://www.habit.se/article/view/742110/trio_bakom_nytt_skidkladesvarumarke'] }],
  },
  paulGolbert: {
    name: 'Paul Golbert',
    career: [{ house: 'pajarCanada', role: 'Founder', roleDetail: 'Founder and shoemaker', start: 1963, sources: ['https://us.pajar.com/pages/pajar-history-heritage'] }],
  },
  evikAsatoorian: {
    name: 'Evik Asatoorian',
    career: [{ house: 'rudsak', role: 'Founder', roleDetail: 'Founder and creative leader', start: 1994, end: null, sources: ['https://rudsak.com/pages/heritage', 'https://encyclomodeqc.musee-mccord-stewart.ca/en/entry/rudsak/'] }],
  },
  /* ---------- Burton ---------- */
  jakeBurtonCarpenter: {
    name: 'Jake Burton Carpenter',
    died: 2019,
    career: [{ house: 'burton', role: 'Founder', roleDetail: 'Founder and original snowboard developer', start: 1977, end: 2019, sources: ['https://brand.burton.com/history-2/', 'https://www.the-spin-off.com/news/stories/The-Brands-How-haute-couture-inspired-Burtons-new-most-responsible-jacket--17695'] }],
  },
  gregDacyshyn: {
    name: 'Greg Dacyshyn',
    career: [
      { house: 'burton', role: 'Creative Director', roleDetail: 'Senior vice president and creative director of product; later chief creative officer', start: 2006, end: 2017, notes: 'Joined Burton earlier in an entry-level role; the 2006 date marks the documented senior product-creative appointment.', sources: ['https://sgbonline.com/burton-reorganizes-senior-management/', 'https://shop-eat-surf-outdoor.com/news/content-greg-dacyshyn-exits-burton/24287/'] },
      { house: 'burton', role: 'Creative Director', roleDetail: 'External creative direction for product and marketing through Camp High', start: 2017, notes: 'Continued as an appointed creative partner after leaving the in-house position; exact end year unconfirmed.', sources: ['https://shop-eat-surf-outdoor.com/news/content-greg-dacyshyn-exits-burton/24287/'] },
    ],
    notes: 'Founded the Camp High agency in 2017 and helped create Analog with Jeff Anderson. Neither is currently a separate house in the dataset.',
  },
  /* ---------- Mountain Hardwear ---------- */
  jackGilbert: {
    name: 'Jack Gilbert',
    career: [
      { house: 'theNorthFace', role: 'Other', roleDetail: 'Vice president, sales and marketing', sources: ['https://www.baycrossings.com/wp-content/uploads/2020/09/BC_May_2008LR.pdf'] },
      { house: 'mountainHardwear', role: 'Other', roleDetail: 'Co-founder and original president', start: 1993, sources: ['https://www.mountainhardwear.com/since-1993.html'] },
    ],
    notes: 'Previously president of Sierra Designs; that brand is not currently in the dataset.',
  },
  christinaClark: {
    name: 'Christina Clark',
    career: [{ house: 'mountainHardwear', role: 'Other', roleDetail: 'Co-founder and original chief financial officer', start: 1993, sources: ['https://www.mountainhardwear.com/since-1993.html'] }],
  },
  paulKramer: {
    name: 'Paul Kramer',
    career: [{ house: 'mountainHardwear', role: 'Founder', roleDetail: 'Co-founder and original vice president of sourcing and design', start: 1993, notes: 'Earlier work at Sierra Designs; end year of design leadership unconfirmed.', sources: ['https://www.mountainhardwear.com/since-1993.html', 'https://outinunder.com/content/paul-kramer-intro'] }],
  },
  paigeBoucher: {
    name: 'Paige Boucher',
    career: [{ house: 'mountainHardwear', role: 'Other', roleDetail: 'Co-founder and original marketing director', start: 1993, sources: ['https://www.mountainhardwear.com/since-1993.html'] }],
  },
  mikeWallenfels: {
    name: 'Mike Wallenfels',
    career: [{ house: 'mountainHardwear', role: 'Other', roleDetail: 'Co-founder and original national sales manager', start: 1993, sources: ['https://www.mountainhardwear.com/since-1993.html'] }],
  },
  ingridHarshbarger: {
    name: 'Ingrid Harshbarger',
    career: [{ house: 'mountainHardwear', role: 'Founder', roleDetail: 'Co-founder, original senior designer and first head of design', start: 1993, notes: 'The official history credits her with the original apparel design and influence over the brand’s first decade; exact departure year unconfirmed.', sources: ['https://www.mountainhardwear.com/since-1993.html'] }],
  },
  claranneKnittle: {
    name: 'Claranne Knittle',
    career: [{ house: 'mountainHardwear', role: 'Other', roleDetail: 'Co-founder and original sourcing manager', start: 1993, sources: ['https://www.mountainhardwear.com/since-1993.html'] }],
    notes: 'Spelling follows Mountain Hardwear’s official founder list.',
  },
  robertaHernandez: {
    name: 'Roberta Hernandez',
    career: [{ house: 'mountainHardwear', role: 'Other', roleDetail: 'Co-founder, original account services and HR manager', start: 1993, sources: ['https://www.mountainhardwear.com/since-1993.html'] }],
  },
  alTabor: {
    name: 'Al Tabor',
    career: [{ house: 'mountainHardwear', role: 'Other', roleDetail: 'Co-founder and original operations director', start: 1993, sources: ['https://www.mountainhardwear.com/since-1993.html'] }],
  },
  cherylKnopp: {
    name: 'Cheryl Knopp',
    career: [
      { house: 'mountainHardwear', role: 'Other', roleDetail: 'Apparel designer', notes: 'The official history credits her work on the early-2000s Synchro jacket; precise tenure years unconfirmed.', sources: ['https://www.mountainhardwear.com/since-1993.html'] },
      { house: 'arcteryx', role: 'Other', roleDetail: 'Apparel design team', sources: ['https://sgbonline.com/bde-apparel-launch-selling-out/', 'https://www.claruscorp.com/all-sec-filings/content/0001144204-12-033640/0001144204-12-033640.pdf'] },
      { house: 'blackDiamond', role: 'Other', roleDetail: 'Design lead, apparel', notes: 'Part of the team developing Black Diamond’s original apparel collection; exact employment dates unconfirmed.', sources: ['https://sgbonline.com/bde-apparel-launch-selling-out/', 'https://www.claruscorp.com/all-sec-filings/content/0001144204-12-033640/0001144204-12-033640.pdf'] },
    ],
  },
  /* ---------- Outdoor Research and Klättermusen ---------- */
  ronGregg: {
    name: 'Ron Gregg',
    career: [{ house: 'outdoorResearch', role: 'Founder', roleDetail: 'Founder and original equipment developer', start: 1981, sources: ['https://www.outdoorresearch.com/pages/our-story'] }],
  },
  katarzynaSchoewe: {
    name: 'Katarzyna Schoewe',
    career: [
      { house: 'underArmour', role: 'Other', roleDetail: 'Design team', sources: ['https://www.snowsportsnews.com/newsrepository/2023/february/outdoor-research-promotes-three-team-members-to-new-senior-leadership-positions/'] },
      { house: 'llBean', role: 'Other', roleDetail: 'Design team', sources: ['https://www.snowsportsnews.com/newsrepository/2023/february/outdoor-research-promotes-three-team-members-to-new-senior-leadership-positions/'] },
      { house: 'outdoorResearch', role: 'Creative Director', roleDetail: 'Creative design director; later senior creative design director', end: 2023, notes: 'Appointment reported before the 2023 promotion; exact start year unconfirmed.', sources: ['https://sgbonline.com/outdoor-research-appoints-design-marketing-directors/', 'https://www.snowsportsnews.com/newsrepository/2023/february/outdoor-research-promotes-three-team-members-to-new-senior-leadership-positions/'] },
      { house: 'outdoorResearch', role: 'Head Designer', roleDetail: 'Vice president, design and product innovation', start: 2023, notes: 'Promoted February 2023; subsequently joined Stanley 1913 by June 2026. Exact departure year unconfirmed.', sources: ['https://www.snowsportsnews.com/newsrepository/2023/february/outdoor-research-promotes-three-team-members-to-new-senior-leadership-positions/', 'https://www.bizjournals.com/buffalo/bizwomen/news/profiles-strategies/2026/06/stanley-1913-kat-schoewe-quencher-cup.html?page=5'] },
    ],
    notes: 'Also known as Kat Schoewe. Earlier design roles include Pearl Izumi and Lands’ End; subsequently vice president of product innovation and design at Stanley 1913. Those brands are not currently in the dataset.',
  },
  peterAskulv: {
    name: 'Peter Askulv',
    career: [{ house: 'klattermusen', role: 'Founder', roleDetail: 'Founder and product developer', start: 1984, notes: 'Scope’s founder biography dates his business to 1984; the brand’s current history separately traces its climbers’ workshop origins to 1975.', sources: ['https://publish.ne.cision.com/Release/ViewReleaseHtml/BEAC8834C09B83F0', 'https://www.klattermusen.com/en-us/about-us/'] }],
  },
  isabelleLiahaugen: {
    name: 'Isabelle Malm Liahaugen',
    career: [{ house: 'klattermusen', role: 'Head Designer', roleDetail: 'Head of design and development', end: null, notes: 'Also credited as Isabelle Liahaugen. Appointment year unconfirmed.', sources: ['https://www.klattermusen.com/de-ch/our-retail-spaces/', 'https://www.ka-yo.com/gb/en/a-day-with-klattermusen', 'https://www.t3.com/active/outerwear/this-swedish-outdoor-specialists-futuristic-new-outerwear-collection-looks-straight-out-of-a-sci-fi-film-but-theres-serious-tech-underneath'] }],
  },
  /* ---------- 686, Mammut, Black Diamond and Jack Wolfskin ---------- */
  michaelAkiraWest: {
    name: 'Michael Akira West',
    career: [{ house: 'sixEightSix', role: 'Founder', roleDetail: 'Founder and creative leader', start: 1992, end: null, sources: ['https://www.686.com/pages/story', 'https://hypebeast.com/2012/7/hypebeast-trade-michael-akira-west-of-686-technical-apparel'] }],
  },
  kasparTanner: {
    name: 'Kaspar Tanner',
    career: [{ house: 'mammut', role: 'Other', roleDetail: 'Founder of the original rope-making business', start: 1862, sources: ['https://www.mammut.com/de/en/heritage'] }],
  },
  peterMetcalf: {
    name: 'Peter Metcalf',
    career: [{ house: 'blackDiamond', role: 'Other', roleDetail: 'Co-founder through the employee buyout of Chouinard Equipment', start: 1989, sources: ['https://blackdiamondequipment.com/blogs/stories/our-heritage'] }],
    notes: 'Previously ran Chouinard Equipment; that predecessor is not currently a separate house in the dataset.',
  },
  mariaCranor: {
    name: 'Maria Cranor',
    career: [{ house: 'blackDiamond', role: 'Other', roleDetail: 'Co-founder through the employee buyout of Chouinard Equipment', start: 1989, sources: ['https://blackdiamondequipment.com/blogs/stories/our-heritage'] }],
  },
  martijnLinden: {
    name: 'Martijn Linden',
    career: [
      { house: 'oneill', role: 'Other', roleDetail: 'Design and creative roles', sources: ['https://www.sgieurope.com/black-diamond-fills-new-positions-in-europe-and-the-us/39154.article'] },
      { house: 'quiksilver', role: 'Other', roleDetail: 'Design and creative roles', sources: ['https://www.sgieurope.com/black-diamond-fills-new-positions-in-europe-and-the-us/39154.article'] },
      { house: 'patagonia', role: 'Other', roleDetail: 'Design and creative roles', sources: ['https://www.sgieurope.com/black-diamond-fills-new-positions-in-europe-and-the-us/39154.article'] },
      { house: 'blackDiamond', role: 'Head Designer', roleDetail: 'Design director, apparel', start: 2012, end: 2014, sources: ['https://www.sgieurope.com/black-diamond-fills-new-positions-in-europe-and-the-us/39154.article', 'https://www.snewsnet.com/news/black-diamond-to-streamline-some-product-categories-shuffles-leadership'] },
      { house: 'blackDiamond', role: 'Head Designer', roleDetail: 'Vice president, merchandising and design of apparel', start: 2014, sources: ['https://www.snewsnet.com/news/black-diamond-to-streamline-some-product-categories-shuffles-leadership'] },
    ],
    notes: 'Also held design and creative positions at Rip Curl, a brand not currently in the dataset; exact earlier dates and titles unconfirmed.',
  },
  katelynRidgeway: {
    name: 'Katelyn Ridgeway',
    career: [{ house: 'blackDiamond', role: 'Head Designer', roleDetail: 'Apparel design director', notes: 'Former role confirmed in her independent design biography; tenure years unconfirmed.', sources: ['https://www.katelynridgeway.com/information'] }],
    notes: 'Subsequently outerwear category manager at KÜHL before becoming an independent apparel designer; KÜHL is not currently in the dataset.',
  },
  ulrichDausien: {
    name: 'Ulrich Dausien',
    career: [{ house: 'jackWolfskin', role: 'Founder', roleDetail: 'Founder and original product developer', start: 1981, sources: ['https://www.jack-wolfskin.co.uk/on/demandware.static/-/Library-Sites-JackWolfskin_SharedContentLib/en_GB/dw2b63e64d/PDFs/PM_40_Jahre_DE_25.pdf'] }],
  },
  /* ---------- Indian designer houses ---------- */
  sabyasachiMukherjee: {
    name: 'Sabyasachi Mukherjee',
    nationality: 'Indian',
    career: [{ house: 'sabyasachi', role: 'Founder', roleDetail: 'Founder and creative director', start: 1999, end: null, sources: ['https://sabyasachi.com/pages/history', 'https://www.adityabirla.com/en/businesses/brands/sabyasachi/'] }],
    notes: 'Won an internship with British textile designer Georgina von Etzdorf and a research assignment at the Victoria & Albert Museum in 2001. Georgina von Etzdorf is not currently a house in the dataset.',
  },
  gauravGupta: {
    name: 'Gaurav Gupta',
    nationality: 'Indian',
    career: [
      { house: 'stellaMcCartney', role: 'Other', roleDetail: 'Early-career work; exact title unconfirmed', sources: ['https://beopenfuture.com/community/gaurav-gupta/'] },
      { house: 'vivienneWestwood', role: 'Other', roleDetail: 'Early-career work; exact title unconfirmed', sources: ['https://www.hindustantimes.com/india/gaurav-gupta/story-Ar7eQbWZXl5FBjxCd85INO.html'] },
      { house: 'gauravGupta', role: 'Founder', roleDetail: 'Co-founder and couturier', start: 2005, end: null, sources: ['https://shop.gauravguptastudio.com/pages/about-us', 'https://sheerluxe.com/fashion/interviews/my-life-in-fashion-gaurav-gupta'] },
    ],
    notes: 'Also interned with Hussein Chalayan and worked with Tristan Webber; neither label is currently in the dataset. Exact years of the early roles are unconfirmed.',
    sources: ['https://beopenfuture.com/community/gaurav-gupta/', 'https://sheerluxe.com/fashion/interviews/my-life-in-fashion-gaurav-gupta'],
  },
  saurabhGupta: {
    name: 'Saurabh Gupta',
    career: [{ house: 'gauravGupta', role: 'Other', roleDetail: 'Co-founder', start: 2005, notes: 'Founding association confirmed; current operating responsibilities unconfirmed.', sources: ['https://shop.gauravguptastudio.com/pages/about-us'] }],
  },
  amitAggarwal: {
    name: 'Amit Aggarwal',
    nationality: 'Indian',
    career: [{ house: 'amitAggarwal', role: 'Founder', roleDetail: 'Founder and designer', start: 2012, end: null, sources: ['https://www.amitaggarwal.com/pages/world-of-aa', 'https://www.femina.in/fashion/trends/amit-aggarwal-interview-88542.html'] }],
    notes: 'Previously a ready-to-wear assistant designer with Tarun Tahiliani and creative director of Morphe before launching his namesake label. Those labels are not currently in the dataset; exact earlier tenure years remain unconfirmed.',
    sources: ['https://www.femina.in/fashion/trends/amit-aggarwal-interview-88542.html'],
  },
  manishMalhotra: {
    name: 'Manish Malhotra',
    nationality: 'Indian',
    career: [{ house: 'manishMalhotra', role: 'Founder', roleDetail: 'Founder and creative director', start: 2005, end: null, sources: ['https://manishmalhotra.in/pages/our-founder', 'https://www.theweek.in/theweek/leisure/2025/03/15/i-want-my-business-to-be-at-rs1000-crore-i-would-say-we-are-not-very-far-from-it-says-manish-malhotra.html'] }],
    notes: 'Began his film-costume career with Swarg in 1990, before establishing the couture house. Film styling and individual collaborations are not recorded as house career tenures.',
  },
  kartikKumra: {
    name: 'Kartik Kumra',
    nationality: 'Indian',
    career: [{ house: 'kartikResearch', role: 'Founder', roleDetail: 'Founder and artistic director', start: 2021, end: null, sources: ['https://www.kartikresearch.com/pages/about', 'https://www.fhcm.paris/en/house/kartik-research'] }],
    notes: 'Studied economics at the University of Pennsylvania and built his label while at university, without formal fashion training.',
    sources: ['https://bakerretail.wharton.upenn.edu/alumni-spotlight/alumni-spotlight-kartik-kumra-c-22/'],
  },
  dhruvKapoor: {
    name: 'Dhruv Kapoor',
    nationality: 'Indian',
    career: [
      { house: 'etro', role: 'Other', roleDetail: 'Womenswear design team', start: 2013, notes: 'Early role in Milan before returning to India; exact departure year unconfirmed.', sources: ['https://dhruvkapoor.com/pages/about-us'] },
      { house: 'dhruvKapoor', role: 'Founder', roleDetail: 'Founder and creative director', start: 2013, end: null, sources: ['https://dhruvkapoor.com/pages/about-us'] },
    ],
  },
  ruchikaSachdeva: {
    name: 'Ruchika Sachdeva',
    nationality: 'Indian',
    career: [
      { house: 'vivienneWestwood', role: 'Other', roleDetail: 'Internship and early-career work', sources: ['https://www.arts.ac.uk/colleges/london-college-of-fashion/stories/meet-bodice-the-lcf-alumna-following-the-footsteps-of-yves-saint-laurent-and-karl-lagerfeld', 'https://fdci.org/member/bodice-by-ruchika-sachdeva/'] },
      { house: 'bodice', role: 'Founder', roleDetail: 'Founder and creative director', start: 2011, end: null, sources: ['https://bodice.co.in/pages/designers-note', 'https://www.woolmarkprize.com/designers-list/bodice/', 'https://www.asahi-kasei.co.jp/fibers/en/bemberg/news/detail/202504150001.html'] },
    ],
    notes: 'Also worked with Giles Deacon and Nitin Bal Chauhan before launching Bodice; those labels are not currently in the dataset. Exact earlier tenure years are unconfirmed.',
    sources: ['https://fdci.org/member/bodice-by-ruchika-sachdeva/'],
  },
  aneethArora: {
    name: 'Aneeth Arora',
    nationality: 'Indian',
    career: [{ house: 'pero', role: 'Founder', roleDetail: 'Founder and creative director', start: 2009, end: null, sources: ['https://fdci.org/member/pero-by-aneeth-arora/', 'https://elle.in/fashion/in-conversation-with-aneeth-arora-12672767'] }],
    notes: 'Previously interned with Abraham & Thakore and worked at Xylem Papercraft; those businesses are not currently in the dataset.',
    sources: ['https://www.newindianexpress.com/thesundaystandard/2014/Apr/13/the-slow-settler-598970.html'],
  },
  sanjayGarg: {
    name: 'Sanjay Garg',
    nationality: 'Indian',
    career: [{ house: 'rawMango', role: 'Founder', roleDetail: 'Founder and textile designer', start: 2008, end: null, sources: ['https://rawmango.com/pages/raw-mango', 'https://www.wallpaper.com/fashion-beauty/raw-mango-aw-2026-london-fashion-week-debut'] }],
    notes: 'Previously worked at Shades of India and on textile-development projects in Chanderi. Also developed an eponymous stitched-garment line after Raw Mango; those labels are not currently in the dataset.',
    sources: ['https://www.woolmark.com/gb/fashion/against-the-tide/'],
  },
} satisfies Record<string, DesignerData<HouseId>>;

export type DesignerId = keyof typeof designers;
