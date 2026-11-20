import { describe, expect, it } from 'vitest';
import { addNightChrome, nightSelector } from '../../scripts/night-chrome.mjs';

const twins = (css: string) => addNightChrome(css).split('night chrome')[1];

describe('night chrome', () => {
  it('scopes selectors to the night root without raising specificity', () => {
    expect(nightSelector('.window')).toBe(':where(:root[data-theme="night"]) .window');
    expect(nightSelector(':root')).toBe(':root:where([data-theme="night"])');
    expect(nightSelector('html')).toBe('html:where([data-theme="night"])');
  });

  it('darkens faces and fields, lightens text and keeps navy selections', () => {
    const out = twins('.a { background: #c0c0c0; color: #000; } .b { background: #fff; } .c { background: navy; color: #fff; }');
    expect(out).toMatch(/\.a \{\s*background: #3c3c3c;\s*color: #e0e0e0/);
    expect(out).toMatch(/\.b \{\s*background: #1e1e1e/);
    expect(out).toContain('background: navy');
    expect(out).toContain('color: #fff');
  });

  it('maps bevels and keeps media wrappers', () => {
    const out = twins('@media (max-width: 760px) { .w { box-shadow: inset 1px 1px #fff, inset -1px -1px grey; } }');
    expect(out).toContain('@media (max-width: 760px)');
    expect(out).toContain('inset 1px 1px #6a6a6a, inset -1px -1px #1e1e1e');
  });

  it('skips map scenery and rules without colours', () => {
    const out = twins('.graph-pane .land { fill: #c0dcc0; } .x { width: 2px; }');
    expect(out).not.toContain('.land');
    expect(out).not.toContain('.x');
  });
});
