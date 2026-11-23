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
    { id: 'selected', name: 'Selected', city: 'London', country: 'GB', founded: 1900 },
    { id: 'connected', name: 'Connected', city: 'Paris', country: 'FR', founded: 1900 },
    { id: 'unrelated', name: 'Unrelated', city: 'Paris', country: 'FR', founded: 1900 },
    { id: 'secondHop', name: 'Second Hop', city: 'Milan', country: 'IT', founded: 1900 },
    { id: 'manual', name: 'Manual', city: 'Tokyo', country: 'JP', founded: 1900 },
    { id: 'standalone', name: 'Standalone', city: 'Berlin', country: 'DE', founded: 1900 },
    { id: 'future', name: 'Future', city: 'Madrid', country: 'ES', founded: 2025 },
    { id: 'regionalOne', name: 'Regional One', city: 'Gardena', country: 'US', founded: 1900 },
    { id: 'regionalTwo', name: 'Regional Two', city: 'Irvine', country: 'US', founded: 2000 },
    { id: 'regionalFuture', name: 'Regional Future', city: 'Seal Beach', country: 'US', founded: 2035 },
    { id: 'regionalCoast', name: 'Regional Coast', city: 'Santa Cruz', country: 'US', founded: 1900 },
    { id: 'family', name: 'Family', city: 'Berlin', country: 'DE', founded: 1900 },
    { id: 'label', name: 'Sub Label', city: 'Rome', country: 'IT', founded: 2000, parentHouse: 'family' },
    { id: 'nestedLabel', name: 'Nested Label', city: 'Amsterdam', country: 'NL', founded: 2010, parentHouse: 'label' },
    { id: 'futureLabel', name: 'Future Label', city: 'Rome', country: 'IT', founded: 2035, parentHouse: 'family' },
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

import { DesignerGraph, minesweeperColour, PULSE_SPEED, pulseDuration, type GraphCallbacks } from './graph';
import { RING_RADIUS } from './geo';
import { moveEdges, nodeId } from './elements';
import { GroupId } from '../data/groups';
import { collaborations } from '../data';

let graph: DesignerGraph;
let onSelect: ReturnType<typeof vi.fn<GraphCallbacks['onSelect']>>;
const houseNode = (id: string) => graph.cy.getElementById(nodeId.house(id));
const openHouses = () => graph.cy.nodes('[kind = "house"]').not('.hidden, .collapsed').map((n) => n.data('refId')).sort();
/** Every career route for the map's current state; the graph only draws the selected ones. */
const routes = (designerId: string) => {
  const expanded = new Set(graph.cy.nodes('[kind = "marker"][?expanded]').map((n) => n.data('city') as string));
  const visible = new Set(graph.cy.nodes('[kind = "house"]').not('.collapsed').map((n) => n.data('refId') as string));
  return moveEdges(expanded, visible).map((edge) => edge.data).filter((data) => data.designerId === designerId);
};

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

describe('night mode', () => {
  it('marks the map pane itself, which the night map CSS targets, and restyles labels', () => {
    graph.destroy();
    const pane = document.createElement('div');
    graph = new DesignerGraph(pane, { onSelect });
    const house = graph.cy.nodes('[kind = "house"]').first();
    expect(house.style('color')).toBe('rgb(0,0,0)');
    graph.setNight(true);
    expect(pane.classList.contains('night')).toBe(true);
    expect(house.style('color')).toBe('rgb(255,255,255)');
    graph.setNight(false);
    expect(pane.classList.contains('night')).toBe(false);
    expect(house.style('color')).toBe('rgb(0,0,0)');
  });
});

describe('regional cluster interaction', () => {
  const clusters = () => graph.cy.nodes('[kind = "marker"][?isCluster]');
  const settleZoom = (zoom: number) => {
    graph.cy.zoom(zoom);
    vi.advanceTimersByTime(100);
  };

  it('consolidates small cities by country, keeps lone cities, and restores individual cities on zoom in', () => {
    vi.useFakeTimers();
    settleZoom(0.3);
    expect(clusters().length).toBe(1);
    expect(clusters()[0]!.data('shown')).toBe(4);
    expect(clusters()[0]!.data('members').sort()).toEqual(['Gardena', 'Irvine', 'Santa Cruz', 'Seal Beach']);
    for (const city of ['London', 'Paris', 'Milan', 'Tokyo', 'Berlin', 'Madrid']) {
      expect(graph.cy.getElementById(nodeId.city(city)).hasClass('clustered')).toBe(false);
    }
    const clusterId = clusters()[0]!.id();
    settleZoom(8);
    expect(clusters().length).toBe(0);
    expect(graph.cy.nodes('.clustered').length).toBe(0);
    settleZoom(0.3);
    expect(clusters()[0]!.id()).toBe(clusterId);
  });

  it('restores individual pins when years or filters leave fewer than two eligible cities', () => {
    vi.useFakeTimers();
    settleZoom(0.3);
    expect(clusters()[0]!.data('label')).toBe('California');
    expect(clusters()[0]!.data('shown')).toBe(4);
    graph.setYear(2020);
    expect(clusters()[0]!.data('shown')).toBe(3);
    graph.setYear(2040);
    expect(clusters()[0]!.data('shown')).toBe(4);
    graph.setHouseFilter(new Set(['regionalOne', 'regionalTwo']));
    expect(clusters()[0]!.data('shown')).toBe(2);
    graph.setHouseFilter(new Set(['regionalTwo']));
    expect(clusters().length).toBe(0);
    expect(graph.cy.getElementById(nodeId.city('Irvine')).visible()).toBe(true);
    graph.setHouseFilter(new Set());
    expect(graph.cy.nodes('[kind = "marker"]').filter(node => node.visible()).length).toBe(0);
  });

  it('shows every city of a clicked cluster at once, and reclusters on zooming back out', () => {
    vi.useFakeTimers();
    settleZoom(0.3);
    // Big enough to frame California, but not at the zoom where all pins separate.
    vi.spyOn(graph.cy, 'width').mockReturnValue(160);
    vi.spyOn(graph.cy, 'height').mockReturnValue(160);
    vi.stubGlobal('matchMedia', () => ({ matches: true }));
    clusters()[0]!.emit('tap');
    vi.advanceTimersByTime(100);
    expect(graph.cy.zoom()).toBeGreaterThan(0.3);
    expect(graph.cy.zoom()).toBeLessThan(4.8);
    expect(clusters().length).toBe(0);
    for (const city of ['Gardena', 'Irvine', 'Seal Beach', 'Santa Cruz']) {
      expect(graph.cy.getElementById(nodeId.city(city)).hasClass('clustered')).toBe(false);
    }
    expect(openHouses()).toEqual([]);
    graph.setYear(2020);
    graph.setYear(2040);
    expect(clusters().length).toBe(0);
    settleZoom(0.3);
    expect(clusters()[0]!.data('shown')).toBe(4);
  });

  it('keeps an opened city out of its cluster and restores clustering when it closes', () => {
    vi.useFakeTimers();
    settleZoom(0.3);
    graph.toggleCity('Gardena');
    expect(openHouses()).toEqual(['regionalOne']);
    expect(graph.cy.getElementById(nodeId.city('Gardena')).visible()).toBe(true);
    expect(clusters().every(cluster => !cluster.data('members').includes('Gardena'))).toBe(true);
    graph.toggleCity('Gardena');
    expect(clusters().some(cluster => cluster.data('members').includes('Gardena'))).toBe(true);
    graph.select({ kind: 'house', id: 'regionalOne' });
    expect(clusters().length).toBe(0);
    expect(graph.cy.getElementById(nodeId.city('Gardena')).visible()).toBe(true);
    expect(openHouses()).toEqual(['regionalOne', 'regionalTwo']);
    graph.select(null);
    expect(clusters().length).toBeGreaterThan(0);
  });
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
    graph.cy.zoom(0.3);
    graph.setYear(2020);
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
    ['regionalOne', 'Gardena'],
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
    expect(routes('labelDesigner')[0]!.source).toBe(nodeId.house('family'));
    graph.select({ kind: 'house', id: 'family' });
    expect(routes('labelDesigner')[0]!.source).toBe(nodeId.house('label'));
    graph.select(null);
    expect(routes('labelDesigner')[0]!.source).toBe(nodeId.house('family'));
  });

  it('reveals nested-label context, and connected labels without their uninvolved parents', () => {
    graph.setHouseFilter(new Set(['nestedLabel']));
    graph.select({ kind: 'house', id: 'family' });
    expect(openHouses()).toEqual(['family', 'label']);
    graph.select({ kind: 'house', id: 'label' });
    expect(openHouses()).toEqual(['family', 'label', 'nestedLabel']);
    graph.setHouseFilter(new Set(['label', 'manual']));
    graph.select({ kind: 'house', id: 'manual' });
    expect(openHouses()).toEqual(['label', 'manual']);
    expect(routes('labelDesigner')[0]!.source).toBe(nodeId.house('label'));
  });

  it('opens an individual city without expanding neighbouring cities', () => {
    const pin = graph.cy.getElementById(nodeId.city('Irvine'));
    expect(pin.data('count')).toBe(1);
    expect(houseNode('regionalOne').data('city')).toBe('Gardena');
    expect(houseNode('regionalTwo').parent()[0]!.id()).toBe(nodeId.grid('Irvine'));
    graph.setYear(2020);
    expect(pin.data('shown')).toBe(1);
    pin.emit('tap');
    expect(openHouses()).toEqual(['regionalTwo']);
    expect(graph.cy.getElementById('gl:Irvine').hasClass('collapsed')).toBe(false);
    graph.setYear(2040);
    expect(pin.data('shown')).toBe(1);
    expect(openHouses()).toEqual(['regionalTwo']);
    graph.setHouseFilter(new Set(['regionalTwo']));
    expect(pin.data('shown')).toBe(1);
    expect(openHouses()).toEqual(['regionalTwo']);
    graph.setHouseFilter(new Set());
    expect(pin.hasClass('hidden')).toBe(true);
    expect(graph.cy.getElementById('gl:Irvine').hasClass('hidden')).toBe(true);
  });

  it('routes moves through city pins and reveals direct connected brands on selection', () => {
    expect(graph.cy.edges('[kind = "move"]').length).toBe(0);
    const unselected = routes('regional');
    expect(unselected.length).toBe(2);
    expect(unselected[0]!.source).toBe(nodeId.city('Gardena'));
    expect(unselected[0]!.target).toBe(nodeId.city('Irvine'));
    graph.select({ kind: 'house', id: 'regionalOne' });
    expect(openHouses()).toEqual(['regionalOne', 'regionalTwo']);
    // Only the selected brand's direct lines are built.
    const moves = graph.cy.edges('[designerId = "regional"]');
    expect(moves.length).toBe(1);
    const internal = moves.filter((e) => e.data('fromHouse') === 'regionalOne');
    expect(internal.source().id()).toBe(nodeId.house('regionalOne'));
    expect(internal.target().id()).toBe(nodeId.house('regionalTwo'));
    expect(internal.hasClass('highlight')).toBe(true);
    graph.select(null);
    expect(openHouses()).toEqual([]);
    graph.toggleCity('Gardena');
    graph.select({ kind: 'house', id: 'standalone' });
    graph.select(null);
    expect(openHouses()).toEqual(['regionalOne']);
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
    expect(graph.cy.edges('[kind = "move"][designerId = "two"]').length).toBe(0);
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
    expect(graph.cy.edges('[designerId = "two"]').length).toBe(0);
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
    // Constant on-screen speed: duration follows the line's length (~110 model units here).
    const seconds = parseFloat(host.querySelector('animateMotion')!.getAttribute('dur')!);
    expect(seconds).toBeCloseTo(Math.max(1.2, 110.4 * graph.cy.zoom() / PULSE_SPEED), 1);
    expect(host.querySelector('animateMotion')?.getAttribute('repeatCount')).toBe('indefinite');
    // The line is redrawn beneath the blocks; the canvas copy turns transparent.
    expect(host.querySelector('.pulse-traces path')?.getAttribute('d')).toBe('M 0 0 Q 50 20 100 0');
    expect(host.querySelector('.pulse-traces .pulse-arrow')).toBeTruthy();
    expect(host.querySelector('.pulse-traces')!.compareDocumentPosition(host.querySelector('.pulse')!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(edge.hasClass('traced')).toBe(true);
    expect(edge.style('line-opacity')).toBe('0');
    // A Win98 bevelled block rather than a circle.
    expect(host.querySelector('circle')).toBeNull();
    expect(host.querySelectorAll('.pulse rect')).toHaveLength(4);
    vi.advanceTimersByTime(3100);
    const pulse = host.querySelector('.pulse');
    expect(host.querySelectorAll('.pulse')).toHaveLength(1);
    // Hovering a line that is already pulsing must not restart its animation.
    edge.emit('mouseout');
    edge.emit('mouseover');
    expect(host.querySelector('.pulse')).toBe(pulse);
    edge.emit('mouseout');
    expect(host.querySelector('.pulse')).toBe(pulse);
    graph.select(null);
    expect(host.querySelector('.pulse')).toBeNull();
    expect(host.querySelector('.pulse-trace')).toBeNull();
    vi.stubGlobal('matchMedia', () => ({ matches: true }));
    edge.emit('mouseover');
    expect(host.querySelector('.pulse')).toBeNull();
    graph.destroy();
    vi.useRealTimers();
  });

  it('hands city pin clicks to onOpenCity instead of expanding the city on the map', () => {
    const onOpenCity = vi.fn();
    graph.destroy();
    graph = new DesignerGraph(document.createElement('div'), { onSelect, onOpenCity });
    const marker = graph.cy.nodes('[kind = "marker"][!isCluster]').filter((node) => node.data('city') === 'Paris')[0]!;
    marker.emit('tap');
    expect(onOpenCity).toHaveBeenCalledWith('Paris', undefined);
    expect(graph.allExpanded).toBe(false);
    expect(houseNode('connected').hasClass('collapsed')).toBe(true);
  });

  it('draws pulses beneath the brand icons', () => {
    const host = document.createElement('div');
    graph.destroy();
    graph = new DesignerGraph(host, { onSelect });
    const layers = [...host.querySelectorAll('.map-layer, .pulse-layer, .cy-layer')].map((el) => el.classList[0]);
    expect(layers).toEqual(['map-layer', 'pulse-layer', 'cy-layer']);
  });

  it('colours collaboration counts like Minesweeper, with more than seven in bright orange', () => {
    expect(minesweeperColour(1)).toBe('#0000ff');
    expect(minesweeperColour(7)).toBe('#000000');
    expect(minesweeperColour(8)).toBe('#ff8c00');
    expect(minesweeperColour(25)).toBe('#ff8c00');
  });

  it('times pulses by on-screen length so every line moves at the same speed', () => {
    expect(pulseDuration(PULSE_SPEED)).toBe(1.2);
    expect(pulseDuration(PULSE_SPEED * 10)).toBe(10);
    expect(pulseDuration(PULSE_SPEED * 20)).toBe(2 * pulseDuration(PULSE_SPEED * 10));
  });

  it('rings a selected brand\'s same-city partners around it, restoring the grid afterwards', () => {
    vi.stubGlobal('matchMedia', () => ({ matches: true }));
    collaborations.push(
      { id: 'local', houses: ['connected', 'unrelated'], year: 2015 },
      { id: 'abroad', houses: ['connected', 'selected'], year: 2016 },
    );
    graph.destroy();
    graph = new DesignerGraph(document.createElement('div'), { onSelect });
    graph.select({ kind: 'house', id: 'connected' });
    const centre = houseNode('connected').position();
    const partner = houseNode('unrelated').position();
    expect(Math.hypot(partner.x - centre.x, partner.y - centre.y)).toBeCloseTo(RING_RADIUS, 5);
    // The London partner stays in its own city.
    expect(houseNode('selected').data('mapLocation')).toBe('London');
    graph.select(null);
    graph.setAllExpanded(true);
    const gridCentre = houseNode('connected').position();
    const gridPartner = houseNode('unrelated').position();
    expect(Math.hypot(gridPartner.x - gridCentre.x, gridPartner.y - gridCentre.y)).toBeLessThan(RING_RADIUS);
  });

  it('carries the release count on collaboration pulses as a Minesweeper cell', () => {
    collaborations.push(
      { id: 'first', houses: ['selected', 'manual'], year: 2015 },
      { id: 'second', houses: ['selected', 'manual'], year: 2018 },
    );
    graph.destroy();
    const host = document.createElement('div');
    graph = new DesignerGraph(host, { onSelect });
    graph.select({ kind: 'house', id: 'selected' });
    const edge = graph.cy.edges('[kind = "collaboration"]')[0]!;
    expect(edge.data('count')).toBe(2);
    vi.spyOn(edge, 'visible').mockReturnValue(true);
    vi.spyOn(edge, 'sourceEndpoint').mockReturnValue({ x: 0, y: 0 });
    vi.spyOn(edge, 'targetEndpoint').mockReturnValue({ x: 100, y: 0 });
    vi.spyOn(edge, 'controlPoints').mockReturnValue([]);
    edge.emit('mouseover');
    const label = host.querySelector('.pulse-tile text');
    expect(label?.textContent).toBe('2');
    expect(label?.getAttribute('fill')).toBe('#008000');
    graph.setYear(2016);
    expect(graph.cy.edges('[kind = "collaboration"]')[0]!.data('count')).toBe(1);
  });
});


it('shows connections for a selected brand or designer, even with every city expanded', () => {
  vi.stubGlobal('matchMedia', () => ({ matches: true }));
  collaborations.push({ id: 'pair', houses: ['selected', 'manual'], year: 2015 });
  const lines = () => graph.cy.edges('[kind = "move"], [kind = "collaboration"]');
  const allHidden = () => lines().map((edge) => edge.hasClass('lines-off')).every(Boolean);
  graph.setAllExpanded(true);
  expect(lines().length).toBe(0);
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
