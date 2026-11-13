# Designer Map

Interactive world map of fashion houses and their creative directors, styled
like Windows 98. React + Vite + TypeScript for the interface, Cytoscape.js for
the graph (preset positions on the map), d3-geo + world-atlas for the map,
and 98.css for the UI chrome. React owns interface state and components;
the existing graph engine owns the SVG and canvas inside its map host.

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
src/data/cities.ts    city → [lat, lng]; every house city must be listed here
src/data/index.ts     derived queries: tenuresAt, movesOf, allMoves, yearRange…
src/data/validate.ts  sanity checks (also run in tests + logged in browser)
src/graph/geo.ts      projection, world SVG markup, city-box placement + overlap removal
src/graph/            Cytoscape: elements.ts (per view), style.ts, icons.ts, graph.ts
src/ui/panel.tsx      React Properties components for house / designer / group / directory
src/ui/listbox.tsx    React Win98 Find combobox (replaces <datalist>)
src/ui/filters.tsx    React multi-select filters and selected chips
src/ui/map-view.tsx   React lifecycle boundary for DesignerGraph and its context menu
src/App.tsx           interface state and synchronization with the graph API
src/main.tsx          React root and startup data validation
```

Key rules:

- **Each fact is written once.** Tenures live only in `designers.ts` (`career`).
  A house's director list and a designer's moves are *derived*, never stored.
  Don't add a `directors` array to houses or a `moves` array to designers.
- **Ids are object keys** (camelCase). `HouseId` is `keyof typeof houses`, so a
  bad `house:` reference in a career is a compile error. Keep the
  `satisfies Record<string, …>` pattern; don't widen to `string`.
- `end: null` = current, `end` omitted = unknown, `approximate: true` = unverified years.
- Role `Other` (with a `roleDetail` like "Senior designer", "Design assistant", "Head of knitwear")
  = a design-team or earlier role. It never counts as the house's creative-director succession:
  the Properties window lists it under "Design team & other roles", and tests use `directorsOf`.
  Use the director roles only for real house/line leadership. Separate stints = separate entries.
- Houses can have `website` (full URL; validate.ts checks the format), shown as a link,
  `instagram` (handle only, no @ or URL; shown as an @handle link under the website;
  every house has the field, `''` when unknown, like `logo`),
  and `logo` (file in public/logos/ or full URL; falls back to the initials square).
- A house with nobody linked yet is fine: `researchTodos()` lists it in the browser
  console instead of failing tests. Don't invent founders to fill it.
- One view, the world map (the old network view was removed):
  - `MapView` creates `DesignerGraph` once per mount. Keep graph callbacks stable;
    UI updates must not rebuild the engine. Cleanup calls `destroy()` to release
    Cytoscape, ResizeObserver, pending image callbacks and delayed fit timers.
  - Keep data queries and graph layout independent of React. Use React components
    and event handlers for interface changes rather than HTML strings or DOM mutation.
  - One `marker` node per city: a pixel-art Win98 pin
    (`icons.ts cityMarkerIcon`) whose tip sits exactly on the city. Pins scale
    with the map when zoomed out but cap at ~26px on screen (`sizeMarkers`,
    re-run on every zoom); colliding labels are hidden via `text-opacity`
    (an empty `label` bypass would *remove* the override). Clicking a pin
    toggles the city; `DesignerGraph.expanded` holds open cities. An open city's
    houses sit in an invisible `grid` compound in the nearest spot that covers no
    pin or other open city (`geo.ts placeGrids`), with a dotted leader to the pin.
    `move` edges are rebuilt on every expand/collapse: each end attaches to the
    house if its city is open, else to the pin. Selecting a house or designer
    auto-expands the cities involved. Map min zoom: `MAP_MIN_ZOOM` or map-fills-view.
  - Designers aren't nodes; selecting one highlights their houses + move edges.
  - "Show move lines" checkbox → `DesignerGraph.setShowMoves`: off hides `move`
    edges via the `lines-off` class, except the current selection's own lines.
    Remembered in localStorage (`designer-map:show-lines`).
- The world map is an SVG *under* the Cytoscape canvas, drawn in model
  coordinates and kept aligned by mirroring pan/zoom onto an SVG `<g transform>`
  (`syncMapLayer`). Use the SVG attribute, not a CSS transform, or
  `non-scaling-stroke` stops working. Don't draw map features as Cytoscape nodes.
- Past zoom 1, edge width/arrows are capped on screen (`scaleEdges`, run
  on zoom and after selection) since Cytoscape sizes them in model units.
  Map zoom range: MAP_MIN_ZOOM (or map-fills-view) to 8.
- A move = starting at a new house. Same-house title changes aren't moves;
  `from` is the house they left that year if any; `concurrent` = kept the old role.
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
  Map uses the Windows reserved colours: sea `#a6caf0`, land `#c0dcc0`,
  borders `#a0a0a4`, city boxes `#fffbf0`.
- 98.css trips Vite's CSS minifier, which is why `vite.config.ts` sets `cssMinify: false`.
- Layout must still work at phone width (the properties window stacks under the graph).

## Gotchas

- TypeScript 7 and Vite 8; `lib` is ES2024 (for `Map.groupBy`).
- Canvas text doesn't reflow on font load: `graph.refreshStyle()` after `document.fonts.ready`.
- In dev, `window.cy` / `window.graph` are exposed for console debugging.
- Performance (Cytoscape restyles are the expensive part):
  - Generated SVG icons go through `svgUrl` in `icons.ts` (cached `blob:` URLs).
    Don't put long `data:` URIs in node data/styles: Cytoscape hashes every
    style string on each restyle, and multi-KB URIs made opening a city ~10× slower.
  - `add/remove/toggleClass` restyle every element passed, changed or not. Use
    `setClass` in `graph.ts`, which only touches elements whose state changes;
    never `cy.elements().removeClass(…)`.
  - `housesByCity()` is memoized; treat its result as read-only.
