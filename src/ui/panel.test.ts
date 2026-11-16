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
  it('shows states and provinces in directory menus while keeping house locations concise', () => {
    expect(renderPanel({ kind: 'house', id: 'commonProjects' }).html).toContain('New York, USA');
    expect(renderPanel({ kind: 'house', id: 'aritzia' }).html).toContain('Vancouver, Canada');
    expect(renderPanel({ kind: 'house', id: 'psychoBunny' }).html).toContain('Montreal, Canada');
    expect(renderPanel({ kind: 'house', id: 'dior' }).html).toContain('Paris, France');
    const singleCity = renderPanel(null, houses.filter((house) => house.id === 'aritzia')).html;
    expect(singleCity).toContain('Canada · Vancouver, British Columbia (1)');
    const multipleCities = renderPanel(null, houses.filter((house) => ['aritzia', 'canadaGoose'].includes(house.id))).html;
    expect(multipleCities).toContain('Vancouver, British Columbia (1)');
    expect(multipleCities).toContain('Toronto, Ontario (1)');
  });

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
    expect(group.html).toContain('Current Brands in This Map (3)');
    expect(group.html).toContain('data-select="house:moncler"');
    expect(group.html).toContain('data-select="house:stoneIsland"');
    expect(group.html).toContain('data-select="house:stoneIslandShadowProject"');
    expect(group.html).not.toContain('data-select="house:prada"');
  });

  it('renders collections as clickable tags separate from primary products', () => {
    const { html } = renderPanel({ kind: 'house', id: 'chanel' });
    expect(html).toContain('<p>Collections</p>');
    expect(html).toContain('data-tag-kind="collections" data-tag-value="Womenswear"');
    expect(html).not.toContain('data-tag-kind="product" data-tag-value="womenswear"');
    expect(html).toContain('data-tag-kind="product" data-tag-value="jewelry"');
    expect(html).toContain('>Jewelry</button>');
    expect(html).toContain('data-tag-kind="marketPositioning" data-tag-value="High Luxury"');
    expect(html).toContain('>High Luxury</button>');
  });

  it('links a corporate founder to its existing group profile', () => {
    const { html } = renderPanel({ kind: 'house', id: 'cos' });
    expect(html).toContain(`<th>Founder:</th><td><a href="#" data-select="group:${GroupId.HMGroup}">H&amp;M Group</a>`);
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
