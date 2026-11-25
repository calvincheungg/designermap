import { collaborations, collectionTags, designers, getDesigner, getGroup, getHouse, houses, marketPositionings } from './index';
import type { Collaboration, House } from '../types';
import { cities, cityRegions, type CityName } from './cities';
import { CountryCode } from './countries';

/**
 * Sanity checks that types can't catch. House ids are already checked by the
 * compiler. Run with `npm test`; problems are also logged in the browser
 * console on startup.
 */
export function validateData(): string[] {
  const problems: string[] = [];
  const thisYear = new Date().getFullYear();

  for (const d of designers) {
    if (d.career.length === 0) problems.push(`${d.id}: has no career entries`);

    for (const t of d.career) {
      const where = `${d.id} @ ${t.house} (${t.start})`;
      if (t.start !== undefined) {
        if (typeof t.end === 'number' && t.end < t.start) problems.push(`${where}: end before start`);
        if (t.start > thisYear + 1) problems.push(`${where}: start year is in the future`);
        if (d.born && t.start < d.born + 14) problems.push(`${where}: starts before age 14`);
      }
      if (d.died && t.end === null) problems.push(`${where}: marked current but designer died ${d.died}`);
    }
  }

  for (const h of houses) {
    if (h.closed !== undefined) {
      if (!Number.isInteger(h.closed) || h.closed <= 0) problems.push(`${h.id}: closure year must be a positive integer`);
      if (h.founded !== undefined && h.closed < h.founded) problems.push(`${h.id}: closure before founding`);
    }
    if (h.country === CountryCode.UnitedStates || h.country === CountryCode.Canada) {
      const location = cityRegions[h.city as CityName];
      if (!location?.region || location.country !== h.country) problems.push(`${h.id}: city needs a matching state or province`);
    }
    const placeProblem = (city: string, country: CountryCode, what: string) => {
      if (!Object.hasOwn(cities, city)) problems.push(`${h.id}: ${what} city ${city} is not in cities.ts`);
      if (country === CountryCode.UnitedStates || country === CountryCode.Canada) {
        const location = cityRegions[city as CityName];
        if (!location?.region || location.country !== country) problems.push(`${h.id}: ${what} city needs a matching state or province`);
      }
    };
    if (h.origin) {
      if (h.origin.city === h.city) problems.push(`${h.id}: origin city matches current base`);
      placeProblem(h.origin.city, h.origin.country, 'origin');
    }
    const history = h.history ?? [];
    const moves = history.filter((event) => event.type === 'moved');
    if (h.origin && moves.at(-1)?.city !== h.city) problems.push(`${h.id}: history needs a final move to its current base ${h.city}`);
    if (!h.origin && moves.length) problems.push(`${h.id}: moves need an origin city`);
    let previousYear = -Infinity;
    for (const event of history) {
      if (event.year !== undefined) {
        if (!Number.isInteger(event.year) || event.year > thisYear) problems.push(`${h.id}: invalid ${event.type} year ${event.year}`);
        if (h.founded !== undefined && event.year < h.founded) problems.push(`${h.id}: ${event.type} ${event.year} before founding`);
        if (event.year < previousYear) problems.push(`${h.id}: history is not in date order at ${event.year}`);
        previousYear = event.year;
      }
      if (event.type === 'moved') placeProblem(event.city, event.country, 'moved-to');
      if (event.type === 'closed' && event.year === h.closed) problems.push(`${h.id}: current closure ${h.closed} belongs in \`closed\`, not history`);
      if ((event.type === 'acquired' || event.type === 'spunOff') && event.group && !getGroup(event.group)) problems.push(`${h.id}: unknown history group ${event.group}`);
      if (event.type === 'acquired' && !event.group && !event.buyer) problems.push(`${h.id}: acquisition needs a group or buyer`);
    }
    const owner = history.findLast((event) => event.type === 'acquired' || event.type === 'spunOff');
    if (owner && 'group' in owner && owner.group && h.parentGroup && owner.group !== h.parentGroup) {
      problems.push(`${h.id}: latest ownership change (${owner.group}) does not match parentGroup ${h.parentGroup}`);
    }
    for (const affiliation of h.regionalAffiliations ?? []) {
      if (!getGroup(affiliation.group)) problems.push(`${h.id}: unknown regional group ${affiliation.group}`);
      if (!affiliation.territory.trim()) problems.push(`${h.id}: regional relationship needs a territory`);
      if (!affiliation.sources.length) problems.push(`${h.id}: regional relationship needs sources`);
    }
    for (const id of h.founders ?? []) {
      if (!getDesigner(id)) problems.push(`${h.id}: unknown founder designer ${id}`);
    }
    if (new Set(h.founders).size !== (h.founders?.length ?? 0)) problems.push(`${h.id}: duplicate founder references`);
    if (h.founderHouse && !getHouse(h.founderHouse)) problems.push(`${h.id}: unknown founding house ${h.founderHouse}`);
    if (h.parentHouse && !getHouse(h.parentHouse)) problems.push(`${h.id}: unknown parent house ${h.parentHouse}`);
    const family = new Set([h.id]);
    let parent = h.parentHouse;
    while (parent) {
      if (family.has(parent)) {
        problems.push(`${h.id}: cyclic parent-house relationship`);
        break;
      }
      family.add(parent);
      parent = getHouse(parent)?.parentHouse;
    }
    if (h.founderGroup && !getGroup(h.founderGroup)) problems.push(`${h.id}: unknown founding group ${h.founderGroup}`);
    if (!marketPositionings.includes(h.tags.marketPositioning)) {
      problems.push(`${h.id}: choose a valid market positioning`);
    }
    if (h.tags.aesthetic.length < 1 || h.tags.aesthetic.length > 3) {
      problems.push(`${h.id}: choose 1–3 main aesthetics`);
    }
    if (h.tags.product.length < 1 || h.tags.product.length > 4) {
      problems.push(`${h.id}: choose 1–4 primary product tags`);
    }
    if (h.tags.collections.length < 1 || h.tags.collections.length > 2 || !h.tags.collections.every((tag) => collectionTags.includes(tag))) {
      problems.push(`${h.id}: choose 1–2 valid collections`);
    }
    for (const [group, tags] of Object.entries(h.tags)) {
      if (!Array.isArray(tags)) continue;
      if (new Set(tags).size !== tags.length) problems.push(`${h.id}: duplicate ${group} tags`);
    }
    if (typeof h.website !== 'string' || typeof h.instagram !== 'string') {
      problems.push(`${h.id}: set website and instagram, using '' when the brand has none`);
    }
    if (h.website && !/^https?:\/\/[^\s/]+\.[^\s]+$/.test(h.website)) {
      problems.push(`${h.id}: website should be a full URL like https://www.example.com`);
    }
    if (h.instagram && !/^[A-Za-z0-9._]{1,30}$/.test(h.instagram)) {
      problems.push(`${h.id}: instagram should be just the handle, without "@" or a URL (e.g. "loewe")`);
    }
    if (h.logo && !/^https?:\/\//.test(h.logo) && !/\.(svg|png|jpe?g|webp|gif|avif)$/i.test(h.logo)) {
      problems.push(`${h.id}: logo should be an image file in public/logos/ (e.g. "${h.id}.svg") or a full URL`);
    }
  }

  problems.push(...validateCollaborations());
  return problems;
}

/** Runtime checks also catch duplicate participants, which tuple types cannot. */
export function validateCollaborations(records: readonly Collaboration[] = collaborations): string[] {
  const problems: string[] = [];
  for (const collaboration of records) {
    const { id, houses: participants, year } = collaboration;
    if (participants.length < 2) problems.push(`${id}: collaboration needs at least two houses`);
    if (new Set(participants).size !== participants.length) problems.push(`${id}: duplicate collaboration houses`);
    for (const houseId of participants) {
      if (!getHouse(houseId)) problems.push(`${id}: unknown collaboration house ${houseId}`);
    }
    if (!Number.isInteger(year) || year < 1) problems.push(`${id}: collaboration year must be a positive integer`);
  }
  return problems;
}

/**
 * Houses with no founder of any kind: no founder profiles, no founding house, group
 * or organization, and nobody with a Founder role in their career.
 */
export function housesWithoutFounder(): House[] {
  const founded = new Set(designers.flatMap((d) => d.career.filter((t) => t.role === 'Founder').map((t) => t.house)));
  return houses.filter((h) => !h.founders?.length && !h.founderHouse && !h.founderGroup && !h.founderOrganization && !founded.has(h.id));
}

/** Houses with no founder yet: not an error, just research still to do. */
export function researchTodos(): string[] {
  const unfounded = housesWithoutFounder().map((h) => `${h.name}: no founder recorded yet`);
  return [...unfounded, ...missingOrigins()];
}

const FOUNDING_PLACE = /\b(?:founded|established|started|began|originated)\b[^.]{0,60}?\bin ([A-Z][\p{L}'’-]+(?:[ -](?:[A-Z][\p{L}'’-]+|sur|de|di|la|le))*)/gu;

/**
 * Houses whose description says they were founded in a known city or US/Canadian
 * state other than their base, with no `origin` recorded: likely relocations
 * still to research. A heuristic, so it lists candidates instead of failing tests.
 */
export function missingOrigins(list: readonly House[] = houses): string[] {
  return missingOriginCandidates(list).map(({ house: h, place }) => `${h.name}: notes say founded in ${place}, but no origin is recorded (base ${h.city})`);
}

/** The houses behind `missingOrigins`, with the founding place their notes name (for the What's Missing report). */
export function missingOriginCandidates(list: readonly House[] = houses): { house: House; place: string }[] {
  const places = new Set([...Object.keys(cities), ...Object.values(cityRegions).map((r) => r.region)]);
  return list.flatMap((h) => {
    if (h.origin || !h.notes) return [];
    const place = [...h.notes.matchAll(FOUNDING_PLACE)]
      // "after training in London" / "began showing in Paris" name other places.
      .filter((match) => !/\b(?:after|training|trained|studying|working|showing|selling|stocked)\b/.test(match[0]))
      .map((match) => match[1])
      .find((name): name is string => !!name && name !== h.city && places.has(name) && cityRegions[h.city as CityName]?.region !== name);
    return place ? [{ house: h, place }] : [];
  });
}
