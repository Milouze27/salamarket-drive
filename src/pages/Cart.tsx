import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Minus, Plus, ShoppingBag, Store, Trash2 } from "lucide-react";
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
    0,
  );
  const itemCount = items.reduce((n, i) => n + i.quantity, 0);

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
    <div className="min-h-dvh bg-[#FAFAF7] text-text flex flex-col">
      <AppHeader showBack title="Mon panier" />

      <main
        className="flex-1 max-w-2xl w-full mx-auto px-4 pt-3 flex flex-col gap-3"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 9rem)" }}
      >
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-20 px-6 gap-5 animate-in fade-in slide-in-from-bottom-2 duration-500">
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
            {/* Compteur articles avec lien vider — secondary action */}
            <div className="flex items-center justify-between text-xs text-muted px-1">
              <span className="font-medium">
                {itemCount} article{itemCount > 1 ? "s" : ""}
              </span>
              <button
                onClick={handleClear}
                className="font-medium hover:text-destructive transition-colors"
              >
                Vider le panier
              </button>
            </div>

            {/* Items */}
            <ul className="flex flex-col gap-2.5">
              {items.map((item, idx) => (
                <li
                  key={item.product.id}
                  className="flex items-center gap-3 bg-white rounded-2xl border border-border p-3 shadow-sm animate-in fade-in slide-in-from-bottom-1 duration-300 [animation-fill-mode:backwards]"
                  style={{ animationDelay: `${Math.min(idx, 6) * 50}ms` }}
                >
                  <Link
                    to={`/produit/${item.product.id}`}
                    className="shrink-0"
                    aria-label={`Voir ${item.product.name}`}
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
                      className="block font-semibold text-sm text-text line-clamp-2 hover:text-[#0F4C3A] transition-colors"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-xs text-muted mt-0.5">
                      {unitLabel(item.product.unit)}
                    </p>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <p className="text-base font-bold text-[#0F4C3A] tabular-nums">
                        {formatPrice(item.product.priceCents * item.quantity)}
                      </p>
                      {/* Stepper compact intégré sous le prix */}
                      <div className="flex items-center gap-1 bg-[#FAFAF7] rounded-full p-0.5 border border-border">
                        <button
                          onClick={() => decrement(item.product.id)}
                          aria-label={
                            item.quantity === 1
                              ? `Retirer ${item.product.name}`
                              : `Diminuer ${item.product.name}`
                          }
                          className="w-7 h-7 rounded-full bg-white border border-border flex items-center justify-center text-text active:scale-90 transition-transform shadow-sm"
                        >
                          {item.quantity === 1 ? (
                            <Trash2 size={12} className="text-destructive" />
                          ) : (
                            <Minus size={12} strokeWidth={2.5} />
                          )}
                        </button>
                        <span className="w-6 text-center text-sm font-bold tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => increment(item.product.id)}
                          disabled={item.quantity >= 99}
                          aria-label={`Augmenter ${item.product.name}`}
                          className="w-7 h-7 rounded-full bg-[#0F4C3A] text-white flex items-center justify-center active:scale-90 transition-transform disabled:opacity-40 shadow-sm"
                        >
                          <Plus size={12} strokeWidth={2.5} />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {/* Récap premium avec accent doré + icône retrait */}
            <div className="mt-3 relative overflow-hidden rounded-2xl bg-white border border-[#D4A93C]/30 p-4 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500 delay-200 [animation-fill-mode:backwards]">
              <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-[#D4A93C]/10" />
              <div className="relative flex flex-col gap-2.5">
                <p className="text-xs uppercase tracking-wider text-muted font-semibold">
                  Récapitulatif
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">Sous-total</span>
                  <span className="text-text font-medium tabular-nums">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted inline-flex items-center gap-1.5">
                    <Store size={14} className="text-[#0F4C3A]" aria-hidden />
                    Retrait en magasin
                  </span>
                  <span className="text-[#0F4C3A] font-semibold">Gratuit</span>
                </div>
                <div className="border-t border-border my-1" />
                <div className="flex items-baseline justify-between">
                  <span className="text-base font-bold">Total</span>
                  <span className="text-2xl font-bold text-[#0F4C3A] tabular-nums">
                    {formatPrice(subtotal)}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      {items.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur border-t border-border">
          <div
            className="max-w-2xl mx-auto px-4 pt-3"
            style={{
              paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))",
            }}
          >
            <button
              onClick={handleCheckout}
              className="group w-full h-14 rounded-2xl bg-gradient-to-r from-[#0F4C3A] to-[#0A3A2C] text-white font-bold text-base shadow-lg shadow-[#0F4C3A]/30 hover:shadow-xl hover:shadow-[#0F4C3A]/40 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
            >
              <span>Choisir un créneau</span>
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-0.5"
                aria-hidden
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
