// @vitest-environment jsdom
import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { HouseFilters } from '../data/tags';
import { Filters } from './filters';
import { SearchBox, matchingItems } from './listbox';
import { PanelContent, type Selection } from './panel';
import { ContextMenu } from './context-menu';
import { getHouse, GroupId } from '../data';

afterEach(cleanup);

describe('React interface interactions', () => {
  it('opens brand sections by default, toggles them independently, and expands a newly selected brand', async () => {
    const user = userEvent.setup();
    const view = render(<PanelContent selection={{ kind: 'house', id: 'dior' }} onSelect={() => {}} onTag={() => {}} />);
    for (const name of ['Description', 'Creative directors', /Collaboration history/, 'Tags']) {
      const toggle = screen.getByRole('button', { name });
      const section = toggle.closest('fieldset')!;
      expect(toggle.getAttribute('aria-expanded')).toBe('true');
      expect(within(section).queryAllByRole('table').length + within(section).queryAllByRole('paragraph').length + within(section).queryAllByRole('button').length).toBeGreaterThan(1);
      toggle.focus();
      await user.keyboard('{Enter}');
      expect(toggle.getAttribute('aria-expanded')).toBe('false');
      expect(within(section).queryByRole('table')).toBeNull();
      expect(within(section).queryByRole('paragraph')).toBeNull();
      expect(within(section).getAllByRole('button')).toEqual([toggle]);
      await user.click(toggle);
      expect(toggle.getAttribute('aria-expanded')).toBe('true');
      await user.click(toggle);
    }
    view.rerender(<PanelContent selection={{ kind: 'house', id: 'chanel' }} onSelect={() => {}} onTag={() => {}} />);
    for (const name of ['Description', 'Creative directors', /Collaboration history/, 'Tags']) {
      expect(screen.getByRole('button', { name }).getAttribute('aria-expanded')).toBe('true');
    }
  });
  it('shows a confirmed end or current pause beside the founding year and omits it for active brands', () => {
    const view = render(<PanelContent selection={{ kind: 'house', id: 'christopherKane' }} onSelect={() => {}} onTag={() => {}} />);
    const row = screen.getByRole('row', { name: /Founded:\s*2006\s*\|\s*Ended:\s*2023/ });
    expect(row.textContent).toMatch(/Founded:\s*2006\s*\|\s*Ended:\s*2023/);
    view.rerender(<PanelContent selection={{ kind: 'house', id: 'astridAndersen' }} onSelect={() => {}} onTag={() => {}} />);
    expect(screen.getByRole('row', { name: /Founded:\s*2010\s*\|\s*Ended:\s*2021/ })).toBeTruthy();
    view.rerender(<PanelContent selection={{ kind: 'house', id: 'crocs' }} onSelect={() => {}} onTag={() => {}} />);
    expect(screen.getByRole('row', { name: 'Founded: 2002' })).toBeTruthy();
    expect(screen.queryByText('Ended:')).toBeNull();
  });

  it('shows dated collaboration history and clickable partners without source links', async () => {
    function Harness() {
      const [selection, setSelection] = useState<Selection>({ kind: 'house', id: 'fragmentDesign' });
      return <PanelContent selection={selection} onSelect={setSelection} onTag={() => {}} />;
    }
    const user = userEvent.setup();
    render(<Harness />);
    const history = screen.getByText(/^Collaboration history \(\d+\)$/).closest('fieldset')!;
    expect(within(history).queryByRole('link', { name: /Source/ })).toBeNull();
    expect(within(history).queryByRole('columnheader', { name: 'Collection' })).toBeNull();
    const nikeRow = within(history).getAllByRole('row').find((row) =>
      within(row).queryByRole('link', { name: 'Sacai' }) && within(row).queryByRole('link', { name: 'Nike' }) && within(row).getAllByRole('link').length === 3)!;
    expect(within(nikeRow).getByRole('cell', { name: '2021' })).toBeTruthy();
    const search = within(nikeRow).getByRole('link', { name: 'Search' });
    const url = new URL(search.getAttribute('href')!);
    expect(url.origin).toBe('https://www.google.com');
    expect(url.searchParams.get('q')).toBe(`${getHouse('fragmentDesign')!.name} x Nike x Sacai 2021`);
    expect(search.getAttribute('target')).toBe('_blank');
    expect(within(nikeRow).getByRole('link', { name: 'Nike' })).toBeTruthy();
    await user.click(within(nikeRow).getByRole('link', { name: 'Sacai' }));
    expect(screen.getByRole('heading', { name: 'Sacai' })).toBeTruthy();
  });

  it('shows a dated history of moves and ownership changes', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(<PanelContent selection={{ kind: 'house', id: 'reebok' }} onSelect={onSelect} onTag={() => {}} />);
    const history = screen.getByRole('group', { name: /History/ });
    const rows = within(history).getAllByRole('row').slice(1).map((row) => row.textContent);
    expect(rows[0]).toBe('1958Founded in Bolton, UK');
    expect(rows).toContain('2016Moved to Boston, USA');
    expect(rows.indexOf('2016Moved to Boston, USA')).toBeLessThan(rows.findIndex((row) => row?.includes('2022')));
    expect(screen.getByRole('row', { name: 'Origin: Bolton, UK' })).toBeTruthy();
    await user.click(within(history).getByRole('link', { name: /Authentic/ }));
    expect(onSelect).toHaveBeenLastCalledWith({ kind: 'group', id: 'authenticBrands' }, true);
  });

  it('limits collaboration history to the selected year', () => {
    const view = render(<PanelContent selection={{ kind: 'house', id: 'fragmentDesign' }} year={2005} onSelect={() => {}} onTag={() => {}} />);
    expect(screen.getByText('No collaborations recorded through 2005.')).toBeTruthy();
    view.rerender(<PanelContent selection={{ kind: 'house', id: 'fragmentDesign' }} year={2020} onSelect={() => {}} onTag={() => {}} />);
    const heading2020 = screen.getByText(/^Collaboration history \(\d+\)$/);
    const count2020 = Number(heading2020.textContent!.match(/\d+/)![0]);
    const history = heading2020.closest('fieldset')!;
    expect(within(history).getByRole('link', { name: 'Visvim' })).toBeTruthy();
    expect(within(history).getByRole('link', { name: 'Red Wing Shoes' })).toBeTruthy();
    expect(within(history).getByRole('link', { name: 'Carhartt WIP' })).toBeTruthy();
    expect(within(history).getByRole('link', { name: 'Kangol' })).toBeTruthy();
    expect(within(history).getByRole('link', { name: 'Off-White' })).toBeTruthy();
    // The 2021 sacai × Nike release stays hidden until its year.
    const sacaiNikeRow = (scope: HTMLElement) => within(scope).queryAllByRole('row').find((row) =>
      within(row).queryByRole('link', { name: 'Sacai' }) && within(row).queryAllByRole('link').length === 3);
    expect(sacaiNikeRow(history)).toBeUndefined();
    view.rerender(<PanelContent selection={{ kind: 'house', id: 'fragmentDesign' }} year={2021} onSelect={() => {}} onTag={() => {}} />);
    const heading2021 = screen.getByText(/^Collaboration history \(\d+\)$/);
    expect(Number(heading2021.textContent!.match(/\d+/)![0])).toBeGreaterThan(count2020);
    expect(sacaiNikeRow(document.body)).toBeTruthy();
  });

  it('consolidates repeat partners and searches the chosen release year', async () => {
    const user = userEvent.setup();
    render(<PanelContent selection={{ kind: 'house', id: 'humanMade' }} onSelect={() => {}} onTag={() => {}} />);
    const history = screen.getByRole('group', { name: /Collaboration history/ });
    expect(within(history).getAllByRole('link', { name: 'Adidas' })).toHaveLength(1);
    const row = within(history).getByRole('link', { name: 'Adidas' }).closest('tr')!;
    const years = within(row).getByRole('combobox');
    expect(years.textContent).toBe('2021');
    await user.click(years);
    await user.click(screen.getByRole('option', { name: '2019' }));
    const search = within(row).getByRole('link', { name: 'Search' });
    expect(new URL(search.getAttribute('href')!).searchParams.get('q')).toBe('Human Made x Adidas 2019');
  });

  it('removes future years from consolidated rows and resets an unavailable selected year', async () => {
    const user = userEvent.setup();
    const view = render(<PanelContent selection={{ kind: 'house', id: 'humanMade' }} year={2021} onSelect={() => {}} onTag={() => {}} />);
    const history = screen.getByRole('group', { name: /Collaboration history/ });
    const row = within(history).getByRole('link', { name: 'Adidas' }).closest('tr')!;
    await user.click(within(row).getByRole('combobox'));
    await user.click(screen.getByRole('option', { name: '2021' }));
    view.rerender(<PanelContent selection={{ kind: 'house', id: 'humanMade' }} year={2020} onSelect={() => {}} onTag={() => {}} />);
    await user.click(within(row).getByRole('combobox'));
    expect(screen.queryByRole('option', { name: '2021' })).toBeNull();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('listbox')).toBeNull();
    await user.keyboard('{ArrowDown}{Enter}');
    expect(within(row).getByRole('combobox').textContent).toBe('2019');
    await user.keyboard('{Home}{Enter}');
    expect(new URL(within(row).getByRole('link', { name: 'Search' }).getAttribute('href')!).searchParams.get('q')).toBe('Human Made x Adidas 2020');
  });

  it('navigates from a parent house to its labels and back', async () => {
    function Harness() {
      const [selection, setSelection] = useState<Selection>({ kind: 'house', id: 'ralphLauren' });
      return <PanelContent selection={selection} onSelect={setSelection} onTag={() => {}} />;
    }
    const user = userEvent.setup();
    render(<Harness />);
    const labels = screen.getByRole('group', { name: 'Labels (6)' });
    await user.click(within(labels).getByRole('link', { name: 'Polo Ralph Lauren' }));
    const parent = screen.getByRole('row', { name: 'Label of: Ralph Lauren' });
    await user.click(within(parent).getByRole('link', { name: 'Ralph Lauren' }));
    expect(screen.getByRole('group', { name: 'Labels (6)' })).toBeTruthy();
  });

  it('keeps a filtered label reachable in the directory when its parent is absent', () => {
    render(<PanelContent selection={null} visibleHouses={[getHouse('ea7')!]} onSelect={() => {}} onTag={() => {}} />);
    fireEvent.click(screen.getByText(/Italy · Milan/, { selector: 'summary' }));
    expect(screen.getByRole('link', { name: 'EA7 Emporio Armani' })).toBeTruthy();
    expect(screen.queryByRole('link', { name: 'Emporio Armani' })).toBeNull();
  });

  it('keeps multiple filter selections, removes individual chips, clears all, and closes menus', async () => {
    const user = userEvent.setup();
    function Harness() {
      const [value, setValue] = useState<HouseFilters>({});
      return <Filters value={value} onChange={setValue} count={10} total={327} />;
    }
    render(<Harness />);
    await user.click(screen.getByText('Collections', { selector: 'summary' }));
    const collections = screen.getByRole('group', { name: 'Collections' });
    await user.click(within(collections).getByLabelText('Menswear'));
    await user.click(within(collections).getByLabelText('Womenswear'));
    expect(within(collections).getByLabelText<HTMLInputElement>('Menswear').checked).toBe(true);
    expect(within(collections).getByLabelText<HTMLInputElement>('Womenswear').checked).toBe(true);
    expect(collections.parentElement?.hasAttribute('open')).toBe(true);
    await user.click(screen.getByText('Product', { selector: 'summary' }));
    expect(collections.parentElement?.hasAttribute('open')).toBe(false);
    const products = screen.getByRole('group', { name: 'Product' });
    await user.click(within(products).getByLabelText('Bags'));
    await user.click(screen.getByRole('button', { name: 'Remove Menswear from Collections' }));
    expect(screen.queryByRole('button', { name: 'Remove Menswear from Collections' })).toBeNull();
    expect(screen.getByRole('button', { name: 'Remove Womenswear from Collections' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Remove Bags from Product' })).toBeTruthy();
    await user.click(screen.getByRole('button', { name: 'Clear All' }));
    expect(screen.getByText('No Filters Selected')).toBeTruthy();
    expect(screen.getByRole<HTMLButtonElement>('button', { name: 'Clear All' }).disabled).toBe(true);
    await user.click(screen.getByText('Aesthetic', { selector: 'summary' }));
    await user.keyboard('{Escape}');
    expect(screen.getByText('Aesthetic', { selector: 'summary' }).parentElement?.hasAttribute('open')).toBe(false);
  });

  it('preserves accent-insensitive search ordering and keyboard selection', async () => {
    const items = [
      { label: 'Maison Chloé', value: 'other', hint: 'house' },
      { label: 'Chloé', value: 'chloe', hint: 'house' },
      { label: 'Chanel', value: 'chanel', hint: 'house' },
    ];
    expect(matchingItems(items, 'chloe').map((item) => item.value)).toEqual(['other', 'chloe']);
    const onPick = vi.fn();
    function Harness() {
      const [query, setQuery] = useState('');
      return <SearchBox items={items} value={query} onChange={setQuery} onPick={onPick} />;
    }
    const user = userEvent.setup();
    render(<Harness />);
    await user.type(screen.getByRole('combobox'), 'chloe');
    expect(screen.getAllByRole('option')).toHaveLength(2);
    await user.keyboard('{ArrowDown}{Enter}');
    expect(onPick).toHaveBeenCalledWith(items[1]);
    expect(screen.getByRole<HTMLInputElement>('combobox').value).toBe('Chloé');
    expect(screen.getByRole('combobox').getAttribute('aria-expanded')).toBe('false');
  });

  it('ignores punctuation, whitespace and case across house, designer and group searches', () => {
    const items = [
      { label: 'G-STAR', aliases: ['G-Star RAW'], hint: 'house', value: 'gStar' },
      { label: 'H&M', hint: 'house', value: 'hm' },
      { label: '99%IS-', hint: 'house', value: '99is' },
      { label: 'Ryan O’Connor', hint: 'designer', value: 'ryan' },
      { label: 'LVMH Moët Hennessy–Louis Vuitton', hint: 'group', value: 'lvmh' },
      { label: 'Chanel', hint: 'house', value: 'chanel' },
    ];
    for (const query of ['gstar', 'G STAR', 'g-star raw', 'gstarraw', ' G . S_T/A—R\tR A W ']) {
      expect(matchingItems(items, query).map((item) => item.value), query).toEqual(['gStar']);
    }
    for (const punctuation of ['-', '–', '—', '.', ',', ':', ';', "'", '’', '“', '/', '\\', '_', '&', '%', '+', '!', '?', '(', ')', '[', ']', '{', '}', '@', '#', '$', '^', '*', '=', '|', '~', '`', '<', '>']) {
      expect(matchingItems(items, `G${punctuation}STAR`).map((item) => item.value), punctuation).toEqual(['gStar']);
    }
    expect(matchingItems(items, 'h m').map((item) => item.value)).toEqual(['hm', 'lvmh']);
    expect(matchingItems(items, '99is').map((item) => item.value)).toEqual(['99is']);
    expect(matchingItems(items, "RYAN O'CONNOR").map((item) => item.value)).toEqual(['ryan']);
    expect(matchingItems(items, 'moethennessylouisvuitton').map((item) => item.value)).toEqual(['lvmh']);
    expect(matchingItems(items, 'nothing like this')).toEqual([]);
    expect(matchingItems(items, '---', 2)).toEqual(items.slice(0, 2));
  });

  it('navigates from each linked co-founder in the house identity to their profile', async () => {
    function Harness() {
      const [selection, setSelection] = useState<Selection>({ kind: 'house', id: 'clarks' });
      return <PanelContent selection={selection} onSelect={setSelection} onTag={() => {}} />;
    }
    const user = userEvent.setup();
    render(<Harness />);
    const founderRow = screen.getByRole('row', { name: 'Founder: Cyrus Clark, James Clark' });
    expect(within(founderRow).getByRole('link', { name: 'Cyrus Clark' })).toBeTruthy();
    await user.click(within(founderRow).getByRole('link', { name: 'James Clark' }));
    expect(screen.getByRole('heading', { name: 'James Clark' })).toBeTruthy();
    await user.click(screen.getByRole('link', { name: 'Clarks' }));
    expect(screen.getByRole('heading', { name: 'Clarks' })).toBeTruthy();
  });

  it('navigates house → group → house through React links and dispatches clickable tags', async () => {
    const onTag = vi.fn();
    function Harness() {
      const [selection, setSelection] = useState<Selection>({ kind: 'house', id: 'moncler' });
      return <PanelContent selection={selection} onSelect={setSelection} onTag={onTag} />;
    }
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole('link', { name: 'Moncler Group' }));
    expect(screen.getByRole('heading', { name: 'Moncler Group' })).toBeTruthy();
    await user.click(screen.getByRole('link', { name: 'Stone Island' }));
    expect(screen.getByRole('heading', { name: 'Stone Island' })).toBeTruthy();
    await user.click(screen.getByRole('button', { name: 'Outerwear' }));
    expect(onTag).toHaveBeenCalledWith('product', 'outerwear');
    expect(document.querySelector(`[data-select="group:${GroupId.Moncler}"]`)).toBeTruthy();
  });

  it('shows sportswear executives in business leadership and opens their profiles', async () => {
    function Harness() {
      const [selection, setSelection] = useState<Selection>({ kind: 'house', id: 'nike' });
      return <PanelContent selection={selection} onSelect={setSelection} onTag={() => {}} />;
    }
    const user = userEvent.setup();
    render(<Harness />);
    const business = screen.getByText('Business leadership', { selector: 'legend' }).closest('fieldset')!;
    expect(within(business).getByRole('columnheader', { name: 'Leader' })).toBeTruthy();
    expect(within(business).getByRole('link', { name: 'Mark Parker' })).toBeTruthy();
    const creative = screen.getByRole('button', { name: 'Creative directors' }).closest('fieldset')!;
    expect(within(creative).queryByRole('link', { name: 'Elliott Hill' })).toBeNull();
    await user.click(within(business).getByRole('link', { name: 'Elliott Hill' }));
    expect(screen.getByRole('heading', { name: 'Elliott Hill' })).toBeTruthy();
    expect(screen.getByText('CEO (President and CEO)')).toBeTruthy();
  });

  it('separates owned brands from regional relationships and links both directions', async () => {
    function Harness() {
      const [selection, setSelection] = useState<Selection>({ kind: 'group', id: GroupId.TSI });
      return <PanelContent selection={selection} onSelect={setSelection} onTag={() => {}} />;
    }
    const user = userEvent.setup();
    render(<Harness />);
    const ownership = screen.getByText(/^Current Brands in This Map/).closest('fieldset')!;
    expect(within(ownership).getByRole('link', { name: 'Margaret Howell' })).toBeTruthy();
    expect(within(ownership).getByRole('link', { name: 'Sugar Cane' })).toBeTruthy();
    expect(within(ownership).queryByRole('link', { name: 'Alpha Industries' })).toBeNull();
    const regional = screen.getByText('Regional Relationships (5)').closest('fieldset')!;
    await user.click(within(regional).getByRole('link', { name: 'Alpha Industries' }));
    expect(screen.getByRole('heading', { name: 'Alpha Industries' })).toBeTruthy();
    expect(screen.getByText(/Japan · Licensing and distribution/)).toBeTruthy();
    expect(screen.queryByRole('columnheader', { name: 'Group:' })).toBeNull();
    await user.click(screen.getByRole('link', { name: 'TSI Holdings' }));
    expect(screen.getByRole('heading', { name: 'TSI Holdings' })).toBeTruthy();
  });

  it('uses React logo fallback when an image fails', () => {
    render(<PanelContent selection={{ kind: 'house', id: 'dior' }} onSelect={() => {}} onTag={() => {}} />);
    const logo = screen.getByRole<HTMLImageElement>('img');
    expect(logo.classList.contains('has-logo')).toBe(true);
    fireEvent.error(logo);
    expect(logo.classList.contains('has-logo')).toBe(false);
    expect(logo.style.cssText).toBe('');
  });

  it('supports context-menu keyboard actions, escape, and outside dismissal', async () => {
    const expand = vi.fn(), collapse = vi.fn(), close = vi.fn();
    const user = userEvent.setup();
    render(<ContextMenu x={20} y={30} onClose={close} actions={[{ label: 'Expand All', run: expand }, { label: 'Collapse All', run: collapse }]} />);
    expect(document.activeElement).toBe(screen.getByRole('menuitem', { name: 'Expand All' }));
    await user.keyboard('{ArrowDown}{Enter}');
    expect(collapse).toHaveBeenCalledOnce();
    expect(close).toHaveBeenCalledWith(true);
    await user.keyboard('{Escape}');
    expect(close).toHaveBeenCalledWith(true);
    fireEvent.pointerDown(document.body);
    expect(close).toHaveBeenCalledWith();
  });
});
