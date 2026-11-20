import { describe, expect, it } from 'vitest';
import { getHouse, houses, GroupId } from '../data';
import { letterOf, listFolder, nearestFolder } from './my-computer';

const names = (path: string[], visible = houses) => listFolder(path, visible)?.entries.map((entry) => entry.name);

describe('My Computer folders', () => {
  it('lists the drives and Control Panel at the root', () => {
    expect(names([])).toEqual(['Locations (C:)', 'Brands (D:)', 'Groups (E:)', 'Designers (F:)', 'Control Panel']);
  });

  it('files brands by continent, country and city, and Canada by province', () => {
    const visible = houses.filter((house) => ['aritzia', 'canadaGoose', 'dior'].includes(house.id));
    expect(names(['C'], visible)).toEqual(['Europe', 'North America']);
    expect(names(['C', 'North America'], visible)).toEqual(['Canada']);
    expect(names(['C', 'Europe'], visible)).toEqual(['France']);
    expect(names(['C', 'Europe', 'FR'], visible)).toEqual(['Paris']);
    const city = listFolder(['C', 'Europe', 'FR', 'Paris'], visible)!;
    expect(city.address).toBe('C:\\Europe\\France\\Paris');
    expect(city.entries.map((entry) => entry.name)).toEqual(['Dior']);
    // Canada is filed by province, each listing its brands with their city.
    const provinces = listFolder(['C', 'North America', 'CA'], visible)!;
    expect(provinces.entries.map((entry) => [entry.name, entry.type])).toEqual([['British Columbia', 'Province'], ['Ontario', 'Province']]);
    const bc = listFolder(['C', 'North America', 'CA', 'British Columbia'], visible)!;
    expect(bc.address).toBe('C:\\North America\\Canada\\British Columbia');
    expect(bc.entries.map((entry) => [entry.name, entry.info.split(' · ')[0]])).toEqual([['Aritzia', 'Vancouver']]);
  });

  it('files USA brands by state, listing every brand in the state with its city', () => {
    const us = houses.filter((house) => house.country === 'US');
    const states = listFolder(['C', 'North America', 'US'], us)!;
    expect(states.entries.every((entry) => entry.kind === 'folder' && entry.type === 'State')).toBe(true);
    expect(states.entries.map((entry) => entry.name)).toEqual(expect.arrayContaining(['California', 'New York']));
    const california = listFolder(['C', 'North America', 'US', 'California'], us)!;
    expect(california.address).toBe('C:\\North America\\USA\\California');
    const cities = new Set(us.filter((house) => ['Los Angeles', 'San Francisco'].includes(house.city)).map((house) => house.id));
    const listed = california.entries.flatMap((entry) => entry.kind === 'house' ? [entry] : []);
    expect(listed.filter((entry) => cities.has(entry.house.id))).toHaveLength(cities.size);
    expect(listed.find((entry) => entry.house.city === 'Los Angeles')!.info).toMatch(/^Los Angeles/);
    expect(listFolder(['C', 'North America', 'US', 'Los Angeles'], us)).toBeNull();
  });

  it('keeps a filtered label reachable when its parent is absent', () => {
    const entries = listFolder(['C', 'Europe', 'IT', 'Milan'], [getHouse('ea7')!])!.entries;
    expect(entries.map((entry) => [entry.name, entry.type])).toEqual([['EA7 Emporio Armani', 'Label of Emporio Armani']]);
  });

  it('lists groups with their visible brands and designers A–Z', () => {
    expect(names(['E'])).toContain('Kering');
    expect(names(['E', GroupId.Moncler])).toEqual(expect.arrayContaining(['Moncler', 'Stone Island']));
    expect(names(['F'])).toContain('A');
    expect(listFolder(['F', 'A'], houses)!.entries.every((entry) => entry.kind === 'designer' && letterOf(entry.name) === 'A')).toBe(true);
    expect(letterOf('Émile')).toBe('E');
    expect(letterOf('99%IS')).toBe('#');
  });

  it('files brands by market position, High Luxury first, each with its city', () => {
    expect(names(['D'])).toEqual(['High Luxury', 'Luxury', 'Premium', 'Mid-market', 'Budget']);
    const top = listFolder(['D', 'High Luxury'], houses)!;
    expect(top.address).toBe('D:\\High Luxury');
    const dior = top.entries.find((entry) => entry.name === 'Dior')!;
    expect(dior.info).toMatch(/^Paris/);
    expect(top.entries.every((entry) => entry.kind === 'house' && entry.house.tags.marketPositioning === 'High Luxury')).toBe(true);
    const visible = houses.filter((house) => house.id === 'dior');
    expect(names(['D'], visible)).toEqual(['High Luxury']);
    expect(listFolder(['D', 'Budget'], visible)).toBeNull();
  });

  it('falls back to the nearest folder that still exists', () => {
    expect(listFolder(['C', 'Atlantis'], houses)).toBeNull();
    expect(listFolder(['X'], houses)).toBeNull();
    const dior = houses.filter((house) => house.id === 'dior');
    expect(nearestFolder(['C', 'North America', 'CA', 'Vancouver'], dior).path).toEqual(['C']);
  });
});
