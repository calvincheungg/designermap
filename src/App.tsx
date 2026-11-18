import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { allMoves, designers, getDesigner, getGroup, getHouse, groups, houses, isBusinessLeadership, yearRange } from './data';
import { matchesHouseFilters, type HouseFilters } from './data/tags';
import type { ConnectionFilter, DesignerGraph } from './graph/graph';
import { setLocationMode, type LocationMode } from './graph/locations';
import { ActiveFilters, FilterMenu, setFilterValue, type FilterGroup } from './ui/filters';
import { SearchBox, type ListItem } from './ui/listbox';
import { MapView } from './ui/map-view';
import { StartIcon } from './ui/start-icons';
import { StartMenu } from './ui/start-menu';
import { PanelContent, panelTitle, type Place, type Selection } from './ui/panel';
import { DIRECTORY_RECT_KEY, PropertiesWindow } from './ui/side-panel';
import { DIRECTORY, closeWindow, focusWindow, initialDesk, isPlace, isTool, isSelectionItem, STATISTICS, tool, minimizeWindow, openItem, retainItems, saveDirectoryMinimized, sameItem, toggleTask, windowFor, windowType, closeWindows, minimizeWindows, restoreWindows, type Desk, type Item } from './ui/desktop';
import { TaskGroup, type Task } from './ui/taskbar';
import { YearTray } from './ui/year-tray';
import { StatisticsContent } from './ui/statistics';
import { MissingReportContent, RecycleBinContent } from './ui/tool-windows';
import { DesktopIcon } from './ui/desktop-icon';
import { readSharedView, sharedViewHash } from './ui/share-link';

/** Tool windows' opening sizes: Statistics is wider than Properties so its bar tables have room. */
const TOOL_SIZES = { stats: { width: 460, height: 640 }, recycle: { width: 380, height: 480 }, missing: { width: 420, height: 560 } } as const;
/** Start menu's What's Missing report: a research aid, so development builds only. */
const SHOW_MISSING_REPORT = import.meta.env.DEV;
const RECYCLE_BIN_KEY = 'designer-map:recycle-bin-position';
import type { MenuAction } from './ui/context-menu';
import { PlaceWindowContent, cityWindowSize, placeTileCount, placeTitle } from './ui/city-window';

const [minYear, maxYear] = yearRange();
const moveCount = allMoves().length;
const LINES_KEY = 'designer-map:show-lines';
const COLLABORATIONS_KEY = 'designer-map:show-collaborations';
const LOCATION_KEY = 'designer-map:location-mode';
const CITY_VIEW_KEY = 'designer-map:city-view';
type CityView = 'window' | 'map';
const movedCount = houses.filter((h) => h.origin).length;
const collator = new Intl.Collator('en', { sensitivity: 'base', numeric: true });
const searchItems: ListItem<NonNullable<Selection>>[] = [
  ...houses.map((h) => ({ label: h.name, aliases: h.aliases, hint: 'house', value: { kind: 'house' as const, id: h.id } })),
  ...groups.map((g) => ({ label: g.name, hint: 'group', value: { kind: 'group' as const, id: g.id } })),
  ...designers.map((d) => ({ label: d.name, hint: d.career.some(isBusinessLeadership) ? 'leader' : 'designer', value: { kind: 'designer' as const, id: d.id } })),
].sort((a, b) => collator.compare(a.label, b.label) || a.hint.localeCompare(b.hint));

/** Place windows are titled with the city or country, like an Explorer folder; others as Properties. */
const TOOL_TITLES = { stats: 'Statistics', recycle: 'Recycle Bin', missing: "What's Missing" } as const;
const windowTitle = (item: Item) => isPlace(item) ? placeTitle(item) : isTool(item) ? TOOL_TITLES[item.id] : panelTitle(item);

export function App() {
  const graph = useRef<DesignerGraph | null>(null);
  // A shared link (#brand=…&year=…&tier filters) sets the starting view.
  const [sharedView] = useState(() => readSharedView(typeof location === 'undefined' ? '' : location.hash, minYear, maxYear));
  const [request, setRequest] = useState<{ value: Selection; reveal: boolean; revision: number }>({ value: null, reveal: false, revision: 0 });
  const [filters, setFilters] = useState<HouseFilters>(sharedView.filters);
  const [year, setYear] = useState(sharedView.year ?? maxYear);
  const [notice, setNotice] = useState<string | null>(null);
  const [playFrom, setPlayFrom] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [allExpanded, setAllExpanded] = useState(false);
  const [connectionFilter, setConnectionFilter] = useState<ConnectionFilter>('all');
  const [desk, setDesk] = useState<Desk>(initialDesk);
  const deskRef = useRef(desk);
  deskRef.current = desk;
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

  /** Select on the map and show the item in a Properties window (opening, focusing or reusing one). */
  const select = useCallback((value: Selection, reveal = false) => {
    setRequest((current) => ({ value, reveal, revision: current.revision + 1 }));
    setDesk((current) => value ? openItem(current, value) : { ...current, active: current.active === DIRECTORY ? DIRECTORY : null });
  }, []);
  /** Highlight a window's item on the map without moving the view. */
  const showOnMap = useCallback((value: Selection) => {
    setRequest((current) => sameItem(current.value, value) ? current : { value, reveal: false, revision: current.revision + 1 });
  }, []);
  /** Apply a window change, then keep the map's selection in step with the active window. */
  const changeDesk = useCallback((change: (desk: Desk) => Desk, closing?: Item | readonly Item[]) => {
    const next = change(deskRef.current);
    setDesk(next);
    const active = windowFor(next, next.active);
    // City windows aren't map selections, so focusing one leaves the map as it is.
    if (active && isSelectionItem(active.item)) showOnMap(active.item);
    else if (closing) {
      const closed = (Array.isArray(closing) ? closing : [closing]).filter(isSelectionItem);
      setRequest((current) => closed.some((item) => sameItem(current.value, item)) ? { value: null, reveal: false, revision: current.revision + 1 } : current);
    }
  }, [showOnMap]);
  const showMore = useCallback((id: string) => select({ kind: 'house', id }, true), [select]);
  const [cityView, setCityView] = useState<CityView>(() => {
    try { return localStorage.getItem(CITY_VIEW_KEY) === 'map' ? 'map' : 'window'; } catch { return 'window'; }
  });
  // Read through a ref so the graph's pin callback stays stable (changing views never rebuilds the map).
  const cityViewRef = useRef(cityView);
  cityViewRef.current = cityView;
  useEffect(() => { try { localStorage.setItem(CITY_VIEW_KEY, cityView); } catch { /* storage unavailable */ } }, [cityView]);
  const openPlace = useCallback((place: Place) => setDesk((current) => openItem(current, place)), []);
  const openCity = useCallback((city: string) => {
    if (cityViewRef.current === 'map') graph.current?.toggleCity(city);
    else openPlace({ kind: 'city', id: city });
  }, [openPlace]);
  const isVisibleItem = useCallback((item: Item) => item.kind === 'group' || isPlace(item) || isTool(item) || (item.kind === 'house'
    ? visibleIds.has(item.id) : !!getDesigner(item.id)?.career.some((t) => visibleIds.has(t.house))), [visibleIds]);
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
  useEffect(() => { if (desk.windows.some((w) => !isVisibleItem(w.item))) setDesk((current) => retainItems(current, isVisibleItem)); }, [desk.windows, isVisibleItem]);
  useEffect(() => saveDirectoryMinimized(desk), [desk.directoryMinimized]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (!keepSelection) select(null); }, [keepSelection, select]);
  useEffect(() => {
    graph.current?.setShowMoves(showLines);
    try { localStorage.setItem(LINES_KEY, showLines ? 'on' : 'off'); } catch { /* storage unavailable */ }
  }, [showLines, locationMode]);
  useEffect(() => {
    graph.current?.setShowCollaborations(showCollaborations);
    try { localStorage.setItem(COLLABORATIONS_KEY, showCollaborations ? 'on' : 'off'); } catch { /* storage unavailable */ }
  }, [showCollaborations, locationMode]);
  // Open a shared link's selection once the graph exists, and follow later hash edits (pasted links, back/forward).
  useEffect(() => {
    if (sharedView.selection) select(sharedView.selection, true);
    const follow = () => {
      const view = readSharedView(location.hash, minYear, maxYear);
      setFilters(view.filters);
      setYear(view.year ?? maxYear);
      select(view.selection, !!view.selection);
    };
    window.addEventListener('hashchange', follow);
    return () => window.removeEventListener('hashchange', follow);
  }, [sharedView, select]);
  // Keep the address bar's link in step with the view (not during Play, which changes the year every frame).
  const viewHash = sharedViewHash({ selection, year, filters }, maxYear);
  useEffect(() => {
    if (playFrom !== null || viewHash === location.hash || (!viewHash && !location.hash)) return;
    history.replaceState(null, '', `${location.pathname}${location.search}${viewHash}`);
  }, [viewHash, playFrom]);
  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 3000);
    return () => clearTimeout(timer);
  }, [notice]);
  const copyLink = useCallback(async () => {
    const link = `${location.origin}${location.pathname}${location.search}${sharedViewHash({ selection, year, filters }, maxYear)}`;
    try { await navigator.clipboard.writeText(link); setNotice('Link copied to the clipboard'); } catch { setNotice(`Copy this link: ${link}`); }
  }, [selection, year, filters]);
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
  const filterKey = `${visibleYear}:${JSON.stringify(filters)}`;
  const zIndex = (key: string) => 20 + desk.order.indexOf(key);
  const toggle = (key: string) => changeDesk((d) => toggleTask(d, key));
  const show = (key: string) => changeDesk((d) => focusWindow(d, key));
  /** Close several windows; the map selection clears if it belonged to one of them and no Properties window takes over. */
  const closeKeys = (keys: readonly string[]) => changeDesk((d) => closeWindows(d, keys),
    keys.flatMap((key) => windowFor(desk, key)?.item ?? []));
  /** Right-click menu of one taskbar button, after Win98's window menu. */
  const windowActions = (task: Task): MenuAction[] => {
    const w = windowFor(desk, task.key);
    const others = w ? desk.windows.filter((o) => o.key !== w.key && windowType(o.item) === windowType(w.item)) : [];
    const selection = w && isSelectionItem(w.item) ? w.item : null;
    return [
      { label: 'Restore', disabled: !task.minimized, primary: task.minimized, run: () => show(task.key) },
      { label: 'Minimize', disabled: task.minimized, run: () => changeDesk((d) => minimizeWindow(d, task.key)) },
      ...(selection ? [{ label: 'Show on Map', separator: true, run: () => select(selection, true) }] : []),
      ...(others.length ? [{ label: others.length === 1 ? 'Close Other Window' : `Close ${others.length} Other Windows`, separator: !selection,
        run: () => closeKeys(others.map((o) => o.key)) }] : []),
      { label: 'Close', separator: true, primary: !task.minimized, run: () => closeKeys([task.key]) },
    ];
  };
  /** Right-click menu of a grouped taskbar button: the same commands for every window in the group. */
  const groupActions = (tasks: Task[]): MenuAction[] => {
    const keys = tasks.map((task) => task.key);
    return [
      { label: 'Restore All', primary: true, run: () => changeDesk((d) => restoreWindows(d, keys)) },
      { label: 'Minimize All', disabled: tasks.every((task) => task.minimized), run: () => changeDesk((d) => minimizeWindows(d, keys)) },
      { label: 'Close All', separator: true, run: () => closeKeys(keys) },
    ];
  };

  return <div className="desktop"><div className="window main-window">
    <div className="title-bar"><div className="title-bar-text">Designer Map: Fashion Houses &amp; Creative Directors</div>
      <div className="title-bar-controls" aria-hidden="true"><button aria-label="Minimize" tabIndex={-1} /><button aria-label="Maximize" tabIndex={-1} /><button aria-label="Close" tabIndex={-1} /></div>
    </div>
    <div className="window-body"><div className="toolbar">
      <fieldset className="city-view" title="What clicking a city pin does">
        <legend className="visually-hidden">Open cities</legend>
        <span aria-hidden="true">Open cities:</span>
        {([['window', 'In windows'], ['map', 'On map']] as const).map(([view, label]) => <span className="field-row" key={view}>
          <input type="radio" id={`city-view-${view}`} name="city-view" checked={cityView === view} onChange={() => setCityView(view)} />
          <label htmlFor={`city-view-${view}`}>{label}</label>
        </span>)}
      </fieldset>
      <ActiveFilters value={filters} onChange={changeFilters} count={visibleHouses.length} total={houses.length} />
    </div>
      <div className="content">
        <DesktopIcon label="Recycle Bin" icon={<img src="/assets/bin.webp" alt="" width={32} height={32} draggable={false} />} storageKey={RECYCLE_BIN_KEY}
          onOpen={() => changeDesk((d) => openItem(d, tool('recycle')))} />
        <MapView key={locationMode} graphRef={graph} connectionFilter={connectionFilter} onSelect={select} onExpandChange={onExpandChange} onShowMore={showMore} onOpenCity={openCity} />
        {desk.directoryOpen && <PropertiesWindow id="side-window" titleId="panel-title" bodyId="panel" title="Directory"
          storageKey={DIRECTORY_RECT_KEY} scrollKey={visibleHouses} minimized={desk.directoryMinimized}
          active={desk.active === DIRECTORY || desk.active === null} zIndex={zIndex(DIRECTORY)}
          onFocus={() => changeDesk((d) => focusWindow(d, DIRECTORY))} onMinimize={() => changeDesk((d) => minimizeWindow(d, DIRECTORY))}
          onClose={() => changeDesk((d) => closeWindow(d, DIRECTORY))}>
          <PanelContent key={filterKey} selection={null} visibleHouses={visibleHouses} year={visibleYear} onSelect={select} onTag={addTag} />
        </PropertiesWindow>}
        {desk.windows.map((w) => <PropertiesWindow key={w.key} id={w.key} titleId={`${w.key}-title`} bodyId={`${w.key}-body`}
          title={windowTitle(w.item)} cascade={w.slot} align={isPlace(w.item) || isTool(w.item) ? 'left' : 'right'} className={isPlace(w.item) ? 'city-window' : undefined}
          preferredSize={isPlace(w.item) ? cityWindowSize(placeTileCount(w.item, visibleIds)) : isTool(w.item) ? TOOL_SIZES[w.item.id] : undefined}
          minSize={isPlace(w.item) ? cityWindowSize(1) : undefined}
          fitHeight={isSelectionItem(w.item)}
          scrollKey={w.revision} minimized={w.minimized} active={desk.active === w.key} zIndex={zIndex(w.key)}
          onFocus={() => changeDesk((d) => focusWindow(d, w.key))} onMinimize={() => changeDesk((d) => minimizeWindow(d, w.key))}
          onClose={() => changeDesk((d) => closeWindow(d, w.key), w.item)}>
          {isPlace(w.item) ? <PlaceWindowContent place={w.item} visibleIds={visibleIds} onSelect={select} />
            : isTool(w.item) ? w.item.id === 'stats' ? <StatisticsContent visibleHouses={visibleHouses} year={visibleYear} filtered={!!matchingIds} onSelect={select} onOpenPlace={openPlace} />
              : w.item.id === 'recycle' ? <RecycleBinContent visibleHouses={visibleHouses} year={visibleYear} onSelect={select} />
              : <MissingReportContent onSelect={select} />
            : <PanelContent key={`${w.revision}:${filterKey}`} selection={w.item} visibleHouses={visibleHouses} year={visibleYear} onSelect={select} onTag={addTag} onOpenPlace={openPlace} />}
        </PropertiesWindow>)}
      </div>
    </div>
    <div className="status-bar"><p className="status-bar-field" id="status-counts" role="status">{notice ?? `${houses.length} houses · ${designers.length} designers · ${moveCount} moves`}</p>
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
          <hr className="start-separator" />
          <div role="radiogroup" aria-label="Connection filter">
            {([['all', 'All connections'], ['designers', 'Designers only'], ['collaborations', 'Collaborations only']] as const).map(([filter, label]) => <div className="field-row start-subitem" key={filter}>
              <input type="radio" id={`connections-${filter}`} name="connection-filter" checked={connectionFilter === filter} onChange={() => setConnectionFilter(filter)} />
              <label htmlFor={`connections-${filter}`}>{label}</label>
            </div>)}
          </div>
        </fieldset>
      </div>
      <FilterMenu value={filters} onChange={changeFilters} />
      <hr className="start-separator" />
      <button className="start-item start-command" id="expand-all" aria-pressed={allExpanded} onClick={() => { close(); graph.current?.setAllExpanded(!graph.current.allExpanded); }}><StartIcon name={allExpanded ? 'collapse' : 'expand'} /><span className="start-label">{allExpanded ? 'Collapse all' : 'Expand all'}</span></button>
      <button className="start-item start-command" id="fit" onClick={() => { close(); graph.current?.fit(); }}><StartIcon name="fit" /><span className="start-label">Fit map</span></button>
      <hr className="start-separator" />
      <button className="start-item start-command" id="copy-link" onClick={() => { close(); void copyLink(); }}><StartIcon name="link" /><span className="start-label">Copy Link</span></button>
      <button className="start-item start-command" id="statistics" onClick={() => { close(); changeDesk((d) => openItem(d, STATISTICS)); }}><StartIcon name="chart" /><span className="start-label">Statistics</span></button>
      {SHOW_MISSING_REPORT && <button className="start-item start-command" id="missing-report" onClick={() => { close(); changeDesk((d) => openItem(d, tool('missing'))); }}><StartIcon name="folder" /><span className="start-label">What's Missing</span></button>}
      <button className="start-item start-command" id="home" onClick={() => { close(); changeDesk((d) => focusWindow({ ...d, directoryOpen: true }, DIRECTORY)); graph.current?.fit(); }}><StartIcon name="folder" /><span className="start-label">Directory</span></button>
    </>}</StartMenu>
    <div className="taskbar-search">
      <SearchBox items={availableSearchItems} value={search} onChange={setSearch} onPick={(item) => select(item.value, true)}
        placeholder="Search" previewAll={false} dropUp />
    </div>
    <button className="task active">Designer Map</button>
    {desk.directoryOpen && <TaskGroup label="Directory" active={desk.active} onToggle={toggle} onShow={show}
      onClose={(key) => closeKeys([key])} windowActions={windowActions} groupActions={groupActions}
      tasks={[{ key: DIRECTORY, title: 'Directory', minimized: desk.directoryMinimized, controls: 'side-window' }]} />}
    {([['Brands', 'brand'], ['Designers', 'designer'], ['Locations', 'place'], ['Statistics', 'stats'], ['Recycle Bin', 'recycle'], ["What's Missing", 'missing']] as const).map(([label, type]) => <TaskGroup key={label} label={label} active={desk.active}
      onToggle={toggle} onShow={show} onClose={(key) => closeKeys([key])} windowActions={windowActions} groupActions={groupActions} tasks={desk.windows.filter((w) => windowType(w.item) === type)
        .map((w) => ({ key: w.key, title: windowTitle(w.item), minimized: w.minimized, controls: w.key }))} />)}<YearTray year={year} minYear={minYear} maxYear={maxYear} playing={playFrom !== null} onYear={setYear}
      onPlay={() => setPlayFrom((current) => current === null ? year >= maxYear ? minYear : year : null)} />
  </div></div>;
}
