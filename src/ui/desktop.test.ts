import { describe, expect, it } from 'vitest';
import { MAX_DESIGNER_WINDOWS, MAX_LOCATION_WINDOWS, MAX_PROPERTY_WINDOWS, closeWindows, initialDesk, minimizeWindows, openItem, restoreWindows, type Desk, type Item } from './desktop';

const open = (items: Item[], desk: Desk = initialDesk()) => items.reduce(openItem, desk);
const ids = (desk: Desk) => desk.windows.map((w) => w.item.id);
const brands = (n: number, prefix = 'brand') => Array.from({ length: n }, (_, i): Item => ({ kind: 'house', id: `${prefix}${i}` }));

describe('window limits', () => {
  it.each([
    ['brand', MAX_PROPERTY_WINDOWS, (i: number): Item => ({ kind: 'house', id: `h${i}` })],
    ['designer', MAX_DESIGNER_WINDOWS, (i: number): Item => ({ kind: 'designer', id: `d${i}` })],
    ['location', MAX_LOCATION_WINDOWS, (i: number): Item => ({ kind: 'city', id: `c${i}` })],
  ])('keeps up to the %s limit open, then reuses the least recently used', (_, limit, item) => {
    let desk = open(Array.from({ length: limit }, (_, i) => item(i)));
    expect(desk.windows).toHaveLength(limit);
    // Re-focusing the first leaves the second as the least recently used.
    desk = openItem(desk, item(0));
    desk = openItem(desk, item(limit));
    expect(desk.windows).toHaveLength(limit);
    expect(ids(desk)).toContain(item(0).id);
    expect(ids(desk)).toContain(item(limit).id);
    expect(ids(desk)).not.toContain(item(1).id);
  });

  it('counts each window type separately', () => {
    const desk = open([...brands(MAX_PROPERTY_WINDOWS), { kind: 'designer', id: 'raf' }, { kind: 'city', id: 'Paris' }]);
    expect(desk.windows).toHaveLength(MAX_PROPERTY_WINDOWS + 2);
    expect(ids(desk)).toContain('brand0');
  });
});

describe('taskbar group commands', () => {
  it('minimizes, restores and closes several windows together', () => {
    let desk = open(brands(2));
    const keys = desk.windows.map((w) => w.key);
    desk = minimizeWindows(desk, keys);
    expect(desk.windows.every((w) => w.minimized)).toBe(true);
    desk = restoreWindows(desk, keys);
    expect(desk.windows.some((w) => w.minimized)).toBe(false);
    expect(desk.active).toBe(keys.at(-1));
    desk = closeWindows(desk, keys);
    expect(desk.windows).toEqual([]);
  });
});
