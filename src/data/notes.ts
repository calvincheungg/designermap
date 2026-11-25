/**
 * Brand and designer descriptions, by id. Empty in development and tests, where
 * `notes` stay on the records. Production builds move them here, into their own
 * download (scripts/split-notes.mjs), since only Properties shows them.
 */
export const notes: { houses: Readonly<Record<string, string>>; designers: Readonly<Record<string, string>> } = { houses: {}, designers: {} };
