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
npm run logos:optimize # shrink oversized raster originals to <=512px when smaller; rebuild map assets
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
src/data/collaborations.ts SOURCE OF TRUTH: dated brand collaborations (2+ houses)
src/data/cities.ts    city → [lat, lng]; every house city must be listed here
src/data/index.ts     derived queries: tenuresAt, movesOf, allMoves, yearRange…
src/data/validate.ts  sanity checks (also run in tests + logged in browser)
src/graph/geo.ts      projection, world SVG markup, city-box placement + overlap removal
src/graph/locations.ts display-only regional pin groups and their anchor cities
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
- **A brand currently on hiatus or paused is inactive and must have an Ended
  year**, just like a brand that has shut down. Set the house's `closed` field
  to the verified year operations stopped or paused, even if the hiatus was
  announced as temporary. Properties displays `Founded: 2006 | Ended: 2023`.
  Research a missing pause year; if it remains unconfirmed, do not guess it,
  and report the gap. Remove `closed` if the brand resumes activity, preserving
  earlier pauses and relaunches in the description.
- **Ids are object keys** (camelCase). `HouseId` is `keyof typeof houses`, so a
  bad `house:` reference in a career is a compile error. Keep the
  `satisfies Record<string, …>` pattern; don't widen to `string`.
- **Every confirmed current role must explicitly use `end: null`**, including
  founder, co-founder and `Other` roles. Never leave `end` omitted, undefined or
  an empty string for a known current role. Omit `end` only when the end date or
  current status is unknown; do not convert unknown roles to current by default.
  Use a numeric end year for a known completed tenure.
  `approximate: true` = unverified years.
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
  - One `marker` node per city, plus display-only regional cluster markers: a pixel-art Win98 pin
    (`icons.ts cityMarkerIcon`) anchored to the city or a region's
    representative anchor city. `graph/markers.ts` spreads colliding pins apart
    in screen space at each zoom, with dotted SVG tethers back to their exact
    geographic anchors; isolated pins keep their tips on the city.
    `graph/clusters.ts` precomputes nested proximity clusters once; smaller cities
    consolidate when zoomed out and split at zoom 0.6, 1.2, 2.4 and 4.8.
    **Major cities always retain their own pins:** five or more main brands
    (excluding sublabels), counted across the full dataset, OR inclusion in the
    explicit `majorCities` list in `graph/locations.ts`. Year/tag filters never
    change major-city status. Open cities also stay out of clusters. Teal cluster
    pins show the sum of eligible main brands and clicking zooms into their area;
    individual city pins open brand grids. Geographic cluster membership stays
    stable across filters. **Only cluster four or more eligible city pins**
    (`MIN_CLUSTER_CITIES`), counting cities rather than brands. Groups of one,
    two or three retain individual pins, including when year/tag filters or open
    grids reduce an existing cluster below four cities. Beirut and Tel Aviv alone
    must never become a cluster.
    House cities, Properties and the directory retain their actual locations.
    City grids, expansion and move endpoints use `mapLocationForCity` /
    `housesByMapLocation`; clustering only affects the marker display. Selection
    reveals individual city grids, so connections never terminate at hidden clusters.
    Pins scale
    with the map when zoomed out but cap at ~26px on screen (`sizeMarkers`,
    re-run on every zoom); colliding labels are hidden via `text-opacity`
    (an empty `label` bypass would *remove* the override) and appear on hover. Clicking a pin
    toggles the city; `DesignerGraph.expanded` holds open cities. An open city's
    houses sit in an invisible `grid` compound in the nearest spot that covers no
    pin or other open city (`geo.ts placeGrids`), with a dotted leader to the pin.
    `move` edges are rebuilt on every expand/collapse: each end attaches to the
    house if its city is open, else to the pin. Selecting a brand hides every
    other location's pin and grid leader, while keeping revealed brand icons
    and their connections visible. Clearing selection restores eligible pins.
    Selecting a brand reveals its
    direct move connections: `autoRevealed` restricts automatically opened cities
    to those brands. If the user manually opened the selected brand's city,
    show only its revealed family when it has visible sublabels at that map
    location; otherwise keep the city's brands visible. Keep an already visible
    parent icon at its current position and place its sublabels beside it.
    Tapping the selected brand
    again clears selection and restores that city's full grid. Other manually
    opened cities stay intact. Changing or clearing
    the selection replaces these automatic reveals. Only the selected brand gets
    an outline; connected brands retain their normal borders. Selecting a designer
    opens their career cities and highlights their houses and moves.
    Opening a group profile reveals its member brands from `housesInGroup` and
    frames them on the map, without expanding their designer connections or
    outlining individual brands. Group reveals also respect year and tag filters.
    Map min zoom: `MAP_MIN_ZOOM` or map-fills-view.
  - Designers aren't nodes; selecting one highlights their career houses and shows their move lines.
  - "Show move lines" checkbox → `DesignerGraph.setShowMoves`: off hides `move`
    edges via the `lines-off` class, including the selected brand’s lines.
    Remembered in localStorage (`designer-map:show-lines`).
  - "Show collaboration lines" → `DesignerGraph.setShowCollaborations`: an
    independent switch remembered as `designer-map:show-collaborations`.
    Collaboration lines are red and dashed, without permanent arrowheads. Selecting a brand reveals its
    recorded partners and pulses outward to each partner, including
    every other participant in a project with three or more brands. Turning
    the switch off hides all collaboration arrows and their automatic reveals.
    The year and tag filters apply to these releases and their endpoints.
    Draw one collaboration line per brand pair, combining repeat releases and
    shared multi-brand projects. Its hover details show the release year, or `(Multiple)`
    when releases through the selected year span more than one distinct year.
    Connection labels appear only on hover in a reserved strip above the canvas,
    never over brand icons. The map's All / Designers / Collaborations filter
    controls both lines and automatic partner reveals. Selected brands show only
    their direct connections. A selected designer shows only that designer's move lines.
    Hide collaboration lines without a brand selection, and hide move lines when
    neither a brand nor a designer is selected, including when cities are expanded or a group is selected.
    A travelling pulse repeats every three seconds on each selected
    line and on hovered connections; designer pulses follow career direction. Respect
    reduced motion and clear pulse resources on relayout and destruction.
    Brand Properties lists the recorded collaboration history through the
    selected year, newest partnership first, with Year, Partner brands and Search
    columns. Repeat partnerships share one row, grouped by the exact set of
    partner brands; a year selector defaults to the latest recorded release.
    Keep individual release years in the data and group only in the interface.
    Search opens Google in a new tab for the selected brand × all partner brands
    plus the release year. Do not display collection names or source links.
- Brand profile descriptions, creative directors, collaboration history and tags
  use matching fieldset headings with clickable expand/collapse buttons. All open
  by default; descriptions show their text in a separate inset box.
  Each newly selected brand starts with these sections expanded. Collaboration descriptions are
  not displayed at all; do not generate descriptions for new collaborations.
  Do not display research/source links in the UI
  or add them to future summaries unless explicitly requested.
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

- Brand descriptions should focus on what the brand is, the clothes and
  accessories it makes, and its style, signature pieces, materials and craft.
  Keep corporate ownership and business details secondary; prefer dedicated
  fields for those facts. See the description guidance in `docs/brand-research.md`.
- **For every brand research, addition or correction, follow
  [the brand research workflow](docs/brand-research.md).** Read it when starting
  that task, including research of the associated designers and career links.
  Prioritize founders and creative roles. CEO and other business-leadership
  research is optional unless the user specifically requests it; preserve
  existing sourced leadership entries.
- For mass-market sportswear and other brands led by executives, record sourced
  brand-wide business leadership using `CEO`, `President` or `Managing Director`.
  These roles appear under Business leadership and never in creative succession.
  Keep exact titles in `roleDetail`, including co-CEO and brand-president scope.
  A parent-company CEO is not automatically the CEO of each portfolio brand.
  Keep separate dated CEO stints for founders who leave or return, and verify
  current appointments rather than assuming an old announcement remains current.
- US and Canadian cities need state/province metadata in `cityRegions` in
  `cities.ts`. Use `formatCity` only in the right-hand directory's city menus.
  Keep map labels and house location fields concise, without state/province.
  Keep plain city keys for coordinates, grouping and graph IDs. Validation
  checks regional coverage.
- House `founders` are designer profile IDs (`as const`), never copied names.
  Names and spelling live in `designers.ts`; `foundersOf` resolves them for links.
  The record mapping in `data/index.ts` type-checks every founder ID. Founding
  associations are distinct from creative-director tenures: a business co-founder
  can have an `Other` career role. Do not invent dates when adding a profile.
  Use `founderHouse` or `founderGroup` for existing corporate founders, and
  `founderOrganization` for a collective or company without a profile.
- Find ignores case, accents, punctuation and whitespace for houses, designers
  and groups. Put alternate/historical brand names in house `aliases` (for
  example, G-Star RAW) instead of changing the displayed name just for search.
- Market positioning runs **High Luxury → Luxury → Premium → Mid-market → Budget**.
  High Luxury covers the upper luxury market, based on sustained pricing across
  core products, exclusivity, materials and craftsmanship, and overall positioning.
  Examples include Dior, Chanel, Hermès, The Row, Loro Piana and Brunello Cucinelli.
  Luxury includes Lemaire, Acne Studios and Jil Sander. These are editorial tiers,
  not an official industry standard or a quality ranking. Judge the brand overall,
  rather than its cheapest entry product, most expensive piece or a collaboration.
  Group ownership, age and the Couture tag do not automatically determine tier;
  couture remains a separate brand/product classification.
- **Exclude one-off collaborations from career tenures and career-move connections.**
  Store brand collaborations separately in `src/data/collaborations.ts`, keyed
  by a stable project/release ID, with `houses` (at least two distinct house IDs)
  and a required release `year`. Optional fields are `name`, `notes` and `sources`.
  New collaborations only need participants and year; do not generate exact
  collection names or descriptions. Existing names and notes may remain as metadata.
  Add separate records for separate releases, including repeat brand pairings.
  Query through `collaborationsOf`, `collaborationsInYear` and `getCollaboration`.
  Capsule collections, limited releases and single brand-to-brand projects
  (for example, Born x Raised × Nike or PLEASURES × Puma) are not career moves.
  Do not add them as `career` entries, including under `Other`, because every
  entry can generate map connections. Record employment, founding and creative
  leadership; include an ongoing design partnership only when sources establish
  a sustained role beyond an individual collaboration. Collaboration context may
  appear in notes without creating a separate tenure or career-move connection. Apply this
  rule when adding, researching or correcting data and updating related tests.
  Dedicated collaboration arrows are derived only from collaboration records.
  The initial 50 releases are an editorial selection of notable projects, not
  a ranked top 50 or complete histories. Use the release year rather than an
  earlier runway presentation or announcement; record the actual participating
  labels, and do not substitute a designer's namesake brand for the person.
- Starter data was written from memory. Verify additions rather than guessing;
  mark uncertain years `approximate`. Source URLs are optional internal research
  metadata; preserve existing metadata, but no need to provide new source links.
- `parentGroup` is the *current* owner, not historical.
  `parentHouse` links a distinct label to its parent fashion house, independently
  of ownership, licences or founding. Each label keeps its own tags, city and
  creative tenures. Do not link sister brands solely because they share an owner.
  The directory nests families; Properties links both directions. On the map,
  labels share their root house’s pin and grid, with only main houses counted in
  pins or shown on city expansion. Selecting a house reveals its direct labels;
  selecting a nested label reveals its ancestry and its own direct labels.
  Search and designer selection can reveal a specific label directly. Year/tag
  filters retain a parent as navigation context when only its labels match.
  Hidden-label career arrows attach to the nearest visible ancestor, while the
  underlying career and actual house locations remain unchanged.
  A group brand list may also include licensed brands or regional operations.
  Record those in sourced `regionalAffiliations` with the relevant territory,
  never as global `parentGroup` ownership. Group profiles display them separately.

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
  - `housesByMapLocation()` is memoized; treat its result as read-only.
