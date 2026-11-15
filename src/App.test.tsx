// @vitest-environment jsdom
import { StrictMode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { GraphCallbacks } from './graph/graph';

const mocks = vi.hoisted(() => ({ instances: [] as {
  select: ReturnType<typeof vi.fn>; setHouseFilter: ReturnType<typeof vi.fn>;
  setYear: ReturnType<typeof vi.fn>; setShowMoves: ReturnType<typeof vi.fn>;
  setShowCollaborations: ReturnType<typeof vi.fn>; setConnectionFilter: ReturnType<typeof vi.fn>;
  setAllExpanded: ReturnType<typeof vi.fn>; destroy: ReturnType<typeof vi.fn>;
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
    fit = vi.fn();
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
import { GroupId } from './data/groups';

afterEach(() => {
  cleanup();
  localStorage.clear();
  mocks.instances.length = 0;
  vi.useRealTimers();
});

describe('React app graph integration', () => {
  it('persists the collaboration toggle independently from career lines', async () => {
    localStorage.setItem('designer-map:show-collaborations', 'off');
    const user = userEvent.setup();
    render(<App />);
    const graph = mocks.instances[0]!;
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
    await user.type(screen.getByRole('combobox'), 'elliott.hill');
    await user.click(screen.getByRole('option', { name: 'Elliott Hill leader' }));
    expect(screen.getByRole('heading', { name: 'Elliott Hill' })).toBeTruthy();
    expect(graph.select).toHaveBeenLastCalledWith({ kind: 'designer', id: 'elliottHill' }, true);
  });

  it('finds a brand by its normalized historical name and reveals its founder profile', async () => {
    const user = userEvent.setup();
    render(<App />);
    const graph = mocks.instances[0]!;
    await user.type(screen.getByRole('combobox'), ' g.STAR / raw ');
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
    await user.type(screen.getByRole('combobox'), 'WHP Global');
    await user.click(screen.getByRole('option', { name: 'WHP Global group' }));
    expect(screen.getByRole('heading', { name: 'WHP Global' })).toBeTruthy();
    expect(graph.select).toHaveBeenLastCalledWith({ kind: 'group', id: GroupId.WHPGlobal }, true);
    await user.click(screen.getByRole('link', { name: 'Marc Jacobs' }));
    expect(graph.select).toHaveBeenLastCalledWith({ kind: 'house', id: 'marcJacobs' }, true);
    await user.click(screen.getByRole('link', { name: 'WHP Global' }));
    expect(screen.getByRole('heading', { name: 'WHP Global' })).toBeTruthy();
    expect(graph.select).toHaveBeenLastCalledWith({ kind: 'group', id: GroupId.WHPGlobal }, true);
  });

  it('preserves search, tag filters, year filtering, and the graph instance across UI updates', async () => {
    const user = userEvent.setup();
    const view = render(<StrictMode><App /></StrictMode>);
    expect(mocks.instances).toHaveLength(2);
    expect(mocks.instances[0]!.destroy).toHaveBeenCalledOnce();
    const graph = mocks.instances[1]!;
    await user.type(screen.getByRole('combobox'), 'dior');
    await user.click(screen.getByRole('option', { name: 'Dior house' }));
    expect(screen.getByRole('heading', { name: 'Dior' })).toBeTruthy();
    expect(graph.select).toHaveBeenLastCalledWith({ kind: 'house', id: 'dior' }, true);
    await user.click(screen.getByRole('button', { name: 'Bags' }));
    expect(screen.getByRole('button', { name: 'Remove Bags from Product' })).toBeTruthy();
    const ids = graph.setHouseFilter.mock.lastCall?.[0] as Set<string>;
    expect(ids.has('dior')).toBe(true);
    expect(ids.has('rimowa')).toBe(false);
    fireEvent.change(screen.getByRole('slider'), { target: { value: '1940' } });
    expect(document.getElementById('panel-title')?.textContent).toBe('Directory');
    expect(graph.setYear).toHaveBeenLastCalledWith(1940);
    expect(graph.select).toHaveBeenLastCalledWith(null, false);
    await user.click(screen.getByRole('button', { name: 'Clear All' }));
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
    expect(screen.getByRole<HTMLInputElement>('checkbox', { name: 'Show move lines' }).checked).toBe(false);
    expect(graph.setShowMoves).toHaveBeenLastCalledWith(false);
    await user.click(screen.getByRole('checkbox', { name: 'Show move lines' }));
    expect(graph.setShowMoves).toHaveBeenLastCalledWith(true);
    expect(localStorage.getItem('designer-map:show-lines')).toBe('on');
    await user.click(screen.getByRole('button', { name: 'Expand all' }));
    expect(graph.setAllExpanded).toHaveBeenLastCalledWith(true);
    expect(screen.getByRole('button', { name: 'Collapse all' }).getAttribute('aria-pressed')).toBe('true');
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

  it('plays and stops the timeline and cleans up playback and clock timers on unmount', () => {
    vi.useFakeTimers();
    const view = render(<StrictMode><App /></StrictMode>);
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
  await user.click(screen.getByRole('button', { name: 'Collaborations' }));
  expect(graph.setConnectionFilter).toHaveBeenLastCalledWith('collaborations');
  expect(screen.getByRole('button', { name: 'Collaborations' }).getAttribute('aria-pressed')).toBe('true');
  await user.click(screen.getByRole('button', { name: 'Designers' }));
  expect(graph.setConnectionFilter).toHaveBeenLastCalledWith('designers');
  expect(mocks.instances).toHaveLength(1);
});
