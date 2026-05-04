import { BadgeCheck, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Product } from "@/types/product";
import { formatPrice, unitLabel } from "@/lib/format";
import { useCartStore } from "@/stores/cartStore";

interface Props {
  product: Product;
}

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

  return (
    <div
      onClick={handleOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") handleOpen();
      }}
      className="group flex flex-col bg-white rounded-2xl border border-border overflow-hidden cursor-pointer text-left shadow-sm hover:shadow-lg hover:shadow-[#0F4C3A]/8 hover:border-[#0F4C3A]/30 hover:-translate-y-0.5 transition-all duration-300"
    >
      <div className="relative aspect-square w-full bg-bg overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          decoding="async"
          width={600}
          height={600}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        {/* Badge halal subtle en haut à droite */}
        <span
          className="absolute top-2 right-2 inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-white/95 backdrop-blur text-[#0F4C3A] text-[9px] font-bold shadow-sm"
          aria-label="Produit halal certifié"
        >
          <BadgeCheck size={10} className="text-[#D4A93C]" aria-hidden />
          Halal
        </span>
      </div>
      <div className="flex flex-col flex-1 p-3 gap-1">
        <h3 className="font-medium text-sm leading-tight text-text line-clamp-2 min-h-[2.5em]">
          {product.name}
        </h3>
        <p className="text-xs text-muted">{unitLabel(product.unit)}</p>
        <div className="flex items-end justify-between mt-2">
          <span className="font-bold text-[#0F4C3A] text-base tabular-nums">
            {formatPrice(product.priceCents)}
          </span>
          <button
            onClick={handleAdd}
            aria-label={`Ajouter ${product.name} au panier`}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0F4C3A] to-[#0A3A2C] text-white flex items-center justify-center shadow-md shadow-[#0F4C3A]/25 hover:shadow-lg hover:shadow-[#0F4C3A]/35 hover:scale-105 active:scale-90 transition-all"
          >
            <Plus size={20} strokeWidth={2.5} aria-hidden />
          </button>
        </div>
      </div>
    </div>
  );
};
