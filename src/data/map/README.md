# Map subdivision boundaries

`north-america-subdivisions.json` contains internal Canadian province/territory
and US state boundaries from Natural Earth’s 1:50m Admin 1 boundary-lines dataset.
It excludes coastlines and international boundaries, which the existing world
map already draws.

Source: https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_50m_admin_1_states_provinces_lines.geojson

Dataset documentation: https://www.naturalearthdata.com/downloads/50m-cultural-vectors/50m-admin-1-states-provinces/

License: public domain — https://www.naturalearthdata.com/about/terms-of-use/

Prepared on 2026-11-13 by filtering `ADM0_A3` to `CAN` and `USA`, retaining only
geometry, grouping each country’s LineStrings into a MultiLineString, and
rounding coordinates to four decimal places. No vertices were simplified away.
The GeoJSON `country` properties use ISO codes `CA` and `US`.

The renderer projects these boundaries using the same Natural Earth projection
as the world map. It clips their strokes to the land layer because the existing
world-atlas map uses a coarser 1:110m coastline. The data is bundled locally and
does not require a runtime network request.
