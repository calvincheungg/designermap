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
import { GroupId } from '../data';

afterEach(cleanup);

describe('React interface interactions', () => {
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
    await user.click(screen.getByText('Primary Product', { selector: 'summary' }));
    expect(collections.parentElement?.hasAttribute('open')).toBe(false);
    const products = screen.getByRole('group', { name: 'Primary Product' });
    await user.click(within(products).getByLabelText('Bags'));
    await user.click(screen.getByRole('button', { name: 'Remove Menswear from Collections' }));
    expect(screen.queryByRole('button', { name: 'Remove Menswear from Collections' })).toBeNull();
    expect(screen.getByRole('button', { name: 'Remove Womenswear from Collections' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Remove Bags from Primary Product' })).toBeTruthy();
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
    const creative = screen.getByText('Creative directors', { selector: 'legend' }).closest('fieldset')!;
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
    const regional = screen.getByText('Regional Relationships (4)').closest('fieldset')!;
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
