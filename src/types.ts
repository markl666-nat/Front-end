// ============ КАТЕГОРИИ ============
// Должны совпадать с записями в таблице Categories на бэке.
// Бэк отдаёт ItemCategory как { id, name }, мы используем name.
export type ProductCategory =
  | 'Cat Units'
  | 'Base Upgrades'
  | 'Buffs'
  | 'Gacha';

// ============ КАРТОЧКА ТОВАРА (UI-модель) ============
// Используется внутри React-компонентов. Получается из BattleItemDto через mapper.
export type Product = {
  id: string;
  title: string;
  description: string;
  priceEuro: number;
  category: ProductCategory;
  imageUrl: string;
};

// ============ КОНТРАКТ С БЭКОМ ============
// Полный BattleItemDto как приходит с GET /api/battleitem/getAll.
// Поля повторяют структуру C# DTO в проекте BattleCats.Domains.
export type BattleItemDto = {
  id: number;
  name: string;
  lore: BattleItemLoreDto | null;
  category: ItemCategoryDto;
  images: ProductImgDataDto[];
  priceEuro: number;
};

export type BattleItemLoreDto = {
  id: number;
  description: string;
  descriptionAdvanced: DescriptionAdvancedDto;
};

export type DescriptionAdvancedDto = {
  id: number;
  health: number;
  attack: number;
  range: number;
};

export type ItemCategoryDto = {
  id: number;
  name: string;
};

export type ProductImgDataDto = {
  id: number;
  url: string;
  battleItemId: number;
};

// ============ AUTH МОДЕЛИ ============
export type LoginRequest = {
  login: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  userId: number;
};

export type UserRole = 'User' | 'Manager' | 'Admin';
// ============ GENDER (для регистрации) ============
// Совпадает с enum GenderTypes на бэке (BattleCats.Domains.Enums).
export type GenderTypes = 0 | 1 | 2 | 3;   // NotSpecified | Male | Female | Other