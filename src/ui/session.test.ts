// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest';
import { initialDesk, openItem, tool } from './desktop';
import { readSession, validDesk, writeSessionState } from './session';

afterEach(() => sessionStorage.clear());

describe('session', () => {
  it('brings windows, moved places, the selection and the map view back', () => {
    const anchor = { left: 1, top: 2, right: 3, bottom: 4 };
    let desk = openItem(openItem(initialDesk(), { kind: 'house', id: 'dior' }), tool('list'));
    desk = { ...desk, windows: desk.windows.map((w) => ({ ...w, anchor, minimized: w.item.kind === 'house' })) };
    const rect = { x: 5, y: 6, width: 400, height: 300 };
    const rest = { selection: { kind: 'house', id: 'dior' } as const, mapState: 'minimized' as const, connectionFilter: 'designers' as const, map: { zoom: 2, x: 1, y: 2, open: ['Paris'] } };
    writeSessionState({ desk, rects: { [desk.windows[0]!.key]: rect }, ...rest });
    const back = readSession()!;
    expect(back).toMatchObject({ ...rest, rects: { 'props-1': rect } });
    expect(back.desk).toMatchObject({ order: desk.order, active: desk.active, nextKey: 3 });
    expect(back.desk.windows.map((w) => [w.item.id, w.minimized, w.anchor])).toEqual([['dior', true, undefined], ['list', false, anchor]]);
  });

  it('drops what is malformed or gone', () => {
    sessionStorage.setItem('designer-map:session', '{bad');
    expect(readSession()).toBeUndefined();
    const window = (key: string, item: unknown) => ({ key, item, minimized: false, slot: 1 });
    const desk = validDesk({ windows: [window('props-4', { kind: 'house', id: 'dior' }), window('props-5', { kind: 'house', id: 'goneBrand' }),
      window('props-6', { kind: 'house', id: 'dior' }), window('x', { kind: 'tool', id: 'help' }), window('props-7', { kind: 'tool', id: 'toString' }), null], order: ['props-5'], active: 'props-5' });
    expect(desk.windows.map((w) => w.key)).toEqual(['props-4']);
    expect(desk).toMatchObject({ order: ['props-4'], active: null, nextKey: 5 });
    expect(validDesk('nope')).toEqual(initialDesk());
  });
});
