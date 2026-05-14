import { BadgeCheck, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Product } from "@/types/product";
import { formatPrice, unitLabel } from "@/lib/format";
import { useCartStore } from "@/stores/cartStore";

interface Props {
  product: Product;
}

// Card produit Chronodrive-density × Salamarket-warmth :
// - Photo dominante carrée (rapport scan rapide en grille)
// - Nom 2 lignes, mesure stable
// - Pricing aligné Chronodrive : prix grand + unit price discret en
//   dessous (€/kg, /pièce…), pas de confusion
// - CTA + bas-droite overlay sur photo, accessible au pouce
// - Pas de card frame qui crie : photo + texte aérés, c'est l'image
//   et la typo qui portent la fiche
export const ProductCard = ({ product }: Props) => {
  const navigate = useNavigate();
  const addItem = useCartStore((s) => s.addItem);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product);
  };

  const handleOpen = () => {
    navigate(`/produit/${product.id}`);
  };

  // Badge "Halal" sur les viandes/charcuterie uniquement (les autres
  // sont halal par défaut chez Salamarket et n'ont pas besoin de signal).
  const showHalalBadge =
    product.category === "boucherie" || product.category === "charcuterie";

  return (
    <article
      onClick={handleOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") handleOpen();
      }}
      aria-label={`${product.name} — ${formatPrice(product.priceCents)}`}
      className="group flex flex-col cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A227] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF7EE] rounded-3xl"
    >
      {/* Photo dominante carrée — atmosphère Plisson croisée Chronodrive */}
      <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-white shadow-[0_12px_28px_-16px_rgba(8,42,32,0.18)]">
        <img
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          decoding="async"
          width={600}
          height={600}
          className="w-full h-full object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.05]"
        />

        {showHalalBadge && (
          <span
            className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#FAF7EE]/95 backdrop-blur text-[#0E3B2E] text-[10px] font-extrabold uppercase tracking-[0.1em] shadow-sm"
            aria-label="Produit halal certifié"
          >
            <BadgeCheck size={11} className="text-[#C9A227]" aria-hidden />
            Halal
          </span>
        )}

        {/* CTA + overlay bas-droite, accessible au pouce sur mobile */}
        <button
          onClick={handleAdd}
          aria-label={`Ajouter ${product.name} au panier`}
          className="absolute bottom-2.5 right-2.5 w-11 h-11 rounded-full bg-[#0E3B2E] text-white flex items-center justify-center shadow-lg shadow-[#0E3B2E]/35 hover:bg-[#082A20] hover:scale-105 active:scale-90 transition-all"
        >
          <Plus size={20} strokeWidth={2.4} aria-hidden />
        </button>
      </div>

      {/* Texte sous l'image — hiérarchie pricing Chronodrive */}
      <div className="flex flex-col gap-1 px-1 pt-3.5 pb-1">
        <h3 className="text-[13.5px] md:text-[14px] leading-[1.25] text-[#0F1A14] font-semibold line-clamp-2 min-h-[2.5em] group-hover:text-[#0E3B2E] transition-colors">
          {product.name}
        </h3>
        <div className="mt-1 flex items-baseline gap-1.5">
          <span className="text-[15.5px] md:text-[16px] font-extrabold text-[#0E3B2E] tabular-nums tracking-[-0.01em]">
            {formatPrice(product.priceCents)}
          </span>
          <span className="text-[10.5px] uppercase tracking-[0.12em] text-[#0F1A14]/55 font-semibold">
            · {unitLabel(product.unit)}
          </span>
        </div>
      </div>
    </article>
  );
};
