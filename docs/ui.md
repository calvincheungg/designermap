# Map and interface

How the map, windows and styling work. Read the matching section before changing
`src/graph`, `src/ui`, `src/App.tsx` or `src/style.css`, and keep it up to date.
Architecture and data rules are in [CLAUDE.md](../CLAUDE.md).

## Map and profiles

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
    `graph/clusters.ts` precomputes nested clusters once. Below zoom 1.2, a country's
    smaller cities share one country pin, except that the US and Canada, being so large,
    use state / province pins (`cityRegions`) at every width; below 2.4 and 4.8 cities cluster by proximity, never
    across a border; beyond that every city has its own pin. Country pins sit in the
    middle of the country's largest landmass (`countryCenter` in geo.ts; an inland point near
    the centroid when that falls outside, as in Vietnam); state pins, and countries too small for the
    map, use their most central city. Both are labelled with the area's name ("Italy"), though their
    count leaves out major cities.
    **Major cities always retain their own pins:** `MAJOR_CITY_BRANDS` (five) or more main
    brands (excluding sublabels), counted across the full dataset. There is no
    hand-picked list. Year/tag filters never change major-city status. Open cities also stay out of clusters. Teal cluster
    pins show the sum of eligible main brands and clicking one shows all its cities;
    individual city pins open brand grids. The `TOP_CITY_COUNT` (10) map locations with
    the most main brands across the full dataset (`topCities`, ties by name; marker data `top`)
    get a red pin face (`TOP_CITY_FACE`, white digits); open cities stay navy. Geographic cluster membership stays
    stable across filters. Country and state pins need
    two or more cities (`MIN_AREA_CITIES`), proximity pins four (`MIN_CLUSTER_CITIES`),
    counting cities rather than brands. Smaller groups keep individual pins,
    including when year/tag filters or open grids reduce an existing cluster. Beirut
    and Tel Aviv must never share a cluster.
    One click on a cluster frames it and shows all its cities as
    individual pins (`openCluster`), whatever the zoom, until the map zooms back
    out or another cluster is clicked.
    House cities, Properties and My Computer retain their actual locations.
    City grids, expansion and move endpoints use `mapLocationForCity` /
    `housesByMapLocation`; clustering only affects the marker display. Selection
    reveals individual city grids, so connections never terminate at hidden clusters.
    Pins scale
    with the map when zoomed out but cap at ~26px on screen (`sizeMarkers`,
    re-run on every zoom); colliding labels are hidden via `text-opacity`
    (an empty `label` bypass would *remove* the override) and appear on hover. Clicking a pin opens a
    city window (Settings "Clicking a city pin opens it: In windows", the default) or, with "On map"
    (`designer-map:city-view`, read via a ref so the graph is never rebuilt),
    toggles the city on the map; `DesignerGraph.expanded` holds open cities. An open city's
    houses sit in an invisible `grid` compound in the nearest spot that covers no
    pin or other open city (`geo.ts placeGrids`), with a dotted leader to the pin.
    `move` edges are rebuilt on every expand/collapse and selection change, and
    only for the selected brand (its direct lines) or designer (their career);
    none exist without a selection. Each end attaches to the
    house if its city is open, else to the pin. Selecting a brand hides every
    other location's pin and grid leader, while keeping revealed brand icons
    and their connections visible. Clearing selection restores eligible pins.
    Hidden pins take no room then: each revealed city's brands are centred on that city, or as near
    as they fit (`focus-layout.ts placeFocused`, through `layoutMap`'s `focus`), around the selected
    brand, its ring and its pin. Cities the user opened keep their places.
    Selecting a brand reveals its
    direct move connections: `autoRevealed` restricts automatically opened cities
    to those brands. If the user manually opened the selected brand's city,
    show only its revealed family when it has visible sublabels at that map
    location; otherwise keep the city's brands visible. Keep an already visible
    parent icon at its current position and place its sublabels beside it.
    Tapping the selected brand
    again clears selection and restores that city's full grid. Other manually
    opened cities stay intact. Changing or clearing
    the selection replaces these automatic reveals. The selected brand gets the
    navy focus outline; its visible partners get the border of the line reaching
    them (`move-partner`: solid navy, `collab-partner`: dashed red; both = navy
    border plus a red dashed `outline`), set in `applySelection`. Selecting a designer
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
    Connection labels are never drawn on the canvas (no text strip above the map;
    `onConnectionHover` stays available for callers). The Start menu's All / Designers / Collaborations connection filter
    controls both lines and automatic partner reveals. Selected brands show only
    their direct connections. A selected designer shows only that designer's move lines.
    Hide collaboration lines without a brand selection, and hide move lines when
    neither a brand nor a designer is selected, including when cities are expanded or a group is selected.
    A travelling pulse moves at a constant on-screen speed (`PULSE_SPEED`) and repeats on each selected
    line and on hovered connections; designer pulses follow career direction.
    Designer-move pulses are a bevelled navy Win98 block; collaboration pulses are a
    revealed Minesweeper cell showing the number of releases with that partner
    through the selected year (edge `count`), in the classic number colours for
    1–7 and bright orange (`#ff8c00`) above seven.
    Pulses draw in an SVG layer between the map and the Cytoscape canvas, so brand
    icons and labels sit on top of them. Stacking is map → line → block → brands:
    each pulsing line is redrawn (colour, dash, arrowhead, capped width) in the
    layer's trace group under its block, and the canvas edge gets `traced`
    (`line-opacity: 0`) so it still handles hover. Pulses are never circles; they grow with the map when
    zooming in (never below its zoom-1 size when zoomed out), and
    hovering only adds or removes that line's own pulse, never restarting running ones. Respect
    reduced motion and clear pulse resources on relayout and destruction.
    Brand Properties lists the recorded collaboration history through the
    selected year, newest partnership first, with Year, Partner brands and Search
    columns. Repeat partnerships share one row, grouped by the exact set of
    partner brands; a year selector defaults to the latest recorded release.
    Keep individual release years in the data and group only in the interface.
    Above the table, a line graph (`YearChart` with `lines`, in `ui/year-chart.tsx`, shared with Statistics) counts every
    recorded release per year through the selected year. It appears from two release years up; clicking a
    column puts that year in the Find box (shown then even for short lists), clicking it again clears it.
    Search opens Google in a new tab for the selected brand × all partner brands
    plus the release year. Do not display collection names or source links.
- Brand profile descriptions, creative directors, other roles, collaboration history and tags
  use matching fieldset headings (counts shown as "Creative directors (N)", "Other roles (N)") with clickable expand/collapse buttons. Other roles starts collapsed; the rest open
  by default; descriptions show their text in a separate inset box.
  Clicking the brand's logo (top left) selects and frames it on the map (`onShowOnMap`).
  Each newly selected brand starts with these sections expanded. Collaboration descriptions are
  not displayed at all; do not generate descriptions for new collaborations.
  Do not display research/source links in the UI
  or add them to future summaries unless explicitly requested.
- Cytoscape caches the canvas's screen rect and only refreshes it on resize; `graph.ts`
  invalidates it on each press/wheel/hover entry, or presses after moving the map window are ignored.
  The core `active-bg` press circle and `:active` overlays are off (`style.ts`).
- The world map is an SVG *under* the Cytoscape canvas, drawn in model
  coordinates and kept aligned by mirroring pan/zoom onto an SVG `<g transform>`
  (`syncMapLayer`). Use the SVG attribute, not a CSS transform, or
  `non-scaling-stroke` stops working. Don't draw map features as Cytoscape nodes.
- Past zoom 1, edge width/arrows are capped on screen (`scaleEdges`, run
  on zoom and after selection) since Cytoscape sizes them in model units.
  Map zoom range: MAP_MIN_ZOOM (or map-fills-view) to 8.

## Windows and styling

- Map options live in the taskbar Start menu (`StartMenu`), styled after
  `public/assets/start_menu.gif`: navy side banner, 32px pixel icons
  (`ui/start-icons.tsx`), etched separators, navy highlight rows and black
  submenu arrows. "Connection lines" is a cascading
  submenu (CSS hover/focus-within) with menu bullets/check marks; Expand all,
  Statistics, Spreadsheet, Notepad, My Computer, Settings, Help, Run… and Reset View are commands that close the menu.
  Ctrl+Esc opens or closes the Start menu from anywhere.
  "Documents" (first) lists the last `MAX_RECENT` (10) brands, designers, groups
  and places brought to the front (`ui/recent.ts`, `designer-map:recent`); items
  the filters hide are disabled, and Clear Documents empties it. Run… opens the
  Run tool window (`RUN`, type `run`, `RunContent`): a normal desktop window
  (drag, resize, minimize, close, taskbar button) that stays open after running,
  keeping its last entry, with the opened window in front. Enter runs the best match, exact names
  first (`matchingItems(…, exactFirst)`; the taskbar Find keeps its order),
  4-digit years set the year, unknown names show Win98's "Cannot find" message,
  Cancel closes it and Browse… opens My Computer. Help is a tool window (`HELP`, type `help`; icon `public/assets/help.webp`, a transparent 32px icon cut from `help.jpeg`)
  with the pin/line/pulse legend. Reset View clears selection, filters, year,
  connection filter, every window and open city, then fits the map; display
  settings (lines, Show brands at, Open cities) stay. Minesweeper colours live
  in `graph/minesweeper.ts` so UI code can use them without the graph engine. Escape and outside
  clicks close it. The Start button's flag is cropped from
  `public/assets/start_logo.jpg`. Find sits in the taskbar beside Start
  (`.taskbar-search`, placeholder "Search"): its suggestions open upward and
  appear only once the user types (`SearchBox previewAll={false} dropUp`); city
  windows' Find still lists every brand. The year slider and Play live in the
  clock's pop-up (`ui/year-tray.tsx YearTray`); the clock shows the time and short date (long date in its tooltip; date hidden on phones), and a set year shows beside the
  time. Everything above the taskbar is the `.desktop-area`: desktop icons,
  the map window and every other window are siblings there, measured and kept
  inside it. The map is its own window (`#map-window`, `ui/map-window.tsx
  MapWindowFrame`): a title bar with the "e" icon (`ie4.webp`), Minimize,
  Maximize/Restore (or double-click the title; remembered as
  `designer-map:map-window`) and Close. Drag its title bar to move it and its
  grip to resize it (rect remembered as `designer-map:map-window-rect`; by default
  it fills the area right of the icon column, `ICON_COLUMN`). It always sits under
  the other windows, even when clicked (a maximized map would otherwise cover them all); only the
  other windows come to the front when clicked. Minimized/closed it stays laid out but `visibility: hidden` +
  `inert`, so the graph keeps its size. Its taskbar button toggles minimize; Close
  removes that button and the desktop's Explorer icon reopens it. Other windows
  open, restore and focus without it; only a new map selection (search, Show on
  Map, links) reopens it. Desktop icons (`desktopShortcuts` in App: My Computer,
  Explorer, Recycle Bin — `type: 'system'` — then Statistics, Spreadsheet, Settings, Notepad) stack down
  the desktop's left edge under every window, in `arrangeIcons` order (in the `.desktop-icons` layer; a maximized map covers them, and
  Quick Launch and the Start menu still open the same things),
  laid out by `DesktopIcons` (`ui/desktop-icon.tsx`): drag across bare desktop for a dotted rubber band
  (Ctrl/Shift adds; Ctrl+click toggles), dragging a selected icon moves the whole selection, and
  right-click gives a Win98 menu (Open — every selected icon — Select All, Line Up Icons, Reset Position); positions remembered as
  `designer-map:desktop-icon:<name>`. Right-clicking the bare desktop opens its own menu: Arrange Icons by
  Name / by Type (`designer-map:desktop-arrange`; both also line the icons up), Line Up Icons, Refresh
  (the icons blink off for a frame and are kept on screen), then App's `desktopActions`: New Text Document
  (Notepad) and Properties (Settings). The same shortcuts appear as 16px Quick Launch
  buttons (`.quick-launch`, "Launch <name>") between Start and Search; on phones the
  desktop icons are hidden and only Quick Launch remains. The toolbar holds only the
  removable chips for active filters and is hidden (`.toolbar:empty`) unless filtering.
- City windows (`CityWindowContent`) list a pin's main brands (no sublabels)
  within the year/tag filters as Win98 desktop icons in the map's grey frame;
  clicking one opens its Properties. A Find box (the shared `SearchBox`, with
  `limit={Infinity}` so its dropdown lists every brand) narrows the grid as you type.
  A city window is always `CITY_GRID_COLUMNS` (4) icons wide and just tall
  enough for its brands, up to `CITY_GRID_ROWS` (4) rows (`cityWindowSize`);
  larger places scroll. Windows are always wide enough for a scrollbar, so rows of four never wrap, and the columns are centred in
  what it leaves, so the padding is even (at least 16px a side) with or without one.
  Under Find, a toolbar holds View (Large Icons / Details), Sort by (Name /
  Founded oldest first / Tier from High Luxury down; `sortPlaceBrands`, unknowns
  last, ties by name; each section sorts on its own) and Show on Map, which calls
  `DesignerGraph.showCities` to open the place's map locations as full grids
  (other open cities stay) and frame them. Once all of them are open the button is Hide
  (`hideCities`; `openCities` in App comes from `onExpandChange`). View and Sort are shared by every
  place window and remembered as `designer-map:place-view` / `designer-map:place-sort`.
  Details is a table (Name, Founded, Tier) whose headers also sort. Right-clicking
  a brand (icon or row) opens a `ContextMenu`: Open (Properties), Show on Map
  (selects and reveals it without opening Properties) and Open <city>/<country>
  for its base, omitting the place the window already shows.
  Place windows pass `minSize={cityWindowSize(1)}` instead of the Properties minimum. They don't change the map selection. A window opened by clicking a city pin opens beside the pin (`openItemAt` stores the pin's
  screen box as the window's `anchor`; `side-panel.tsx anchoredRect` puts it to the right, or left near the edge, and a reused
  window moves to the new pin); place windows opened any other way cascade from the left edge,
  and up to `MAX_LOCATION_WINDOWS` stay open, the least recently used reused.
  Country windows (`Place` kind `country`) list a country's main brands the same
  way. In brand Properties, "Based in" city and country and the Origin city and
  country are links (`onOpenPlace`) that open these windows; cities open their map
  location (`mapLocationForCity`). Place windows also list main brands founded
  there but based elsewhere now (`placeOrigins`), under a "Founded here, now based
  elsewhere" divider, so an origin link never opens an empty window. Brands with
  no `origin` were founded in their `city`: don't copy the base into `origin`. Place windows are never closed by filters.
  "Filter brands" (group ▸ checkboxes) and the connection filter live in the Start menu.
- The map always fills its window. Properties windows float on the desktop above it
  (`PropertiesWindow`): drag the title bar to move, the corner grip to resize,
  Maximize / Restore (or double-click the title bar; `PropertyWindow.maximized`,
  `desktop.ts toggleMaximized`, kept through a refresh); they stay inside the desktop area. Every
  window has Minimize, Maximize and Close (X). The taskbar (`ui/taskbar.tsx TaskGroup`)
  has one button per window type (Brands, Designers, Locations, each tool): a lone window
  gets a plain button (restore / minimize-if-active / focus, as in Win98); two
  or more collapse into one counted button whose pop-up menu lists them, and
  picking one restores and focuses it; each row has an X that closes that window.
  Right-clicking a button (or a row in the group list) opens a Win98 window menu
  (`ContextMenu`): Restore, Minimize, Maximize / Restore Size, Show on Map (brands/designers/groups),
  Close Other Windows (same type), Close; a grouped button offers Restore All,
  Minimize All and Close All (`desktop.ts restoreWindows/minimizeWindows/closeWindows`).
  - Keyboard shortcuts (App): Alt+Tab / Alt+Shift+Tab hold-and-release switching (`useTaskSwitcher`,
    `TaskSwitcher`: every desk window plus the map window `MAP_KEY`, most recently used first;
    Escape cancels), Alt+F4 closes the active window (the map window when none is active), F1 opens Help.
  - My Computer (`desktop.ts MY_COMPUTER`, tool type `computer`; icon `public/assets/my_computer.webp`, a transparent 48px icon cut from
    `my_computer.jpg`, drawn with `.smooth-icon` scaling; Start menu, desktop icon, Quick Launch,
    Run's Browse…) replaced the old Directory. `listFolder(path, visibleHouses)` builds each folder:
    the root holds Locations (C:), Brands (D:), Groups (E:), Designers (F:) and Control Panel (opens Settings); C: is
    continent (`countryContinents` in countries.ts) ▸ country ▸ city ▸ every brand based
    there, labels included — except the USA and Canada, filed by state / province (`cityRegions`) ▸ every brand
    there, each with its city in Info; D: has a folder per market position (High Luxury → Budget, only tiers
    with visible brands) listing its brands with their city; E: is each group's brands; F: files designers by first letter (`letterOf`).
    Everything follows the year/tag filters; a folder that empties falls back to its nearest ancestor
    (`nearestFolder`). Back / Forward / Up (Backspace, Alt+←/→), an Address field (`C:\Europe\France\Paris`; each part is a link to that folder, the icon to My Computer),
    Large Icons / Details (`designer-map:computer-view`); the path is remembered as `designer-map:computer-path`.
    Folders use `public/assets/folder.webp` (`FOLDER_ICON`, a transparent 32px icon cut from `folder.jpg`;
    city/country windows use it in Alt+Tab too). Clicking a brand or designer opens its Properties; right-click offers Show on Map, the city/country
    window, or a group's Properties.
  - Saving a file (Notepad's Save As…, Spreadsheet's Save As CSV… and its toolbar Save) always goes through
    `SaveAsDialog` (`ui/save-as-dialog.tsx`): a File name box (default `Untitled` / `Designer Map - <sheet>`)
    with the extension locked beside it, a fixed Save as type, Save / Cancel. `cleanFileName` drops
    characters Windows forbids and a typed copy of the extension.
  - Notepad (`NOTEPAD`, tool type `notepad`, "Untitled - Notepad", icon `public/assets/notepad.webp`): a black-on-white textarea under a File / Edit /
    Search / Help menu bar, in a heavy black monospace (Fixedsys-like, weight 600). Text size: 16px by
    default, from `NOTEPAD_FONT_SIZES` via Edit ▸ Set Font… or Settings ▸ Notepad (App state, remembered as
    `designer-map:notepad-font-size`). The text and Word Wrap are remembered in this browser (`designer-map:notepad`,
    `designer-map:notepad-wrap`). File ▸ New asks Yes / No / Cancel before clearing (Yes saves first), Save As…
    opens the Save As box, Exit closes; Edit ▸ Time/Date (F5); Search ▸ Find… with Find Next (F3).
  - Up to `MAX_PROPERTY_WINDOWS` brand/group windows and, as a separate
    window type (`desktop.ts windowType`), up to `MAX_DESIGNER_WINDOWS`
    designer windows, cascaded from the right edge (designers continue the cascade
    after the brand slots). A newly opened (or reused) brand window instead opens beside its city:
    after `graph.select`, App asks `DesignerGraph.locationBox` for the city pin plus the brand icon
    (using the view a reveal animation will settle on) and `anchorWindow` places it like a city window;
    it cascades when the city is outside the map view. Each type reuses only its own windows. Brand, designer and group
    windows pass `fitHeight`, opening just tall enough for their content (capped
    by the desktop area) and following it until the user moves or resizes them. Brand
    windows stop at the Tags heading (`ProfileSection fold` → `[data-fold]`), so
    tags need a scroll, unless that would be shorter than the minimum height. Selecting an item focuses its open window, else opens one;
    a fourth item of a type reuses that type's least recently used window. Clicking a window
    brings it forward and highlights its item on the map; closing the active
    one moves the map selection to the next window (or clears it). Windows
    whose item the year/tag filters hide are closed.
  - Tool windows (`desktop.ts ToolItem`, one each, each its own window type and
    taskbar button): Statistics, the Recycle Bin and What's Missing. The Recycle
    Bin and Statistics desktop icons sit on the desktop. Clicking the Statistics icon opens Statistics; a Recycle Bin click (not a drag) opens the window
    of brands with an Ended year, within the filters, newest first. It's a Win98 Explorer folder
    (`RecycleBinContent`, reusing the place window's layout and `BrandIcon`): the ended brands are files
    in a Large Icons grid four wide (`recycleBinSize`, from `cityWindowSize`), or Details with Win98's
    Name / Original Location (city, country) / Date Deleted (Ended year) columns; View and Arrange icons
    are remembered as `designer-map:recycle-view` / `designer-map:recycle-sort`. Clicking a file opens
    its Properties; right-click offers Properties and Show on Map. What's Missing
    (Start menu, `import.meta.env.DEV` only) lists research gaps across all brands:
    no founder of any kind (`housesWithoutFounder`: person, brand, group or organization), likely missing origins (`missingOriginCandidates`), and no
    founding year, logo, website or Instagram.
  - Spreadsheet (`desktop.ts LIST_VIEW`, tool type `list`): an Excel 2000 workbook ("Designer Map.xls"),
    opened from the Start menu, its desktop icon or Quick Launch (
    icon `public/assets/excel.webp`, cropped from `excel.jpg`). The code is in `ui/spreadsheet/`: `data.ts` holds the sheets
    and sheet operations (no React), `dialogs.tsx` the pop-ups, `spreadsheet.tsx` the window, `grid.tsx` the
    worksheet. The window's hooks build on each other: `use-workbook` (remembered state), `use-popups`,
    `use-sheet-view` (columns, listed rows, panes), `use-selection`, `use-commands`, `use-grid-drag`; then
    `menus.ts` and `keys.ts`. `GridRow` is memoized: give it primitives or stable objects (its handlers go
    through `useStable`), or every row redraws on each selection change.
    - Sheets (`SHEETS`, each a `defineSheet` of columns with `values`, a default `width` and optional
      per-value `links` / in-cell `menu`, `year` for decade grouping): Brands (incl. Website, Instagram,
      Current creative director, Creative directors, Collaborations and Sublabels — creative counts exclude
      `Other` and business roles; the last two have in-cell lists), Groups, Designers, Careers
      (one row per tenure), Collaborations (one row per release, newest first; no names or notes) and
      Locations (Brands = count of brands based there with a drop-down listing them all, Alt+↓).
      Tabs, arrows or Ctrl+PgUp/PgDn switch. Sort, filters, search, active cell, widths, column order,
      frozen panes, formats and hidden columns are kept per sheet. `listRows` is the one pipeline (sort →
      search → filter → hidden rows → subtotals → collapse) the grid, PivotTable and exports share.
    - Menus File (Save As Excel Workbook…: every sheet as listed, `xlsx.ts`, a dependency-free zip
      writer keeping links, widths, panes, AutoFilter, outlines, tab colours and formats; Save As CSV… of the
      shown rows/columns), Edit, View (formula bar, gridlines, Full
      Screen, zoom presets 50–200%),
      Format (AutoFit, Hide/Unhide columns, Reset widths, Grey Out Ended Brands: grey cell fill),
      Data (Sort… with Sort by / Then by / Then by, AutoFilter, Show All, Subtotals…), Window (Freeze Panes
      at the active cell, Freeze First Column — on by default — and Unfreeze; `MAX_FROZEN` keeps panes
      from filling a narrow window), Help. Toolbar: Save, Sort ↑/↓, AutoFilter, Show All, Zoom.
    - AutoFilter drop-downs: (All), (Top 10...) on number columns (top/bottom, items/percent, ties
      kept), (Custom...) with two conditions joined by And/Or, values from rows the other columns
      leave, (Blanks)/(NonBlanks). Tick boxes (or Ctrl+click, Space) choose several values, applied with OK;
      clicking a name picks just that one. Blue row numbers while narrowed; "N of M records found".
    - The formula bar shows the active cell and doubles as the sheet's search (`searchSheet`; ✕ clears).
    - Range selection: shift-click, drag, Shift+arrows, column letters or row numbers (drag or shift-click
      for several), the corner box or Ctrl+A. Dragging past an edge scrolls. Browser text selection is off in
      the sheet, a press keeps focus on the grid (so Ctrl+C always copies the cells), and a drag or
      shift-click never follows a link. One border surrounds the range (`rangeClass`). Ctrl+click (⌘ on a Mac)
      adds areas; Copy needs them to line up (`copyBlock`). Ctrl+Space / Shift+Space select columns / rows,
      Ctrl+Arrow stops at the edge of filled cells (`blockEdge`), and Tab / Enter walk the active cell
      (`cursor`) through a selection (Enter opens the record when only one cell is selected). The status bar's AutoCalculate shows Count, plus Sum/Average/Min/Max over number columns
      (`rangeStats`); Ctrl+C copies the range as tab-separated text (`rangeTsv`) and
      as an HTML table with links (`rangeHtml`; records link to their share link), inside a moving dashed
      border (still under reduced motion) until Esc or the list changes.
    - The Name Box and Go To… (Ctrl+G, F5) take D200, A1:C50, B:D, 5:9 or several with commas. Find…
      (Ctrl+F, Shift+F4 for the next) is a modeless dialog; Edit ▸ Search goes to the formula bar.
    - Subtotals (`subtotalLines`) are synthetic rows (`SheetRow.subtotal`): the grouping column always sorts
      first, level buttons 1 2 3 sit in the corner, −/+ in the total's row number. AutoCalculate skips them.
    - Conditional Formatting… gives a column one format: data bars, colour scale, a colour per value, or
      a highlight (`formatPainter`). Selection tint shows over it.
    - Dragging a wholly selected column's letter moves the selected columns (also Move Left / Right);
      letters follow position. Column commands act on every selected column (`columnsFor`).
    - Right-click a row number: Open, Show on Map, Copy, Hide / Unhide Rows. Right-click a tab: Hide /
      Unhide, Tab Color…, Save As CSV…, Select All. Opening a hidden sheet shows its tab again.
    - Insert ▸ Chart… / the Chart Wizard button (`chart.tsx`): a draggable chart object over
      the sheet counting the listed rows by one column (bar or column, top N with the rest noted under
      the plot, by count or column order, decades for year columns). It follows filters and search live;
      clicking a bar filters the sheet. Excel 2000 look: grey plot, periwinkle bars, yellow chart tips.
    - The PivotTable tab (`pivot.tsx`, `pivotTable`): Count of any sheet's records by a row and an
      optional column field, Grand Totals counting records once, rows by total or label, decades, and
      optionally only the rows the source sheet lists. Clicking a count opens the source sheet filtered to
      exactly those records. Data ▸ PivotTable Report… starts one from the active column.
    - Right-click a cell: Open, Show on Map (no Properties), Copy, Filter by "value", Sort. Right-click
      a column letter or field: Sort, AutoFit, Hide/Unhide, Clear Filter. Hidden columns keep letters.
    - Columns open at their default widths. Drag a letter's right border to resize (min
      `MIN_COLUMN_WIDTH`); double-click it to AutoFit to the widest entry (`autoFitWidth`, canvas-measured).
    - The layout is remembered per browser (`designer-map:list-view`, `readLayout` validates it against
      the current columns): active sheet, each sheet's sort, widths, column order, frozen panes, formats and hidden columns, tabs, zoom and the
      View/Window/Format toggles, Full Screen and the PivotTable layout. Filters, search, ranges, hidden
      rows, subtotals and charts are not remembered.
    - Zoom: toolbar box (presets plus any custom value), View menu, or click / right-click the status
      bar's zoom field for a slider (`ZOOM_MIN` 25 – `ZOOM_MAX` 200, steps of 5).
    - Full Screen (View menu, the title bar's Maximize/Restore button, or double-clicking the title
      bar): App's `listFullScreen` passes `maximized` to `PropertiesWindow`, which then fills the desktop
      area and can't be moved or resized until restored. It is Spreadsheet's Maximize; other windows use `PropertyWindow.maximized`.
    **All of it is local to the workbook**: it ignores the map's year/tag filters and never changes
    them. Rows are virtualised (17px rows, scaled by zoom).
  - Share links: the URL hash holds the selection, year and tag filters
    (`share-link.ts`); it's read at startup and on `hashchange`, rewritten with
    `history.replaceState` as the view changes (not during Play), so the address
    bar URL is always the shareable link.
  - The map can be dragged up to `OVERSCROLL` (40% of the view) past each edge,
    so border places like Japan can reach the centre from under a window
    (`graph.ts clampPan`, run on every viewport change; programmatic changes clamp
    hard). Dragging past that allowance meets rubber-band resistance (at most
    `RUBBER_BAND` px) and springs back on release (`releasePan`; instant with
    reduced motion).
  - One Statistics window (`desktop.ts STATISTICS`, window type `stats`), opened
    from the Start menu or its desktop icon. It follows the year/tag filters, isn't a map selection
    (`isSelectionItem` excludes it with place windows), and its names open the
    matching brand, designer, city or country window. The Most collaborations
    and Top partnerships tables each have an "Include retailer collaborations"
    checkbox beside their Show picker (`designer-map:stats-retailer-collabs` /
    `designer-map:stats-retailer-pairs`, on by default) that drops releases with a
    `Retailer`-category participant (`involvesRetailer`) from that table only; the
    overview total, Collaborations by year, the map and Properties keep every release.
    Win98 tabs (shared `Tabs` in `ui/tabs.tsx`, `designer-map:stats-tab`; a panel mounts when first opened and stays mounted): Overview,
    Collaborations, Connections, People, Brands & places. Shared tables and controls are in `ui/stats-shared.tsx`
    (`SortTable`: sortable columns, openable rows), derived data in `ui/stats-data.ts` (no React), sections in
    `stats-connections.tsx` and `stats-trends.tsx`:
    Degrees of separation (shortest chain, ties by most releases), Who collaborates with whom (heatmap of distinct
    pairs; a cell lists them), Top partnerships (releases, active years, span), Rising and cooling (last N full years
    against the N before; only brands with a complete entry in `research-log.ts` dated after the period), Talent
    incubators (people in an `Other` role who first led a house outside the family later), Brands founded by decade
    and Where brands move (origin → current base). Collaboration sections each remember their own retailer checkbox.
    Most diverse collaborators (`DiversitySection`, scoring in `ui/collab-diversity.ts`) ranks brands by how varied
    their distinct partners are in category, market position and country. Rank by Variety (chance two partners
    picked at random differ; multi-category partners split their weight) or Number reached; Overall averages the
    percentiles of the ticked measures among brands with at least Min. partners (20 by default; smaller samples dominate Variety). Clicking a row lists its
    partner counts. Remembered as `designer-map:stats-diverse-mode` / `-include` / `-min` and
    `designer-map:stats-retailer-diverse`. Narrow windows drop the bars, then all but the sorted column (container queries).
    Collaborations by year (`YearSection`): empty runs over `CHART_GAP_YEARS` (10) collapse
    into one `≈` column; hover shows exact counts; clicking a column lists that year's releases.
    "Colour by" (`designer-map:stats-year-breakdown`) stacks bars by partner type
    (`partnerType`: luxury × streetwear, then retailer, then sportswear, else other) or
    first-time vs repeat pairing (`pairingKind`, against every recorded release, not the filters).
    "My tags…" (`TagSeriesPicker`) lets the user add up to `MAX_TAG_SERIES` (6) series from two searchable
    tag boxes (every filter tag, hint = its group): one tag = a release with a brand tagged it; two tags = a brand
    tagged the first with a *different* brand tagged the second (`matchesSeries`). A release counts under the
    first series it matches (chip order), else Other. Series show as removable chips, remembered as
    `designer-map:stats-year-tags`.
    The chart (and its year list) leaves out releases dated after the current year (`chartedReleases`), noting
    how many under it, so announced releases don't end the chart in a cliff; other Statistics totals keep them.
    "Chart" (`designer-map:stats-year-style`): Bars, or Lines (`ChartLines`: an SVG of one polyline per colour
    with square markers over the columns, which still handle hover, tooltips and clicks; each line is that
    colour's own count or share, scaled to the highest line; lines break at collapsed gaps and left-out years).
    "Show as" (only when the chart has colours, i.e. not Total; `designer-map:stats-year-scale`): Count, or
    Share of year, where each year with releases fills the plot (stacked by share) and a focused colour shows
    its share of each year's releases (`yearShare`), scaled to its peak share with % axis labels; tooltips
    still give the counts. Share of year leaves out years with fewer than `MIN_SHARE_RELEASES` (4) releases
    (the axis is trimmed to busy years; quiet years in between are empty, their tooltip says why), and its
    legend percentages count only the charted years.
    Clicking a colour (a bar segment, a legend entry or a release's Type cell) shows only that
    colour, rescaled on the same year axis, and narrows the year's release list to it; clicking it
    again (or the legend's Show all, or changing Colour by) shows every colour.
  - On phones only the active window shows, stacked under the map.
  Right-clicking a brand offers "Show More", which opens (or restores) its window.
- Selecting a brand rings its same-city move/collaboration partners around it
  (`ringLayout` in geo.ts: RING_RADIUS model units, rotated away from its lines
  to other cities, two rings above RING_CAPACITY) so short lines stay readable;
  the grid is restored when the selection changes.

- Use 98.css classes (`window`, `title-bar`, `field-row`, `sunken-panel`,
  `tree-view`, `status-bar`) before writing custom CSS. Custom CSS is in
  `src/style.css`; graph styling is in `src/graph/style.ts` (canvas, not CSS).
- Palette: teal desktop `#008080`, face `#c0c0c0`, selection navy `#000080`.
  Map uses the Windows reserved colours: sea `#a6caf0`, land `#c0dcc0`,
  borders `#a0a0a4`, city boxes `#fffbf0`.
- Night mode ("Map colours: Day / Night / Automatic" — Automatic follows `prefers-color-scheme` — in the Settings window,
  `designer-map:map-theme`) recolours only the map: `DesignerGraph.setNight` toggles
  the pane's `night` class (CSS map colours: sea `#000040`, land `#203828`) and appends
  `nightStyle` (style.ts) to the Cytoscape stylesheet; pulse traces use `traceColours`.
  Night also darkens the window chrome: App sets `data-theme="night"` on the root and
  `scripts/night-chrome.mjs` (a Vite plugin) appends a generated night twin of every
  colour rule in 98.css and `style.css` (`:where(:root[data-theme="night"]) <selector>`,
  same specificity, colours mapped to dark greys), so new chrome CSS gets a night look
  automatically; map scenery selectors (`.graph-pane`, `.map-layer`) are skipped. Write a
  hand rule under `:root[data-theme='night']` only where the mapping falls short
  (e.g. `.stats-bar`). Any new map colour needs a night counterpart.
- Settings (`desktop.ts SETTINGS`, tool type `settings`) is a tool window opened from
  the Start menu, its desktop icon, Quick Launch or the desktop menu's Properties (
  `public/assets/settings.webp`, cut from `settings.jpg`). It is the only home of the map
  display options (Map colours, Show brands at, Open cities); its connection-line options mirror the
  Start menu's Connection lines submenu, and both edit the same App state.
  Its options are in tabs (`Tabs`, `designer-map:settings-tab`): Map, Connections, Appearance, Accessibility and
  General. They apply at once, and Restore Defaults… (after confirming) sets each back to `DEFAULT_SETTINGS`;
  a new option needs a default there and a tab.
  - Pulses (`designer-map:show-pulses`, `DesignerGraph.setPulses`) turns off only the moving blocks on lines, hover included.
  - Animations (Same as system / Always on / Always off, `designer-map:motion`): code asks `reducedMotion()`
    (`src/motion.ts`) and CSS uses `:root[data-motion='reduced']`; never query `prefers-reduced-motion` directly.
  - Wallpaper (`designer-map:wallpaper`) and desktop colour (`designer-map:desktop-color`) set `data-wallpaper` and
    `data-desktop-color` on the root. Patterns are see-through CSS over `--desktop`; each colour has a night one (tools.css).
  - Clock (`designer-map:clock`, `formatTime` in `ui/clock.ts`) covers the taskbar clock and Notepad's Time/Date.
  - Open folders as (`designer-map:folder-view`): Last used, or always Large Icons / Details for place windows, My Computer
    and the Recycle Bin (`useFolderView`); with a fixed view, a change in a window lasts until it closes.
  - Saved data: Clear Documents, Reset Window and Icon Positions, Clear Notepad… (confirmed). `clearSettings` forgets
    stored keys and tells whatever shows them (`useSettingsCleared`).
  Text size (Normal 100% / Large 125% / Extra large 150%, `designer-map:text-size`)
  sets `--text-zoom` on the root: CSS `zoom` on window contents (not frames, so
  sizing and dragging stay in plain px; Spreadsheet keeps its own Zoom), desktop icon
  labels and status bar. `DesignerGraph.setTextScale` enlarges
  brand labels (`textStyle`) and pin labels (`sizeMarkers`). Place windows scale their
  fixed grid size with it (`scaleSize`). The taskbar (with the Start menu and its
  pop-ups inside it) and the map window's title bar scale too; `.desktop` padding
  multiplies `--taskbar-h` by `--text-zoom` to make room.
- Cursors are classic Win98 pixel art in `public/assets/cursors/` (1x + @2x PNGs): use the
  `--cursor-default` (arrow), `--cursor-pointer` (link hand) and `--cursor-grabbing` (closed
  hand) tokens from `style.css`, never bare `default`/`pointer`. Buttons keep the arrow, as in
  Win98. Settings ▸ Mouse pointer size (Normal / Large 2x / Extra large 3x,
  `designer-map:cursor-size`) sets `data-cursor-size` on the root, which swaps the tokens to the
  @2x / @3x images declared at 1x, with scaled hotspots. The map canvas gets `.grabbing` only once a press actually pans the view (`graph.ts`).
- Explorer has a Win98 menu bar (`ui/explorer-menu.tsx`; its commands are `explorerActions` in App): File, Edit, View
  (Address Bar and Status Bar toggles, `designer-map:address-bar` / `designer-map:status-bar`, zoom via `DesignerGraph.zoomBy`),
  Go (Back / Forward through selections, `useSelectionHistory`; Home Page clears the selection and shows the whole map; recent items),
  Favorites (`ui/favorites.ts`, `designer-map:favorites`: brands, designers and groups) and Help. Items the year or filters hide are greyed.
- View ▸ Filter Brands… (`FilterDialog`) is the Start menu's filters in tabs. File ▸ Save Map as Picture… draws the SVG layers, then
  Cytoscape's PNG, at 2x (`graph/picture.ts`; new CSS properties on those layers must be in its `STYLES`; moving blocks are left out).
  Favorites ▸ Show All on Map and a place window's multiple selection use `DesignerGraph.showBrands`: those brands alone are revealed and
  framed with nothing selected, until the next `select`.
- Map tooltips (`graph/tooltip.ts` lines, `MapTooltip`) cover brands and lines, not pins; they wait 400ms and show for the mouse only; zoom buttons sit in the map's corner (`.map-zoom`).
- Brand, designer and group windows start with `ItemActions` (Favorite, Show on Map, Copy Link); Show on Map becomes Hide, which clears the selection, while the item is selected on an open map. Collaboration histories longer than
  `COLLABORATION_ROWS` have a Find box (partner name or alias, or a release year).
- Place windows start with `PlacePath` (Europe ▸ France ▸ Paris; arrows list the level's other places). Ctrl/Cmd+click and Shift+click
  select several brands (Ctrl+A all, Esc none); right-click acts on them all, opening at most `MAX_PROPERTY_WINDOWS`.
- Explorer's Address box is a brand/designer/group search. Its accessible name is "Find on map" ("Address" is only a `caption`), and
  every `SearchBox` opts out of password managers and autofill (`data-1p-ignore` and the like).
- 98.css trips Vite's CSS minifier, which is why `vite.config.ts` sets `cssMinify: false`.
- Layout must still work at phone width (the properties window stacks under the graph).

## Page refresh

- `ui/session.ts` keeps a tab's session in sessionStorage: open windows (place, size, stacking, minimized),
  Explorer's state, the selection, the connection filter and the map view (`DesignerGraph.viewState` /
  `restoreView`: zoom, centre and user-opened cities). It is saved on changes and on `pagehide`. The year and
  filters come from the URL; everything read back is validated.
- Settings ▸ When I come back (`designer-map:startup`): Start fresh, or Open where I left off, which also keeps the session
  in localStorage (`designer-map:last-session`) for the next visit. A link with a hash opens on its own instead; the
  year and filters aren't kept.
- A refresh reselects the URL's item without reopening or refocusing its window; a link to anything else
  opens as usual. For a moment after a restore, map resizes keep the view instead of fitting the map.
- Spreadsheet's filters, search, hidden rows, subtotals and active cell are saved on `pagehide` and used once,
  so closing its window still clears them.

## Downloads and shared pieces

- `style.css` only imports `src/styles/*.css`, in cascade order; `night-chrome.mjs` joins them first, so the
  night styles still come after every day rule. Keep new rules in the matching file.
- Production builds are split: each big data file, the libraries and the app are separate files (vite.config.ts),
  so a release only re-downloads what changed. Spreadsheet, Statistics, My Computer and Notepad are
  `lazyWindow`s (`ui/lazy-windows.ts`), fetched once the map is idle. Importing one of them directly from
  App, or from anything App loads, puts it back in the first download.
- Brand and designer `notes` move to their own file in production (`scripts/split-notes.mjs`,
  `data/notes.ts`). Show them with `useNotes`; don't read `.notes` elsewhere at runtime.
- Conditional-format fills keep their colours at night with dark text (`.painted`); data bars dim.
- Shared helpers: `text.ts` (sorting, accents), `ui/storage.ts` (all localStorage access), `ui/dialog.tsx`
  (modal dialogs, title-bar dragging), `ui/download.ts`, `ui/use-settings.ts` (Settings' choices),
  `ui/desk-windows.tsx` (window titles, icons, sizes).
