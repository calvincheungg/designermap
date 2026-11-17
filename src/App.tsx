import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { allMoves, designers, getDesigner, getGroup, getHouse, groups, houses, isBusinessLeadership, yearRange } from './data';
import { matchesHouseFilters, type HouseFilters } from './data/tags';
import type { DesignerGraph } from './graph/graph';
import { setLocationMode, type LocationMode } from './graph/locations';
import { Filters, setFilterValue, type FilterGroup } from './ui/filters';
import { SearchBox, type ListItem } from './ui/listbox';
import { MapView } from './ui/map-view';
import { StartIcon } from './ui/start-icons';
import { StartMenu } from './ui/start-menu';
import { PanelContent, panelTitle, type Selection } from './ui/panel';

const [minYear, maxYear] = yearRange();
const moveCount = allMoves().length;
const LINES_KEY = 'designer-map:show-lines';
const COLLABORATIONS_KEY = 'designer-map:show-collaborations';
const LOCATION_KEY = 'designer-map:location-mode';
const movedCount = houses.filter((h) => h.origin).length;
const collator = new Intl.Collator('en', { sensitivity: 'base', numeric: true });
const searchItems: ListItem<NonNullable<Selection>>[] = [
  ...houses.map((h) => ({ label: h.name, aliases: h.aliases, hint: 'house', value: { kind: 'house' as const, id: h.id } })),
  ...groups.map((g) => ({ label: g.name, hint: 'group', value: { kind: 'group' as const, id: g.id } })),
  ...designers.map((d) => ({ label: d.name, hint: d.career.some(isBusinessLeadership) ? 'leader' : 'designer', value: { kind: 'designer' as const, id: d.id } })),
].sort((a, b) => collator.compare(a.label, b.label) || a.hint.localeCompare(b.hint));

function Clock() {
  const format = () => new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  const [time, setTime] = useState(format);
  useEffect(() => { const timer = window.setInterval(() => setTime(format()), 10_000); return () => clearInterval(timer); }, []);
  return <span id="clock">{time}</span>;
}

export function App() {
  const graph = useRef<DesignerGraph | null>(null);
  const panel = useRef<HTMLDivElement>(null);
  const [request, setRequest] = useState<{ value: Selection; reveal: boolean; revision: number }>({ value: null, reveal: false, revision: 0 });
  const [filters, setFilters] = useState<HouseFilters>({});
  const [year, setYear] = useState(maxYear);
  const [playFrom, setPlayFrom] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [allExpanded, setAllExpanded] = useState(false);
  const [showLines, setShowLines] = useState(() => {
    try { return localStorage.getItem(LINES_KEY) !== 'off'; } catch { return true; }
  });
  const [showCollaborations, setShowCollaborations] = useState(() => {
    try { return localStorage.getItem(COLLABORATIONS_KEY) !== 'off'; } catch { return true; }
  });
  const [locationMode, setMode] = useState<LocationMode>(() => {
    let mode: LocationMode = 'current';
    try { if (localStorage.getItem(LOCATION_KEY) === 'origin') mode = 'origin'; } catch { /* storage unavailable */ }
    setLocationMode(mode);
    return mode;
  });
  const changeLocationMode = useCallback((mode: LocationMode) => {
    // The graph is rebuilt for the new layout (MapView is keyed by mode), so set this first.
    setLocationMode(mode);
    setMode(mode);
    try { localStorage.setItem(LOCATION_KEY, mode); } catch { /* storage unavailable */ }
  }, []);
  const visibleYear = year >= maxYear ? Infinity : year;
  const matchingHouses = useMemo(() => houses.filter((h) => matchesHouseFilters(h.tags, filters)), [filters]);
  const matchingIds = useMemo(() => Object.values(filters).some((values) => values?.length)
    ? new Set(matchingHouses.map((h) => h.id)) : undefined, [filters, matchingHouses]);
  const visibleHouses = useMemo(() => matchingHouses.filter((h) => (h.founded ?? -Infinity) <= visibleYear), [matchingHouses, visibleYear]);
  const visibleIds = useMemo(() => new Set(visibleHouses.map((h) => h.id)), [visibleHouses]);
  const requested = request.value;
  const keepSelection = !requested || requested.kind === 'group' || (requested.kind === 'house'
    ? visibleIds.has(requested.id) : getDesigner(requested.id)?.career.some((t) => visibleIds.has(t.house)));
  const selection = keepSelection ? requested : null;

  const select = useCallback((value: Selection, reveal = false) => {
    setRequest((current) => ({ value, reveal, revision: current.revision + 1 }));
  }, []);
  const onExpandChange = useCallback((open: number, total: number) => setAllExpanded(open === total), []);
  const changeFilters = useCallback((next: HouseFilters) => { setFilters(next); setSearch(''); }, []);
  const addTag = useCallback((group: FilterGroup, value: string) => {
    setFilters((current) => setFilterValue(current, group, value, true)); setSearch('');
  }, []);

  // Synchronize the existing graph API; none of its rendering/layout is moved into React.
  // locationMode rebuilds the graph, so each sync also reruns for the new instance.
  useLayoutEffect(() => { graph.current?.setHouseFilter(matchingIds); }, [matchingIds, locationMode]);
  useLayoutEffect(() => { graph.current?.setYear(visibleYear); }, [visibleYear, locationMode]);
  useLayoutEffect(() => {
    graph.current?.select(selection, request.reveal);
  }, [selection, request, locationMode]);
  useLayoutEffect(() => { if (panel.current) panel.current.scrollTop = 0; }, [request, visibleHouses]);
  useEffect(() => { if (!keepSelection) select(null); }, [keepSelection, select]);
  useEffect(() => {
    graph.current?.setShowMoves(showLines);
    try { localStorage.setItem(LINES_KEY, showLines ? 'on' : 'off'); } catch { /* storage unavailable */ }
  }, [showLines, locationMode]);
  useEffect(() => {
    graph.current?.setShowCollaborations(showCollaborations);
    try { localStorage.setItem(COLLABORATIONS_KEY, showCollaborations ? 'on' : 'off'); } catch { /* storage unavailable */ }
  }, [showCollaborations, locationMode]);
  useEffect(() => {
    if (playFrom === null) return;
    let next = playFrom;
    const timer = window.setInterval(() => {
      setYear(next);
      if (++next > maxYear) setPlayFrom(null);
    }, 150);
    return () => clearInterval(timer);
  }, [playFrom]);

  const availableSearchItems = useMemo(() => searchItems.filter((item) => item.value.kind === 'group' || (item.value.kind === 'house'
    ? visibleIds.has(item.value.id) : getDesigner(item.value.id)?.career.some((t) => visibleIds.has(t.house)
      && (visibleYear === Infinity || (t.start !== undefined && t.start <= visibleYear))))), [visibleIds, visibleYear]);
  const name = selection?.kind === 'group' ? getGroup(selection.id)?.name
    : selection?.kind === 'house' ? getHouse(selection.id)?.name : selection ? getDesigner(selection.id)?.name : undefined;
  const panelKey = `${request.revision}:${visibleYear}:${JSON.stringify(filters)}`;

  return <div className="desktop"><div className="window main-window">
    <div className="title-bar"><div className="title-bar-text">Designer Map: Fashion Houses &amp; Creative Directors</div>
      <div className="title-bar-controls" aria-hidden="true"><button aria-label="Minimize" tabIndex={-1} /><button aria-label="Maximize" tabIndex={-1} /><button aria-label="Close" tabIndex={-1} /></div>
    </div>
    <div className="window-body"><div className="toolbar">
      <SearchBox items={availableSearchItems} value={search} onChange={setSearch} onPick={(item) => select(item.value, true)} />
      <div className="field-row year-row"><label htmlFor="year">Year:</label>
        <input id="year" type="range" min={minYear} max={maxYear} step={1} value={year} onChange={(event) => setYear(Number(event.target.value))} />
        <output id="year-label" htmlFor="year">{year >= maxYear ? 'All' : year}</output>
        <button id="play" onClick={() => setPlayFrom((current) => current === null ? year >= maxYear ? minYear : year : null)}>{playFrom === null ? '▶ Play' : '■ Stop'}</button>
      </div>
    </div>
      <Filters value={filters} onChange={changeFilters} count={visibleHouses.length} total={houses.length} />
      <div className="content">
        <MapView key={locationMode} graphRef={graph} onSelect={select} onExpandChange={onExpandChange} />
        <div className="window side-window"><div className="title-bar"><div className="title-bar-text" id="panel-title">{panelTitle(selection)}</div></div>
          <div className="window-body" id="panel" ref={panel}><PanelContent key={panelKey} selection={selection} visibleHouses={visibleHouses} year={visibleYear} onSelect={select} onTag={addTag} /></div>
        </div>
      </div>
    </div>
    <div className="status-bar"><p className="status-bar-field" id="status-counts">{houses.length} houses · {designers.length} designers · {moveCount} moves</p>
      <p className="status-bar-field" id="status-selection">{name ? `Selected: ${name}` : 'Nothing selected'}</p>
      <p className="status-bar-field" id="status-year">{year >= maxYear ? 'Showing all years' : `Up to ${year}`}</p>
    </div>
  </div><div className="taskbar"><StartMenu>{(close) => <>
      <div className="start-item start-parent" tabIndex={0} aria-haspopup="true">
        <StartIcon name="globe" /><span className="start-label">Show brands at</span><span className="start-arrow" aria-hidden="true" />
        <fieldset className="window start-submenu" title={`${movedCount} brands have a different origin city`}>
          <legend className="visually-hidden">Show brands at</legend>
          {([['current', 'Current base'], ['origin', 'Origin']] as const).map(([mode, label]) => <div className="field-row start-subitem" key={mode}>
            <input type="radio" id={`location-${mode}`} name="location-mode" checked={locationMode === mode} onChange={() => changeLocationMode(mode)} />
            <label htmlFor={`location-${mode}`}>{label}</label>
          </div>)}
        </fieldset>
      </div>
      <div className="start-item start-parent" tabIndex={0} aria-haspopup="true">
        <StartIcon name="lines" /><span className="start-label">Connection lines</span><span className="start-arrow" aria-hidden="true" />
        <fieldset className="window start-submenu">
          <legend className="visually-hidden">Connection lines</legend>
          <div className="field-row start-subitem"><input type="checkbox" id="show-lines" checked={showLines} onChange={(event) => setShowLines(event.target.checked)} /><label htmlFor="show-lines">Show move lines</label></div>
          <div className="field-row start-subitem"><input type="checkbox" id="show-collaborations" checked={showCollaborations} onChange={(event) => setShowCollaborations(event.target.checked)} /><label htmlFor="show-collaborations">Show collaboration lines</label></div>
        </fieldset>
      </div>
      <hr className="start-separator" />
      <button className="start-item start-command" id="expand-all" aria-pressed={allExpanded} onClick={() => { close(); graph.current?.setAllExpanded(!graph.current.allExpanded); }}><StartIcon name={allExpanded ? 'collapse' : 'expand'} /><span className="start-label">{allExpanded ? 'Collapse all' : 'Expand all'}</span></button>
      <button className="start-item start-command" id="fit" onClick={() => { close(); graph.current?.fit(); }}><StartIcon name="fit" /><span className="start-label">Fit map</span></button>
      <hr className="start-separator" />
      <button className="start-item start-command" id="home" onClick={() => { close(); select(null); graph.current?.fit(); }}><StartIcon name="folder" /><span className="start-label">Directory</span></button>
    </>}</StartMenu>
    <button className="task active">Designer Map</button><div className="tray"><Clock /></div>
  </div></div>;
}
