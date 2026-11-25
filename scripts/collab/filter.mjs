/**
 * Lists crawled headlines that name a brand with no record beside this house that year.
 *   node scripts/collab/filter.mjs <houseId> <archive.tsv> [--excerpts] [--unmatched]
 *
 * Recorded pairings count across label families, and November–December articles
 * also match next year's records. Each partner and year is shown once.
 * --excerpts also shows rows naming a partner only in the excerpt (marked ~, noisier);
 * --unmatched lists collaboration headlines naming no house (non-dataset partners).
 * Matches are candidates, not facts: read each headline before recording it.
 */
import { readFileSync } from 'node:fs';
import { loadData, recordedYears, rootOf } from './data.mjs';

const [id, file] = process.argv.slice(2);
const flag = (name) => process.argv.includes(`--${name}`);
const { houses, collaborations } = await loadData();
if (!file || file.startsWith('--') || !Object.hasOwn(houses, id)) {
  console.error('Usage: node scripts/collab/filter.mjs <houseId> <archive.tsv> [--excerpts] [--unmatched]');
  process.exit(1);
}
const words = (text) =>
  text.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '').replace(/[’']/g, '').replace(/[^\p{L}\p{N}]+/gu, ' ').trim();

// Names and aliases that are ordinary headline words.
const ignored = new Set(
  ('on|the|y|made|available|next|real|vision|essentials|story|express|girl|object|element|independent|arena|closed|kids|band|' +
    'reference|common|basics|perfect|notes|eye|boy|ms|a1|tao|cos|creatures|chocolate|baker|joe|primitive|feature|oak|studio|' +
    'nonsense|toy|hidden|capsule|blends|of|for the city|a|folk|roots|rebels|market|buffalo|vs|seven|ma 1|end|purple|both|' +
    'both paris|native|fitted|staple|master piece s|division|philosophy|polar|frame|garage|coach jacket|pony|polo|district').split('|'),
);
const index = new Map();
const add = (name, house) => {
  const key = words(name);
  if (key.length < 2 || ignored.has(key)) return;
  index.set(key, [...new Set([...(index.get(key) ?? []), house])]);
};
for (const [house, data] of Object.entries(houses)) for (const name of [data.name, ...(data.aliases ?? [])]) add(name, house);
// "END." keeps its dot in headlines, but "end" alone is an ordinary word.
for (const [name, house] of [
  ['Ronnie Fieg', 'kith'], ['A Bathing Ape', 'bape'], ['DSM', 'doverStreetMarket'], ['CDG', 'commeDesGarcons'],
  ['Comme des Garcons', 'commeDesGarcons'], ['Air Jordan', 'jordanBrand'], ['G-Shock', 'gShock'], ['Porter', 'porterYoshida'],
  ['SNS', 'sneakersnstuff'], ['fragment', 'fragmentDesign'], ['END Clothing', 'endClothing'],
]) if (Object.hasOwn(houses, house)) add(name, house);

const longest = Math.max(...[...index.keys()].map((key) => key.split(' ').length));
function housesIn(text) {
  const list = words(text).split(' ');
  const found = new Set();
  for (let i = 0; i < list.length; ) {
    let used = 1;
    for (let n = Math.min(longest, list.length - i); n > 0; n--) {
      const hit = index.get(list.slice(i, i + n).join(' '));
      if (!hit) continue;
      hit.forEach((house) => found.add(house));
      used = n;
      break;
    }
    i += used;
  }
  if (/\bEND\./.test(text) && houses.endClothing) found.add('endClothing');
  return [...found];
}

const family = rootOf(houses, id);
const recorded = recordedYears(houses, collaborations, id);
const noise =
  /Drops You|Everything Dropping|Best (Footwear|Sneaker)|HYPEBEAST Radar|Lookbook Roundup|Hypegolf List|Essentials:|This Week|Other (Key|Essential)|More (Key|Essential)|European Drops|Street Style|Interview|Fashion Week|Sole Mates|HBX|Red P(ocket|acket)|Nominat|Hottest|Top \d+|\d+ Best|Rumor|\bEditorial\b|StockX|auction/i;
const collaborative = / [x×X] |collab|teams? up|link|taps|unite|partner|join|exclusive/i;
const seen = new Set();
const unmatched = [];
let shown = 0;
for (const row of readFileSync(file, 'utf8').split('\n')) {
  const [, date, , title, excerpt = ''] = row.split('\t');
  if (!title || noise.test(title)) continue;
  const [year, month] = date.split('/').map(Number);
  const outside = (text) => housesIn(text).filter((house) => rootOf(houses, house) !== family);
  let partners = outside(title);
  const fromExcerpt = !partners.length && flag('excerpts');
  if (fromExcerpt) partners = outside(excerpt);
  if (!partners.length) {
    if (collaborative.test(title)) unmatched.push(`${date} ${title.slice(0, 70)}`);
    continue;
  }
  const fresh = partners.filter((house) => {
    const years = recorded.get(rootOf(houses, house));
    return !(years?.has(year) || (month >= 11 && years?.has(year + 1))) && !seen.has(house + year);
  });
  if (!fresh.length) continue;
  fresh.forEach((house) => seen.add(house + year));
  shown++;
  console.log(`${date.slice(2)}${fromExcerpt ? '~' : ''} [${fresh.join(' ')}] ${title.slice(0, 110)}${fromExcerpt ? ` | ${excerpt.slice(0, 80)}` : ''}`);
}
if (flag('unmatched')) console.log(`--- no house named:\n${unmatched.join('\n')}`);
console.log(`${shown} to read, ${unmatched.length} collaboration headlines naming no house`);
