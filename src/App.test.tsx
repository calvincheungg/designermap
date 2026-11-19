// @vitest-environment jsdom
import { StrictMode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { GraphCallbacks } from './graph/graph';

const mocks = vi.hoisted(() => ({ instances: [] as {
  select: ReturnType<typeof vi.fn>; setHouseFilter: ReturnType<typeof vi.fn>;
  setYear: ReturnType<typeof vi.fn>; setShowMoves: ReturnType<typeof vi.fn>;
  setShowCollaborations: ReturnType<typeof vi.fn>; setConnectionFilter: ReturnType<typeof vi.fn>;
  setAllExpanded: ReturnType<typeof vi.fn>; fit: ReturnType<typeof vi.fn>; destroy: ReturnType<typeof vi.fn>; houseAt: ReturnType<typeof vi.fn>;
  showCities: ReturnType<typeof vi.fn>; setNight: ReturnType<typeof vi.fn>; setTextScale: ReturnType<typeof vi.fn>;
  locationBox: ReturnType<typeof vi.fn>;
}[] }));
vi.mock('./graph/graph', () => ({
  DesignerGraph: class {
    cy = { on: vi.fn(), off: vi.fn() };
    allExpanded = false;
    select = vi.fn();
    setHouseFilter = vi.fn();
    setYear = vi.fn();
    setShowMoves = vi.fn();
    setShowCollaborations = vi.fn();
    setConnectionFilter = vi.fn();
    setNight = vi.fn();
    setTextScale = vi.fn();
    houseAt = vi.fn((): string | undefined => 'dior');
    fit = vi.fn();
    showCities = vi.fn();
    locationBox = vi.fn((): { left: number; top: number; right: number; bottom: number } | undefined => undefined);
    refreshStyle = vi.fn();
    destroy = vi.fn();
    setAllExpanded = vi.fn((open: boolean) => {
      this.allExpanded = open;
      this.callbacks.onExpandChange?.(open ? 10 : 0, 10);
    });
    constructor(_host: HTMLElement, private callbacks: GraphCallbacks) { mocks.instances.push(this); }
  },
}));
import { App } from './App';
import { cityWindowSize } from './ui/city-window';
import { clampRect, defaultRect } from './ui/side-panel';
import { GroupId } from './data/groups';

const openStart = (user: ReturnType<typeof userEvent.setup>) => user.click(screen.getByRole('button', { name: 'Start' }));
/** The Directory starts closed; the Start menu opens it. */
const openDirectory = async (user: ReturnType<typeof userEvent.setup>) => {
  await openStart(user);
  await user.click(within(screen.getByRole('dialog', { name: 'Start menu' })).getByRole('button', { name: 'Directory' }));
};

afterEach(() => {
  cleanup();
  localStorage.clear();
  // Share links write the view into the URL hash; start each test from a plain URL.
  history.replaceState(null, '', '/');
  mocks.instances.length = 0;
  vi.useRealTimers();
});

/** The year slider lives in the taskbar clock's pop-up. */
const openYear = () => {
  if (!screen.queryByRole('slider')) fireEvent.click(screen.getByRole('button', { name: /Year:/ }));
};

describe('React app graph integration', () => {
  it('persists the collaboration toggle independently from career lines', async () => {
    localStorage.setItem('designer-map:show-collaborations', 'off');
    const user = userEvent.setup();
    render(<App />);
    const graph = mocks.instances[0]!;
    await openStart(user);
    expect(screen.getByRole<HTMLInputElement>('checkbox', { name: 'Show collaboration lines' }).checked).toBe(false);
    expect(graph.setShowCollaborations).toHaveBeenLastCalledWith(false);
    await user.click(screen.getByRole('checkbox', { name: 'Show collaboration lines' }));
    expect(graph.setShowCollaborations).toHaveBeenLastCalledWith(true);
    expect(localStorage.getItem('designer-map:show-collaborations')).toBe('on');
    expect(screen.getByRole<HTMLInputElement>('checkbox', { name: 'Show move lines' }).checked).toBe(true);
    expect(mocks.instances).toHaveLength(1);
  });

  it('finds business leaders and reveals their career houses', async () => {
    const user = userEvent.setup();
    render(<App />);
    const graph = mocks.instances[0]!;
    await user.type(screen.getByRole('combobox', { name: 'Find:' }), 'elliott.hill');
    await user.click(screen.getByRole('option', { name: 'Elliott Hill leader' }));
    expect(screen.getByRole('heading', { name: 'Elliott Hill' })).toBeTruthy();
    expect(graph.select).toHaveBeenLastCalledWith({ kind: 'designer', id: 'elliottHill' }, true);
  });

  it('finds a brand by its normalized historical name and reveals its founder profile', async () => {
    const user = userEvent.setup();
    render(<App />);
    const graph = mocks.instances[0]!;
    await user.type(screen.getByRole('combobox', { name: 'Find:' }), ' g.STAR / raw ');
    await user.click(screen.getByRole('option', { name: 'G-STAR house' }));
    expect(graph.select).toHaveBeenLastCalledWith({ kind: 'house', id: 'gStar' }, true);
    const founder = document.querySelector('.identity [data-select="designer:josVanTilburg"]');
    expect(founder).toBeTruthy();
    await user.click(founder!);
    expect(graph.select).toHaveBeenLastCalledWith({ kind: 'designer', id: 'josVanTilburg' }, true);
    expect(screen.getByRole('heading', { name: 'Jos van Tilburg' })).toBeTruthy();
  });

  it('reveals group brands when opening a group from search or a brand profile', async () => {
    const user = userEvent.setup();
    render(<App />);
    const graph = mocks.instances[0]!;
    await user.type(screen.getByRole('combobox', { name: 'Find:' }), 'WHP Global');
    await user.click(screen.getByRole('option', { name: 'WHP Global group' }));
    expect(screen.getByRole('heading', { name: 'WHP Global' })).toBeTruthy();
    expect(graph.select).toHaveBeenLastCalledWith({ kind: 'group', id: GroupId.WHPGlobal }, true);
    await user.click(within(screen.getByRole('dialog', { name: 'WHP Global' })).getByRole('link', { name: 'Marc Jacobs' }));
    expect(graph.select).toHaveBeenLastCalledWith({ kind: 'house', id: 'marcJacobs' }, true);
    await user.click(within(screen.getByRole('dialog', { name: 'Marc Jacobs' })).getByRole('link', { name: 'WHP Global' }));
    expect(screen.getByRole('heading', { name: 'WHP Global' })).toBeTruthy();
    expect(graph.select).toHaveBeenLastCalledWith({ kind: 'group', id: GroupId.WHPGlobal }, true);
  });

  it('preserves search, tag filters, year filtering, and the graph instance across UI updates', async () => {
    const user = userEvent.setup();
    const view = render(<StrictMode><App /></StrictMode>);
    expect(mocks.instances).toHaveLength(2);
    expect(mocks.instances[0]!.destroy).toHaveBeenCalledOnce();
    const graph = mocks.instances[1]!;
    await user.type(screen.getByRole('combobox', { name: 'Find:' }), 'dior');
    await user.click(screen.getByRole('option', { name: 'Dior house' }));
    expect(screen.getByRole('heading', { name: 'Dior' })).toBeTruthy();
    expect(graph.select).toHaveBeenLastCalledWith({ kind: 'house', id: 'dior' }, true);
    await user.click(screen.getByRole('button', { name: 'Bags' }));
    expect(screen.getByRole('button', { name: 'Remove Bags from Product' })).toBeTruthy();
    const ids = graph.setHouseFilter.mock.lastCall?.[0] as Set<string>;
    expect(ids.has('dior')).toBe(true);
    expect(ids.has('rimowa')).toBe(false);
    openYear();
    fireEvent.change(screen.getByRole('slider'), { target: { value: '1940' } });
    expect(screen.queryByRole('dialog', { name: 'Dior' })).toBeNull();
    expect(graph.setYear).toHaveBeenLastCalledWith(1940);
    expect(graph.select).toHaveBeenLastCalledWith(null, false);
    await user.click(screen.getByRole('button', { name: 'Clear All' }));
    openYear();
    expect(screen.getByRole<HTMLInputElement>('slider').value).toBe('1940');
    expect(graph.setHouseFilter).toHaveBeenLastCalledWith(undefined);
    expect(mocks.instances).toHaveLength(2);
    view.unmount();
    expect(graph.destroy).toHaveBeenCalledOnce();
  });

  it('preserves move-line persistence and map expansion through both toolbar and context menu', async () => {
    localStorage.setItem('designer-map:show-lines', 'off');
    const user = userEvent.setup();
    render(<App />);
    const graph = mocks.instances[0]!;
    await openStart(user);
    expect(screen.getByRole<HTMLInputElement>('checkbox', { name: 'Show move lines' }).checked).toBe(false);
    expect(graph.setShowMoves).toHaveBeenLastCalledWith(false);
    await user.click(screen.getByRole('checkbox', { name: 'Show move lines' }));
    expect(graph.setShowMoves).toHaveBeenLastCalledWith(true);
    expect(localStorage.getItem('designer-map:show-lines')).toBe('on');
    await user.click(screen.getByRole('button', { name: 'Expand all' }));
    expect(graph.setAllExpanded).toHaveBeenLastCalledWith(true);
    expect(screen.queryByRole('dialog', { name: 'Start menu' })).toBeNull();
    await openStart(user);
    expect(screen.getByRole('button', { name: 'Collapse all' }).getAttribute('aria-pressed')).toBe('true');
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog', { name: 'Start menu' })).toBeNull();
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Start' }));
    fireEvent.contextMenu(document.getElementById('graph')!, { clientX: 100, clientY: 100 });
    await user.click(screen.getByRole('menuitem', { name: 'Collapse All' }));
    expect(graph.setAllExpanded).toHaveBeenLastCalledWith(false);
    expect(screen.queryByRole('menu')).toBeNull();
    fireEvent.keyDown(document.getElementById('graph')!, { key: 'F10', shiftKey: true });
    expect(screen.getByRole('menu')).toBeTruthy();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('menu')).toBeNull();
    expect(document.activeElement).toBe(document.getElementById('graph'));
  });

  it('searches from the taskbar, suggesting only once the user types, and sets the year from the clock', async () => {
    const user = userEvent.setup();
    render(<App />);
    const taskbar = within(document.querySelector<HTMLElement>('.taskbar')!);
    const find = taskbar.getByRole('combobox');
    await user.click(find);
    expect(find.getAttribute('aria-expanded')).toBe('false');
    expect(screen.queryByRole('option')).toBeNull();
    await user.type(find, 'dio');
    expect(find.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getByRole('option', { name: 'Dior house' })).toBeTruthy();
    await user.clear(find);
    expect(screen.queryByRole('option')).toBeNull();
    // The clock opens the year slider; a set year shows beside the time.
    expect(screen.queryByRole('slider')).toBeNull();
    await user.click(taskbar.getByRole('button', { name: /Year: all years/ }));
    fireEvent.change(within(screen.getByRole('dialog', { name: 'Year' })).getByRole('slider'), { target: { value: '1990' } });
    expect(taskbar.getByRole('button', { name: /Year: 1990/ }).textContent).toContain('1990');
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog', { name: 'Year' })).toBeNull();
  });

  it('opens brands from the Explorer address bar with Go, Enter or its drop-down', async () => {
    const user = userEvent.setup();
    render(<App />);
    const graph = mocks.instances[0]!;
    const bar = within(screen.getByRole('search'));
    const address = bar.getByRole('combobox', { name: 'Address' });
    // Go opens the best match, exact names first.
    await user.type(address, 'dior');
    await user.keyboard('{Escape}');
    await user.click(bar.getByRole('button', { name: 'Go' }));
    expect(graph.select).toHaveBeenLastCalledWith({ kind: 'house', id: 'dior' }, true);
    expect((address as HTMLInputElement).value).toBe('Dior');
    // The arrow lists every item, even with text in the box; picking one opens it.
    await user.click(bar.getByRole('button', { name: 'Show all' }));
    expect(address.getAttribute('aria-expanded')).toBe('true');
    expect(screen.getAllByRole('option').length).toBeGreaterThan(10);
    await user.click(bar.getByRole('button', { name: 'Show all' }));
    expect(address.getAttribute('aria-expanded')).toBe('false');
  });

  it('opens the List View sheet, whose filters leave the map alone', async () => {
    const user = userEvent.setup();
    render(<App />);
    const graph = mocks.instances[0]!;
    await openStart(user);
    await user.click(within(screen.getByRole('dialog', { name: 'Start menu' })).getByRole('button', { name: 'List View' }));
    const sheet = screen.getByRole('dialog', { name: 'List View - Designer Map.xls' });
    expect(within(document.querySelector<HTMLElement>('.taskbar')!).getByRole('button', { name: 'List View - Designer Map.xls' })).toBeTruthy();
    const filterCalls = graph.setHouseFilter.mock.calls.length;
    await user.click(within(sheet).getByRole('button', { name: 'Filter Market' }));
    await user.click(screen.getByRole('option', { name: 'High Luxury' }));
    expect(within(sheet).getByRole('status').textContent).toMatch(/records found/);
    expect(graph.setHouseFilter.mock.calls.length).toBe(filterCalls);
    expect(screen.queryByRole('group', { name: 'Selected Filters' })).toBeNull();
    // Maximize (or View ▸ Full Screen) fills the map area; Restore puts it back.
    await user.click(within(sheet).getByRole('button', { name: 'Maximize List View - Designer Map.xls' }));
    expect(sheet.className).toContain('maximized');
    await user.click(within(sheet).getByRole('menuitem', { name: 'View' }));
    expect(screen.getByRole('menuitemcheckbox', { name: 'Full Screen' }).getAttribute('aria-checked')).toBe('true');
    await user.keyboard('{Escape}');
    await user.click(within(sheet).getByRole('button', { name: 'Restore List View - Designer Map.xls' }));
    expect(sheet.className).not.toContain('maximized');
    localStorage.clear();
  });

  it('puts the map in its own window that minimizes, maximizes, closes and reopens', async () => {
    const user = userEvent.setup();
    localStorage.removeItem('designer-map:map-window');
    render(<App />);
    const map = document.getElementById('map-window')!;
    const taskbar = document.querySelector<HTMLElement>('.taskbar')!;
    const task = () => within(taskbar).queryByRole('button', { name: 'Explorer' });
    expect(within(map).getByText('Explorer')).toBeTruthy();
    // Minimize: hidden, and the taskbar button restores it.
    await user.click(within(map).getByRole('button', { name: 'Minimize' }));
    expect(map.getAttribute('aria-hidden')).toBe('true');
    await user.click(task()!);
    expect(map.hasAttribute('aria-hidden')).toBe(false);
    // Maximize fills the desktop and is remembered; the button becomes Restore.
    await user.click(within(map).getByRole('button', { name: 'Maximize' }));
    expect(document.querySelector('.desktop')!.classList.contains('map-maximized')).toBe(true);
    expect(localStorage.getItem('designer-map:map-window')).toBe('maximized');
    await user.click(within(map).getByRole('button', { name: 'Restore' }));
    expect(document.querySelector('.desktop')!.classList.contains('map-maximized')).toBe(false);
    // Close removes the taskbar button; the desktop icon reopens it.
    await user.click(within(map).getByRole('button', { name: 'Close' }));
    expect(task()).toBeNull();
    await user.click(screen.getByTitle('Open Explorer (drag to move)'));
    expect(map.hasAttribute('aria-hidden')).toBe(false);
    // Windows live on the desktop beside the map: opening one leaves a minimized map minimized.
    await user.click(within(map).getByRole('button', { name: 'Minimize' }));
    await openStart(user);
    await user.click(within(screen.getByRole('dialog', { name: 'Start menu' })).getByRole('button', { name: 'Statistics' }));
    const stats = screen.getByRole('dialog', { name: 'Statistics' });
    expect(map.getAttribute('aria-hidden')).toBe('true');
    expect(stats.parentElement).toBe(map.parentElement);
    expect(map.contains(stats)).toBe(false);
    // Quick Launch, between Start and Search, opens the same shortcuts as the desktop icons.
    const quickLaunch = within(within(taskbar).getByRole('toolbar', { name: 'Quick Launch' }));
    expect(quickLaunch.getAllByRole('button').map((button) => button.getAttribute('aria-label')))
      .toEqual(['Launch Explorer', 'Launch Recycle Bin', 'Launch Statistics', 'Launch List View', 'Launch Settings']);
    await user.click(quickLaunch.getByRole('button', { name: 'Launch Explorer' }));
    expect(map.hasAttribute('aria-hidden')).toBe(false);
    await user.click(quickLaunch.getByRole('button', { name: 'Launch Recycle Bin' }));
    expect(screen.getByRole('dialog', { name: 'Recycle Bin' })).toBeTruthy();
    localStorage.removeItem('designer-map:map-window');
  });

  it('moves and resizes the map window on the desktop, remembering its rect', async () => {
    localStorage.removeItem('designer-map:map-window-rect');
    const width = vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(1000);
    const height = vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(600);
    try {
      render(<App />);
      const map = document.getElementById('map-window')!;
      const rect = () => [map.style.left, map.style.top, map.style.width, map.style.height];
      // By default it sits right of the desktop icon column.
      expect(rect()).toEqual(['96px', '12px', '892px', '576px']);
      const titleBar = screen.getByLabelText('Move Explorer window');
      fireEvent.pointerDown(titleBar, { button: 0, clientX: 500, clientY: 20, pointerId: 1 });
      fireEvent.pointerMove(titleBar, { clientX: 400, clientY: 20, pointerId: 1 });
      fireEvent.pointerUp(titleBar, { pointerId: 1 });
      expect(rect()).toEqual(['0px', '12px', '892px', '576px']);
      const grip = screen.getByRole('separator', { name: 'Resize Explorer' });
      fireEvent.pointerDown(grip, { button: 0, clientX: 890, clientY: 580, pointerId: 1 });
      fireEvent.pointerMove(grip, { clientX: 490, clientY: 280, pointerId: 1 });
      fireEvent.pointerUp(grip, { pointerId: 1 });
      expect(rect()).toEqual(['0px', '12px', '492px', '276px']);
      expect(JSON.parse(localStorage.getItem('designer-map:map-window-rect')!)).toEqual({ x: 0, y: 12, width: 492, height: 276 });
      // Maximized fills the desktop area, without a grip.
      await userEvent.setup().click(within(map).getByRole('button', { name: 'Maximize' }));
      expect(rect()).toEqual(['0px', '0px', '1000px', '600px']);
      expect(within(map).queryByRole('separator')).toBeNull();
      await userEvent.setup().click(within(map).getByRole('button', { name: 'Restore' }));
      expect(rect()).toEqual(['0px', '12px', '492px', '276px']);
    } finally {
      width.mockRestore(); height.mockRestore();
      localStorage.removeItem('designer-map:map-window-rect');
      localStorage.removeItem('designer-map:map-window');
    }
  });

  it('gives desktop icons a Win98 right-click menu with selection', async () => {
    const user = userEvent.setup();
    render(<App />);
    const icon = screen.getByTitle('Open Settings (drag to move)');
    await user.pointer({ keys: '[MouseRight]', target: icon });
    const menu = screen.getByRole('menu', { name: 'Icon Actions' });
    expect(icon.classList.contains('selected')).toBe(true);
    await user.click(within(menu).getByRole('menuitem', { name: 'Select All' }));
    expect(screen.getByTitle('Open Recycle Bin (drag to move)').classList.contains('selected')).toBe(true);
    await user.pointer({ keys: '[MouseRight]', target: icon });
    await user.click(within(screen.getByRole('menu', { name: 'Icon Actions' })).getByRole('menuitem', { name: 'Open' }));
    // Open on a multiple selection opens every selected icon, as in Win98.
    expect(screen.getByRole('dialog', { name: 'Settings' })).toBeTruthy();
    expect(screen.getByRole('dialog', { name: 'Statistics' })).toBeTruthy();
  });

  it('switches the map to night colours from Settings or the Start menu, and remembers it', async () => {
    const user = userEvent.setup();
    localStorage.removeItem('designer-map:map-theme');
    const { unmount } = render(<App />);
    const graph = mocks.instances.at(-1)!;
    expect(graph.setNight).toHaveBeenLastCalledWith(false);
    await user.click(screen.getByTitle('Open Settings (drag to move)'));
    const settings = screen.getByRole('dialog', { name: 'Settings' });
    await user.click(within(settings).getByRole('radio', { name: 'Night' }));
    expect(graph.setNight).toHaveBeenLastCalledWith(true);
    expect(localStorage.getItem('designer-map:map-theme')).toBe('night');
    // Text size scales the map labels and, through --text-zoom, the window contents.
    await user.selectOptions(within(settings).getByRole('combobox', { name: 'Font size:' }), 'large');
    expect(graph.setTextScale).toHaveBeenLastCalledWith(1.25);
    expect(document.documentElement.style.getPropertyValue('--text-zoom')).toBe('1.25');
    expect(localStorage.getItem('designer-map:text-size')).toBe('large');
    await user.selectOptions(within(settings).getByRole('combobox', { name: 'Font size:' }), 'normal');
    // The Settings checkboxes drive the same options as the Start menu.
    await user.click(within(settings).getByRole('checkbox', { name: 'Show move lines' }));
    expect(graph.setShowMoves).toHaveBeenLastCalledWith(false);
    await user.click(within(settings).getByRole('checkbox', { name: 'Show move lines' }));
    await openStart(user);
    const start = screen.getByRole('dialog', { name: 'Start menu' });
    expect(within(start).getByRole('radio', { name: 'Night' })).toHaveProperty('checked', true);
    await user.click(within(start).getByRole('radio', { name: 'Day' }));
    expect(graph.setNight).toHaveBeenLastCalledWith(false);
    await user.click(within(start).getByRole('radio', { name: 'Night' }));
    unmount();
    render(<App />);
    expect(mocks.instances.at(-1)!.setNight).toHaveBeenLastCalledWith(true);
    localStorage.removeItem('designer-map:map-theme');
  });

  it('opens one Statistics window from the Start menu, following the filters', async () => {
    const user = userEvent.setup();
    render(<App />);
    const graph = mocks.instances[0]!;
    await openStart(user);
    await user.click(within(screen.getByRole('dialog', { name: 'Start menu' })).getByRole('button', { name: 'Statistics' }));
    const stats = screen.getByRole('dialog', { name: 'Statistics' });
    expect(within(stats).getByRole('table', { name: 'Brands by market positioning' })).toBeTruthy();
    expect(within(stats).getByText('For every brand on the map.')).toBeTruthy();
    expect(within(document.querySelector<HTMLElement>('.taskbar')!).getByRole('button', { name: 'Statistics' })).toBeTruthy();
    // Opening it again focuses the same window; names in it open their windows.
    await openStart(user);
    await user.click(within(screen.getByRole('dialog', { name: 'Start menu' })).getByRole('button', { name: 'Statistics' }));
    expect(screen.getAllByRole('dialog', { name: 'Statistics' })).toHaveLength(1);
    await user.click(screen.getByTitle('Open Statistics (drag to move)'));
    expect(screen.getAllByRole('dialog', { name: 'Statistics' })).toHaveLength(1);
    const countries = within(stats).getByRole('table', { name: 'Main brands by country' });
    await user.click(within(countries).getAllByRole('link')[0]!);
    expect(screen.getAllByRole('dialog').length).toBeGreaterThan(1);
    const directors = within(screen.getByRole('dialog', { name: 'Statistics' })).getByRole('table', { name: 'Brands by number of creative directors' });
    await user.click(within(directors).getAllByRole('link')[0]!);
    expect(graph.select).toHaveBeenLastCalledWith(expect.objectContaining({ kind: 'house' }), true);
    openYear();
    fireEvent.change(screen.getByRole('slider'), { target: { value: '1900' } });
    expect(within(screen.getByRole('dialog', { name: 'Statistics' })).getByText('For brands founded by 1900.')).toBeTruthy();
  });

  it('leaves retailer collaborations out of the collaboration and pairing tables when unchecked, and remembers it', async () => {
    const user = userEvent.setup();
    const { collaborations, houses } = await import('./data');
    const { BrandCategory } = await import('./data/tags');
    const retailers = new Set(Object.values(houses).filter((house) => house.tags.brandCategory.includes(BrandCategory.Retailer)).map((house) => house.name));
    expect(retailers.size).toBeGreaterThan(0);
    render(<App />);
    await openStart(user);
    await user.click(within(screen.getByRole('dialog', { name: 'Start menu' })).getByRole('button', { name: 'Statistics' }));
    const stats = screen.getByRole('dialog', { name: 'Statistics' });
    const table = (name: string) => within(stats).getByRole('table', { name });
    const releaseTotal = () => within(table('Brands by number of collaborations')).getAllByRole('row').slice(1)
      .reduce((sum, row) => sum + Number((row as HTMLTableRowElement).cells[2]!.textContent!.replace(/,/g, '')), 0);
    const pairBrands = () => within(table('Brand pairs with the most collaborations')).getAllByRole('link').map((link) => link.textContent!);
    const pairsBefore = table('Brand pairs with the most collaborations').textContent;
    const before = releaseTotal();
    const [collabToggle, pairToggle] = within(stats).getAllByRole('checkbox', { name: 'Include retailer collaborations' }) as HTMLInputElement[];
    expect(collabToggle!.checked && pairToggle!.checked).toBe(true);
    await user.click(collabToggle!);
    // The overview total and the pairings table keep every release; the ranking drops retailer releases.
    expect(within(stats).getByText(collaborations.length.toLocaleString())).toBeTruthy();
    expect(releaseTotal()).toBeLessThan(before);
    expect(table('Brand pairs with the most collaborations').textContent).toBe(pairsBefore);
    expect(localStorage.getItem('designer-map:stats-retailer-collabs')).toBe('off');
    await user.click(pairToggle!);
    expect(pairBrands().some((name) => retailers.has(name))).toBe(false);
    expect(localStorage.getItem('designer-map:stats-retailer-pairs')).toBe('off');
  });

  it('opens a shared link\'s brand and year, and keeps the address bar in step', () => {
    history.replaceState(null, '', '/#brand=dior&year=1990');
    render(<App />);
    const graph = mocks.instances[0]!;
    expect(graph.select).toHaveBeenLastCalledWith({ kind: 'house', id: 'dior' }, true);
    expect(graph.setYear).toHaveBeenLastCalledWith(1990);
    expect(screen.getByRole('dialog', { name: 'Dior' })).toBeTruthy();
    expect(location.hash).toBe('#brand=dior&year=1990');
    openYear();
    fireEvent.change(screen.getByRole('slider'), { target: { value: '2000' } });
    expect(location.hash).toBe('#brand=dior&year=2000');
  });

  it('opens the Recycle Bin of ended brands from its desktop icon, and the What\'s Missing report in development', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByTitle('Open Recycle Bin (drag to move)'));
    const bin = screen.getByRole('dialog', { name: 'Recycle Bin' });
    // A Win98 folder: the ended brands are file icons, newest deletion first.
    const files = within(within(bin).getByRole('list', { name: 'Ended brands' })).getAllByRole('button');
    expect(files.length).toBeGreaterThan(5);
    expect(within(bin).getByText(`${files.length.toLocaleString()} objects`)).toBeTruthy();
    // Details has Win98's Name / Original Location / Date Deleted columns, in the same order.
    await user.click(within(bin).getByRole('combobox', { name: 'View' }));
    await user.click(screen.getByRole('option', { name: 'Details' }));
    const table = within(bin).getByRole('table', { name: 'Ended brands' });
    expect(within(table).getAllByRole('columnheader').map((th) => th.textContent)).toEqual(['Name', 'Original Location', 'Date Deleted ▼']);
    const ended = within(table).getAllByRole('row').slice(1);
    expect(ended.map((row) => within(row).getAllByRole('cell')[0]!.textContent)).toEqual(files.map((file) => file.textContent));
    const years = ended.map((row) => Number(row.lastElementChild!.textContent));
    expect(years).toEqual([...years].sort((a, b) => b - a));
    await user.click(within(table).getByRole('button', { name: 'Name' }));
    const names = within(table).getAllByRole('row').slice(1).map((row) => within(row).getAllByRole('cell')[0]!.textContent!);
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base', numeric: true })));
    await user.click(within(bin).getByRole('combobox', { name: 'View' }));
    await user.click(screen.getByRole('option', { name: 'Large Icons' }));
    await openStart(user);
    await user.click(screen.getByRole('button', { name: "What's Missing" }));
    expect(within(screen.getByRole('dialog', { name: "What's Missing" })).getByRole('button', { name: /^No founder or creative director \(\d+\)$/ })).toBeTruthy();
  });

  it('plays and stops the timeline and cleans up playback and clock timers on unmount', () => {
    vi.useFakeTimers();
    const view = render(<StrictMode><App /></StrictMode>);
    openYear();
    const slider = screen.getByRole<HTMLInputElement>('slider');
    fireEvent.click(screen.getByRole('button', { name: '▶ Play' }));
    act(() => { vi.advanceTimersByTime(150); });
    expect(slider.value).toBe(slider.min);
    fireEvent.click(screen.getByRole('button', { name: '■ Stop' }));
    const stopped = slider.value;
    act(() => { vi.advanceTimersByTime(450); });
    expect(slider.value).toBe(stopped);
    fireEvent.click(screen.getByRole('button', { name: '▶ Play' }));
    view.unmount();
    expect(vi.getTimerCount()).toBe(0);
    expect(mocks.instances.every((graph) => graph.destroy.mock.calls.length === 1)).toBe(true);
  });
});


it('changes the map connection filter without rebuilding the graph', async () => {
  const user = userEvent.setup();
  render(<App />);
  const graph = mocks.instances[0]!;
  await openStart(user);
  await user.click(screen.getByRole('radio', { name: 'Collaborations only' }));
  expect(graph.setConnectionFilter).toHaveBeenLastCalledWith('collaborations');
  expect(screen.getByRole<HTMLInputElement>('radio', { name: 'Collaborations only' }).checked).toBe(true);
  await user.click(screen.getByRole('radio', { name: 'Designers only' }));
  expect(graph.setConnectionFilter).toHaveBeenLastCalledWith('designers');
  expect(mocks.instances).toHaveLength(1);
});

describe('Properties window layout', () => {
  it('starts closed, opens from the Start menu, minimizes to the taskbar and restores', async () => {
    const user = userEvent.setup();
    render(<App />);
    expect(document.getElementById('side-window')).toBeNull();
    await openDirectory(user);
    const panel = document.getElementById('side-window')!;
    const task = screen.getByRole('button', { name: 'Directory' , pressed: true });
    expect(panel.hidden).toBe(false);
    await user.click(screen.getByRole('button', { name: 'Minimize Directory' }));
    expect(panel.hidden).toBe(true);
    expect(task.getAttribute('aria-pressed')).toBe('false');
    expect(screen.queryByRole('separator', { name: 'Resize Directory' })).toBeNull();
    await user.click(screen.getByRole('button', { name: 'Directory', pressed: false }));
    expect(document.getElementById('side-window')!.hidden).toBe(false);
  });

  const withArea = (run: () => Promise<void> | void) => async () => {
    // jsdom has no layout: give the map area a size so the window can be placed.
    const width = vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(1000);
    const height = vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(600);
    try { await run(); } finally { width.mockRestore(); height.mockRestore(); }
  };

  it('floats at the right edge, moves by its title bar and stays inside the map area', withArea(async () => {
    render(<App />);
    await openDirectory(userEvent.setup());
    const panel = document.getElementById('side-window')!;
    expect([panel.style.left, panel.style.top, panel.style.width, panel.style.height]).toEqual(['588px', '12px', '400px', '576px']);
    const titleBar = screen.getByLabelText('Move Directory window');
    fireEvent.pointerDown(titleBar, { button: 0, clientX: 700, clientY: 20, pointerId: 1 });
    fireEvent.pointerMove(titleBar, { clientX: 400, clientY: 120, pointerId: 1 });
    fireEvent.pointerUp(titleBar, { pointerId: 1 });
    expect([panel.style.left, panel.style.top]).toEqual(['288px', '24px']);
    fireEvent.pointerDown(titleBar, { button: 0, clientX: 400, clientY: 120, pointerId: 1 });
    fireEvent.pointerMove(titleBar, { clientX: -900, clientY: 900, pointerId: 1 });
    expect([panel.style.left, panel.style.top]).toEqual(['0px', '24px']);
    fireEvent.pointerUp(titleBar, { pointerId: 1 });
    expect(JSON.parse(localStorage.getItem('designer-map:properties-window')!)).toEqual({ x: 0, y: 24, width: 400, height: 576 });
    fireEvent.doubleClick(titleBar);
    expect(panel.style.left).toBe('588px');
  }));

  it('resizes from the grip with pointer and keyboard, within minimum sizes', withArea(async () => {
    const user = userEvent.setup();
    render(<App />);
    await openDirectory(user);
    const panel = document.getElementById('side-window')!;
    const grip = screen.getByRole('separator', { name: 'Resize Directory' });
    fireEvent.pointerDown(grip, { button: 0, clientX: 990, clientY: 590, pointerId: 1 });
    fireEvent.pointerMove(grip, { clientX: 690, clientY: 190, pointerId: 1 });
    fireEvent.pointerUp(grip, { pointerId: 1 });
    expect([panel.style.width, panel.style.height]).toEqual(['260px', '180px']);
    grip.focus();
    await user.keyboard('{ArrowRight}{ArrowDown}');
    expect([panel.style.width, panel.style.height]).toEqual(['270px', '190px']);
    screen.getByLabelText('Move Directory window').focus();
    await user.keyboard('{ArrowLeft}');
    expect(panel.style.left).toBe('578px');
  }));
});

describe('Map context menu', () => {
  it('opens a brand in Properties from Show More, restoring a minimized window', async () => {
    const user = userEvent.setup();
    render(<App />);
    const graph = mocks.instances[0]!;
    await openDirectory(user);
    await user.click(screen.getByRole('button', { name: 'Minimize Directory' }));
    expect(document.getElementById('side-window')!.hidden).toBe(true);
    fireEvent.contextMenu(document.getElementById('graph')!, { clientX: 40, clientY: 50 });
    expect(graph.houseAt).toHaveBeenCalledWith(40, 50);
    await user.click(screen.getByRole('menuitem', { name: 'Show More' }));
    expect(screen.getByRole('dialog', { name: 'Dior' })).toBeTruthy();
    // A minimized Dior window is restored by Show More too.
    await user.click(screen.getByRole('button', { name: 'Minimize Dior' }));
    expect(screen.queryByRole('dialog', { name: 'Dior' })).toBeNull();
    fireEvent.contextMenu(document.getElementById('graph')!, { clientX: 40, clientY: 50 });
    await user.click(screen.getByRole('menuitem', { name: 'Show More' }));
    expect(screen.getByRole('dialog', { name: 'Dior' })).toBeTruthy();
    expect(graph.select).toHaveBeenLastCalledWith({ kind: 'house', id: 'dior' }, true);
    expect(screen.getByRole('heading', { name: 'Dior' })).toBeTruthy();
  });

  it('offers only map actions away from a brand', () => {
    render(<App />);
    mocks.instances[0]!.houseAt.mockReturnValue(undefined);
    fireEvent.contextMenu(document.getElementById('graph')!, { clientX: 40, clientY: 50 });
    expect(screen.queryByRole('menuitem', { name: 'Show More' })).toBeNull();
    expect(screen.getByRole('menuitem', { name: 'Expand All' })).toBeTruthy();
  });
});

describe('Multiple Properties windows', () => {
  const pick = async (user: ReturnType<typeof userEvent.setup>, text: string, option: string) => {
    const find = within(document.querySelector<HTMLElement>('.taskbar')!).getByRole('combobox');
    await user.clear(find);
    await user.type(find, text);
    await user.click(screen.getByRole('option', { name: option }));
  };
  const titles = () => screen.getAllByRole('dialog').map((dialog) => dialog.getAttribute('aria-labelledby'))
    .map((id) => document.getElementById(id!)!.textContent);

  it('opens designers as their own window type, never reusing a brand window', async () => {
    const user = userEvent.setup();
    render(<App />);
    await pick(user, 'dior', 'Dior house');
    await pick(user, 'chanel', 'Chanel house');
    await pick(user, 'prada', 'Prada house');
    const find = within(document.querySelector<HTMLElement>('.taskbar')!).getByRole('combobox');
    await user.clear(find);
    await user.type(find, 'maria grazia chiuri');
    await user.click(screen.getByRole('option', { name: /^Maria Grazia Chiuri/ }));
    expect(titles()).toEqual(['Dior', 'Chanel', 'Prada', 'Maria Grazia Chiuri']);
    const taskbar = within(document.querySelector<HTMLElement>('.taskbar')!);
    expect(taskbar.getByRole('button', { name: 'Brands, 3 windows' })).toBeTruthy();
    expect(taskbar.getByRole('button', { name: 'Maria Grazia Chiuri' })).toBeTruthy();
  });

  it('offers Win98 window commands when right-clicking taskbar buttons', async () => {
    const user = userEvent.setup();
    render(<App />);
    const graph = mocks.instances[0]!;
    const taskbar = within(document.querySelector<HTMLElement>('.taskbar')!);
    await pick(user, 'dior', 'Dior house');
    // A single window: Restore is greyed out until it is minimized.
    fireEvent.contextMenu(taskbar.getByRole('button', { name: 'Dior' }));
    let menu = screen.getByRole('menu', { name: 'Dior window' });
    expect(within(menu).getAllByRole('menuitem').map((item) => item.textContent)).toEqual(['Restore', 'Minimize', 'Show on Map', 'Close']);
    expect((within(menu).getByRole('menuitem', { name: 'Restore' }) as HTMLButtonElement).disabled).toBe(true);
    await user.click(within(menu).getByRole('menuitem', { name: 'Minimize' }));
    expect(screen.queryByRole('dialog', { name: 'Dior' })).toBeNull();
    fireEvent.contextMenu(taskbar.getByRole('button', { name: 'Dior' }));
    await user.click(within(screen.getByRole('menu', { name: 'Dior window' })).getByRole('menuitem', { name: 'Restore' }));
    expect(screen.getByRole('dialog', { name: 'Dior' }).hasAttribute('data-active')).toBe(true);
    // Two brands collapse into a group: minimize, restore and close them together.
    await pick(user, 'chanel', 'Chanel house');
    const group = taskbar.getByRole('button', { name: 'Brands, 2 windows' });
    fireEvent.contextMenu(group);
    menu = screen.getByRole('menu', { name: 'Brands group' });
    expect(within(menu).getAllByRole('menuitem').map((item) => item.textContent)).toEqual(['Restore All', 'Minimize All', 'Close All']);
    await user.click(within(menu).getByRole('menuitem', { name: 'Minimize All' }));
    expect(screen.queryByRole('dialog', { name: 'Dior' })).toBeNull();
    expect(screen.queryByRole('dialog', { name: 'Chanel' })).toBeNull();
    fireEvent.contextMenu(group);
    await user.click(within(screen.getByRole('menu', { name: 'Brands group' })).getByRole('menuitem', { name: 'Restore All' }));
    expect(screen.getByRole('dialog', { name: 'Dior' })).toBeTruthy();
    expect(screen.getByRole('dialog', { name: 'Chanel' }).hasAttribute('data-active')).toBe(true);
    // Rows in the group list have their own window menu and an X that closes that window.
    await pick(user, 'prada', 'Prada house');
    const brands = taskbar.getByRole('button', { name: 'Brands, 3 windows' });
    await user.click(brands);
    fireEvent.contextMenu(within(taskbar.getByRole('menu', { name: 'Brands windows' })).getByRole('menuitem', { name: 'Dior' }));
    await user.click(within(screen.getByRole('menu', { name: 'Dior window' })).getByRole('menuitem', { name: 'Minimize' }));
    expect(screen.queryByRole('dialog', { name: 'Dior' })).toBeNull();
    await user.click(brands);
    await user.click(taskbar.getByRole('button', { name: 'Close Chanel window' }));
    expect(screen.queryByRole('dialog', { name: 'Chanel' })).toBeNull();
    expect(within(taskbar.getByRole('menu', { name: 'Brands windows' })).getAllByRole('menuitem').map((item) => item.textContent))
      .toEqual(['(minimized) Dior', 'Prada']);
    fireEvent.contextMenu(taskbar.getByRole('button', { name: 'Brands, 2 windows' }));
    await user.click(within(screen.getByRole('menu', { name: 'Brands group' })).getByRole('menuitem', { name: 'Close All' }));
    expect(screen.queryAllByRole('dialog')).toHaveLength(0);
    expect(graph.select).toHaveBeenLastCalledWith(null, false);
  });

  it('opens item windows beside the Directory, focusing an open item instead of repeating it', async () => {
    const user = userEvent.setup();
    render(<App />);
    const graph = mocks.instances[0]!;
    await openDirectory(user);
    await pick(user, 'dior', 'Dior house');
    await pick(user, 'chanel', 'Chanel house');
    await pick(user, 'prada', 'Prada house');
    expect(titles()).toEqual(['Directory', 'Dior', 'Chanel', 'Prada']);
    // Each new brand window asks the map where its city is, to open beside it.
    expect(graph.locationBox.mock.calls.map(([id]) => id)).toEqual(['dior', 'chanel', 'prada']);
    // Picking an open item focuses its window instead of opening another, and leaves it where it is.
    await pick(user, 'dior', 'Dior house');
    expect(graph.locationBox).toHaveBeenCalledTimes(3);
    expect(screen.getAllByRole('dialog')).toHaveLength(4);
    expect(screen.getByRole('dialog', { name: 'Dior' }).hasAttribute('data-active')).toBe(true);
    // The taskbar collapses them into one button whose menu lists each window.
    const taskbar = within(document.querySelector<HTMLElement>('.taskbar')!);
    expect(taskbar.queryByRole('button', { name: 'Dior' })).toBeNull();
    await user.click(taskbar.getByRole('button', { name: 'Brands, 3 windows' }));
    const menu = taskbar.getByRole('menu', { name: 'Brands windows' });
    expect(within(menu).getAllByRole('menuitem').map((item) => item.textContent))
      .toEqual(['Dior', 'Chanel', 'Prada']);
    await user.click(screen.getByRole('button', { name: 'Minimize Dior' }));
    await user.click(taskbar.getByRole('button', { name: 'Brands, 3 windows' }));
    await user.click(within(taskbar.getByRole('menu')).getByRole('menuitem', { name: /Dior/ }));
    expect(taskbar.queryByRole('menu')).toBeNull();
    expect((screen.getByRole('dialog', { name: 'Dior' }) as HTMLElement).hidden).toBe(false);
    expect(screen.getByRole('dialog', { name: 'Dior' }).hasAttribute('data-active')).toBe(true);
    // Clicking a window brings it forward and highlights its brand on the map.
    fireEvent.pointerDown(screen.getByRole('dialog', { name: 'Prada' }));
    expect(graph.select).toHaveBeenLastCalledWith({ kind: 'house', id: 'prada' }, false);
    expect(screen.getByRole('dialog', { name: 'Prada' }).hasAttribute('data-active')).toBe(true);
  });

  it('closes windows with the X, moving the map selection to the next window', async () => {
    const user = userEvent.setup();
    render(<App />);
    const graph = mocks.instances[0]!;
    await openDirectory(user);
    await pick(user, 'dior', 'Dior house');
    await pick(user, 'chanel', 'Chanel house');
    await user.click(screen.getByRole('button', { name: 'Close Chanel' }));
    expect(screen.queryByRole('dialog', { name: 'Chanel' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Chanel' })).toBeNull();
    expect(graph.select).toHaveBeenLastCalledWith({ kind: 'house', id: 'dior' }, false);
    await user.click(screen.getByRole('button', { name: 'Close Dior' }));
    expect(graph.select).toHaveBeenLastCalledWith(null, false);
    expect(document.getElementById('status-selection')!.textContent).toBe('Nothing selected');
    // The Directory closes too, and the Start menu brings it back.
    await user.click(screen.getByRole('button', { name: 'Close Directory' }));
    expect(screen.queryByRole('dialog')).toBeNull();
    await openStart(user);
    await user.click(screen.getByRole('button', { name: 'Directory' }));
    expect(screen.getByRole('dialog', { name: 'Directory' })).toBeTruthy();
  });
});

describe('City windows', () => {
  const openCity = (city: string) => act(() => {
    (mocks.instances.at(-1) as unknown as { callbacks: GraphCallbacks }).callbacks.onOpenCity!(city);
  });

  it('opens a city pin as a window of brand icons that opens brands and closes', async () => {
    const user = userEvent.setup();
    render(<App />);
    const graph = mocks.instances[0]!;
    openCity('Paris');
    const paris = screen.getByRole('dialog', { name: 'Paris' });
    const grid = within(paris).getByRole('list', { name: 'Brands in Paris' });
    expect(within(grid).getAllByRole('button').length).toBeGreaterThan(20);
    expect(within(paris).getByRole('button', { name: 'Minimize Paris' })).toBeTruthy();
    expect(within(document.querySelector<HTMLElement>('.taskbar')!).getByRole('button', { name: 'Paris' })).toBeTruthy();
    // City windows leave the map selection alone.
    expect(graph.select).toHaveBeenLastCalledWith(null, false);
    await user.click(within(grid).getByRole('button', { name: 'Dior' }));
    expect(graph.select).toHaveBeenLastCalledWith({ kind: 'house', id: 'dior' }, true);
    expect(screen.getByRole('dialog', { name: 'Dior' })).toBeTruthy();
    await user.click(within(screen.getByRole('dialog', { name: 'Paris' })).getByRole('button', { name: 'Close Paris' }));
    expect(screen.queryByRole('dialog', { name: 'Paris' })).toBeNull();
    expect(screen.getByRole('dialog', { name: 'Dior' })).toBeTruthy();
  });

  it('frames logos and finds brands in a city from its search dropdown', async () => {
    const user = userEvent.setup();
    render(<App />);
    const graph = mocks.instances[0]!;
    openCity('Paris');
    const paris = screen.getByRole('dialog', { name: 'Paris' });
    const grid = within(paris).getByRole('list', { name: 'Brands in Paris' });
    expect(grid.querySelectorAll('.city-icon-frame').length).toBe(within(grid).getAllByRole('button').length);
    const find = within(paris).getByRole('combobox', { name: 'Find:' });
    await user.click(find);
    // The dropdown lists every brand here, not just the first page.
    const options = within(within(paris).getByRole('listbox')).getAllByRole('option');
    expect(options.length).toBe(within(grid).getAllByRole('button').length);
    expect(options.length).toBeGreaterThan(60);
    await user.type(find, 'louis v');
    expect(within(grid).getAllByRole('button').map((button) => button.textContent)).toEqual(['Louis Vuitton']);
    expect(within(paris).getByText(/^1 of \d+ brands$/)).toBeTruthy();
    await user.click(within(paris).getByRole('option', { name: 'Louis Vuitton' }));
    expect(graph.select).toHaveBeenLastCalledWith({ kind: 'house', id: 'louisVuitton' }, true);
    expect((find as HTMLInputElement).value).toBe('');
    expect(within(screen.getByRole('list', { name: 'Brands in Paris' })).getAllByRole('button').length).toBeGreaterThan(60);
  });

  it('opens city windows four icons wide, just tall enough for their brands up to four rows', () => {
    const one = cityWindowSize(1);
    const four = cityWindowSize(4);
    const eight = cityWindowSize(8);
    const sixteen = cityWindowSize(16);
    const twenty = cityWindowSize(20);
    expect(one).toEqual(four);
    expect(eight.width).toBe(one.width);
    expect(eight.height).toBeGreaterThan(one.height);
    expect(sixteen.height).toBe(twenty.height);
    // The scrollbar's gutter is always reserved, so scrolling windows keep the same width.
    expect(twenty.width).toBe(sixteen.width);
    expect(cityWindowSize(200)).toEqual(sixteen);
    // A one-brand window isn't widened to the Properties window minimum.
    const area = { width: 1400, height: 900 };
    const small = clampRect(defaultRect(area, 0, 'left', one, one), area, one);
    expect([small.width, small.height]).toEqual([one.width, one.height]);
    expect(one.height).toBeLessThan(cityWindowSize(16).height);
    const width = vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(1400);
    const height = vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(900);
    try {
      render(<App />);
      openCity('Paris');
      const paris = screen.getByRole('dialog', { name: 'Paris' });
      expect([paris.style.width, paris.style.height]).toEqual([`${sixteen.width}px`, `${sixteen.height}px`]);
    } finally { width.mockRestore(); height.mockRestore(); }
  });

  it('opens a brand\'s origin city, listing brands founded there that moved away', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.type(within(document.querySelector<HTMLElement>('.taskbar')!).getByRole('combobox'), 'duvetica');
    await user.click(screen.getByRole('option', { name: 'Duvetica house' }));
    await user.click(within(screen.getByRole('dialog', { name: 'Duvetica' })).getByRole('link', { name: 'Mogliano Veneto' }));
    const origin = screen.getByRole('dialog', { name: 'Mogliano Veneto' });
    expect(within(origin).getByText('Founded here, now based elsewhere')).toBeTruthy();
    expect(within(within(origin).getByRole('list', { name: 'Brands in Mogliano Veneto' })).getByRole('button', { name: 'Duvetica' })).toBeTruthy();
    expect(within(origin).getByText(/1 founded here/)).toBeTruthy();
  });

  it('opens city and country windows from the location in a brand\'s Properties', async () => {
    const user = userEvent.setup();
    render(<App />);
    const graph = mocks.instances[0]!;
    await user.type(within(document.querySelector<HTMLElement>('.taskbar')!).getByRole('combobox'), 'dior');
    await user.click(screen.getByRole('option', { name: 'Dior house' }));
    const dior = screen.getByRole('dialog', { name: 'Dior' });
    await user.click(within(dior).getByRole('link', { name: 'Paris' }));
    expect(within(screen.getByRole('dialog', { name: 'Paris' })).getByRole('list', { name: 'Brands in Paris' })).toBeTruthy();
    await user.click(within(screen.getByRole('dialog', { name: 'Dior' })).getByRole('link', { name: 'France' }));
    const france = screen.getByRole('dialog', { name: 'France' });
    const names = within(within(france).getByRole('list', { name: 'Brands in France' })).getAllByRole('button').map((button) => button.textContent);
    expect(names).toContain('Chanel');
    expect(names).toContain('Dior');
    // Place windows don't change the map selection.
    expect(graph.select).toHaveBeenLastCalledWith({ kind: 'house', id: 'dior' }, true);
    await user.click(within(france).getByRole('button', { name: 'Chanel' }));
    expect(screen.getByRole('dialog', { name: 'Chanel' })).toBeTruthy();
  });

  it('switches a place window to a Details table, sorts it and remembers both choices', async () => {
    const user = userEvent.setup();
    render(<App />);
    openCity('Paris');
    const paris = screen.getByRole('dialog', { name: 'Paris' });
    await user.click(within(paris).getByRole('combobox', { name: 'Sort by' }));
    await user.click(screen.getByRole('option', { name: 'By Founded' }));
    const icons = within(within(paris).getByRole('list', { name: 'Brands in Paris' })).getAllByRole('button').map((b) => b.textContent);
    await user.click(within(paris).getByRole('combobox', { name: 'View' }));
    await user.click(screen.getByRole('option', { name: 'Details' }));
    const table = within(paris).getByRole('table', { name: 'Brands in Paris' });
    const rows = within(table).getAllByRole('row').filter((row) => within(row).queryAllByRole('cell').length);
    expect(rows.map((row) => within(row).getAllByRole('cell')[0]!.textContent)).toEqual(icons);
    // Each section sorts on its own; check the brands based here (before the "Founded here" divider).
    const based = within(table).getAllByRole('row').slice(1);
    const divider = based.findIndex((row) => !within(row).queryAllByRole('cell').length);
    const years = (divider < 0 ? based : based.slice(0, divider)).map((row) => Number(within(row).getAllByRole('cell')[1]!.textContent)).filter(Number.isFinite);
    expect(years).toEqual([...years].sort((a, b) => a - b));
    // Column headers sort too: Tier runs from High Luxury down.
    await user.click(within(table).getByRole('button', { name: 'Tier' }));
    const tiers = within(table).getAllByRole('row').filter((row) => within(row).queryAllByRole('cell').length).map((row) => within(row).getAllByRole('cell')[2]!.textContent);
    expect(tiers[0]).toBe('High Luxury');
    await user.click(within(table).getByRole('button', { name: 'Dior' }));
    expect(screen.getByRole('dialog', { name: 'Dior' })).toBeTruthy();
    expect([localStorage.getItem('designer-map:place-view'), localStorage.getItem('designer-map:place-sort')]).toEqual(['details', 'tier']);
  });

  it('right-clicks a brand in a place window to open it, show it on the map or open its location', async () => {
    const user = userEvent.setup();
    render(<App />);
    const graph = mocks.instances[0]!;
    openCity('Paris');
    const grid = () => within(screen.getByRole('dialog', { name: 'Paris' })).getByRole('list', { name: 'Brands in Paris' });
    fireEvent.contextMenu(within(grid()).getByRole('button', { name: 'Dior' }), { clientX: 50, clientY: 50 });
    let menu = screen.getByRole('menu', { name: 'Dior actions' });
    expect(within(menu).getAllByRole('menuitem').map((item) => item.textContent)).toEqual(['Open', 'Show on Map', 'Open France']);
    await user.click(within(menu).getByRole('menuitem', { name: 'Show on Map' }));
    // Selected and revealed on the map, without a Properties window.
    expect(graph.select).toHaveBeenLastCalledWith({ kind: 'house', id: 'dior' }, true);
    expect(screen.queryByRole('dialog', { name: 'Dior' })).toBeNull();
    fireEvent.contextMenu(within(grid()).getByRole('button', { name: 'Dior' }), { clientX: 50, clientY: 50 });
    menu = screen.getByRole('menu', { name: 'Dior actions' });
    await user.click(within(menu).getByRole('menuitem', { name: 'Open France' }));
    expect(screen.getByRole('dialog', { name: 'France' })).toBeTruthy();
    const france = within(screen.getByRole('dialog', { name: 'France' })).getByRole('list', { name: 'Brands in France' });
    fireEvent.contextMenu(within(france).getByRole('button', { name: 'Dior' }), { clientX: 50, clientY: 50 });
    expect(within(screen.getByRole('menu', { name: 'Dior actions' })).getAllByRole('menuitem').map((item) => item.textContent))
      .toEqual(['Open', 'Show on Map', 'Open Paris']);
    await user.click(within(screen.getByRole('menu', { name: 'Dior actions' })).getByRole('menuitem', { name: 'Open' }));
    expect(screen.getByRole('dialog', { name: 'Dior' })).toBeTruthy();
  });

  it('shows a place\'s brands on the map from its window', async () => {
    const user = userEvent.setup();
    render(<App />);
    const graph = mocks.instances[0]!;
    openCity('Paris');
    await user.click(within(screen.getByRole('dialog', { name: 'Paris' })).getByRole('button', { name: 'Show on Map' }));
    expect(graph.showCities).toHaveBeenLastCalledWith(['Paris']);
    await user.click(within(screen.getByRole('dialog', { name: 'Paris' })).getByRole('button', { name: 'Dior' }));
    await user.click(within(screen.getByRole('dialog', { name: 'Dior' })).getByRole('link', { name: 'France' }));
    await user.click(within(screen.getByRole('dialog', { name: 'France' })).getByRole('button', { name: 'Show on Map' }));
    const cities = graph.showCities.mock.lastCall![0] as string[];
    expect(cities).toContain('Paris');
    expect(new Set(cities).size).toBe(cities.length);
  });

  it('opens each city once, focusing an open city instead of repeating it', () => {
    render(<App />);
    for (const city of ['Paris', 'Milan', 'London']) openCity(city);
    const titles = screen.getAllByRole('dialog').map((dialog) => document.getElementById(dialog.getAttribute('aria-labelledby')!)!.textContent);
    expect(titles).toEqual(['Paris', 'Milan', 'London']);
    // Re-opening an open city focuses it rather than adding another.
    openCity('Milan');
    expect(screen.getAllByRole('dialog')).toHaveLength(3);
    expect(screen.getByRole('dialog', { name: 'Milan' }).hasAttribute('data-active')).toBe(true);
  });

  it('can expand cities on the map instead, remembering the choice without rebuilding the graph', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<App />);
    const graph = mocks.instances[0]! as typeof mocks.instances[0] & { toggleCity: ReturnType<typeof vi.fn> };
    graph.toggleCity = vi.fn();
    await openStart(user);
    await user.click(screen.getByRole('radio', { name: 'On map' }));
    openCity('Paris');
    expect(graph.toggleCity).toHaveBeenCalledWith('Paris');
    expect(screen.queryByRole('dialog', { name: 'Paris' })).toBeNull();
    expect(mocks.instances).toHaveLength(1);
    expect(localStorage.getItem('designer-map:city-view')).toBe('map');
    unmount();
    render(<App />);
    await openStart(user);
    expect(screen.getByRole<HTMLInputElement>('radio', { name: 'On map' }).checked).toBe(true);
    await user.click(screen.getByRole('radio', { name: 'In windows' }));
    openCity('Paris');
    expect(screen.getByRole('dialog', { name: 'Paris' })).toBeTruthy();
  });

  it('only lists main brands that match the year and tag filters', () => {
    render(<App />);
    openYear();
    fireEvent.change(screen.getByRole('slider'), { target: { value: '1900' } });
    openCity('Paris');
    const names = within(screen.getByRole('list', { name: 'Brands in Paris' })).getAllByRole('button').map((button) => button.textContent);
    expect(names).toContain('Louis Vuitton');
    expect(names).not.toContain('Dior');
  });
});

describe('Start menu commands', () => {
  const startMenu = () => within(screen.getByRole('dialog', { name: 'Start menu' }));
  const runCommand = async (user: ReturnType<typeof userEvent.setup>, text: string) => {
    await openStart(user);
    await user.click(startMenu().getByRole('button', { name: 'Run…' }));
    const input = within(screen.getByRole('dialog', { name: 'Run' })).getByRole('combobox');
    await user.clear(input);
    await user.type(input, text);
    await user.keyboard('{Enter}');
  };

  it('Run… opens a brand by its exact name, a place or a year, and reports unknown names', async () => {
    const user = userEvent.setup();
    render(<App />);
    await runCommand(user, 'Dior');
    // Run stays open as an ordinary window, behind the brand it opened.
    const runWindow = screen.getByRole('dialog', { name: 'Run' });
    expect(within(runWindow).getByRole('combobox')).toHaveProperty('value', 'Dior');
    expect(within(document.querySelector<HTMLElement>('.taskbar')!).getByRole('button', { name: 'Run' })).toBeTruthy();
    expect(screen.getByRole('dialog', { name: 'Dior' })).toBeTruthy();
    expect(mocks.instances[0]!.select).toHaveBeenLastCalledWith({ kind: 'house', id: 'dior' }, true);

    await runCommand(user, 'Paris');
    expect(screen.getByRole('dialog', { name: 'Paris' })).toBeTruthy();

    await runCommand(user, '1990');
    expect(screen.getByText('Up to 1990')).toBeTruthy();

    await runCommand(user, 'zzqx');
    const dialog = screen.getByRole('dialog', { name: 'Run' });
    expect(within(dialog).getByRole('alert').textContent).toContain("Cannot find 'zzqx'");
    await user.click(within(dialog).getByRole('button', { name: 'Browse…' }));
    expect(screen.getByRole('dialog', { name: 'Directory' })).toBeTruthy();
    // Opening Run again focuses the same window; Cancel closes it.
    await openStart(user);
    await user.click(startMenu().getByRole('button', { name: 'Run…' }));
    expect(screen.getAllByRole('dialog', { name: 'Run' })).toHaveLength(1);
    await user.click(within(screen.getByRole('dialog', { name: 'Run' })).getByRole('button', { name: 'Cancel' }));
    expect(screen.queryByRole('dialog', { name: 'Run' })).toBeNull();
  });

  it('the Run window minimizes and restores from the taskbar like other windows', async () => {
    const user = userEvent.setup();
    render(<App />);
    await openStart(user);
    await user.click(startMenu().getByRole('button', { name: 'Run…' }));
    const runWindow = screen.getByRole('dialog', { name: 'Run' });
    await user.click(within(runWindow).getByRole('button', { name: 'Minimize Run' }));
    expect(screen.queryByRole('dialog', { name: 'Run' })).toBeNull();
    await user.click(within(document.querySelector<HTMLElement>('.taskbar')!).getByRole('button', { name: 'Run' }));
    expect(screen.getByRole('dialog', { name: 'Run' })).toBeTruthy();
  });

  it('Documents lists recently opened items, newest first, and reopens them', async () => {
    const user = userEvent.setup();
    render(<App />);
    await openStart(user);
    expect(startMenu().getByRole('group', { name: 'Documents' }).textContent).toContain('(Empty)');
    await user.keyboard('{Escape}');
    await runCommand(user, 'Dior');
    await runCommand(user, 'Paris');
    await openStart(user);
    const documents = startMenu().getByRole('group', { name: 'Documents' });
    expect(within(documents).getAllByRole('button').map((b) => b.querySelector('.start-label')?.textContent).filter(Boolean)).toEqual(['Paris', 'Dior']);
    expect(JSON.parse(localStorage.getItem('designer-map:recent')!)).toEqual([{ kind: 'city', id: 'Paris' }, { kind: 'house', id: 'dior' }]);
    await user.click(within(documents).getByRole('button', { name: /Dior/ }));
    expect(screen.queryByRole('dialog', { name: 'Start menu' })).toBeNull();
    expect(mocks.instances[0]!.select).toHaveBeenLastCalledWith({ kind: 'house', id: 'dior' }, true);
    await openStart(user);
    await user.click(startMenu().getByRole('button', { name: 'Clear Documents' }));
    expect(startMenu().getByRole('group', { name: 'Documents' }).textContent).toContain('(Empty)');
  });

  it('Help opens one Help window with the map legend', async () => {
    const user = userEvent.setup();
    render(<App />);
    await openStart(user);
    await user.click(startMenu().getByRole('button', { name: 'Help' }));
    const help = screen.getByRole('dialog', { name: 'Help' });
    expect(within(help).getByText('Connection lines')).toBeTruthy();
    expect(within(document.querySelector<HTMLElement>('.taskbar')!).getByRole('button', { name: 'Help' })).toBeTruthy();
  });

  it('Reset View clears the selection, filters, year and windows, and shows the whole map', async () => {
    const user = userEvent.setup();
    render(<App />);
    const graph = mocks.instances[0]!;
    await runCommand(user, 'Dior');
    await runCommand(user, '1990');
    await openStart(user);
    await user.click(startMenu().getByRole('button', { name: 'Statistics' }));
    graph.setAllExpanded.mockClear();
    await openStart(user);
    await user.click(startMenu().getByRole('button', { name: 'Reset View' }));
    expect(screen.queryByRole('dialog', { name: 'Dior' })).toBeNull();
    expect(screen.queryByRole('dialog', { name: 'Statistics' })).toBeNull();
    expect(screen.getByText('Showing all years')).toBeTruthy();
    expect(screen.getByText('Nothing selected')).toBeTruthy();
    expect(graph.select).toHaveBeenLastCalledWith(null, false);
    expect(graph.setAllExpanded).toHaveBeenCalledWith(false);
    expect(graph.fit).toHaveBeenCalled();
    expect(document.getElementById('status-counts')!.textContent).toBe('View reset');
  });
});
