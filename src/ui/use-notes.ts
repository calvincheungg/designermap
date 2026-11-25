import { useEffect, useState } from 'react';

type Notes = typeof import('../data/notes').notes;
let loaded: Notes | undefined;
let pending: Promise<Notes> | undefined;
/** Fetch the descriptions (see data/notes.ts). A failure is tried again next time. */
export const loadNotes = (): Promise<Notes> => pending ??= import('../data/notes').then((m) => loaded = m.notes, (error: unknown) => { pending = undefined; throw error; });

/** A brand's or designer's description: on its record in development, downloaded separately in production. */
export function useNotes(kind: keyof Notes, id: string, onRecord: string | undefined): string | undefined {
  const [, redraw] = useState(0);
  const waiting = onRecord === undefined && !loaded;
  useEffect(() => {
    if (!waiting) return;
    let open = true;
    loadNotes().then(() => { if (open) redraw((n) => n + 1); }, () => { /* no description this time */ });
    return () => { open = false; };
  }, [waiting]);
  return onRecord ?? (loaded && Object.hasOwn(loaded[kind], id) ? loaded[kind][id] : undefined);
}
