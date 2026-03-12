import type { Product, ProductCategory } from '../types.ts';

type FakeStoreProduct = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
};

const placeholder = (label: string) =>
  `https://placehold.co/800x520/png?text=${encodeURIComponent(label)}`;

const mapCategory = (category: string): ProductCategory => {
  const c = category.toLowerCase();
  if (c.includes('electronic')) return 'Base Upgrades';
  if (c.includes("men's") || c.includes("women's") || c.includes('clothing'))
    return 'Cat Units';
  if (c.includes('jewel')) return 'Buffs';
  return 'Gacha';
};

const catUnitNames = [
  'Cat',
  'Axe Cat',
  'Gross Cat',
  'Cow Cat',
  'Bird Cat',
  'Fish Cat',
  'Lizard Cat',
  'Ninja Cat',
  'Samurai Cat',
  'Sumo Cat',
  'Salon Cat',
  'Paris Cat',
  'Viking Cat',
  'Pirate Cat',
  'Bishop Cat',
  'Artist Cat',
  'Psychocat',
  'Nerd Cat',
  'Hacker Cat',
  'Castaway Cat',
  'Swimmer Cat',
  'Surfer Cat',
  'Hip Hop Cat',
  'Figure Skating Cats',
  'Weightlifter Cat',
  'Kung Fu Cat',
  'Delinquent Cat',
  'Swordsman Cat',
  'Archer Cat',
  'Witch Cat',
  'Shaman Cat',
  'Fortune Teller Cat',
  'Juliet Cat',
  'Rocker Cat',
  'Bath Cat',
  'Sadako Cat',
  'Thief Cat',
  'Gardener Cat',
  'Chef Cat',
  'Jurassic Cat',
  'Jamiera Cat',
  'Cyborg Cat',
  'Cameraman Cat',
  'Can Can Cat',
  'Ramen Cat',
  'Apple Cat',
  'Sushi Cat',
  'Tank Cat',
  'Dragon Cat',
  'Titan Cat',
  'Kung Fu Cats',
  'Paris Cats',
  'Valkyrie Cat',
  'Bahamut Cat',
  'Macho Cat',
  'Wall Cat',
  'Brave Cat',
  'Boogie Cat',
  'Samba Cat',
  'Wushu Cat',
  'Biker Cat',
  'Mer Cat',
  'Rocker Cats',
  'Witch Cats',
  'Nerd Cats',
  'Hacker Cats',
  'Archer Cats',
  'Swordsman Cats',
  'Chef Cats',
  'Gardener Cats',
  'Thief Cats',
] as const;

const pickCatUnitName = (seed: number) => {
  const idx = Math.abs(seed) % catUnitNames.length;
  return catUnitNames[idx];
};

const makeGameTitle = (cat: ProductCategory, id: number) => {
  switch (cat) {
    case 'Cat Units':
      return pickCatUnitName(id);
    case 'Base Upgrades':
      return `Base upgrade #${id}`;
    case 'Buffs':
      return `Buff #${id}`;
    case 'Gacha':
      return `Gacha capsule #${id}`;
  }
};

const makeGameDescription = (cat: ProductCategory) => {
  switch (cat) {
    case 'Cat Units':
      return 'Battle cat unit for your squad. Works with many strategies.';
    case 'Base Upgrades':
      return 'Base upgrade that helps your base survive longer and progress faster.';
    case 'Buffs':
      return 'Temporary buff that strengthens your team for hard stages.';
    case 'Gacha':
      return 'Capsule with a chance to pull rare and super rare cats.';
  }
};

export async function fetchFakeStoreProducts(
  signal?: AbortSignal,
): Promise<Product[]> {
  const res = await fetch('https://fakestoreapi.com/products', { signal });
  if (!res.ok) throw new Error('Server error while loading products');
  const data = (await res.json()) as FakeStoreProduct[];

  return data.map((p) => ({
    id: `api-${p.id}`,
    title: makeGameTitle(mapCategory(p.category), p.id),
    description: makeGameDescription(mapCategory(p.category)),
    priceEuro: Math.max(2, Math.round(p.price / 4)),
    category: mapCategory(p.category),
    imageUrl: placeholder(makeGameTitle(mapCategory(p.category), p.id)),
  }));
}

