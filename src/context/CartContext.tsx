import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

const STORAGE_KEY = 'cbs_cart';

/**
 * CartMap — словарь { productId -> qty }.
 * Синхронизируется с localStorage в обе стороны:
 *   - читаем при инициализации Provider (если уже что-то лежит)
 *   - пишем при каждом изменении state
 *
 * Это значит корзина переживает перезагрузку страницы и доступна
 * на любой странице приложения через useCart().
 */
type CartMap = Record<string, number>;

type CartState = {
  cart: CartMap;
  totalItems: number;                    // сумма qty всех товаров
  isInCart: (id: string) => boolean;     // быстрая проверка для ProductCard
  toggleCart: (id: string) => void;      // добавить/убрать (+1 или удалить совсем)
  increment: (id: string) => void;       // +1
  decrement: (id: string) => void;       // -1 (удаляет если стало 0)
  remove: (id: string) => void;          // полностью убрать товар
  clear: () => void;                     // очистить корзину (после оформления заказа)
};

const CartContext = createContext<CartState | undefined>(undefined);

function readFromStorage(): CartMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartMap>(readFromStorage);

  // Синхронизация в localStorage при любом изменении
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  // Синхронизация между вкладками: если в другой вкладке поменяли корзину,
  // подхватим изменение тут. Полезно для UX.
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setCart(readFromStorage());
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const isInCart = useCallback(
    (id: string) => Boolean(cart[id] && cart[id] > 0),
    [cart],
  );

  const toggleCart = useCallback((id: string) => {
    setCart((prev) => {
      const next = { ...prev };
      if (next[id] && next[id] > 0) {
        delete next[id];
      } else {
        next[id] = 1;
      }
      return next;
    });
  }, []);

  const increment = useCallback((id: string) => {
    setCart((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
  }, []);

  const decrement = useCallback((id: string) => {
    setCart((prev) => {
      const next = { ...prev };
      const current = next[id] ?? 0;
      if (current <= 1) {
        delete next[id];
      } else {
        next[id] = current - 1;
      }
      return next;
    });
  }, []);

  const remove = useCallback((id: string) => {
    setCart((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setCart({});
  }, []);

  const totalItems = useMemo(
    () => Object.values(cart).reduce((sum, qty) => sum + qty, 0),
    [cart],
  );

  const value: CartState = {
    cart,
    totalItems,
    isInCart,
    toggleCart,
    increment,
    decrement,
    remove,
    clear,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartState {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within <CartProvider>');
  }
  return ctx;
}