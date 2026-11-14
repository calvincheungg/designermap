import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { allMoves, designers, getDesigner, getGroup, getHouse, groups, houses, isBusinessLeadership, yearRange } from './data';
import { matchesHouseFilters, type HouseFilters } from './data/tags';
import type { DesignerGraph } from './graph/graph';
import { Filters, setFilterValue, type FilterGroup } from './ui/filters';
import { SearchBox, type ListItem } from './ui/listbox';
import { MapView } from './ui/map-view';
import { PanelContent, panelTitle, type Selection } from './ui/panel';

const [minYear, maxYear] = yearRange();
const moveCount = allMoves().length;
const LINES_KEY = 'designer-map:show-lines';
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
  useLayoutEffect(() => { graph.current?.setHouseFilter(matchingIds); }, [matchingIds]);
  useLayoutEffect(() => { graph.current?.setYear(visibleYear); }, [visibleYear]);
  useLayoutEffect(() => {
    graph.current?.select(selection, request.reveal);
  }, [selection, request]);
  useLayoutEffect(() => { if (panel.current) panel.current.scrollTop = 0; }, [request, visibleHouses]);
  useEffect(() => { if (!keepSelection) select(null); }, [keepSelection, select]);
  useEffect(() => {
    graph.current?.setShowMoves(showLines);
    try { localStorage.setItem(LINES_KEY, showLines ? 'on' : 'off'); } catch { /* storage unavailable */ }
  }, [showLines]);
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
      <div className="field-row"><input type="checkbox" id="show-lines" checked={showLines} onChange={(event) => setShowLines(event.target.checked)} /><label htmlFor="show-lines">Show move lines</label></div>
      <div className="field-row">
        <button id="expand-all" aria-pressed={allExpanded} onClick={() => graph.current?.setAllExpanded(!graph.current.allExpanded)}>{allExpanded ? 'Collapse all' : 'Expand all'}</button>
        <button id="fit" onClick={() => graph.current?.fit()}>Fit</button>
        <button id="home" onClick={() => { select(null); graph.current?.fit(); }}>Directory</button>
      </div>
    </div>
      <Filters value={filters} onChange={changeFilters} count={visibleHouses.length} total={houses.length} />
      <div className="content">
        <MapView graphRef={graph} onSelect={select} onExpandChange={onExpandChange} />
        <div className="window side-window"><div className="title-bar"><div className="title-bar-text" id="panel-title">{panelTitle(selection)}</div></div>
          <div className="window-body" id="panel" ref={panel}><PanelContent key={panelKey} selection={selection} visibleHouses={visibleHouses} onSelect={select} onTag={addTag} /></div>
        </div>
      </div>
    </div>
    <div className="status-bar"><p className="status-bar-field" id="status-counts">{houses.length} houses · {designers.length} designers · {moveCount} moves</p>
      <p className="status-bar-field" id="status-selection">{name ? `Selected: ${name}` : 'Nothing selected'}</p>
      <p className="status-bar-field" id="status-year">{year >= maxYear ? 'Showing all years' : `Up to ${year}`}</p>
    </div>
  </div><div className="taskbar"><button className="start-button"><span className="start-logo" aria-hidden="true" /><b>Start</b></button>
    <button className="task active">Designer Map</button><div className="tray"><Clock /></div>
  </div></div>;
}
