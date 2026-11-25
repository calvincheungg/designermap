import type { House } from '../types';
import { getHouse } from '../data';
import { BrandIcon, cityWindowSize, placeTileCount, placeTitle } from './city-window';
import { isPlace, isTool, LIST_VIEW, MY_COMPUTER, NOTEPAD, SETTINGS, STATISTICS, tool, type Item } from './desktop';
import { panelTitle } from './panel';
import { StartIcon } from './start-icons';
import { endedBrands, recycleBinSize } from './tool-windows';
import { FOLDER_ICON, MY_COMPUTER_ICON } from './window-icons';

/** How each kind of desktop window looks: its title, icon, size and class; and the desktop's shortcuts. */

/** Place windows hold a fixed grid of icons, so they grow with the text size. */
const scaleSize = (size: { width: number; height: number }, scale: number) => scale === 1 ? size
  : { width: Math.round(size.width * scale), height: Math.round(size.height * scale) };
/** Tool windows' opening sizes: Statistics is wider than Properties so its bar tables have room. */
const TOOL_SIZES = { stats: { width: 560, height: 640 }, recycle: { width: 380, height: 480 }, missing: { width: 420, height: 560 }, help: { width: 440, height: 560 }, run: { width: 400, height: 240 }, list: { width: 820, height: 560 }, settings: { width: 430, height: 500 }, computer: { width: 520, height: 440 }, notepad: { width: 460, height: 380 } } as const;
/** Run is a small dialog-like window, so it may be smaller than the Properties minimum. */
const RUN_MIN_SIZE = { width: 320, height: 200 };
// Desktop icon positions on the desktop area (the old keys held positions inside the map window).
const RECYCLE_BIN_KEY = 'designer-map:desktop-icon:recycle-bin';
const STATISTICS_ICON_KEY = 'designer-map:desktop-icon:statistics';
const LIST_VIEW_ICON_KEY = 'designer-map:desktop-icon:list-view';
export const LIST_VIEW_ICON = '/assets/excel.webp';
const SETTINGS_ICON_KEY = 'designer-map:desktop-icon:settings';
export const SETTINGS_ICON = '/assets/settings.webp';
const MY_COMPUTER_ICON_KEY = 'designer-map:desktop-icon:my-computer';
const NOTEPAD_ICON_KEY = 'designer-map:desktop-icon:notepad';
export const NOTEPAD_ICON = '/assets/notepad.webp';
/** Win98's Help book, cut from help.jpeg (its checkerboard background made transparent). */
export const HELP_ICON = '/assets/help.webp';
/** Notepad is small and may be narrower than the Properties minimum. */
const NOTEPAD_MIN_SIZE = { width: 240, height: 160 };
export const MAP_ICON = '/assets/ie4.webp';
/** Spreadsheet's sheet needs room for its menu bar, formula bar and a few columns. */
const LIST_MIN_SIZE = { width: 360, height: 260 };
const MAP_ICON_KEY = 'designer-map:desktop-icon:explorer';

/** Place windows are titled with the city or country, like an Explorer folder; others as Properties. */
const TOOL_TITLES = { stats: 'Statistics', recycle: 'Recycle Bin', missing: "What's Missing", help: 'Help', run: 'Run', list: 'Spreadsheet - Designer Map.xls', settings: 'Settings', computer: 'My Computer', notepad: 'Untitled - Notepad' } as const;
export const image = (src: string, size: number, className?: string) => <img className={className} src={src} alt="" width={size} height={size} draggable={false} />;
/** A window's icon (Alt+Tab, title bars): the brand's logo, or a Win98 icon for its kind. */
export function windowIcon(item: Item, size: number) {
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
export const TITLE_ICONS: ReadonlySet<string> = new Set(['list', 'settings', 'computer', 'notepad', 'help']);
export const windowTitle = (item: Item) => isPlace(item) ? placeTitle(item) : isTool(item) ? TOOL_TITLES[item.id] : panelTitle(item);

/** The desktop's shortcuts, shown as icons on the desktop and as Quick Launch buttons beside Start. */
export function desktopShortcuts(openMap: () => void, open: (item: Item) => void) {
  const picture = (src: string, className?: string) => (size: number) => image(src, size, className);
  const pixel = (name: 'chart') => (size: number) => <StartIcon name={name} size={size} />;
  return [
    { label: 'My Computer', type: 'system' as const, icon: picture(MY_COMPUTER_ICON, 'smooth-icon'), storageKey: MY_COMPUTER_ICON_KEY, open: () => open(MY_COMPUTER) },
    { label: 'Explorer', type: 'system' as const, icon: picture(MAP_ICON, 'browser-icon'), storageKey: MAP_ICON_KEY, open: openMap },
    { label: 'Recycle Bin', type: 'system' as const, icon: picture('/assets/bin.webp'), storageKey: RECYCLE_BIN_KEY, open: () => open(tool('recycle')) },
    { label: 'Statistics', icon: pixel('chart'), storageKey: STATISTICS_ICON_KEY, open: () => open(STATISTICS) },
    { label: 'Spreadsheet', icon: picture(LIST_VIEW_ICON, 'xl-icon'), storageKey: LIST_VIEW_ICON_KEY, open: () => open(LIST_VIEW) },
    { label: 'Settings', icon: picture(SETTINGS_ICON), storageKey: SETTINGS_ICON_KEY, open: () => open(SETTINGS) },
    { label: 'Notepad', icon: picture(NOTEPAD_ICON), storageKey: NOTEPAD_ICON_KEY, open: () => open(NOTEPAD) },
  ];
}

/** What window sizes depend on: the brands shown (place windows and the Recycle Bin fit their icons) and the text size. */
interface Shown { visibleHouses: readonly House[]; visibleIds: ReadonlySet<string>; year: number; scale: number }
export function preferredSize(item: Item, { visibleHouses, visibleIds, year, scale }: Shown) {
  if (isPlace(item)) return scaleSize(cityWindowSize(placeTileCount(item, visibleIds)), scale);
  if (!isTool(item)) return undefined;
  return item.id === 'recycle' ? scaleSize(recycleBinSize(endedBrands(visibleHouses, year).length), scale) : TOOL_SIZES[item.id];
}
export function minimumSize(item: Item, scale: number) {
  if (isPlace(item)) return scaleSize(cityWindowSize(1), scale);
  if (!isTool(item)) return undefined;
  switch (item.id) {
    case 'recycle': return scaleSize(recycleBinSize(1), scale);
    case 'run': return RUN_MIN_SIZE;
    case 'list': return LIST_MIN_SIZE;
    case 'notepad': return NOTEPAD_MIN_SIZE;
    default: return undefined;
  }
}
const TOOL_CLASSES: Partial<Record<string, string>> = { recycle: 'city-window recycle-window', run: 'run-window', list: 'list-window', computer: 'city-window computer-window', notepad: 'notepad-window' };
export const windowClass = (item: Item) => isPlace(item) ? 'city-window' : isTool(item) ? TOOL_CLASSES[item.id] : undefined;
