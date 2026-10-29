"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getProduct } from "@/data/products";

export interface CartItem {
  slug: string;
  qty: number;
}

interface CartContextValue {
  items: CartItem[];
  ready: boolean;
  count: number;
  totalQty: number;
  add: (slug: string, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
  has: (slug: string) => boolean;
}

const STORAGE_KEY = "raphia-mada-quote-cart";

const CartContext = createContext<CartContextValue | null>(null);

function isValidItems(value: unknown): value is CartItem[] {
  return (
    Array.isArray(value) &&
    value.every(
      (it) =>
        typeof it === "object" &&
        it !== null &&
        typeof (it as CartItem).slug === "string" &&
        getProduct((it as CartItem).slug) !== undefined &&
        typeof (it as CartItem).qty === "number" &&
        Number.isFinite((it as CartItem).qty) &&
        (it as CartItem).qty > 0
    )
  );
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (isValidItems(parsed)) setItems(parsed);
      }
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items, ready]);

  const add = useCallback((slug: string, qty?: number) => {
    setItems((prev) => {
      const existing = prev.find((it) => it.slug === slug);
      if (existing) {
        return prev.map((it) =>
          it.slug === slug ? { ...it, qty: qty ? Math.max(it.qty, qty) : it.qty + 1 } : it
        );
      }
      return [...prev, { slug, qty: qty ?? 1 }];
    });
  }, []);

  const setQty = useCallback((slug: string, qty: number) => {
    setItems((prev) =>
      prev.map((it) => (it.slug === slug ? { ...it, qty: Math.max(1, Math.round(qty)) } : it))
    );
  }, []);

  const remove = useCallback((slug: string) => {
    setItems((prev) => prev.filter((it) => it.slug !== slug));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(() => {
    const count = items.length;
    const totalQty = items.reduce((sum, it) => sum + it.qty, 0);
    return {
      items,
      ready,
      count,
      totalQty,
      add,
      setQty,
      remove,
      clear,
      has: (slug) => items.some((it) => it.slug === slug),
    };
  }, [items, ready, add, setQty, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
