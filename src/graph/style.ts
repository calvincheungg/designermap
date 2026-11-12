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
    },
  },
  {
    // Group box for each city, like a 98.css <fieldset>.
    selector: 'node[kind = "city"]',
    style: {
      shape: 'rectangle',
      'background-color': '#c0c0c0',
      'background-opacity': 0.25,
      'border-width': 1,
      'border-color': '#808080',
      'border-style': 'solid',
      'text-valign': 'top',
      'text-halign': 'center',
      'text-margin-y': -2,
      'font-size': 12,
      'font-weight': 'bold',
      color: '#404040',
      padding: '18px',
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
    },
  },
  {
    selector: 'node[kind = "designer"]',
    style: {
      shape: 'ellipse',
      width: 14,
      height: 14,
      'background-color': '#ffff80',
      'border-width': 1,
      'border-color': '#000',
      'font-size': 10,
    },
  },
  {
    selector: 'edge',
    style: {
      width: 1,
      'line-color': '#808080',
      'curve-style': 'bezier',
      'font-family': FONT,
      'font-size': 9,
      'text-background-color': '#fff',
      'text-background-opacity': 1,
      'text-background-padding': '1px',
    },
  },
  { selector: 'edge[?current]', style: { 'line-style': 'solid', width: 2 } },
  {
    selector: 'edge[kind = "move"]',
    style: {
      'target-arrow-shape': 'triangle',
      'target-arrow-color': '#808080',
      'arrow-scale': 0.9,
    },
  },

  /* ---------- interaction states ---------- */
  {
    // Selected desktop icon: navy label background, white text.
    selector: 'node.highlight[kind != "city"], node:selected[kind != "city"]',
    style: {
      color: '#fff',
      'text-background-color': NAVY,
      'text-background-opacity': 1,
      'text-background-padding': '2px',
    },
  },
  {
    selector: 'node.focus',
    style: { 'border-width': 2, 'border-color': NAVY, 'border-style': 'dashed' },
  },
  {
    selector: 'edge.highlight',
    style: {
      label: 'data(label)',
      'line-color': NAVY,
      'target-arrow-color': NAVY,
      width: 2,
      'z-index': 10,
    },
  },
  { selector: '.faded', style: { opacity: 0.15, 'text-opacity': 0.3 } },
  { selector: '.hidden', style: { display: 'none' } },
];
