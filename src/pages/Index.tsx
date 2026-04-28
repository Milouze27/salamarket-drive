import { useMemo, useState } from "react";
import { Search, AlertCircle } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { CategoryPills } from "@/components/CategoryPills";
import { ProductCard } from "@/components/ProductCard";
import { ProductCardSkeleton } from "@/components/ProductCardSkeleton";
import { useProducts } from "@/hooks/useProducts";
import { BRAND } from "@/config/brand";

const Index = () => {
  const [category, setCategory] = useState<string>("all");
  const { data: allProducts, isLoading, isError, error, refetch } = useProducts();

  const products = useMemo(() => {
    if (!allProducts) return [];
    if (category === "all") return allProducts;
    return allProducts.filter((p) => p.category === category);
  }, [allProducts, category]);

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
            placeholder="Rechercher un produit..."
            className="w-full h-11 pl-10 pr-4 rounded-full bg-white border border-border text-sm placeholder:text-muted focus:outline-none focus:border-primary transition-colors"
          />
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
