import { useMemo } from 'react';
import { useCart } from '@/cart/CartContext';
import type { CartItem } from '@/cart/types';
import { useProducts } from '@/hooks/productHooks';

/** Per-line stock verdict for the current cart, computed against live catalogue stock. */
export type CartLineStockStatus = 'ok' | 'out' | 'insufficient';

export interface CartLineStock {
  id: CartItem['id'];
  variantKey?: string;
  name: string;
  quantity: number;
  /** Live stock for the product, or null while the catalogue is still loading / product missing. */
  stock: number | null;
  status: CartLineStockStatus;
}

export interface CartStock {
  lines: CartLineStock[];
  /** True if any line is out of stock or requests more than is available. */
  hasIssues: boolean;
  isLoading: boolean;
}

/**
 * Cross-references each cart line against the live catalogue so the UI can flag out-of-stock or
 * over-quantity items and block checkout before payment. A line item added while in stock can sell
 * out while it sits in the cart, so this re-checks against current stock rather than what was cached
 * on the item. Reuses the shared `useProducts` query (react-query cache), so it adds no extra fetch.
 */
export function useCartStock(): CartStock {
  const { cartItems } = useCart();
  const { data: products, isLoading } = useProducts();

  const stockById = useMemo(() => {
    const map = new Map<number, number>();
    (products ?? []).forEach((p) => map.set(p.id, p.stock));
    return map;
  }, [products]);

  const lines = useMemo<CartLineStock[]>(
    () =>
      cartItems.map((item) => {
        const stock = stockById.get(Number(item.id)) ?? null;
        let status: CartLineStockStatus = 'ok';
        if (stock !== null) {
          if (stock <= 0) status = 'out';
          else if (item.quantity > stock) status = 'insufficient';
        }
        return {
          id: item.id,
          variantKey: item.variantKey,
          name: item.name,
          quantity: item.quantity,
          stock,
          status,
        };
      }),
    [cartItems, stockById],
  );

  return {
    lines,
    hasIssues: lines.some((l) => l.status !== 'ok'),
    isLoading,
  };
}
