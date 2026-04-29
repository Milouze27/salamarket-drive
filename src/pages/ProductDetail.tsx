import { Link, useNavigate, useParams } from "react-router-dom";
import { AlertCircle, ArrowRight } from "lucide-react";
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
            <div className="aspect-square w-full max-w-[600px] mx-auto rounded-2xl overflow-hidden bg-white border border-border">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex items-start justify-between gap-4 mt-2">
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl font-bold text-text leading-tight">
                  {product.name}
                </h1>
                <p className="text-sm text-muted mt-1">
                  {unitLabel(product.unit)}
                </p>
              </div>
              <span className="text-3xl font-bold text-primary whitespace-nowrap">
                {formatPrice(product.priceCents)}
              </span>
            </div>

            <div>
              <span
                className={
                  product.inStock
                    ? "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700"
                    : "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700"
                }
              >
                <span
                  className={
                    product.inStock
                      ? "w-2 h-2 rounded-full bg-green-600"
                      : "w-2 h-2 rounded-full bg-red-600"
                  }
                />
                {product.inStock ? "Disponible" : "Indisponible"}
              </span>
            </div>

            {product.description && (
              <p className="text-base text-text/80 leading-relaxed">
                {product.description}
              </p>
            )}
          </>
        )}
      </main>

      {product && (
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-bg/95 backdrop-blur border-t border-border">
          <div className="max-w-2xl mx-auto px-4 py-3 flex flex-col gap-2">
            <button
              onClick={handleAdd}
              disabled={!product.inStock}
              className="w-full h-12 rounded-full bg-primary text-white font-semibold text-base shadow-md hover:bg-primary/90 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {product.inStock ? "Ajouter au panier" : "Indisponible"}
            </button>
            {qtyInCart > 0 && (
              <Link
                to="/panier"
                className="text-sm text-muted hover:text-primary text-center inline-flex items-center justify-center gap-1"
              >
                {qtyInCart} dans le panier · Voir mon panier
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
