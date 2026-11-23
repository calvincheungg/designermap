/**
 * Reads a Hypebeast archive one page at a time, to its last page.
 *   node scripts/collab/crawl.mjs https://hypebeast.com/brands/beams out.tsv [--from 1] [--to 400] [--delay 4]
 *
 * Appends `page  yyyy/m  slug  title  excerpt` rows, skipping articles already in
 * the file, so a stopped crawl can resume with --from. A 404 is the end of the
 * archive. An empty 202 is a throttle: it waits and retries once, and stops
 * after two throttled pages in a row.
 */
import { appendFileSync, existsSync, readFileSync } from 'node:fs';
import { setTimeout as sleep } from 'node:timers/promises';
import { option } from './data.mjs';

const [base, out] = process.argv.slice(2);
if (!base?.startsWith('https://hypebeast.com/') || !out || out.startsWith('--')) {
  console.error('Usage: node scripts/collab/crawl.mjs https://hypebeast.com/<brands|tags>/<slug> out.tsv [--from N] [--to N] [--delay seconds]');
  process.exit(1);
}
const from = Number(option('from', 1));
const to = Number(option('to', 1000));
const delay = Number(option('delay', 4)) * 1000;
const url = (page) => (page > 1 ? `${base}/page/${page}` : base);

const entities = { amp: '&', quot: '"', lt: '<', gt: '>', nbsp: ' ', apos: "'", rsquo: '’', lsquo: '‘', ldquo: '“', rdquo: '”' };
const text = (html) =>
  html
    .replace(/<[^>]*>/g, '')
    .replace(/&#x([\da-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&(\w+);/g, (all, name) => entities[name] ?? all)
    .replace(/\s+/g, ' ')
    .trim();

function articles(html) {
  const links = [...html.matchAll(/<div class="post-box-content-title">\s*<a href="([^"#]+)"[^>]*?title="([^"]*)"/g)];
  const excerpts = [...html.matchAll(/<div class="post-box-content-excerpt">([\s\S]*?)<\/div>/g)];
  return links.flatMap((link, index) => {
    const match = link[1].match(/hypebeast\.com\/(?:[a-z]{2}\/)?((20\d\d)\/(\d+)\/[^/?]+)/);
    if (!match) return [];
    const excerpt = excerpts.length === links.length ? text(excerpts[index][1]) : '';
    return [{ date: `${match[2]}/${match[3]}`, slug: match[1], title: text(link[2]), excerpt }];
  });
}

async function read(page) {
  const response = await fetch(url(page), { redirect: 'manual', signal: AbortSignal.timeout(40_000) });
  if (response.status >= 300 && response.status < 400) {
    return { status: response.status, target: response.headers.get('location'), items: [] };
  }
  return { status: response.status, items: articles(await response.text()) };
}

const seen = new Set(existsSync(out) ? readFileSync(out, 'utf8').split('\n').map((row) => row.split('\t')[2]) : []);
let throttled = 0;
let last;
let oldest;
let complete = false;
let previous = '';
for (let page = from; page <= to; page++) {
  let result = await read(page);
  if (result.status !== 404 && result.status !== 200) {
    if (result.target) {
      console.log(`page ${page}: redirects to ${result.target}; crawl that address instead.`);
      break;
    }
    console.log(`page ${page}: HTTP ${result.status}; waiting 60s before one retry`);
    await sleep(60_000);
    result = await read(page);
  }
  if (result.status === 404) {
    complete = page > 1;
    console.log(page > 1 ? `page ${page}: 404, end of archive` : 'No archive at this address (404).');
    break;
  }
  if (result.status !== 200) {
    console.log(`page ${page}: still HTTP ${result.status}`);
    if (++throttled === 2) {
      console.log('Two throttled pages in a row; stopping.');
      break;
    }
    continue;
  }
  if (!result.items.length) {
    console.log(`page ${page}: no articles found; check whether the page layout changed.`);
    break;
  }
  const slugs = result.items.map((item) => item.slug).join();
  if (page > from && slugs === previous) {
    console.log(`page ${page}: same articles as the page before. This address doesn't paginate; use /tags/<slug>.`);
    break;
  }
  previous = slugs;
  throttled = 0;
  last = page;
  oldest = result.items.at(-1).date;
  const fresh = result.items.filter((item) => !seen.has(item.slug));
  for (const item of fresh) {
    seen.add(item.slug);
    appendFileSync(out, `${[page, item.date, item.slug, item.title, item.excerpt].join('\t')}\n`);
  }
  console.log(`page ${page}: ${fresh.length} new, to ${oldest}`);
  await sleep(delay);
}
console.log(`${complete ? 'COMPLETE' : 'INCOMPLETE'}: last page ${last ?? 'none'}, oldest article ${oldest ?? 'none'}`);
if (!complete) process.exitCode = 2;
