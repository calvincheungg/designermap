/** Import these enums when editing a house to get autocomplete and typo checks. */
export enum MarketPositioning {
  Luxury = 'Luxury',
  Premium = 'Premium',
  MidMarket = 'Mid-market',
  Budget = 'Budget',
}

export enum BrandCategory {
  DesignerFashion = 'Designer Fashion',
  AvantGarde = 'Avant-garde',
  Streetwear = 'Streetwear',
  Sportswear = 'Sportswear',
  Outdoor = 'Outdoor',
  Workwear = 'Workwear',
  Heritage = 'Heritage',
  Tailoring = 'Tailoring',
  FastFashion = 'Fast Fashion',
  /** Describes creative identity, not legal ownership or investor independence. */
  DesignerLed = 'Designer-Led',
  Couture = 'Couture',
  Footwear = 'Footwear',
  Accessories = 'Accessories',
}

export enum Aesthetic {
  Minimalist = 'Minimalist',
  Maximalist = 'Maximalist',
  AvantGarde = 'Avant-garde',
  Experimental = 'Experimental',
  Deconstructed = 'Deconstructed',
  Architectural = 'Architectural',
  Romantic = 'Romantic',
  Gothic = 'Gothic',
  Punk = 'Punk',
  Grunge = 'Grunge',
  Preppy = 'Preppy',
  Classic = 'Classic',
  Utilitarian = 'Utilitarian',
  Military = 'Military',
  Technical = 'Technical',
  Futuristic = 'Futuristic',
  Tailored = 'Tailored',
  Vintage = 'Vintage',
  Bohemian = 'Bohemian',
  Surrealist = 'Surrealist',
}

/** Collection coverage is independent of the house's primary product specialties. */
export enum CollectionTag {
  Menswear = 'Menswear',
  Womenswear = 'Womenswear',
}

export enum ProductTag {
  ReadyToWear = 'Ready-to-wear',
  Couture = 'couture',
  Footwear = 'footwear',
  Denim = 'denim',
  Knitwear = 'knitwear',
  Outerwear = 'outerwear',
  Accessories = 'accessories',
  Leather = 'leather',
  Bags = 'bags',
  Jewelry = 'jewelry',
  Eyewear = 'eyewear',
  Luggage = 'luggage',
}

export const brandCategories = Object.values(BrandCategory);
export const marketPositionings = Object.values(MarketPositioning);
export const aesthetics = Object.values(Aesthetic);
export const productTags = Object.values(ProductTag);
export const collectionTags = Object.values(CollectionTag);

/** Tuple lengths also enforce the editorial limits while editing houses.ts. */
type OneToThree<T> = readonly [T] | readonly [T, T] | readonly [T, T, T];
type OneToFour<T> = OneToThree<T> | readonly [T, T, T, T];

export interface HouseTags {
  readonly marketPositioning: MarketPositioning;
  readonly brandCategory: readonly [BrandCategory, ...BrandCategory[]];
  readonly aesthetic: OneToThree<Aesthetic>;
  /** Unisex ranges can be represented in both collections. */
  readonly collections: readonly [CollectionTag] | readonly [CollectionTag, CollectionTag];
  readonly product: OneToFour<ProductTag>;
}

export interface HouseFilters {
  marketPositioning?: readonly MarketPositioning[];
  brandCategory?: readonly BrandCategory[];
  aesthetic?: readonly Aesthetic[];
  collections?: readonly CollectionTag[];
  product?: readonly ProductTag[];
}

/** OR within each group, AND across groups; an empty group matches all houses. */
export function matchesHouseFilters(tags: HouseTags, filters: HouseFilters): boolean {
  return (!filters.marketPositioning?.length || filters.marketPositioning.includes(tags.marketPositioning))
    && (!filters.brandCategory?.length || filters.brandCategory.some((v) => tags.brandCategory.includes(v)))
    && (!filters.aesthetic?.length || filters.aesthetic.some((v) => tags.aesthetic.includes(v)))
    && (!filters.collections?.length || filters.collections.some((v) => tags.collections.includes(v)))
    && (!filters.product?.length || filters.product.some((v) => tags.product.includes(v)));
}
