import { describe, expect, it, vi } from 'vitest';
import type { Collaboration, CollaborationData } from '../types';
import type { HouseId } from './houses';

// Synthetic projects exercise multiple participants and repeat partnerships.
vi.mock('./collaborations', () => ({
  collaborations: {
    laterRelease: { houses: ['nike', 'stussy'], year: 2025 },
    threeBrandProject: { houses: ['nike', 'stussy', 'dior'], year: 2023 },
    earlierRelease: { houses: ['nike', 'stussy'], year: 2024 },
  },
}));

import { collaborations, collaborationsInYear, collaborationsOf, getCollaboration, movesOf } from './index';
import { validateCollaborations, validateData } from './validate';

describe('brand collaborations', () => {
  it('keeps each project intact for all participants and sorts releases by year', () => {
    expect(collaborations.map((project) => project.id)).toEqual([
      'threeBrandProject', 'earlierRelease', 'laterRelease',
    ]);
    expect(collaborationsOf('dior')).toEqual([getCollaboration('threeBrandProject')]);
    expect(getCollaboration('threeBrandProject')?.houses).toEqual(['nike', 'stussy', 'dior']);
    expect(collaborationsOf('nike')).toEqual(collaborationsOf('stussy'));
  });

  it('filters by brand and/or release year without merging repeat partnerships', () => {
    expect(collaborationsOf('nike', 2024).map((project) => project.id)).toEqual(['earlierRelease']);
    expect(collaborationsInYear(2025).map((project) => project.id)).toEqual(['laterRelease']);
    expect(collaborationsOf('dior', 2024)).toEqual([]);
    expect(collaborationsInYear(1900)).toEqual([]);
    expect(collaborationsOf('unknown')).toEqual([]);
    expect(getCollaboration('unknown')).toBeUndefined();
    expect(getCollaboration('__proto__')).toBeUndefined();
  });

  it('validates the dataset without turning projects into designer careers', () => {
    expect(validateData()).toEqual([]);
    expect(validateCollaborations([])).toEqual([]);
    expect(movesOf('alexJamesPleasures')).toEqual([]);
    for (const project of collaborations) {
      expect(movesOf(project.id)).toEqual([]);
    }
  });

  it('rejects too few or duplicate participants at runtime and too few at compile time', () => {
    const oneBrand: CollaborationData<HouseId> = {
      // @ts-expect-error A collaboration requires at least two house IDs.
      houses: ['nike'], year: 2024,
    };
    expect(validateCollaborations([{ id: 'oneBrand', ...oneBrand }])).toContain(
      'oneBrand: collaboration needs at least two houses',
    );
    expect(validateCollaborations([{ id: 'duplicate', houses: ['nike', 'nike'], year: 2024 }])).toContain(
      'duplicate: duplicate collaboration houses',
    );
  });

  it('rejects unknown participants at compile time and runtime', () => {
    const badHouse: CollaborationData<HouseId> = {
      // @ts-expect-error Participants must be existing keys from houses.ts.
      houses: ['nike', 'notAHouse'], year: 2024,
    };
    expect(validateCollaborations([{ id: 'badHouse', ...badHouse }])).toContain(
      'badHouse: unknown collaboration house notAHouse',
    );
  });

  it.each([0, -2024, 2024.5, NaN, Infinity])('rejects invalid release year %s', (year) => {
    const project: Collaboration = { id: 'invalidYear', houses: ['nike', 'stussy'], year };
    expect(validateCollaborations([project])).toContain(
      'invalidYear: collaboration year must be a positive integer',
    );
  });
});
