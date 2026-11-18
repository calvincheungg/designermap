/** Classic Minesweeper number colours for 1–7; more than seven releases show in bright orange. */
const MINESWEEPER_COLOURS = ['#0000ff', '#008000', '#ff0000', '#000080', '#800000', '#008080', '#000000'];
export const MANY_COLLABORATIONS_COLOUR = '#ff8c00';
export function minesweeperColour(count: number) {
  return MINESWEEPER_COLOURS[count - 1] ?? MANY_COLLABORATIONS_COLOUR;
}
