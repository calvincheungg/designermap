import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { allMoves, careerOf, designers, getDesigner, getGroup, getHouse, houses, housesInGroup } from './data';
import { matchesHouseFilters, type HouseFilters } from './data/tags';
import type { ConnectionFilter, DesignerGraph, ScreenBox } from './graph/graph';
import { ActiveFilters, setFilterValue, type FilterGroup } from './ui/filters';
import { SearchBox, matchingItems, type ListItem } from './ui/listbox';
import { MapView } from './ui/map-view';
import { StartIcon } from './ui/start-icons';
import { StartMenu } from './ui/start-menu';
import { PanelContent, type Place, type Selection } from './ui/panel';
import { PropertiesWindow, WINDOW_PLACES, type WindowRect } from './ui/side-panel';
import { closeWindow, focusWindow, initialDesk, isPlace, isTool, isSelectionItem, HELP, RUN, SETTINGS, MY_COMPUTER, NOTEPAD, minimizeWindow, toggleMaximized as toggleWindowMaximized, anchorWindow, openItem, openItemAt, retainItems, sameItem, toggleTask, windowFor, windowType, closeWindows, minimizeWindows, restoreWindows, type Desk, type Item } from './ui/desktop';
import { TaskGroup, type Task } from './ui/taskbar';
import { YearTray } from './ui/year-tray';
import { HelpContent, MissingReportContent, RecycleBinContent } from './ui/tool-windows';
import { NOTEPAD_KEY, SettingsContent, textScale } from './ui/settings';
import { RunContent, type RunTarget } from './ui/run-dialog';
import { addRecent, readRecent, recentLabel, saveRecent, type RecentItem } from './ui/recent';
import { DesktopIcons, iconPlaceKeys } from './ui/desktop-icon';
import { FolderViewContext } from './ui/folder-view';
import { MAP_RECT_KEY, MapWindowFrame } from './ui/map-window';
import { TaskSwitcher, useTaskSwitcher, type SwitchTarget } from './ui/task-switcher';
import { desktopShortcuts, image, MAP_ICON, minimumSize, preferredSize, TITLE_ICONS, windowClass, windowIcon, windowTitle } from './ui/desk-windows';
import { preloadWindows, whenIdle } from './ui/lazy-window';
import { MyComputerWindow, NotepadWindow, SpreadsheetWindow, StatisticsWindow } from './ui/lazy-windows';
import { maxYear, minYear, placeRunItems, searchItems, yearRunItems } from './ui/search-items';
import { readSession, writeSessionState } from './ui/session';
import { readFullScreen } from './ui/spreadsheet/layout-key';
import { StartMenuItems } from './ui/start-menu-items';
import { clearSettings, readText, useSwitch, writeSetting } from './ui/storage';
import { loadNotes } from './ui/use-notes';
import { useSettings, useSyncSettings } from './ui/use-settings';
import { readSharedView, sharedViewHash } from './ui/share-link';

import { Dialog } from './ui/dialog';
import { download } from './ui/download';
import { FilterDialog } from './ui/filter-dialog';
import { SaveAsDialog } from './ui/save-as-dialog';
import { ExplorerMenu, type ExplorerMenuName } from './ui/explorer-menu';
import { FavoritesContext, readFavorites, sameFavorite, saveFavorites, type Favorite, type Favorites } from './ui/favorites';
import { useSelectionHistory } from './ui/use-selection-history';
import type { MenuAction } from './ui/context-menu';
import { PlaceWindowContent } from './ui/city-window';

const moveCount = allMoves().length;
const MAP_WINDOW_KEY = 'designer-map:map-window';
/** The map window's key in the Alt+Tab list (desk windows use their own keys). */
const MAP_KEY = 'map-window';
/** The map's own window: open, minimized to the taskbar, or closed (reopened from its desktop icon). */
type MapWindow = { state: 'open' | 'minimized' | 'closed'; maximized: boolean };

export function App() {
  const graph = useRef<DesignerGraph | null>(null);
  // A shared link (#brand=…&year=…&tier filters) sets the starting view.
  const [sharedView] = useState(() => readSharedView(typeof location === 'undefined' ? '' : location.hash, minYear, maxYear));
  // A refresh of this tab brings its windows and map view back (session.ts).
  const [session] = useState(readSession);
  const [request, setRequest] = useState<{ value: Selection; reveal: boolean; revision: number }>({ value: null, reveal: false, revision: 0 });
  const [filters, setFilters] = useState<HouseFilters>(sharedView.filters);
  const [year, setYear] = useState(sharedView.year ?? maxYear);
  const [notice, setNotice] = useState<string | null>(null);
  const [playFrom, setPlayFrom] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [address, setAddress] = useState('');
  const [allExpanded, setAllExpanded] = useState(false);
  /** Map locations whose whole grid is open. */
  const [openCities, setOpenCities] = useState<ReadonlySet<string>>(new Set());
  const [connectionFilter, setConnectionFilter] = useState<ConnectionFilter>(session?.connectionFilter ?? 'all');
  const [desk, setDesk] = useState<Desk>(() => session?.desk ?? initialDesk());
  const [recent, setRecent] = useState<readonly RecentItem[]>(readRecent);
  const [favorites, setFavorites] = useState<readonly Favorite[]>(readFavorites);
  useEffect(() => saveFavorites(favorites), [favorites]);
  const favoritesValue = useMemo<Favorites>(() => ({
    has: (item) => favorites.some((other) => sameFavorite(item, other)),
    set: (items, on) => setFavorites((list) => [...list.filter((other) => !items.some((item) => sameFavorite(item, other)) || on),
      ...(on ? items.filter((item) => !list.some((other) => sameFavorite(item, other))) : [])]),
  }), [favorites]);
  const [showAddress, setShowAddress] = useSwitch('designer-map:address-bar');
  const [showStatus, setShowStatus] = useSwitch('designer-map:status-bar');
  const [explorerDialog, setExplorerDialog] = useState<'favorites' | 'about' | 'filters' | 'picture' | null>(null);
  const [resets, setResets] = useState(0);
  /** Spreadsheet's View ▸ Full Screen (remembered with its layout): its window fills the desktop area. */
  const [listFullScreen, setListFullScreen] = useState(() => readFullScreen());
  const deskRef = useRef(desk);
  deskRef.current = desk;
  const settings = useSettings();
  const { showLines, setShowLines, showCollaborations, setShowCollaborations, mapTheme, setMapTheme, textSize, setTextSize, cursorSize, setCursorSize,
    notepadFontSize, setNotepadFontSize, locationMode, setLocationMode: changeLocationMode, cityView, setCityView,
    showPulses, setShowPulses, motion, setMotion, wallpaper, setWallpaper, desktopColor, setDesktopColor, clock, setClock, folderView, setFolderView, startup, setStartup } = settings;
  const [mapWindow, setMapWindow] = useState<MapWindow>(() => ({ state: session?.mapState ?? 'open', maximized: readText(MAP_WINDOW_KEY) === 'maximized' }));
  const openMap = useCallback(() => setMapWindow((w) => w.state === 'open' ? w : { ...w, state: 'open' }), []);
  const toggleMaximized = () => setMapWindow((w) => {
    writeSetting(MAP_WINDOW_KEY, w.maximized ? 'normal' : 'maximized');
    return { ...w, maximized: !w.maximized };
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
  /** Reveal several brands together: clear the selection, then show them once the graph has caught up. */
  const pendingBrands = useRef<readonly string[] | null>(null);
  const showBrandsOnMap = useCallback((ids: readonly string[]) => {
    pendingBrands.current = ids;
    setRequest((current) => ({ value: null, reveal: false, revision: current.revision + 1 }));
  }, []);
  const showPlaceOnMap = useCallback((cities: readonly string[]) => graph.current?.showCities(cities), []);
  const hidePlaceOnMap = useCallback((cities: readonly string[]) => graph.current?.hideCities(cities), []);
  /** Hide in a brand, designer or group window: clear the selection, leaving the window open. */
  const hideSelection = useCallback(() => {
    setRequest((current) => ({ value: null, reveal: false, revision: current.revision + 1 }));
  }, []);
  /** Spreadsheet's Show on Map: select and reveal a brand, designer or group without opening its Properties. */
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
  // Read through a ref so the graph's pin callback stays stable (changing views never rebuilds the map).
  const cityViewRef = useRef(cityView);
  cityViewRef.current = cityView;
  const openPlace = useCallback((place: Place, anchor?: ScreenBox) => setDesk((current) => openItemAt(current, place, anchor)), []);
  const openCity = useCallback((city: string, pin?: ScreenBox) => {
    if (cityViewRef.current === 'map') graph.current?.toggleCity(city);
    else openPlace({ kind: 'city', id: city }, pin);
  }, [openPlace]);
  const isVisibleItem = useCallback((item: Item) => item.kind === 'group' || isPlace(item) || isTool(item) || (item.kind === 'house'
    ? visibleIds.has(item.id) : !!getDesigner(item.id)?.career.some((t) => visibleIds.has(t.house))), [visibleIds]);
  const onExpandChange = useCallback((open: number, total: number, fullyOpen: readonly string[]) => {
    setAllExpanded(open === total);
    setOpenCities(new Set(fullyOpen));
  }, []);
  const changeFilters = useCallback((next: HouseFilters) => { setFilters(next); setSearch(''); }, []);
  const addTag = useCallback((group: FilterGroup, value: string) => {
    setFilters((current) => setFilterValue(current, group, value, true)); setSearch('');
  }, []);

  // Synchronize the existing graph API; none of its rendering/layout is moved into React.
  // locationMode rebuilds the graph, so each sync also reruns for the new instance.
  useLayoutEffect(() => { setAllExpanded(false); setOpenCities(new Set()); }, [locationMode]);
  useLayoutEffect(() => { graph.current?.setHouseFilter(matchingIds); }, [matchingIds, locationMode]);
  useLayoutEffect(() => { graph.current?.setYear(visibleYear); }, [visibleYear, locationMode]);
  useLayoutEffect(() => {
    graph.current?.select(selection, request.reveal);
    const brands = pendingBrands.current;
    pendingBrands.current = null;
    if (brands && !selection) graph.current?.showBrands(brands);
    const pending = pendingAnchor.current;
    pendingAnchor.current = null;
    const box = pending && graph.current?.locationBox(pending.id);
    if (pending && box) setDesk((current) => anchorWindow(current, pending.key, box));
  }, [selection, request, locationMode]);
  useEffect(() => { if (desk.windows.some((w) => !isVisibleItem(w.item))) setDesk((current) => retainItems(current, isVisibleItem)); }, [desk.windows, isVisibleItem]);
  useEffect(() => { if (!keepSelection) select(null); }, [keepSelection, select]);
  useSyncSettings(graph, settings);
  // A new map selection (search, Show on Map, links) brings the map window back; other windows live on the desktop without it.
  useEffect(() => { if (request.revision) openMap(); }, [request.revision, openMap]);
  // Open a shared link's selection once the graph exists, and follow later hash edits (pasted links, back/forward).
  useEffect(() => {
    if (session?.map) graph.current?.restoreView(session.map);
    if (sharedView.selection) {
      // Refreshed: select it again without moving the map or touching the windows. A link to something else opens as usual.
      if (session && sameItem(session.selection, sharedView.selection)) setRequest((current) => ({ ...current, value: sharedView.selection }));
      else select(sharedView.selection, true);
    } else if (session?.lastVisit && session.selection) setRequest((current) => ({ ...current, value: session.selection }));
    const follow = () => {
      const view = readSharedView(location.hash, minYear, maxYear);
      setFilters(view.filters);
      setYear(view.year ?? maxYear);
      select(view.selection, !!view.selection);
    };
    window.addEventListener('hashchange', follow);
    return () => window.removeEventListener('hashchange', follow);
  }, [sharedView, session, select]);
  // Keep the address bar's link in step with the view (not during Play, which changes the year every frame).
  const viewHash = sharedViewHash({ selection, year, filters }, maxYear);
  useEffect(() => {
    if (playFrom !== null || viewHash === location.hash || (!viewHash && !location.hash)) return;
    history.replaceState(null, '', `${location.pathname}${location.search}${viewHash}`);
  }, [viewHash, playFrom]);
  // Remember the session as it changes, and once more as the page goes (moved windows and the map view don't redraw App).
  const rects = useRef<Record<string, WindowRect>>({ ...session?.rects });
  const saveSession = useRef(() => {});
  saveSession.current = () => writeSessionState({
    desk, selection, mapState: mapWindow.state, connectionFilter, map: graph.current?.viewState(),
    rects: Object.fromEntries(Object.entries(rects.current).filter(([key]) => windowFor(desk, key))),
  });
  const started = useRef(false);
  useEffect(() => {
    // Not on the first pass: the selection being restored hasn't been applied yet.
    if (started.current) saveSession.current();
    started.current = true;
  }, [desk, selection, mapWindow.state, connectionFilter, startup]);
  useEffect(() => {
    const save = () => saveSession.current();
    const hide = () => { if (document.visibilityState === 'hidden') save(); };
    window.addEventListener('pagehide', save);
    document.addEventListener('visibilitychange', hide);
    return () => { window.removeEventListener('pagehide', save); document.removeEventListener('visibilitychange', hide); };
  }, []);
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
  /** Settings ▸ Reset Window and Icon Positions: every window and desktop icon back to its usual place and size. */
  const resetPositions = () => {
    clearSettings([MAP_RECT_KEY, MAP_WINDOW_KEY, WINDOW_PLACES, ...iconPlaceKeys()]);
    setMapWindow((w) => ({ ...w, maximized: false }));
    setDesk((current) => ({ ...current, windows: current.windows.map((w) => w.maximized ? { ...w, maximized: false } : w) }));
  };
  const name = selection?.kind === 'group' ? getGroup(selection.id)?.name
    : selection?.kind === 'house' ? getHouse(selection.id)?.name : selection ? getDesigner(selection.id)?.name : undefined;
  const visited = useSelectionHistory(selection, isVisibleItem, (item) => select(item, true));
  const clearSelection = () => setRequest((current) => ({ value: null, reveal: false, revision: current.revision + 1 }));
  const copyLink = async (item: Selection) => {
    const link = `${location.origin}${location.pathname}${location.search}${sharedViewHash({ selection: item, year, filters }, maxYear)}`;
    try { await navigator.clipboard.writeText(link); } catch { setNotice('Could not copy the link'); return false; }
    setNotice('Link copied');
    return true;
  };
  const savePicture = async (fileName: string) => {
    try { download(fileName, await graph.current!.picture(), 'image/png'); setNotice('Picture saved'); } catch { setNotice('Could not save the picture'); }
  };
  /** Every brand the favorites cover: the brands, designers' career houses and groups' brands, as shown now. */
  const favoriteBrands = [...new Set(favorites.flatMap((item) => item.kind === 'house' ? [item.id]
    : item.kind === 'designer' ? careerOf(item.id).map((tenure) => tenure.house) : housesInGroup(item.id).map((house) => house.id)))].filter((id) => visibleIds.has(id));
  const isFavorite = !!selection && favoritesValue.has(selection);
  /** Explorer's menu bar. */
  const explorerActions = (menu: ExplorerMenuName): MenuAction[] => {
    switch (menu) {
      case 'File': return [
        { label: 'Open…', run: () => openTool(RUN) },
        { label: 'Copy Link', separator: true, run: () => void copyLink(selection) },
        { label: 'Save Map as Picture…', run: () => setExplorerDialog('picture') },
        { label: 'Properties', separator: true, disabled: !selection, run: () => select(selection) },
        { label: 'Close', separator: true, run: () => setMapWindow((w) => ({ ...w, state: 'closed' })) },
      ];
      case 'Edit': return [
        { label: 'Clear Selection', disabled: !selection, run: clearSelection },
        { label: 'Clear Filters', disabled: !matchingIds, run: () => changeFilters({}) },
        { label: 'Show All Years', disabled: year >= maxYear, run: () => { setPlayFrom(null); setYear(maxYear); } },
        // Shown first if hidden; focused once the menu has gone.
        { label: 'Find…', separator: true, run: () => { setShowAddress(true); window.setTimeout(() => document.getElementById('explorer-find')?.focus()); } },
      ];
      case 'View': return [
        { label: 'Address Bar', checked: showAddress, run: () => setShowAddress((on) => !on) },
        { label: 'Status Bar', checked: showStatus, run: () => setShowStatus((on) => !on) },
        { label: 'Filter Brands…', separator: true, run: () => setExplorerDialog('filters') },
        { label: 'Zoom In', separator: true, run: () => graph.current?.zoomBy(1.5) },
        { label: 'Zoom Out', run: () => graph.current?.zoomBy(1 / 1.5) },
        { label: 'Whole Map', run: () => graph.current?.fit() },
        { label: 'Expand All', separator: true, disabled: allExpanded, run: () => graph.current?.setAllExpanded(true) },
        { label: 'Collapse All', run: () => graph.current?.setAllExpanded(false) },
        { label: 'Move Lines', separator: true, checked: showLines, run: () => setShowLines((on) => !on) },
        { label: 'Collaboration Lines', checked: showCollaborations, run: () => setShowCollaborations((on) => !on) },
        { label: 'Full Screen', separator: true, checked: mapWindow.maximized, run: toggleMaximized },
        { label: 'Options…', run: () => openTool(SETTINGS) },
      ];
      case 'Go': return [
        { label: 'Back', disabled: !visited.back, run: () => visited.back?.() },
        { label: 'Forward', disabled: !visited.forward, run: () => visited.forward?.() },
        { label: 'Home Page', run: () => { clearSelection(); graph.current?.fit(); } },
        { label: 'My Computer', separator: true, run: () => openTool(MY_COMPUTER) },
        ...recent.slice(0, 5).map((item, i) => ({ key: `${item.kind}:${item.id}`, label: recentLabel(item), separator: i === 0, disabled: !isVisibleItem(item), run: () => openRecent(item) })),
      ];
      case 'Favorites': return [
        { label: isFavorite ? 'Remove from Favorites' : 'Add to Favorites', disabled: !selection, run: () => { if (selection) favoritesValue.set([selection], !isFavorite); } },
        { label: 'Show All on Map', disabled: !favoriteBrands.length, run: () => showBrandsOnMap(favoriteBrands) },
        { label: 'Organize Favorites…', disabled: !favorites.length, run: () => setExplorerDialog('favorites') },
        ...favorites.map((item, i) => ({ key: `${item.kind}:${item.id}`, label: recentLabel(item), separator: i === 0, disabled: !isVisibleItem(item), run: () => select(item, true) })),
      ];
      case 'Help': return [
        { label: 'Help Topics', shortcut: 'F1', run: () => openTool(HELP) },
        { label: 'About Designer Map', separator: true, run: () => setExplorerDialog('about') },
      ];
    }
  };
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
  /** Maximize / Restore one window; Spreadsheet's is its View ▸ Full Screen. */
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

  // Once the map is up, fetch the rest so windows and descriptions open at once.
  useEffect(() => whenIdle(() => { void preloadWindows(); void loadNotes().catch(() => {}); }), []);

  const mapHidden = mapWindow.state !== 'open';
  const icons = desktopShortcuts(openMap, (item) => changeDesk((d) => openItem(d, item)));
  return <FolderViewContext value={folderView}><FavoritesContext value={favoritesValue}><div className={`desktop${mapWindow.maximized ? ' map-maximized' : ''}`}><div className="desktop-area">
    <DesktopIcons icons={icons.map((icon) => ({ ...icon, icon: icon.icon(32) }))}
      desktopActions={[{ label: 'New Text Document', run: () => openTool(NOTEPAD) }, { label: 'Properties', run: () => openTool(SETTINGS) }]} />
    <MapWindowFrame onActivate={() => touch(MAP_KEY)} title="Explorer" icon={<img className="title-bar-icon" src={MAP_ICON} alt="" width={16} height={16} draggable={false} />}
      hidden={mapHidden} maximized={mapWindow.maximized} onToggleMaximize={toggleMaximized}
      onMinimize={() => setMapWindow((w) => ({ ...w, state: 'minimized' }))} onClose={() => setMapWindow((w) => ({ ...w, state: 'closed' }))}>
      <div className="window-body">
        <ExplorerMenu actions={explorerActions} />
        {showAddress && <form className="address-bar" role="search" onSubmit={(event) => { event.preventDefault(); goToAddress(); }}>
          <SearchBox items={availableSearchItems} value={address} onChange={setAddress} onPick={(item) => select(item.value, true)}
            label="Find on map" caption="Address" inputId="explorer-find" placeholder="Brand, designer or group" previewAll={false} exactFirst dropButton
            icon={<img src={MAP_ICON} alt="" width={16} height={16} draggable={false} />} />
          <button type="submit" className="address-go"><StartIcon name="go" size={16} className="address-go-icon" />Go</button>
        </form>}
        <div className="toolbar">
          <ActiveFilters value={filters} onChange={changeFilters} count={visibleHouses.length} total={houses.length} />
        </div>
        <div className="content">
          <MapView key={locationMode} graphRef={graph} connectionFilter={connectionFilter} onSelect={select} onExpandChange={onExpandChange} onShowMore={showMore} onOpenCity={openCity} />
        </div>
      </div>
      {showStatus && <div className="status-bar"><p className="status-bar-field" id="status-counts" role="status">{notice ?? `${houses.length} houses · ${designers.length} designers · ${moveCount} moves`}</p>
        <p className="status-bar-field" id="status-selection">{name ? `Selected: ${name}` : 'Nothing selected'}</p>
        <p className="status-bar-field" id="status-year">{year >= maxYear ? 'Showing all years' : `Up to ${year}`}</p>
      </div>}
    </MapWindowFrame>
    {desk.windows.map((w) => <PropertiesWindow key={w.key} id={w.key} titleId={`${w.key}-title`} bodyId={`${w.key}-body`}
      title={windowTitle(w.item)} cascade={w.slot} anchor={w.anchor} align={isPlace(w.item) || isTool(w.item) ? 'left' : 'right'} className={windowClass(w.item)}
      icon={isTool(w.item) && TITLE_ICONS.has(w.item.id) ? windowIcon(w.item, 16) : undefined}
      preferredSize={preferredSize(w.item, { visibleHouses, visibleIds, year: visibleYear, scale: textScale(textSize) })} minSize={minimumSize(w.item, textScale(textSize))}
      initialRect={session?.rects[w.key]} onRect={(rect) => { if (rect) rects.current[w.key] = rect; else delete rects.current[w.key]; }}
      fitHeight={isSelectionItem(w.item)}
      maximized={isMaximized(w)} onMaximize={() => maximize(w.key)}
      scrollKey={w.revision} minimized={w.minimized} active={desk.active === w.key} zIndex={zIndex(w.key)}
      onFocus={() => changeDesk((d) => focusWindow(d, w.key))} onMinimize={() => changeDesk((d) => minimizeWindow(d, w.key))}
      onClose={() => changeDesk((d) => closeWindow(d, w.key), w.item)}>
      {isPlace(w.item) ? <PlaceWindowContent place={w.item} visibleIds={visibleIds} onSelect={select}
        onShowOnMap={revealOnMap} onShowBrands={showBrandsOnMap} onOpenPlace={openPlace} onShowPlace={showPlaceOnMap}
        onHidePlace={hidePlaceOnMap} openCities={mapHidden ? undefined : openCities} />
        : isTool(w.item) ? w.item.id === 'stats' ? <StatisticsWindow visibleHouses={visibleHouses} year={visibleYear} filtered={!!matchingIds} onSelect={select} onOpenPlace={openPlace} />
          : w.item.id === 'recycle' ? <RecycleBinContent visibleHouses={visibleHouses} year={visibleYear} onSelect={select} onShowOnMap={revealOnMap} />
          : w.item.id === 'help' ? <HelpContent />
          : w.item.id === 'list' ? <SpreadsheetWindow onSelect={select} onOpenPlace={openPlace} onShowOnMap={revealSelection} onShowPlace={showPlaceOnMap} fullScreen={listFullScreen} onFullScreen={setListFullScreen} onHelp={() => changeDesk((d) => openItem(d, HELP))} onClose={() => closeKeys([w.key])} />
          : w.item.id === 'settings' ? <SettingsContent settings={{ mapTheme, textSize, cursorSize, locationMode, cityView, showLines, showCollaborations, connectionFilter, notepadFontSize, showPulses, motion, wallpaper, desktopColor, clock, folderView, startup }}
            onChange={{ mapTheme: setMapTheme, textSize: setTextSize, cursorSize: setCursorSize, locationMode: changeLocationMode, cityView: setCityView, showLines: setShowLines, showCollaborations: setShowCollaborations, connectionFilter: setConnectionFilter, notepadFontSize: setNotepadFontSize,
              showPulses: setShowPulses, motion: setMotion, wallpaper: setWallpaper, desktopColor: setDesktopColor, clock: setClock, folderView: setFolderView, startup: setStartup }}
            onClearRecent={() => setRecent([])} onResetPositions={resetPositions} onClearNote={() => clearSettings([NOTEPAD_KEY])} />
          : w.item.id === 'run' ? <RunContent items={runItems} onRun={run} onBrowse={() => openTool(MY_COMPUTER)} onClose={() => closeKeys([w.key])} />
          : w.item.id === 'computer' ? <MyComputerWindow visibleHouses={visibleHouses} onSelect={select} onShowOnMap={revealSelection}
            onOpenPlace={openPlace} onShowPlace={showPlaceOnMap} onOpenSettings={() => openTool(SETTINGS)} />
          : w.item.id === 'notepad' ? <NotepadWindow clock={clock} fontSize={notepadFontSize} onFontSize={setNotepadFontSize} onClose={() => closeKeys([w.key])} onHelp={() => openTool(HELP)} />
          : <MissingReportContent onSelect={select} />
        : <PanelContent key={`${w.revision}:${filterKey}`} selection={w.item} year={visibleYear} onSelect={select} onTag={addTag} onOpenPlace={openPlace} onShowOnMap={revealSelection}
          onHideOnMap={hideSelection} shownOnMap={!mapHidden && sameItem(selection, w.item)} onCopyLink={copyLink} />}
    </PropertiesWindow>)}
    {/* Explorer always sits under the other windows, so its dialogs open over all of them. */}
    {explorerDialog && <div className="explorer-dialogs">
      {explorerDialog === 'favorites' && <Dialog title="Organize Favorites" message submitLabel="Close" onSubmit={() => setExplorerDialog(null)} onCancel={() => setExplorerDialog(null)}>
        {favorites.length ? <ul className="sunken-panel favorites-list">{favorites.map((item) => <li key={`${item.kind}:${item.id}`}>
          <span>{recentLabel(item)}</span><button type="button" aria-label={`Remove ${recentLabel(item)}`} onClick={() => favoritesValue.set([item], false)}>Remove</button>
        </li>)}</ul> : <p>You have no favorites.</p>}
      </Dialog>}
      {explorerDialog === 'filters' && <FilterDialog value={filters} count={visibleHouses.length} total={houses.length} onChange={changeFilters} onClose={() => setExplorerDialog(null)} />}
      {explorerDialog === 'picture' && <SaveAsDialog defaultName={name ? `Designer Map - ${name}` : 'Designer Map'} extension="png" typeLabel="Portable Network Graphics (*.png)"
        onCancel={() => setExplorerDialog(null)} onSave={(fileName) => { setExplorerDialog(null); void savePicture(fileName); }} />}
      {explorerDialog === 'about' && <Dialog title="About Designer Map" message onSubmit={() => setExplorerDialog(null)} onCancel={() => setExplorerDialog(null)}>
        <p><b>Designer Map</b></p><p>A world map of fashion houses and the creative directors who move between them.</p>
        <p>{houses.length.toLocaleString()} houses, {designers.length.toLocaleString()} designers and {moveCount.toLocaleString()} moves.</p>
      </Dialog>}
    </div>}
  </div><div className="taskbar"><StartMenu>{(close) => <StartMenuItems close={close} settings={settings} recent={recent} canOpen={isVisibleItem} onOpenRecent={openRecent} onClearRecent={() => setRecent([])}
      connectionFilter={connectionFilter} onConnectionFilter={setConnectionFilter} filters={filters} onFilters={changeFilters}
      allExpanded={allExpanded} onToggleExpanded={() => graph.current?.setAllExpanded(!graph.current.allExpanded)} onOpen={openTool} onReset={resetView} />}</StartMenu>
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
    {([['Brands', 'brand'], ['Designers', 'designer'], ['Locations', 'place'], ['Statistics', 'stats'], ['Spreadsheet', 'list'], ['Recycle Bin', 'recycle'], ["What's Missing", 'missing'], ['Settings', 'settings'], ['My Computer', 'computer'], ['Notepad', 'notepad'], ['Help', 'help'], ['Run', 'run']] as const).map(([label, type]) => <TaskGroup key={label} label={label} active={desk.active}
      onToggle={toggle} onShow={show} onClose={(key) => closeKeys([key])} windowActions={windowActions} groupActions={groupActions} tasks={desk.windows.filter((w) => windowType(w.item) === type)
        .map((w) => ({ key: w.key, title: windowTitle(w.item), minimized: w.minimized, controls: w.key }))} />)}<YearTray clock={clock} year={year} minYear={minYear} maxYear={maxYear} playing={playFrom !== null} onYear={setYear}
      onPlay={() => setPlayFrom((current) => current === null ? year >= maxYear ? minYear : year : null)} />
  </div>{switcher && <TaskSwitcher list={switcher.list} index={switcher.index} />}</div></FavoritesContext></FolderViewContext>;
}
