import type { SingularElementArgument } from 'cytoscape';
import { countryNames, getDesigner, getHouse } from '../data';

const houseName = (id: string) => getHouse(id)?.name ?? id;

/** Tooltip lines for a brand or line; pins have none. */
export function tooltipLines(element: SingularElementArgument): string[] {
  const data = element.data();
  if (data.kind === 'house') {
    const house = getHouse(data.refId);
    if (!house) return [];
    const years = house.founded === undefined ? house.closed && `Ended ${house.closed}` : `Founded ${house.founded}${house.closed ? ` · Ended ${house.closed}` : ''}`;
    return [house.name, `${house.city}, ${countryNames[house.country]}`, ...(years ? [years] : [])];
  }
  if (data.kind === 'move') return [getDesigner(data.designerId)?.name ?? data.designerId,
    `${houseName(data.fromHouse)} ${data.concurrent ? '+' : '→'} ${houseName(data.toHouse)}, ${data.start}`];
  if (data.kind === 'collaboration') return [`${houseName(data.fromHouse)} × ${houseName(data.toHouse)}`, `${data.count.toLocaleString()} collaboration${data.count === 1 ? '' : 's'}`];
  return [];
}
