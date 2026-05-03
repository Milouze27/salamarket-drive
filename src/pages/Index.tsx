import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AlertCircle, SearchX } from "lucide-react";
import { Header } from "@/components/Header";
import { HeroSlider } from "@/components/HeroSlider";
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

      <main className="max-w-7xl mx-auto px-4 py-8">
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
            {products.map((p, idx) => (
              <div
                key={p.id}
                className="animate-in fade-in slide-in-from-bottom-2 duration-500 [animation-fill-mode:backwards]"
                // Stagger : 8 premières cards apparaissent en cascade
                // (~40ms delta), puis tout le reste d'un coup pour ne pas
                // donner une attente trop longue sur les listes longues.
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
              className="mt-2 px-4 py-2 rounded-full bg-[#0F4C3A] text-white text-sm font-medium hover:bg-[#0A3A2C] transition-colors"
            >
              Voir tous les produits
            </button>
          </div>
        )}
      </main>

      <footer className="mt-12 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-10 grid gap-8 sm:grid-cols-3 text-sm text-gray-600">
          <div>
            <p className="font-semibold text-[#0F4C3A] mb-2">{BRAND.store.name}</p>
            <p>{BRAND.store.address}</p>
            <p>{BRAND.store.postalCode} {BRAND.store.city}</p>
          </div>
          <div>
            <p className="font-semibold text-[#0F4C3A] mb-2">Horaires</p>
            <ul className="space-y-1">
              {BRAND.store.hours.map((h) => (
                <li key={h.days} className="flex justify-between sm:flex-col sm:gap-0">
                  <span>{h.days}</span>
                  <span className="font-medium text-gray-800 sm:mt-0">{h.time}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-semibold text-[#0F4C3A] mb-2">Service</p>
            <p>Click & collect uniquement</p>
            <p className="text-xs text-gray-500 mt-2">
              Commandez en ligne, retirez en magasin sur le créneau de votre choix.
            </p>
          </div>
        </div>
        <div className="border-t border-gray-100 py-4 px-4 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} {BRAND.name} · {formatStoreLocation(BRAND.store)}
        </div>
      </footer>
    </div>
  );
};

export default Index;
