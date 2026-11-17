/**
 * Production builds drop the `sources: [...]` research links from the data
 * files. They are internal metadata the site never displays (only validation
 * and tests read them), and they were ~15% of the JavaScript bundle.
 *
 * Only plain arrays of string literals are removed; anything else is left as is.
 */
const STRING = String.raw`(?:'(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*")`;
/** The key, bare or quoted (some records are written JSON-style). */
export const SOURCES_KEY = /(?:\bsources|"sources"|'sources')\s*:/g;
const SOURCES = new RegExp(String.raw`(?:\bsources|"sources"|'sources')\s*:\s*\[(?:\s*${STRING}\s*,?)*\s*\]\s*,?`, 'g');

/** Data modules whose `sources` arrays are stripped. */
export const DATA_FILE = /\/src\/data\/(houses|designers|collaborations)\.ts$/;

/** Returns the code without its `sources` arrays, and how many were removed. */
export function stripSources(code) {
  let removed = 0;
  const output = code.replace(SOURCES, () => {
    removed++;
    return '';
  });
  return { code: output, removed };
}

/** Vite plugin: applies stripSources to the data modules during `vite build`. */
export function stripSourcesPlugin() {
  return {
    name: 'designer-map:strip-sources',
    apply: 'build',
    enforce: 'pre',
    transform(code, id) {
      if (!DATA_FILE.test(id.split('?')[0])) return null;
      return { code: stripSources(code).code, map: null };
    },
  };
}
