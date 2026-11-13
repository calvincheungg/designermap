import { describe, expect, it } from 'vitest';
import { CountryCode, GroupId, careerOf, formatTenureYears, getDesigner, getHouse, isActiveIn, movesOf, tenuresAt, yearRange } from './index';
import { BrandCategory } from './tags';

/** A house's formal succession: everything except supporting design-team roles. */
const directorsOf = (house: string) => tenuresAt(house).filter((t) => t.role !== 'Other');
import { validateData } from './validate';

describe('data', () => {
  it('passes validation', () => {
    expect(validateData()).toEqual([]);
  });

  it('records sourced leadership for the five recently added brands', () => {
    for (const house of ['nudieJeans', 'paraboot', 'levis', 'patou', 'rimowa']) {
      const leaders = tenuresAt(house);
      expect(leaders.length, house).toBeGreaterThan(1);
      for (const tenure of leaders) expect(tenure.sources?.length, `${house}: ${tenure.designerId}`).toBeGreaterThan(0);
    }
  });

  it('includes all nine sportswear additions with sources and linked leadership', () => {
    for (const id of ['salomon', 'nike', 'adidas', 'newBalance', 'asics', 'reebok', 'saucony', 'mizuno', 'underArmour']) {
      const house = getHouse(id);
      expect(house?.tags.brandCategory, id).toContain(BrandCategory.Sportswear);
      expect(house?.sources?.length, id).toBeGreaterThan(0);
      expect(tenuresAt(id).length, id).toBeGreaterThan(0);
      for (const tenure of tenuresAt(id)) expect(tenure.sources?.length, `${id}: ${tenure.designerId}`).toBeGreaterThan(0);
    }
  });

  it('adds the outdoor and workwear brands while keeping Carhartt distinct from WIP', () => {
    for (const id of ['puma', 'carhartt', 'fjallraven', 'eddieBauer']) {
      expect(getHouse(id)?.sources?.length, id).toBeGreaterThan(0);
      expect(tenuresAt(id).length, id).toBeGreaterThan(0);
    }
    expect(getHouse('carhartt')?.country).toBe(CountryCode.UnitedStates);
    expect(getHouse('carhartt')?.parentGroup).toBe(GroupId.Carhartt);
    expect(getHouse('carharttWip')?.country).toBe(CountryCode.Germany);
    expect(getHouse('carharttWip')?.parentGroup).not.toBe(GroupId.Carhartt);
    expect(getHouse('fjallraven')?.parentGroup).toBe(GroupId.FenixOutdoor);
    expect(getHouse('eddieBauer')?.parentGroup).toBe(GroupId.AuthenticBrands);
  });

  it('adds the twelve skate, streetwear and sportswear labels with appropriate affiliations', () => {
    for (const id of ['vans', 'converse', 'corteiz', 'cactusPlantFleaMarket', 'champion', 'onRunning', 'umbro', 'kappa', 'lululemon', 'descente', 'diadora', 'fila']) {
      expect(getHouse(id)?.sources?.length, id).toBeGreaterThan(0);
      expect(tenuresAt(id).length, id).toBeGreaterThan(0);
      for (const tenure of tenuresAt(id)) expect(tenure.sources?.length, `${id}: ${tenure.designerId}`).toBeGreaterThan(0);
    }
    expect(getHouse('vans')?.parentGroup).toBe(GroupId.VF);
    expect(getHouse('converse')?.parentGroup).toBe(GroupId.Nike);
    expect(getHouse('champion')?.parentGroup).toBe(GroupId.AuthenticBrands);
    expect(getHouse('descente')?.parentGroup).toBe(GroupId.Itochu);
    expect(getHouse('fila')?.parentGroup).toBe(GroupId.MistoHoldings);
    // Collaborations do not establish ownership.
    expect(getHouse('corteiz')?.parentGroup).toBeUndefined();
    expect(getHouse('cactusPlantFleaMarket')?.parentGroup).toBeUndefined();
    expect(tenuresAt('fila').find((t) => t.designerId === 'levTanju')?.roleDetail).toBe('FILA+ line');
    expect(tenuresAt('lululemon').find((t) => t.designerId === 'jonathanCheung')?.start).toBe(2024);
  });

  it('adds the outdoor and running cohort with sourced, correctly scoped leadership', () => {
    for (const id of ['snowPeak', 'andWander', 'roa', 'oakley', 'satisfy', 'gramicci', 'districtVision', 'rapha', 'karrimor', 'diemme', 'montbell', 'columbia']) {
      expect(getHouse(id)?.sources?.length, id).toBeGreaterThan(0);
      expect(tenuresAt(id).length, id).toBeGreaterThan(0);
      for (const tenure of tenuresAt(id)) expect(tenure.sources?.length, `${id}: ${tenure.designerId}`).toBeGreaterThan(0);
    }
    expect(getHouse('satisfy')?.name).toBe('Satisfy');
    expect(getHouse('districtVision')?.parentGroup).toBeUndefined();
    expect(getHouse('andWander')?.parentGroup).toBe(GroupId.TSI);
    expect(getHouse('oakley')?.parentGroup).toBe(GroupId.EssilorLuxottica);
    const oakley = tenuresAt('oakley');
    expect(oakley.find((t) => t.designerId === 'matthewMWilliams')?.roleDetail).toBe('Apparel, Footwear and Accessories');
    expect(oakley.find((t) => t.designerId === 'travisScott')?.role).toBe('Other');
    expect(tenuresAt('rapha').find((t) => t.designerId === 'franMillar')?.end).toBe(2026);
  });

  it('labels line-specific sportswear direction and curatorial partnerships accurately', () => {
    expect(tenuresAt('newBalance').find((t) => t.designerId === 'teddySantis')?.roleDetail).toBe('Made in USA line');
    const kiko = tenuresAt('asics').find((t) => t.designerId === 'kikoKostadinovDesigner');
    expect(kiko?.role).toBe('Other');
    expect(kiko?.roleDetail).toContain('SportStyle');
    expect(tenuresAt('underArmour').find((t) => t.designerId === 'timCoppens')?.roleDetail).toContain('UAS line');
  });

  it('separates executive and studio roles from creative-director succession', () => {
    const patou = directorsOf('patou');
    expect(patou.map((t) => t.designerId)).toEqual(expect.arrayContaining([
      'jeanPatou', 'marcBohan', 'karlLagerfeld', 'michelGoma', 'christianLacroix', 'guillaumeHenry',
    ]));
    expect(patou.some((t) => t.designerId === 'jeanPaulGaultier')).toBe(false);
    expect(patou.find((t) => t.designerId === 'guillaumeHenry')?.end).toBe(2026);
    expect(directorsOf('levis').some((t) => t.designerId === 'michelleGass')).toBe(false);
    expect(tenuresAt('levis').find((t) => t.designerId === 'karynHillman')?.roleDetail).toBe('Chief Product Officer');
    expect(directorsOf('rimowa').some((t) => t.designerId === 'alexandreArnault')).toBe(false);
  });

  it('derives moves in chronological order', () => {
    expect(movesOf('hediSlimane').map((m) => [m.from.house, m.to.house, m.year])).toEqual([
      ['saintLaurent', 'dior', 2000], // YSL Rive Gauche Homme → Dior Homme
      ['dior', 'saintLaurent', 2012],
      ['saintLaurent', 'celine', 2018],
    ]);
  });

  it('links both and wander founders to Issey Miyake without inventing tenure dates', () => {
    for (const id of ['keitaIkeuchi', 'mihokoMori']) {
      expect(movesOf(id).map((m) => [m.from.house, m.to.house, m.year, m.concurrent])).toEqual([
        ['isseyMiyake', 'andWander', 2011, false],
      ]);
      const prior = careerOf(id)[0]!;
      expect(prior.start).toBeUndefined();
      expect(formatTenureYears(prior)).toBe('Unknown');
      expect(isActiveIn(prior, 2000)).toBe(false);
      expect(directorsOf('isseyMiyake').some((t) => t.designerId === id)).toBe(false);
    }
    expect(yearRange().every(Number.isFinite)).toBe(true);
    expect(formatTenureYears({ house: 'isseyMiyake', role: 'Other', end: 2005 })).toBe('?–2005');
  });

  it('records kolor’s CDG career connections and the Abe family relationship', () => {
    expect(movesOf('junichiAbe').map((m) => [m.from.house, m.to.house, m.year])).toEqual([
      ['commeDesGarcons', 'junyaWatanabe', 1992],
      ['junyaWatanabe', 'kolor', 2004],
    ]);
    expect(directorsOf('commeDesGarcons').some((t) => t.designerId === 'junichiAbe')).toBe(false);
    expect(directorsOf('junyaWatanabe').some((t) => t.designerId === 'junichiAbe')).toBe(false);
    expect(getDesigner('junichiAbe')?.notes).toContain('Chitose Abe');
    expect(careerOf('junichiAbe').some((t) => t.house === 'sacai')).toBe(false);
  });

  it('ignores promotions within the same house', () => {
    // Valentino accessories (1999) → co-CD (2008) → sole CD (2016) is one stay, not three moves.
    expect(movesOf('pierpaoloPiccioli').map((m) => m.to.house)).toEqual(['valentino', 'balenciaga']);
  });

  it('treats a title change at the same house as continuing, not a move', () => {
    // Prada CD → co-CD in 2020 must not read as "Miu Miu → Prada".
    expect(movesOf('miucciaPrada').map((m) => [m.from.house, m.to.house, m.year, m.concurrent])).toEqual([
      ['prada', 'miuMiu', 1993, true],
    ]);
  });

  it('marks roles held alongside another as concurrent', () => {
    expect(movesOf('jonathanAnderson').map((m) => [m.from.house, m.to.house, m.concurrent])).toEqual([
      ['prada', 'jwAnderson', false], // left Prada (visual merchandising) to launch his label
      ['jwAnderson', 'loewe', true],
      ['loewe', 'dior', false],
    ]);
  });

  it('shows Demna taking Balenciaga alongside Vetements, then leaving it for Gucci', () => {
    expect(movesOf('demna').map((m) => [m.from.house, m.to.house, m.year, m.concurrent])).toEqual([
      ['maisonMargiela', 'louisVuitton', 2013, false],
      ['louisVuitton', 'vetements', 2014, false],
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
    expect(directorsOf('jilSander').map((t) => [t.designerId, t.start])).toEqual([
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
    expect(directorsOf('louisVuitton').map((t) => [t.designerId, t.start])).toEqual([
      ['louisVuitton', 1854],
      ['georgesVuitton', 1892],
      ['gastonLouisVuitton', 1936],
      ['marcJacobs', 1997],
      ['paulHelbers', 2006], // head of menswear under Marc Jacobs
      ['kimJones', 2011],
      ['nicolasGhesquiere', 2013],
      ['virgilAbloh', 2018],
      ['pharrellWilliams', 2023],
    ]);
  });

  it('keeps design-team roles out of the succession but still on the house', () => {
    const team = tenuresAt('louisVuitton').filter((t) => t.role === 'Other').map((t) => t.designerId);
    expect(team).toEqual(expect.arrayContaining(['peterCopping', 'demna', 'lucieMeier', 'colmDillane']));
  });

  it('lists Calvin Klein’s directors in order', () => {
    expect(directorsOf('calvinKlein').map((t) => [t.designerId, t.start, t.end])).toEqual([
      ['calvinKlein', 1968, 2003],
      ['louiseTrotter', 2001, 2003], // director of ready-to-wear (head of womenswear), ~2001–2003
      ['franciscoCosta', 2003, 2016],
      ['italoZucchelli', 2004, 2016], // Calvin Klein Collection men's; menswear designer before that
      ['rafSimons', 2016, 2018],
      ['pieterMulier', 2016, 2018], // creative director under chief creative officer Raf Simons
      ['veronicaLeoni', 2024, 2026],
    ]);
  });

  it('lists the Florence houses’ directors in the given order', () => {
    expect(directorsOf('ferragamo').map((t) => t.designerId)).toEqual([
      'salvatoreFerragamo',
      'fiammaFerragamo',
      'massimilianoGiornetti',
      'paulAndrew',
      'maximilianDavis',
    ]);
    expect(directorsOf('robertoCavalli').map((t) => t.designerId)).toEqual([
      'robertoCavalli',
      'peterDundas',
      'paulSurridge',
      'faustoPuglisi',
    ]);
  });

  it('lists a house’s directors chronologically', () => {
    expect(directorsOf('celine').map((t) => t.designerId)).toEqual([
      'celineVipiana',
      'michaelKorsDesigner',
      'phoebePhilo',
      'hediSlimane',
      'michaelRider',
    ]);
  });
});
