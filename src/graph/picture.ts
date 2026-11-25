import type { Core } from 'cytoscape';

/** What the stylesheet gives the map's SVG layers; a picture has no stylesheet, so these are written onto a copy. */
const STYLES = ['fill', 'fill-opacity', 'stroke', 'stroke-width', 'stroke-opacity', 'stroke-dasharray', 'opacity', 'display', 'vector-effect',
  'shape-rendering', 'font-family', 'font-size', 'font-weight', 'text-anchor', 'dominant-baseline'] as const;

async function layerImage(svg: SVGSVGElement, width: number, height: number): Promise<HTMLImageElement | null> {
  if (getComputedStyle(svg).display === 'none') return null;
  const copy = svg.cloneNode(true) as SVGSVGElement;
  const from = svg.querySelectorAll('*'), to = copy.querySelectorAll<SVGElement>('*');
  from.forEach((element, i) => {
    if (element.closest('defs')) return;
    const style = getComputedStyle(element);
    for (const name of STYLES) to[i]!.style.setProperty(name, style.getPropertyValue(name));
  });
  // A copy's moving blocks would all sit at the map's corner; the lines they follow stay.
  for (const block of copy.querySelectorAll('.pulse')) block.remove();
  copy.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  copy.setAttribute('width', String(width));
  copy.setAttribute('height', String(height));
  const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(copy)], { type: 'image/svg+xml' }));
  try {
    const image = new Image(width, height);
    image.src = url;
    await image.decode();
    return image;
  } finally { URL.revokeObjectURL(url); }
}

/** The map as it looks now, as a PNG: sea, the SVG layers, then Cytoscape's lines, pins and brands. */
export async function mapPicture(cy: Core, background: string, layers: readonly SVGSVGElement[], scale = 2): Promise<Blob> {
  const width = cy.width(), height = cy.height();
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);
  const context = canvas.getContext('2d')!;
  context.fillStyle = background;
  context.fillRect(0, 0, canvas.width, canvas.height);
  for (const layer of layers) {
    const image = await layerImage(layer, width, height);
    if (image) context.drawImage(image, 0, 0, canvas.width, canvas.height);
  }
  const nodes = await createImageBitmap(await cy.png({ output: 'blob-promise', full: false, scale }));
  context.drawImage(nodes, 0, 0, canvas.width, canvas.height);
  nodes.close();
  return new Promise((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('No picture')), 'image/png'));
}
