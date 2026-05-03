import { useCartStore } from "@/stores/cartStore";

// Selectors avec primitive equality — évite les re-renders inutiles que
// `useCartStore((s) => s.getCount())` causerait (la fonction renvoie une
// nouvelle référence à chaque appel, ce qui force un re-render même si
// le nombre n'a pas changé).
//
// Centralise la logique de reduce qui était dupliquée dans 4 composants
// (Header, AppHeader, BottomNav, StickyCartCTA).

export const useCartCount = (): number =>
  useCartStore((s) => s.items.reduce((n, i) => n + i.quantity, 0));

export const useCartTotalCents = (): number =>
  useCartStore((s) =>
    s.items.reduce((sum, i) => sum + i.product.priceCents * i.quantity, 0),
  );
