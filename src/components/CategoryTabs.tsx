import { BRAND } from "@/config/brand";
import { cn } from "@/lib/utils";

interface Props {
  active: string;
  onChange: (slug: string) => void;
}

const ITEMS = [{ slug: "all", name: "Tout" }, ...BRAND.categories.map(({ slug, name }) => ({ slug, name }))];

export const CategoryTabs = ({ active, onChange }: Props) => (
  <nav
    aria-label="Filtrer par catégorie"
    className="sticky z-40 bg-[#FAFAF7]/95 backdrop-blur-md border-b border-border py-3"
    style={{ top: "calc(env(safe-area-inset-top) + 3.5rem)" }}
  >
    <div className="max-w-7xl mx-auto px-4">
      <div
        className="flex gap-2 overflow-x-auto scrollbar-none -mx-4 px-4"
        style={{ scrollbarWidth: "none" }}
      >
        {ITEMS.map((item) => {
          const isActive = active === item.slug;
          return (
            <button
              key={item.slug}
              type="button"
              onClick={() => onChange(item.slug)}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "shrink-0 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors border",
                isActive
                  ? "bg-[#0F4C3A] text-white border-[#0F4C3A]"
                  : "bg-white text-gray-700 border-gray-200 hover:border-[#0F4C3A]/40",
              )}
            >
              {item.name}
            </button>
          );
        })}
      </div>
    </div>
  </nav>
);

export default CategoryTabs;
