import { describe, expect, it } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { AwardId, awardInfo, awardRecipients, awardsOf, designers, getDesigner } from './index';
import { validateData } from './validate';
import { PanelContent } from '../ui/panel';
import { AwardWindowContent } from '../ui/award-window';
import { awardItem, initialDesk, isSelectionItem, openItem, windowType } from '../ui/desktop';
import { windowTitle } from '../ui/desk-windows';
import { validDesk } from '../ui/session';
import type { AwardRecord } from '../types';

describe('designer awards', () => {
  it('has display info for every award id, with unique names', () => {
    const ids = Object.values(AwardId);
    expect(Object.keys(awardInfo).sort()).toEqual([...ids].sort());
    const names = ids.map((id) => awardInfo[id].name);
    expect(new Set(names).size).toBe(names.length);
  });

  it('only references standardized awards', () => {
    const known = new Set<string>(Object.values(AwardId));
    for (const d of designers) for (const a of d.awards ?? []) expect(known.has(a.award), `${d.id}: ${a.award}`).toBe(true);
  });

  it('sorts awards by year, undated last', () => {
    expect(awardsOf('rafSimons').map((a) => `${a.year} ${a.award}`)).toEqual([
      `2003 ${AwardId.SwissTextilesAward}`,
      `2014 ${AwardId.CfdaInternationalAward}`,
      `2017 ${AwardId.BfaDesignerOfTheYear}`,
      `2017 ${AwardId.CfdaMenswearDesigner}`,
      `2017 ${AwardId.CfdaWomenswearDesigner}`,
      `2018 ${AwardId.CfdaWomenswearDesigner}`,
      `2020 ${AwardId.BfaLeaderOfChange}`,
      `2022 ${AwardId.BfaLeaderOfChange}`,
    ]);
    expect(awardsOf('nobody')).toEqual([]);
  });

  it('rejects duplicates, future years and awards before birth', () => {
    const designer = getDesigner('rafSimons')!;
    const original = designer.awards;
    const add = (...extra: AwardRecord[]) => { designer.awards = [...(original ?? []), ...extra]; };
    try {
      add({ award: AwardId.CfdaWomenswearDesigner, year: 2017 });
      expect(validateData()).toContain(`rafSimons award ${AwardId.CfdaWomenswearDesigner} (2017): listed twice`);
      add({ award: AwardId.Obe, year: new Date().getFullYear() + 1 });
      expect(validateData().some((p) => p.endsWith('year is in the future'))).toBe(true);
      add({ award: AwardId.Obe, year: 1960 });
      expect(validateData()).toContain(`rafSimons award ${AwardId.Obe} (1960): before the designer was born`);
      add({ award: AwardId.Obe, approximate: true });
      expect(validateData()).toContain(`rafSimons award ${AwardId.Obe} (undated): approximate needs a year`);
    } finally {
      designer.awards = original;
    }
    expect(validateData()).toEqual([]);
  });

  it('shows an Awards section in designer Properties only when awards exist', () => {
    const render = (id: string, onOpenAward?: (award: AwardId) => void) => renderToStaticMarkup(createElement(PanelContent, { selection: { kind: 'designer', id }, onSelect: () => {}, onTag: () => {}, onOpenAward }));
    const raf = render('rafSimons', () => {});
    expect(raf).toContain('Awards (8)');
    expect(raf).toContain('<th>Brand</th>');
    expect(raf).toContain('data-select="house:calvinKlein"');
    expect(raf).toContain('data-select="house:dior"');
    expect(raf).toContain(`data-award="${AwardId.CfdaMenswearDesigner}"`);
    // Without an award window to open, award names are plain text.
    expect(render('rafSimons')).not.toContain('data-award=');
    const without = designers.find((d) => !d.awards?.length)!;
    expect(render(without.id)).not.toContain('Awards (');
  });

  it('lists an award’s recipients with their brands', () => {
    expect(awardRecipients(AwardId.CfdaWomenswearDesigner).filter((r) => r.designerId === 'rafSimons').map((r) => [r.year, r.house]))
      .toEqual([[2017, 'calvinKlein'], [2018, 'calvinKlein']]);
    const html = renderToStaticMarkup(createElement(AwardWindowContent, { award: AwardId.SwissTextilesAward, onSelect: () => {} }));
    expect(html).toContain('Swiss Textiles Award');
    expect(html).toContain('Presented by');
    expect(html).toContain('data-select="designer:rafSimons"');
    expect(renderToStaticMarkup(createElement(AwardWindowContent, { award: AwardId.OrderOfCulture, onSelect: () => {} }))).toContain('No recipients recorded.');
  });

  it('opens award windows of their own, kept after a refresh', () => {
    const item = awardItem(AwardId.CfdaWomenswearDesigner);
    expect(windowType(item)).toBe('award');
    expect(isSelectionItem(item)).toBe(false);
    expect(windowTitle(item)).toBe('CFDA Womenswear Designer of the Year');
    const desk = openItem(openItem(initialDesk(), item), item);
    expect(desk.windows).toHaveLength(1);
    const restored = validDesk({ ...desk, windows: [...desk.windows, { ...desk.windows[0], key: 'props-9', item: { kind: 'award', id: 'notAnAward' } }] });
    expect(restored.windows.map((w) => w.item)).toEqual([item]);
  });
});
