import { describe, expect, it } from 'vitest';
import { anchoredRect } from './side-panel';
import { MAX_DESIGNER_WINDOWS, MAX_LOCATION_WINDOWS, MAX_PROPERTY_WINDOWS, anchorWindow, closeWindows, initialDesk, minimizeWindows, openItem, openItemAt, restoreWindows, sameItem, type Desk, type Item } from './desktop';

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

describe('anchored windows', () => {
  const pin = { left: 300, top: 200, right: 320, bottom: 226 };
  it('remembers the pin a place window was opened from, and the new pin when reused', () => {
    let desk = openItemAt(initialDesk(), { kind: 'city', id: 'Paris' }, pin);
    expect(desk.windows[0]!.anchor).toEqual(pin);
    for (let i = 0; i < MAX_LOCATION_WINDOWS; i += 1) desk = openItemAt(desk, { kind: 'city', id: `City ${i}` }, { ...pin, left: i });
    expect(desk.windows.find((w) => sameItem(w.item, { kind: 'city', id: 'City 9' }))!.anchor!.left).toBe(9);
    expect(openItem(initialDesk(), { kind: 'city', id: 'Paris' }).windows[0]!.anchor).toBeUndefined();
  });

  it('places the window beside the pin, flipping left near the right edge', () => {
    const area = { width: 1200, height: 800 };
    const size = { width: 300, height: 260 };
    const right = anchoredRect(area, pin, size);
    expect(right.x).toBe(pin.right + 8);
    expect(right.y).toBeGreaterThanOrEqual(pin.top - 12);
    expect(right.y).toBeLessThanOrEqual(pin.bottom);
    const edge = anchoredRect(area, { left: 1100, top: 200, right: 1120, bottom: 226 }, size);
    expect(edge.x + edge.width).toBe(1100 - 8);
    const low = anchoredRect(area, { left: 300, top: 780, right: 320, bottom: 800 }, size);
    expect(low.y + low.height).toBeLessThanOrEqual(area.height);
  });

  it('anchors an open window after it opens, e.g. beside a brand\'s city', () => {
    const desk = openItem(initialDesk(), { kind: 'house', id: 'dior' });
    const key = desk.windows[0]!.key;
    expect(anchorWindow(desk, key, pin).windows[0]!.anchor).toEqual(pin);
    expect(anchorWindow(desk, 'missing', pin)).toBe(desk);
  });
});
