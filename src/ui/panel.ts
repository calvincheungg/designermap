import {
  careerOf,
  designers,
  formatTenureYears,
  getDesigner,
  getHouse,
  houses,
  movesOf,
  tenuresAt,
} from '../data';
import type { Selection } from '../graph/graph';
import { houseIcon } from '../graph/icons';
import type { Tenure } from '../types';

const esc = (s: unknown) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

/** Clickable link that selects a house or designer (handled by delegation in main.ts). */
const link = (kind: 'house' | 'designer', id: string, label: string) =>
  `<a href="#" data-select="${kind}:${esc(id)}">${esc(label)}</a>`;

const role = (t: Tenure) => esc(t.roleDetail ? `${t.role} (${t.roleDetail})` : t.role);

const sources = (list?: string[]) =>
  list?.length
    ? `<fieldset><legend>Sources</legend><ul class="sources">${list
        .map((s) =>
          /^https?:\/\//.test(s)
            ? `<li><a href="${esc(s)}" target="_blank" rel="noreferrer">${esc(s)}</a></li>`
            : `<li>${esc(s)}</li>`,
        )
        .join('')}</ul></fieldset>`
    : '';

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
  const byCity = Map.groupBy(houses, (h) => h.city);
  const tree = [...byCity]
    .map(
      ([city, hs]) =>
        `<li><details open><summary>${esc(city)}</summary><ul>${hs
          .map((h) => `<li>${link('house', h.id, h.name)}</li>`)
          .join('')}</ul></details></li>`,
    )
    .join('');
  const people = [...designers]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((d) => `<li>${link('designer', d.id, d.name)}</li>`)
    .join('');

  return {
    title: 'Directory',
    html: `
      <p class="hint">Click an icon in the graph, or pick from the lists below.</p>
      <fieldset><legend>Fashion houses</legend><ul class="tree-view">${tree}</ul></fieldset>
      <fieldset><legend>Designers</legend><ul class="tree-view">${people}</ul></fieldset>`,
  };
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
        <img class="logo" src="${esc(houseIcon(h))}" alt="${esc(h.name)} logo" />
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
      ${notes(h.notes)}${sources(h.sources)}`,
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
      ${notes(d.notes)}${sources(d.sources)}`,
  };
}
