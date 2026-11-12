import '98.css/dist/98.css';
import './style.css';

import { allMoves, designers, getDesigner, getHouse, houses, yearRange } from './data';
import { validateData } from './data/validate';
import type { ViewMode } from './graph/elements';
import { DesignerGraph, type Selection } from './graph/graph';
import { renderPanel } from './ui/panel';

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;

const panel = $('panel');
const panelTitle = $('panel-title');
const viewSelect = $<HTMLSelectElement>('view');
const search = $<HTMLInputElement>('search');
const searchOptions = $('search-options');
const yearInput = $<HTMLInputElement>('year');
const yearLabel = $('year-label');
const playBtn = $<HTMLButtonElement>('play');

/* ---------- data sanity check (see src/data/validate.ts) ---------- */
const problems = validateData();
if (problems.length) console.warn(`Data warnings (${problems.length}):\n  ${problems.join('\n  ')}`);

/* ---------- graph + selection ---------- */
let selection: Selection = null;

const graph = new DesignerGraph($('graph'), (sel) => select(sel));
document.fonts.ready.then(() => graph.refreshStyle());
// Handy for poking at the graph from the browser console during development.
if (import.meta.env.DEV) Object.assign(window, { graph, cy: graph.cy });

function select(sel: Selection, reveal = false) {
  selection = sel;
  graph.select(sel, reveal);
  const { title, html } = renderPanel(sel);
  panelTitle.textContent = title;
  panel.innerHTML = html;
  panel.scrollTop = 0;

  const name =
    sel?.kind === 'house' ? getHouse(sel.id)?.name : sel ? getDesigner(sel.id)?.name : undefined;
  $('status-selection').textContent = name ? `Selected: ${name}` : 'Nothing selected';
}

// Links in the panel look like <a data-select="house:dior">.
panel.addEventListener('click', (e) => {
  const a = (e.target as HTMLElement).closest<HTMLElement>('[data-select]');
  if (!a) return;
  e.preventDefault();
  const [kind, id] = a.dataset.select!.split(':') as ['house' | 'designer', string];
  select({ kind, id }, true);
});

/* ---------- toolbar ---------- */
viewSelect.addEventListener('change', () => {
  graph.setMode(viewSelect.value as ViewMode);
  graph.select(selection);
});

$('fit').addEventListener('click', () => graph.fit());
$('home').addEventListener('click', () => {
  select(null);
  graph.fit();
});

// Search: a datalist of every house + designer name.
const searchIndex = new Map<string, NonNullable<Selection>>([
  ...houses.map((h) => [h.name, { kind: 'house', id: h.id }] as const),
  ...designers.map((d) => [d.name, { kind: 'designer', id: d.id }] as const),
]);
searchOptions.innerHTML = [...searchIndex.keys()]
  .sort()
  .map((n) => `<option value="${n.replace(/"/g, '&quot;')}"></option>`)
  .join('');
search.addEventListener('change', () => {
  const hit =
    searchIndex.get(search.value) ??
    [...searchIndex].find(([n]) => n.toLowerCase().includes(search.value.toLowerCase()))?.[1];
  if (hit) select(hit, true);
});

// Year slider: scrub through history. Far right = everything.
const [minYear, maxYear] = yearRange();
yearInput.min = String(minYear);
yearInput.max = String(maxYear);
yearInput.value = String(maxYear);

function setYear(y: number) {
  yearInput.value = String(y);
  yearLabel.textContent = y >= maxYear ? 'All' : String(y);
  $('status-year').textContent = y >= maxYear ? 'Showing all years' : `Up to ${y}`;
  graph.setYear(y >= maxYear ? Infinity : y);
}
yearInput.addEventListener('input', () => setYear(Number(yearInput.value)));

let timer: number | undefined;
function stopPlaying() {
  clearInterval(timer);
  timer = undefined;
  playBtn.textContent = '▶ Play';
}
playBtn.addEventListener('click', () => {
  if (timer) return stopPlaying();
  let y = Number(yearInput.value) >= maxYear ? minYear : Number(yearInput.value);
  playBtn.textContent = '■ Stop';
  timer = window.setInterval(() => {
    setYear(y);
    if (++y > maxYear) stopPlaying();
  }, 150);
});

/* ---------- status bar + taskbar clock ---------- */
$('status-counts').textContent =
  `${houses.length} houses · ${designers.length} designers · ${allMoves().length} moves`;

const clock = $('clock');
const tick = () =>
  (clock.textContent = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }));
tick();
setInterval(tick, 10_000);

setYear(maxYear);
select(null);
