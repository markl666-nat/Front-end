import { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

type Order = {
  id: string;
  date: string;
  items: { productId: string; qty: number; title: string; priceEuro: number }[];
  total: number;
  shippingAddress: string;
  paymentMethod: string;
};

export default function ProfilePage() {
  const { isAuthenticated, userName, userRole, userId } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [tab, setTab] = useState<'info' | 'orders'>('info');

  useEffect(() => {
    if (!userName) return;
    const raw = localStorage.getItem(`cbs_orders_${userName}`);
    setOrders(raw ? JSON.parse(raw) : []);
  }, [userName]);

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="profile-page">
      <h1>👤 My Profile</h1>

      <div className="profile-tabs">
        <button
          className={`profile-tab ${tab === 'info' ? 'active' : ''}`}
          onClick={() => setTab('info')}
        >
          Account info
        </button>
        <button
          className={`profile-tab ${tab === 'orders' ? 'active' : ''}`}
          onClick={() => setTab('orders')}
        >
          Order history ({orders.length})
        </button>
      </div>

      {tab === 'info' && (
        <div className="profile-info">
          <div className="profile-row"><span>Username:</span> <strong>{userName}</strong></div>
          <div className="profile-row"><span>User ID:</span> <strong>{userId}</strong></div>
          <div className="profile-row">
            <span>Role:</span>
            <span className="header-user-role">{userRole}</span>
          </div>
        </div>
      )}

      {tab === 'orders' && (
        <div className="profile-orders">
          {orders.length === 0 ? (
            <div className="orders-empty">
              <p>No orders yet.</p>
              <Link to="/catalog">Start shopping →</Link>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <strong>{order.id}</strong>
                  <span>{new Date(order.date).toLocaleString()}</span>
                </div>
                <div className="order-items">
                  {order.items.map((it, idx) => (
                    <div key={idx} className="order-item-row">
                      <span>{it.title} × {it.qty}</span>
                      <span>€{(it.priceEuro * it.qty).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="order-meta">
                  <span>📍 {order.shippingAddress}</span>
                  <span>💳 {order.paymentMethod}</span>
                </div>
                <div className="order-total">
                  Total: <strong>€{order.total.toFixed(2)}</strong>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}