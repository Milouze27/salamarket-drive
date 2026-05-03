import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Search, ShoppingCart, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useCartCount } from "@/hooks/useCartSummary";
import { HeaderUserMenu } from "@/components/HeaderUserMenu";
import { cn } from "@/lib/utils";

interface Props {
  searchValue: string;
  onSearchChange: (value: string) => void;
}

export const Header = ({ searchValue, onSearchChange }: Props) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const cartCount = useCartCount();

  // Bump le badge à chaque changement de quantité (autre que mount initial).
  // On garde l'ancien count en ref pour ne pas bumper sur le 1er render.
  const prevCountRef = useRef(cartCount);
  const [bump, setBump] = useState(false);
  useEffect(() => {
    if (prevCountRef.current !== cartCount && cartCount > 0) {
      setBump(true);
      const t = window.setTimeout(() => setBump(false), 400);
      prevCountRef.current = cartCount;
      return () => window.clearTimeout(t);
    }
    prevCountRef.current = cartCount;
  }, [cartCount]);

  const cartLabel =
    cartCount > 0
      ? `Panier (${cartCount} article${cartCount > 1 ? "s" : ""})`
      : "Panier";
  const displayedCount = cartCount > 9 ? "9+" : String(cartCount);

  return (
    <header
      aria-label="Navigation principale"
      className="sticky top-0 z-50 bg-gradient-to-b from-[#0F4C3A] to-[#0A3A2C] border-b border-white/10"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="max-w-7xl mx-auto px-4 flex items-center h-16">
        {isSearchOpen ? (
          /* Mode recherche mobile : remplace TOUT le contenu du header */
          <div className="flex items-center gap-3 w-full">
            <button
              type="button"
              onClick={() => setIsSearchOpen(false)}
              aria-label="Fermer la recherche"
              className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center text-white shrink-0 focus:outline-none focus:ring-2 focus:ring-white/30"
            >
              <ArrowLeft size={22} />
            </button>
            <Input
              autoFocus
              type="text"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Rechercher viandes, épices, riz…"
              className="flex-1 h-10 bg-white/10 border-transparent text-white placeholder:text-white/60 focus-visible:bg-white/20 focus-visible:border-transparent focus-visible:ring-0 rounded-full pl-4 pr-4"
            />
            {searchValue && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                aria-label="Effacer la recherche"
                className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center text-white/70 shrink-0"
              >
                <X size={20} />
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Logo */}
            <Link
              to="/"
              className="shrink-0 flex items-center"
              aria-label="Salamarket Drive — accueil"
            >
              <img
                src="/brand/logo-horizontal-light.png"
                alt="Salamarket Drive"
                className="h-9 md:h-10 w-auto"
              />
            </Link>

            {/* Recherche desktop */}
            <div className="flex-1 max-w-md mx-6 hidden md:block relative">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/60 pointer-events-none"
              />
              <Input
                type="text"
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Rechercher viandes, épices, riz…"
                className="h-10 bg-white/10 hover:bg-white/15 border-transparent text-white placeholder:text-white/60 focus-visible:bg-white/20 focus-visible:border-white/30 focus-visible:ring-0 rounded-full pl-10 pr-10 transition-all"
              />
              {searchValue && (
                <button
                  type="button"
                  onClick={() => onSearchChange("")}
                  aria-label="Effacer la recherche"
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center text-white/70 hover:bg-white/10"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Spacer mobile (pousse les icônes à droite) */}
            <div className="flex-1 md:hidden" />

            {/* Icônes droite */}
            <div className="flex items-center gap-1.5 shrink-0">
              {/* Recherche mobile (ouvre l'overlay) */}
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                aria-label="Rechercher"
                className="md:hidden w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/30"
              >
                <Search size={22} />
              </button>

              {/* Panier */}
              <Link
                to="/panier"
                aria-label={cartLabel}
                className="relative w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/30"
              >
                <ShoppingCart size={22} />
                {cartCount > 0 && (
                  <span
                    className={cn(
                      "absolute -top-0.5 -right-0.5 bg-[#D4A93C] text-[#0F4C3A] text-[10px] font-bold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center border-2 border-[#0F4C3A] shadow-md shadow-[#D4A93C]/40",
                      bump && "animate-cart-bump",
                    )}
                  >
                    {displayedCount}
                  </span>
                )}
              </Link>

              {/* Menu utilisateur */}
              <HeaderUserMenu />
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
