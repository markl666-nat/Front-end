import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../api/config';
import { products as mockProducts } from '../data/products';
import { useCart } from '../context/CartContext';
import type { BattleItemDto, Product, ProductCategory } from '../types';

/**
 * Превращает DTO бэка в UI-модель Product.
 * Дублируем логику из battleCatsApi.ts, чтобы получить ПОЛНЫЙ объект DTO
 * с lore + descriptionAdvanced (статы), чего стандартный fetchBattleItems не отдаёт
 * напрямую — тот возвращает уже упрощённый Product.
 */
function dtoToProduct(dto: BattleItemDto): Product {
  const known: ProductCategory[] = ['Cat Units', 'Base Upgrades', 'Buffs', 'Gacha'];
  const cat = dto.category?.name ?? '';
  const category = known.includes(cat as ProductCategory) ? (cat as ProductCategory) : 'Cat Units';
  return {
    id: String(dto.id),
    title: dto.name,
    description: dto.lore?.description ?? '',
    priceEuro: dto.priceEuro,
    category,
    imageUrl: dto.images?.[0]?.url ?? '',
  };
}

export default function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isInCart, toggleCart } = useCart();

  const [dto, setDto] = useState<BattleItemDto | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        // Грузим полный DTO напрямую (с lore + descriptionAdvanced)
        const response = await fetch(`${API_BASE_URL}/api/battleitem/id?id=${id}`);
        if (!response.ok) throw new Error(`Server returned ${response.status}`);

        const data = (await response.json()) as BattleItemDto;
        if (cancelled) return;
        setDto(data);
        setProduct(dtoToProduct(data));
      } catch (e) {
        if (!cancelled) {
          // Fallback на mock-данные если бэк недоступен
          const mock = mockProducts.find((p) => p.id === id);
          if (mock) {
            setProduct(mock);
          } else {
            setError(e instanceof Error ? e.message : 'Product not found');
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void load();
    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return <div className="page-stub"><h1>Loading...</h1></div>;
  }

  if (error || !product) {
    return (
      <div className="page-stub">
        <h1>404 — Product not found</h1>
        <p>{error}</p>
        <Link to="/catalog">Back to catalog</Link>
      </div>
    );
  }

  const stats = dto?.lore?.descriptionAdvanced;
  const inCart = isInCart(product.id);

  return (
    <div className="product-details">
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>

      <div className="product-details-grid">
        <div className="product-details-img-wrap">
          <img src={product.imageUrl} alt={product.title} />
        </div>

        <div className="product-details-info">
          <span className="product-category-tag">{product.category}</span>
          <h1>{product.title}</h1>
          <p className="product-description">{product.description}</p>

          {stats && (
            <div className="product-stats">
              <h3 className="product-stats-title">⚔️ Battle Stats</h3>
              <div className="stat-row">
                <span className="stat-label">❤️ Health</span>
                <span className="stat-value">{stats.health}</span>
                <div className="stat-bar"><div className="stat-bar-fill" style={{ width: `${Math.min(100, stats.health / 100)}%`, background: '#e85d2e' }} /></div>
              </div>
              <div className="stat-row">
                <span className="stat-label">⚔️ Attack</span>
                <span className="stat-value">{stats.attack}</span>
                <div className="stat-bar"><div className="stat-bar-fill" style={{ width: `${Math.min(100, stats.attack / 15)}%`, background: '#ff6b35' }} /></div>
              </div>
              <div className="stat-row">
                <span className="stat-label">🎯 Range</span>
                <span className="stat-value">{stats.range}</span>
                <div className="stat-bar"><div className="stat-bar-fill" style={{ width: `${Math.min(100, stats.range / 5)}%`, background: '#ffa726' }} /></div>
              </div>
            </div>
          )}

          <div className="product-price">€{product.priceEuro.toFixed(2)}</div>

          <button
            className={inCart ? 'add-to-cart-btn in-cart' : 'add-to-cart-btn'}
            onClick={() => toggleCart(product.id)}
          >
            {inCart ? '✓ In Cart — Click to Remove' : '🛒 Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}