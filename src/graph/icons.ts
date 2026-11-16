import { houses, logoUrl } from '../data';
import type { House } from '../types';
import logoAssets from './logo-assets.json';

/** The 16-colour VGA palette. Houses without a `color` get one by city. */
const VGA = [
  '#000080', '#800000', '#008000', '#808000', '#800080', '#008080', '#000000', '#808080',
  '#0000ff', '#ff0000', '#ff00ff',
];
const cities = [...new Set(houses.map((h) => h.city))];

export const houseColor = (h: House) => h.color ?? VGA[cities.indexOf(h.city) % VGA.length]!;

/**
 * Turn generated SVG markup into a short image URL, created once per distinct icon.
 *
 * Cytoscape hashes every style value, character by character, each time an
 * element is restyled (hover, fade, collapse, zoom). A multi-KB `data:` URI per
 * node made every restyle slow; a `blob:` URL is ~60 characters.
 */
const svgUrls = new Map<string, string>();
function svgUrl(svg: string): string {
  let url = svgUrls.get(svg);
  if (!url) {
    url =
      typeof URL.createObjectURL === 'function'
        ? URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }))
        : `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
    svgUrls.set(svg, url);
  }
  return url;
}

const initials = (name: string) =>
  name
    .split(/[\s-]+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 3)
    .toUpperCase();

/* ---------- City map pin (pixel art) ---------- */

/** Pin size in art pixels; the pointer's tip is the bottom-centre pixel. */
export const PIN_W = 13;
export const PIN_H = 14;

/** 3×5 bitmap digits, drawn pixel by pixel so the count looks like a 1998 system font. */
const DIGITS: Record<string, string[]> = {
  '0': ['111', '101', '101', '101', '111'],
  '1': ['010', '110', '010', '010', '111'],
  '2': ['111', '001', '111', '100', '111'],
  '3': ['111', '001', '011', '001', '111'],
  '4': ['101', '101', '111', '001', '001'],
  '5': ['111', '100', '111', '001', '111'],
  '6': ['111', '100', '111', '101', '111'],
  '7': ['111', '001', '010', '010', '010'],
  '8': ['111', '101', '111', '101', '111'],
  '9': ['111', '101', '111', '001', '111'],
};

/**
 * Map pin with the number of houses in the city: a bevelled Win98 button
 * badge with a pixel pointer underneath. Raised grey when collapsed; pressed
 * navy with white digits when expanded. Regional clusters use a teal face.
 */
export function cityMarkerIcon(count: number, expanded: boolean, cluster = false): string {
  const W = '#ffffff', L = '#dfdfdf', G = '#808080', K = '#000000';
  const face = expanded ? '#000080' : cluster ? '#008080' : '#c0c0c0';
  const ink = expanded || cluster ? '#ffffff' : '#000000';
  // Raised: light top-left, dark bottom-right. Pressed: the reverse.
  const [outerTL, innerTL, innerBR, outerBR] = expanded ? [K, G, L, W] : [W, L, G, K];

  const px: (string | null)[][] = Array.from({ length: PIN_H }, () => Array(PIN_W).fill(null));
  const set = (x: number, y: number, c: string) => {
    if (px[y] && x >= 0 && x < PIN_W) px[y]![x] = c;
  };

  // Badge: rows 0–10, cols 0–12, with a two-pixel bevel.
  for (let y = 0; y <= 10; y++) for (let x = 0; x <= 12; x++) set(x, y, face);
  for (let i = 0; i <= 12; i++) { set(i, 10, outerBR); set(i, 9, innerBR); }
  for (let i = 0; i <= 10; i++) { set(12, i, outerBR); set(11, i, innerBR); }
  for (let i = 0; i <= 11; i++) set(i, 0, outerTL);
  for (let i = 0; i <= 9; i++) set(0, i, outerTL);
  for (let i = 1; i <= 10; i++) set(i, 1, innerTL);
  for (let i = 1; i <= 8; i++) set(1, i, innerTL);

  // Pointer, opening out of the badge's bottom edge.
  [[4, 11, K], [5, 11, face], [6, 11, face], [7, 11, face], [8, 11, K],
   [5, 12, K], [6, 12, face], [7, 12, K],
   [6, 13, K]].forEach(([x, y, c]) => set(x as number, y as number, c as string));
  for (let x = 5; x <= 7; x++) { set(x, 9, face); set(x, 10, face); }

  // Count, centred in the badge face (rows 3–7).
  const text = String(Math.min(count, 99));
  const width = text.length * 4 - 1;
  let x0 = Math.floor((PIN_W - width) / 2);
  for (const ch of text) {
    DIGITS[ch]!.forEach((row, dy) => {
      [...row].forEach((bit, dx) => bit === '1' && set(x0 + dx, 3 + dy, ink));
    });
    x0 += 4;
  }

  // One rect per horizontal run of same-coloured pixels.
  let rects = '';
  px.forEach((row, y) => {
    let x = 0;
    while (x < PIN_W) {
      const c = row[x];
      let end = x;
      while (end + 1 < PIN_W && row[end + 1] === c) end++;
      if (c) rects += `<rect x="${x}" y="${y}" width="${end - x + 1}" height="1" fill="${c}"/>`;
      x = end + 1;
    }
  });
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${PIN_W * 8}" height="${PIN_H * 8}" viewBox="0 0 ${PIN_W} ${PIN_H}" shape-rendering="crispEdges">${rects}</svg>`;
  return svgUrl(svg);
}

/** The bevelled Win98 frame shared by the initials badge and logos (64×64, 4px border). */
const FRAME = `
  <rect x="0" y="0" width="64" height="64" fill="#000"/>
  <rect x="0" y="0" width="63" height="63" fill="#fff"/>
  <rect x="1" y="1" width="62" height="62" fill="#808080"/>
  <rect x="1" y="1" width="61" height="61" fill="#dfdfdf"/>`;
/** Share of the square inside the frame (56 of 64px). */
export const FRAME_INSIDE = 56 / 64;

/** Just the frame, with its inside painted `fill`; logos are drawn on top of it. */
export function frameIcon(fill: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" shape-rendering="crispEdges">${FRAME}
  <rect x="4" y="4" width="56" height="56" fill="${fill}"/>
</svg>`;
  return svgUrl(svg);
}

/** What we learn about a logo once it loads: its proportions and background colour. */
export interface LogoInfo {
  ratio: number;
  background: string;
}
/** Filled in by DesignerGraph as logos load; the Properties window reads it too. */
export const logoInfo = new Map<string, LogoInfo>();

interface LogoAsset extends LogoInfo { file: string | null }
const mapLogos: Readonly<Record<string, LogoAsset>> = logoAssets;
const mapLogoPath = (file: string) => `${import.meta.env.BASE_URL}map-logos/${file}`;
// Local metadata avoids hundreds of browser Image/canvas probes and restyles.
for (const [name, info] of Object.entries(mapLogos)) {
  logoInfo.set(`${import.meta.env.BASE_URL}logos/${name}`, info);
  if (info.file) logoInfo.set(mapLogoPath(info.file), info);
}

/** Map thumbnails are separate from the original logos used in Properties. */
export function mapLogoUrl(h: House): string | undefined {
  const file = h.logo ? mapLogos[h.logo]?.file : undefined;
  return file ? mapLogoPath(file) : logoUrl(h);
}

/** Logo size inside its square (percent of the square), keeping its proportions. */
export function logoSize(ratio: number, fit: 'contain' | 'fill' = 'contain') {
  const longest = FRAME_INSIDE * 100 * (fit === 'fill' ? 1 : 0.86);
  return ratio >= 1 ? { w: longest, h: longest / ratio } : { w: longest * ratio, h: longest };
}

/** The default square: a bevelled Win98-style "program icon" with the house's initials. */
export function initialsIcon(h: House): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" shape-rendering="crispEdges">${FRAME}
  <rect x="4" y="4" width="56" height="56" fill="${houseColor(h)}"/>
  <text x="32" y="41" text-anchor="middle" font-family="Times New Roman, serif" font-weight="bold"
        font-size="${initials(h.name).length > 2 ? 18 : 24}" fill="#fff">${initials(h.name)}</text>
</svg>`;
  return svgUrl(svg);
}

/** The house's logo if it has one, otherwise its initials square. */
export function houseIcon(h: House): string {
  return mapLogoUrl(h) ?? initialsIcon(h);
}
