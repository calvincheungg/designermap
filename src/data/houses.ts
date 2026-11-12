import type { HouseData } from '../types';

/**
 * Fashion houses. The object key is the house id. It's referenced from
 * designers.ts and used as the logo filename convention (public/logos/<id>.svg).
 *
 * ⚠️ STARTER DATA, written from memory. Verify each entry and add `sources`
 *    as you research. Ownership (`parentGroup`) changes over time; this is
 *    the current owner, not the historical one.
 */
export const houses = {
  dior: {
    name: 'Dior',
    founded: 1946,
    founder: 'Christian Dior',
    city: 'Paris',
    country: 'France',
    parentGroup: 'LVMH',
    // logo: 'dior.svg',
  },
  chanel: {
    name: 'Chanel',
    founded: 1910,
    founder: 'Gabrielle "Coco" Chanel',
    city: 'Paris',
    country: 'France',
  },
  saintLaurent: {
    name: 'Saint Laurent',
    founded: 1961,
    founder: 'Yves Saint Laurent & Pierre Bergé',
    city: 'Paris',
    country: 'France',
    parentGroup: 'Kering',
  },
  givenchy: {
    name: 'Givenchy',
    founded: 1952,
    founder: 'Hubert de Givenchy',
    city: 'Paris',
    country: 'France',
    parentGroup: 'LVMH',
  },
  balenciaga: {
    name: 'Balenciaga',
    founded: 1917,
    founder: 'Cristóbal Balenciaga',
    city: 'Paris',
    country: 'France',
    parentGroup: 'Kering',
    notes: 'Founded in San Sebastián; moved to Paris in 1937.',
  },
  celine: {
    name: 'Celine',
    founded: 1945,
    founder: 'Céline Vipiana',
    city: 'Paris',
    country: 'France',
    parentGroup: 'LVMH',
  },
  louisVuitton: {
    name: 'Louis Vuitton',
    founded: 1854,
    founder: 'Louis Vuitton',
    city: 'Paris',
    country: 'France',
    parentGroup: 'LVMH',
  },
  chloe: {
    name: 'Chloé',
    founded: 1952,
    founder: 'Gaby Aghion',
    city: 'Paris',
    country: 'France',
    parentGroup: 'Richemont',
  },
  maisonMargiela: {
    name: 'Maison Margiela',
    founded: 1988,
    founder: 'Martin Margiela',
    city: 'Paris',
    country: 'France',
    parentGroup: 'OTB',
  },
  gucci: {
    name: 'Gucci',
    founded: 1921,
    founder: 'Guccio Gucci',
    city: 'Florence',
    country: 'Italy',
    parentGroup: 'Kering',
  },
  prada: {
    name: 'Prada',
    founded: 1913,
    founder: 'Mario Prada',
    city: 'Milan',
    country: 'Italy',
    parentGroup: 'Prada Group',
  },
  bottegaVeneta: {
    name: 'Bottega Veneta',
    founded: 1966,
    city: 'Milan',
    country: 'Italy',
    parentGroup: 'Kering',
    notes: 'Founded in Vicenza.',
  },
  valentino: {
    name: 'Valentino',
    founded: 1960,
    founder: 'Valentino Garavani',
    city: 'Rome',
    country: 'Italy',
  },
  fendi: {
    name: 'Fendi',
    founded: 1925,
    founder: 'Adele & Edoardo Fendi',
    city: 'Rome',
    country: 'Italy',
    parentGroup: 'LVMH',
  },
  jilSander: {
    name: 'Jil Sander',
    founded: 1968,
    founder: 'Jil Sander',
    city: 'Milan',
    country: 'Italy',
    parentGroup: 'OTB',
    notes: 'Founded in Hamburg.',
  },
  burberry: {
    name: 'Burberry',
    founded: 1856,
    founder: 'Thomas Burberry',
    city: 'London',
    country: 'UK',
  },
  alexanderMcQueen: {
    name: 'Alexander McQueen',
    founded: 1992,
    founder: 'Lee Alexander McQueen',
    city: 'London',
    country: 'UK',
    parentGroup: 'Kering',
  },
  loewe: {
    name: 'Loewe',
    founded: 1846,
    city: 'Madrid',
    country: 'Spain',
    parentGroup: 'LVMH',
  },
  calvinKlein: {
    name: 'Calvin Klein',
    founded: 1968,
    founder: 'Calvin Klein',
    city: 'New York',
    country: 'USA',
    parentGroup: 'PVH',
  },
} satisfies Record<string, HouseData>;

/** Union of every house key. A typo in designers.ts becomes a compile error. */
export type HouseId = keyof typeof houses;
