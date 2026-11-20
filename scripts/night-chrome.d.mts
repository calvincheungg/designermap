import type { Plugin } from 'vite';

export const NIGHT: string;
export const CHROME_FILE: RegExp;
export function nightSelector(selector: string): string;
export function addNightChrome(css: string): string;
export function nightChromePlugin(): Plugin;
