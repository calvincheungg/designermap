import { describe, expect, it } from 'vitest';
import { houses } from './houses';
import { collabSearches, type CollabSearch } from './research-log';

const entries = Object.entries(collabSearches) as [string, CollabSearch][];

describe('collaboration research log', () => {
  it('records real dates, in order, for existing houses', () => {
    const today = new Date().toISOString().slice(0, 10);
    for (const [id, entry] of entries) {
      expect(houses, id).toHaveProperty(id);
      expect(entry.date, id).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(Number.isNaN(Date.parse(entry.date)), id).toBe(false);
      expect(entry.date <= today, id).toBe(true);
      if (entry.lastPage !== undefined) expect(entry.lastPage, id).toBeGreaterThan(0);
      if (entry.oldestYear !== undefined) expect(entry.oldestYear, id).toBeLessThanOrEqual(Number(entry.date.slice(0, 4)));
    }
    const ids = entries.map(([id]) => id);
    expect(ids).toEqual([...ids].sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase())));
  });
});
