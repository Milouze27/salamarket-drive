import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AlertCircle, SearchX } from "lucide-react";
import { Header } from "@/components/Header";
import { EditorialIntro } from "@/components/EditorialIntro";
import { WeeklyPicks } from "@/components/WeeklyPicks";
import { CategoryTabs } from "@/components/CategoryTabs";
import { ProductCard } from "@/components/ProductCard";
import { ProductCardSkeleton } from "@/components/ProductCardSkeleton";
import { useProducts } from "@/hooks/useProducts";
import { BRAND, formatStoreLocation } from "@/config/brand";
import { normalizeSearch } from "@/lib/search";

const Index = () => {
  const [searchParams] = useSearchParams();
  const [category, setCategory] = useState<string>("all");
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const { data: allProducts, isLoading, isError, error, refetch } = useProducts();

  // Pré-sélection de la catégorie via le query param (?category=...)
  // utilisé par les CTAs du hero / EditorialIntro.
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) setCategory(cat);
  }, [searchParams]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchInput), 200);
    return () => clearTimeout(t);
  }, [searchInput]);

  // Préload IDLE des images du catalogue après que le navigateur ait fini
  // son first paint. Avant : tous (44+) téléchargés synchrones au mount du
  // hook → ~6 MB en parallèle qui saturent la bande passante et retardent
  // l'apparition des images au-dessus du fold (EditorialIntro hero +
  // WeeklyPicks). Maintenant : requestIdleCallback déclenche le batch
  // hors du chemin critique. Les 12 premiers (visibles au scroll initial)
  // d'abord, le reste après.
  useEffect(() => {
    if (!allProducts || allProducts.length === 0) return;
    const list = allProducts.filter((p) => p.imageUrl);

    const preloadBatch = (items: typeof list) => {
      items.forEach((p) => {
        const img = new Image();
        img.decoding = "async";
        img.src = p.imageUrl as string;
      });
    };

    // Phase 1 : 12 premiers, idle. Phase 2 : reste, idle plus tard.
    const idle = (cb: () => void, timeout: number) => {
      if (typeof (window as unknown as { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number }).requestIdleCallback === "function") {
        (window as unknown as { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => number })
          .requestIdleCallback(cb, { timeout });
      } else {
        window.setTimeout(cb, timeout);
      }
    };

    idle(() => preloadBatch(list.slice(0, 12)), 800);
    idle(() => preloadBatch(list.slice(12)), 2500);
  }, [allProducts]);

  const products = useMemo(() => {
    if (!allProducts) return [];
    const term = normalizeSearch(debouncedSearch);
    return allProducts.filter((p) => {
      if (category !== "all" && p.category !== category) return false;
      if (!term) return true;
      const haystack = normalizeSearch(`${p.name} ${p.description ?? ""}`);
      return haystack.includes(term);
    });
  }, [allProducts, category, debouncedSearch]);

  const resetFilters = () => {
    setCategory("all");
    setSearchInput("");
  };

  // Affiche EditorialIntro + WeeklyPicks uniquement sur l'état "all" sans
  // recherche : c'est le mode "vitrine" du magasin. Dès qu'on filtre ou
  // qu'on cherche, on entre en mode catalogue pur, plus efficace.
  const showVitrine = category === "all" && !debouncedSearch;

  return (
    <div className="min-h-dvh bg-[#FAF7EE] pb-20 md:pb-0">
      <Header searchValue={searchInput} onSearchChange={setSearchInput} />

      {showVitrine && <EditorialIntro />}
      {showVitrine && allProducts && allProducts.length > 0 && (
        <WeeklyPicks products={allProducts} />
      )}

      <CategoryTabs active={category} onChange={setCategory} />

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Section header éditorial — apparaît quand on est en catalogue,
            pas en vitrine, pour rappeler le contexte. */}
        {!showVitrine && (
          <header className="mb-6 md:mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.28em] font-bold text-[#C9A227] mb-1.5">
                {debouncedSearch ? "Recherche" : "Rayon"}
              </p>
              <h1 className="text-[24px] md:text-[32px] leading-[1.15] text-[#0E3B2E] font-extrabold tracking-[-0.025em]">
                {debouncedSearch
                  ? `« ${debouncedSearch} »`
                  : BRAND.categories.find((c) => c.slug === category)?.name ?? "Tout"}
              </h1>
            </div>
            {products.length > 0 && (
              <span className="text-xs text-[#6B7280] pb-1.5">
                {products.length} produit{products.length > 1 ? "s" : ""}
              </span>
            )}
          </header>
        )}

        {isError ? (
          <div className="flex flex-col items-center justify-center text-center py-16 px-4 gap-3">
            <AlertCircle size={36} className="text-destructive" />
            <h2 className="font-semibold text-gray-900">
              Impossible de charger le catalogue
            </h2>
            <p className="text-sm text-gray-500 max-w-sm">
              {error instanceof Error
                ? error.message
                : "Une erreur est survenue. Vérifiez votre connexion et réessayez."}
            </p>
            <button
              onClick={() => refetch()}
              className="mt-2 px-4 py-2 rounded-full bg-[#0E3B2E] text-white text-sm font-medium hover:bg-[#082A20] transition-colors"
            >
              Réessayer
            </button>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((p, idx) => (
              <div
                key={p.id}
                className="animate-in fade-in slide-in-from-bottom-2 duration-500 [animation-fill-mode:backwards]"
                style={{ animationDelay: `${Math.min(idx, 8) * 40}ms` }}
              >
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 flex flex-col items-center gap-3">
            <SearchX size={48} className="text-gray-400" />
            <p className="text-lg font-medium text-gray-900">
              Aucun produit trouvé
            </p>
            <p className="text-sm text-gray-500">
              Essayez une autre recherche ou catégorie
            </p>
            <button
              onClick={resetFilters}
              className="mt-2 px-4 py-2 rounded-full bg-[#0E3B2E] text-white text-sm font-medium hover:bg-[#082A20] transition-colors"
            >
              Voir tous les produits
            </button>
          </div>
        )}
      </main>

      {/* Footer éditorial — "lettre" signée, pas 3 colonnes corporate */}
      <footer className="mt-8 md:mt-16 bg-[#0E3B2E] text-[#FAF7EE]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-14 md:py-20">
          <div className="grid gap-12 md:gap-16 md:grid-cols-12 items-start">
            <div className="md:col-span-7">
              <p className="text-[10px] uppercase tracking-[0.28em] font-bold text-[#C9A227] mb-4">
                Le mot du magasin
              </p>
              <p className="text-[22px] md:text-[28px] leading-[1.3] text-[#FAF7EE] max-w-[40ch] font-semibold tracking-[-0.02em]">
                Salamarket, c'est{" "}
                <span className="text-[#C9A227]">
                  votre supermarché halal indépendant
                </span>{" "}
                au cœur de Toulouse. On prépare chaque commande à la main, comme
                pour la famille.
              </p>
              <p className="mt-6 text-[13px] tracking-[0.05em] text-[#FAF7EE]/65">
                — Otmane, Ahmed et l'équipe Salamarket
              </p>
            </div>

            <div className="md:col-span-5 grid grid-cols-2 gap-8 md:gap-10 text-sm">
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] font-bold text-[#C9A227] mb-3">
                  Adresse
                </p>
                <p className="text-[#FAF7EE]/85 leading-relaxed">
                  {BRAND.store.address}
                  <br />
                  {BRAND.store.postalCode} {BRAND.store.city}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] font-bold text-[#C9A227] mb-3">
                  Horaires
                </p>
                <ul className="space-y-1.5 text-[#FAF7EE]/85">
                  {BRAND.store.hours.map((h) => (
                    <li key={h.days} className="flex flex-col">
                      <span className="text-[11px] text-[#FAF7EE]/55">
                        {h.days}
                      </span>
                      <span className="font-medium">{h.time}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Bandeau bas — copyright + service. Discret. */}
          <div className="mt-12 md:mt-16 pt-6 border-t border-[#FAF7EE]/15 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-[11px] text-[#FAF7EE]/55">
            <p>
              © {new Date().getFullYear()} {BRAND.name} · {formatStoreLocation(BRAND.store)}
            </p>
            <p>Click & collect uniquement · Aucune livraison</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
