import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, ShoppingCart, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCartStore } from "@/stores/cartStore";
import { HeaderUserMenu } from "@/components/HeaderUserMenu";

interface Props {
  searchValue: string;
  onSearchChange: (value: string) => void;
}

export const Header = ({ searchValue, onSearchChange }: Props) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const cartCount = useCartStore((s) => s.items.reduce((n, i) => n + i.quantity, 0));

  return (
    <header
      aria-label="Navigation principale"
      className="sticky top-0 z-50 bg-gradient-to-b from-[#0F4C3A] to-[#0A3A2C] border-b border-white/10"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="shrink-0" aria-label="Salamarket Drive — accueil">
          <img
            src="/brand/logo-horizontal-light.png"
            alt="Salamarket Drive"
            className="h-8 md:h-9 w-auto"
          />
        </Link>

        {/* Recherche desktop */}
        <div className="flex-1 max-w-md mx-4 hidden md:block relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 pointer-events-none"
          />
          <Input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Rechercher un produit..."
            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus-visible:bg-white/20 focus-visible:border-white/40 focus-visible:ring-0"
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

        {/* Icônes droite */}
        <div className="flex items-center gap-1 md:gap-2">
          {/* Bouton recherche mobile */}
          <Sheet open={searchOpen} onOpenChange={setSearchOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label="Rechercher"
                className="md:hidden h-10 w-10 rounded-full hover:bg-white/10 flex items-center justify-center text-white focus:outline-none focus:ring-2 focus:ring-white/30"
              >
                <Search size={20} />
              </button>
            </SheetTrigger>
            <SheetContent side="top" className="bg-white pt-6">
              <div className="relative max-w-2xl mx-auto">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <Input
                  type="text"
                  value={searchValue}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Rechercher un produit..."
                  className="pl-10 h-12"
                  autoFocus
                />
                {searchValue && (
                  <button
                    type="button"
                    onClick={() => onSearchChange("")}
                    aria-label="Effacer la recherche"
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            </SheetContent>
          </Sheet>

          {/* Panier */}
          <Link
            to="/panier"
            aria-label={`Panier${cartCount > 0 ? ` (${cartCount} article${cartCount > 1 ? "s" : ""})` : ""}`}
            className="relative h-10 w-10 rounded-full hover:bg-white/10 flex items-center justify-center text-white focus:outline-none focus:ring-2 focus:ring-white/30"
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#D4A93C] text-[#0F4C3A] text-xs font-bold rounded-full min-w-[20px] h-5 px-1 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Menu utilisateur */}
          <HeaderUserMenu />
        </div>
      </div>
    </header>
  );
};

export default Header;
