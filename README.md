# Designer Map

An interactive world map of fashion houses and their creative directors: who led
which house, when, and where they moved next. Styled like Windows 98.
The interface uses React and TypeScript; Cytoscape and the SVG map engine retain
their own rendering and layout logic.

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
// Import tag enums from './tags' and CountryCode from './countries'.
maisonMargiela: {
  tags: {
    marketPositioning: MarketPositioning.Luxury,
    brandCategory: [BrandCategory.AvantGarde, BrandCategory.Couture],
    aesthetic: [Aesthetic.Deconstructed, Aesthetic.Experimental],
    collections: [CollectionTag.Menswear, CollectionTag.Womenswear],
    product: [ProductTag.ReadyToWear, ProductTag.Couture, ProductTag.Footwear, ProductTag.Bags],
  },
  name: 'Maison Margiela',
  founded: 1988,
  city: 'Paris',
  country: CountryCode.France,
  website: 'https://www.maisonmargiela.com', // optional, shown as a link
  instagram: 'maisonmargiela',                // optional, handle without the @
  logo: 'margiela.svg',                        // optional, file in public/logos/
},
```

Tags use enums from `src/data/tags.ts` for autocomplete. Choose 1–3 main
aesthetics and 1–4 primary product specialties. Menswear and Womenswear belong
in `collections`; unisex ranges can match both. `DesignerLed` describes creative
identity, not ownership independence. Market positioning follows the main
commercial brand; a luxury subline can occupy a different tier.

Filters allow multiple choices: selections within a group use OR, while groups
combine with AND. Collection and product filters work independently. Selected
filters appear on the right, and clicking a tag on a brand page adds that filter.

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

**Logos:** each house shows a square on the map. By default it's a coloured
initials badge; to use the brand's label/logo instead, set `logo` on the house:

```ts
dior: { …, logo: 'dior.svg' },                          // a file in public/logos/
chanel: { …, logo: 'https://example.com/chanel.png' },  // or a full image URL
```

Logos sit inside the same bevelled Win98 frame as the initials badge, on the
logo's own background colour (read from its corner pixel). Wide wordmarks are
fitted without stretching. Add `logoFit: 'fill'` to scale a logo edge to edge
inside the frame instead of leaving a small margin (good for logos on a solid
colour block, like 424). If a logo can't load, the house falls
back to its initials and the browser console says which one.

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
- **Show move lines** (toolbar checkbox) turns the arrows between brands on or
  off. With it off, selecting a designer still draws their own moves.
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
  ui/panel.tsx        React Properties window components
  ui/filters.tsx      multi-select filter menus and selected chips
  ui/listbox.tsx      searchable Win98 combobox
  ui/context-menu.tsx map actions, rendered through a React portal
  ui/map-view.tsx     graph host, initialization and lifecycle cleanup
  App.tsx             UI state; connects components to the existing graph API
  main.tsx            React root and startup validation
```

Built with [React](https://react.dev/), [Cytoscape.js](https://js.cytoscape.org/), [d3-geo](https://d3js.org/d3-geo) and
[world-atlas](https://github.com/topojson/world-atlas) for the map, and
[98.css](https://jdan.github.io/98.css/) for the Windows 98 look.
