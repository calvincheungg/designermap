import { describe, expect, it } from 'vitest';
import { movesOf, tenuresAt } from './index';
import { validateData } from './validate';

describe('data', () => {
  it('passes validation', () => {
    expect(validateData()).toEqual([]);
  });

  it('derives moves in chronological order', () => {
    expect(movesOf('hediSlimane').map((m) => [m.from.house, m.to.house, m.year])).toEqual([
      ['dior', 'saintLaurent', 2012],
      ['saintLaurent', 'celine', 2018],
    ]);
  });

  it('ignores promotions within the same house', () => {
    expect(movesOf('pierpaoloPiccioli').map((m) => m.to.house)).toEqual(['balenciaga']);
  });

  it('treats a title change at the same house as continuing, not a move', () => {
    // Prada CD → co-CD in 2020 must not read as "Miu Miu → Prada".
    expect(movesOf('miucciaPrada').map((m) => [m.from.house, m.to.house, m.year, m.concurrent])).toEqual([
      ['prada', 'miuMiu', 1993, true],
    ]);
  });

  it('marks roles held alongside another as concurrent', () => {
    expect(movesOf('jonathanAnderson').map((m) => [m.from.house, m.to.house, m.concurrent])).toEqual([
      ['jwAnderson', 'loewe', true],
      ['loewe', 'dior', false],
    ]);
  });

  it('shows Demna taking Balenciaga alongside Vetements, then leaving it for Gucci', () => {
    expect(movesOf('demna').map((m) => [m.from.house, m.to.house, m.year, m.concurrent])).toEqual([
      ['vetements', 'balenciaga', 2015, true],
      ['balenciaga', 'gucci', 2025, false],
    ]);
    expect(movesOf('guramGvasalia')).toEqual([]);
  });

  it('picks the house they actually left as the origin', () => {
    // Lagerfeld left Chloé for Chanel in 1983 while staying at Fendi.
    const toChanel = movesOf('karlLagerfeld').find((m) => m.to.house === 'chanel')!;
    expect([toChanel.from.house, toChanel.concurrent]).toEqual(['chloe', false]);
  });

  it('lists Jil Sander’s directors in order, including the founder’s returns', () => {
    expect(tenuresAt('jilSander').map((t) => [t.designerId, t.start])).toEqual([
      ['jilSander', 1968],
      ['milanVukmirovic', 2000],
      ['jilSander', 2003],
      ['rafSimons', 2005],
      ['jilSander', 2012],
      ['rodolfoPaglialunga', 2014],
      ['lucieMeier', 2017],
      ['lukeMeier', 2017],
      ['simoneBellotti', 2025],
    ]);
  });

  it('lists Louis Vuitton’s family heads and division directors in order', () => {
    expect(tenuresAt('louisVuitton').map((t) => [t.designerId, t.start])).toEqual([
      ['louisVuitton', 1854],
      ['georgesVuitton', 1892],
      ['gastonLouisVuitton', 1936],
      ['marcJacobs', 1997],
      ['kimJones', 2011],
      ['nicolasGhesquiere', 2013],
      ['virgilAbloh', 2018],
      ['pharrellWilliams', 2023],
    ]);
  });

  it('lists Calvin Klein’s directors in order', () => {
    expect(tenuresAt('calvinKlein').map((t) => [t.designerId, t.start, t.end])).toEqual([
      ['calvinKlein', 1968, 2003],
      ['franciscoCosta', 2003, 2016],
      ['italoZucchelli', 2003, 2016],
      ['rafSimons', 2016, 2018],
      ['veronicaLeoni', 2024, 2026],
    ]);
  });

  it('lists the Florence houses’ directors in the given order', () => {
    expect(tenuresAt('ferragamo').map((t) => t.designerId)).toEqual([
      'salvatoreFerragamo',
      'fiammaFerragamo',
      'massimilianoGiornetti',
      'paulAndrew',
      'maximilianDavis',
    ]);
    expect(tenuresAt('robertoCavalli').map((t) => t.designerId)).toEqual([
      'robertoCavalli',
      'peterDundas',
      'paulSurridge',
      'faustoPuglisi',
    ]);
  });

  it('lists a house’s directors chronologically', () => {
    expect(tenuresAt('celine').map((t) => t.designerId)).toEqual(['phoebePhilo', 'hediSlimane']);
  });
});
