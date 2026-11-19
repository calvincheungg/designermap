/**
 * Night chrome: while the map is in night mode (App sets data-theme="night" on
 * the root), the Win98 window chrome turns dark grey too.
 *
 * Rather than hand-maintaining a second stylesheet, this derives one. Every
 * rule in 98.css and src/style.css that sets a colour-capable property gets a
 * "night twin" appended to the same file: the same selector behind
 * `:where(:root[data-theme="night"])` (so specificity is unchanged) with its
 * colours mapped to darker shades. Twins carry every colour-capable declaration,
 * changed or not, so the night cascade resolves exactly like the day one.
 *
 * Map colours (sea, land, city boxes) are skipped; they have their own night
 * rules under `.graph-pane.night`.
 */
import postcss from 'postcss';

export const NIGHT = '[data-theme="night"]';

/** 98.css and our own stylesheet. */
export const CHROME_FILE = /(\/98\.css\/dist\/98\.css|\/src\/style\.css)$/;

/** Map scenery keeps its own day/night rules. */
const SKIP_SELECTOR = /graph-pane|map-layer|settings-preview|cy-layer|pulse-layer/;

/** Canonical colour names: 98.css mixes names, short and long hex. */
const CANON = {
  white: '#ffffff', black: '#000000', silver: '#c0c0c0', grey: '#808080', gray: '#808080',
  navy: '#000080', teal: '#008080',
};
const canon = (colour) => {
  const c = colour.toLowerCase();
  if (CANON[c]) return CANON[c];
  return c.length === 4 ? `#${c[1]}${c[1]}${c[2]}${c[2]}${c[3]}${c[3]}` : c;
};

/** Fills: window faces, fields, tooltips and the desktop. */
const SURFACE = {
  '#c0c0c0': '#3c3c3c', '#ffffff': '#1e1e1e', '#dfdfdf': '#4a4a4a', '#808080': '#282828',
  '#d4d0c8': '#3a3a3a', '#dcdcdc': '#444444', '#bdbdbd': '#484848', '#b5b5b5': '#484848',
  '#a0a0a0': '#505050', '#a9a9a9': '#4a4a4a', '#7b7b7b': '#2e2e2e', '#404040': '#1c1c1c',
  '#ffffe1': '#3d3a24', '#ffffcc': '#3d3a24', '#008080': '#1f3a3a', '#fffbf0': '#2a2a2a',
};
/** Text, glyphs and focus outlines. */
const INK = {
  '#000000': '#e0e0e0', '#0a0a0a': '#e0e0e0', '#222222': '#e0e0e0', '#404040': '#b0b0b0',
  '#808080': '#8a8a8a', '#7b7b7b': '#a0a0a0', '#0000ff': '#8ab4ff', '#000080': '#a0a0ff',
  '#800000': '#ff8080', '#c00000': '#ff6060', '#cc0000': '#ff6060', '#008000': '#60c060',
  '#008080': '#40c0c0', '#c0c0c0': '#5a5a5a', '#dfdfdf': '#5a5a5a',
};
/** Bevels: highlights get dimmer, shadows go to near black. */
const EDGE = {
  '#ffffff': '#6a6a6a', '#dfdfdf': '#505050', '#808080': '#1e1e1e', '#c0c0c0': '#3c3c3c',
  '#404040': '#181818', '#a0a0a0': '#484848', '#a0a0a4': '#484848', '#a9a9a9': '#4a4a4a',
  '#d4d0c8': '#555555', '#dcdcdc': '#555555', '#bdbdbd': '#505050', '#b5b5b5': '#505050',
  '#7b7b7b': '#2a2a2a', '#222222': '#e0e0e0', '#c0c7c8': '#4a4a4a', '#87888f': '#2a2a2a',
};

const COLOUR = /#[0-9a-f]{3,8}\b|\b(?:white|black|silver|grey|gray|navy|teal)\b/gi;
const URI_COLOUR = /%23([0-9a-f]{3,8})\b|(['"])(#[0-9a-f]{3,8}|white|black|silver|grey|gray)\2/gi;

/** Which table a property's colours use, or undefined when it has no colour. */
function tableFor(prop) {
  if (prop.startsWith('--')) return SURFACE;
  if (prop === 'color' || prop === 'caret-color' || prop.startsWith('outline') || prop === 'text-decoration-color'
    || prop === '-webkit-text-fill-color') return INK;
  if (prop.startsWith('border') || prop === 'box-shadow' || prop === 'text-shadow' || prop === 'column-rule') return EDGE;
  if (prop.startsWith('background') || prop === 'fill' || prop === 'stroke' || prop === 'list-style-image'
    || prop === 'accent-color') return SURFACE;
  return undefined;
}

const mapColour = (table, colour) => table[canon(colour)] ?? colour;

/**
 * Colours inside an inline SVG (radio buttons, scroll arrows, title-bar glyphs).
 * Those pictures are bevels, except their black "ink": glyphs drawn on a button
 * face (after the silver fill, or in an otherwise glyph-only picture).
 */
function mapUri(uri, selector) {
  const decoded = uri.replace(/%23/g, '#');
  const glyphOnly = !/#dfdfdf|silver|#c0c0c0|#c0c7c8/i.test(decoded) && !/border-image/.test(selector);
  let afterFace = false;
  let whites = 0;
  const totalWhites = (decoded.match(/['"]#fff(?:fff)?['"]/gi) ?? []).length;
  return uri.replace(URI_COLOUR, (match, hex, quote, named) => {
    const raw = hex ? `#${hex}` : named;
    const c = canon(raw);
    let mapped;
    if (c === '#c0c0c0') afterFace = true;
    if (c === '#000000' || c === '#0a0a0a') mapped = glyphOnly || afterFace ? INK[c] : '#000000';
    else if (c === '#808080' && glyphOnly) mapped = '#8a8a8a';
    else if (c === '#ffffff') {
      whites++;
      // A radio button's second white is its field, not a highlight.
      mapped = glyphOnly ? '#1e1e1e' : whites === totalWhites && totalWhites > 1 && /radio/.test(selector) ? '#1e1e1e' : EDGE[c];
    } else mapped = EDGE[c] ?? SURFACE[c] ?? c;
    return hex ? mapped.replace('#', '%23') : `${quote}${mapped}${quote}`;
  });
}

function mapValue(prop, value, selector) {
  const table = tableFor(prop);
  return value.replace(/url\((['"]?)data:[^)]*\)/g, (uri) => mapUri(uri, selector))
    // Leave data URIs (already mapped) alone; only colours outside url(...) use the property's table.
    .split(/(url\([^)]*\))/)
    .map((part) => part.startsWith('url(') ? part : part.replace(COLOUR, (c) => mapColour(table, c)))
    .join('');
}

/** The same selector, matched only under the night root, with unchanged specificity. */
export function nightSelector(selector) {
  return selector.replace(/^\s*(:root|html)(?![\w-])/, `$1:where(${NIGHT})`) === selector
    ? `:where(:root${NIGHT}) ${selector.trim()}`
    : selector.replace(/^\s*(:root|html)(?![\w-])/, `$1:where(${NIGHT})`);
}

/** Returns the CSS with its night twins appended. */
export function addNightChrome(css) {
  const root = postcss.parse(css);
  const out = postcss.root();
  root.walkRules((rule) => {
    if (rule.parent?.type === 'atrule' && /keyframes$/i.test(rule.parent.name)) return;
    const decls = rule.nodes.filter((node) => node.type === 'decl' && tableFor(node.prop)
      && (!node.prop.startsWith('--') || COLOUR.test(node.value) && !(COLOUR.lastIndex = 0)));
    if (!decls.length) return;
    const selectors = rule.selectors.filter((s) => !SKIP_SELECTOR.test(s));
    if (!selectors.length) return;
    let twin = postcss.rule({ selectors: selectors.map(nightSelector) });
    for (const decl of decls) {
      twin.append(decl.clone({ value: mapValue(decl.prop, decl.value, rule.selector) }));
    }
    // Rebuild the @media/@supports wrappers around it.
    for (let parent = rule.parent; parent && parent.type === 'atrule'; parent = parent.parent) {
      twin = postcss.atRule({ name: parent.name, params: parent.params }).append(twin);
    }
    out.append(twin);
  });
  return `${css}\n/* ---------- night chrome (generated by scripts/night-chrome.mjs) ---------- */\n${out.toString()}\n`;
}

/** Vite plugin: appends the night twins to 98.css and style.css. */
export function nightChromePlugin() {
  return {
    name: 'designer-map:night-chrome',
    enforce: 'pre',
    transform(code, id) {
      const file = id.split('?')[0];
      if (!CHROME_FILE.test(file)) return undefined;
      return { code: addNightChrome(code), map: null };
    },
  };
}
