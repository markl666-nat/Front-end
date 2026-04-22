import { useEffect, useMemo, useState } from 'react';
import './App.css';

import { products } from './data/products';
import type { Product, ProductCategory } from './types.ts';
import { fetchFakeStoreProducts } from './api/fakeStore.ts';

import { Header } from './components/Header';
import { Footer } from './components/Footer';

import { HeroSection } from './sections/HeroSection';
import { CatalogSection } from './sections/CatalogSection';
import { FavoritesSection } from './sections/FavoritesSection';
import { AboutSection } from './sections/AboutSection';

export default function App() {
  const [activeTab, setActiveTab] = useState<'All' | ProductCategory>('All');
  const [query, setQuery] = useState('');
  const [likedIds, setLikedIds] = useState<Set<string>>(() => new Set());
  const [cartIds, setCartIds] = useState<Set<string>>(() => new Set());
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
        const data = await fetchFakeStoreProducts(controller.signal);
        setApiProducts(data);
      } catch (e) {
        if (e instanceof DOMException && e.name === 'AbortError') return;
        const msg = e instanceof Error ? e.message : 'Network error';
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    void load();
    return () => controller.abort();
  }, []);

  const allProducts = useMemo(
    () => [...products, ...apiProducts],
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

  const favorites = useMemo(
    () => allProducts.filter((p) => likedIds.has(p.id)),
    [allProducts, likedIds],
  );

  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const toggleLike = (id: string) => {
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleCart = (id: string) => {
    setCartIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="page">
      <Header
        filteredCount={filtered.length}
        likedCount={likedIds.size}
        cartCount={cartIds.size}
        onGoToCatalog={() => scrollToId('catalog')}
        onGoToFavorites={() => scrollToId('favorites')}
        onGoToAbout={() => scrollToId('about')}
      />

      <main>
        <HeroSection
          onGoToCatalog={() => scrollToId('catalog')}
          onResetFilters={() => {
            setQuery('');
            setActiveTab('All');
            scrollToId('catalog');
          }}
        />

        <CatalogSection
          query={query}
          onQueryChange={setQuery}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          products={filtered}
          loading={loading}
          error={error}
          likedIds={likedIds}
          cartIds={cartIds}
          onToggleLike={toggleLike}
          onToggleCart={toggleCart}
        />

        <FavoritesSection favorites={favorites} onToggleLike={toggleLike} />

        <AboutSection />
      </main>

      <Footer />
    </div>
  );
}