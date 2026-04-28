import { BRAND } from "@/config/brand";
import { cn } from "@/lib/utils";

interface Props {
  active: string;
  onChange: (slug: string) => void;
}

export const CategoryPills = ({ active, onChange }: Props) => {
  const all = [{ slug: "all", name: "Tout", emoji: "✨" }, ...BRAND.categories];
  return (
    <div className="overflow-x-auto scrollbar-none -mx-4 px-4">
      <div className="flex gap-2 pb-1 w-max">
        {all.map((c) => {
          const isActive = active === c.slug;
          return (
            <button
              key={c.slug}
              onClick={() => onChange(c.slug)}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors border",
                isActive
                  ? "bg-primary text-white border-primary"
                  : "bg-bg text-text border-border hover:border-primary/40"
              )}
            >
              <span>{c.emoji}</span>
              <span>{c.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
