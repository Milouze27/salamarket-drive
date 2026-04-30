import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AlertCircle, SearchX } from "lucide-react";
import { Header } from "@/components/Header";
import { HeroSlider } from "@/components/HeroSlider";
import { CategoryTabs } from "@/components/CategoryTabs";
import { ProductCard } from "@/components/ProductCard";
import { ProductCardSkeleton } from "@/components/ProductCardSkeleton";
import { useProducts } from "@/hooks/useProducts";
import { BRAND } from "@/config/brand";
import { normalizeSearch } from "@/lib/search";

const Index = () => {
  const [searchParams] = useSearchParams();
  const [category, setCategory] = useState<string>("all");
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const { data: allProducts, isLoading, isError, error, refetch } = useProducts();

  // Pré-sélection de la catégorie via le query param (?category=...)
  // utilisé par les CTAs du hero slider.
  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) setCategory(cat);
  }, [searchParams]);

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

  const resetFilters = () => {
    setCategory("all");
    setSearchInput("");
  };

  return (
    <div className="min-h-dvh bg-[#FAFAFA]">
      <Header searchValue={searchInput} onSearchChange={setSearchInput} />
      <HeroSlider />
      <CategoryTabs active={category} onChange={setCategory} />

      <main className="max-w-7xl mx-auto px-4 py-6">
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
              className="mt-2 px-4 py-2 rounded-full bg-[#0F4C3A] text-white text-sm font-medium hover:bg-[#0A3A2C] transition-colors"
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
              className="mt-2 px-4 py-2 rounded-full bg-[#0F4C3A] text-white text-sm font-medium hover:bg-[#0A3A2C] transition-colors"
            >
              Voir tous les produits
            </button>
          </div>
        )}
      </main>

      <footer className="py-6 px-4 text-center text-xs text-gray-500 border-t border-gray-200 mt-8">
        Retrait magasin uniquement · {BRAND.store.name} · {BRAND.store.city}
      </footer>
    </div>
  );
};

export default Index;
