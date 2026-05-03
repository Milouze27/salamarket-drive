import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Search, Store, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { HeaderUserMenu } from "@/components/HeaderUserMenu";
import { cn } from "@/lib/utils";

interface Props {
  searchValue: string;
  onSearchChange: (value: string) => void;
}

// Extrait le prénom du full_name. Fallback null si vide.
const firstNameOf = (full?: string | null): string | null => {
  if (!full) return null;
  const trimmed = full.trim();
  if (!trimmed) return null;
  return trimmed.split(/\s+/)[0];
};

// Salutation contextuelle selon l'heure (Europe/Paris).
const greetingForHour = (h: number): string => {
  if (h < 5) return "Bonsoir";
  if (h < 18) return "Bonjour";
  return "Bonsoir";
};

export const Header = ({ searchValue, onSearchChange }: Props) => {
  const { profile, user } = useAuth();
  const firstName = firstNameOf(profile?.full_name);

  // iOS Large Title pattern : le hero scroll naturellement avec la page
  // (non sticky) ; quand il sort de la viewport, un compact bar fixed
  // top apparaît avec opacity tracked par IntersectionObserver. Cela évite
  // le scroll-listener overhead et reste smooth sur Safari iOS.
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [showCompact, setShowCompact] = useState(false);
  const [compactSearchOpen, setCompactSearchOpen] = useState(false);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const obs = new IntersectionObserver(
      ([entry]) => setShowCompact(!entry.isIntersecting),
      { rootMargin: "0px", threshold: 0 },
    );
    obs.observe(sentinel);
    return () => obs.disconnect();
  }, []);

  // Calcul du greeting (recalc à chaque mount, pas reactive — c'est OK
  // car la session est rarement assez longue pour traverser midi)
  const hour = new Date().getHours();
  const greet = greetingForHour(hour);

  return (
    <>
      {/* HERO — scrolls naturellement avec la page */}
      <section className="bg-[#FAFAF7] px-4 pt-3 pb-5">
        {/* Top row : logo wordmark + account */}
        <div
          className="flex items-center justify-between mb-5"
          style={{ paddingTop: "env(safe-area-inset-top)" }}
        >
          <Link
            to="/"
            aria-label="Salamarket Drive — accueil"
            className="inline-flex items-baseline gap-1 active:scale-95 transition-transform"
          >
            <span className="text-base font-bold text-[#0F4C3A] tracking-tight">
              Salamarket
            </span>
            <span className="text-base font-light text-[#D4A93C] tracking-tight">
              Drive
            </span>
          </Link>
          <HeaderUserMenu />
        </div>

        {/* Greeting hero */}
        <h1 className="text-[28px] font-bold text-text leading-tight tracking-tight">
          {greet}
          {firstName ? `, ${firstName}` : ""}
        </h1>
        <p className="text-base text-muted mt-1">
          {user
            ? "Que voulez-vous commander ?"
            : "Bienvenue sur votre supermarché halal"}
        </p>

        {/* Search bar large — premium avec border doré subtle */}
        <div className="relative mt-5">
          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0F4C3A] pointer-events-none"
            aria-hidden
          />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Rechercher viandes, épices, riz..."
            aria-label="Rechercher un produit"
            className="w-full h-14 rounded-2xl bg-white border-2 border-[#D4A93C]/25 pl-12 pr-12 text-base placeholder:text-muted/65 text-text focus:outline-none focus:border-[#0F4C3A]/60 focus:ring-4 focus:ring-[#0F4C3A]/8 transition-all shadow-sm"
            inputMode="search"
            enterKeyHint="search"
          />
          {searchValue && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              aria-label="Effacer la recherche"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full hover:bg-[#FAFAF7] flex items-center justify-center text-muted active:scale-90 transition-transform"
            >
              <X size={18} aria-hidden />
            </button>
          )}
        </div>

        {/* Magasin info — discret, donne le contexte */}
        <div className="mt-4 inline-flex items-center gap-1.5 text-xs text-muted">
          <Store size={12} className="text-[#0F4C3A]" aria-hidden />
          <span>
            <span className="font-semibold text-text">Salamarket Toulouse</span>
            <span className="mx-1.5 text-muted/50">·</span>
            <span>Retrait au 8 av. Larrieu-Thibaud</span>
          </span>
        </div>

        {/* Sentinel — IntersectionObserver target pour déclencher le compact */}
        <div ref={sentinelRef} aria-hidden className="h-px" />
      </section>

      {/* COMPACT — fixed top, fade-in via IntersectionObserver */}
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 bg-[#FAFAF7]/95 backdrop-blur-md border-b border-border transition-opacity duration-200",
          showCompact
            ? "opacity-100"
            : "opacity-0 pointer-events-none",
        )}
        style={{ paddingTop: "env(safe-area-inset-top)" }}
        aria-hidden={!showCompact}
      >
        <div className="px-4 h-14 flex items-center gap-2">
          {compactSearchOpen ? (
            <>
              <button
                type="button"
                onClick={() => setCompactSearchOpen(false)}
                aria-label="Fermer la recherche"
                className="w-10 h-10 -ml-2 rounded-full hover:bg-white flex items-center justify-center text-text active:scale-90 transition-transform shrink-0"
              >
                <ArrowLeft size={20} aria-hidden />
              </button>
              <div className="relative flex-1">
                <Search
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0F4C3A] pointer-events-none"
                  aria-hidden
                />
                <input
                  autoFocus
                  type="text"
                  value={searchValue}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder="Rechercher..."
                  aria-label="Rechercher un produit"
                  className="w-full h-10 rounded-full bg-white border border-border pl-10 pr-10 text-sm placeholder:text-muted/65 text-text focus:outline-none focus:border-[#0F4C3A]/60 focus:ring-2 focus:ring-[#0F4C3A]/10 transition-all"
                  inputMode="search"
                  enterKeyHint="search"
                />
                {searchValue && (
                  <button
                    type="button"
                    onClick={() => onSearchChange("")}
                    aria-label="Effacer la recherche"
                    className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full hover:bg-bg flex items-center justify-center text-muted active:scale-90 transition-transform"
                  >
                    <X size={14} aria-hidden />
                  </button>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                to="/"
                aria-label="Salamarket Drive — accueil"
                className="inline-flex items-baseline gap-1 active:scale-95 transition-transform"
              >
                <span className="text-base font-bold text-[#0F4C3A] tracking-tight">
                  Salamarket
                </span>
                <span className="text-base font-light text-[#D4A93C] tracking-tight">
                  Drive
                </span>
              </Link>
              <div className="flex-1" />
              <button
                type="button"
                onClick={() => setCompactSearchOpen(true)}
                aria-label="Rechercher"
                className="w-10 h-10 rounded-full hover:bg-white flex items-center justify-center text-text active:scale-90 transition-transform shrink-0"
              >
                <Search size={20} aria-hidden />
              </button>
              <HeaderUserMenu />
            </>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;
