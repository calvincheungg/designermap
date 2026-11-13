Drop brand logo files here (e.g. `dior.svg`, `gucci.png`), then set
`logo: 'dior.svg'` on that house in `src/data/houses.ts`.

You can also skip the file and point `logo` at a full image URL.

- Logos sit in the same bevelled frame as the initials badge, on the logo's own
  background colour. Wide wordmarks are fitted without stretching.
- Add `logoFit: 'fill'` on the house to scale the logo edge to edge inside the
  frame (good for logos on a solid colour block).
- Houses without a logo show a coloured initials badge (the default).
- If a logo can't load, the house falls back to its initials and the browser
  console names the house.
