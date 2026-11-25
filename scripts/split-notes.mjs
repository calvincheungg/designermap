/**
 * Production builds move the `notes` of houses and designers (about 700 KB of
 * text that only Properties shows) out of the data modules and into
 * src/data/notes.ts, which the page downloads separately.
 *
 * Only a record's own string `notes` move; nested notes (on a tenure, say) and
 * anything that isn't plain text stay where they are, and the page reads those
 * from the record.
 */
import { readFile } from 'node:fs/promises';
import { parseSync } from 'vite';

/** The text of a string literal, a template without values, or those joined with +. */
function textOf(node) {
  if (node.type === 'Literal' && typeof node.value === 'string') return node.value;
  if (node.type === 'TemplateLiteral' && !node.expressions.length) return node.quasis[0].value.cooked;
  if (node.type === 'BinaryExpression' && node.operator === '+') {
    const left = textOf(node.left), right = textOf(node.right);
    return left === undefined || right === undefined ? undefined : left + right;
  }
  return undefined;
}
const keyOf = (property) => property.type !== 'Property' || property.computed ? undefined : property.key.name ?? property.key.value;
const unwrap = (node) => { while (node && /^(TS\w+Expression|ParenthesizedExpression)$/.test(node.type)) node = node.expression; return node; };

/** Split `export const <name> = { id: { notes: '…' } }`: the code without those notes, and the notes by id. */
export function splitNotes(code, name) {
  const { program } = parseSync(`${name}.ts`, code);
  const notes = {};
  const cuts = [];
  for (const statement of program.body) {
    const declaration = statement.type === 'ExportNamedDeclaration' ? statement.declaration : statement;
    if (declaration?.type !== 'VariableDeclaration') continue;
    for (const { id, init } of declaration.declarations) {
      const records = unwrap(init);
      if (id.name !== name || records?.type !== 'ObjectExpression') continue;
      for (const record of records.properties) {
        const fields = unwrap(record.value);
        if (keyOf(record) === undefined || fields?.type !== 'ObjectExpression') continue;
        for (const field of fields.properties) {
          const text = keyOf(field) === 'notes' ? textOf(unwrap(field.value)) : undefined;
          if (text === undefined) continue;
          notes[keyOf(record)] = text;
          const comma = /^\s*,/.exec(code.slice(field.end));
          cuts.push([field.start, field.end + (comma ? comma[0].length : 0)]);
        }
      }
    }
  }
  let output = '', at = 0;
  for (const [from, to] of cuts.sort((a, b) => a[0] - b[0])) { output += code.slice(at, from); at = to; }
  return { code: output + code.slice(at), notes };
}

const RECORDS = /\/src\/data\/(houses|designers)\.ts$/;
const NOTES = /\/src\/data\/notes\.ts$/;

/** Vite plugin: applies splitNotes during `vite build`. */
export function splitNotesPlugin() {
  return {
    name: 'designer-map:split-notes',
    apply: 'build',
    enforce: 'pre',
    async transform(code, id) {
      const file = id.split('?')[0];
      const records = RECORDS.exec(file);
      if (records) return { code: splitNotes(code, records[1]).code, map: null };
      if (!NOTES.test(file)) return null;
      const all = {};
      for (const name of ['houses', 'designers']) {
        const path = file.replace(/notes\.ts$/, `${name}.ts`);
        this.addWatchFile(path);
        all[name] = splitNotes(await readFile(path, 'utf8'), name).notes;
      }
      // A JSON string parses faster than the same object as code.
      return { code: `export const notes = JSON.parse(${JSON.stringify(JSON.stringify(all))});`, map: null };
    },
  };
}
