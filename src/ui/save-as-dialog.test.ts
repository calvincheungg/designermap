import { describe, expect, it } from 'vitest';
import { cleanFileName } from './save-as-dialog';

describe('Save As file names', () => {
  it('drops characters Windows forbids and a typed copy of the locked extension', () => {
    expect(cleanFileName('  Designer Map - Brands  ', 'csv')).toBe('Designer Map - Brands');
    expect(cleanFileName('notes.TXT', 'txt')).toBe('notes');
    expect(cleanFileName('a/b:c*?"<>|d', 'txt')).toBe('abcd');
    expect(cleanFileName('report.csv', 'txt')).toBe('report.csv');
    expect(cleanFileName('  .txt ', 'txt')).toBe('');
  });
});
