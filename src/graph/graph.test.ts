// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('cytoscape', async (importOriginal) => {
  const actual = await importOriginal<{ default: typeof import('cytoscape') }>();
  return {
    ...actual,
    default: (options: cytoscape.CytoscapeOptions) => actual.default({
      ...options,
      container: undefined,
      headless: true,
      styleEnabled: true,
    }),
  };
});

vi.mock('../data', () => {
  const houses = [
    { id: 'selected', name: 'Selected', city: 'London', founded: 1900 },
    { id: 'connected', name: 'Connected', city: 'Paris', founded: 1900 },
    { id: 'unrelated', name: 'Unrelated', city: 'Paris', founded: 1900 },
    { id: 'secondHop', name: 'Second Hop', city: 'Milan', founded: 1900 },
    { id: 'manual', name: 'Manual', city: 'Tokyo', founded: 1900 },
    { id: 'standalone', name: 'Standalone', city: 'Berlin', founded: 1900 },
    { id: 'future', name: 'Future', city: 'Madrid', founded: 2025 },
  ];
  const moves = [
    { designerId: 'one', from: { house: 'selected' }, to: { house: 'connected' }, year: 2000, concurrent: false },
    { designerId: 'two', from: { house: 'connected' }, to: { house: 'secondHop' }, year: 2010, concurrent: false },
    { designerId: 'three', from: { house: 'selected' }, to: { house: 'future' }, year: 2030, concurrent: false },
  ];
  return {
    houses,
    allMoves: () => moves,
    careerOf: (id: string) => (id === 'two' ? ['connected', 'secondHop']
      : id === 'three' ? ['selected', 'future'] : ['selected', 'connected'])
      .map((house) => ({ house })),
    getHouse: (id: string) => houses.find((h) => h.id === id),
    housesInGroup: (id: string) => id === 'whpGlobal'
      ? houses.filter((h) => ['selected', 'connected', 'future'].includes(h.id)) : [],
    getDesigner: (id: string) => ({ id, name: id }),
    logoUrl: () => undefined,
  };
});

import { DesignerGraph } from './graph';
import { nodeId } from './elements';
import { GroupId } from '../data/groups';

let graph: DesignerGraph;
const houseNode = (id: string) => graph.cy.getElementById(nodeId.house(id));
const openHouses = () => graph.cy.nodes('[kind = "house"]').not('.hidden, .collapsed').map((n) => n.data('refId')).sort();

beforeEach(() => {
  vi.stubGlobal('ResizeObserver', class {
    observe() {}
    disconnect() {}
  });
  graph = new DesignerGraph(document.createElement('div'), { onSelect: vi.fn() });
});

afterEach(() => {
  graph.destroy();
  vi.unstubAllGlobals();
});

describe('brand selection on the map', () => {
  it('reveals direct connections without opening unrelated brands or outlining neighbors', () => {
    graph.setYear(2020);
    graph.select({ kind: 'house', id: 'selected' });
    expect(openHouses()).toEqual(['connected', 'selected']);
    expect(houseNode('selected').hasClass('focus')).toBe(true);
    expect(houseNode('selected').hasClass('highlight')).toBe(true);
    expect(houseNode('connected').hasClass('focus')).toBe(false);
    expect(houseNode('connected').hasClass('highlight')).toBe(false);
    expect(houseNode('connected').selected()).toBe(false);
    expect(graph.cy.edges('[kind = "move"]').filter((e) => e.data('designerId') === 'one').hasClass('highlight')).toBe(true);
    graph.setShowMoves(false);
    expect(graph.cy.edges('[kind = "move"]').filter((e) => e.data('designerId') === 'one').hasClass('lines-off')).toBe(false);
    expect(graph.cy.edges('[kind = "move"]').filter((e) => e.data('designerId') === 'two').hasClass('lines-off')).toBe(true);
  });

  it('updates automatic reveals when the selected brand or year changes', () => {
    graph.setYear(2020);
    graph.select({ kind: 'house', id: 'selected' });
    graph.setYear(2040);
    expect(openHouses()).toEqual(['connected', 'future', 'selected']);
    graph.setYear(1990);
    expect(openHouses()).toEqual(['selected']);
    graph.select({ kind: 'house', id: 'standalone' });
    expect(openHouses()).toEqual(['standalone']);
    graph.select(null);
    expect(openHouses()).toEqual([]);
  });

  it('preserves manual city expansion and lets city clicks reveal the full city', () => {
    graph.setYear(2020);
    graph.toggleCity('Tokyo');
    graph.select({ kind: 'house', id: 'selected' });
    expect(openHouses()).toEqual(['connected', 'manual', 'selected']);
    graph.toggleCity('Paris'); // collapse the automatic reveal
    graph.toggleCity('Paris'); // manually open the whole city
    expect(openHouses()).toEqual(['connected', 'manual', 'selected', 'unrelated']);
    graph.select(null);
    expect(openHouses()).toEqual(['connected', 'manual', 'unrelated']);
    graph.setAllExpanded(true);
    graph.select({ kind: 'house', id: 'selected' });
    expect(openHouses()).toContain('secondHop');
    expect(openHouses()).toContain('unrelated');
  });

  it('respects tag filters when revealing connections, including manually opened cities', () => {
    graph.setYear(2020);
    graph.select({ kind: 'house', id: 'selected' });
    graph.setHouseFilter(new Set(['selected']));
    expect(openHouses()).toEqual(['selected']);
    graph.setHouseFilter(undefined);
    expect(openHouses()).toEqual(['connected', 'selected']);
    graph.setAllExpanded(true);
    graph.setHouseFilter(new Set(['selected']));
    expect(openHouses()).toEqual(['selected']);
    graph.setHouseFilter(undefined);
    expect(openHouses()).toContain('unrelated');
  });

  it('keeps designer selection highlighting all houses in the designer’s career', () => {
    graph.setYear(2020);
    graph.select({ kind: 'house', id: 'selected' });
    graph.select({ kind: 'designer', id: 'one' });
    expect(openHouses()).toEqual(['connected', 'selected']);
    expect(houseNode('selected').hasClass('highlight')).toBe(true);
    expect(houseNode('connected').hasClass('highlight')).toBe(true);
    expect(houseNode('selected').hasClass('focus')).toBe(false);
    expect(houseNode('connected').hasClass('focus')).toBe(false);
  });

  it('opens only career brands and replaces them when selecting another designer or clearing', () => {
    graph.select({ kind: 'designer', id: 'one' });
    expect(openHouses()).toEqual(['connected', 'selected']);
    graph.select({ kind: 'designer', id: 'two' });
    expect(openHouses()).toEqual(['connected', 'secondHop']);
    graph.select(null);
    expect(openHouses()).toEqual([]);
  });

  it('updates designer reveals with year and filters while preserving manual city expansion', () => {
    graph.toggleCity('Tokyo');
    graph.setYear(2020);
    graph.select({ kind: 'designer', id: 'three' });
    expect(openHouses()).toEqual(['manual', 'selected']);
    graph.setYear(2040);
    expect(openHouses()).toEqual(['future', 'manual', 'selected']);
    graph.setHouseFilter(new Set(['future', 'manual']));
    expect(openHouses()).toEqual(['future', 'manual']);
    graph.setHouseFilter(undefined);
    graph.select({ kind: 'designer', id: 'one' });
    graph.toggleCity('Paris'); // collapse the automatic reveal
    graph.toggleCity('Paris'); // explicitly open the whole city
    expect(openHouses()).toEqual(['connected', 'manual', 'selected', 'unrelated']);
    graph.select(null);
    expect(openHouses()).toEqual(['connected', 'manual', 'unrelated']);
  });

  it('reveals only group members when opening a group page and clears the previous brand connections', () => {
    graph.setYear(2020);
    graph.select({ kind: 'house', id: 'connected' });
    expect(openHouses()).toContain('secondHop');
    graph.select({ kind: 'group', id: GroupId.WHPGlobal });
    expect(openHouses()).toEqual(['connected', 'selected']);
    expect(houseNode('connected').hasClass('highlight')).toBe(false);
    expect(houseNode('selected').hasClass('focus')).toBe(false);
    graph.select(null);
    expect(openHouses()).toEqual([]);
  });

  it('updates group reveals with year and tag filters while preserving manually opened cities', () => {
    graph.toggleCity('Tokyo');
    graph.setYear(2020);
    graph.select({ kind: 'group', id: GroupId.WHPGlobal });
    graph.setYear(2040);
    expect(openHouses()).toEqual(['connected', 'future', 'manual', 'selected']);
    graph.setHouseFilter(new Set(['connected', 'manual']));
    expect(openHouses()).toEqual(['connected', 'manual']);
    graph.setHouseFilter(undefined);
    graph.setYear(2020);
    expect(openHouses()).toEqual(['connected', 'manual', 'selected']);
    graph.select({ kind: 'group', id: GroupId.GIII });
    expect(openHouses()).toEqual(['manual']);
  });
});
