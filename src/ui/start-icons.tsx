/** 16×16 pixel-art Start menu icons, drawn 2× like Win98's large menu icons. */

const palette: Record<string, string> = {
  k: '#000000', w: '#ffffff', g: '#808080', s: '#c0c0c0', n: '#000080', b: '#0000ff',
  c: '#a6caf0', l: '#00a000', y: '#ffff00', o: '#808000', r: '#ff0000',
};

const icons = {
  globe: [
    '................',
    '.....kkkkkk.....',
    '...kkbbllbbkk...',
    '..kbbblllbbbk...',
    '..kblllllbbbk...',
    '.kbbllllbbllbk..',
    '.kbbbllbbblllbk.',
    '.kbbbbbbbbllbbk.',
    '.kbbbbllbbbbbbk.',
    '.kbbblllllbbbbk.',
    '..kbbllllbbbbk..',
    '..kbbbllbbbbbk..',
    '...kkbbbbbbkk...',
    '.....kkkkkk.....',
    '................',
    '................',
  ],
  lines: [
    '................',
    '.kkkkk..........',
    '.kwwwk..........',
    '.kwwwkrr.rr.r...',
    '.kkkkk......r...',
    '................',
    '............r...',
    '............r...',
    '................',
    '............r...',
    '..........kkkkk.',
    '..........kyyyk.',
    '..........kyyyk.',
    '..........kkkkk.',
    '................',
    '................',
  ],
  expand: [
    '................',
    '.kkkkkkkkkkkkk..',
    '.knnnnnnnnnnnk..',
    '.kkkkkkkkkkkkk..',
    '.kwwwwwwwwwwwk..',
    '.kwwwwwkwwwwwk..',
    '.kwwwwwkwwwwwk..',
    '.kwwwkkkkkwwwk..',
    '.kwwwwwkwwwwwk..',
    '.kwwwwwkwwwwwk..',
    '.kwwwwwwwwwwwk..',
    '.kkkkkkkkkkkkk..',
    '................',
    '................',
    '................',
    '................',
  ],
  fit: [
    '................',
    'kkk..........kkk',
    'k..............k',
    'k..............k',
    '...cccccccccc...',
    '...clllcccccc...',
    '...cllllccllc...',
    '...ccllccclll...',
    '...cccccccllc...',
    '...cccllccccc...',
    '...ccclllcccc...',
    '...cccccccccc...',
    'k..............k',
    'k..............k',
    'kkk..........kkk',
    '................',
  ],
  folder: [
    '................',
    '................',
    '..kkkkk.........',
    '.kyyyyyk........',
    'kyyyyyyykkkkkkk.',
    'kywwwwwwwwwwwwok',
    'kywyyyyyyyyyyyok',
    'kywyyyyyyyyyyyok',
    'kywyyyyyyyyyyyok',
    'kywyyyyyyyyyyyok',
    'kywyyyyyyyyyyyok',
    'kywyyyyyyyyyyyok',
    'kyoooooooooooook',
    'kkkkkkkkkkkkkkkk',
    '................',
    '................',
  ],
} satisfies Record<string, readonly string[]>;

export type StartIconName = keyof typeof icons | 'collapse';

/** Collapse all: the Expand icon's plus with its vertical bar removed. */
const collapse = icons.expand.map((row, y) => (y === 5 || y === 6 || y === 8 || y === 9) ? row.replace('wkw', 'www') : row);

export function StartIcon({ name }: { name: StartIconName }) {
  const rows = name === 'collapse' ? collapse : icons[name];
  return <svg className="start-icon" width="32" height="32" viewBox="0 0 16 16" shapeRendering="crispEdges" aria-hidden="true">
    {rows.flatMap((row, y) => [...row].map((pixel, x) => pixel === '.' ? null
      : <rect key={`${x},${y}`} x={x} y={y} width="1" height="1" fill={palette[pixel]} />))}
  </svg>;
}
