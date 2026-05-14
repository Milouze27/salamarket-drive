import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { Product } from "@/types/product";
import { formatPrice, unitLabel } from "@/lib/format";

interface Props {
  products: Product[];
}

// Sélection éditoriale en bandeau horizontal — pas un slider promo,
// 3 produits curatés avec une note d'intention type ardoise. Photo
// dominante 4:5, titre serif, prix discret. À la Maison Plisson :
// "le coup de cœur de la semaine" plutôt que "TOP VENTES".
//
// Les 3 produits sont choisis en priorité parmi des catégories
// signature (boucherie / charcuterie / épicerie), pour que la sélection
// reflète l'identité du magasin. Fallback : 3 premiers en stock.
const PICKS: Array<{
  category: Product["category"];
  caption: string;
}> = [
  { category: "boucherie", caption: "Le coup de cœur du boucher" },
  { category: "charcuterie", caption: "Préparée hier soir en cuisine" },
  { category: "epicerie", caption: "L'essentiel qu'on garde toujours" },
];

const pickFromCatalog = (products: Product[]): Array<{ product: Product; caption: string }> => {
  const inStock = products.filter((p) => p.inStock);
  const picks: Array<{ product: Product; caption: string }> = [];
  const used = new Set<string>();

  for (const slot of PICKS) {
    const match = inStock.find(
      (p) => p.category === slot.category && !used.has(p.id),
    );
    if (match) {
      picks.push({ product: match, caption: slot.caption });
      used.add(match.id);
    }
  }

  // Si on n'a pas atteint 3, on complète avec les premiers en stock
  // hors catégories déjà prises.
  if (picks.length < 3) {
    for (const p of inStock) {
      if (picks.length >= 3) break;
      if (!used.has(p.id)) {
        picks.push({ product: p, caption: "Notre sélection" });
        used.add(p.id);
      }
    }
  }

  return picks.slice(0, 3);
};

export const WeeklyPicks = ({ products }: Props) => {
  const picks = pickFromCatalog(products);
  if (picks.length === 0) return null;

  return (
    <section
      aria-labelledby="weekly-picks-title"
      className="relative bg-[#FAF7EE] border-y border-[#E8E4D8]"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
        {/* Header section : kicker + titre + lien droite */}
        <div className="flex items-end justify-between gap-4 mb-8 md:mb-10">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] font-bold text-[#C9A227] mb-2">
              Cette semaine
            </p>
            <h2
              id="weekly-picks-title"
              className="font-serif text-[26px] md:text-[36px] leading-[1.1] text-[#0E3B2E] tracking-[-0.01em]"
              style={{ fontVariationSettings: '"opsz" 72' }}
            >
              Notre sélection
            </h2>
          </div>
          <a
            href="#nos-rayons"
            className="hidden md:inline-flex items-center gap-1 text-sm font-semibold text-[#0E3B2E] underline-offset-[6px] hover:underline decoration-[#C9A227]/60 shrink-0"
          >
            Tout le catalogue
            <ArrowRight size={14} aria-hidden />
          </a>
        </div>

        {/* Grille 3 colonnes desktop · scroll horizontal mobile */}
        <ul
          className="
            flex md:grid md:grid-cols-3 gap-5 md:gap-8
            -mx-4 md:mx-0 px-4 md:px-0
            overflow-x-auto md:overflow-visible scrollbar-none
            snap-x snap-mandatory md:snap-none
          "
        >
          {picks.map(({ product, caption }) => (
            <li
              key={product.id}
              className="shrink-0 w-[78%] sm:w-[60%] md:w-auto snap-start"
            >
              <Link
                to={`/produit/${product.id}`}
                className="group block"
                aria-label={`${product.name} — ${caption}`}
              >
                {/* Photo dominante 4:5 portrait — pas de card frame */}
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl bg-white">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    loading="lazy"
                    decoding="async"
                    width={800}
                    height={1000}
                    className="w-full h-full object-cover transition-transform duration-[700ms] ease-out group-hover:scale-[1.04]"
                  />
                  {/* Numéro éditorial discret — pose une intention de
                      curation, comme un cartel d'expo. */}
                  <span
                    aria-hidden
                    className="absolute top-4 left-4 inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#FAF7EE]/95 backdrop-blur text-[10px] font-bold tabular-nums text-[#0E3B2E] shadow-sm"
                  >
                    {String(picks.indexOf(picks.find((x) => x.product.id === product.id)!) + 1).padStart(2, "0")}
                  </span>
                </div>

                {/* Légende sous l'image — type éditorial, pas card UI */}
                <div className="mt-4 pl-1 pr-2">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[#C9A227] font-bold mb-1.5">
                    {caption}
                  </p>
                  <h3 className="font-serif text-[20px] md:text-[22px] leading-[1.2] text-[#0E3B2E] tracking-[-0.01em]">
                    {product.name}
                  </h3>
                  <div className="mt-2 flex items-baseline gap-2 text-[#0F1A14]/75">
                    <span className="text-[15px] font-semibold tabular-nums text-[#0E3B2E]">
                      {formatPrice(product.priceCents)}
                    </span>
                    <span className="text-[12px] text-[#6B7280]">
                      · {unitLabel(product.unit)}
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        {/* Lien tout le catalogue — version mobile sous la liste */}
        <a
          href="#nos-rayons"
          className="md:hidden mt-6 inline-flex items-center gap-1 text-sm font-semibold text-[#0E3B2E] underline-offset-[6px] underline decoration-[#C9A227]/60"
        >
          Tout le catalogue
          <ArrowRight size={14} aria-hidden />
        </a>
      </div>
    </section>
  );
};

export default WeeklyPicks;
