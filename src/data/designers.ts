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
      { house: 'calvinKlein', role: 'Creative Director', start: 2016, end: 2018 },
      { house: 'prada', role: 'Co-Creative Director', start: 2020, end: null },
    ],
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
    career: [{ house: 'louisVuitton', role: 'Creative Director', start: 1997, end: 2013 }],
  },
  demna: {
    name: 'Demna',
    born: 1981,
    nationality: 'Georgian',
    career: [
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
      { house: 'loewe', role: 'Creative Director', start: 2013, end: 2025 },
      { house: 'dior', role: 'Creative Director', start: 2025, end: null },
    ],
  },
} satisfies Record<string, DesignerData<HouseId>>;

export type DesignerId = keyof typeof designers;
