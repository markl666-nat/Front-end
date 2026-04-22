export type ProductCategory =
  | 'Cat Units'
  | 'Base Upgrades'
  | 'Buffs'
  | 'Gacha';

export type Product = {
  id: string;
  title: string;
  description: string;
  priceRub: number;
  category: ProductCategory;
  imageUrl: string;
};

