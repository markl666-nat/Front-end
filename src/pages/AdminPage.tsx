import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  createBattleItem,
  deleteBattleItem,
  fetchBattleItems,
  updateBattleItem,
} from '../api/battleCatsApi';
import { API_BASE_URL, STORAGE_KEYS } from '../api/config';
import type { Product } from '../types';

type TabKey = 'items' | 'users';

type UserRow = {
  id: number;
  userName: string;
  email: string;
  role: number;
  dob: string;
};

const ROLE_LABELS: Record<number, string> = {
  1: 'User',
  20: 'Manager',
  30: 'Admin',
};

function authHeaders(): HeadersInit {
  const token = localStorage.getItem(STORAGE_KEYS.token);
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

export default function AdminPage() {
  const { isAuthenticated, userRole, userId } = useAuth();
  const [tab, setTab] = useState<TabKey>('items');

  // Battle Items state
  const [items, setItems] = useState<Product[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [errorItems, setErrorItems] = useState<string | null>(null);
  const [busyItem, setBusyItem] = useState<number | null>(null);
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');

  // Users state
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [errorUsers, setErrorUsers] = useState<string | null>(null);
  const [busyUser, setBusyUser] = useState<number | null>(null);

  const refreshItems = async () => {
    try {
      setLoadingItems(true);
      setErrorItems(null);
      const data = await fetchBattleItems();
      setItems(data);
    } catch (e) {
      setErrorItems(e instanceof Error ? e.message : 'Failed to load');
    } finally {
      setLoadingItems(false);
    }
  };

  const refreshUsers = async () => {
    try {
      setLoadingUsers(true);
      setErrorUsers(null);
      const response = await fetch(`${API_BASE_URL}/api/user/getAll`, {
        headers: authHeaders(),
      });
      if (!response.ok) throw new Error(`Server returned ${response.status}`);
      const data = (await response.json()) as UserRow[];
      setUsers(data);
    } catch (e) {
      setErrorUsers(e instanceof Error ? e.message : 'Failed to load users');
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    if (tab === 'items') void refreshItems();
    if (tab === 'users' && userRole === 'Admin') void refreshUsers();
  }, [tab, isAuthenticated, userRole]);

  // Защита страницы
  if (!isAuthenticated || (userRole !== 'Admin' && userRole !== 'Manager')) {
    return <Navigate to="/" replace />;
  }

  // ============== ITEMS HANDLERS ==============
  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorItems(null);
    const price = parseFloat(newPrice);
    if (!newName.trim() || !Number.isFinite(price) || price <= 0) {
      setErrorItems('Name and positive price required');
      return;
    }
    try {
      setBusyItem(-1);
      const result = await createBattleItem({ id: 0, name: newName.trim(), priceEuro: price });
      if (!result.isSuccess) setErrorItems(result.message);
      else { setNewName(''); setNewPrice(''); await refreshItems(); }
    } catch (e) {
      setErrorItems(e instanceof Error ? e.message : 'Create failed');
    } finally {
      setBusyItem(null);
    }
  };

  const handleDeleteItem = async (id: number, name: string) => {
    if (userRole !== 'Admin') { setErrorItems('Only Admin can delete items'); return; }
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      setBusyItem(id);
      const result = await deleteBattleItem(id);
      if (!result.isSuccess) setErrorItems(result.message);
      else await refreshItems();
    } catch (e) {
      setErrorItems(e instanceof Error ? e.message : 'Delete failed');
    } finally {
      setBusyItem(null);
    }
  };

  const handleUpdateItemPrice = async (id: number, name: string, currentPrice: number) => {
    const raw = prompt(`New price for "${name}":`, String(currentPrice));
    if (raw === null) return;
    const price = parseFloat(raw);
    if (!Number.isFinite(price) || price <= 0) { setErrorItems('Invalid price'); return; }
    try {
      setBusyItem(id);
      setErrorItems(null);
      const result = await updateBattleItem({ id, name, priceEuro: price });
      if (!result.isSuccess) setErrorItems(result.message);
      else await refreshItems();
    } catch (e) {
      setErrorItems(e instanceof Error ? e.message : 'Update failed');
    } finally {
      setBusyItem(null);
    }
  };

  // ============== USERS HANDLERS ==============
  const handleChangeRole = async (id: number, userName: string, currentRole: number) => {
    if (id === userId) {
      setErrorUsers('You cannot change your own role.');
      return;
    }
    const newRoleStr = prompt(
      `Change role for "${userName}".\nCurrent: ${ROLE_LABELS[currentRole]}.\nEnter new role number:\n  1 = User\n  20 = Manager\n  30 = Admin`,
      String(currentRole),
    );
    if (newRoleStr === null) return;
    const newRole = parseInt(newRoleStr, 10);
    if (![1, 20, 30].includes(newRole)) {
      setErrorUsers('Invalid role. Use 1, 20 or 30.');
      return;
    }
    try {
      setBusyUser(id);
      setErrorUsers(null);
      const response = await fetch(`${API_BASE_URL}/api/user/role`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ id, newRole }),
      });
      const result = await response.json();
      if (!result.isSuccess) setErrorUsers(result.message);
      else await refreshUsers();
    } catch (e) {
      setErrorUsers(e instanceof Error ? e.message : 'Role change failed');
    } finally {
      setBusyUser(null);
    }
  };

  const handleDeleteUser = async (id: number, userName: string) => {
    if (id === userId) {
      setErrorUsers('You cannot delete your own account.');
      return;
    }
    if (!confirm(`Delete user "${userName}"? This cannot be undone.`)) return;
    try {
      setBusyUser(id);
      setErrorUsers(null);
      const response = await fetch(`${API_BASE_URL}/api/user/id?id=${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      const result = await response.json();
      if (!result.isSuccess) setErrorUsers(result.message);
      else await refreshUsers();
    } catch (e) {
      setErrorUsers(e instanceof Error ? e.message : 'Delete failed');
    } finally {
      setBusyUser(null);
    }
  };

  return (
    <section id="admin" className="admin-section">
      <h2 className="admin-title">
        🛠 Admin Panel <span className="admin-role-pill">{userRole}</span>
      </h2>

      {/* Tabs */}
      <div className="admin-tabs">
        <button
          className={`admin-tab ${tab === 'items' ? 'active' : ''}`}
          onClick={() => setTab('items')}
        >
          📦 Battle Items ({items.length})
        </button>
        {userRole === 'Admin' && (
          <button
            className={`admin-tab ${tab === 'users' ? 'active' : ''}`}
            onClick={() => setTab('users')}
          >
            👥 Users ({users.length})
          </button>
        )}
      </div>

      {tab === 'items' && (
        <>
          <p className="admin-hint">
            Logged in as <strong>{userRole}</strong>. You can{' '}
            {userRole === 'Admin' ? 'create, edit and delete' : 'create and edit'} battle items.
          </p>

          <form onSubmit={handleCreateItem} className="admin-create-form">
            <input
              type="text"
              placeholder="New item name (e.g. Laser Cat)"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              disabled={busyItem !== null}
            />
            <input
              type="number"
              step="0.01"
              min="0.01"
              placeholder="Price €"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              disabled={busyItem !== null}
            />
            <button type="submit" disabled={busyItem !== null}>
              {busyItem === -1 ? 'Creating...' : 'Create'}
            </button>
          </form>

          {errorItems && <div className="admin-error">{errorItems}</div>}

          <div className="admin-list">
            {loadingItems && <div>Loading...</div>}
            {!loadingItems && items.length === 0 && <div>No items yet.</div>}
            {!loadingItems && items.map((it) => {
              const id = Number(it.id);
              const isBusy = busyItem === id;
              return (
                <div key={it.id} className="admin-row">
                  <div className="admin-row-info">
                    <strong>{it.title}</strong>
                    <span className="admin-row-meta">
                      {it.category} · €{it.priceEuro.toFixed(2)}
                    </span>
                  </div>
                  <div className="admin-row-actions">
                    <button onClick={() => handleUpdateItemPrice(id, it.title, it.priceEuro)} disabled={isBusy}>
                      {isBusy ? '...' : 'Edit price'}
                    </button>
                    {userRole === 'Admin' && (
                      <button className="danger" onClick={() => handleDeleteItem(id, it.title)} disabled={isBusy}>
                        {isBusy ? '...' : 'Delete'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {tab === 'users' && userRole === 'Admin' && (
        <>
          <p className="admin-hint">
            Manage user accounts. You cannot delete or change your own role.
          </p>

          {errorUsers && <div className="admin-error">{errorUsers}</div>}

          <div className="admin-list">
            {loadingUsers && <div>Loading...</div>}
            {!loadingUsers && users.length === 0 && <div>No users.</div>}
            {!loadingUsers && users.map((u) => {
              const isBusy = busyUser === u.id;
              const isMe = u.id === userId;
              return (
                <div key={u.id} className="admin-row">
                  <div className="admin-row-info">
                    <strong>
                      {u.userName} {isMe && <span className="me-pill">YOU</span>}
                    </strong>
                    <span className="admin-row-meta">
                      {u.email} · <span className={`role-tag role-${ROLE_LABELS[u.role]?.toLowerCase()}`}>
                        {ROLE_LABELS[u.role] ?? `Role ${u.role}`}
                      </span>
                    </span>
                  </div>
                  <div className="admin-row-actions">
                    <button
                      onClick={() => handleChangeRole(u.id, u.userName, u.role)}
                      disabled={isBusy || isMe}
                      title={isMe ? "Can't change your own role" : 'Change role'}
                    >
                      {isBusy ? '...' : 'Change role'}
                    </button>
                    <button
                      className="danger"
                      onClick={() => handleDeleteUser(u.id, u.userName)}
                      disabled={isBusy || isMe}
                      title={isMe ? "Can't delete yourself" : 'Delete user'}
                    >
                      {isBusy ? '...' : 'Delete'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}