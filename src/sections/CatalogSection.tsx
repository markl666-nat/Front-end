import type { Product, ProductCategory } from '../types.ts';
import { ProductCard } from '../components/ProductCard.tsx';

const filterTabs: Array<{ id: 'All' | ProductCategory; label: string }> = [
  { id: 'All', label: 'All' },
  { id: 'Cat Units', label: 'Cat Units' },
  { id: 'Base Upgrades', label: 'Base Upgrades' },
  { id: 'Buffs', label: 'Buffs' },
  { id: 'Gacha', label: 'Gacha Capsules' },
];

type Props = {
  query: string;
  onQueryChange: (value: string) => void;
  activeTab: 'All' | ProductCategory;
  onTabChange: (tab: 'All' | ProductCategory) => void;
  products: Product[];
  loading: boolean;
  error: string | null;
  likedIds: Set<string>;
  cartIds: Set<string>;
  onToggleLike: (id: string) => void;
  onToggleCart: (id: string) => void;
};

export function CatalogSection({
  query,
  onQueryChange,
  activeTab,
  onTabChange,
  products,
  loading,
  error,
  likedIds,
  cartIds,
  onToggleLike,
  onToggleCart,
}: Props) {
  return (
    <section className="container section" id="catalog">
      <div className="section__header">
        <h2 className="section__title">Catalog</h2>
        <p className="section__subtitle">
          Search by name and filter by categories.
        </p>
      </div>

      <div className="controls">
        <label className="search">
          <span className="search__label">Search</span>
          <input
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            className="search__input"
            placeholder="For example: Tank Cat"
            inputMode="search"
          />
        </label>

        <div className="tabs" role="tablist" aria-label="Categories">
          {filterTabs.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={activeTab === t.id}
              className={activeTab === t.id ? 'tab tab--active' : 'tab'}
              onClick={() => onTabChange(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid" aria-label="Product list">
        {products.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            liked={likedIds.has(p.id)}
            inCart={cartIds.has(p.id)}
            onToggleLike={() => onToggleLike(p.id)}
            onToggleCart={() => onToggleCart(p.id)}
          />
        ))}
      </div>

      {loading && (
        <div className="empty" role="status">
          Loading...
        </div>
      )}

      {!loading && error && (
        <div className="empty" role="alert">
          Error: {error}
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <div className="empty" role="status">
          Nothing found. Try changing your query or category.
        </div>
      )}
    </section>
  );
}