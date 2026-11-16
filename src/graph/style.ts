import type { StylesheetJson } from 'cytoscape';

const FONT = '"Pixelated MS Sans Serif", Arial, sans-serif';
const NAVY = '#000080';

/** Cytoscape stylesheet, styled like Windows 98 desktop icons and group boxes. */
export const graphStyle: StylesheetJson = [
  {
    selector: 'node',
    style: {
      label: 'data(label)',
      'font-family': FONT,
      'font-size': 11,
      color: '#000',
      'text-valign': 'bottom',
      'text-margin-y': 4,
      'text-wrap': 'wrap',
      'text-max-width': '90px',
      // Hide unreadably small labels when zoomed out to the whole world.
      'min-zoomed-font-size': 7,
    },
  },
  {
    // Retro pixel pin with the house count; its tip points at the city.
    // Width/height/font are set per zoom by DesignerGraph.sizeMarkers.
    selector: 'node[kind = "marker"]',
    style: {
      shape: 'rectangle',
      width: 65,
      height: 70,
      'background-opacity': 0,
      'background-image': 'data(image)',
      'background-fit': 'contain',
      'background-clip': 'none',
      'border-width': 0,
      label: 'data(label)',
      'text-valign': 'bottom',
      'text-wrap': 'none',
      'font-size': 11,
      'font-weight': 'bold',
      color: '#000000',
      'text-outline-color': '#ffffff',
      'text-outline-width': 2,
      'min-zoomed-font-size': 0,
      'z-index': 20,
    },
  },
  {
    // Invisible group around an expanded city's houses (no box, just a hit area for leaders).
    selector: 'node[kind = "grid"]',
    style: {
      'background-opacity': 0,
      'border-width': 0,
      padding: '4px',
      label: '',
      events: 'no',
    },
  },
  {
    // Dotted leader from a pin to its open city's houses.
    selector: 'edge[kind = "leader"]',
    style: {
      width: 1.5,
      'line-color': '#000080',
      'line-style': 'dotted',
      'curve-style': 'straight',
      events: 'no',
    },
  },
  {
    // Desktop-icon style: square image, label underneath.
    selector: 'node[kind = "house"]',
    style: {
      shape: 'rectangle',
      width: 44,
      height: 44,
      'background-color': '#fff',
      'background-image': 'data(image)',
      'background-fit': 'contain',
      'background-clip': 'none',
      'border-width': 0,
      // Allow logos hosted on other sites (no CORS headers needed; we never read pixels back).
      // 'null' is documented by Cytoscape but missing from its type definitions.
      'background-image-crossorigin': 'null' as unknown as 'anonymous',
    },
  },
  {
    // A brand logo. Once it loads, DesignerGraph.checkLogos draws it as two
    // layers: the same bevelled frame as the initials badge (inside painted in
    // the logo's own background colour), then the logo sized to fit.
    selector: 'node[kind = "house"][?hasLogo]',
    style: {
      'background-color': '#c0c0c0',
      'background-fit': 'contain',
    },
  },
  {
    selector: 'edge',
    style: {
      label: '',
      width: 1,
      'line-color': '#808080',
      'curve-style': 'bezier',
      'font-family': FONT,
      // Same size as the house names, and like them it scales with the map.
      'font-size': 11,
      'text-background-color': '#fff',
      'text-background-opacity': 1,
      'text-background-padding': '2px',
    },
  },
  {
    selector: 'edge[kind = "move"]',
    style: {
      'target-arrow-shape': 'triangle',
      'target-arrow-color': '#808080',
      'arrow-scale': 0.9,
    },
  },
  {
    // Took on a second house while keeping the first: dashed, hollow arrow.
    selector: 'edge[kind = "move"][?concurrent]',
    style: { 'line-style': 'dashed', 'target-arrow-fill': 'hollow' },
  },

  /* ---------- interaction states ---------- */
  {
    // Selected desktop icon: navy label background, white text.
    selector: 'node.highlight, node:selected',
    style: {
      color: '#fff',
      'text-background-color': NAVY,
      'text-background-opacity': 1,
      'text-background-padding': '2px',
    },
  },
  {
    // Outline the selected brand, or all career houses for a selected designer.
    selector: 'node.highlight[kind = "house"]',
    style: { 'border-width': 2, 'border-color': NAVY, 'border-style': 'solid' },
  },
  {
    selector: 'node.focus',
    style: { 'border-width': 2, 'border-color': NAVY, 'border-style': 'dashed' },
  },
  {
    selector: 'edge.highlight',
    style: {
      'line-color': NAVY,
      'target-arrow-color': NAVY,
      width: 2,
      // Keep connections behind brand icons; details live outside the canvas.
      'z-compound-depth': 'bottom',
    },
  },
  // Only unrelated arrows fade, so the selection's moves stand out; houses stay fully visible.
  {
    selector: 'edge[kind = "collaboration"], edge.highlight[kind = "collaboration"]',
    style: {
      'line-color': '#cc0000',
      'target-arrow-color': '#cc0000',
      'target-arrow-shape': 'none',
      'line-style': 'dashed',
    },
  },
  { selector: 'edge.faded', style: { opacity: 0.15, 'text-opacity': 0.3 } },
  { selector: '.hidden, .collapsed, .lines-off, .selection-hidden', style: { display: 'none' } },
];
