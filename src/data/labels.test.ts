import { describe, expect, it } from 'vitest';
import { getHouse, labelsOf, parentHouseOf } from './index';
import { missingOrigins, validateData } from './validate';

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

describe('missing origin research hints', () => {
  const thomasMason = getHouse('thomasMason')!;
  it('flags notes that name a different founding place when origin is absent', () => {
    const { origin: _origin, history: _history, ...withoutOrigin } = thomasMason;
    expect(missingOrigins([withoutOrigin])).toEqual([
      'Thomas Mason: notes say founded in Lancashire, but no origin is recorded (base Albino)',
    ]);
  });
  it('accepts recorded origins and ignores places named for other reasons', () => {
    expect(missingOrigins([thomasMason])).toEqual([]);
    expect(missingOrigins([{ ...thomasMason, origin: undefined, notes: 'Tokyo label founded by a designer after training in London.' }])).toEqual([]);
  });
});
