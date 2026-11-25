import { readJson } from '../storage';

/** Where the layout is remembered (the old name, so nobody's layout is lost). Kept apart from layout.ts so the desktop can read it without downloading the sheets. */
export const LAYOUT_KEY = 'designer-map:list-view';
/** Whether the window opens in View ▸ Full Screen. */
export const readFullScreen = () => (readJson(LAYOUT_KEY) as { fullScreen?: unknown } | null | undefined)?.fullScreen === true;
