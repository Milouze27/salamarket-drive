import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Loader2,
  Minus,
  Plus,
  Sparkles,
  Store,
  Truck,
} from "lucide-react";
import { useProduct } from "@/hooks/useProduct";
import { useProducts } from "@/hooks/useProducts";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice, unitLabel } from "@/lib/format";
import { ProductCard } from "@/components/ProductCard";
import { cn } from "@/lib/utils";

const MAX_QTY = 50;

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: product, isLoading, isError, error } = useProduct(id);
  const { data: allProducts } = useProducts();

  const addItem = useCartStore((s) => s.addItem);
  const updateQty = useCartStore((s) => s.updateQuantity);
  const cartQty = useCartStore((s) =>
    id ? s.items.find((i) => i.product.id === id)?.quantity ?? 0 : 0,
  );

  const [qty, setQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  // Re-init qty quand l'id change (navigation entre produits)
  useEffect(() => {
    setQty(1);
    setJustAdded(false);
  }, [id]);

  // Suggestions : 4 autres produits de la même catégorie
  const suggestions = useMemo(() => {
    if (!product || !allProducts) return [];
    return allProducts
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, 4);
  }, [product, allProducts]);

  const handleAdd = () => {
    if (!product) return;
    if (cartQty > 0) {
      // Déjà dans le panier : on update la quantité au qty courant
      updateQty(product.id, cartQty + qty);
    } else {
      // Première fois : addItem N fois (le store n'a pas d'addBatch)
      for (let i = 0; i < qty; i += 1) addItem(product);
    }
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 2000);
  };

  const totalCents = product ? product.priceCents * qty : 0;

  // Badge "Halal certifié" affiché uniquement sur les viandes/charcuterie
  // (catégories où la certification est un signal d'achat critique).
  const showHalalBadge =
    product?.category === "boucherie" || product?.category === "charcuterie";

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-dvh bg-[#FAFAF7]">
        <div
          className="aspect-square w-full max-w-2xl mx-auto bg-[linear-gradient(90deg,#E5E5E0_0%,#F2F2EE_50%,#E5E5E0_100%)] bg-[length:200%_100%] animate-skeleton-shimmer"
        />
        <div className="px-4 py-5 space-y-3 max-w-2xl mx-auto">
          <div className="h-8 w-2/3 rounded bg-[linear-gradient(90deg,#E5E5E0_0%,#F2F2EE_50%,#E5E5E0_100%)] bg-[length:200%_100%] animate-skeleton-shimmer" />
          <div className="h-5 w-1/3 rounded bg-[linear-gradient(90deg,#E5E5E0_0%,#F2F2EE_50%,#E5E5E0_100%)] bg-[length:200%_100%] animate-skeleton-shimmer" />
          <div className="h-20 w-full rounded bg-[linear-gradient(90deg,#E5E5E0_0%,#F2F2EE_50%,#E5E5E0_100%)] bg-[length:200%_100%] animate-skeleton-shimmer" />
        </div>
      </div>
    );
  }

  // Error / not found
  if (isError || !product) {
    return (
      <div className="min-h-dvh bg-[#FAFAF7] flex flex-col items-center justify-center px-6 gap-4 text-center">
        <AlertCircle size={48} className="text-destructive" aria-hidden />
        <h1 className="text-xl font-bold text-text">
          {isError ? "Erreur de chargement" : "Produit introuvable"}
        </h1>
        <p className="text-sm text-muted max-w-xs">
          {isError && error instanceof Error
            ? error.message
            : "Ce produit n'existe pas ou n'est plus disponible."}
        </p>
        <button
          onClick={() => navigate("/")}
          className="mt-2 px-6 py-3 rounded-full bg-[#0F4C3A] text-white text-sm font-semibold active:scale-[0.98] transition-all"
        >
          Retour au catalogue
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-[#FAFAF7]">
      {/* Header overlay transparent au-dessus de l'image */}
      <header
        className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-3 py-3 pointer-events-none"
        style={{ paddingTop: "calc(env(safe-area-inset-top) + 0.75rem)" }}
      >
        <button
          onClick={() => {
            if (window.history.length > 1) window.history.back();
            else navigate("/");
          }}
          aria-label="Retour"
          className="pointer-events-auto w-11 h-11 rounded-full bg-white/95 backdrop-blur-md text-[#0F4C3A] flex items-center justify-center shadow-lg active:scale-90 transition-transform"
        >
          <ArrowLeft size={22} strokeWidth={2.2} aria-hidden />
        </button>
        {showHalalBadge && (
          <div className="pointer-events-auto inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/95 backdrop-blur-md text-[#0F4C3A] text-xs font-bold shadow-lg">
            <BadgeCheck size={14} className="text-[#D4A93C]" aria-hidden />
            Halal certifié
          </div>
        )}
      </header>

      {/* Image hero full-bleed */}
      <div className="relative aspect-square w-full max-w-2xl mx-auto bg-white overflow-hidden animate-in fade-in zoom-in-95 duration-500">
        <img
          src={product.imageUrl}
          alt={product.name}
          width={1200}
          height={1200}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="w-full h-full object-cover"
        />
        {/* Gradient subtle bottom pour transition vers contenu */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-[#FAFAF7]/80"
        />
      </div>

      {/* Contenu principal */}
      <div
        className="max-w-2xl mx-auto px-4 -mt-4 relative"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 8rem)" }}
      >
        {/* Title + price card premium */}
        <section className="bg-white rounded-3xl border border-border p-5 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <Link
                to={`/?category=${product.category}`}
                className="text-[10px] uppercase tracking-[0.18em] text-[#D4A93C] font-bold hover:underline"
              >
                {product.category.replace("-", " & ")}
              </Link>
              <h1 className="mt-1.5 text-2xl font-bold text-text leading-tight tracking-tight">
                {product.name}
              </h1>
              <p className="text-sm text-muted mt-1">
                {unitLabel(product.unit)}
              </p>
            </div>
            <div className="text-right whitespace-nowrap">
              <span className="block text-3xl font-bold text-[#0F4C3A] tabular-nums tracking-tight">
                {formatPrice(product.priceCents)}
              </span>
              {product.unit === "kg" && (
                <span className="block text-[10px] uppercase tracking-wider text-muted font-bold mt-0.5">
                  /kg
                </span>
              )}
            </div>
          </div>
        </section>

        {/* Pills caractéristiques */}
        <section className="mt-4 flex flex-wrap gap-2 animate-in fade-in slide-in-from-bottom-2 duration-500 [animation-delay:100ms] [animation-fill-mode:backwards]">
          <FeatPill
            icon={
              product.inStock ? (
                <span className="w-2 h-2 rounded-full bg-green-600" aria-hidden />
              ) : (
                <span className="w-2 h-2 rounded-full bg-red-600" aria-hidden />
              )
            }
            label={product.inStock ? "Disponible" : "Indisponible"}
            tone={product.inStock ? "success" : "error"}
          />
          <FeatPill
            icon={<Store size={12} aria-hidden />}
            label="Retrait gratuit"
            tone="brand"
          />
          <FeatPill
            icon={<Sparkles size={12} aria-hidden />}
            label="Frais du jour"
            tone="brand"
          />
        </section>

        {/* Description */}
        {product.description && (
          <section className="mt-4 bg-white rounded-3xl border border-border p-5 animate-in fade-in slide-in-from-bottom-2 duration-500 [animation-delay:200ms] [animation-fill-mode:backwards]">
            <p className="text-[10px] uppercase tracking-[0.18em] text-muted font-bold mb-2">
              À propos
            </p>
            <p className="text-base text-text/85 leading-relaxed">
              {product.description}
            </p>
          </section>
        )}

        {/* Bandeau retrait info */}
        <section className="mt-4 flex items-start gap-3 rounded-3xl border-2 border-[#0F4C3A]/15 bg-gradient-to-br from-[#0F4C3A]/5 to-[#D4A93C]/5 p-4 animate-in fade-in slide-in-from-bottom-2 duration-500 [animation-delay:300ms] [animation-fill-mode:backwards]">
          <div className="shrink-0 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
            <Truck size={18} className="text-[#0F4C3A]" aria-hidden />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-text">Retrait en magasin</p>
            <p className="text-xs text-muted mt-0.5">
              Salamarket Toulouse · 8 av. Larrieu-Thibaud
            </p>
            <p className="text-xs text-muted mt-0.5">
              Choisissez votre créneau au panier
            </p>
          </div>
        </section>

        {/* Suggestions "Vous aimerez aussi" */}
        {suggestions.length > 0 && (
          <section className="mt-8 animate-in fade-in slide-in-from-bottom-2 duration-500 [animation-delay:400ms] [animation-fill-mode:backwards]">
            <h2 className="text-base font-bold text-text mb-3 px-1">
              Vous aimerez aussi
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {suggestions.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Sticky bottom : qty selector + CTA prix dynamique */}
      <div
        className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-border md:bottom-0"
        style={{ bottom: 0 }}
      >
        <div
          className="max-w-2xl mx-auto px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
        >
          <div className="flex items-center gap-3">
            {/* Stepper qty */}
            <div className="flex items-center gap-1 bg-[#FAFAF7] rounded-full p-1 border border-border shrink-0">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                disabled={qty <= 1}
                aria-label="Diminuer la quantité"
                className="w-9 h-9 rounded-full bg-white border border-border flex items-center justify-center text-text active:scale-90 transition-transform shadow-sm disabled:opacity-30 disabled:active:scale-100"
              >
                <Minus size={14} strokeWidth={2.5} aria-hidden />
              </button>
              <span
                className="min-w-[2rem] text-center text-base font-bold tabular-nums text-text"
                aria-live="polite"
              >
                {qty}
              </span>
              <button
                type="button"
                onClick={() => setQty((q) => Math.min(MAX_QTY, q + 1))}
                disabled={qty >= MAX_QTY}
                aria-label="Augmenter la quantité"
                className="w-9 h-9 rounded-full bg-[#0F4C3A] text-white flex items-center justify-center active:scale-90 transition-transform shadow-sm disabled:opacity-40 disabled:active:scale-100"
              >
                <Plus size={14} strokeWidth={2.5} aria-hidden />
              </button>
            </div>

            {/* CTA primary avec prix dynamique */}
            <button
              onClick={handleAdd}
              disabled={!product.inStock}
              className={cn(
                "group flex-1 h-14 rounded-2xl bg-gradient-to-r from-[#0F4C3A] to-[#0A3A2C] text-white font-bold text-base shadow-lg shadow-[#0F4C3A]/30 hover:shadow-xl hover:shadow-[#0F4C3A]/40 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none",
                justAdded && "animate-success-pop",
              )}
            >
              {justAdded ? (
                <>
                  <BadgeCheck size={20} className="text-[#D4A93C]" aria-hidden />
                  <span>Ajouté !</span>
                </>
              ) : (
                <>
                  <span>{product.inStock ? "Ajouter" : "Indisponible"}</span>
                  {product.inStock && (
                    <>
                      <span className="opacity-50">·</span>
                      <span className="tabular-nums">
                        {formatPrice(totalCents)}
                      </span>
                      <ArrowRight
                        size={16}
                        className="transition-transform group-hover:translate-x-0.5"
                        aria-hidden
                      />
                    </>
                  )}
                </>
              )}
            </button>
          </div>

          {cartQty > 0 && !justAdded && (
            <Link
              to="/panier"
              className="mt-2 block text-center text-xs font-medium text-[#0F4C3A] hover:underline"
            >
              {cartQty} déjà dans le panier · Voir →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

// Pill caractéristique inline
const FeatPill = ({
  icon,
  label,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  tone: "success" | "error" | "brand";
}) => {
  const tones = {
    success: "bg-green-50 text-green-700",
    error: "bg-red-50 text-red-700",
    brand: "bg-[#0F4C3A]/8 text-[#0F4C3A]",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold",
        tones[tone],
      )}
    >
      {icon}
      {label}
    </span>
  );
};

export default ProductDetail;
