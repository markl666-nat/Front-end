import { useEffect, useMemo, useState } from 'react';
import { products } from '../data/products';
import type { Product, ProductCategory } from '../types';
import { fetchBattleItems } from '../api/battleCatsApi';
import { CatalogSection } from '../sections/CatalogSection';

// 1. Импортируем хук контекста
import { useCart } from '../context/CartContext';

/**
 * Полноценная страница каталога — без Hero/About,
 * с расширенными возможностями фильтрации.
 */
export default function CatalogPage() {
  const [activeTab, setActiveTab] = useState<'All' | ProductCategory>('All');
  const [query, setQuery] = useState('');
  const [likedIds, setLikedIds] = useState<Set<string>>(() => new Set());
  
  // 2. Инициализируем контекст (cartIds и локальный toggleCart удалены)
  const { cart: cartMap, isInCart, toggleCart } = useCart();

  const [apiProducts, setApiProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const normalizedQuery = query.trim().toLowerCase();

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchBattleItems(controller.signal);
        setApiProducts(data);
      } catch (e) {
        if (e instanceof DOMException && e.name === 'AbortError') return;
        setError(e instanceof Error ? e.message : 'Network error');
      } finally {
        setLoading(false);
      }
    };
    void load();
    return () => controller.abort();
  }, []);

  const allProducts = useMemo(
    () => (apiProducts.length > 0 ? apiProducts : products),
    [apiProducts],
  );

  const filtered = useMemo(() => {
    return allProducts.filter((p) => {
      const okTab = activeTab === 'All' ? true : p.category === activeTab;
      const okQuery =
        normalizedQuery.length === 0
          ? true
          : p.title.toLowerCase().includes(normalizedQuery);
      return okTab && okQuery;
    });
  }, [activeTab, allProducts, normalizedQuery]);

  const toggleLike = (id: string) => {
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="catalog-page">
      <div className="catalog-page-header">
        <h1>📦 Full Catalog</h1>
        <p>Browse all {allProducts.length} battle items.</p>
      </div>
      <CatalogSection
        query={query}
        onQueryChange={setQuery}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        products={filtered}
        loading={loading}
        error={error}
        likedIds={likedIds}
        // 3. Передаем Set, созданный из ключей объекта корзины
        cartIds={new Set(Object.keys(cartMap))}
        onToggleLike={toggleLike}
        onToggleCart={toggleCart}
      />
    </div>
  );
}