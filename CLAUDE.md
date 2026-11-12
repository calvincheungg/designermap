# Designer Map

Interactive graph of fashion houses and their creative directors, styled like
Windows 98. Vite + TypeScript, Cytoscape.js (fcose layout) for the graph,
98.css for the UI chrome. No framework: plain DOM + template strings.

## Commands

```bash
npm run dev      # dev server on :5173
npm run check    # tsc --noEmit
npm test         # vitest: data validation + derived-query tests
npm run build    # check + production build to dist/
```

Run `npm run check && npm test` before committing.

## Git & PRs

- Never add Claude/AI attribution to commits or PRs: no `Co-Authored-By: Claude`
  trailers, no "Generated with Claude Code" lines, no session links. Commits are
  authored by the repo owner only. (`.claude/settings.json` disables this too.)
- Remote: https://github.com/calvincheungg/designermap, default branch `main`.

## Architecture

```
src/types.ts          data model
src/data/houses.ts    SOURCE OF TRUTH: houses (key = house id)
src/data/designers.ts SOURCE OF TRUTH: designers + career tenures
src/data/index.ts     derived queries: tenuresAt, movesOf, allMoves, yearRange…
src/data/validate.ts  sanity checks (also run in tests + logged in browser)
src/graph/            Cytoscape: elements.ts (per view), style.ts, icons.ts, graph.ts
src/ui/panel.ts       "Properties" window HTML for house / designer / directory
src/main.ts           wires toolbar, search, year slider, panel ↔ graph
```

Key rules:

- **Each fact is written once.** Tenures live only in `designers.ts` (`career`).
  A house's director list and a designer's moves are *derived*, never stored.
  Don't add a `directors` array to houses or a `moves` array to designers.
- **Ids are object keys** (camelCase). `HouseId` is `keyof typeof houses`, so a
  bad `house:` reference in a career is a compile error. Keep the
  `satisfies Record<string, …>` pattern; don't widen to `string`.
- `end: null` = current, `end` omitted = unknown, `approximate: true` = unverified years.
- A "move" = consecutive career entries (sorted by start) at *different* houses.
  Same-house promotions are not moves.
- Two graph views (`ViewMode`): `network` (designer nodes ↔ house nodes) and
  `moves` (house → house arrows). Houses sit inside city compound nodes.
- Logos: `public/logos/<file>`, referenced by `logo:` on the house; missing logos
  fall back to a generated initials icon (`graph/icons.ts`).

## Data conventions

- Starter data was written from memory. When adding or correcting entries,
  prefer adding a `sources` URL over guessing; mark uncertain years `approximate`.
- `parentGroup` is the *current* owner, not historical.

## Styling

- Use 98.css classes (`window`, `title-bar`, `field-row`, `sunken-panel`,
  `tree-view`, `status-bar`) before writing custom CSS. Custom CSS is in
  `src/style.css`; graph styling is in `src/graph/style.ts` (canvas, not CSS).
- Palette: teal desktop `#008080`, face `#c0c0c0`, selection navy `#000080`.
- 98.css trips Vite's CSS minifier, which is why `vite.config.ts` sets `cssMinify: false`.
- Layout must still work at phone width (the properties window stacks under the graph).

## Gotchas

- TypeScript 7 and Vite 8; `lib` is ES2024 (for `Map.groupBy`).
- `cytoscape-fcose` has no types; declared in `src/vendor.d.ts`.
- Canvas text doesn't reflow on font load: `graph.refreshStyle()` after `document.fonts.ready`.
- In dev, `window.cy` / `window.graph` are exposed for console debugging.
