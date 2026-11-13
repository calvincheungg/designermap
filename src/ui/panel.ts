import {
  careerOf,
  designers,
  formatTenureYears,
  getDesigner,
  getHouse,
  houses,
  logoUrl,
  movesOf,
  tenuresAt,
} from '../data';
import type { Selection } from '../graph/graph';
import { frameIcon, initialsIcon, logoInfo } from '../graph/icons';
import type { House, Tenure } from '../types';

const esc = (s: unknown) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

/** Clickable link that selects a house or designer (handled by delegation in main.ts). */
const link = (kind: 'house' | 'designer', id: string, label: string) =>
  `<a href="#" data-select="${kind}:${esc(id)}">${esc(label)}</a>`;

const role = (t: Tenure) => esc(t.roleDetail ? `${t.role} (${t.roleDetail})` : t.role);

/** "https://www.loewe.com/eu/" → a link reading "loewe.com". */
const websiteLink = (url: string) => {
  let label = url;
  try {
    label = new URL(url).hostname.replace(/^www\./, '');
  } catch {
    /* not a valid URL; show it as written (validate.ts flags it) */
  }
  return `<a href="${esc(url)}" target="_blank" rel="noreferrer">${esc(label)}</a>`;
};

const notes = (text?: string) =>
  text ? `<fieldset><legend>Notes</legend><p>${esc(text)}</p></fieldset>` : '';

const fields = (rows: [string, unknown][]) =>
  `<table class="fields">${rows
    .filter(([, v]) => v !== undefined && v !== '')
    .map(([k, v]) => `<tr><th>${esc(k)}:</th><td>${v}</td></tr>`)
    .join('')}</table>`;

export function renderPanel(sel: Selection): { title: string; html: string } {
  if (sel?.kind === 'house') return renderHouse(sel.id);
  if (sel?.kind === 'designer') return renderDesigner(sel.id);
  return renderDirectory();
}

function renderDirectory() {
  const byName = (a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name);
  const houseList = (hs: typeof houses) =>
    `<ul>${[...hs].sort(byName).map((h) => `<li>${link('house', h.id, h.name)}</li>`).join('')}</ul>`;

  // Country → city → houses, collapsed so the list stays short; it scrolls inside its box.
  const byCountry = [...Map.groupBy(houses, (h) => h.country)].sort(([a], [b]) => a.localeCompare(b));
  const tree = byCountry
    .map(([country, hs]) => {
      const cities = [...Map.groupBy(hs, (h) => h.city)].sort(([a], [b]) => a.localeCompare(b));
      if (cities.length === 1) {
        const [city] = cities[0]!;
        return `<li><details><summary>${esc(country)} · ${esc(city)} (${hs.length})</summary>${houseList(hs)}</details></li>`;
      }
      const cityItems = cities
        .map(
          ([city, chs]) =>
            `<li><details><summary>${esc(city)} (${chs.length})</summary>${houseList(chs)}</details></li>`,
        )
        .join('');
      return `<li><details><summary>${esc(country)} (${hs.length})</summary><ul>${cityItems}</ul></details></li>`;
    })
    .join('');

  const people = [...designers]
    .sort(byName)
    .map((d) => `<li>${link('designer', d.id, d.name)}</li>`)
    .join('');

  return {
    title: 'Directory',
    html: `
      <p class="hint">Click an icon in the graph, or pick from the lists below.</p>
      <fieldset><legend>Fashion houses (${houses.length})</legend><ul class="tree-view scroll-box">${tree}</ul></fieldset>
      <fieldset><legend>Designers (${designers.length})</legend><ul class="tree-view scroll-box">${people}</ul></fieldset>`,
  };
}

/**
 * The house's square: its logo inside the same bevelled frame as the initials
 * badge (inside painted in the logo's background colour), or the initials badge.
 */
function logoImg(h: House) {
  const fallback = `this.onerror=null;this.className='logo';this.removeAttribute('style');this.src='${initialsIcon(h)}'`;
  const url = logoUrl(h);
  if (!url) return `<img class="logo" src="${esc(initialsIcon(h))}" alt="${esc(h.name)}" />`;
  const background = logoInfo.get(url)?.background ?? '#ffffff';
  // 80px square, 5px frame (the 64px frame art scaled up); "contain" logos get a few more px of margin.
  const pad = h.logoFit === 'fill' ? 5 : 10;
  const style = `background-image:url(&quot;${frameIcon(background)}&quot;);padding:${pad}px`;
  return `<img class="logo has-logo" src="${esc(url)}" alt="${esc(h.name)} logo" style="${style}" onerror="${esc(fallback)}" />`;
}

function renderHouse(id: string) {
  const h = getHouse(id);
  if (!h) return { title: 'Not found', html: `<p>No house with id “${esc(id)}”.</p>` };

  const rows = tenuresAt(id)
    .map((t) => {
      const d = getDesigner(t.designerId);
      return `<tr>
        <td class="nowrap">${esc(formatTenureYears(t))}</td>
        <td>${link('designer', t.designerId, d?.name ?? t.designerId)}</td>
        <td>${role(t)}</td>
      </tr>`;
    })
    .join('');

  return {
    title: `${h.name} Properties`,
    html: `
      <div class="identity">
        ${logoImg(h)}
        <div><h2>${esc(h.name)}</h2>${fields([
          ['Founded', h.founded && esc(h.founded)],
          ['Founder', esc(h.founder)],
          ['Based in', esc(`${h.city}, ${h.country}`)],
          ['Group', esc(h.parentGroup)],
          ['Website', h.website && websiteLink(h.website)],
        ])}</div>
      </div>
      <fieldset><legend>Creative directors</legend>
        ${
          rows
            ? `<div class="sunken-panel"><table class="interactive"><thead><tr><th>Years</th><th>Designer</th><th>Role</th></tr></thead><tbody>${rows}</tbody></table></div>`
            : '<p class="hint">None recorded yet. Add a career entry in designers.ts.</p>'
        }
      </fieldset>
      ${notes(h.notes)}`,
  };
}

function renderDesigner(id: string) {
  const d = getDesigner(id);
  if (!d) return { title: 'Not found', html: `<p>No designer with id “${esc(id)}”.</p>` };

  const career = careerOf(id)
    .map((t) => {
      const h = getHouse(t.house);
      return `<tr>
        <td class="nowrap">${esc(formatTenureYears(t))}</td>
        <td>${link('house', t.house, h?.name ?? t.house)}</td>
        <td>${role(t)}</td>
      </tr>`;
    })
    .join('');

  const moves = movesOf(id)
    .map((m) => {
      const from = getHouse(m.from.house)?.name ?? m.from.house;
      const to = getHouse(m.to.house)?.name ?? m.to.house;
      return m.concurrent
        ? `<li><b>${m.year}</b> + ${link('house', m.to.house, to)} <span class="hint">(alongside ${link('house', m.from.house, from)})</span></li>`
        : `<li><b>${m.year}</b> ${link('house', m.from.house, from)} → ${link('house', m.to.house, to)}</li>`;
    })
    .join('');

  const life = d.born ? `${d.born}${d.died ? `–${d.died}` : ''}` : undefined;

  return {
    title: `${d.name} Properties`,
    html: `
      <h2>${esc(d.name)}</h2>
      ${fields([
        ['Born', life && esc(life)],
        ['Nationality', esc(d.nationality)],
      ])}
      <fieldset><legend>Career</legend>
        <div class="sunken-panel"><table class="interactive"><thead><tr><th>Years</th><th>House</th><th>Role</th></tr></thead><tbody>${career}</tbody></table></div>
      </fieldset>
      <fieldset><legend>Moves</legend>
        ${moves ? `<ul class="moves">${moves}</ul>` : '<p class="hint">No moves between houses recorded.</p>'}
      </fieldset>
      ${notes(d.notes)}`,
  };
}
