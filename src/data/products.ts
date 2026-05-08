import type { Product, ProductCategory } from '../types.ts';

const placeholder = (label: string) =>
  `https://placehold.co/800x520/png?text=${encodeURIComponent(label)}`;

export const categoryLabels: Record<ProductCategory, string> = {
  'Cat Units': 'Cat Units',
  'Base Upgrades': 'Base Upgrades',
  Buffs: 'Buffs',
  Gacha: 'Gacha Capsules',
};

export const products: Product[] = [
  {
    id: 'unit-001',
    title: 'Tank Cat',
    description: 'Frontline unit with high HP that helps hold the lane longer.',
    priceEuro: 5,
    category: 'Cat Units',
    imageUrl: 'https://i.pinimg.com/736x/9f/2d/a5/9f2da58928e69d38a63540e3e62cd7c9.jpg',
  },
  {
    id: 'unit-002',
    title: 'Dragon Cat',
    description: 'Long-range damage dealer that safely attacks from the backline.',
    priceEuro: 7,
    category: 'Cat Units',
    imageUrl: 'https://i.pinimg.com/1200x/ba/5f/50/ba5f5005254fb9fde094bdeb2c556e19.jpg',
  },
  {
    id: 'unit-003',
    title: 'Titan Cat',
    description: 'Heavy hitter that puts constant pressure on enemy lines.',
    priceEuro: 9,
    category: 'Cat Units',
    imageUrl: 'https://i.pinimg.com/736x/a6/fe/35/a6fe35d9731a1d04f48eb2674a2a52fe.jpg',
  },
  {
    id: 'unit-004',
    title: 'Thundia',
    description: 'Fast unit for finishing off enemies and pressuring weak targets.',
    priceEuro: 4,
    category: 'Cat Units',
    imageUrl:'https://i.pinimg.com/736x/cb/59/e0/cb59e0bcc26c005f72e73c856428cf94.jpg',
  },
  {
    id: 'unit-005',
    title: 'Samurai Cat',
    description: 'Reliable melee fighter that cuts through the frontline.',
    priceEuro: 4,
    category: 'Cat Units',
    imageUrl:'https://i.pinimg.com/1200x/15/c7/79/15c779cc8c32f871dbcf49a624a83d7c.jpg',  
  },
  {
    id: 'unit-006',
    title: 'Viking Cat',
    description: 'Strong attack and solid attack speed for steady DPS.',
    priceEuro: 6,
    category: 'Cat Units',
    imageUrl: placeholder('Viking Cat'),
  },
  {
    id: 'up-001',
    title: 'Base Upgrade: +HP',
    description: 'Increases base health so it survives enemy pushes longer.',
    priceEuro: 6,
    category: 'Base Upgrades',
    imageUrl: placeholder('Base HP Up'),
  },
  {
    id: 'up-002',
    title: 'Base Upgrade: Wallet Speed',
    description: 'Faster income so you can deploy cats more quickly.',
    priceEuro: 7,
    category: 'Base Upgrades',
    imageUrl: placeholder('Wallet Speed'),
  },
  {
    id: 'buff-001',
    title: 'Buff: Faster Cooldown',
    description: 'Reduces cooldowns so you can field more units at once.',
    priceEuro: 5,
    category: 'Buffs',
    imageUrl: placeholder('Cooldown Buff'),
  },
  {
    id: 'gacha-001',
    title: 'Rare Capsule',
    description: 'Gacha capsule with a chance to pull rare or super rare cats.',
    priceEuro: 3,
    category: 'Gacha',
    imageUrl: placeholder('Rare Capsule'),
  },
];

