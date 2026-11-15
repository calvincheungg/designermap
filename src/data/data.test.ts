import { describe, expect, it } from 'vitest';
import { CountryCode, GroupId, careerOf, formatTenureYears, getDesigner, getHouse, isActiveIn, isBusinessLeadership, movesOf, tenuresAt, yearRange } from './index';
import { BrandCategory, ProductTag } from './tags';

/** A house's formal succession: everything except supporting design-team roles. */
const directorsOf = (house: string) => tenuresAt(house).filter((t) => t.role !== 'Other' && !isBusinessLeadership(t));
import { validateData } from './validate';

describe('data', () => {
  it('records business leadership separately from creative direction and supports executive career moves', () => {
    expect(tenuresAt('nike').filter(isBusinessLeadership).map((tenure) => [tenure.designerId, tenure.start, tenure.end])).toEqual([
      ['markParker', 2006, 2020], ['johnDonahoe', 2020, 2024], ['elliottHill', 2024, null],
    ]);
    expect(directorsOf('nike').map((tenure) => tenure.designerId)).not.toContain('elliottHill');
    expect(tenuresAt('hoka').filter(isBusinessLeadership)).toEqual(expect.arrayContaining([
      expect.objectContaining({ designerId: 'robinGreen', role: 'President', start: 2024, end: null }),
    ]));
    expect(tenuresAt('onRunning').filter(isBusinessLeadership).map((tenure) => [tenure.designerId, tenure.start, tenure.end])).toEqual([
      ['martinHoffmann', 2021, 2026], ['davidAllemann', 2026, null], ['casparCoppetti', 2026, null],
    ]);
    expect(movesOf('davidAllemann')).toEqual([]);
    expect(movesOf('casparCoppetti')).toEqual([]);
    expect(movesOf('kevinPlank')).toEqual([]);
    expect(movesOf('bjornGulden')).toEqual(expect.arrayContaining([
      expect.objectContaining({
        from: expect.objectContaining({ house: 'puma', role: 'CEO' }),
        to: expect.objectContaining({ house: 'adidas', role: 'CEO' }),
        year: 2023, concurrent: false,
      }),
    ]));
  });

  it('connects Elizabeth and James to the Olsen founders alongside The Row', () => {
    expect(getHouse('elizabethAndJames')?.founders).toEqual(['maryKateOlsen', 'ashleyOlsen']);
    expect(getHouse('elizabethAndJames')?.parentGroup).toBeUndefined();
    for (const id of ['maryKateOlsen', 'ashleyOlsen']) {
      expect(movesOf(id)).toEqual(expect.arrayContaining([
        expect.objectContaining({
          from: expect.objectContaining({ house: 'theRow' }),
          to: expect.objectContaining({ house: 'elizabethAndJames', role: 'Founder' }),
          year: 2007,
          concurrent: true,
        }),
      ]));
    }
  });

  it('passes validation', () => {
    expect(validateData()).toEqual([]);
  });

  it('rejects invalid closure years and closure before founding', () => {
    const house = getHouse('christopherKane')!;
    const original = house.closed;
    try {
      for (const year of [0, -2023, 2023.5, NaN, Infinity]) {
        house.closed = year;
        expect(validateData()).toContain('christopherKane: closure year must be a positive integer');
      }
      house.closed = 2005;
      expect(validateData()).toContain('christopherKane: closure before founding');
    } finally {
      if (original === undefined) delete house.closed;
      else house.closed = original;
    }
    expect(validateData()).toEqual([]);
  });

  it('adds the Authentic portfolio additions and keeps True Religion and Robin’s Jean separate', () => {
    const authentic = ['guess', 'nautica', 'aeropostale', 'sperry', 'volcom', 'juicyCouture',
      'billabong', 'quiksilver', 'luckyBrand', 'vince', 'rvca', 'tapout', 'element'];
    for (const id of [...authentic, 'trueReligion', 'robinsJean']) {
      expect(getHouse(id)?.sources?.length, id).toBeGreaterThan(0);
      expect(getHouse(id)?.notes?.length, id).toBeGreaterThan(100);
      expect(tenuresAt(id).length, id).toBeGreaterThan(0);
      for (const tenure of tenuresAt(id)) {
        expect(tenure.sources?.length, `${id}: ${tenure.designerId}`).toBeGreaterThan(0);
      }
    }
    for (const id of authentic) expect(getHouse(id)?.parentGroup, id).toBe(GroupId.AuthenticBrands);
    expect(getHouse('trueReligion')?.parentGroup).toBe(GroupId.ACON);
    expect(getHouse('robinsJean')?.parentGroup).toBeUndefined();
    expect(getHouse('billabong')?.country).toBe(CountryCode.Australia);
    expect(getHouse('quiksilver')?.country).toBe(CountryCode.Australia);
    expect(getHouse('billabong')?.tags.product).toContain(ProductTag.Swimwear);
    expect(getHouse('quiksilver')?.tags.product).toContain(ProductTag.Swimwear);
  });

  it('connects Volcom to Quiksilver and scopes Nautica Japan and Vince leadership accurately', () => {
    expect(movesOf('richardWoolcott')).toEqual(expect.arrayContaining([
      expect.objectContaining({
        from: expect.objectContaining({ house: 'quiksilver', role: 'Other' }),
        to: expect.objectContaining({ house: 'volcom', start: 1991 }),
      }),
    ]));
    expect(directorsOf('nautica')).toEqual(expect.arrayContaining([
      expect.objectContaining({ designerId: 'akioHasegawa', roleDetail: 'Nautica Japan', start: 2020, end: 2023 }),
    ]));
    expect(tenuresAt('nautica').map((t) => t.designerId)).not.toContain('lilYachty');
    expect(careerOf('reaLaccone').map((t) => [t.start, t.end])).toEqual([[2002, 2013], [2015, 2017]]);
    expect(careerOf('johnnySchillereff')[0]?.end).toBe(2020);
  });

  it('fills Costume National’s creative succession and distinguishes business and supporting roles', () => {
    expect(directorsOf('costumeNational').map((t) => [t.designerId, t.role, t.start, t.end])).toEqual([
      ['ennioCapasa', 'Founder', 1986, 2016],
      ['kojiUdo', 'Menswear Director', 2017, 2020],
      ['yasutoshiEzumi', 'Womenswear Director', 2017, 2020],
    ]);
    for (const id of ['carloCapasa', 'rachelScott']) {
      expect(tenuresAt('costumeNational')).toEqual(expect.arrayContaining([
        expect.objectContaining({ designerId: id, role: 'Other' }),
      ]));
    }
    for (const tenure of tenuresAt('costumeNational')) expect(tenure.sources?.length).toBeGreaterThan(0);
    for (const [designer, from, to] of [
      ['ennioCapasa', 'yohjiYamamoto', 'costumeNational'],
      ['yasutoshiEzumi', 'alexanderMcQueen', 'costumeNational'],
      ['rachelScott', 'costumeNational', 'diotima'],
    ] as const) {
      expect(movesOf(designer), designer).toEqual(expect.arrayContaining([
        expect.objectContaining({ from: expect.objectContaining({ house: from }), to: expect.objectContaining({ house: to }) }),
      ]));
    }
  });

  it('adds Vera Wang’s bridal focus and Ralph Lauren career connection', () => {
    expect(getHouse('veraWang')?.tags.product).toContain(ProductTag.Bridal);
    expect(getHouse('veraWang')?.sources?.length).toBeGreaterThan(0);
    expect(directorsOf('veraWang')).toEqual(expect.arrayContaining([
      expect.objectContaining({ designerId: 'veraWang', role: 'Founder', start: 1990, end: null }),
    ]));
    expect(movesOf('veraWang')).toEqual(expect.arrayContaining([
      expect.objectContaining({
        from: expect.objectContaining({ house: 'ralphLauren', role: 'Other' }),
        to: expect.objectContaining({ house: 'veraWang', start: 1990 }),
      }),
    ]));
  });

  it('records Virginia Burlina’s sourced studio roles and distinguishes reported appointments', () => {
    const career = careerOf('virginiaBurlina');
    expect(career.map((t) => t.house).sort()).toEqual([
      'acneStudios', 'burberry', 'driesVanNoten', 'loewe', 'maisonMargiela',
    ]);
    for (const tenure of career) {
      expect(tenure.role).toBe('Other');
      expect(tenure.sources?.length).toBeGreaterThan(0);
      expect(directorsOf(tenure.house).map((t) => t.designerId)).not.toContain('virginiaBurlina');
    }
    expect(movesOf('virginiaBurlina')).toEqual(expect.arrayContaining([
      expect.objectContaining({
        from: expect.objectContaining({ house: 'driesVanNoten' }),
        to: expect.objectContaining({ house: 'burberry', start: 2018 }),
      }),
    ]));
    expect(getDesigner('virginiaBurlina')?.notes).toContain('prospective successor');
    expect(tenuresAt('alexanderMcQueen').map((t) => t.designerId)).not.toContain('virginiaBurlina');
  });

  it('records Yeezy Gap as a partnership alongside Kanye’s Yeezy leadership', () => {
    expect(movesOf('kanyeWest')).toEqual(expect.arrayContaining([
      expect.objectContaining({
        from: expect.objectContaining({ house: 'yeezy' }),
        to: expect.objectContaining({ house: 'gap', role: 'Other', start: 2020, end: 2022 }),
        concurrent: true,
      }),
    ]));
    expect(tenuresAt('gap')).toEqual(expect.arrayContaining([
      expect.objectContaining({ designerId: 'demna', role: 'Other', start: 2022, end: 2022 }),
      expect.objectContaining({ designerId: 'kanyeWest', roleDetail: 'Retail employee, Chicago store' }),
    ]));
    for (const id of ['kanyeWest', 'demna']) {
      expect(directorsOf('gap').map((t) => t.designerId)).not.toContain(id);
    }
  });

  it('shows only a start year for an omitted end and reserves Present for an explicit null', () => {
    const tenure = { house: 'cecilieBahnsen', role: 'Founder' as const, start: 2015 };
    expect(formatTenureYears(tenure)).toBe('2015');
    expect(formatTenureYears({ ...tenure, approximate: true })).toBe('~2015');
    expect(formatTenureYears({ ...tenure, end: null })).toBe('2015–Present');
    expect(formatTenureYears({ ...tenure, end: 2020 })).toBe('2015–2020');
    expect(formatTenureYears({ ...tenure, end: 2015 })).toBe('2015');
  });

  it('adds G-STAR, Donna Karan, ICECREAM, Born x Raised and PLEASURES with sourced leadership', () => {
    for (const id of ['gStar', 'donnaKaran', 'icecream', 'bornXRaised', 'pleasures']) {
      expect(getHouse(id)?.notes?.length, id).toBeGreaterThan(100);
      expect(getHouse(id)?.sources?.length, id).toBeGreaterThan(0);
      expect(tenuresAt(id).length, id).toBeGreaterThan(1);
      for (const tenure of tenuresAt(id)) {
        expect(tenure.sources?.length, `${id}: ${tenure.designerId}`).toBeGreaterThan(0);
      }
    }
    expect(getHouse('gStar')?.parentGroup).toBe(GroupId.WHPGlobal);
    expect(getHouse('donnaKaran')?.parentGroup).toBe(GroupId.GIII);
    expect(getHouse('donnaKaran')?.founded).toBe(1984);
    expect(getHouse('dkny')?.founded).toBe(1989);
    expect(getHouse('icecream')?.founded).toBe(2004);
    expect(getHouse('billionaireBoysClub')?.founded).toBe(2003);
  });

  it('connects the additions through careers and excludes one-off collaboration connections', () => {
    for (const [designer, from, to] of [
      ['danielLee', 'donnaKaran', 'celine'],
      ['donnaKaran', 'donnaKaran', 'dkny'],
      ['pharrellWilliams', 'billionaireBoysClub', 'icecream'],
      ['pharrellWilliams', 'billionaireBoysClub', 'gStar'],
      ['aitorThroup', 'cpCompany', 'gStar'],
    ] as const) {
      expect(movesOf(designer), designer).toEqual(expect.arrayContaining([
        expect.objectContaining({ from: expect.objectContaining({ house: from }), to: expect.objectContaining({ house: to }) }),
      ]));
    }
    expect(directorsOf('gStar')).toEqual(expect.arrayContaining([
      expect.objectContaining({ designerId: 'aitorThroup', start: 2016, end: 2018 }),
    ]));
    expect(directorsOf('gStar').map((t) => t.designerId)).not.toContain('pharrellWilliams');
    expect(directorsOf('puma').map((t) => t.designerId)).not.toContain('alexJamesPleasures');
    expect(directorsOf('nike').map((t) => t.designerId)).not.toContain('alex2ToneErdmann');
    expect(careerOf('alex2ToneErdmann').map((t) => t.house)).toEqual(['bornXRaised']);
    expect(careerOf('alexJamesPleasures').map((t) => t.house)).toEqual(['pleasures']);
    expect(movesOf('alex2ToneErdmann')).toEqual([]);
    expect(movesOf('alexJamesPleasures')).toEqual([]);
    expect(careerOf('chrisSpantoPrintup')[0]?.end).toBe(2023);
  });

  it('includes the fashion, denim and knitwear additions with sourced leadership', () => {
    for (const id of [
      'soniaRykiel', 'carolinaHerrera', 'elieSaab', 'vionnet', 'maryQuant', 'dickies', 'uniqlo', 'rabanne',
      'gap', 'lee', 'wrangler', 'momotaro', 'ironHeart', 'toogood', 'woodWood', 'studioNicholson',
      'cecilieBahnsen', 'carolChristianPoell', 'borisBidjanSaberi', 'elevenBbs', 'guidi',
      'ninetyNinePercentIs', 'pringleOfScotland',
    ]) {
      expect(getHouse(id)?.sources?.length, id).toBeGreaterThan(0);
      expect(tenuresAt(id).length, id).toBeGreaterThan(0);
      for (const tenure of tenuresAt(id)) {
        expect(tenure.sources?.length, `${id}: ${tenure.designerId}`).toBeGreaterThan(0);
      }
    }
    expect(getHouse('dickies')?.parentGroup).toBe(GroupId.BluestarAlliance);
    expect(getHouse('elieSaab')?.country).toBe(CountryCode.Lebanon);
    expect(getHouse('pringleOfScotland')?.city).toBe('Hawick');
  });

  it('links the new houses through careers without treating collaborations as house leadership', () => {
    expect(careerOf('clareWaightKeller')).toEqual(expect.arrayContaining([
      expect.objectContaining({ house: 'pringleOfScotland', start: 2005, end: 2011 }),
      expect.objectContaining({ house: 'uniqlo', role: 'Creative Director', start: 2024 }),
    ]));
    expect(directorsOf('uniqlo').map((t) => t.designerId)).not.toContain('jonathanAnderson');
    expect(careerOf('borisBidjanSaberi').map((t) => t.house)).toEqual(['borisBidjanSaberi', 'elevenBbs', 'salomon']);
  });

  it('derives the researched designer connections to the new houses', () => {
    for (const [designer, from, to, year] of [
      ['cecilieBahnsen', 'erdem', 'cecilieBahnsen', 2015],
      ['nickWakeman', 'diesel', 'studioNicholson', 2010],
      ['patrickRobinson', 'armani', 'rabanne', 2005],
      ['patrickRobinson', 'rabanne', 'gap', 2007],
      ['alistairCarr', 'balenciaga', 'pringleOfScotland', 2011],
      ['massimoNicosia', 'pringleOfScotland', 'zegna', 2017],
      ['sophiaKokosalaki', 'vionnet', 'diesel', 2009],
    ] as const) {
      expect(movesOf(designer), designer).toEqual(expect.arrayContaining([
        expect.objectContaining({ from: expect.objectContaining({ house: from }), to: expect.objectContaining({ house: to }), year }),
      ]));
    }
  });

  it('keeps newly researched internships and collaborations out of formal house succession', () => {
    for (const [designer, house] of [
      ['wesGordon', 'tomFord'], ['wesGordon', 'oscarDeLaRentaHouse'],
      ['cecilieBahnsen', 'johnGalliano'], ['cecilieBahnsen', 'asics'],
      ['cecilieBahnsen', 'theNorthFace'], ['cecilieBahnsen', 'uniqlo'],
      ['borisBidjanSaberi', 'salomon'], ['nickWakeman', 'paraboot'],
      ['rebekkaBay', 'uniqlo'],
    ] as const) {
      const tenure = tenuresAt(house).find((t) => t.designerId === designer);
      expect(tenure?.role, `${designer} at ${house}`).toBe('Other');
      expect(tenure?.sources?.length).toBeGreaterThan(0);
      expect(directorsOf(house).map((t) => t.designerId)).not.toContain(designer);
    }
    const internship = careerOf('wesGordon').find((t) => t.house === 'tomFord');
    expect(internship?.start).toBeUndefined();
    expect(internship?.end).toBeUndefined();
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
      ['loewe', 'uniqlo', true], // JW Anderson collaboration alongside Loewe
      ['loewe', 'dior', false],
    ]);
  });

  it('shows Demna taking Balenciaga alongside Vetements, then leaving it for Gucci', () => {
    expect(movesOf('demna').map((m) => [m.from.house, m.to.house, m.year, m.concurrent])).toEqual([
      ['maisonMargiela', 'louisVuitton', 2013, false],
      ['louisVuitton', 'vetements', 2014, false],
      ['vetements', 'balenciaga', 2015, true],
      ['balenciaga', 'gap', 2022, true],
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
      ['francescaAmfitheatrof', 2018],
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
      'lorenzoSerafini', // Undated womenswear leadership sorts before dated tenures.
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
