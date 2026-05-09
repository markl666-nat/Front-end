import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchBattleItems } from '../api/battleCatsApi';
import { products as mockProducts } from '../data/products';
import { useAuth } from '../context/AuthContext';
import type { Product } from '../types';

type CartMap = Record<string, number>;

export default function CartPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartMap>({});
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const raw = localStorage.getItem('cbs_cart');
    setCart(raw ? JSON.parse(raw) : {});
    fetchBattleItems()
      .then((data) => setProducts(data.length > 0 ? data : mockProducts))
      .catch(() => setProducts(mockProducts))
      .finally(() => setLoading(false));
  }, []);

  const saveCart = (next: CartMap) => {
    localStorage.setItem('cbs_cart', JSON.stringify(next));
    setCart(next);
  };

  const updateQty = (id: string, delta: number) => {
    const next = { ...cart };
    next[id] = Math.max(0, (next[id] ?? 0) + delta);
    if (next[id] === 0) delete next[id];
    saveCart(next);
  };

  const removeItem = (id: string) => {
    const next = { ...cart };
    delete next[id];
    saveCart(next);
  };

  const clearCart = () => {
    if (!confirm('Clear entire cart?')) return;
    saveCart({});
  };

  const cartItems = Object.entries(cart)
    .map(([id, qty]) => {
      const p = products.find((x) => x.id === id);
      return p ? { product: p, qty } : null;
    })
    .filter((x): x is { product: Product; qty: number } => x !== null);

  const total = cartItems.reduce(
    (sum, item) => sum + item.product.priceEuro * item.qty,
    0,
  );

  if (loading) return <div className="page-stub"><h1>Loading cart...</h1></div>;

  return (
    <div className="cart-page">
      <h1 className="cart-title">🛒 Your Cart</h1>

      {cartItems.length === 0 ? (
        <div className="cart-empty">
          <p>Your cart is empty.</p>
          <Link to="/catalog" className="cart-empty-btn">Browse Catalog</Link>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map(({ product, qty }) => (
              <div key={product.id} className="cart-row">
                <img src={product.imageUrl} alt={product.title} className="cart-row-img" />
                <div className="cart-row-info">
                  <strong>{product.title}</strong>
                  <span className="cart-row-meta">{product.category}</span>
                </div>
                <div className="cart-row-qty">
                  <button onClick={() => updateQty(product.id, -1)}>−</button>
                  <span>{qty}</span>
                  <button onClick={() => updateQty(product.id, +1)}>+</button>
                </div>
                <div className="cart-row-price">
                  €{(product.priceEuro * qty).toFixed(2)}
                </div>
                <button
                  className="cart-row-remove"
                  onClick={() => removeItem(product.id)}
                  title="Remove"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="cart-total">
              <span>Total:</span>
              <strong>€{total.toFixed(2)}</strong>
            </div>
            <div className="cart-actions">
              <button onClick={clearCart} className="cart-clear-btn">Clear cart</button>
              <button
                onClick={() => isAuthenticated ? navigate('/checkout') : navigate('/login')}
                className="cart-checkout-btn"
              >
                {isAuthenticated ? 'Proceed to Checkout' : 'Login to Checkout'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}