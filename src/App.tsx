import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type RefObject } from 'react';
import { allMoves, countryNames, designers, getDesigner, getGroup, getHouse, groups, houses, isBusinessLeadership, yearRange } from './data';
import { matchesHouseFilters, type HouseFilters } from './data/tags';
import type { ConnectionFilter, DesignerGraph, ScreenBox } from './graph/graph';
import { setLocationMode, type LocationMode } from './graph/locations';
import { ActiveFilters, FilterMenu, setFilterValue, type FilterGroup } from './ui/filters';
import { SearchBox, matchingItems, type ListItem } from './ui/listbox';
import { MapView } from './ui/map-view';
import { StartIcon } from './ui/start-icons';
import { StartMenu } from './ui/start-menu';
import { PanelContent, panelTitle, type Place, type Selection } from './ui/panel';
import { PropertiesWindow } from './ui/side-panel';
import { closeWindow, focusWindow, initialDesk, isPlace, isTool, isSelectionItem, STATISTICS, HELP, RUN, LIST_VIEW, SETTINGS, MY_COMPUTER, NOTEPAD, tool, minimizeWindow, toggleMaximized as toggleWindowMaximized, anchorWindow, openItem, openItemAt, retainItems, sameItem, toggleTask, windowFor, windowType, closeWindows, minimizeWindows, restoreWindows, type Desk, type Item } from './ui/desktop';
import { TaskGroup, type Task } from './ui/taskbar';
import { YearTray } from './ui/year-tray';
import { StatisticsContent } from './ui/statistics';
import { HelpContent, MissingReportContent, RecycleBinContent, endedBrands, recycleBinSize } from './ui/tool-windows';
import { SettingsContent, DEFAULT_NOTEPAD_FONT_SIZE, isCursorSize, isNotepadFontSize, isTextSize, textScale, type CityView, type CursorSize, type MapTheme, type TextSize } from './ui/settings';
import { RunContent, type RunTarget } from './ui/run-dialog';
import { ListViewContent, readLayout } from './ui/list-view';
import { addRecent, readRecent, recentLabel, saveRecent, type RecentItem } from './ui/recent';
import { DesktopIcons } from './ui/desktop-icon';
import { MapWindowFrame } from './ui/map-window';
import { FOLDER_ICON, MY_COMPUTER_ICON, MyComputerContent } from './ui/my-computer';
import { NotepadContent } from './ui/notepad';
import { TaskSwitcher, useTaskSwitcher, type SwitchTarget } from './ui/task-switcher';
import { BrandIcon } from './ui/city-window';
import { readSharedView, sharedViewHash } from './ui/share-link';

/** Tool windows' opening sizes: Statistics is wider than Properties so its bar tables have room. */
/** Place windows hold a fixed grid of icons, so they grow with the text size. */
const scaleSize = (size: { width: number; height: number }, scale: number) => scale === 1 ? size
  : { width: Math.round(size.width * scale), height: Math.round(size.height * scale) };
const TOOL_SIZES = { stats: { width: 560, height: 640 }, recycle: { width: 380, height: 480 }, missing: { width: 420, height: 560 }, help: { width: 440, height: 560 }, run: { width: 400, height: 240 }, list: { width: 820, height: 560 }, settings: { width: 340, height: 610 }, computer: { width: 520, height: 440 }, notepad: { width: 460, height: 380 } } as const;
/** Run is a small dialog-like window, so it may be smaller than the Properties minimum. */
const RUN_MIN_SIZE = { width: 320, height: 200 };
/** Start menu's What's Missing report: a research aid, so development builds only. */
const SHOW_MISSING_REPORT = import.meta.env.DEV;
// Desktop icon positions on the desktop area (the old keys held positions inside the map window).
const RECYCLE_BIN_KEY = 'designer-map:desktop-icon:recycle-bin';
const STATISTICS_ICON_KEY = 'designer-map:desktop-icon:statistics';
const LIST_VIEW_ICON_KEY = 'designer-map:desktop-icon:list-view';
const LIST_VIEW_ICON = '/assets/excel.webp';
const SETTINGS_ICON_KEY = 'designer-map:desktop-icon:settings';
const SETTINGS_ICON = '/assets/settings.webp';
const MY_COMPUTER_ICON_KEY = 'designer-map:desktop-icon:my-computer';
const NOTEPAD_ICON_KEY = 'designer-map:desktop-icon:notepad';
const NOTEPAD_ICON = '/assets/notepad.webp';
/** Win98's Help book, cut from help.jpeg (its checkerboard background made transparent). */
const HELP_ICON = '/assets/help.webp';
/** Notepad is small and may be narrower than the Properties minimum. */
const NOTEPAD_MIN_SIZE = { width: 240, height: 160 };
const MAP_ICON = '/assets/ie4.webp';
/** List View's sheet needs room for its menu bar, formula bar and a few columns. */
const LIST_MIN_SIZE = { width: 360, height: 260 };
import type { MenuAction } from './ui/context-menu';
import { PlaceWindowContent, cityWindowSize, placeTileCount, placeTitle } from './ui/city-window';

const [minYear, maxYear] = yearRange();
const moveCount = allMoves().length;
const LINES_KEY = 'designer-map:show-lines';
const COLLABORATIONS_KEY = 'designer-map:show-collaborations';
const LOCATION_KEY = 'designer-map:location-mode';
const CITY_VIEW_KEY = 'designer-map:city-view';
const MAP_THEME_KEY = 'designer-map:map-theme';
const TEXT_SIZE_KEY = 'designer-map:text-size';
const CURSOR_SIZE_KEY = 'designer-map:cursor-size';
const NOTEPAD_FONT_KEY = 'designer-map:notepad-font-size';
const MAP_WINDOW_KEY = 'designer-map:map-window';
const MAP_ICON_KEY = 'designer-map:desktop-icon:explorer';
/** The map window's key in the Alt+Tab list (desk windows use their own keys). */
const MAP_KEY = 'map-window';
/** The map's own window: open, minimized to the taskbar, or closed (reopened from its desktop icon). */
type MapWindow = { state: 'open' | 'minimized' | 'closed'; maximized: boolean };
const collator = new Intl.Collator('en', { sensitivity: 'base', numeric: true });
const searchItems: ListItem<NonNullable<Selection>>[] = [
  ...houses.map((h) => ({ label: h.name, aliases: h.aliases, hint: 'house', value: { kind: 'house' as const, id: h.id } })),
  ...groups.map((g) => ({ label: g.name, hint: 'group', value: { kind: 'group' as const, id: g.id } })),
  ...designers.map((d) => ({ label: d.name, hint: d.career.some(isBusinessLeadership) ? 'leader' : 'designer', value: { kind: 'designer' as const, id: d.id } })),
].sort((a, b) => collator.compare(a.label, b.label) || a.hint.localeCompare(b.hint));
/** Run… also opens places (every base or origin city, and every country with a brand) and years. */
const placeRunItems: ListItem<RunTarget>[] = [
  ...[...new Set(houses.flatMap((h) => h.origin ? [h.city, h.origin.city] : [h.city]))]
    .map((city) => ({ label: city, hint: 'city', value: { kind: 'place' as const, value: { kind: 'city' as const, id: city } } })),
  ...[...new Set(houses.flatMap((h) => h.origin ? [h.country, h.origin.country] : [h.country]))]
    .map((country) => ({ label: countryNames[country], hint: 'country', value: { kind: 'place' as const, value: { kind: 'country' as const, id: country } } })),
].sort((a, b) => collator.compare(a.label, b.label));
const yearRunItems: ListItem<RunTarget>[] = Array.from({ length: maxYear - minYear + 1 }, (_, i) => maxYear - i)
  .map((year) => ({ label: String(year), hint: 'year', value: { kind: 'year' as const, year } }));
const RECENT_HINTS = { house: 'brand', designer: 'designer', group: 'group', city: 'city', country: 'country' } as const;

/** Place windows are titled with the city or country, like an Explorer folder; others as Properties. */
const TOOL_TITLES = { stats: 'Statistics', recycle: 'Recycle Bin', missing: "What's Missing", help: 'Help', run: 'Run', list: 'List View - Designer Map.xls', settings: 'Settings', computer: 'My Computer', notepad: 'Untitled - Notepad' } as const;
const image = (src: string, size: number, className?: string) => <img className={className} src={src} alt="" width={size} height={size} draggable={false} />;
/** A window's icon (Alt+Tab, title bars): the brand's logo, or a Win98 icon for its kind. */
function windowIcon(item: Item, size: number) {
  if (item.kind === 'house') { const house = getHouse(item.id); return house ? <BrandIcon house={house} /> : <StartIcon name="folder" size={size} />; }
  if (item.kind === 'designer') return <StartIcon name="designer" size={size} />;
  if (item.kind === 'group') return <StartIcon name="group" size={size} />;
  if (isPlace(item)) return image(FOLDER_ICON, size);
  switch (item.id) {
    case 'recycle': return image('/assets/bin.webp', size);
    case 'list': return image(LIST_VIEW_ICON, size, 'xl-icon');
    case 'settings': return image(SETTINGS_ICON, size);
    case 'stats': return <StartIcon name="chart" size={size} />;
    case 'help': return image(HELP_ICON, size);
    case 'run': return <StartIcon name="run" size={size} />;
    case 'computer': return image(MY_COMPUTER_ICON, size, 'smooth-icon');
    case 'notepad': return image(NOTEPAD_ICON, size);
    case 'missing': return <StartIcon name="folder" size={size} />;
  }
}
/** Tool windows with their own 16px title-bar icon. */
const TITLE_ICONS: ReadonlySet<string> = new Set(['list', 'settings', 'computer', 'notepad', 'help']);
const windowTitle = (item: Item) => isPlace(item) ? placeTitle(item) : isTool(item) ? TOOL_TITLES[item.id] : panelTitle(item);

/** The desktop's shortcuts, shown as icons on the desktop and as Quick Launch buttons beside Start. */
function desktopShortcuts(openMap: () => void, open: (item: Item) => void) {
  const picture = (src: string, className?: string) => (size: number) => image(src, size, className);
  const pixel = (name: 'chart') => (size: number) => <StartIcon name={name} size={size} />;
  return [
    { label: 'My Computer', type: 'system' as const, icon: picture(MY_COMPUTER_ICON, 'smooth-icon'), storageKey: MY_COMPUTER_ICON_KEY, open: () => open(MY_COMPUTER) },
    { label: 'Explorer', type: 'system' as const, icon: picture(MAP_ICON, 'browser-icon'), storageKey: MAP_ICON_KEY, open: openMap },
    { label: 'Recycle Bin', type: 'system' as const, icon: picture('/assets/bin.webp'), storageKey: RECYCLE_BIN_KEY, open: () => open(tool('recycle')) },
    { label: 'Statistics', icon: pixel('chart'), storageKey: STATISTICS_ICON_KEY, open: () => open(STATISTICS) },
    { label: 'List View', icon: picture(LIST_VIEW_ICON, 'xl-icon'), storageKey: LIST_VIEW_ICON_KEY, open: () => open(LIST_VIEW) },
    { label: 'Settings', icon: picture(SETTINGS_ICON), storageKey: SETTINGS_ICON_KEY, open: () => open(SETTINGS) },
    { label: 'Notepad', icon: picture(NOTEPAD_ICON), storageKey: NOTEPAD_ICON_KEY, open: () => open(NOTEPAD) },
  ];
}

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
  const [address, setAddress] = useState('');
  const [allExpanded, setAllExpanded] = useState(false);
  const [connectionFilter, setConnectionFilter] = useState<ConnectionFilter>('all');
  const [desk, setDesk] = useState<Desk>(initialDesk);
  const [recent, setRecent] = useState<readonly RecentItem[]>(readRecent);
  const [resets, setResets] = useState(0);
  /** List View's View ▸ Full Screen (remembered with its layout): its window fills the desktop area. */
  const [listFullScreen, setListFullScreen] = useState(() => readLayout().fullScreen);
  const deskRef = useRef(desk);
  deskRef.current = desk;
  const [showLines, setShowLines] = useState(() => {
    try { return localStorage.getItem(LINES_KEY) !== 'off'; } catch { return true; }
  });
  const [showCollaborations, setShowCollaborations] = useState(() => {
    try { return localStorage.getItem(COLLABORATIONS_KEY) !== 'off'; } catch { return true; }
  });
  const [mapTheme, setMapTheme] = useState<MapTheme>(() => {
    try { return localStorage.getItem(MAP_THEME_KEY) === 'night' ? 'night' : 'day'; } catch { return 'day'; }
  });
  const [mapWindow, setMapWindow] = useState<MapWindow>(() => {
    try { return { state: 'open', maximized: localStorage.getItem(MAP_WINDOW_KEY) === 'maximized' }; } catch { return { state: 'open', maximized: false }; }
  });
  const mapContent = useRef<HTMLDivElement>(null);
  const openMap = useCallback(() => setMapWindow((w) => w.state === 'open' ? w : { ...w, state: 'open' }), []);
  const toggleMaximized = () => setMapWindow((w) => {
    try { localStorage.setItem(MAP_WINDOW_KEY, w.maximized ? 'normal' : 'maximized'); } catch { /* storage unavailable */ }
    return { ...w, maximized: !w.maximized };
  });
  const [textSize, setTextSize] = useState<TextSize>(() => {
    try { const saved = localStorage.getItem(TEXT_SIZE_KEY); return isTextSize(saved) ? saved : 'normal'; } catch { return 'normal'; }
  });
  const [cursorSize, setCursorSize] = useState<CursorSize>(() => {
    try { const saved = localStorage.getItem(CURSOR_SIZE_KEY); return isCursorSize(saved) ? saved : 'normal'; } catch { return 'normal'; }
  });
  const [notepadFontSize, setNotepadFontSize] = useState(() => {
    try { const saved = Number(localStorage.getItem(NOTEPAD_FONT_KEY)); return isNotepadFontSize(saved) ? saved : DEFAULT_NOTEPAD_FONT_SIZE; } catch { return DEFAULT_NOTEPAD_FONT_SIZE; }
  });
  useEffect(() => { try { localStorage.setItem(NOTEPAD_FONT_KEY, String(notepadFontSize)); } catch { /* storage unavailable */ } }, [notepadFontSize]);
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
  /** A brand window just opened or reused: placed beside its city once the graph has applied the selection. */
  const pendingAnchor = useRef<{ key: string; id: string } | null>(null);
  const select = useCallback((value: Selection, reveal = false) => {
    setRequest((current) => ({ value, reveal, revision: current.revision + 1 }));
    setDesk((current) => {
      if (!value) return { ...current, active: null };
      const next = openItem(current, value);
      const opened = windowFor(next, next.active);
      const before = opened && windowFor(current, opened.key);
      // Only a new or reused window moves; focusing one that's already open leaves it where it is.
      if (value.kind === 'house' && opened && (!before || before.revision !== opened.revision)) pendingAnchor.current = { key: opened.key, id: value.id };
      return next;
    });
  }, []);
  /** Highlight a window's item on the map without moving the view. */
  const showOnMap = useCallback((value: Selection) => {
    setRequest((current) => sameItem(current.value, value) ? current : { value, reveal: false, revision: current.revision + 1 });
  }, []);
  /** A place window's Show on Map: select and reveal a brand on the map without opening its Properties. */
  const revealOnMap = useCallback((id: string) => {
    setRequest((current) => ({ value: { kind: 'house', id }, reveal: true, revision: current.revision + 1 }));
  }, []);
  const showPlaceOnMap = useCallback((cities: readonly string[]) => graph.current?.showCities(cities), []);
  /** List View's Show on Map: select and reveal a brand, designer or group without opening its Properties. */
  const revealSelection = useCallback((value: NonNullable<Selection>) => {
    setRequest((current) => ({ value, reveal: true, revision: current.revision + 1 }));
  }, []);
  /** Apply a window change, then keep the map's selection in step with the active window. */
  const changeDesk = useCallback((change: (desk: Desk) => Desk, closing?: Item | readonly Item[]) => {
    const next = change(deskRef.current);
    // Several changes in one event (opening a multiple icon selection) each build on the last.
    deskRef.current = next;
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
  const openPlace = useCallback((place: Place, anchor?: ScreenBox) => setDesk((current) => openItemAt(current, place, anchor)), []);
  const openCity = useCallback((city: string, pin?: ScreenBox) => {
    if (cityViewRef.current === 'map') graph.current?.toggleCity(city);
    else openPlace({ kind: 'city', id: city }, pin);
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
    const pending = pendingAnchor.current;
    pendingAnchor.current = null;
    const box = pending && graph.current?.locationBox(pending.id);
    if (pending && box) setDesk((current) => anchorWindow(current, pending.key, box));
  }, [selection, request, locationMode]);
  useEffect(() => { if (desk.windows.some((w) => !isVisibleItem(w.item))) setDesk((current) => retainItems(current, isVisibleItem)); }, [desk.windows, isVisibleItem]);
  useEffect(() => { if (!keepSelection) select(null); }, [keepSelection, select]);
  useEffect(() => {
    graph.current?.setShowMoves(showLines);
    try { localStorage.setItem(LINES_KEY, showLines ? 'on' : 'off'); } catch { /* storage unavailable */ }
  }, [showLines, locationMode]);
  useEffect(() => {
    graph.current?.setShowCollaborations(showCollaborations);
    try { localStorage.setItem(COLLABORATIONS_KEY, showCollaborations ? 'on' : 'off'); } catch { /* storage unavailable */ }
  }, [showCollaborations, locationMode]);
  useLayoutEffect(() => {
    graph.current?.setNight(mapTheme === 'night');
    // Night mode darkens the window chrome too (scripts/night-chrome.mjs derives those styles).
    if (mapTheme === 'night') document.documentElement.dataset.theme = 'night';
    else delete document.documentElement.dataset.theme;
    try { localStorage.setItem(MAP_THEME_KEY, mapTheme); } catch { /* storage unavailable */ }
  }, [mapTheme, locationMode]);
  useLayoutEffect(() => {
    graph.current?.setTextScale(textScale(textSize));
    document.documentElement.style.setProperty('--text-zoom', String(textScale(textSize)));
    try { localStorage.setItem(TEXT_SIZE_KEY, textSize); } catch { /* storage unavailable */ }
  }, [textSize, locationMode]);
  useLayoutEffect(() => {
    if (cursorSize === 'normal') delete document.documentElement.dataset.cursorSize;
    else document.documentElement.dataset.cursorSize = cursorSize;
    try { localStorage.setItem(CURSOR_SIZE_KEY, cursorSize); } catch { /* storage unavailable */ }
  }, [cursorSize]);
  // A new map selection (search, Show on Map, links) brings the map window back; other windows live on the desktop without it.
  useEffect(() => { if (request.revision) openMap(); }, [request.revision, openMap]);
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
  // Start ▸ Documents: whatever brand, designer, group or place window is brought to the front.
  const activeItem = windowFor(desk, desk.active)?.item;
  useEffect(() => {
    if (activeItem && !isTool(activeItem)) setRecent((list) => addRecent(list, activeItem));
  }, [activeItem?.kind, activeItem?.id]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => saveRecent(recent), [recent]);
  // Reset View: once the cleared selection reaches the graph, close open cities and show the whole map.
  useLayoutEffect(() => {
    if (!resets) return;
    graph.current?.setAllExpanded(false);
    graph.current?.fit();
  }, [resets]);
  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 3000);
    return () => clearTimeout(timer);
  }, [notice]);
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
  /** Explorer's Go button (or Enter with the suggestions closed): open the best match, exact names first. */
  const goToAddress = () => {
    const best = address.trim() && matchingItems(availableSearchItems, address, 1, true)[0];
    if (!best) return;
    setAddress(best.label);
    select(best.value, true);
  };
  const runItems = useMemo<ListItem<RunTarget>[]>(() => [
    ...availableSearchItems.map((item) => ({ ...item, value: { kind: 'select' as const, value: item.value } })),
    ...placeRunItems, ...yearRunItems,
  ], [availableSearchItems]);
  /** Run… keeps its window open: the opened brand, designer or place window comes to the front over it. */
  const run = (target: RunTarget) => {
    if (target.kind === 'select') select(target.value, true);
    else if (target.kind === 'place') openPlace(target.value);
    else { setPlayFrom(null); setYear(target.year); }
  };
  const openRecent = (item: RecentItem) => item.kind === 'city' || item.kind === 'country' ? openPlace(item) : select(item, true);
  const openTool = (item: Item) => changeDesk((d) => openItem(d, item));
  /** Start ▸ Reset View: no selection, filters, year, open windows or open cities. Map settings stay as they are. */
  const resetView = () => {
    setPlayFrom(null);
    setFilters({});
    setSearch('');
    setYear(maxYear);
    setConnectionFilter('all');
    setRequest((current) => ({ value: null, reveal: false, revision: current.revision + 1 }));
    setDesk(initialDesk());
    setResets((n) => n + 1);
    setNotice('View reset');
  };
  const name = selection?.kind === 'group' ? getGroup(selection.id)?.name
    : selection?.kind === 'house' ? getHouse(selection.id)?.name : selection ? getDesigner(selection.id)?.name : undefined;
  const filterKey = `${visibleYear}:${JSON.stringify(filters)}`;
  const zIndex = (key: string) => 20 + desk.order.indexOf(key);
  // Windows live on the desktop beside the map window, so they open and restore without it.
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
      ...(w ? [{ label: isMaximized(w) ? 'Restore Size' : 'Maximize', run: () => maximize(w.key) }] : []),
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

  const isList = (item: Item) => isTool(item) && item.id === 'list';
  const isMaximized = (w: { item: Item; maximized?: boolean }) => isList(w.item) ? listFullScreen : !!w.maximized;
  /** Maximize / Restore one window; List View's is its View ▸ Full Screen. */
  const maximize = (key: string) => {
    const w = windowFor(desk, key);
    if (w && isList(w.item)) { setListFullScreen((on) => !on); show(key); }
    else changeDesk((d) => toggleWindowMaximized(d, key));
  };

  // Keyboard shortcuts: Alt+Tab switches windows (task-switcher.tsx), Alt+F4 closes the active one, F1 opens Help.
  const recency = useRef<string[]>([]);
  const touch = (key: string) => { recency.current = [key, ...recency.current.filter((k) => k !== key)]; };
  useEffect(() => { if (desk.active) touch(desk.active); }, [desk.active]);
  const switchTargets = (): SwitchTarget[] => {
    const rank = (key: string) => { const i = recency.current.indexOf(key); return i < 0 ? Infinity : i; };
    const list: SwitchTarget[] = [...desk.windows].reverse().map((w) => ({ key: w.key, title: windowTitle(w.item), icon: windowIcon(w.item, 32) }));
    if (mapWindow.state !== 'closed') list.push({ key: MAP_KEY, title: 'Explorer', icon: image(MAP_ICON, 32, 'browser-icon') });
    // The active window comes first; the rest by how recently they were used.
    return list.sort((a, b) => Number(b.key === desk.active) - Number(a.key === desk.active) || rank(a.key) - rank(b.key));
  };
  const switcher = useTaskSwitcher(switchTargets, (key) => {
    if (key === MAP_KEY) { touch(MAP_KEY); openMap(); changeDesk((d) => ({ ...d, active: null })); }
    else show(key);
  });
  const shortcuts = useRef<(event: KeyboardEvent) => void>(() => {});
  shortcuts.current = (event) => {
    if (event.key === 'F4' && event.altKey) {
      event.preventDefault();
      if (desk.active) closeKeys([desk.active]);
      else if (mapWindow.state === 'open') setMapWindow((w) => ({ ...w, state: 'closed' }));
    } else if (event.key === 'F1' && !event.altKey && !event.ctrlKey && !event.metaKey) {
      event.preventDefault();
      openTool(HELP);
    }
  };
  useEffect(() => {
    const listener = (event: KeyboardEvent) => shortcuts.current(event);
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, []);

  const mapHidden = mapWindow.state !== 'open';
  const iconBounds = useMapContentBounds(mapContent, mapWindow.maximized && !mapHidden);
  const icons = desktopShortcuts(openMap, (item) => changeDesk((d) => openItem(d, item)));
  return <div className={`desktop${mapWindow.maximized ? ' map-maximized' : ''}`}><div className="desktop-area">
    {/* Over a full-screen map the icons sit on the map's top-left corner, above it and under the other windows. */}
    <DesktopIcons icons={icons.map((icon) => ({ ...icon, icon: icon.icon(32) }))} className={iconBounds ? 'over-map' : undefined} style={iconBounds ?? undefined}
      desktopActions={[{ label: 'New Text Document', run: () => openTool(NOTEPAD) }, { label: 'Properties', run: () => openTool(SETTINGS) }]} />
    <MapWindowFrame onActivate={() => touch(MAP_KEY)} title="Explorer" icon={<img className="title-bar-icon" src={MAP_ICON} alt="" width={16} height={16} draggable={false} />}
      hidden={mapHidden} maximized={mapWindow.maximized} onToggleMaximize={toggleMaximized}
      onMinimize={() => setMapWindow((w) => ({ ...w, state: 'minimized' }))} onClose={() => setMapWindow((w) => ({ ...w, state: 'closed' }))}>
      <div className="window-body">
        <form className="address-bar" role="search" onSubmit={(event) => { event.preventDefault(); goToAddress(); }}>
          <SearchBox items={availableSearchItems} value={address} onChange={setAddress} onPick={(item) => select(item.value, true)}
            label="Address" inputId="address" placeholder="Brand, designer or group" previewAll={false} exactFirst dropButton
            icon={<img src={MAP_ICON} alt="" width={16} height={16} draggable={false} />} />
          <button type="submit" className="address-go"><StartIcon name="go" size={16} className="address-go-icon" />Go</button>
        </form>
        <div className="toolbar">
          <ActiveFilters value={filters} onChange={changeFilters} count={visibleHouses.length} total={houses.length} />
        </div>
        <div className="content" ref={mapContent}>
          <MapView key={locationMode} graphRef={graph} connectionFilter={connectionFilter} onSelect={select} onExpandChange={onExpandChange} onShowMore={showMore} onOpenCity={openCity} />
        </div>
      </div>
      <div className="status-bar"><p className="status-bar-field" id="status-counts" role="status">{notice ?? `${houses.length} houses · ${designers.length} designers · ${moveCount} moves`}</p>
        <p className="status-bar-field" id="status-selection">{name ? `Selected: ${name}` : 'Nothing selected'}</p>
        <p className="status-bar-field" id="status-year">{year >= maxYear ? 'Showing all years' : `Up to ${year}`}</p>
      </div>
    </MapWindowFrame>
    {desk.windows.map((w) => <PropertiesWindow key={w.key} id={w.key} titleId={`${w.key}-title`} bodyId={`${w.key}-body`}
      title={windowTitle(w.item)} cascade={w.slot} anchor={w.anchor} align={isPlace(w.item) || isTool(w.item) ? 'left' : 'right'} className={isPlace(w.item) ? 'city-window' : isTool(w.item) && w.item.id === 'recycle' ? 'city-window recycle-window' : isTool(w.item) && w.item.id === 'run' ? 'run-window' : isTool(w.item) && w.item.id === 'list' ? 'list-window' : isTool(w.item) && w.item.id === 'computer' ? 'city-window computer-window' : isTool(w.item) && w.item.id === 'notepad' ? 'notepad-window' : undefined}
      icon={isTool(w.item) && TITLE_ICONS.has(w.item.id) ? windowIcon(w.item, 16) : undefined}
      preferredSize={isPlace(w.item) ? scaleSize(cityWindowSize(placeTileCount(w.item, visibleIds)), textScale(textSize))
        : isTool(w.item) && w.item.id === 'recycle' ? scaleSize(recycleBinSize(endedBrands(visibleHouses, visibleYear).length), textScale(textSize)) : isTool(w.item) ? TOOL_SIZES[w.item.id] : undefined}
      minSize={isPlace(w.item) ? scaleSize(cityWindowSize(1), textScale(textSize))
        : isTool(w.item) && w.item.id === 'recycle' ? scaleSize(recycleBinSize(1), textScale(textSize)) : isTool(w.item) && w.item.id === 'run' ? RUN_MIN_SIZE : isTool(w.item) && w.item.id === 'list' ? LIST_MIN_SIZE : isTool(w.item) && w.item.id === 'notepad' ? NOTEPAD_MIN_SIZE : undefined}
      fitHeight={isSelectionItem(w.item)}
      maximized={isMaximized(w)} onMaximize={() => maximize(w.key)}
      scrollKey={w.revision} minimized={w.minimized} active={desk.active === w.key} zIndex={zIndex(w.key)}
      onFocus={() => changeDesk((d) => focusWindow(d, w.key))} onMinimize={() => changeDesk((d) => minimizeWindow(d, w.key))}
      onClose={() => changeDesk((d) => closeWindow(d, w.key), w.item)}>
      {isPlace(w.item) ? <PlaceWindowContent place={w.item} visibleIds={visibleIds} onSelect={select}
        onShowOnMap={revealOnMap} onOpenPlace={openPlace} onShowPlace={showPlaceOnMap} />
        : isTool(w.item) ? w.item.id === 'stats' ? <StatisticsContent visibleHouses={visibleHouses} year={visibleYear} filtered={!!matchingIds} onSelect={select} onOpenPlace={openPlace} />
          : w.item.id === 'recycle' ? <RecycleBinContent visibleHouses={visibleHouses} year={visibleYear} onSelect={select} onShowOnMap={revealOnMap} />
          : w.item.id === 'help' ? <HelpContent />
          : w.item.id === 'list' ? <ListViewContent onSelect={select} onOpenPlace={openPlace} onShowOnMap={revealSelection} onShowPlace={showPlaceOnMap} fullScreen={listFullScreen} onFullScreen={setListFullScreen} onHelp={() => changeDesk((d) => openItem(d, HELP))} onClose={() => closeKeys([w.key])} />
          : w.item.id === 'settings' ? <SettingsContent settings={{ mapTheme, textSize, cursorSize, locationMode, cityView, showLines, showCollaborations, connectionFilter, notepadFontSize }}
            onChange={{ mapTheme: setMapTheme, textSize: setTextSize, cursorSize: setCursorSize, locationMode: changeLocationMode, cityView: setCityView, showLines: setShowLines, showCollaborations: setShowCollaborations, connectionFilter: setConnectionFilter, notepadFontSize: setNotepadFontSize }} />
          : w.item.id === 'run' ? <RunContent items={runItems} onRun={run} onBrowse={() => openTool(MY_COMPUTER)} onClose={() => closeKeys([w.key])} />
          : w.item.id === 'computer' ? <MyComputerContent visibleHouses={visibleHouses} onSelect={select} onShowOnMap={revealSelection}
            onOpenPlace={openPlace} onShowPlace={showPlaceOnMap} onOpenSettings={() => openTool(SETTINGS)} />
          : w.item.id === 'notepad' ? <NotepadContent fontSize={notepadFontSize} onFontSize={setNotepadFontSize} onClose={() => closeKeys([w.key])} onHelp={() => openTool(HELP)} />
          : <MissingReportContent onSelect={select} />
        : <PanelContent key={`${w.revision}:${filterKey}`} selection={w.item} year={visibleYear} onSelect={select} onTag={addTag} onOpenPlace={openPlace} onShowOnMap={revealSelection} />}
    </PropertiesWindow>)}
  </div><div className="taskbar"><StartMenu>{(close) => <>
      <div className="start-item start-parent" tabIndex={0} aria-haspopup="true">
        <StartIcon name="documents" /><span className="start-label">Documents</span><span className="start-arrow" aria-hidden="true" />
        <div className="window start-submenu documents-submenu" role="group" aria-label="Documents">
          {recent.length ? recent.map((item) => <button type="button" className="start-subitem start-subcommand" key={`${item.kind}:${item.id}`}
            disabled={!isVisibleItem(item)} title={isVisibleItem(item) ? undefined : 'Hidden by the year or brand filters'}
            onClick={() => { close(); openRecent(item); }}>
            <span className="start-label">{recentLabel(item)}</span><span className="recent-kind">{RECENT_HINTS[item.kind]}</span>
          </button>) : <button type="button" className="start-subitem start-subcommand" disabled>(Empty)</button>}
          {recent.length > 0 && <><hr className="start-separator" />
            <button type="button" className="start-subitem start-subcommand" onClick={() => setRecent([])}>Clear Documents</button></>}
        </div>
      </div>
      <hr className="start-separator" />
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
      <hr className="start-separator" />
      <button className="start-item start-command" id="statistics" onClick={() => { close(); changeDesk((d) => openItem(d, STATISTICS)); }}><StartIcon name="chart" /><span className="start-label">Statistics</span></button>
      <button className="start-item start-command" id="list-view" onClick={() => { close(); changeDesk((d) => openItem(d, LIST_VIEW)); }}><img className="start-icon xl-icon" src={LIST_VIEW_ICON} alt="" width={32} height={32} /><span className="start-label">List View</span></button>
      {SHOW_MISSING_REPORT && <button className="start-item start-command" id="missing-report" onClick={() => { close(); changeDesk((d) => openItem(d, tool('missing'))); }}><StartIcon name="folder" /><span className="start-label">What's Missing</span></button>}
      <button className="start-item start-command" id="notepad" onClick={() => { close(); openTool(NOTEPAD); }}><img className="start-icon" src={NOTEPAD_ICON} alt="" width={32} height={32} /><span className="start-label">Notepad</span></button>
      <button className="start-item start-command" id="my-computer" onClick={() => { close(); openTool(MY_COMPUTER); }}><img className="start-icon smooth-icon" src={MY_COMPUTER_ICON} alt="" width={32} height={32} /><span className="start-label">My Computer</span></button>
      <hr className="start-separator" />
      <button className="start-item start-command" id="settings" onClick={() => { close(); changeDesk((d) => openItem(d, SETTINGS)); }}><img className="start-icon" src={SETTINGS_ICON} alt="" width={32} height={32} /><span className="start-label">Settings</span></button>
      <button className="start-item start-command" id="help" onClick={() => { close(); changeDesk((d) => openItem(d, HELP)); }}><img className="start-icon" src={HELP_ICON} alt="" width={32} height={32} /><span className="start-label">Help</span></button>
      <button className="start-item start-command" id="run" onClick={() => { close(); changeDesk((d) => openItem(d, RUN)); }}><StartIcon name="run" /><span className="start-label">Run…</span></button>
      <hr className="start-separator" />
      <button className="start-item start-command" id="reset-view" onClick={() => { close(); resetView(); }}><StartIcon name="reset" /><span className="start-label">Reset View</span></button>
    </>}</StartMenu>
    <div className="quick-launch" role="toolbar" aria-label="Quick Launch">
      {icons.map((icon) => <button type="button" className="quick-launch-button" key={icon.label} aria-label={`Launch ${icon.label}`} title={icon.label}
        onClick={icon.open}>{icon.icon(16)}</button>)}
    </div>
    <div className="taskbar-search">
      <SearchBox items={availableSearchItems} value={search} onChange={setSearch} onPick={(item) => select(item.value, true)}
        placeholder="Search" previewAll={false} dropUp />
    </div>
    {mapWindow.state !== 'closed' && <button className={`task map-task${mapHidden ? '' : ' active'}`} aria-pressed={!mapHidden} aria-controls="map-window"
      onClick={() => setMapWindow((w) => ({ ...w, state: w.state === 'open' ? 'minimized' : 'open' }))}>
      <img className="task-icon" src={MAP_ICON} alt="" width={16} height={16} draggable={false} /><span className="task-label">Explorer</span>
    </button>}
    {([['Brands', 'brand'], ['Designers', 'designer'], ['Locations', 'place'], ['Statistics', 'stats'], ['List View', 'list'], ['Recycle Bin', 'recycle'], ["What's Missing", 'missing'], ['Settings', 'settings'], ['My Computer', 'computer'], ['Notepad', 'notepad'], ['Help', 'help'], ['Run', 'run']] as const).map(([label, type]) => <TaskGroup key={label} label={label} active={desk.active}
      onToggle={toggle} onShow={show} onClose={(key) => closeKeys([key])} windowActions={windowActions} groupActions={groupActions} tasks={desk.windows.filter((w) => windowType(w.item) === type)
        .map((w) => ({ key: w.key, title: windowTitle(w.item), minimized: w.minimized, controls: w.key }))} />)}<YearTray year={year} minYear={minYear} maxYear={maxYear} playing={playFrom !== null} onYear={setYear}
      onPlay={() => setPlayFrom((current) => current === null ? year >= maxYear ? minYear : year : null)} />
  </div>{switcher && <TaskSwitcher list={switcher.list} index={switcher.index} />}</div>;
}

/** While `on`, the map content area's box relative to the desktop area (desktop icons are laid over it). */
function useMapContentBounds(content: RefObject<HTMLDivElement | null>, on: boolean) {
  const [bounds, setBounds] = useState<{ left: number; top: number; width: number; height: number } | null>(null);
  useLayoutEffect(() => {
    const element = content.current, area = element?.closest('.desktop-area');
    if (!on || !element || !area) { setBounds(null); return; }
    const measure = () => {
      const box = element.getBoundingClientRect(), origin = area.getBoundingClientRect();
      setBounds({ left: box.left - origin.left, top: box.top - origin.top, width: box.width, height: box.height });
    };
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    // The toolbar's filter chips and the text size move the content's top; both resize it.
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    observer.observe(area);
    return () => observer.disconnect();
  }, [content, on]);
  return bounds;
}
