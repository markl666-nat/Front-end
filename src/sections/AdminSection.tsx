import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  createBattleItem,
  deleteBattleItem,
  fetchBattleItems,
  updateBattleItem,
} from '../api/battleCatsApi';
import type { Product } from '../types';

/**
 * Админ-панель для управления каталогом.
 * Видна только Admin и Manager (проверка через useAuth).
 *
 * Возможности:
 *   - Список текущих товаров с кнопками Edit / Delete
 *   - Форма для создания нового товара
 *   - Inline-редактирование существующего товара
 *
 * Все операции идут через защищённые эндпоинты бэка (/api/battleitem).
 * Если токен истёк или прав не хватает — показываем ошибку.
 */
export function AdminSection() {
  const { isAuthenticated, userRole } = useAuth();

  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<number | null>(null);

  // Форма создания
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');

  const refresh = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchBattleItems();
      setItems(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) void refresh();
  }, [isAuthenticated]);

  // Скрываем секцию для неавторизованных и обычных юзеров
  if (!isAuthenticated || (userRole !== 'Admin' && userRole !== 'Manager')) {
    return null;
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const price = parseFloat(newPrice);
    if (!newName.trim() || !Number.isFinite(price) || price <= 0) {
      setError('Name and positive price required');
      return;
    }
    try {
      setBusy(-1);
      const result = await createBattleItem({
        id: 0,
        name: newName.trim(),
        priceEuro: price,
      });
      if (!result.isSuccess) {
        setError(result.message);
      } else {
        setNewName('');
        setNewPrice('');
        await refresh();
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Create failed');
    } finally {
      setBusy(null);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (userRole !== 'Admin') {
      setError('Only Admin can delete items');
      return;
    }
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      setBusy(id);
      const result = await deleteBattleItem(id);
      if (!result.isSuccess) {
        setError(result.message);
      } else {
        await refresh();
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Delete failed');
    } finally {
      setBusy(null);
    }
  };

  const handleUpdatePrice = async (id: number, name: string, currentPrice: number) => {
    const raw = prompt(`New price for "${name}":`, String(currentPrice));
    if (raw === null) return;
    const price = parseFloat(raw);
    if (!Number.isFinite(price) || price <= 0) {
      setError('Invalid price');
      return;
    }
    try {
      setBusy(id);
      setError(null);
      const result = await updateBattleItem({
        id,
        name,
        priceEuro: price,
      });
      if (!result.isSuccess) {
        setError(result.message);
      } else {
        await refresh();
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Update failed');
    } finally {
      setBusy(null);
    }
  };

  return (
    <section id="admin" className="admin-section">
      <h2 className="admin-title">
        🛠 Admin Panel <span className="admin-role-pill">{userRole}</span>
      </h2>

      <p className="admin-hint">
        Logged in as <strong>{userRole}</strong>. You can{' '}
        {userRole === 'Admin' ? 'create, edit and delete' : 'create and edit'}{' '}
        battle items.
      </p>

      {/* Форма создания */}
      <form onSubmit={handleCreate} className="admin-create-form">
        <input
          type="text"
          placeholder="New item name (e.g. Laser Cat)"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          disabled={busy !== null}
        />
        <input
          type="number"
          step="0.01"
          min="0.01"
          placeholder="Price €"
          value={newPrice}
          onChange={(e) => setNewPrice(e.target.value)}
          disabled={busy !== null}
        />
        <button type="submit" disabled={busy !== null}>
          {busy === -1 ? 'Creating...' : 'Create'}
        </button>
      </form>

      {error && <div className="admin-error">{error}</div>}

      {/* Список товаров */}
      <div className="admin-list">
        {loading && <div>Loading...</div>}
        {!loading && items.length === 0 && <div>No items yet.</div>}
        {!loading &&
          items.map((it) => {
            const id = Number(it.id);
            const isBusy = busy === id;
            return (
              <div key={it.id} className="admin-row">
                <div className="admin-row-info">
                  <strong>{it.title}</strong>
                  <span className="admin-row-meta">
                    {it.category} · €{it.priceEuro.toFixed(2)}
                  </span>
                </div>
                <div className="admin-row-actions">
                  <button
                    onClick={() => handleUpdatePrice(id, it.title, it.priceEuro)}
                    disabled={isBusy}
                  >
                    {isBusy ? '...' : 'Edit price'}
                  </button>
                  {userRole === 'Admin' && (
                    <button
                      className="danger"
                      onClick={() => handleDelete(id, it.title)}
                      disabled={isBusy}
                    >
                      {isBusy ? '...' : 'Delete'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </section>
  );
}