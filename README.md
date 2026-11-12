# Designer Map

An interactive world map of fashion houses and their creative directors: who led
which house, when, and where they moved next. Styled like Windows 98.

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # data sanity checks
npm run check    # type-check (catches typos in house ids)
npm run build    # static site in dist/
```

## Adding research

All data lives in three files. Everything else is derived from them.

| File | What goes in it |
| --- | --- |
| [src/data/houses.ts](src/data/houses.ts) | One entry per house: name, founding, city, logo |
| [src/data/cities.ts](src/data/cities.ts) | Latitude/longitude for each city on the map |
| [src/data/designers.ts](src/data/designers.ts) | One entry per designer, with a `career` list of tenures |

**Add a house:**

```ts
// houses.ts
margiela: {
  name: 'Maison Margiela',
  founded: 1988,
  city: 'Paris',
  country: 'France',
  website: 'https://www.maisonmargiela.com', // optional, shown as a link
  logo: 'margiela.svg',                        // optional, file in public/logos/
},
```

**Add a designer (moves are worked out from the career order):**

```ts
// designers.ts
someDesigner: {
  name: 'Some Designer',
  career: [
    { house: 'chloe', role: 'Creative Director', start: 2001, end: 2006, sources: ['https://…'] },
    { house: 'celine', role: 'Creative Director', start: 2008, end: null },          // null = current
    { house: 'gucci', role: 'Head Designer', start: 1995, approximate: true },        // no end = unknown, ~ shown
  ],
},
```

**A house in a new city:** add the city to `cities.ts` first; `npm run check`
fails until you do.

If a `house` id is misspelled, `npm run check` fails. `npm test` flags
end-before-start, current roles for deceased designers, houses with nobody
linked, and similar problems. The same warnings appear in the browser console.

**Logos:** drop `dior.svg` (or `.png`) into [public/logos/](public/logos/) and set
`logo: 'dior.svg'` on the house. Houses without one get a coloured initials icon.

> The starter data was written from memory. Verify each entry and add `sources`.

## Using it

- **World map** (default): each city has a pixel-art pin on the exact city,
  showing the number of houses there. **Click a pin** to expand the city and
  show its houses; click again to collapse it. **Expand all / Collapse all** in
  the toolbar opens or closes every city. Where pins crowd together when zoomed
  out, the bigger city draws on top and smaller cities' names reappear as you
  zoom in. Zoom out stops once the map fills the view.
  Arrows are moves between houses (or between city pins while collapsed);
  dashed arrows mean the designer kept their old role too. Selecting a house or
  designer opens the cities involved.
- **Network** view: a free-form graph with designers as nodes linked to every
  house they worked at.
- **Click** a house or designer to highlight their connections and open
  their Properties window. Click empty space to clear. Scroll to zoom, drag to pan.
- **Year slider / Play** steps through history. Only tenures (and houses) that had
  started by that year are shown.
- **Find** jumps to any house or designer by name.

## Code map

```
src/
  types.ts            data model (HouseData, DesignerData, Tenure, Move)
  data/               source data + derived queries (tenuresAt, movesOf, …)
  data/cities.ts      city coordinates for the map
  graph/geo.ts        map projection, world SVG, city box placement
  graph/              Cytoscape graph: elements, Win98 stylesheet, icons, interaction
  ui/panel.ts         Properties window HTML
  main.ts             wires toolbar, search, slider, panel and graph together
```

Built with [Cytoscape.js](https://js.cytoscape.org/) (plus the `fcose` layout for
the network view), [d3-geo](https://d3js.org/d3-geo) and
[world-atlas](https://github.com/topojson/world-atlas) for the map, and
[98.css](https://jdan.github.io/98.css/) for the Windows 98 look.
