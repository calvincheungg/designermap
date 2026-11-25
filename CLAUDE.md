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
npm test         # logos:prepare, then vitest: data validation + derived-query tests
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
src/data/research-log.ts research bookkeeping: brands with a full collaboration search (read at runtime only by Statistics' Rising and cooling)
src/data/cities.ts    city → [lat, lng]; every house city must be listed here
src/data/index.ts     derived queries: tenuresAt, movesOf, allMoves, yearRange…
src/data/validate.ts  sanity checks (also run in tests + logged in browser)
src/graph/geo.ts      projection, world SVG markup, city-box placement + overlap removal
src/graph/focus-layout.ts placing a selected brand's partners near their cities
src/graph/locations.ts display-only regional pin groups and their anchor cities
src/graph/            Cytoscape: elements.ts (per view), style.ts, icons.ts, graph.ts
src/ui/panel.tsx      React Properties components for house / designer / group
src/ui/listbox.tsx    React Win98 Find combobox (replaces <datalist>)
src/ui/filters.tsx    Start menu "Filter brands" cascade + toolbar chips for active filters
src/ui/side-panel.tsx floating Properties window: move, resize, minimize, close (useParentSize / useWindowGestures shared with the map)
src/ui/map-window.tsx the map's own movable, resizable window frame on the desktop
src/ui/desktop.ts     window manager: Properties, city/country and tool windows (maximize, focus, limits)
src/ui/my-computer.tsx My Computer: drives and folders (locations, brands by market position, groups, designers A–Z)
src/ui/notepad.tsx    Notepad tool window: a plain-text note kept in localStorage
src/ui/task-switcher.tsx Alt+Tab window switcher
src/ui/tool-windows.tsx Recycle Bin (ended brands), Help (map legend) and dev-only What's Missing report windows
src/ui/run-dialog.tsx Start ▸ Run… box: open a brand, designer, group, city, country or year by name
src/ui/recent.ts      Start ▸ Documents: recently opened items (localStorage)
src/ui/desktop-icon.tsx draggable Win98 desktop icon (on the desktop, left column)
src/ui/share-link.ts  shareable view in the URL hash: #brand=…&year=…&<filter>=a,b
src/ui/spreadsheet/     Spreadsheet window: Excel 2000-style workbook (data.ts sheets, select.ts, xlsx.ts writer, grid.tsx, use-* hooks, dialogs, chart, pivot)
src/ui/statistics.tsx  Statistics window (Start menu): filtered totals, tiers, countries, cities, top lists
src/ui/year-chart.tsx  releases-per-year chart, columns or lines (Statistics and brand Properties)
src/ui/settings.tsx   Settings window, in tabs: Map, Connections, Appearance, Accessibility, General (DEFAULT_SETTINGS)
src/ui/explorer-menu.tsx Explorer's File / Edit / View / Go / Favorites / Help menu bar (favorites.ts, use-selection-history.ts)
src/ui/place-path.tsx location path in place windows (Europe ▸ France ▸ Paris)
src/graph/picture.ts, tooltip.ts File ▸ Save Map as Picture… and the map's tooltips
src/ui/tabs.tsx       shared Win98 tabs (Settings, Statistics)
src/motion.ts         reducedMotion(): system setting or Settings ▸ Animations
src/ui/city-window.tsx place windows: scrollable Large Icons grid of a city's or country's main brands
src/ui/map-view.tsx   React lifecycle boundary for DesignerGraph and its context menu
src/ui/start-menu.tsx Win98 taskbar Start menu: lines + connection filter, brand filters, map commands
src/text.ts           shared sorting and accent helpers
src/styles/           stylesheet parts, imported in order by style.css
src/ui/storage.ts     all localStorage access: readSetting, useSetting, useSwitch
src/ui/session.ts     what a page refresh keeps: windows, Explorer, selection, map view (sessionStorage)
src/ui/dialog.tsx     shared modal Dialog and title-bar dragging
src/ui/desk-windows.tsx window titles, icons, sizes and desktop shortcuts
src/ui/use-settings.ts remembered Settings and their effect on the graph
src/ui/lazy-window.tsx windows downloaded separately (lazy-windows.ts lists them)
src/data/notes.ts     descriptions, filled in by production builds only (useNotes)
src/App.tsx           interface state and synchronization with the graph API
src/main.tsx          React root and startup data validation
scripts/collab/       collaboration research tools: todo list, crawl (one or a batch), headline filter, Fashion Press, house lookup, duplicate-safe add, research log
docs/brand-research.md brand and collaboration research workflow
docs/ui.md            map, window and styling behaviour
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
  the Properties window lists it under the collapsible "Other roles (N)" section, and tests use `directorsOf`.
  Use the director roles only for real house/line leadership. Separate stints = separate entries.
- Houses have `website` (full URL; validate.ts checks the format; `''` when none), shown as a link,
  `instagram` (handle only, no @ or URL; shown as an @handle link under the website;
  every house has the field, `''` when unknown, like `logo`),
  and `logo` (file in public/logos/ or full URL; falls back to the initials square).
  When researching any brand, look up both its official website and Instagram.
- A house with no founder yet is fine: `researchTodos()` lists it in the browser
  console instead of failing tests. Don't invent founders to fill it.
- **Map and interface behaviour is documented in [docs/ui.md](docs/ui.md).** Read the
  matching section before changing `src/graph`, `src/ui`, `src/App.tsx` or
  `src/style.css`, and record behaviour changes there rather than here. Rules that
  always apply:
  - `MapView` creates `DesignerGraph` once per mount. Keep its callbacks stable: UI
    updates must not rebuild the engine, and cleanup must call `destroy()`.
  - Keep data queries and graph layout independent of React; interface changes use
    React components and events, not HTML strings or DOM mutation.
  - Major-city pins and geographic clusters come from the full dataset, so year and
    tag filters never change them.
  - Move lines come only from careers, and collaboration lines only from
    `collaborations.ts`. Selecting a brand shows only its direct connections.
  - Never display collaboration descriptions or research/source links.
  - Use 98.css classes before custom CSS, and the `--cursor-*` tokens rather than bare
    `default`/`pointer`. The palette is Windows 98's.
  - Any new map colour needs a night counterpart, and layouts must work at phone width.
  - Respect reduced motion through `reducedMotion()` / `data-motion`, never the media query directly.
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
  For requests that only ask for a brand's collaborations, use its short
  "Collaboration-only lookups" section instead of the full workflow. Every
  collaboration search is comprehensive by default: crawl the brand's whole
  Hypebeast archive to its last page, as that section describes. Use the tools in
  `scripts/collab/` instead of writing new crawl or insert scripts.
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
- A brand founded in a different city from its current base records
  `origin: { city, country }`; `city` stays the current base. Dated changes
  live in `history` (oldest first, `HouseEvent` in types.ts): `moved` (year
  optional when unsourced; the last move must be to `city`), `acquired`
  (`group` links a profile, `buyer` names it), `spunOff`, `renamed`,
  `relaunched`, `other`. `approximate: true` = inferred year, e.g. the year a
  parent in the new city bought the brand. Validation requires date order and
  that the latest acquisition/spin-off group equals `parentGroup`. Brand
  Properties shows a collapsible History table (Founded → events → Ended).
  `origin.city` and `moved` event cities are typed as `CityName` (the `satisfies`
  type at the end of houses.ts), so a city missing from cities.ts fails `npm run check`.
  The Settings window's "Show brands at: Current base / Origin" radios call
  `setLocationMode` in `graph/locations.ts` and remount `MapView` (keyed by
  mode), so `mapLocationForHouse`/`housesByMapLocation` place each root brand
  at its origin; labels follow their root. Properties shows an Origin row;
  My Computer keeps current bases. Remembered as `designer-map:location-mode`.
- US and Canadian cities need state/province metadata in `cityRegions` in
  `cities.ts`. My Computer files US and Canadian brands in state / province folders from `cityRegions`; `formatCity` is not used for display.
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
- Brand category `Retailer` marks a brand that is also a store stocking other
  brands (DSM, Union LA, Bodega, Kith, BEAMS). It sits alongside the brand's
  other categories. Don't add it to retail chains that sell only their own labels.
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
  Production builds strip `sources` arrays from houses/designers/collaborations
  (`scripts/strip-sources.mjs`), so keep them plain string-literal arrays and
  never read them at runtime. Browser data validation runs in dev only.
- `parentGroup` is the *current* owner, not historical.
  `parentHouse` links a distinct label to its parent fashion house, independently
  of ownership, licences or founding. Each label keeps its own tags, city and
  creative tenures. Do not link sister brands solely because they share an owner.
  My Computer lists labels in their city folders ("Label of …"); Properties links both directions. On the map,
  labels share their root house’s pin and grid, with only main houses counted in
  pins or shown on city expansion. Selecting a house reveals its direct labels;
  selecting a nested label reveals its ancestry and its own direct labels.
  Search and designer selection can reveal a specific label directly. A selected
  brand's move or collaboration partner that is a label opens on its own, without
  its parent unless the parent is itself involved. Year/tag
  filters retain a parent as navigation context when only its labels match.
  Hidden-label career arrows attach to the nearest visible ancestor, while the
  underlying career and actual house locations remain unchanged.
  A group brand list may also include licensed brands or regional operations.
  Record those in sourced `regionalAffiliations` with the relevant territory,
  never as global `parentGroup` ownership. Group profiles display them separately.

## Gotchas

- TypeScript 7 and Vite 8; `lib` is ES2024 (for `Map.groupBy`).
- Logo files must really be the format their extension says (JPEG XL saved as
  `.png` has slipped in before). `logos.test.ts` fails when a logo is missing or
  undecodable. Logo URLs are `encodeURIComponent`-encoded, so names like `99%is.jpg` work.
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
