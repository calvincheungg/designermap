import { performance } from 'node:perf_hooks';
import { createServer } from 'vite';

// Isolates geometry cost; browser drawing, image decode and network are excluded.
const server = await createServer({
  server: { middlewareMode: true, hmr: false, watch: null, ws: false }, appType: 'custom',
});
try {
  const geo = await server.ssrLoadModule('/src/graph/geo.ts');
  const { placeMarkers } = await server.ssrLoadModule('/src/graph/markers.ts');
  const byCity = geo.housesByMapLocation();
  const expanded = new Set(byCity.keys());
  const measure = (label, run) => {
    const start = performance.now();
    const result = run();
    console.log(`${label}: ${(performance.now() - start).toFixed(1)} ms`);
    return result;
  };
  console.log(`${[...byCity.values()].flat().length} houses / ${byCity.size} locations`);
  const layout = measure('Expand all, first layout', () => geo.layoutMap(expanded));
  measure('Expand all, cached layout', () => geo.layoutMap(expanded));
  const markers = layout.cities.map((city) => ({ id: city.city, tip: city.tip }));
  const grids = geo.placeGrids(expanded);
  for (const zoom of [0.3, 1]) measure(`Expanded pin placement at zoom ${zoom}`, () => placeMarkers(markers, zoom, grids));
} finally {
  await server.close();
}
