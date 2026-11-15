import { describe, expect, it } from 'vitest';
import { getHouse, labelsOf, parentHouseOf } from './index';
import { validateData } from './validate';

describe('brand families', () => {
  it('resolves direct labels and their parents without flattening nested families or ownership', () => {
    expect(labelsOf('armani').map((h) => h.id)).toContain('emporioArmani');
    expect(labelsOf('armani').map((h) => h.id)).not.toContain('ea7');
    expect(parentHouseOf('ea7')?.id).toBe('emporioArmani');
    expect(parentHouseOf('emporioArmani')?.id).toBe('armani');
    expect(labelsOf('prada').map((h) => h.id)).not.toContain('miuMiu');
    expect(parentHouseOf('miuMiu')).toBeUndefined();
    expect(labelsOf('unknown')).toEqual([]);
    expect(parentHouseOf('unknown')).toBeUndefined();
  });

  it('rejects unknown parents, self-links and longer family cycles', () => {
    const parent = getHouse('armani')!;
    const original = parent.parentHouse;
    try {
      parent.parentHouse = 'missingHouse';
      expect(validateData()).toContain('armani: unknown parent house missingHouse');
      parent.parentHouse = 'armani';
      expect(validateData()).toContain('armani: cyclic parent-house relationship');
      parent.parentHouse = 'ea7';
      expect(validateData()).toContain('armani: cyclic parent-house relationship');
    } finally {
      if (original === undefined) delete parent.parentHouse;
      else parent.parentHouse = original;
    }
    expect(validateData()).toEqual([]);
  });
});
