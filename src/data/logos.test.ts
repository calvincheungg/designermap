import { describe, expect, it } from 'vitest';
import logoAssets from '../graph/logo-assets.json';
import { houses } from './index';

/**
 * `npm test` refreshes the manifest first (`pretest` runs logos:prepare), which
 * only records logos that sharp could decode. A missing entry means the file is
 * missing, or isn't really the format its extension claims (e.g. JPEG XL saved
 * as .png), and browsers would fall back to the initials icon.
 */
describe('logos', () => {
  const manifest: Record<string, unknown> = logoAssets;
  const local = houses.filter((house) => house.logo && !/^https?:\/\//.test(house.logo));

  it('points every local logo at a file in public/logos', () => {
    const files = new Set(Object.keys(import.meta.glob('../../public/logos/*')).map((path) => path.split('/').pop()));
    const missing = local.filter((house) => !files.has(house.logo));
    expect(missing.map((house) => `${house.id}: ${house.logo}`)).toEqual([]);
  });

  it('only uses logos the browser can decode', () => {
    const unreadable = local.filter((house) => !manifest[house.logo!]);
    expect(unreadable.map((house) => `${house.id}: ${house.logo}`)).toEqual([]);
  });
});
