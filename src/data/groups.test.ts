import { describe, expect, it } from 'vitest';
import { getGroup, groups, houses, housesInGroup, regionalHousesInGroup, GroupId } from './index';

describe('group profiles', () => {
  it('distinguishes TSI ownership from Japanese regional businesses', () => {
    const owned = housesInGroup(GroupId.TSI).map((house) => house.id);
    const regional = regionalHousesInGroup(GroupId.TSI).map((house) => house.id);
    expect(owned).toEqual(expect.arrayContaining(['margaretHowell', 'sugarCane', 'huf', 'andWander']));
    expect(regional.sort()).toEqual(['alphaIndustries', 'avirex', 'schott', 'stussy', 'whitesville']);
    for (const id of regional) expect(owned).not.toContain(id);
    expect(housesInGroup(GroupId.CentricBrands).map((house) => house.id)).toContain('avirex');
    expect(regionalHousesInGroup('unknown')).toEqual([]);
  });

  it('has a profile and an official link for every recorded parent group', () => {
    for (const house of houses) {
      if (!house.parentGroup) continue;
      const group = getGroup(house.parentGroup);
      expect(group, house.id).toBeDefined();
      expect(group!.description.length).toBeGreaterThan(0);
      expect(new URL(group!.website).protocol).toBe('https:');
    }
    expect(new Set(groups.map((g) => g.id)).size).toBe(groups.length);
  });

  it('derives brand membership from each house rather than storing a second list', () => {
    expect(housesInGroup(GroupId.Moncler).map((h) => h.id)).toEqual(['moncler', 'stoneIsland', 'stoneIslandMarina', 'stoneIslandShadowProject']);
    expect(housesInGroup(GroupId.Prada).map((h) => h.id).sort()).toEqual(['churchs', 'miuMiu', 'prada', 'versace', 'versaceJeansCouture']);
    for (const group of groups) {
      expect(housesInGroup(group.id).map((h) => h.id).sort()).toEqual(
        houses.filter((h) => h.parentGroup === group.id).map((h) => h.id).sort(),
      );
    }
  });

  it('handles missing profiles without resolving inherited object properties', () => {
    expect(getGroup('unknown')).toBeUndefined();
    expect(getGroup('__proto__')).toBeUndefined();
    expect(housesInGroup('unknown')).toEqual([]);
  });

  it('groups the existing WHP portfolio and Vera Wang under the same stable ID', () => {
    expect(housesInGroup(GroupId.WHPGlobal).map((h) => h.id).sort()).toEqual([
      'gStar', 'heavenMarcJacobs', 'marcJacobs', 'ragAndBone', 'veraWang',
    ]);
    expect(housesInGroup(GroupId.LVMH).map((h) => h.id)).not.toContain('marcJacobs');
    expect(houses.find((h) => h.id === 'marcJacobs')?.notes).toContain('owned equally');
    expect(houses.find((h) => h.id === 'ragAndBone')?.notes).toContain('Guess owns the operating business');
  });

  it('keeps stable IDs separate from display names', () => {
    expect(getGroup(GroupId.LeviStrauss)?.name).toBe('Levi Strauss & Co.');
    expect(getGroup(GroupId.Moncler)?.name).toBe('Moncler Group');
    expect(houses.find((house) => house.id === 'levis')?.parentGroup).toBe(GroupId.LeviStrauss);
    expect(new Set(Object.values(GroupId)).size).toBe(groups.length);
  });
});
