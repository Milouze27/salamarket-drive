import { Link, useNavigate, useParams } from "react-router-dom";
import { AlertCircle, ArrowRight, BadgeCheck, Store } from "lucide-react";
import { toast } from "sonner";
import { AppHeader } from "@/components/AppHeader";
import { useProduct } from "@/hooks/useProduct";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice, unitLabel } from "@/lib/format";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: product, isLoading, isError, error } = useProduct(id);

  const addItem = useCartStore((s) => s.addItem);
  const qtyInCart = useCartStore((s) =>
    id ? s.items.find((i) => i.product.id === id)?.quantity ?? 0 : 0
  );

  const handleAdd = () => {
    if (!product) return;
    addItem(product);
    toast.success("Ajouté au panier", { description: product.name });
  };

  return (
    <div className="min-h-dvh bg-bg text-text flex flex-col">
      <AppHeader showBack />

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-4 pb-32 flex flex-col gap-4">
        {isLoading && (
          <div className="flex flex-col gap-4">
            <div className="aspect-square w-full max-w-[600px] mx-auto rounded-2xl bg-border/50 animate-pulse" />
            <div className="h-7 w-2/3 bg-border/50 rounded animate-pulse" />
            <div className="h-4 w-1/3 bg-border/50 rounded animate-pulse" />
            <div className="h-20 w-full bg-border/50 rounded animate-pulse" />
          </div>
        )}

        {isError && (
          <div className="flex flex-col items-center justify-center text-center py-16 gap-3">
            <AlertCircle size={36} className="text-destructive" />
            <h2 className="font-semibold">Erreur de chargement</h2>
            <p className="text-sm text-muted">
              {error instanceof Error ? error.message : "Une erreur est survenue."}
            </p>
            <button
              onClick={() => navigate("/")}
              className="mt-2 px-4 py-2 rounded-full bg-primary text-white text-sm font-medium"
            >
              Retour au catalogue
            </button>
          </div>
        )}

        {!isLoading && !isError && !product && (
          <div className="flex flex-col items-center justify-center text-center py-16 gap-3">
            <AlertCircle size={36} className="text-muted" />
            <h2 className="font-semibold">Produit introuvable</h2>
            <p className="text-sm text-muted">
              Ce produit n'existe pas ou n'est plus disponible.
            </p>
            <button
              onClick={() => navigate("/")}
              className="mt-2 px-4 py-2 rounded-full bg-primary text-white text-sm font-medium"
            >
              Retour au catalogue
            </button>
          </div>
        )}

        {product && (
          <>
            {/* Image — coin doré décoratif + shadow subtle */}
            <div className="relative aspect-square w-full max-w-[600px] mx-auto rounded-2xl overflow-hidden bg-white border border-border shadow-sm animate-in fade-in zoom-in-95 duration-500">
              <img
                src={product.imageUrl}
                alt={product.name}
                width={600}
                height={600}
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="w-full h-full object-cover"
              />
              {/* Badge halal flottant en haut à droite */}
              <span className="absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur text-[#0F4C3A] text-xs font-bold shadow-md">
                <BadgeCheck size={14} className="text-[#D4A93C]" aria-hidden />
                Halal certifié
              </span>
            </div>

            {/* Header titre + prix */}
            <div className="flex items-start justify-between gap-4 mt-3 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-100 [animation-fill-mode:backwards]">
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl font-bold text-text leading-tight tracking-tight">
                  {product.name}
                </h1>
                <p className="text-sm text-muted mt-1">
                  {unitLabel(product.unit)}
                </p>
              </div>
              <div className="text-right whitespace-nowrap">
                <span className="block text-3xl font-bold text-[#0F4C3A] tabular-nums">
                  {formatPrice(product.priceCents)}
                </span>
              </div>
            </div>

            {/* Pills statut + retrait */}
            <div className="flex flex-wrap items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-150 [animation-fill-mode:backwards]">
              <span
                className={
                  product.inStock
                    ? "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700"
                    : "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700"
                }
              >
                <span
                  className={
                    product.inStock
                      ? "w-2 h-2 rounded-full bg-green-600"
                      : "w-2 h-2 rounded-full bg-red-600"
                  }
                  aria-hidden
                />
                {product.inStock ? "Disponible" : "Indisponible"}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#0F4C3A]/8 text-[#0F4C3A]">
                <Store size={12} aria-hidden />
                Retrait gratuit en magasin
              </span>
            </div>

            {/* Description avec card subtle */}
            {product.description && (
              <div className="mt-2 rounded-2xl bg-white border border-border p-4 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-200 [animation-fill-mode:backwards]">
                <p className="text-xs uppercase tracking-wider text-muted font-semibold mb-2">
                  Description
                </p>
                <p className="text-base text-text/85 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}
          </>
        )}
      </main>

      {product && (
        // CTA fixed bottom — sur mobile, surélevé via arbitrary class pour
        // passer AU-DESSUS du BottomNav (56px). Le safe-area est géré par
        // le padding-bottom interne. Sur desktop (md+), bottom-0 car pas
        // de BottomNav.
        <div className="fixed left-0 right-0 z-30 bg-bg/95 backdrop-blur border-t border-border bottom-[calc(env(safe-area-inset-bottom)+56px)] md:bottom-0">
          <div className="max-w-2xl mx-auto px-4 py-3 md:pb-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] flex flex-col gap-2">
            <button
              onClick={handleAdd}
              disabled={!product.inStock}
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-[#0F4C3A] to-[#0A3A2C] text-white font-bold text-base shadow-lg shadow-[#0F4C3A]/30 hover:shadow-xl hover:shadow-[#0F4C3A]/40 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {product.inStock ? "Ajouter au panier" : "Indisponible"}
            </button>
            {qtyInCart > 0 && (
              <Link
                to="/panier"
                className="text-sm font-medium text-[#0F4C3A] hover:underline text-center inline-flex items-center justify-center gap-1"
              >
                {qtyInCart} déjà dans le panier · Voir
                <ArrowRight size={14} />
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
