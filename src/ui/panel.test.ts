import { describe, expect, it } from 'vitest';
import { houses, GroupId } from '../data';
import { tagLabel } from './labels';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { PanelContent, panelTitle, type Selection } from './panel';

const renderPanel = (selection: Selection, visibleHouses = houses) => ({
  title: panelTitle(selection),
  html: renderToStaticMarkup(createElement(PanelContent, { selection, visibleHouses, onSelect: () => {}, onTag: () => {} })),
});

describe('group navigation and tag display', () => {
  it('shows capitalized tag labels while keeping filter values intact', () => {
    const { html } = renderPanel({ kind: 'house', id: 'missoni' });
    expect(html).toContain('data-tag-value="knitwear"');
    expect(html).toContain('>Knitwear</button>');
    expect(html).toContain('>Ready-To-Wear</button>');
    expect(tagLabel('Mid-market')).toBe('Mid-Market');
    expect(tagLabel('Avant-garde')).toBe('Avant-Garde');
  });

  it('links a house to its group and the group back to its brands', () => {
    const house = renderPanel({ kind: 'house', id: 'moncler' });
    expect(house.html).toContain(`data-select="group:${GroupId.Moncler}"`);
    const group = renderPanel({ kind: 'group', id: GroupId.Moncler }, []);
    expect(group.title).toBe('Moncler Group Properties');
    expect(group.html).toContain('Current Brands in This Map (2)');
    expect(group.html).toContain('data-select="house:moncler"');
    expect(group.html).toContain('data-select="house:stoneIsland"');
    expect(group.html).not.toContain('data-select="house:prada"');
  });

  it('renders collections as clickable tags separate from primary products', () => {
    const { html } = renderPanel({ kind: 'house', id: 'chanel' });
    expect(html).toContain('<p>Collections</p>');
    expect(html).toContain('data-tag-kind="collections" data-tag-value="Womenswear"');
    expect(html).not.toContain('data-tag-kind="product" data-tag-value="womenswear"');
    expect(html).toContain('data-tag-kind="product" data-tag-value="jewelry"');
    expect(html).toContain('>Jewelry</button>');
  });

  it('keeps the historical Fenty fashion house separate from Fenty Beauty', () => {
    const { html } = renderPanel({ kind: 'house', id: 'fenty' });
    expect(html).toContain('data-tag-value="Luxury"');
    expect(html).not.toContain('href="https://fentybeauty.com/"');
    expect(html).not.toContain('instagram.com/fentybeauty/');
  });

  it('lists groups in the directory and handles an unknown group', () => {
    expect(renderPanel(null, houses).html).toContain(`data-select="group:${GroupId.Kering}"`);
    expect(renderPanel({ kind: 'group', id: 'unknown' as GroupId }).title).toBe('Not found');
  });
});
