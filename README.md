# Designer Map

An interactive graph of fashion houses and their creative directors: who led
which house, when, and where they moved next. Styled like Windows 98.

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # data sanity checks
npm run check    # type-check (catches typos in house ids)
npm run build    # static site in dist/
```

## Adding research

All data lives in two files. Everything else is derived from them.

| File | What goes in it |
| --- | --- |
| [src/data/houses.ts](src/data/houses.ts) | One entry per house: name, founding, city, logo |
| [src/data/designers.ts](src/data/designers.ts) | One entry per designer, with a `career` list of tenures |

**Add a house:**

```ts
// houses.ts
margiela: { name: 'Maison Margiela', founded: 1988, city: 'Paris', country: 'France', logo: 'margiela.svg' },
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

If a `house` id is misspelled, `npm run check` fails. `npm test` flags
end-before-start, current roles for deceased designers, houses with nobody
linked, and similar problems. The same warnings appear in the browser console.

**Logos:** drop `dior.svg` (or `.png`) into [public/logos/](public/logos/) and set
`logo: 'dior.svg'` on the house. Houses without one get a coloured initials icon.

> The starter data was written from memory. Verify each entry and add `sources`.

## Using it

- **Click** a house icon or designer dot to highlight their connections and open
  their Properties window. Click empty space to clear.
- **View → Moves between houses** shows only houses, with an arrow for every
  move, labelled with the designer and year.
- **Year slider / Play** steps through history. Only tenures (and houses) that had
  started by that year are shown.
- **Find** jumps to any house or designer by name.

## Code map

```
src/
  types.ts            data model (HouseData, DesignerData, Tenure, Move)
  data/               source data + derived queries (tenuresAt, movesOf, …)
  graph/              Cytoscape graph: elements, Win98 stylesheet, icons, interaction
  ui/panel.ts         Properties window HTML
  main.ts             wires toolbar, search, slider, panel and graph together
```

Built with [Cytoscape.js](https://js.cytoscape.org/) and the `fcose` layout for
the graph, and [98.css](https://jdan.github.io/98.css/) for the Windows 98 look.
