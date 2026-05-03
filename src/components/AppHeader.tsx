import { ShoppingBag, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BRAND } from "@/config/brand";
import { useCartCount } from "@/hooks/useCartSummary";
import { HeaderUserMenu } from "@/components/HeaderUserMenu";

interface Props {
  showBack?: boolean;
  title?: string;
}

export const AppHeader = ({ showBack = false, title }: Props) => {
  const navigate = useNavigate();
  const count = useCartCount();

  return (
    <header
      className="sticky top-0 z-40 bg-[#FAFAF7]/95 backdrop-blur-md border-b border-border"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {showBack && (
            <button
              onClick={() => {
                if (window.history.length > 1) {
                  window.history.back();
                } else {
                  navigate("/");
                }
              }}
              aria-label="Retour"
              className="w-10 h-10 -ml-2 rounded-full hover:bg-white flex items-center justify-center text-text active:scale-90 transition-transform"
            >
              <ArrowLeft size={22} aria-hidden />
            </button>
          )}
          {title ? (
            <h1 className="font-semibold text-base text-text truncate">
              {title}
            </h1>
          ) : (
            <h1 className="font-bold text-lg text-[#0F4C3A] tracking-tight truncate">
              {BRAND.name}
            </h1>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => navigate("/panier")}
            aria-label={
              count > 0
                ? `Voir le panier (${count} article${count > 1 ? "s" : ""})`
                : "Voir le panier"
            }
            className="relative w-10 h-10 rounded-full hover:bg-white flex items-center justify-center text-text active:scale-90 transition-transform"
          >
            <ShoppingBag size={22} aria-hidden />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#D4A93C] text-[#0F4C3A] text-[10px] font-bold flex items-center justify-center border-2 border-white shadow-sm">
                {count > 9 ? "9+" : count}
              </span>
            )}
          </button>
          <HeaderUserMenu />
        </div>
      </div>
    </header>
  );
};
