import { BadgeCheck, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Product } from "@/types/product";
import { formatPrice, unitLabel } from "@/lib/format";
import { useCartStore } from "@/stores/cartStore";

interface Props {
  product: Product;
}

// Card éditorial photo-led — pas de frame card "SaaS", pas de border
// systématique. La photo porte la card (Maison Plisson), le texte
// respire en dessous. Le hover ne soulève pas la card : il zoome
// doucement l'image. Le CTA + reste minimal (40×40 doré sapin) pour
// ne pas écraser le visuel.
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

  // Badge "Halal" affiché uniquement sur les produits où la certification
  // halal est un signal d'achat (viandes/charcuterie). Les autres produits
  // (épicerie, boissons, frais...) sont halal par défaut chez Salamarket
  // et n'ont pas besoin d'être marqués spécifiquement.
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
      {/* Photo dominante portrait 4:5 — atmosphère Plisson */}
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl bg-white">
        <img
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          decoding="async"
          width={600}
          height={750}
          className="w-full h-full object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.05]"
        />

        {showHalalBadge && (
          <span
            className="absolute top-2.5 left-2.5 inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-[#FAF7EE]/95 backdrop-blur text-[#0E3B2E] text-[9px] font-bold shadow-sm"
            aria-label="Produit halal certifié"
          >
            <BadgeCheck size={10} className="text-[#C9A227]" aria-hidden />
            Halal
          </span>
        )}

        {/* Ombre subtile bas pour ancrer la photo sans card frame.
            Très légère, sépare juste de la zone texte. */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/8 via-black/0 to-transparent pointer-events-none"
        />

        {/* CTA + en overlay bas-droite — discret au repos, vivant au hover/active */}
        <button
          onClick={handleAdd}
          aria-label={`Ajouter ${product.name} au panier`}
          className="absolute bottom-3 right-3 w-11 h-11 rounded-full bg-[#0E3B2E] text-white flex items-center justify-center shadow-lg shadow-[#0E3B2E]/30 hover:bg-[#082A20] hover:scale-105 active:scale-90 transition-all"
        >
          <Plus size={20} strokeWidth={2.4} aria-hidden />
        </button>
      </div>

      {/* Texte sous l'image, pas dans une card. Hiérarchie éditoriale. */}
      <div className="flex flex-col gap-1 px-1 pt-3 pb-1">
        <h3 className="font-medium text-[14px] leading-tight text-[#0F1A14] line-clamp-2 min-h-[2.5em] group-hover:text-[#0E3B2E] transition-colors">
          {product.name}
        </h3>
        <div className="flex items-baseline gap-1.5">
          <span className="font-semibold text-[15px] text-[#0E3B2E] tabular-nums">
            {formatPrice(product.priceCents)}
          </span>
          <span className="text-[11px] text-[#6B7280]">
            · {unitLabel(product.unit)}
          </span>
        </div>
      </div>
    </article>
  );
};
