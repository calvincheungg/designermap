import { houses, logoUrl } from '../data';
import type { House } from '../types';

/** The 16-colour VGA palette. Houses without a `color` get one by city. */
const VGA = ['#000080', '#800000', '#008000', '#808000', '#800080', '#008080', '#000000', '#808080'];
const cities = [...new Set(houses.map((h) => h.city))];

export const houseColor = (h: House) => h.color ?? VGA[cities.indexOf(h.city) % VGA.length]!;

const initials = (name: string) =>
  name
    .split(/[\s-]+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 3)
    .toUpperCase();

/**
 * A logo URL if the house has one, otherwise a bevelled Win98-style
 * "program icon" with the house's initials, as an SVG data URI.
 */
export function houseIcon(h: House): string {
  const url = logoUrl(h);
  if (url) return url;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" shape-rendering="crispEdges">
  <rect x="0" y="0" width="64" height="64" fill="#000"/>
  <rect x="0" y="0" width="63" height="63" fill="#fff"/>
  <rect x="1" y="1" width="62" height="62" fill="#808080"/>
  <rect x="1" y="1" width="61" height="61" fill="#dfdfdf"/>
  <rect x="4" y="4" width="56" height="56" fill="${houseColor(h)}"/>
  <text x="32" y="41" text-anchor="middle" font-family="Times New Roman, serif" font-weight="bold"
        font-size="${initials(h.name).length > 2 ? 18 : 24}" fill="#fff">${initials(h.name)}</text>
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
