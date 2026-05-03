import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppHeader } from "@/components/AppHeader";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice, unitLabel } from "@/lib/format";

const Cart = () => {
  const navigate = useNavigate();
  const items = useCartStore((s) => s.items);
  const increment = useCartStore((s) => s.increment);
  const decrement = useCartStore((s) => s.decrement);
  const clear = useCartStore((s) => s.clear);

  const subtotal = items.reduce(
    (sum, i) => sum + i.product.priceCents * i.quantity,
    0
  );

  const handleClear = () => {
    if (window.confirm("Vider le panier ? Cette action est irréversible.")) {
      clear();
      toast.success("Panier vidé");
    }
  };

  const handleCheckout = () => {
    navigate("/creneaux");
  };

  return (
    <div className="min-h-dvh bg-bg text-text flex flex-col">
      <AppHeader showBack title="Mon panier" />

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-4 pb-36 flex flex-col gap-3">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-20 px-6 gap-5 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Cercle gradient sapin avec icône Lucide — pattern Stripe/Linear */}
            <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-[#0F4C3A]/10 to-[#D4A93C]/10 flex items-center justify-center">
              <div className="absolute inset-3 rounded-full bg-white shadow-sm" />
              <ShoppingBag
                className="relative text-[#0F4C3A]"
                size={44}
                strokeWidth={1.5}
                aria-hidden
              />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-xl font-bold text-text">
                Votre panier est vide
              </h2>
              <p className="text-sm text-muted max-w-xs">
                Découvrez notre sélection de produits halal frais et préparés
                avec soin.
              </p>
            </div>
            <button
              onClick={() => navigate("/")}
              className="mt-2 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0F4C3A] text-white text-sm font-semibold shadow-md shadow-[#0F4C3A]/20 hover:bg-[#0A3A2C] active:scale-[0.98] transition-all"
            >
              Découvrir le catalogue
            </button>
          </div>
        ) : (
          <>
            <ul className="flex flex-col gap-2">
              {items.map((item) => (
                <li
                  key={item.product.id}
                  className="flex items-center gap-3 bg-white rounded-2xl border border-border p-2.5"
                >
                  <Link
                    to={`/produit/${item.product.id}`}
                    className="shrink-0"
                  >
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-20 h-20 rounded-xl object-cover bg-bg"
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/produit/${item.product.id}`}
                      className="font-medium text-sm text-text line-clamp-2 hover:text-primary"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-xs text-muted mt-0.5">
                      {unitLabel(item.product.unit)}
                    </p>
                    <p className="text-sm font-semibold text-text mt-1">
                      {formatPrice(item.product.priceCents)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => decrement(item.product.id)}
                      aria-label={
                        item.quantity === 1
                          ? `Retirer ${item.product.name}`
                          : `Diminuer ${item.product.name}`
                      }
                      className="w-8 h-8 rounded-full bg-bg border border-border flex items-center justify-center text-text active:scale-95 transition-transform"
                    >
                      {item.quantity === 1 ? (
                        <Trash2 size={14} className="text-destructive" />
                      ) : (
                        <Minus size={14} />
                      )}
                    </button>
                    <span className="w-6 text-center text-sm font-semibold tabular-nums">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => increment(item.product.id)}
                      disabled={item.quantity >= 99}
                      aria-label={`Augmenter ${item.product.name}`}
                      className="w-8 h-8 rounded-full bg-bg border border-border flex items-center justify-center text-text active:scale-95 transition-transform disabled:opacity-40"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-4 bg-white rounded-2xl border border-border p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted">Sous-total</span>
                <span className="text-text font-medium">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted">Retrait magasin</span>
                <span className="text-text font-medium">Gratuit</span>
              </div>
              <div className="border-t border-border my-1" />
              <div className="flex items-center justify-between">
                <span className="text-base font-bold">Total</span>
                <span className="text-xl font-bold text-primary">
                  {formatPrice(subtotal)}
                </span>
              </div>
            </div>
          </>
        )}
      </main>

      {items.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-bg/95 backdrop-blur border-t border-border">
          <div className="max-w-2xl mx-auto px-4 py-3 flex flex-col gap-2">
            <button
              onClick={handleCheckout}
              className="w-full h-12 rounded-full bg-primary text-white font-semibold text-base shadow-md hover:bg-primary/90 active:scale-[0.99] transition-all"
            >
              Passer commande
            </button>
            <button
              onClick={handleClear}
              className="text-xs text-muted hover:text-destructive text-center"
            >
              Vider le panier
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
