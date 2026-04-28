import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/types/product";

export interface CartItem {
  product: Product;
  quantity: number;
}

const MAX_QTY = 99;

interface CartState {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, qty: number) => void;
  increment: (productId: string) => void;
  decrement: (productId: string) => void;
  clear: () => void;
  getCount: () => number;
  getTotalCents: () => number;
  getQuantity: (productId: string) => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) =>
        set((state) => {
          const existing = state.items.find((i) => i.product.id === product.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product.id === product.id
                  ? { ...i, quantity: Math.min(MAX_QTY, i.quantity + 1) }
                  : i
              ),
            };
          }
          return { items: [...state.items, { product, quantity: 1 }] };
        }),
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((i) => i.product.id !== productId),
        })),
      updateQuantity: (productId, qty) =>
        set((state) => {
          if (qty <= 0) {
            return {
              items: state.items.filter((i) => i.product.id !== productId),
            };
          }
          const clamped = Math.min(MAX_QTY, Math.max(1, Math.floor(qty)));
          return {
            items: state.items.map((i) =>
              i.product.id === productId ? { ...i, quantity: clamped } : i
            ),
          };
        }),
      increment: (productId) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.product.id === productId
              ? { ...i, quantity: Math.min(MAX_QTY, i.quantity + 1) }
              : i
          ),
        })),
      decrement: (productId) =>
        set((state) => {
          const item = state.items.find((i) => i.product.id === productId);
          if (!item) return state;
          if (item.quantity <= 1) {
            return {
              items: state.items.filter((i) => i.product.id !== productId),
            };
          }
          return {
            items: state.items.map((i) =>
              i.product.id === productId
                ? { ...i, quantity: i.quantity - 1 }
                : i
            ),
          };
        }),
      clear: () => set({ items: [] }),
      getCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      getTotalCents: () =>
        get().items.reduce(
          (sum, i) => sum + i.product.priceCents * i.quantity,
          0
        ),
      getQuantity: (productId) =>
        get().items.find((i) => i.product.id === productId)?.quantity ?? 0,
    }),
    {
      name: "salamarket-cart",
    }
  )
);
