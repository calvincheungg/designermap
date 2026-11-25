import { useCallback, useEffect, useLayoutEffect, useState, type RefObject } from 'react';
import type { DesignerGraph } from '../graph/graph';
import { setLocationMode, type LocationMode } from '../graph/locations';
import { MOTION_PREFERENCES, REDUCED_MOTION_QUERY, reducedMotion, setMotionPreference, type MotionPreference } from '../motion';
import { CLOCK_FORMATS, type ClockFormat } from './clock';
import type { FolderViewPreference } from './folder-view';
import { STARTUP_KEY, type Startup } from './session';
import { useMediaQuery } from './use-media-query';
import { DEFAULT_SETTINGS, DESKTOP_COLORS, WALLPAPERS, isCursorSize, isNotepadFontSize, isTextSize, textScale, type CityView, type CursorSize, type DesktopColor, type MapTheme, type TextSize, type Wallpaper } from './settings';
import { oneOf, readText, useSetting, useSwitch, writeSetting } from './storage';

const LINES_KEY = 'designer-map:show-lines';
const COLLABORATIONS_KEY = 'designer-map:show-collaborations';
const LOCATION_KEY = 'designer-map:location-mode';
const CITY_VIEW_KEY = 'designer-map:city-view';
const MAP_THEME_KEY = 'designer-map:map-theme';
const TEXT_SIZE_KEY = 'designer-map:text-size';
const CURSOR_SIZE_KEY = 'designer-map:cursor-size';
const NOTEPAD_FONT_KEY = 'designer-map:notepad-font-size';

/** The Settings window's choices and Start ▸ Connection lines, remembered in this browser. */
export function useSettings() {
  const [showLines, setShowLines] = useSwitch(LINES_KEY);
  const [showCollaborations, setShowCollaborations] = useSwitch(COLLABORATIONS_KEY);
  const [mapTheme, setMapTheme] = useSetting<MapTheme>(MAP_THEME_KEY, oneOf(['day', 'night', 'auto']), 'day');
  const [textSize, setTextSize] = useSetting<TextSize>(TEXT_SIZE_KEY, (stored) => isTextSize(stored) ? stored : undefined, 'normal');
  const [cursorSize, setCursorSize] = useSetting<CursorSize>(CURSOR_SIZE_KEY, (stored) => isCursorSize(stored) ? stored : undefined, 'normal');
  const [notepadFontSize, setNotepadFontSize] = useSetting<number>(NOTEPAD_FONT_KEY, (stored) => isNotepadFontSize(Number(stored)) ? Number(stored) : undefined, DEFAULT_SETTINGS.notepadFontSize);
  const [cityView, setCityView] = useSetting<CityView>(CITY_VIEW_KEY, oneOf(['window', 'map']), 'window');
  const [showPulses, setShowPulses] = useSwitch('designer-map:show-pulses');
  const [motion, setMotion] = useSetting<MotionPreference>('designer-map:motion', oneOf(MOTION_PREFERENCES), DEFAULT_SETTINGS.motion);
  const [wallpaper, setWallpaper] = useSetting<Wallpaper>('designer-map:wallpaper', oneOf(WALLPAPERS.map(([id]) => id)), DEFAULT_SETTINGS.wallpaper);
  const [desktopColor, setDesktopColor] = useSetting<DesktopColor>('designer-map:desktop-color', oneOf(DESKTOP_COLORS.map(([id]) => id)), DEFAULT_SETTINGS.desktopColor);
  const [clock, setClock] = useSetting<ClockFormat>('designer-map:clock', oneOf(CLOCK_FORMATS.map(([id]) => id)), DEFAULT_SETTINGS.clock);
  const [folderView, setFolderView] = useSetting<FolderViewPreference>('designer-map:folder-view', oneOf(['last', 'icons', 'details']), DEFAULT_SETTINGS.folderView);
  const [startup, setStartup] = useSetting<Startup>(STARTUP_KEY, oneOf(['fresh', 'restore']), DEFAULT_SETTINGS.startup);
  const [locationMode, setMode] = useState<LocationMode>(() => {
    const mode = readText(LOCATION_KEY) === 'origin' ? 'origin' : 'current';
    setLocationMode(mode);
    return mode;
  });
  const changeLocationMode = useCallback((mode: LocationMode) => {
    // The graph is rebuilt for the new layout (MapView is keyed by mode), so set this first.
    setLocationMode(mode);
    setMode(mode);
    writeSetting(LOCATION_KEY, mode);
  }, []);
  return {
    showLines, setShowLines, showCollaborations, setShowCollaborations, mapTheme, setMapTheme, textSize, setTextSize, cursorSize, setCursorSize,
    notepadFontSize, setNotepadFontSize, cityView, setCityView, locationMode, setLocationMode: changeLocationMode,
    showPulses, setShowPulses, motion, setMotion, wallpaper, setWallpaper, desktopColor, setDesktopColor, clock, setClock, folderView, setFolderView, startup, setStartup,
  };
}

/** Apply the settings to the graph and the page. Changing locationMode rebuilds the graph, so each also reruns for the new one. */
export function useSyncSettings(graph: RefObject<DesignerGraph | null>, { showLines, showCollaborations, mapTheme, textSize, cursorSize, locationMode, showPulses, motion, wallpaper, desktopColor }: ReturnType<typeof useSettings>) {
  const systemDark = useMediaQuery('(prefers-color-scheme: dark)');
  const systemReduced = useMediaQuery(REDUCED_MOTION_QUERY);
  const night = mapTheme === 'night' || mapTheme === 'auto' && systemDark;
  useLayoutEffect(() => {
    setMotionPreference(motion);
    if (reducedMotion()) document.documentElement.dataset.motion = 'reduced';
    else delete document.documentElement.dataset.motion;
  }, [motion, systemReduced]);
  useEffect(() => { graph.current?.setPulses(showPulses); }, [graph, showPulses, motion, systemReduced, locationMode]);
  useLayoutEffect(() => {
    document.documentElement.dataset.wallpaper = wallpaper;
    document.documentElement.dataset.desktopColor = desktopColor;
  }, [wallpaper, desktopColor]);
  useEffect(() => { graph.current?.setShowMoves(showLines); }, [graph, showLines, locationMode]);
  useEffect(() => { graph.current?.setShowCollaborations(showCollaborations); }, [graph, showCollaborations, locationMode]);
  useLayoutEffect(() => {
    graph.current?.setNight(night);
    // Night mode darkens the window chrome too (scripts/night-chrome.mjs derives those styles).
    if (night) document.documentElement.dataset.theme = 'night';
    else delete document.documentElement.dataset.theme;
  }, [graph, night, locationMode]);
  useLayoutEffect(() => {
    graph.current?.setTextScale(textScale(textSize));
    document.documentElement.style.setProperty('--text-zoom', String(textScale(textSize)));
  }, [graph, textSize, locationMode]);
  useLayoutEffect(() => {
    if (cursorSize === 'normal') delete document.documentElement.dataset.cursorSize;
    else document.documentElement.dataset.cursorSize = cursorSize;
  }, [cursorSize]);
}
