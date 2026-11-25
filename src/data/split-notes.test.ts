import { describe, expect, it } from 'vitest';
import { splitNotes } from '../../scripts/split-notes.mjs';
import { designers, houses } from './index';
import designersSource from './designers.ts?raw';
import housesSource from './houses.ts?raw';

describe('production description split', () => {
  it.each([['houses', housesSource, houses], ['designers', designersSource, designers]] as const)('moves every description out of %s.ts, unchanged', (name, source, records) => {
    const { code, notes } = splitNotes(source!, name);
    expect(notes).toEqual(Object.fromEntries(records.flatMap((record) => record.notes === undefined ? [] : [[record.id, record.notes]])));
    // Nothing is left to move, and what's left still parses.
    expect(splitNotes(code, name).notes).toEqual({});
  });

  it('leaves nested notes and anything that is not plain text', () => {
    const code = `export const houses = { a: { notes: 'one' + " two", history: [{ notes: 'kept' }] }, 'b': { notes: SHARED, x: 1 } } satisfies X;`;
    const split = splitNotes(code, 'houses');
    expect(split.notes).toEqual({ a: 'one two' });
    expect(split.code).toContain(`notes: 'kept'`);
    expect(split.code).toContain('notes: SHARED');
    expect(split.code).not.toContain('one');
  });
});
