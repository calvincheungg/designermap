import { describe, expect, it } from 'vitest';
import { SOURCES_KEY, stripSources } from '../../scripts/strip-sources.mjs';
import collaborationsSource from './collaborations.ts?raw';
import designersSource from './designers.ts?raw';
import housesSource from './houses.ts?raw';

const squash = (text: string) => text.replace(/\s/g, '');

describe('production source stripping', () => {
  const files = [['houses', housesSource], ['designers', designersSource], ['collaborations', collaborationsSource]];
  it.each(files)('removes every sources array from %s.ts', (_name, code) => {
    const { code: stripped, removed } = stripSources(code!);
    // Every occurrence is a plain string array the transform understands.
    expect(removed).toBe(code!.match(SOURCES_KEY)?.length ?? 0);
    expect(stripped.match(SOURCES_KEY)).toBeNull();
  });

  it('keeps the fields around each array, including quotes and multi-line arrays', () => {
    const { code, removed } = stripSources(`{ house: 'x', sources: ['https://a.com/it\\'s', "https://b.com"], end: null }
{
  year: 2020,
  sources: [
    'https://c.com',
  ],
}`);
    expect(removed).toBe(2);
    expect(squash(code)).toBe(squash(`{ house: 'x', end: null } { year: 2020, }`));
    expect(stripSources(`{ "notes": "n", "sources": [ "https://d.com" ] }`).code.replace(/\s/g, '')).toBe('{"notes":"n",}');
  });

  it('leaves anything other than a plain string array alone', () => {
    const input = `{ sources: SHARED_SOURCES, notes: 'sources: [x]' }`;
    expect(stripSources(input)).toEqual({ code: input, removed: 0 });
  });
});
