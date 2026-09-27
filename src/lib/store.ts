import { useEffect, useState, useCallback } from 'react';
import type { CartItem, FavoriteItem, Address } from '@/types';

const CART_KEY = 'renzo_cart';
const FAV_KEY = 'renzo_favorites';
const ADDR_KEY = 'renzo_addresses';
const RECENT_KEY = 'renzo_recent';
const VISIT_KEY = 'renzo_first_visit_done';

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>(() => readJSON<CartItem[]>(CART_KEY, []));

  useEffect(() => {
    writeJSON(CART_KEY, items);
  }, [items]);

  const addToCart = useCallback((item: CartItem) => {
    setItems((prev) => {
      const idx = prev.findIndex(
        (i) => i.product_id === item.product_id && i.color === item.color && i.size === item.size,
      );
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], quantity: next[idx].quantity + item.quantity };
        return next;
      }
      return [...prev, item];
    });
  }, []);

  const updateQuantity = useCallback((product_id: string, color: string, size: string, qty: number) => {
    setItems((prev) =>
      prev
        .map((i) =>
          i.product_id === product_id && i.color === color && i.size === size
            ? { ...i, quantity: Math.max(1, qty) }
            : i,
        )
        .filter((i) => i.quantity > 0),
    );
  }, []);

  const removeFromCart = useCallback((product_id: string, color: string, size: string) => {
    setItems((prev) =>
      prev.filter((i) => !(i.product_id === product_id && i.color === color && i.size === size)),
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = items.reduce((sum, i) => sum + (i.discount_price ?? i.price) * i.quantity, 0);

  return { items, addToCart, updateQuantity, removeFromCart, clearCart, cartCount, cartTotal };
}

export function useFavorites() {
  const [items, setItems] = useState<FavoriteItem[]>(() => readJSON<FavoriteItem[]>(FAV_KEY, []));

  useEffect(() => {
    writeJSON(FAV_KEY, items);
  }, [items]);

  const toggleFavorite = useCallback((item: FavoriteItem) => {
    setItems((prev) => {
      const exists = prev.find((i) => i.product_id === item.product_id);
      if (exists) return prev.filter((i) => i.product_id !== item.product_id);
      return [...prev, { ...item, added_at: Date.now() }];
    });
  }, []);

  const isFavorite = useCallback(
    (product_id: string) => items.some((i) => i.product_id === product_id),
    [items],
  );

  const removeFavorite = useCallback((product_id: string) => {
    setItems((prev) => prev.filter((i) => i.product_id !== product_id));
  }, []);

  return { items, toggleFavorite, isFavorite, removeFavorite, favCount: items.length };
}

export function useAddresses() {
  const [addresses, setAddresses] = useState<Address[]>(() => readJSON<Address[]>(ADDR_KEY, []));

  useEffect(() => {
    writeJSON(ADDR_KEY, addresses);
  }, [addresses]);

  const addAddress = useCallback((addr: Omit<Address, 'id'>) => {
    const id = crypto.randomUUID();
    setAddresses((prev) => {
      const next = [...prev, { ...addr, id }];
      if (addr.is_default) {
        return next.map((a) => ({ ...a, is_default: a.id === id }));
      }
      return next;
    });
  }, []);

  const updateAddress = useCallback((id: string, updates: Partial<Address>) => {
    setAddresses((prev) =>
      prev.map((a) => {
        if (a.id === id) return { ...a, ...updates };
        if (updates.is_default) return { ...a, is_default: false };
        return a;
      }),
    );
  }, []);

  const removeAddress = useCallback((id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  }, []);

  return { addresses, addAddress, updateAddress, removeAddress };
}

export function useRecentViews() {
  const [items, setItems] = useState<{ product_id: string; name: string; slug: string; image_url: string; price: number; discount_price: number | null }[]>(() =>
    readJSON(RECENT_KEY, []),
  );

  useEffect(() => {
    writeJSON(RECENT_KEY, items);
  }, [items]);

  const addRecent = useCallback((item: { product_id: string; name: string; slug: string; image_url: string; price: number; discount_price: number | null }) => {
    setItems((prev) => {
      const filtered = prev.filter((i) => i.product_id !== item.product_id);
      return [item, ...filtered].slice(0, 10);
    });
  }, []);

  return { items, addRecent };
}

export function useFirstVisit() {
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const done = localStorage.getItem(VISIT_KEY);
    if (!done) setShowWarning(true);
  }, []);

  const dismissWarning = useCallback(() => {
    localStorage.setItem(VISIT_KEY, '1');
    setShowWarning(false);
  }, []);

  return { showWarning, dismissWarning };
}
