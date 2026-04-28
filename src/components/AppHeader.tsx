import { ShoppingBag } from "lucide-react";
import { BRAND } from "@/config/brand";
import { useCartStore } from "@/stores/cartStore";

export const AppHeader = () => {
  const count = useCartStore((s) => s.items.reduce((n, i) => n + i.quantity, 0));

  return (
    <header className="sticky top-0 z-40 bg-bg/95 backdrop-blur border-b border-border">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <h1 className="font-bold text-lg text-primary tracking-tight">
          {BRAND.name}
        </h1>
        <button
          aria-label="Voir le panier"
          className="relative p-2 -mr-2 text-text"
        >
          <ShoppingBag size={24} />
          {count > 0 && (
            <span className="absolute top-0 right-0 min-w-[20px] h-5 px-1 rounded-full bg-accent text-white text-xs font-bold flex items-center justify-center">
              {count}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
