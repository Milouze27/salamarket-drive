import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Product } from "@/types/product";
import { formatPrice, unitLabel } from "@/lib/format";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";

interface Props {
  product: Product;
}

export const ProductCard = ({ product }: Props) => {
  const navigate = useNavigate();
  const addItem = useCartStore((s) => s.addItem);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product);
    toast.success("Ajouté au panier", {
      description: product.name,
    });
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
      className="group flex flex-col bg-white rounded-2xl border border-border overflow-hidden cursor-pointer text-left shadow-sm hover:shadow-lg hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-300"
    >
      <div className="aspect-square w-full bg-bg overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          decoding="async"
          width={600}
          height={600}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
      </div>
      <div className="flex flex-col flex-1 p-3 gap-1">
        <h3 className="font-medium text-sm leading-tight text-text line-clamp-2">
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
            className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-md hover:bg-primary/90 hover:scale-105 active:scale-95 transition-transform"
          >
            <Plus size={20} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
};
