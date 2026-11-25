import type { Plugin } from 'vite';

export function splitNotes(code: string, name: string): { code: string; notes: Record<string, string> };
export function splitNotesPlugin(): Plugin;
