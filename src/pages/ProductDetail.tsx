import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Loader2,
  Minus,
  Plus,
  ShoppingCart,
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
  const location = useLocation();
  const { data: product, isLoading, isError, error } = useProduct(id);
  const { data: allProducts } = useProducts();

  const addItem = useCartStore((s) => s.addItem);
  const updateQty = useCartStore((s) => s.updateQuantity);
  const cartQty = useCartStore((s) =>
    id ? s.items.find((i) => i.product.id === id)?.quantity ?? 0 : 0,
  );

  const [qty, setQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  // Timer "Ajouté !" stocké en ref pour cleanup + éviter le stacking sur
  // clics rapides (sinon flicker).
  const addedTimerRef = useRef<number | null>(null);

  // Re-init qty quand l'id change (navigation entre produits)
  useEffect(() => {
    setQty(1);
    setJustAdded(false);
  }, [id]);

  // Cleanup timer "Ajouté" au unmount
  useEffect(() => {
    return () => {
      if (addedTimerRef.current !== null) {
        window.clearTimeout(addedTimerRef.current);
      }
    };
  }, []);

  // Back safe : si on a un history.key (navigation interne SPA), back ;
  // sinon (PWA installée ouverte direct sur l'URL, lien partagé, notif
  // push), retour home. window.history.length ne suffit pas en PWA.
  const goBack = () => {
    if (location.key !== "default") {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

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
      updateQty(product.id, cartQty + qty);
    } else {
      for (let i = 0; i < qty; i += 1) addItem(product);
    }
    setJustAdded(true);
    if (addedTimerRef.current !== null) {
      window.clearTimeout(addedTimerRef.current);
    }
    addedTimerRef.current = window.setTimeout(() => {
      setJustAdded(false);
      addedTimerRef.current = null;
    }, 2000);
  };

  const totalCents = product ? product.priceCents * qty : 0;

  // Badge "Halal certifié" affiché uniquement sur les viandes/charcuterie
  // (catégories où la certification est un signal d'achat critique).
  const showHalalBadge =
    product?.category === "boucherie" || product?.category === "charcuterie";

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-dvh bg-[#FAF7EE]">
        <div
          className="aspect-square w-full max-w-2xl mx-auto bg-[linear-gradient(90deg,#E8E4D8_0%,#F2F2EE_50%,#E8E4D8_100%)] bg-[length:200%_100%] animate-skeleton-shimmer"
        />
        <div className="px-4 py-5 space-y-3 max-w-2xl mx-auto">
          <div className="h-8 w-2/3 rounded bg-[linear-gradient(90deg,#E8E4D8_0%,#F2F2EE_50%,#E8E4D8_100%)] bg-[length:200%_100%] animate-skeleton-shimmer" />
          <div className="h-5 w-1/3 rounded bg-[linear-gradient(90deg,#E8E4D8_0%,#F2F2EE_50%,#E8E4D8_100%)] bg-[length:200%_100%] animate-skeleton-shimmer" />
          <div className="h-20 w-full rounded bg-[linear-gradient(90deg,#E8E4D8_0%,#F2F2EE_50%,#E8E4D8_100%)] bg-[length:200%_100%] animate-skeleton-shimmer" />
        </div>
      </div>
    );
  }

  // Error / not found
  if (isError || !product) {
    return (
      <div className="min-h-dvh bg-[#FAF7EE] flex flex-col items-center justify-center px-6 gap-4 text-center">
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
          className="mt-2 px-6 py-3 rounded-full bg-[#0E3B2E] text-white text-sm font-semibold active:scale-[0.98] transition-all"
        >
          Retour au catalogue
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-[#FAF7EE]">
      {/* Header overlay transparent au-dessus de l'image */}
      <header
        className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-3 py-3 pointer-events-none"
        style={{ paddingTop: "calc(env(safe-area-inset-top) + 0.75rem)" }}
      >
        <button
          onClick={goBack}
          aria-label="Retour"
          className="pointer-events-auto w-11 h-11 rounded-full bg-white/95 backdrop-blur-md text-[#0E3B2E] flex items-center justify-center shadow-lg active:scale-90 transition-transform"
        >
          <ArrowLeft size={22} strokeWidth={2.2} aria-hidden />
        </button>
        {showHalalBadge && (
          <div className="pointer-events-auto inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/95 backdrop-blur-md text-[#0E3B2E] text-xs font-bold shadow-lg">
            <BadgeCheck size={14} className="text-[#C9A227]" aria-hidden />
            Halal certifié
          </div>
        )}
      </header>

      {/* Layout split sur desktop (photo gauche sticky / info droite),
          vertical sur mobile. Container max-w-6xl pour aérer la fiche
          en grand écran et éviter la photo géante centrée. */}
      <div className="md:max-w-6xl md:mx-auto md:px-8 md:pt-24 md:grid md:grid-cols-[1.05fr_1fr] md:gap-12 lg:gap-16">
        {/* Image hero — full-bleed mobile, sticky desktop */}
        <div className="md:sticky md:top-24 md:self-start">
          <div className="relative aspect-square w-full max-w-2xl mx-auto md:max-w-none bg-white overflow-hidden md:rounded-[36px] md:shadow-[0_30px_60px_-30px_rgba(8,42,32,0.35)] animate-in fade-in zoom-in-95 duration-500">
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
            {/* Gradient subtle bottom pour transition vers contenu — mobile uniquement */}
            <div
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-[#FAF7EE]/80 md:hidden"
            />
          </div>
        </div>

        {/* Contenu principal */}
        <div
          className="max-w-2xl mx-auto px-4 -mt-4 md:mt-0 md:px-0 relative md:pb-8"
          style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 8rem)" }}
        >
        {/* Title + price — bloc éditorial sans card frame, serif pour le
            nom produit. Le titre porte la composition, le prix s'aligne
            en baseline. */}
        <section className="px-1 pt-2 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <Link
            to={`/?category=${product.category}`}
            className="inline-block text-[10px] uppercase tracking-[0.22em] text-[#C9A227] font-bold hover:underline underline-offset-[5px]"
          >
            {product.category.replace("-", " & ")}
          </Link>
          <h1 className="mt-2 text-[26px] md:text-[32px] leading-[1.15] text-[#0E3B2E] font-extrabold tracking-[-0.025em]">
            {product.name}
          </h1>
          <div className="mt-3 flex items-baseline gap-3">
            <span className="text-[26px] md:text-[32px] font-extrabold text-[#0E3B2E] tabular-nums tracking-[-0.02em]">
              {formatPrice(product.priceCents)}
            </span>
            <span className="text-sm text-[#6B7280]">
              · {unitLabel(product.unit)}
            </span>
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

        {/* Description — bloc éditorial typographique pur, pas un card.
            Petit serif italique en kicker pour signaler "petit traité",
            pas une box marketing. */}
        {product.description && (
          <section className="mt-6 px-1 animate-in fade-in slide-in-from-bottom-2 duration-500 [animation-delay:200ms] [animation-fill-mode:backwards]">
            <p className="text-[10px] uppercase tracking-[0.22em] text-[#C9A227] font-bold mb-3">
              À propos
            </p>
            <p className="text-[15px] text-[#0F1A14]/80 leading-relaxed max-w-[60ch]">
              {product.description}
            </p>
          </section>
        )}

        {/* Bandeau retrait info — fond plein crème, plus de gradient
            décoratif (anti-pattern glassmorphism). */}
        <section className="mt-5 flex items-start gap-3 rounded-3xl border border-[#0E3B2E]/15 bg-white p-4 animate-in fade-in slide-in-from-bottom-2 duration-500 [animation-delay:300ms] [animation-fill-mode:backwards]">
          <div className="shrink-0 w-10 h-10 rounded-full bg-[#FAF7EE] flex items-center justify-center">
            <Truck size={18} className="text-[#0E3B2E]" aria-hidden />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-[#0E3B2E]">Retrait en magasin</p>
            <p className="text-xs text-[#0F1A14]/60 mt-0.5">
              Salamarket Toulouse · 8 av. Larrieu&#8209;Thibaud
            </p>
            <p className="text-xs text-[#0F1A14]/60 mt-0.5">
              Choisissez votre créneau au panier
            </p>
          </div>
        </section>

        {/* CTA inline desktop : stepper + Ajouter visibles direct dans la
            colonne droite, pas de sticky bottom qui ferait double-emploi
            avec le scroll naturel sur grand écran. */}
        <section className="hidden md:flex flex-col gap-3 mt-7 pt-6 border-t border-[#0E3B2E]/15 animate-in fade-in slide-in-from-bottom-2 duration-500 [animation-delay:350ms] [animation-fill-mode:backwards]">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-[#FAF7EE] rounded-full p-1 border border-[#0E3B2E]/15 shrink-0">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                disabled={qty <= 1}
                aria-label="Diminuer la quantité"
                className="w-10 h-10 rounded-full bg-white border border-[#0E3B2E]/12 flex items-center justify-center text-[#0E3B2E] active:scale-90 transition-transform shadow-sm disabled:opacity-30"
              >
                <Minus size={14} strokeWidth={2.5} aria-hidden />
              </button>
              <span
                className="min-w-[2.25rem] text-center text-base font-bold tabular-nums text-[#0E3B2E]"
                aria-live="polite"
              >
                {qty}
              </span>
              <button
                type="button"
                onClick={() => setQty((q) => Math.min(MAX_QTY, q + 1))}
                disabled={qty >= MAX_QTY}
                aria-label="Augmenter la quantité"
                className="w-10 h-10 rounded-full bg-[#0E3B2E] text-white flex items-center justify-center active:scale-90 transition-transform shadow-sm disabled:opacity-40"
              >
                <Plus size={14} strokeWidth={2.5} aria-hidden />
              </button>
            </div>
            <button
              onClick={handleAdd}
              disabled={!product.inStock}
              className={cn(
                "group flex-1 h-14 rounded-2xl bg-gradient-to-r from-[#0E3B2E] to-[#082A20] text-white font-bold text-[15px] shadow-lg shadow-[#0E3B2E]/30 hover:shadow-xl hover:shadow-[#0E3B2E]/40 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none",
                justAdded && "animate-success-pop",
              )}
            >
              {justAdded ? (
                <>
                  <BadgeCheck size={20} className="text-[#C9A227]" aria-hidden />
                  <span>Ajouté !</span>
                </>
              ) : (
                <>
                  <span>{product.inStock ? "Ajouter au panier" : "Indisponible"}</span>
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
              className="h-12 w-full bg-white border-2 border-[#0E3B2E]/15 rounded-2xl flex items-center justify-center gap-2 text-[#0E3B2E] font-bold text-[14px] active:scale-[0.99] transition-transform"
            >
              <span className="inline-flex w-7 h-7 rounded-full bg-[#0E3B2E] text-white items-center justify-center">
                <ShoppingCart size={14} strokeWidth={2.4} />
              </span>
              Voir le panier
              <span className="inline-flex min-w-[24px] h-6 rounded-full bg-[#C9A227]/20 text-[#0E3B2E] items-center justify-center px-2 tabular-nums text-[12px] font-extrabold">
                {cartQty}
              </span>
              <ArrowRight size={14} className="text-[#0E3B2E]/60" />
            </Link>
          )}
        </section>

        {/* Suggestions "Vous aimerez aussi" — col droite desktop, sous CTA */}
        {suggestions.length > 0 && (
          <section className="mt-8 md:mt-10 animate-in fade-in slide-in-from-bottom-2 duration-500 [animation-delay:400ms] [animation-fill-mode:backwards]">
            <h2 className="text-base md:text-[17px] font-bold text-[#0E3B2E] mb-3 px-1">
              Vous aimerez aussi
            </h2>
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {suggestions.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
        </div>
      </div>

      {/* Sticky bottom MOBILE UNIQUEMENT — desktop a son CTA inline ci-dessus */}
      <div
        className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-border md:hidden"
        style={{ bottom: 0 }}
      >
        <div
          className="max-w-2xl mx-auto px-5 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
        >
          <div className="flex items-center gap-3">
            {/* Stepper qty — 44pt Apple HIG, plus de boutons 36px sous
                la cible de tap. */}
            <div className="flex items-center gap-1 bg-[#FAF7EE] rounded-full p-1 border border-[#0E3B2E]/12 shrink-0">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                disabled={qty <= 1}
                aria-label="Diminuer la quantité"
                className="w-11 h-11 rounded-full bg-white border border-[#0E3B2E]/12 flex items-center justify-center text-[#0E3B2E] active:scale-90 transition-transform shadow-sm disabled:opacity-30 disabled:active:scale-100"
              >
                <Minus size={16} strokeWidth={2.5} aria-hidden />
              </button>
              <span
                className="min-w-[2.25rem] text-center text-base font-bold tabular-nums text-[#0E3B2E]"
                aria-live="polite"
              >
                {qty}
              </span>
              <button
                type="button"
                onClick={() => setQty((q) => Math.min(MAX_QTY, q + 1))}
                disabled={qty >= MAX_QTY}
                aria-label="Augmenter la quantité"
                className="w-11 h-11 rounded-full bg-[#0E3B2E] text-white flex items-center justify-center active:scale-90 transition-transform shadow-sm disabled:opacity-40 disabled:active:scale-100"
              >
                <Plus size={16} strokeWidth={2.5} aria-hidden />
              </button>
            </div>

            {/* CTA primary avec prix dynamique */}
            <button
              onClick={handleAdd}
              disabled={!product.inStock}
              className={cn(
                "group flex-1 h-14 rounded-2xl bg-gradient-to-r from-[#0E3B2E] to-[#082A20] text-white font-bold text-base shadow-lg shadow-[#0E3B2E]/30 hover:shadow-xl hover:shadow-[#0E3B2E]/40 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none",
                justAdded && "animate-success-pop",
              )}
            >
              {justAdded ? (
                <>
                  <BadgeCheck size={20} className="text-[#C9A227]" aria-hidden />
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
              className="mt-3 h-12 w-full bg-white border-2 border-[#0E3B2E]/15 rounded-2xl flex items-center justify-center gap-2 text-[#0E3B2E] font-bold text-[14px] shadow-sm active:scale-[0.99] transition-transform"
            >
              <span className="inline-flex w-7 h-7 rounded-full bg-[#0E3B2E] text-white items-center justify-center">
                <ShoppingCart size={14} strokeWidth={2.4} />
              </span>
              Voir le panier
              <span className="inline-flex min-w-[24px] h-6 rounded-full bg-[#C9A227]/20 text-[#0E3B2E] items-center justify-center px-2 tabular-nums text-[12px] font-extrabold">
                {cartQty}
              </span>
              <ArrowRight size={14} className="text-[#0E3B2E]/60" />
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
    brand: "bg-[#0E3B2E]/8 text-[#0E3B2E]",
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
