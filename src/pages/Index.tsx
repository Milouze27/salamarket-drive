import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { CategoryPills } from "@/components/CategoryPills";
import { ProductCard } from "@/components/ProductCard";
import { MOCK_PRODUCTS } from "@/data/mockProducts";
import { BRAND } from "@/config/brand";

const Index = () => {
  const [category, setCategory] = useState<string>("all");

  const products = useMemo(() => {
    if (category === "all") return MOCK_PRODUCTS;
    return MOCK_PRODUCTS.filter((p) => p.category === category);
  }, [category]);

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

        {/* Grid */}
        {products.length > 0 ? (
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
