import { lazyWindow } from './lazy-window';

/** The larger tool windows, each downloaded separately. */
export const SpreadsheetWindow = lazyWindow(() => import('./spreadsheet/spreadsheet').then((m) => m.SpreadsheetContent));
export const StatisticsWindow = lazyWindow(() => import('./statistics').then((m) => m.StatisticsContent));
export const MyComputerWindow = lazyWindow(() => import('./my-computer').then((m) => m.MyComputerContent));
export const NotepadWindow = lazyWindow(() => import('./notepad').then((m) => m.NotepadContent));
