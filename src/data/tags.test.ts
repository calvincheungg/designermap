import { describe, expect, it } from 'vitest';
import { houses } from './houses';
import { Aesthetic, BrandCategory, CollectionTag, MarketPositioning, ProductTag, brandCategories, marketPositionings, productTags, matchesHouseFilters } from './tags';

// Use a brand with a distinctive primary product so broad catalogue tags cannot
// accidentally bring it back into unrelated results.
describe('house tag filters', () => {
  it('matches all houses when filters are empty', () => {
    for (const house of Object.values(houses)) {
      expect(matchesHouseFilters(house.tags, {})).toBe(true);
    }
  });

  it('filters collection coverage independently from primary products', () => {
    expect(matchesHouseFilters(houses.chanel.tags, { collections: [CollectionTag.Menswear] })).toBe(false);
    expect(matchesHouseFilters(houses.chanel.tags, {
      collections: [CollectionTag.Menswear, CollectionTag.Womenswear],
      product: [ProductTag.Bags],
    })).toBe(true);
    expect(matchesHouseFilters(houses.brioni.tags, {
      collections: [CollectionTag.Menswear], product: [ProductTag.ReadyToWear],
    })).toBe(true);
    expect(matchesHouseFilters(houses.brioni.tags, { collections: [CollectionTag.Womenswear] })).toBe(false);
    expect(matchesHouseFilters(houses.dior.tags, { collections: [CollectionTag.Menswear] })).toBe(true);
    expect(matchesHouseFilters(houses.dior.tags, { collections: [CollectionTag.Womenswear] })).toBe(true);
    expect(matchesHouseFilters(houses.chanel.tags, {
      collections: [], product: [ProductTag.Footwear],
    })).toBe(false);
    expect(productTags).not.toContain('menswear');
    expect(productTags).not.toContain('womenswear');
  });

  it('finds specialist brands by their defining products', () => {
    for (const [tags, product] of [
      [houses.rimowa.tags, ProductTag.Luggage],
      [houses.venedaCarter.tags, ProductTag.Jewelry],
      [houses.oakley.tags, ProductTag.Eyewear],
      [houses.telfar.tags, ProductTag.Bags],
    ] as const) {
      expect(matchesHouseFilters(tags, { product: [product] })).toBe(true);
      expect(matchesHouseFilters(tags, { product: [ProductTag.Denim] })).toBe(false);
    }
    expect(matchesHouseFilters(houses.telfar.tags, { product: [ProductTag.Leather] })).toBe(false);
    expect(brandCategories).toContain('Designer-Led');
    expect(brandCategories).not.toContain('Independent Designer');
  });

  it('matches primary products and combines groups with AND', () => {
    const tags = houses.missoni.tags;
    expect(matchesHouseFilters(tags, { product: [ProductTag.Knitwear] })).toBe(true);
    expect(matchesHouseFilters(tags, {
      marketPositioning: [MarketPositioning.Luxury],
      aesthetic: [Aesthetic.Maximalist],
      product: [ProductTag.Knitwear],
    })).toBe(true);
    expect(matchesHouseFilters(tags, {
      brandCategory: [BrandCategory.Outdoor],
      product: [ProductTag.Knitwear],
    })).toBe(false);
    expect(matchesHouseFilters(tags, { product: [ProductTag.Footwear] })).toBe(false);
  });

  it('allows removing one group while keeping the other filters', () => {
    const tags = houses.missoni.tags;
    expect(matchesHouseFilters(tags, {
      aesthetic: [Aesthetic.Minimalist], product: [ProductTag.Knitwear],
    })).toBe(false);
    expect(matchesHouseFilters(tags, {
      aesthetic: undefined, product: [ProductTag.Knitwear],
    })).toBe(true);
  });

  it('keeps market positioning independent of brand identity', () => {
    expect(marketPositionings).toEqual(['Luxury', 'Premium', 'Mid-market', 'Budget']);
    expect(brandCategories).not.toContain('Luxury');
    expect(brandCategories).not.toContain('Contemporary');
    const tags = houses.palmAngels.tags;
    expect(matchesHouseFilters(tags, {
      marketPositioning: [MarketPositioning.Luxury],
      brandCategory: [BrandCategory.Streetwear],
    })).toBe(true);
    expect(matchesHouseFilters(tags, {
      marketPositioning: [MarketPositioning.Budget],
      brandCategory: [BrandCategory.Streetwear],
    })).toBe(false);
    expect(matchesHouseFilters(tags, {
      marketPositioning: undefined,
      brandCategory: [BrandCategory.Streetwear],
    })).toBe(true);
  });

  it('matches any selection within a group and all selected groups', () => {
    const tags = houses.missoni.tags;
    expect(matchesHouseFilters(tags, {
      marketPositioning: [MarketPositioning.Premium, MarketPositioning.Luxury],
      aesthetic: [Aesthetic.Minimalist, Aesthetic.Maximalist],
      product: [ProductTag.Footwear, ProductTag.Knitwear],
    })).toBe(true);
    expect(matchesHouseFilters(tags, {
      marketPositioning: [MarketPositioning.Premium, MarketPositioning.MidMarket],
      product: [ProductTag.Knitwear, ProductTag.ReadyToWear],
    })).toBe(false);
    expect(matchesHouseFilters(tags, {
      product: [ProductTag.Footwear, ProductTag.Denim],
    })).toBe(false);
  });

  it('treats cleared arrays as unrestricted without removing other groups', () => {
    const tags = houses.missoni.tags;
    expect(matchesHouseFilters(tags, {
      marketPositioning: [], brandCategory: [], aesthetic: [], product: [],
    })).toBe(true);
    expect(matchesHouseFilters(tags, {
      aesthetic: [], product: [ProductTag.Footwear],
    })).toBe(false);
  });
});
