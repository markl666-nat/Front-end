import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { fetchBattleItems } from '../api/battleCatsApi';
import { products as mockProducts } from '../data/products';
import type { Product } from '../types';

export default function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        const apiData = await fetchBattleItems();
        if (cancelled) return;
        const all = apiData.length > 0 ? apiData : mockProducts;
        const found = all.find((p) => p.id === id);
        if (!found) {
          setError('Product not found');
        } else {
          setProduct(found);
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void load();
    return () => { cancelled = true; };
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    const raw = localStorage.getItem('cbs_cart');
    const cart: Record<string, number> = raw ? JSON.parse(raw) : {};
    cart[product.id] = (cart[product.id] ?? 0) + 1;
    localStorage.setItem('cbs_cart', JSON.stringify(cart));
    alert(`Added "${product.title}" to cart!`);
  };

  if (loading) {
    return <div className="page-stub"><h1>Loading...</h1></div>;
  }
  if (error || !product) {
    return (
      <div className="page-stub">
        <h1>404 — Product not found</h1>
        <Link to="/catalog">Back to catalog</Link>
      </div>
    );
  }

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

          <div className="product-price">€{product.priceEuro.toFixed(2)}</div>

          <button className="add-to-cart-btn" onClick={handleAddToCart}>
            🛒 Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}