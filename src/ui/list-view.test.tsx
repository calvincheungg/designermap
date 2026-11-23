// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { collaborations, collaborationsOf, designers, groups, houses, isBusinessLeadership, labelsOf, tenuresAt } from '../data';
import { chartBars, niceScale } from './list-view-chart';
import { LAYOUT_KEY, readLayout, autoFitWidth, pivotTable, rangeStats, rangeTsv, valueCounts, columnLetter, columnValues, filterSheet, getSheet, ListViewContent, matchesColumnFilter, MIN_COLUMN_WIDTH, searchSheet, sheetCsv, sortSheet, websiteLabel, type Condition } from './list-view';

afterEach(() => { cleanup(); localStorage.clear(); });
const brands = getSheet('brands');
const rows = () => brands.rows();
const houseOf = (key: string) => houses.find((house) => house.id === key)!;

describe('Spreadsheet sheet logic', () => {
  it('letters columns like Excel', () => {
    expect([0, 1, 25, 26, 27].map(columnLetter)).toEqual(['A', 'B', 'Z', 'AA', 'AB']);
  });

  it('has a sheet per record type listing every record, ignoring the map filters', () => {
    expect(rows()).toHaveLength(houses.length);
    expect(getSheet('groups').rows()).toHaveLength(groups.length);
    expect(getSheet('designers').rows()).toHaveLength(designers.length);
    expect(getSheet('careers').rows()).toHaveLength(designers.reduce((sum, designer) => sum + designer.career.length, 0));
    expect(getSheet('collaborations').rows()).toHaveLength(collaborations.length);
    const cities = new Set(houses.flatMap((house) => house.origin ? [house.city, house.origin.city] : [house.city]));
    expect(getSheet('locations').rows()).toHaveLength(cities.size);
  });

  it("lists every brand based in a location, sublabels included, in its Brands drop-down", () => {
    const locations = getSheet('locations');
    const col = locations.columns.findIndex((column) => column.id === 'brands');
    const paris = locations.rows().find((row) => row.key === 'Paris')!;
    const based = houses.filter((house) => house.city === 'Paris');
    expect(paris.cells[col]).toEqual([String(based.length)]);
    expect(paris.menus[col]!.map((entry) => entry.label).sort()).toEqual(based.map((house) => house.name).sort());
    expect(locations.columns.some((column) => column.id === 'main')).toBe(false);
    // Searching Locations by a brand name finds its city.
    expect(searchSheet(locations.rows(), 'hermes').some((row) => row.key === 'Paris')).toBe(true);
  });

  it('shows brand websites and Instagram handles as links', () => {
    expect(websiteLabel('https://www.loewe.com/')).toBe('loewe.com');
    const website = brands.columns.findIndex((column) => column.id === 'website');
    const instagram = brands.columns.findIndex((column) => column.id === 'instagram');
    const row = rows().find((r) => houseOf(r.key).website && houseOf(r.key).instagram)!;
    expect(row.links[website]![0]).toEqual({ kind: 'url', href: houseOf(row.key).website });
    expect(row.cells[instagram]).toEqual([`@${houseOf(row.key).instagram}`]);
  });

  it('sorts numerically with blanks last in both directions', () => {
    for (const descending of [false, true]) {
      const years = sortSheet(brands, rows(), [{ column: 'founded', descending }]).map((row) => houseOf(row.key).founded);
      const known = years.filter((value) => value !== undefined) as number[];
      expect(known).toEqual([...known].sort((a, b) => descending ? b - a : a - b));
      expect(years.slice(known.length).every((value) => value === undefined)).toBe(true);
    }
  });

  it('sorts Market from High Luxury down', () => {
    const tiers = sortSheet(brands, rows(), [{ column: 'tier', descending: false }]).map((row) => houseOf(row.key).tags.marketPositioning);
    expect(tiers[0]).toBe('High Luxury');
    expect(tiers.at(-1)).toBe('Budget');
  });

  it('filters by value, blanks and custom conditions, AND across columns', () => {
    const luxury = filterSheet(brands, rows(), { tier: { kind: 'value', value: 'High Luxury' } });
    expect(luxury.length).toBeGreaterThan(0);
    expect(luxury.every((row) => houseOf(row.key).tags.marketPositioning === 'High Luxury')).toBe(true);
    const paris = filterSheet(brands, rows(), { tier: { kind: 'value', value: 'High Luxury' }, city: { kind: 'value', value: 'Paris' } });
    expect(paris.every((row) => houseOf(row.key).city === 'Paris')).toBe(true);
    expect(filterSheet(brands, rows(), { closed: { kind: 'nonBlanks' } }).every((row) => houseOf(row.key).closed !== undefined)).toBe(true);
    const custom = (...conditions: [Condition] | [Condition, Condition]) => ({ kind: 'custom' as const, join: 'and' as const, conditions });
    const old = filterSheet(brands, rows(), { founded: custom({ op: 'less', operand: '1900' }) });
    expect(old.length).toBeGreaterThan(0);
    expect(old.every((row) => houseOf(row.key).founded! < 1900)).toBe(true);
    expect(matchesColumnFilter(['Hermès'], custom({ op: 'contains', operand: 'HERMES' }))).toBe(true);
    expect(matchesColumnFilter(['Streetwear', 'Sportswear'], custom({ op: 'equals', operand: 'sportswear' }))).toBe(true);
    expect(matchesColumnFilter([], custom({ op: 'notContains', operand: 'x' }))).toBe(true);
    // Two conditions, joined by And or Or.
    const between = filterSheet(brands, rows(), { founded: custom({ op: 'greaterOrEqual', operand: '1900' }, { op: 'less', operand: '1950' }) });
    expect(between.length).toBeGreaterThan(0);
    expect(between.every((row) => houseOf(row.key).founded! >= 1900 && houseOf(row.key).founded! < 1950)).toBe(true);
    const either = filterSheet(brands, rows(), { city: { kind: 'custom', join: 'or', conditions: [{ op: 'equals', operand: 'Paris' }, { op: 'equals', operand: 'Milan' }] } });
    expect(new Set(either.map((row) => houseOf(row.key).city))).toEqual(new Set(['Paris', 'Milan']));
  });

  it('keeps the Top 10 (or a percent) of a number column, with ties', () => {
    const oldest = filterSheet(brands, rows(), { founded: { kind: 'top', bottom: true, amount: 10, percent: false } });
    const years = houses.flatMap((house) => house.founded ?? []).sort((a, b) => a - b);
    expect(oldest.length).toBeGreaterThanOrEqual(10);
    expect(oldest.every((row) => houseOf(row.key).founded! <= years[9]!)).toBe(true);
    const newest = filterSheet(brands, rows(), { founded: { kind: 'top', bottom: false, amount: 1, percent: true } });
    expect(newest.length).toBeGreaterThanOrEqual(Math.ceil(years.length / 100));
  });

  it('sorts by several keys in priority order', () => {
    const sorted = sortSheet(brands, rows(), [{ column: 'country', descending: false }, { column: 'founded', descending: true }]);
    for (let i = 1; i < sorted.length; i++) {
      const [a, b] = [houseOf(sorted[i - 1]!.key), houseOf(sorted[i]!.key)];
      if (a.country === b.country && a.founded !== undefined && b.founded !== undefined) expect(a.founded).toBeGreaterThanOrEqual(b.founded);
    }
  });

  it('writes the shown rows and columns as CSV, quoting lists', () => {
    const shown = filterSheet(brands, rows(), { city: { kind: 'value', value: 'Paris' } }).slice(0, 3);
    const category = brands.columns.findIndex((column) => column.id === 'category');
    const csv = sheetCsv(brands, shown, [0, category]).split('\r\n');
    expect(csv[0]).toBe('Brand,Category');
    expect(csv).toHaveLength(5);
    expect(csv[1]).toBe(`${shown[0]!.name},${shown[0]!.cells[category]!.length > 1 ? `"${shown[0]!.cells[category]!.join(', ')}"` : shown[0]!.cells[category]![0]}`);
    expect(sheetCsv(brands, [], [0])).toBe('Brand\r\n');
  });

  it('AutoFits a column to its widest entry', () => {
    const measure = (text: string) => text.length * 7;
    const widest = Math.max(...rows().map((row) => row.name.length));
    expect(autoFitWidth(brands, 0, measure)).toBe(Math.ceil(widest * 7 + 10));
  });

  it('searches every cell for all typed words, ignoring case and accents', () => {
    const found = searchSheet(rows(), 'hermes paris');
    expect(found.some((row) => row.key === 'hermes')).toBe(true);
    expect(found.every((row) => row.cells.flat().join(' ').toLowerCase().normalize('NFD').replace(/\p{M}/gu, '').includes('paris'))).toBe(true);
    expect(searchSheet(rows(), '  ')).toHaveLength(houses.length);
  });

  it("offers the values left by the other columns' filters", () => {
    const parisRows = filterSheet(brands, rows(), { city: { kind: 'value', value: 'Paris' } });
    expect(columnValues(brands, parisRows, 'country').values).toEqual(['France']);
  });
});

describe('Spreadsheet computed columns, charts, pivots and ranges', () => {
  const col = (id: string) => brands.columns.findIndex((column) => column.id === id);
  it('adds creative director, collaboration and sublabel columns to Brands', () => {
    for (const row of rows().slice(0, 300)) {
      const directors = tenuresAt(row.key).filter((t) => t.role !== 'Other' && !isBusinessLeadership(t));
      expect(row.cells[col('directors')]).toEqual([String(new Set(directors.map((t) => t.designerId)).size)]);
      expect(row.cells[col('currentDirector')]!.length).toBe(new Set(directors.filter((t) => t.end === null).map((t) => t.designerId)).size);
      expect(row.cells[col('collaborations')]).toEqual([String(collaborationsOf(row.key).length)]);
      expect(row.cells[col('sublabels')]).toEqual([String(labelsOf(row.key).length)]);
      expect(row.menus[col('sublabels')]!.map((entry) => entry.label).sort()).toEqual(labelsOf(row.key).map((h) => h.name).sort());
    }
  });

  it('counts values by decade for year columns', () => {
    const counts = valueCounts(brands, rows(), col('founded'), true);
    const nineties = counts.find((bucket) => bucket.label === '1990s')!;
    expect(nineties.count).toBe(houses.filter((h) => h.founded !== undefined && h.founded >= 1990 && h.founded < 2000).length);
    expect(filterSheet(brands, rows(), { founded: nineties.filter })).toHaveLength(nineties.count);
    expect(counts.at(-1)!.label).toBe('(blank)');
  });

  it('builds a PivotTable whose counts match the filters they open', () => {
    const pivot = pivotTable(brands, rows(), col('country'), col('tier'), true, 'total');
    expect(pivot.total).toBe(houses.length);
    expect(pivot.rows[0]!.label).toBe('USA');
    for (const r of pivot.rows.slice(0, 4)) for (const c of pivot.columns) {
      const expected = filterSheet(brands, rows(), { country: r.filter, tier: c.filter }).length;
      expect(pivot.counts.get(r.key)?.get(c.key) ?? 0).toBe(expected);
    }
    expect([...pivot.columnTotals.values()].reduce((a, b) => a + b, 0)).toBe(houses.length);
  });

  it('keeps the top N bars and folds the rest into Other, on a round axis', () => {
    const { bars, other } = chartBars(brands, rows(), col('country'), { top: 5, sort: 'count', decades: false });
    expect(bars).toHaveLength(5);
    expect(bars[0]!.count).toBeGreaterThanOrEqual(bars[4]!.count);
    expect(other!.count).toBe(houses.length - bars.reduce((sum, bar) => sum + bar.count, 0));
    expect(other!.values).toBe(new Set(houses.map((h) => h.country)).size - 5);
    expect(niceScale(87)).toEqual({ max: 100, step: 50 });
    expect(niceScale(0)).toEqual({ max: 1, step: 1 });
  });

  it('sums a range and copies it as tab-separated text', () => {
    const sample = rows().slice(0, 3);
    const founded = col('founded');
    const stats = rangeStats(brands, sample, [0, founded]);
    const years = sample.flatMap((row) => row.cells[founded]!.map(Number));
    expect(stats.count).toBe(3 + years.length);
    expect(stats.sum).toBe(years.reduce((a, b) => a + b, 0));
    expect(rangeTsv(brands, sample, [0, founded], true).split('\n')[0]).toBe('Brand\tFounded');
    expect(rangeTsv(brands, sample, [0, founded]).split('\n')).toHaveLength(3);
  });
});

describe('ListViewContent', () => {
  const setup = () => {
    const onSelect = vi.fn(), onOpenPlace = vi.fn();
    render(<ListViewContent onSelect={onSelect} onOpenPlace={onOpenPlace} onHelp={() => {}} onClose={() => {}} />);
    return { onSelect, onOpenPlace, user: userEvent.setup() };
  };
  const table = (name = 'Brands') => screen.getByRole('table', { name });
  const firstRow = (name?: string) => within(table(name)).getAllByRole('row')[2]!;
  const status = () => screen.getByRole('status').textContent;

  it('sorts from the toolbar by the active cell column', async () => {
    const { user } = setup();
    expect(firstRow().textContent).toContain(sortSheet(brands, rows(), [{ column: 'name', descending: false }])[0]!.name);
    await user.click(screen.getByRole('button', { name: 'Sort Descending' }));
    expect(firstRow().textContent).toContain(sortSheet(brands, rows(), [{ column: 'name', descending: true }])[0]!.name);
    expect(screen.getByRole('columnheader', { name: /^Brand/ }).getAttribute('aria-sort')).toBe('descending');
  });

  it('applies AutoFilter values, Show All, and opens brands from their names', async () => {
    const { user, onSelect } = setup();
    await user.click(screen.getByRole('button', { name: 'Filter City' }));
    await user.click(screen.getByRole('option', { name: 'Paris' }));
    const parisCount = houses.filter((house) => house.city === 'Paris').length;
    expect(status()).toBe(`${parisCount} of ${houses.length.toLocaleString()} records found`);
    expect(screen.getByRole('button', { name: 'Filter City (Paris)' }).className).toContain('filtered');
    await user.click(within(firstRow()).getAllByRole('link')[0]!);
    expect(onSelect).toHaveBeenCalledWith({ kind: 'house', id: expect.any(String) }, true);
    await user.click(screen.getByRole('button', { name: 'Show All' }));
    expect(status()).toBe('Ready');
  });

  it('filters with a Custom AutoFilter condition', async () => {
    const { user } = setup();
    await user.click(screen.getByRole('button', { name: 'Filter Founded' }));
    await user.click(screen.getByRole('option', { name: '(Custom...)' }));
    const dialog = screen.getByRole('dialog', { name: 'Custom AutoFilter' });
    await user.selectOptions(within(dialog).getByRole('combobox', { name: 'First comparison' }), 'less');
    await user.type(within(dialog).getByRole('combobox', { name: 'First value' }), '1850');
    await user.click(within(dialog).getByRole('button', { name: 'OK' }));
    const count = houses.filter((house) => house.founded !== undefined && house.founded < 1850).length;
    expect(status()).toBe(`${count} of ${houses.length.toLocaleString()} records found`);
  });

  it('searches from the formula bar and clears with its cancel button', async () => {
    const { user } = setup();
    const formula = screen.getByRole('textbox', { name: 'Formula Bar' }) as HTMLInputElement;
    expect(formula.value).toBe(firstRow().querySelector('td')!.textContent);
    await user.click(formula);
    expect(formula.value).toBe('');
    await user.type(formula, 'hermes');
    expect(status()).toBe(`${searchSheet(rows(), 'hermes').length} of ${houses.length.toLocaleString()} records found`);
    expect(within(table()).getByRole('link', { name: 'Hermès' })).toBeTruthy();
    await user.click(screen.getByRole('button', { name: 'Clear search' }));
    expect(status()).toBe('Ready');
  });

  it('switches sheets from the tabs, keeping each sheet’s own search', async () => {
    const { user, onSelect } = setup();
    await user.type(screen.getByRole('textbox', { name: 'Formula Bar' }), 'paris');
    await user.click(screen.getByRole('tab', { name: 'Designers' }));
    expect(screen.getByRole('tab', { name: 'Designers' }).getAttribute('aria-selected')).toBe('true');
    expect(status()).toBe('Ready');
    expect(within(table('Designers')).getByRole('columnheader', { name: /^Current brands/ })).toBeTruthy();
    fireEvent.doubleClick(firstRow('Designers'));
    expect(onSelect).toHaveBeenLastCalledWith({ kind: 'designer', id: expect.any(String) }, true);
    await user.click(screen.getByRole('tab', { name: 'Groups' }));
    expect(within(table('Groups')).getByRole('columnheader', { name: /^Member brands/ })).toBeTruthy();
    await user.click(screen.getByRole('tab', { name: 'Locations' }));
    expect(within(table('Locations')).getByRole('columnheader', { name: /^State\/Province/ })).toBeTruthy();
    await user.click(screen.getByRole('tab', { name: 'Brands' }));
    expect(status()).toMatch(/records found/);
  });

  it("opens a location's brand list from its cell and picks a brand", async () => {
    const { user, onSelect } = setup();
    await user.click(screen.getByRole('tab', { name: 'Locations' }));
    await user.type(screen.getByRole('textbox', { name: 'Formula Bar' }), 'paris');
    const count = houses.filter((house) => house.city === 'Paris').length;
    await user.click(screen.getByRole('button', { name: `Paris brands (${count})` }));
    const list = screen.getByRole('listbox', { name: 'Brands in Paris' });
    expect(within(list).getAllByRole('option')).toHaveLength(count);
    await user.click(within(list).getByRole('option', { name: 'Chanel' }));
    expect(onSelect).toHaveBeenLastCalledWith({ kind: 'house', id: 'chanel' }, true);
    expect(screen.queryByRole('listbox', { name: 'Brands in Paris' })).toBeNull();
  });

  it('resizes a column by dragging its border; a double-click restores it', () => {
    setup();
    const handle = screen.getByRole('separator', { name: 'Resize Brand column' });
    const width = Number(handle.getAttribute('aria-valuenow'));
    fireEvent.pointerDown(handle, { button: 0, clientX: 100 });
    fireEvent.pointerMove(handle, { clientX: 160 });
    fireEvent.pointerUp(handle);
    expect(Number(handle.getAttribute('aria-valuenow'))).toBe(width + 60);
    fireEvent.pointerDown(handle, { button: 0, clientX: 100 });
    fireEvent.pointerMove(handle, { clientX: -1000 });
    fireEvent.pointerUp(handle);
    expect(Number(handle.getAttribute('aria-valuenow'))).toBe(MIN_COLUMN_WIDTH);
    // A double-click AutoFits the column to its widest brand name.
    fireEvent.doubleClick(handle);
    expect(Number(handle.getAttribute('aria-valuenow'))).toBe(autoFitWidth(brands, 0, (text, bold) => text.length * (bold ? 7.5 : 7)));
    expect(width).toBe(190);
  });

  it('sorts by several columns from Data ▸ Sort…', async () => {
    const { user } = setup();
    await user.click(screen.getByRole('menuitem', { name: 'Data' }));
    await user.click(screen.getByRole('menuitem', { name: 'Sort…' }));
    const dialog = screen.getByRole('dialog', { name: 'Sort' });
    await user.selectOptions(within(dialog).getByRole('combobox', { name: 'Sort by 1' }), 'country');
    await user.selectOptions(within(dialog).getByRole('combobox', { name: 'Then by 2' }), 'founded');
    await user.click(within(dialog).getAllByRole('radio', { name: 'Descending' })[1]!);
    await user.click(within(dialog).getByRole('button', { name: 'OK' }));
    expect(screen.getByText('Sorted by Country ↑, Founded ↓')).toBeTruthy();
    expect(firstRow().textContent).toContain(sortSheet(brands, rows(), [{ column: 'country', descending: false }, { column: 'founded', descending: true }])[0]!.name);
  });

  it('filters the Top 10 from a number column', async () => {
    const { user } = setup();
    await user.click(screen.getByRole('button', { name: 'Filter Founded' }));
    await user.click(screen.getByRole('option', { name: '(Top 10...)' }));
    const dialog = screen.getByRole('dialog', { name: 'Top 10 AutoFilter' });
    await user.selectOptions(within(dialog).getByRole('combobox', { name: 'Top or bottom' }), 'bottom');
    await user.click(within(dialog).getByRole('button', { name: 'OK' }));
    const expected = filterSheet(brands, rows(), { founded: { kind: 'top', bottom: true, amount: 10, percent: false } }).length;
    expect(status()).toBe(`${expected} of ${houses.length.toLocaleString()} records found`);
  });

  it('filters by a right-clicked cell and offers Show on Map', async () => {
    const onShowOnMap = vi.fn();
    render(<ListViewContent onSelect={() => {}} onOpenPlace={() => {}} onShowOnMap={onShowOnMap} onHelp={() => {}} onClose={() => {}} />);
    const user = userEvent.setup();
    const cityCell = firstRow().querySelectorAll('td')[1]!;
    const city = cityCell.textContent!;
    fireEvent.contextMenu(cityCell);
    await user.click(screen.getByRole('menuitem', { name: `Filter by "${city}"` }));
    expect(status()).toBe(`${houses.filter((house) => house.city === city).length} of ${houses.length.toLocaleString()} records found`);
    fireEvent.contextMenu(firstRow().querySelector('td')!);
    await user.click(screen.getByRole('menuitem', { name: 'Show on Map' }));
    expect(onShowOnMap).toHaveBeenCalledWith({ kind: 'house', id: expect.any(String) });
  });

  it('hides and unhides columns, keeping their letters', async () => {
    const { user } = setup();
    const letters = () => within(table()).getAllByRole('row')[0]!.textContent;
    fireEvent.contextMenu(screen.getByRole('columnheader', { name: /^City/ }));
    await user.click(screen.getByRole('menuitem', { name: 'Hide Column' }));
    expect(screen.queryByRole('columnheader', { name: /^City/ })).toBeNull();
    expect(letters()).toMatch(/^AC/);
    fireEvent.contextMenu(screen.getByRole('columnheader', { name: /^Country/ }));
    await user.click(screen.getByRole('menuitem', { name: 'Unhide Columns' }));
    expect(screen.getByRole('columnheader', { name: /^City/ })).toBeTruthy();
  });

  it('freezes the first column, greys ended brands and zooms', async () => {
    const { user } = setup();
    expect(firstRow().querySelector('td')!.className).toContain('xl-frozen');
    await user.click(screen.getByRole('menuitem', { name: 'Window' }));
    await user.click(screen.getByRole('menuitemcheckbox', { name: 'Freeze First Column' }));
    expect(firstRow().querySelector('td')!.className).not.toContain('xl-frozen');
    expect(screen.getByRole('region', { name: 'Brands worksheet' }).className).toContain('grey-ended');
    await user.click(screen.getByRole('menuitem', { name: 'Format' }));
    await user.click(screen.getByRole('menuitemcheckbox', { name: 'Grey Out Ended Brands' }));
    expect(screen.getByRole('region', { name: 'Brands worksheet' }).className).not.toContain('grey-ended');
    await user.selectOptions(screen.getByRole('combobox', { name: 'Zoom' }), '75');
    expect(table().style.zoom).toBe('0.75');
  });

  it('lists careers and collaborations on their own sheets', async () => {
    const { user, onSelect } = setup();
    await user.click(screen.getByRole('tab', { name: 'Careers' }));
    expect(within(table('Careers')).getByRole('columnheader', { name: /^Role detail/ })).toBeTruthy();
    await user.click(screen.getByRole('tab', { name: 'Collaborations' }));
    expect(screen.getByText('Sorted by Year ↓')).toBeTruthy();
    fireEvent.doubleClick(firstRow('Collaborations'));
    expect(onSelect).toHaveBeenLastCalledWith({ kind: 'house', id: expect.any(String) }, true);
  });

  it('remembers the layout between visits, but not filters or search', async () => {
    const { user } = setup();
    await user.click(screen.getByRole('tab', { name: 'Designers' }));
    await user.click(screen.getByRole('button', { name: 'Sort Descending' }));
    fireEvent.contextMenu(screen.getByRole('columnheader', { name: /^Nationality/ }));
    await user.click(screen.getByRole('menuitem', { name: 'Hide Column' }));
    await user.selectOptions(screen.getByRole('combobox', { name: 'Zoom' }), '125');
    await user.type(screen.getByRole('textbox', { name: 'Formula Bar' }), 'dior');
    cleanup();
    setup();
    expect(screen.getByRole('tab', { name: 'Designers' }).getAttribute('aria-selected')).toBe('true');
    expect(screen.getByText('Sorted by Designer ↓')).toBeTruthy();
    expect(screen.queryByRole('columnheader', { name: /^Nationality/ })).toBeNull();
    expect((screen.getByRole('combobox', { name: 'Zoom' }) as HTMLSelectElement).value).toBe('125');
    expect(status()).toBe('Ready');
  });

  it('ignores a saved layout that no longer fits the sheets', () => {
    localStorage.setItem(LAYOUT_KEY, JSON.stringify({ sheet: 'nope', zoom: 500, sheets: { brands: { sort: [{ column: 'gone' }], widths: { name: 'x', city: 5 }, hidden: ['gone'] } } }));
    const layout = readLayout();
    expect(layout.sheet).toBe('brands');
    expect(layout.zoom).toBe(100);
    expect(layout.sheets.brands).toEqual({ sort: [{ column: 'name', descending: false }], widths: { city: MIN_COLUMN_WIDTH }, hidden: [] });
    localStorage.setItem(LAYOUT_KEY, '{not json');
    expect(readLayout().sheet).toBe('brands');
  });

  it('zooms to any level from the status bar slider, up to 200%', async () => {
    const { user } = setup();
    fireEvent.contextMenu(screen.getByRole('button', { name: 'Zoom 100%' }));
    const slider = screen.getByRole('slider', { name: 'Zoom level' });
    expect(slider.getAttribute('max')).toBe('200');
    fireEvent.change(slider, { target: { value: '135' } });
    expect(table().style.zoom).toBe('1.35');
    expect((screen.getByRole('combobox', { name: 'Zoom' }) as HTMLSelectElement).value).toBe('135');
    await user.click(within(screen.getByRole('dialog', { name: 'Zoom' })).getByRole('button', { name: '200%' }));
    expect(screen.getByRole('button', { name: 'Zoom 200%' })).toBeTruthy();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog', { name: 'Zoom' })).toBeNull();
    await user.click(screen.getByRole('menuitem', { name: 'View' }));
    expect(screen.getByRole('menuitemcheckbox', { name: 'Zoom 200%' }).getAttribute('aria-checked')).toBe('true');
  });

  it('asks for a file name before Save As CSV, keeping the .csv extension', async () => {
    render(<ListViewContent onSelect={() => {}} onOpenPlace={() => {}} onHelp={() => {}} onClose={() => {}} />);
    const user = userEvent.setup();
    const downloads: string[] = [];
    const create = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:sheet');
    const click = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (this: HTMLAnchorElement) { downloads.push(this.download); });
    try {
      await user.click(screen.getByRole('button', { name: 'Save As CSV' }));
      const save = within(screen.getByRole('dialog', { name: 'Save As' }));
      expect((save.getByRole('textbox', { name: 'File name:' }) as HTMLInputElement).value).toBe('Designer Map - Brands');
      expect(save.getByLabelText('Extension').textContent).toBe('.csv');
      await user.click(save.getByRole('button', { name: 'Cancel' }));
      expect(downloads).toEqual([]);
      await user.click(screen.getByRole('menuitem', { name: 'File' }));
      await user.click(screen.getByRole('menuitem', { name: 'Save As CSV…' }));
      const again = within(screen.getByRole('dialog', { name: 'Save As' }));
      await user.clear(again.getByRole('textbox', { name: 'File name:' }));
      await user.type(again.getByRole('textbox', { name: 'File name:' }), 'Luxury brands{Enter}');
      expect(downloads).toEqual(['Luxury brands.csv']);
    } finally { create.mockRestore(); click.mockRestore(); }
  });

  it('toggles Full Screen from the View menu', async () => {
    const onFullScreen = vi.fn();
    render(<ListViewContent onSelect={() => {}} onOpenPlace={() => {}} onHelp={() => {}} onClose={() => {}} onFullScreen={onFullScreen} />);
    const user = userEvent.setup();
    await user.click(screen.getByRole('menuitem', { name: 'View' }));
    await user.click(screen.getByRole('menuitemcheckbox', { name: 'Full Screen' }));
    expect(onFullScreen).toHaveBeenCalledWith(true);
  });

  it('selects a range with shift-click, shows AutoCalculate and copies it', async () => {
    const { user } = setup();
    // After setup: user-event installs its own clipboard stub.
    const writeText = vi.fn(() => Promise.resolve());
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    const founded = brands.columns.findIndex((column) => column.id === 'founded');
    const cells = () => within(table()).getAllByRole('row').slice(2, 5).map((r) => r.querySelectorAll('td'));
    fireEvent.pointerDown(cells()[0]![0]!, { button: 0 });
    fireEvent.pointerDown(cells()[2]![founded]!, { button: 0, shiftKey: true });
    const calc = screen.getByLabelText('AutoCalculate');
    expect(calc.textContent).toMatch(/^Count=\d+/);
    expect(cells()[1]![1]!.className).toContain('in-range');
    screen.getByRole('region', { name: 'Brands worksheet' }).focus();
    await user.keyboard('{Control>}c{/Control}');
    expect(writeText).toHaveBeenCalledWith(expect.stringMatching(/^[^\n]+\t[^\n]+\t/));
    expect((writeText.mock.calls[0] as unknown as [string])[0].split('\n')).toHaveLength(3);
    // A plain click ends the range.
    fireEvent.pointerDown(cells()[0]![0]!, { button: 0 });
    expect(screen.queryByLabelText('AutoCalculate')).toBeNull();
  });

  it('selects a whole column from its letter', () => {
    setup();
    const letter = within(table()).getAllByRole('row')[0]!.querySelectorAll('th')[4]!;
    fireEvent.pointerDown(letter, { button: 0 });
    expect(screen.getByLabelText('AutoCalculate').textContent).toContain(`Count=${houses.filter((h) => h.founded !== undefined).length.toLocaleString()}`);
  });

  it('drags across column letters to select and copy just those columns', async () => {
    const { user } = setup();
    const writeText = vi.fn((_text: string) => Promise.resolve());
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    const letters = within(table()).getAllByRole('row')[0]!.querySelectorAll('th');
    fireEvent.pointerDown(letters[2]!, { button: 0, buttons: 1 });
    fireEvent.pointerEnter(letters[3]!, { buttons: 1 });
    fireEvent.pointerUp(window);
    const cells = within(table()).getAllByRole('row')[2]!.querySelectorAll('td');
    expect([...cells].slice(0, 4).map((cell) => cell.classList.contains('in-range'))).toEqual([false, true, true, false]);
    await user.keyboard('{Control>}c{/Control}');
    const lines = writeText.mock.calls[0]![0].split('\n');
    expect(lines).toHaveLength(houses.length + 1);
    expect(lines[0]).toBe(`${brands.columns[1]!.label}\t${brands.columns[2]!.label}`);
  });

  it('drags over cells, starting on a link, without selecting text, following it or losing focus', () => {
    const { onSelect } = setup();
    const cells = () => within(table()).getAllByRole('row').slice(2, 5).map((r) => r.querySelectorAll('td'));
    const link = cells()[0]![0]!.querySelector('a, button')!;
    fireEvent.pointerDown(link, { button: 0, buttons: 1 });
    expect(fireEvent.mouseDown(link, { button: 0 })).toBe(false);
    expect(document.activeElement).toBe(screen.getByRole('region', { name: 'Brands worksheet' }));
    fireEvent.pointerEnter(cells()[2]![0]!, { buttons: 1 });
    expect(cells()[1]![0]!.className).toContain('in-range');
    expect(cells()[1]![1]!.className).not.toContain('in-range');
    fireEvent.pointerEnter(cells()[0]![0]!, { buttons: 1 });
    fireEvent.pointerUp(window);
    fireEvent.click(link, { detail: 1 });
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('charts a column and filters the sheet from a bar', async () => {
    const { user } = setup();
    screen.getByRole('region', { name: 'Brands worksheet' }).focus();
    await user.keyboard('{ArrowRight}{ArrowRight}');
    await user.click(screen.getByRole('button', { name: 'Chart Wizard' }));
    const chart = screen.getByRole('dialog', { name: 'Chart - Brands' });
    expect(within(chart).getByRole('heading', { name: 'Count of Brands by Country' })).toBeTruthy();
    const usa = houses.filter((h) => h.country === 'US').length;
    await user.click(within(chart).getByRole('button', { name: `USA: ${usa}. Filter the sheet to it` }));
    expect(status()).toBe(`${usa} of ${houses.length.toLocaleString()} records found`);
    await user.selectOptions(within(chart).getByRole('combobox', { name: 'Chart column' }), 'founded');
    expect(within(chart).getByRole('checkbox', { name: 'Decades' })).toBeTruthy();
    await user.click(within(chart).getByRole('button', { name: 'Close Chart' }));
    expect(screen.queryByRole('dialog', { name: 'Chart - Brands' })).toBeNull();
  });

  it('opens a PivotTable whose counts drill into the source sheet', async () => {
    const { user } = setup();
    await user.click(screen.getByRole('tab', { name: 'PivotTable' }));
    const report = screen.getByRole('table', { name: 'Count of Brands by Country and Market' });
    const france = houses.filter((h) => h.country === 'FR' && h.tags.marketPositioning === 'High Luxury').length;
    await user.click(within(report).getByRole('button', { name: `${france} brands: France, High Luxury` }));
    expect(screen.getByRole('tab', { name: 'Brands' }).getAttribute('aria-selected')).toBe('true');
    expect(status()).toBe(`${france} of ${houses.length.toLocaleString()} records found`);
    await user.click(screen.getByRole('tab', { name: 'PivotTable' }));
    await user.selectOptions(screen.getByRole('combobox', { name: 'PivotTable data' }), 'collaborations');
    expect(screen.getByRole('table', { name: /^Count of Collaborations by Year/ })).toBeTruthy();
  });

  it('moves the active cell with the keyboard and shows it in the Name box', async () => {
    const { user } = setup();
    screen.getByRole('region', { name: 'Brands worksheet' }).focus();
    await user.keyboard('{ArrowRight}{ArrowDown}');
    expect((screen.getByRole('textbox', { name: 'Name Box' }) as HTMLInputElement).value).toBe('B3');
  });
});
