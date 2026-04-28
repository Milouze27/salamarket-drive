import { useEffect, useMemo, useState } from "react";
import { Search, AlertCircle, X } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { CategoryPills } from "@/components/CategoryPills";
import { ProductCard } from "@/components/ProductCard";
import { ProductCardSkeleton } from "@/components/ProductCardSkeleton";
import { useProducts } from "@/hooks/useProducts";
import { BRAND } from "@/config/brand";
import { normalizeSearch } from "@/lib/search";

const Index = () => {
  const [category, setCategory] = useState<string>("all");
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const { data: allProducts, isLoading, isError, error, refetch } = useProducts();

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchInput), 200);
    return () => clearTimeout(t);
  }, [searchInput]);

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

  const hasSearch = debouncedSearch.trim().length > 0;

  return (
    <div className="min-h-screen bg-bg text-text flex flex-col">
      <AppHeader />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-4 flex flex-col gap-4">
        {/* Search */}
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Rechercher un produit..."
            className="w-full h-11 pl-10 pr-10 rounded-full bg-white border border-border text-sm placeholder:text-muted focus:outline-none focus:border-primary transition-colors"
          />
          {searchInput && (
            <button
              onClick={() => setSearchInput("")}
              aria-label="Effacer la recherche"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center text-muted hover:bg-bg"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Categories */}
        <CategoryPills active={category} onChange={setCategory} />

        {/* Tagline */}
        <p className="text-sm text-muted -mt-1">{BRAND.tagline}</p>

        {/* States */}
        {isError ? (
          <div className="flex flex-col items-center justify-center text-center py-16 px-4 gap-3">
            <AlertCircle size={36} className="text-destructive" />
            <h2 className="font-semibold text-text">
              Impossible de charger le catalogue
            </h2>
            <p className="text-sm text-muted max-w-sm">
              {error instanceof Error
                ? error.message
                : "Une erreur est survenue. Vérifiez votre connexion et réessayez."}
            </p>
            <button
              onClick={() => refetch()}
              className="mt-2 px-4 py-2 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Réessayer
            </button>
          </div>
        ) : isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : hasSearch ? (
          <div className="text-center py-12 flex flex-col items-center gap-3">
            <p className="text-muted">
              Aucun produit ne correspond à «&nbsp;{debouncedSearch}&nbsp;»
            </p>
            <button
              onClick={() => setSearchInput("")}
              className="px-4 py-2 rounded-full bg-primary text-white text-sm font-medium"
            >
              Effacer la recherche
            </button>
          </div>
        ) : (
          <div className="text-center text-muted py-12">
            Aucun produit dans cette catégorie pour le moment.
          </div>
        )}
      </main>

      <footer className="py-6 px-4 text-center text-xs text-muted border-t border-border mt-8">
        Retrait magasin uniquement · {BRAND.store.name} · {BRAND.store.city}
      </footer>
    </div>
  );
};

export default Index;
