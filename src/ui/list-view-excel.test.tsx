// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { houses } from '../data';
import { formatPainter, getSheet, LAYOUT_KEY, listRows, ListViewContent, rangeHtml, readLayout, subtotalLines, validFormats } from './list-view';
import { blockEdge, copyBlock, cycle, parseReference, rectOf } from './list-view-select';
import { crc32, xlsxFiles, zip } from './list-view-xlsx';

afterEach(() => { cleanup(); localStorage.clear(); vi.restoreAllMocks(); });
const brands = getSheet('brands');
const index = (id: string) => brands.columns.findIndex((column) => column.id === id);
const plain = { sort: brands.defaultSort, filters: {}, search: '', hiddenRows: [], subtotals: null, collapsed: [] };

describe('selection arithmetic', () => {
  it('reads typed references', () => {
    expect(parseReference('b4')).toEqual([{ col0: 1, col1: 1, row0: 4, row1: 4 }]);
    expect(parseReference('$C$50:A1')).toEqual([{ col0: 0, col1: 2, row0: 1, row1: 50 }]);
    expect(parseReference('B:D, 5:9')).toEqual([{ col0: 1, col1: 3 }, { row0: 5, row1: 9 }]);
    for (const bad of ['', '5', 'hello there', 'A0', 'A1:B', 'A1:2', 'A1:B2:C3', ':']) expect(parseReference(bad)).toBeUndefined();
  });

  it('copies areas that line up, and refuses the rest', () => {
    expect(copyBlock([rectOf(0, 0, 4, 0), rectOf(0, 3, 4, 3)])).toEqual({ rows: [0, 1, 2, 3, 4], columns: [0, 3] });
    expect(copyBlock([rectOf(0, 0, 1, 0), rectOf(5, 3, 6, 3)])).toBeUndefined();
  });

  it('walks Tab and Enter through areas, wrapping', () => {
    const rects = [rectOf(0, 0, 1, 1), rectOf(5, 3)];
    expect(cycle(rects, 0, 1, 'row', 1)).toEqual({ r: 1, p: 0 });
    expect(cycle(rects, 0, 0, 'column', 1)).toEqual({ r: 1, p: 0 });
    expect(cycle(rects, 1, 1, 'row', 1)).toEqual({ r: 5, p: 3 });
    expect(cycle(rects, 5, 3, 'row', 1)).toEqual({ r: 0, p: 0 });
    expect(cycle(rects, 0, 0, 'row', -1)).toEqual({ r: 5, p: 3 });
  });

  it('finds the edge of a block of filled cells', () => {
    const cells = [1, 1, 1, 0, 0, 1, 0];
    const edge = (from: number, step: 1 | -1) => blockEdge(from, 0, 6, step, (i) => !!cells[i]);
    expect([edge(0, 1), edge(2, 1), edge(5, 1), edge(6, -1), edge(5, -1), edge(0, -1)]).toEqual([2, 5, 6, 5, 2, 0]);
  });
});

describe('Spreadsheet data operations', () => {
  it('filters by several ticked values and blanks', () => {
    const country = index('country'), closed = index('closed');
    const two = listRows(brands, { ...plain, filters: { country: { kind: 'values', values: ['France', 'Italy'], blanks: false } } }).shown;
    expect(new Set(two.map((row) => row.cells[country]![0]))).toEqual(new Set(['France', 'Italy']));
    const years = listRows(brands, { ...plain, filters: { closed: { kind: 'values', values: ['2020'], blanks: true } } }).shown;
    expect(years.every((row) => !row.cells[closed]!.length || row.cells[closed]![0] === '2020')).toBe(true);
    expect(years.length).toBe(houses.filter((h) => h.closed === undefined || h.closed === 2020).length);
  });

  it('subtotals groups, totals them, and collapses to totals', () => {
    const subtotals = { by: 'country', fn: 'count', columns: ['name'] } as const;
    const all = listRows(brands, { ...plain, subtotals });
    const lines = all.lines.filter((row) => row.subtotal);
    expect(lines.length).toBe(new Set(houses.map((h) => h.country)).size + 1);
    const grand = lines.at(-1)!;
    expect(grand.cells[index('name')]).toEqual([String(houses.length)]);
    expect(lines.slice(0, -1).reduce((sum, row) => sum + Number(row.cells[index('name')]![0]), 0)).toBe(houses.length);
    const closed = listRows(brands, { ...plain, subtotals, collapsed: [lines[0]!.subtotal!.group] });
    expect(closed.shown.length).toBe(all.shown.length - Number(lines[0]!.cells[index('name')]![0]));
    const founded = index('founded'), rows = brands.rows().filter((row) => row.cells[founded]!.length).slice(0, 5);
    expect(subtotalLines(brands, rows, { by: 'name', fn: 'max', columns: ['founded'] }).at(-1)!.cells[founded])
      .toEqual([String(Math.max(...rows.map((row) => Number(row.cells[founded]![0]))))]);
  });

  it('paints conditional formats and drops stored ones that no longer fit', () => {
    const bars = formatPainter(brands, index('collaborations'), { kind: 'bars', color: '#99ccff' });
    expect(Math.max(...brands.rows().map((row) => bars(row)?.bar ?? 0))).toBe(1);
    const high = formatPainter(brands, index('founded'), { kind: 'highlight', condition: { op: 'less', operand: '1900' }, color: '#ffff99' });
    expect(brands.rows().filter((row) => high(row)).length).toBe(houses.filter((h) => h.founded !== undefined && h.founded < 1900).length);
    expect(Object.keys(validFormats(brands, { name: { kind: 'bars', color: '#99ccff' }, tier: { kind: 'values' }, gone: { kind: 'values' }, city: null }))).toEqual(['tier']);
  });

  it('copies formatted cells with links', () => {
    const html = rangeHtml(brands.rows().slice(0, 1), [0, index('founded')], brands, true, () => 'https://example.com/?a=1&b=2');
    expect(html).toContain('<b>Brand</b>');
    expect(html).toContain('href="https://example.com/?a=1&amp;b=2"');
  });

  it('writes a well-formed workbook', async () => {
    const files = xlsxFiles([{ sheet: brands, rows: brands.rows().slice(0, 30).map((row) => ({ row })), columns: [0, 3, 5], widths: [190, 84, 96],
      freeze: { rows: 0, cols: 1 }, formats: { founded: { kind: 'scale' }, tier: { kind: 'values' } }, tabColor: '#ff0000', greyEnded: true, gridlines: true, outline: false, href: (link) => link.kind === 'house' ? `https://example.com/#brand=${link.id}` : undefined }]);
    for (const xml of files.values()) expect(new DOMParser().parseFromString(xml, 'application/xml').querySelector('parsererror')).toBeNull();
    expect(files.get('xl/worksheets/sheet1.xml')).toContain('<autoFilter ref="A1:C31"/>');
    expect(files.get('xl/worksheets/_rels/sheet1.xml.rels')).toContain('https://example.com/#brand=');
    expect(crc32(new TextEncoder().encode('123456789'))).toBe(0xcbf43926);
    const bytes = await zip(new Map([['a.txt', 'hello']]));
    expect([...bytes.slice(0, 4)]).toEqual([0x50, 0x4b, 3, 4]);
  });

  it('keeps old layouts readable and drops bad tab settings', () => {
    localStorage.setItem(LAYOUT_KEY, JSON.stringify({ freeze: false, hiddenTabs: ['brands', 'groups', 'x'], tabColors: { brands: '#ff0000', groups: 'url(x)' }, sheets: { brands: { order: ['city', 'gone', 'name'] } } }));
    const layout = readLayout();
    expect(layout.sheets.brands!.freeze).toEqual({ rows: 0, cols: 0 });
    expect(layout.hiddenTabs).toEqual(['groups']);
    expect(layout.tabColors).toEqual({ brands: '#ff0000' });
    expect(layout.sheets.brands!.order!.slice(0, 2)).toEqual(['city', 'name']);
    expect(layout.sheets.brands!.order).toHaveLength(brands.columns.length);
  });
});

describe('Spreadsheet window', () => {
  const setup = () => {
    const onSelect = vi.fn();
    render(<ListViewContent onSelect={onSelect} onOpenPlace={() => {}} onHelp={() => {}} onClose={() => {}} />);
    const user = userEvent.setup();
    const writeText = vi.fn((_text: string) => Promise.resolve());
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    return { onSelect, user, writeText };
  };
  const table = () => screen.getByRole('table', { name: 'Brands' });
  const grid = () => screen.getByRole('region', { name: 'Brands worksheet' });
  const letters = () => [...within(table()).getAllByRole('row')[0]!.querySelectorAll('th')];
  const fields = () => [...within(table()).getAllByRole('row')[1]!.querySelectorAll('.xl-field-label')].map((e) => e.textContent);
  const body = () => within(table()).getAllByRole('row').slice(2).filter((r) => r.querySelector('td[data-cell]'));
  const cellAt = (r: number, c: number) => body()[r]!.querySelectorAll('td')[c]!;
  const box = () => screen.getByRole('textbox', { name: 'Name Box' }) as HTMLInputElement;
  const menu = async (user: ReturnType<typeof userEvent.setup>, name: string, item: string) => {
    await user.click(screen.getByRole('menuitem', { name }));
    await user.click(screen.getByRole('menuitem', { name: item }));
  };

  it('Ctrl+clicks separate columns, copies them together and marks the copy until Esc', async () => {
    const { user, writeText } = setup();
    fireEvent.pointerDown(letters()[1]!, { button: 0 });
    fireEvent.pointerUp(window);
    fireEvent.pointerDown(letters()[4]!, { button: 0, ctrlKey: true });
    fireEvent.pointerUp(window);
    expect([0, 1, 3].map((c) => cellAt(0, c).classList.contains('in-range'))).toEqual([true, false, true]);
    await user.keyboard('{Control>}c{/Control}');
    expect(writeText.mock.calls[0]![0].split('\n')[0]).toBe('Brand\tFounded');
    expect(cellAt(0, 0).className).toContain('ants-left');
    await user.keyboard('{Escape}');
    expect(cellAt(0, 0).className).not.toContain('ants');
  });

  it('refuses to copy areas that do not line up', async () => {
    const { user, writeText } = setup();
    fireEvent.pointerDown(cellAt(0, 0), { button: 0 });
    fireEvent.pointerDown(cellAt(2, 2), { button: 0, ctrlKey: true });
    await user.keyboard('{Control>}c{/Control}');
    expect(writeText).not.toHaveBeenCalled();
    expect(screen.getByRole('alert').textContent).toMatch(/multiple selections/);
    await user.click(screen.getByRole('button', { name: 'OK' }));
  });

  it('goes to typed references and warns about bad ones', async () => {
    const { user } = setup();
    await user.click(box());
    await user.keyboard('{Control>}a{/Control}C5{Enter}');
    expect(box().value).toBe('C5');
    expect(cellAt(3, 2).className).toContain('active');
    grid().focus();
    await user.keyboard('{F5}');
    await user.type(screen.getByRole('textbox', { name: 'Reference:' }), 'A1:B3{Enter}');
    expect(cellAt(1, 1).className).toContain('in-range');
    await user.click(box());
    await user.keyboard('{Control>}a{/Control}nonsense{Enter}');
    expect(screen.getByRole('alert').textContent).toContain('nonsense');
  });

  it('selects columns and rows from the keyboard and tabs within the selection', async () => {
    const { user } = setup();
    grid().focus();
    await user.keyboard('{ArrowRight}{Shift>} {/Shift}');
    expect(cellAt(0, 3).className).toContain('in-range');
    await user.keyboard('{Tab}');
    expect(box().value).toBe('B2');
    expect(cellAt(0, 3).className).toContain('in-range');
    await user.keyboard('{ArrowDown}{Control>} {/Control}');
    expect(cellAt(4, 1).className).toContain('in-range');
    await user.keyboard('{Enter}');
    expect(box().value).toBe('B2');
  });

  it('ticks several AutoFilter values', async () => {
    const { user } = setup();
    await user.click(screen.getByRole('button', { name: 'Filter Country' }));
    for (const name of ['France', 'Italy']) await user.click(document.querySelector(`[data-tick="${name}"]`)!);
    await user.click(screen.getByRole('button', { name: 'OK' }));
    const count = houses.filter((h) => h.country === 'FR' || h.country === 'IT').length;
    expect(screen.getByRole('status').textContent).toBe(`${count} of ${houses.length.toLocaleString()} records found`);
    expect(screen.getByRole('button', { name: 'Filter Country (France, Italy)' })).toBeTruthy();
  });

  it('hides and unhides rows from the row number menu', async () => {
    const { user } = setup();
    const first = cellAt(0, 0).textContent;
    fireEvent.contextMenu(body()[0]!.querySelector('th')!);
    await user.click(screen.getByRole('menuitem', { name: 'Hide Row' }));
    expect(cellAt(0, 0).textContent).not.toBe(first);
    expect(body()[0]!.querySelector('th')!.textContent).toBe('3');
    await menu(user, 'Format', 'Unhide Rows');
    expect(cellAt(0, 0).textContent).toBe(first);
  });

  it('hides every selected column at once', async () => {
    const { user } = setup();
    fireEvent.pointerDown(letters()[2]!, { button: 0 });
    fireEvent.pointerDown(letters()[3]!, { button: 0, shiftKey: true });
    fireEvent.pointerUp(window);
    fireEvent.contextMenu(letters()[2]!);
    await user.click(screen.getByRole('menuitem', { name: 'Hide 2 Columns' }));
    expect(fields().slice(0, 2)).toEqual(['Brand', 'Founded']);
  });

  it('moves columns by dragging a selected letter, or from the menu, and remembers the order', async () => {
    const { user } = setup();
    fireEvent.pointerDown(letters()[2]!, { button: 0, clientX: 300 });
    fireEvent.pointerUp(window);
    fireEvent.pointerDown(letters()[2]!, { button: 0, clientX: 300 });
    fireEvent.pointerMove(window, { buttons: 1, clientX: 450 });
    fireEvent.pointerUp(window);
    expect(fields().slice(0, 3)).toEqual(['Brand', 'Country', 'City']);
    expect(letters().slice(1, 4).map((e) => e.textContent)).toEqual(['A', 'B', 'C']);
    fireEvent.contextMenu(letters()[3]!);
    await user.click(screen.getByRole('menuitem', { name: 'Move Left' }));
    expect(fields().slice(0, 3)).toEqual(['Brand', 'City', 'Country']);
    await user.click(screen.getByRole('menuitem', { name: 'Format' }));
    await user.click(screen.getByRole('menuitem', { name: 'Reset Column Order' }));
    fireEvent.contextMenu(letters()[2]!);
    await user.click(screen.getByRole('menuitem', { name: 'Move Right' }));
    cleanup();
    setup();
    expect(fields().slice(0, 3)).toEqual(['Brand', 'Country', 'City']);
  });

  it('freezes panes at the active cell', async () => {
    const { user } = setup();
    fireEvent.pointerDown(cellAt(2, 2), { button: 0 });
    await menu(user, 'Window', 'Freeze Panes at C4');
    expect(cellAt(1, 1).className).toContain('xl-pinned-edge');
    expect(cellAt(5, 1).className).toContain('xl-frozen-edge');
    expect(cellAt(1, 1).style.top).toBe('51px');
    await menu(user, 'Window', 'Unfreeze Panes');
    expect(cellAt(1, 1).className).not.toMatch(/xl-pinned|xl-frozen/);
  });

  it('finds the next match and says when there is none', async () => {
    const { user } = setup();
    grid().focus();
    await user.keyboard('{Control>}f{/Control}');
    const find = within(screen.getByRole('dialog', { name: 'Find' }));
    await user.type(find.getByRole('textbox', { name: 'Find what:' }), 'tokyo{Enter}');
    const first = box().value;
    expect(first).toMatch(/^B/);
    await user.click(find.getByRole('button', { name: 'Find Next' }));
    expect(box().value).not.toBe(first);
    await user.type(find.getByRole('textbox', { name: 'Find what:' }), 'zzzz{Enter}');
    expect(find.getByRole('alert')).toBeTruthy();
  });

  it('adds subtotals and collapses them with the outline levels', async () => {
    const { user, onSelect } = setup();
    fireEvent.pointerDown(cellAt(0, 2), { button: 0 });
    await menu(user, 'Data', 'Subtotals…');
    await user.click(screen.getByRole('button', { name: 'OK' }));
    expect(screen.getByRole('status').textContent).toBe('Ready');
    await user.click(screen.getByRole('button', { name: 'Outline level 2' }));
    expect(body()[0]!.className).toContain('xl-subtotal');
    expect(body()[0]!.textContent).toMatch(/Count/);
    await user.click(within(body()[0]!).getByRole('button'));
    expect(body()[0]!.className).not.toContain('xl-subtotal');
    await user.click(screen.getByRole('button', { name: 'Outline level 1' }));
    expect(body()).toHaveLength(1);
    fireEvent.doubleClick(body()[0]!);
    expect(onSelect).not.toHaveBeenCalled();
    expect(body().length).toBeGreaterThan(1);
    await menu(user, 'Data', 'Remove Subtotals');
    expect(document.querySelector('.xl-subtotal')).toBeNull();
  });

  it('colours cells with a conditional format', async () => {
    const { user } = setup();
    fireEvent.pointerDown(cellAt(0, 5), { button: 0 });
    await menu(user, 'Format', 'Conditional Formatting…');
    await user.click(screen.getByRole('button', { name: 'OK' }));
    expect(cellAt(3, 5).style.backgroundColor).not.toBe('');
    await menu(user, 'Format', 'Clear Conditional Formats');
    expect(cellAt(3, 5).style.backgroundColor).toBe('');
  });

  it('colours, hides and unhides sheet tabs', async () => {
    const { user } = setup();
    fireEvent.contextMenu(screen.getByRole('tab', { name: 'Brands' }));
    await user.click(screen.getByRole('menuitem', { name: 'Tab Color…' }));
    await user.click(screen.getByRole('radio', { name: 'Red' }));
    await user.click(screen.getByRole('button', { name: 'OK' }));
    expect(screen.getByRole('tab', { name: 'Brands' }).className).toContain('coloured');
    fireEvent.contextMenu(screen.getByRole('tab', { name: 'Brands' }));
    await user.click(screen.getByRole('menuitem', { name: 'Hide' }));
    expect(screen.queryByRole('tab', { name: 'Brands' })).toBeNull();
    expect(screen.getByRole('tab', { name: 'Groups' }).getAttribute('aria-selected')).toBe('true');
    fireEvent.contextMenu(screen.getByRole('tab', { name: 'Groups' }));
    await user.click(screen.getByRole('menuitem', { name: 'Unhide Brands' }));
    expect(screen.getByRole('tab', { name: 'Brands' })).toBeTruthy();
  });
});
