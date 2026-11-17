import type { Plugin } from 'vite';

export const DATA_FILE: RegExp;
export const SOURCES_KEY: RegExp;
export function stripSources(code: string): { code: string; removed: number };
export function stripSourcesPlugin(): Plugin;
