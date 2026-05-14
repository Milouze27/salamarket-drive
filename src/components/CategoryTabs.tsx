import { useEffect, useRef } from "react";
import { BRAND } from "@/config/brand";
import { cn } from "@/lib/utils";

interface Props {
  active: string;
  onChange: (slug: string) => void;
}

const ITEMS = [
  { slug: "all", name: "Tout" },
  ...BRAND.categories.map(({ slug, name }) => ({ slug, name })),
];

// Nav catégories éditoriale — texte tracké, souligné doré sur active.
// Plus de pills SaaS, plus d'icônes emoji. Le sticky reste mais sur fond
// crème (#FAF7EE) avec une fine border-bottom au lieu d'un fond contrasté.
// Inspiration : nav départements grand magasin / sommaire éditorial.
export const CategoryTabs = ({ active, onChange }: Props) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const activeBtnRef = useRef<HTMLButtonElement>(null);

  // Auto-scroll horizontal pour amener l'item actif dans la zone visible.
  // Évite que sur mobile on cache l'item sélectionné en bord d'écran après
  // un clic ou un retour catégorie via query param.
  useEffect(() => {
    const btn = activeBtnRef.current;
    const track = trackRef.current;
    if (!btn || !track) return;
    const btnLeft = btn.offsetLeft;
    const btnRight = btnLeft + btn.offsetWidth;
    const viewLeft = track.scrollLeft;
    const viewRight = viewLeft + track.clientWidth;
    if (btnLeft < viewLeft || btnRight > viewRight) {
      track.scrollTo({
        left: btnLeft - 24,
        behavior: "smooth",
      });
    }
  }, [active]);

  return (
    <nav
      id="nos-rayons"
      aria-label="Filtrer par rayon"
      className="sticky z-40 bg-[#FAF7EE]/95 backdrop-blur-md border-b border-[#E8E4D8]"
      style={{ top: "calc(env(safe-area-inset-top) + 3.5rem)" }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Eyebrow + titre section discret — ancre l'éditorial */}
        <div className="hidden md:flex items-baseline gap-4 pt-6 pb-4">
          <p className="text-[10px] uppercase tracking-[0.28em] font-bold text-[#C9A227]">
            Nos rayons
          </p>
          <span aria-hidden className="flex-1 h-px bg-[#E8E4D8]" />
        </div>

        <div
          ref={trackRef}
          className="flex items-center gap-1 md:gap-2 overflow-x-auto scrollbar-none -mx-4 md:mx-0 px-4 md:px-0 py-3"
          style={{ scrollbarWidth: "none" }}
        >
          {ITEMS.map((item) => {
            const isActive = active === item.slug;
            return (
              <button
                key={item.slug}
                ref={isActive ? activeBtnRef : undefined}
                type="button"
                onClick={() => onChange(item.slug)}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "relative shrink-0 px-3 md:px-3.5 py-1.5 text-[13px] md:text-sm font-medium whitespace-nowrap transition-colors rounded-md",
                  isActive
                    ? "text-[#0E3B2E]"
                    : "text-[#6B7280] hover:text-[#0E3B2E]",
                )}
              >
                <span className="relative z-10">{item.name}</span>
                {/* Soulignement doré pour l'actif — pose d'un underline
                    éditorial, pas un fill complet de pill. */}
                {isActive && (
                  <span
                    aria-hidden
                    className="absolute left-3 right-3 md:left-3.5 md:right-3.5 -bottom-[1px] h-[2px] bg-[#C9A227] rounded-full"
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default CategoryTabs;
