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
    { id: 'regionalOne', name: 'Regional One', city: 'Gardena', founded: 1900 },
    { id: 'regionalTwo', name: 'Regional Two', city: 'Irvine', founded: 2000 },
    { id: 'regionalFuture', name: 'Regional Future', city: 'Seal Beach', founded: 2035 },
    { id: 'regionalCoast', name: 'Regional Coast', city: 'Santa Cruz', founded: 1900 },
    { id: 'family', name: 'Family', city: 'Berlin', founded: 1900 },
    { id: 'label', name: 'Sub Label', city: 'Rome', founded: 2000, parentHouse: 'family' },
    { id: 'nestedLabel', name: 'Nested Label', city: 'Amsterdam', founded: 2010, parentHouse: 'label' },
    { id: 'futureLabel', name: 'Future Label', city: 'Rome', founded: 2035, parentHouse: 'family' },
  ];
  const moves = [
    { designerId: 'one', from: { house: 'selected' }, to: { house: 'connected' }, year: 2000, concurrent: false },
    { designerId: 'two', from: { house: 'connected' }, to: { house: 'secondHop' }, year: 2010, concurrent: false },
    { designerId: 'three', from: { house: 'selected' }, to: { house: 'future' }, year: 2030, concurrent: false },
    { designerId: 'regional', from: { house: 'regionalOne' }, to: { house: 'regionalTwo' }, year: 2005, concurrent: false },
    { designerId: 'regional', from: { house: 'regionalTwo' }, to: { house: 'connected' }, year: 2010, concurrent: false },
    { designerId: 'labelDesigner', from: { house: 'label' }, to: { house: 'manual' }, year: 2012, concurrent: false },
  ];
  const collaborations: import('../types').Collaboration[] = [];
  return {
    houses,
    collaborations,
    collaborationsOf: (id: string) => collaborations.filter((project) => project.houses.includes(id)),
    allMoves: () => moves,
    careerOf: (id: string) => (id === 'regional' ? ['regionalOne', 'regionalTwo', 'connected']
      : id === 'two' ? ['connected', 'secondHop']
      : id === 'three' ? ['selected', 'future'] : ['selected', 'connected'])
      .map((house) => ({ house })),
    getHouse: (id: string) => houses.find((h) => h.id === id),
    housesInGroup: (id: string) => id === 'whpGlobal'
      ? houses.filter((h) => ['selected', 'connected', 'future'].includes(h.id)) : [],
    getDesigner: (id: string) => ({ id, name: id }),
    logoUrl: () => undefined,
  };
});

import { DesignerGraph, type GraphCallbacks } from './graph';
import { nodeId } from './elements';
import { GroupId } from '../data/groups';
import { collaborations } from '../data';

let graph: DesignerGraph;
let onSelect: ReturnType<typeof vi.fn<GraphCallbacks['onSelect']>>;
const houseNode = (id: string) => graph.cy.getElementById(nodeId.house(id));
const openHouses = () => graph.cy.nodes('[kind = "house"]').not('.hidden, .collapsed').map((n) => n.data('refId')).sort();

beforeEach(() => {
  vi.stubGlobal('ResizeObserver', class {
    observe() {}
    disconnect() {}
  });
  onSelect = vi.fn();
  graph = new DesignerGraph(document.createElement('div'), { onSelect });
});

afterEach(() => {
  collaborations.length = 0;
  graph.destroy();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe('brand selection on the map', () => {
  const visiblePins = () => graph.cy.nodes('[kind = "marker"]').filter((node) => node.visible())
    .map((node) => node.data('city')).sort();

  it('shows only the selected brand city pin while keeping connected brands visible', () => {
    graph.setYear(2020);
    const originalPins = visiblePins();
    graph.toggleCity('Tokyo');
    graph.select({ kind: 'house', id: 'selected' });
    expect(visiblePins()).toEqual(['London']);
    expect(openHouses()).toEqual(['connected', 'manual', 'selected']);
    expect(graph.cy.getElementById('gl:Paris').visible()).toBe(false);
    expect(graph.cy.getElementById('gl:Tokyo').visible()).toBe(false);
    graph.cy.zoom(2);
    graph.setYear(2021);
    expect(visiblePins()).toEqual(['London']);
    graph.select({ kind: 'house', id: 'connected' });
    expect(visiblePins()).toEqual(['Paris']);
    graph.select(null);
    expect(visiblePins()).toEqual(originalPins);
    expect(graph.cy.getElementById('gl:Tokyo').visible()).toBe(true);
    expect(openHouses()).toEqual(['manual']);
  });

  it('restores only filter-eligible pins and restores pins for designer and group views', () => {
    graph.setYear(2020);
    graph.setHouseFilter(new Set(['selected', 'connected']));
    graph.select({ kind: 'house', id: 'selected' });
    expect(visiblePins()).toEqual(['London']);
    graph.select({ kind: 'designer', id: 'one' });
    expect(visiblePins()).toEqual(['London', 'Paris']);
    graph.select({ kind: 'house', id: 'selected' });
    graph.select({ kind: 'group', id: GroupId.WHPGlobal });
    expect(visiblePins()).toEqual(['London', 'Paris']);
    graph.select({ kind: 'house', id: 'selected' });
    graph.setHouseFilter(new Set(['connected']));
    expect(visiblePins()).toEqual([]);
    graph.select(null);
    expect(visiblePins()).toEqual(['Paris']);
  });

  it.each([
    ['regionalOne', 'Southern California'],
    ['label', 'Berlin'],
  ])('keeps the mapped location pin for %s', (id, location) => {
    graph.select({ kind: 'house', id });
    expect(visiblePins()).toEqual([location]);
  });

  it('reveals every collaboration partner and points red arrows out from the selected brand', () => {
    graph.setYear(2020);
    collaborations.push({ id: 'threeBrands', houses: ['selected', 'connected', 'manual'], year: 2015, name: 'Test project' });
    graph.select({ kind: 'house', id: 'selected' });
    expect(openHouses()).toEqual(['connected', 'manual', 'selected']);
    const arrows = graph.cy.edges('[kind = "collaboration"]');
    expect(arrows.length).toBe(2);
    expect(arrows.map((edge) => edge.data('fromHouse'))).toEqual(['selected', 'selected']);
    expect(arrows.map((edge) => edge.data('toHouse')).sort()).toEqual(['connected', 'manual']);
    expect(arrows[0]!.style('line-color')).toBe('rgb(204,0,0)');
    expect(arrows[0]!.hasClass('highlight')).toBe(true);
    graph.select({ kind: 'house', id: 'connected' });
    expect(graph.cy.edges('[kind = "collaboration"]').map((edge) => edge.data('fromHouse'))).toEqual(['connected', 'connected']);
  });

  it('toggles collaboration lines independently and respects years and partner filters', () => {
    graph.setYear(2020);
    collaborations.push({ id: 'project', houses: ['selected', 'manual'], year: 2015 });
    graph.select({ kind: 'house', id: 'selected' });
    graph.setShowMoves(false);
    expect(graph.cy.edges('[kind = "collaboration"]').length).toBe(1);
    graph.setShowCollaborations(false);
    expect(graph.cy.edges('[kind = "collaboration"]').length).toBe(0);
    expect(openHouses()).toEqual(['selected']);
    graph.setShowCollaborations(true);
    expect(openHouses()).toEqual(['manual', 'selected']);
    graph.setYear(2010);
    expect(openHouses()).toEqual(['selected']);
    expect(graph.cy.edges('[kind = "collaboration"]')[0]!.hasClass('hidden')).toBe(true);
    graph.setYear(2020);
    graph.setHouseFilter(new Set(['selected', 'connected']));
    expect(openHouses()).toEqual(['selected']);
    expect(graph.cy.edges('[kind = "collaboration"]')[0]!.hasClass('hidden')).toBe(true);
    graph.setHouseFilter(undefined);
    graph.select(null);
    expect(openHouses()).toEqual([]);
  });

  it('merges repeat and multi-brand releases into one arrow per pair with year-aware labels', () => {
    collaborations.push(
      { id: 'first', houses: ['selected', 'connected'], year: 2015 },
      { id: 'sameYear', houses: ['connected', 'selected'], year: 2015 },
      { id: 'later', houses: ['connected', 'manual', 'selected'], year: 2020 },
    );
    graph.setYear(2025);
    graph.select({ kind: 'house', id: 'selected' });
    const arrows = () => graph.cy.edges('[kind = "collaboration"]').not('.hidden');
    expect(arrows().length).toBe(2);
    const connected = () => arrows().filter((edge) => edge.data('toHouse') === 'connected')[0]!;
    expect(connected().data('label')).toBe('Selected × Connected (Multiple)');
    expect(arrows().filter((edge) => edge.data('toHouse') === 'manual')[0]!.data('label'))
      .toBe('Selected × Manual (2020)');

    graph.setYear(2015);
    expect(arrows().length).toBe(1);
    expect(connected().data('label')).toBe('Selected × Connected (2015)');
    graph.setYear(2010);
    expect(arrows().length).toBe(0);

    graph.setYear(2025);
    graph.select({ kind: 'house', id: 'connected' });
    expect(arrows().length).toBe(2);
    expect(arrows().every((edge) => edge.data('fromHouse') === 'connected')).toBe(true);
    expect(arrows().filter((edge) => edge.data('toHouse') === 'selected')[0]!.data('label'))
      .toBe('Connected × Selected (Multiple)');

    graph.select(null);
    graph.setAllExpanded(true);
    expect(arrows().length).toBe(0); // Don't construct invisible collaboration edges.
  });

  it('reveals same-city partners and nested collaborator labels without opening unrelated brands', () => {
    graph.setYear(2020);
    collaborations.push({ id: 'familyProject', houses: ['family', 'standalone', 'nestedLabel'], year: 2015 });
    graph.toggleCity('Berlin');
    graph.select({ kind: 'house', id: 'family' });
    expect(openHouses()).toEqual(['family', 'label', 'nestedLabel', 'standalone']);
    expect(graph.cy.edges('[kind = "collaboration"]').length).toBe(2);
    graph.setShowCollaborations(false);
    expect(openHouses()).toEqual(['family', 'label']);
    graph.select(null);
    expect(openHouses()).toEqual(['family', 'standalone']);
  });

  it('animates labels from their parent and restores other brands from their previous positions', () => {
    const motion = vi.fn(() => ({ matches: true }));
    vi.stubGlobal('matchMedia', motion);
    graph.setYear(2020);
    graph.toggleCity('Berlin');
    const parentPosition = { ...houseNode('family').position() };
    const otherPosition = { ...houseNode('standalone').position() };
    motion.mockReturnValue({ matches: false });
    const label = houseNode('label')[0]!;
    const labelAnimation = vi.spyOn(label, 'animate').mockImplementation(() => label);
    graph.select({ kind: 'house', id: 'family' });
    expect(label.position()).toEqual(parentPosition);
    expect(labelAnimation).toHaveBeenCalledWith(
      { position: { x: expect.any(Number), y: expect.any(Number) } },
      { duration: 250, easing: 'ease-in-out-cubic', queue: false },
    );
    const other = houseNode('standalone')[0]!;
    const restoreAnimation = vi.spyOn(other, 'animate').mockImplementation(() => other);
    graph.select(null);
    expect(other.position()).toEqual(otherPosition);
    expect(restoreAnimation).toHaveBeenCalled();
    expect(openHouses()).toEqual(['family', 'standalone']);
  });

  it('honours reduced motion during expansion, focus and restoration', () => {
    vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: true })));
    const parent = houseNode('family')[0]!;
    const animation = vi.spyOn(parent, 'animate');
    graph.toggleCity('Berlin');
    graph.select({ kind: 'house', id: 'family' });
    graph.select(null);
    expect(animation).not.toHaveBeenCalled();
    expect(openHouses()).toEqual(['family', 'standalone']);
  });

  it('focuses a brand family in an open city and restores the city on a second tap', () => {
    vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: true })));
    graph.setYear(2020);
    graph.toggleCity('Berlin');
    graph.toggleCity('Tokyo');
    expect(openHouses()).toEqual(['family', 'manual', 'standalone']);
    const parentPosition = { ...houseNode('family').position() };

    houseNode('family').emit('tap');
    expect(onSelect).toHaveBeenLastCalledWith({ kind: 'house', id: 'family' });
    graph.select(onSelect.mock.lastCall![0]);
    expect(openHouses()).toEqual(['family', 'label', 'manual']);
    expect(houseNode('family').hasClass('focus')).toBe(true);
    expect(houseNode('standalone').hasClass('collapsed')).toBe(true);
    expect(houseNode('family').position()).toEqual(parentPosition);
    expect(houseNode('label').position().y).toBe(parentPosition.y);
    expect(houseNode('label').position().x).toBeGreaterThan(parentPosition.x);

    houseNode('family').emit('tap');
    expect(onSelect).toHaveBeenLastCalledWith(null);
    graph.select(onSelect.mock.lastCall![0]);
    expect(openHouses()).toEqual(['family', 'manual', 'standalone']);
    expect(houseNode('family').hasClass('focus')).toBe(false);
    expect(graph.cy.getElementById(nodeId.city('Berlin')).data('expanded')).toBe(true);
  });

  it('replaces the city focus when switching brands and keeps it through filter changes', () => {
    graph.setYear(2020);
    graph.toggleCity('Berlin');
    graph.select({ kind: 'house', id: 'family' });
    graph.select({ kind: 'house', id: 'label' });
    expect(openHouses()).toEqual(['family', 'label', 'manual', 'nestedLabel']);
    graph.setHouseFilter(new Set(['label', 'standalone']));
    expect(openHouses()).toEqual(['family', 'label', 'standalone']);
    graph.setHouseFilter(undefined);
    expect(openHouses()).not.toContain('standalone');
    graph.select({ kind: 'house', id: 'standalone' });
    expect(openHouses()).toEqual(['family', 'standalone']);
    graph.select(null);
    expect(openHouses()).toEqual(['family', 'standalone']);
  });

  it('keeps all manually opened city brands visible when the selected brand has no local children', () => {
    graph.setYear(2020);
    graph.toggleCity('Paris');
    graph.select({ kind: 'house', id: 'connected' });
    expect(openHouses()).toEqual(['connected', 'regionalTwo', 'secondHop', 'selected', 'unrelated']);
    expect(houseNode('unrelated').hasClass('collapsed')).toBe(false);

    graph.toggleCity('Berlin');
    graph.select({ kind: 'house', id: 'family' });
    graph.setHouseFilter(new Set(['family', 'standalone']));
    expect(openHouses()).toContain('standalone');
    expect(openHouses()).not.toContain('label');
  });

  it('keeps labels out of city expansion, pin counts and Expand All until their parent is selected', () => {
    const pin = graph.cy.getElementById(nodeId.city('Berlin'));
    expect(pin.data('count')).toBe(2);
    expect(graph.cy.getElementById(nodeId.city('Rome')).empty()).toBe(true);
    graph.toggleCity('Berlin');
    expect(openHouses()).toEqual(['family', 'standalone']);
    graph.setAllExpanded(true);
    expect(openHouses()).not.toContain('label');
    expect(openHouses()).not.toContain('nestedLabel');
    graph.setYear(2020);
    graph.select({ kind: 'house', id: 'family' });
    expect(openHouses()).toContain('label');
    expect(openHouses()).not.toContain('futureLabel');
    expect(openHouses()).not.toContain('nestedLabel');
    expect(houseNode('label').data('city')).toBe('Rome');
    expect(houseNode('label').parent()[0]!.id()).toBe(nodeId.grid('Berlin'));
    expect(houseNode('label').hasClass('faded')).toBe(false);
    expect(pin.data('shown')).toBe(2);
    graph.select(null);
    expect(openHouses()).not.toContain('label');
  });

  it('opens nested labels directly with their ancestry and replaces the previous family reveal', () => {
    graph.setYear(2020);
    graph.select({ kind: 'house', id: 'nestedLabel' });
    expect(openHouses()).toEqual(['family', 'label', 'nestedLabel']);
    expect(houseNode('nestedLabel').hasClass('focus')).toBe(true);
    graph.select({ kind: 'house', id: 'label' });
    expect(openHouses()).toEqual(['family', 'label', 'manual', 'nestedLabel']);
    graph.select({ kind: 'house', id: 'selected' });
    expect(openHouses()).toEqual(['connected', 'selected']);
  });

  it('keeps a parent as context when only a sublabel matches the filters', () => {
    graph.setHouseFilter(new Set(['label']));
    graph.toggleCity('Berlin');
    expect(openHouses()).toEqual(['family']);
    expect(graph.cy.getElementById(nodeId.city('Berlin')).data('shown')).toBe(1);
    graph.select({ kind: 'house', id: 'family' });
    expect(openHouses()).toEqual(['family', 'label']);
    graph.setYear(1990);
    expect(openHouses()).toEqual([]);
    graph.setYear(2020);
    expect(openHouses()).toEqual(['family', 'label']);
    graph.select(null);
    expect(openHouses()).toEqual(['family']);
  });

  it('routes hidden-label careers through the parent, then through the revealed label', () => {
    graph.toggleCity('Berlin');
    let edge = graph.cy.edges('[designerId = "labelDesigner"]');
    expect(edge[0]!.source().id()).toBe(nodeId.house('family'));
    graph.select({ kind: 'house', id: 'family' });
    edge = graph.cy.edges('[designerId = "labelDesigner"]');
    expect(edge[0]!.source().id()).toBe(nodeId.house('label'));
    graph.select(null);
    expect(graph.cy.edges('[designerId = "labelDesigner"]')[0]!.source().id()).toBe(nodeId.house('family'));
  });

  it('reveals nested-label context and connected parents when their main brand is filtered out', () => {
    graph.setHouseFilter(new Set(['nestedLabel']));
    graph.select({ kind: 'house', id: 'family' });
    expect(openHouses()).toEqual(['family', 'label']);
    graph.select({ kind: 'house', id: 'label' });
    expect(openHouses()).toEqual(['family', 'label', 'nestedLabel']);
    graph.setHouseFilter(new Set(['label', 'manual']));
    graph.select({ kind: 'house', id: 'manual' });
    expect(openHouses()).toEqual(['family', 'manual']);
    expect(graph.cy.edges('[designerId = "labelDesigner"]')[0]!.source().id()).toBe(nodeId.house('family'));
  });

  it('opens a regional pin across cities while preserving the actual house locations', () => {
    const pin = graph.cy.getElementById(nodeId.city('Southern California'));
    expect(pin.data('count')).toBe(3);
    expect(graph.cy.getElementById(nodeId.city('Gardena')).empty()).toBe(true);
    expect(houseNode('regionalOne').data('city')).toBe('Gardena');
    expect(houseNode('regionalTwo').parent()[0]!.id()).toBe(nodeId.grid('Southern California'));
    graph.setYear(2020);
    expect(pin.data('shown')).toBe(2);
    pin.emit('tap');
    expect(openHouses()).toEqual(['regionalOne', 'regionalTwo']);
    expect(graph.cy.getElementById('gl:Southern California').hasClass('collapsed')).toBe(false);
    graph.setYear(2040);
    expect(pin.data('shown')).toBe(3);
    expect(openHouses()).toEqual(['regionalFuture', 'regionalOne', 'regionalTwo']);
    graph.setHouseFilter(new Set(['regionalTwo']));
    expect(pin.data('shown')).toBe(1);
    expect(openHouses()).toEqual(['regionalTwo']);
    graph.setHouseFilter(new Set());
    expect(pin.hasClass('hidden')).toBe(true);
    expect(graph.cy.getElementById('gl:Southern California').hasClass('hidden')).toBe(true);
  });

  it('routes collapsed moves through regional pins and reveals internal moves on expansion', () => {
    let moves = graph.cy.edges('[designerId = "regional"]');
    expect(moves.length).toBe(1); // No self-loop for a move inside the collapsed region.
    expect(moves[0]!.source().id()).toBe(nodeId.city('Southern California'));
    expect(moves[0]!.target().id()).toBe(nodeId.city('Paris'));
    graph.select({ kind: 'house', id: 'regionalOne' });
    expect(openHouses()).toEqual(['regionalOne', 'regionalTwo']);
    moves = graph.cy.edges('[designerId = "regional"]');
    expect(moves.length).toBe(2);
    const internal = moves.filter((e) => e.data('fromHouse') === 'regionalOne');
    expect(internal.source().id()).toBe(nodeId.house('regionalOne'));
    expect(internal.target().id()).toBe(nodeId.house('regionalTwo'));
    expect(internal.hasClass('highlight')).toBe(true);
    graph.select(null);
    expect(openHouses()).toEqual([]);
    graph.toggleCity('Gardena'); // Existing city-based calls resolve to the regional pin.
    graph.select({ kind: 'house', id: 'standalone' });
    graph.select(null);
    expect(openHouses()).toEqual(['regionalFuture', 'regionalOne', 'regionalTwo']);
  });

  it('reveals a designer across regional and city pins without opening unrelated regional brands', () => {
    graph.select({ kind: 'designer', id: 'regional' });
    expect(openHouses()).toEqual(['connected', 'regionalOne', 'regionalTwo']);
    expect(houseNode('regionalOne').hasClass('highlight')).toBe(true);
    expect(houseNode('regionalTwo').hasClass('highlight')).toBe(true);
    graph.setHouseFilter(new Set(['regionalTwo']));
    expect(openHouses()).toEqual(['regionalTwo']);
    graph.setHouseFilter(undefined);
    expect(openHouses()).toEqual(['connected', 'regionalOne', 'regionalTwo']);
    graph.select(null);
    expect(openHouses()).toEqual([]);
  });

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
    expect(graph.cy.edges('[kind = "move"]').filter((e) => e.data('designerId') === 'one').hasClass('lines-off')).toBe(true);
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


describe('crowded marker presentation', () => {
  it('separates pins, tethers them to unchanged anchors and updates after filtering', () => {
    graph.destroy();
    const host = document.createElement('div');
    graph = new DesignerGraph(host, { onSelect });
    const london = graph.cy.getElementById(nodeId.city('London'));
    const paris = graph.cy.getElementById(nodeId.city('Paris'));
    london.data('tip', { x: 100, y: 100 });
    paris.data('tip', { x: 100, y: 100 });
    graph.cy.zoom(1);
    graph.setYear(2020);
    const a = london.boundingBox({ includeLabels: false });
    const b = paris.boundingBox({ includeLabels: false });
    expect(a.x2 <= b.x1 || b.x2 <= a.x1 || a.y2 <= b.y1 || b.y2 <= a.y1).toBe(true);
    expect(london.data('tip')).toEqual({ x: 100, y: 100 });
    expect(paris.data('tip')).toEqual({ x: 100, y: 100 });
    expect(host.querySelector('.pin-leaders line[x1="100"][y1="100"]')).not.toBeNull();
    london.emit('mouseover');
    expect(london.style('text-opacity')).toBe('1');
    london.emit('mouseout');
    expect(london.style('text-opacity')).toBe(london.data('markerLabelVisible') ? '1' : '0');
    graph.setHouseFilter(new Set(['selected']));
    expect(host.querySelector('.pin-leaders line')).toBeNull();
    expect(london.position()).toEqual({ x: 100, y: 100 - london.height() / 2 });
    london.emit('tap');
    expect(openHouses()).toEqual(['selected']);
  });
});

describe('connection presentation', () => {
  it('filters partner reveals and lines, then restores both connection types', () => {
    collaborations.push({ id: 'partner', houses: ['selected', 'manual'], year: 2015 });
    graph.select({ kind: 'house', id: 'selected' });
    graph.setConnectionFilter('collaborations');
    expect(openHouses()).toEqual(['manual', 'selected']);
    expect(graph.cy.edges('[kind = "move"]').map((edge) => edge.hasClass('lines-off')).every(Boolean)).toBe(true);
    graph.setConnectionFilter('designers');
    expect(openHouses()).toContain('connected');
    expect(openHouses()).not.toContain('manual');
    expect(graph.cy.edges('[kind = "collaboration"]').map((edge) => edge.hasClass('lines-off')).every(Boolean)).toBe(true);
    graph.setConnectionFilter('all');
    expect(openHouses()).toContain('manual');
    expect(openHouses()).toContain('connected');
    expect(graph.cy.edges('[designerId = "two"]')[0]!.hasClass('lines-off')).toBe(true);
  });

  it('keeps selected edge labels off the canvas and sends hover details to the reserved strip', () => {
    graph.destroy();
    const onConnectionHover = vi.fn();
    graph = new DesignerGraph(document.createElement('div'), { onSelect, onConnectionHover });
    graph.select({ kind: 'house', id: 'selected' });
    const edge = graph.cy.edges('[designerId = "one"]')[0]!;
    expect(edge.style('label')).toBe('');
    edge.emit('mouseover');
    expect(onConnectionHover).toHaveBeenLastCalledWith(edge.data('label'));
    edge.emit('mouseout');
    expect(onConnectionHover).toHaveBeenLastCalledWith(null);
  });

  it('repeats pulses every three seconds until selection clears, respecting reduced motion', () => {
    vi.useFakeTimers();
    graph.destroy();
    const host = document.createElement('div');
    graph = new DesignerGraph(host, { onSelect });
    graph.select({ kind: 'house', id: 'selected' });
    const edge = graph.cy.edges('[designerId = "one"]')[0]!;
    vi.spyOn(edge, 'visible').mockReturnValue(true);
    vi.spyOn(edge, 'sourceEndpoint').mockReturnValue({ x: 0, y: 0 });
    vi.spyOn(edge, 'targetEndpoint').mockReturnValue({ x: 100, y: 0 });
    vi.spyOn(edge, 'controlPoints').mockReturnValue([{ x: 50, y: 20 }]);
    edge.emit('mouseover');
    expect(host.querySelector('animateMotion')?.getAttribute('path')).toBe('M 0 0 Q 50 20 100 0');
    expect(host.querySelector('animateMotion')?.getAttribute('dur')).toBe('3s');
    expect(host.querySelector('animateMotion')?.getAttribute('repeatCount')).toBe('indefinite');
    vi.advanceTimersByTime(3100);
    expect(host.querySelectorAll('circle')).toHaveLength(1);
    edge.emit('mouseout');
    expect(host.querySelectorAll('circle')).toHaveLength(1);
    graph.select(null);
    expect(host.querySelector('circle')).toBeNull();
    vi.stubGlobal('matchMedia', () => ({ matches: true }));
    edge.emit('mouseover');
    expect(host.querySelector('circle')).toBeNull();
    graph.destroy();
    vi.useRealTimers();
  });
});


it('shows connections for a selected brand or designer, even with every city expanded', () => {
  vi.stubGlobal('matchMedia', () => ({ matches: true }));
  collaborations.push({ id: 'pair', houses: ['selected', 'manual'], year: 2015 });
  const lines = () => graph.cy.edges('[kind = "move"], [kind = "collaboration"]');
  const allHidden = () => lines().map((edge) => edge.hasClass('lines-off')).every(Boolean);
  graph.setAllExpanded(true);
  expect(lines().length).toBeGreaterThan(0);
  expect(allHidden()).toBe(true);
  graph.select({ kind: 'house', id: 'selected' });
  expect(allHidden()).toBe(false);
  expect(lines().filter((edge) => !edge.hasClass('lines-off')).every((edge) =>
    edge.data('fromHouse') === 'selected' || edge.data('toHouse') === 'selected')).toBe(true);
  graph.select(null);
  expect(allHidden()).toBe(true);
  graph.select({ kind: 'designer', id: 'one' });
  const visible = lines().filter((edge) => !edge.hasClass('lines-off'));
  expect(visible.length).toBe(1);
  expect(visible[0]!.data('designerId')).toBe('one');
  expect(visible[0]!.style('display')).toBe('element');
  graph.select({ kind: 'group', id: 'whpGlobal' as GroupId });
  expect(allHidden()).toBe(true);
});

it('keeps designer move lines in sync with the line switch, connection filter, year and house filters', () => {
  vi.stubGlobal('matchMedia', () => ({ matches: true }));
  const visibleMoves = () => graph.cy.edges('[kind = "move"]').filter((edge) => edge.style('display') === 'element');
  graph.setYear(2020);
  graph.select({ kind: 'designer', id: 'one' });
  expect(visibleMoves().map((edge) => edge.data('designerId'))).toEqual(['one']);
  graph.setShowMoves(false);
  expect(visibleMoves().length).toBe(0);
  graph.setShowMoves(true);
  expect(visibleMoves().length).toBe(1);
  graph.setConnectionFilter('collaborations');
  expect(visibleMoves().length).toBe(0);
  graph.setConnectionFilter('designers');
  expect(visibleMoves().length).toBe(1);
  graph.setConnectionFilter('all');
  expect(visibleMoves().length).toBe(1);
  graph.setYear(1999);
  expect(visibleMoves().length).toBe(0);
  graph.setYear(2020);
  expect(visibleMoves().length).toBe(1);
  graph.setHouseFilter(new Set(['selected']));
  expect(visibleMoves().length).toBe(0);
  graph.setHouseFilter(undefined);
  expect(visibleMoves().length).toBe(1);
  graph.select({ kind: 'designer', id: 'two' });
  expect(visibleMoves().map((edge) => edge.data('designerId'))).toEqual(['two']);
  graph.select(null);
  expect(visibleMoves().length).toBe(0);
});
