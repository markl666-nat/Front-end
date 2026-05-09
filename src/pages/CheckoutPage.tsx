import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchBattleItems } from '../api/battleCatsApi';
import { products as mockProducts } from '../data/products';
import type { Product } from '../types';

type Order = {
  id: string;
  date: string;
  items: { productId: string; qty: number; title: string; priceEuro: number }[];
  total: number;
  shippingAddress: string;
  paymentMethod: 'card' | 'paypal' | 'cod';
};

export default function CheckoutPage() {
  const { isAuthenticated, userName } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'cod'>('card');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem('cbs_cart');
    setCart(raw ? JSON.parse(raw) : {});
    fetchBattleItems()
      .then((d) => setProducts(d.length > 0 ? d : mockProducts))
      .catch(() => setProducts(mockProducts));
  }, []);

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const cartItems = Object.entries(cart)
    .map(([id, qty]) => {
      const p = products.find((x) => x.id === id);
      return p ? { product: p, qty } : null;
    })
    .filter((x): x is { product: Product; qty: number } => x !== null);

  const total = cartItems.reduce((s, i) => s + i.product.priceEuro * i.qty, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      alert('Cart is empty');
      return;
    }
    setSubmitting(true);

    const order: Order = {
      id: `order_${Date.now()}`,
      date: new Date().toISOString(),
      items: cartItems.map((i) => ({
        productId: i.product.id,
        qty: i.qty,
        title: i.product.title,
        priceEuro: i.product.priceEuro,
      })),
      total,
      shippingAddress: `${address}, ${city}`,
      paymentMethod,
    };

    // Сохраняем заказ в "историю заказов" пользователя
    const ordersKey = `cbs_orders_${userName ?? 'guest'}`;
    const raw = localStorage.getItem(ordersKey);
    const orders: Order[] = raw ? JSON.parse(raw) : [];
    orders.unshift(order);
    localStorage.setItem(ordersKey, JSON.stringify(orders));

    // Чистим корзину
    localStorage.removeItem('cbs_cart');

    setTimeout(() => {
      alert(`Order ${order.id} placed successfully!`);
      navigate('/profile');
    }, 600);
  };

  if (cartItems.length === 0) {
    return (
      <div className="page-stub">
        <h1>Cart is empty</h1>
        <p>Add items to your cart before checkout.</p>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h1>💳 Checkout</h1>

      <div className="checkout-grid">
        <form onSubmit={handleSubmit} className="checkout-form">
          <h2>Shipping address</h2>
          <label className="auth-label">
            Street + house
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              disabled={submitting}
            />
          </label>
          <label className="auth-label">
            City
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              disabled={submitting}
            />
          </label>

          <h2>Payment method</h2>
          <div className="payment-options">
            {[
              { value: 'card', label: '💳 Credit card' },
              { value: 'paypal', label: '🅿️ PayPal' },
              { value: 'cod', label: '💵 Cash on delivery' },
            ].map((opt) => (
              <label key={opt.value} className="payment-option">
                <input
                  type="radio"
                  name="payment"
                  value={opt.value}
                  checked={paymentMethod === opt.value}
                  onChange={(e) => setPaymentMethod(e.target.value as 'card')}
                  disabled={submitting}
                />
                {opt.label}
              </label>
            ))}
          </div>

          <button type="submit" className="auth-submit" disabled={submitting}>
            {submitting ? 'Placing order...' : `Place Order (€${total.toFixed(2)})`}
          </button>
        </form>

        <aside className="checkout-summary">
          <h3>Order summary</h3>
          {cartItems.map(({ product, qty }) => (
            <div key={product.id} className="summary-row">
              <span>{product.title} × {qty}</span>
              <span>€{(product.priceEuro * qty).toFixed(2)}</span>
            </div>
          ))}
          <div className="summary-total">
            <strong>Total</strong>
            <strong>€{total.toFixed(2)}</strong>
          </div>
        </aside>
      </div>
    </div>
  );
}