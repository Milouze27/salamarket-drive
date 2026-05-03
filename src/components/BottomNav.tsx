import { NavLink, useLocation } from "react-router-dom";
import { Home, Receipt, ShoppingCart, User } from "lucide-react";
import { useCartCount } from "@/hooks/useCartSummary";
import { cn } from "@/lib/utils";

// Routes où le bottom nav N'apparaît PAS :
// - flow checkout (panier, créneaux, paiement, confirmation) — convention
//   Apple HIG / Material : on retire la nav globale pendant un checkout
//   pour focus le user. Ça évite aussi le conflit de z-index avec les
//   CTAs fixed bottom de ces pages.
// - auth (connexion, inscription)
// - dashboards opérationnels (admin, employe)
const HIDDEN_PREFIXES = [
  "/connexion",
  "/inscription",
  "/panier",
  "/creneaux",
  "/paiement",
  "/commande/confirmee",
  "/admin",
  "/employe",
];

const NAV_ITEMS = [
  { to: "/", label: "Accueil", icon: Home, exact: true },
  { to: "/panier", label: "Panier", icon: ShoppingCart, exact: false },
  { to: "/commandes", label: "Commandes", icon: Receipt, exact: false },
  { to: "/compte", label: "Compte", icon: User, exact: false },
] as const;

export const BottomNav = () => {
  const location = useLocation();
  const cartCount = useCartCount();

  const isHidden = HIDDEN_PREFIXES.some((prefix) =>
    location.pathname.startsWith(prefix),
  );
  if (isHidden) return null;

  return (
    <nav
      aria-label="Navigation principale"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-border md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="grid grid-cols-4">
        {NAV_ITEMS.map(({ to, label, icon: Icon, exact }) => {
          const showBadge = to === "/panier" && cartCount > 0;
          return (
            <li key={to}>
              <NavLink
                to={to}
                end={exact}
                className={({ isActive }) =>
                  cn(
                    "relative flex flex-col items-center justify-center gap-0.5 min-h-[56px] py-1.5 transition-colors",
                    isActive
                      ? "text-[#0F4C3A]"
                      : "text-muted hover:text-[#0F4C3A]",
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <span className="relative">
                      <Icon
                        size={22}
                        strokeWidth={isActive ? 2.5 : 2}
                        aria-hidden
                      />
                      {showBadge && (
                        <span className="absolute -top-1.5 -right-2 bg-[#D4A93C] text-[#0F4C3A] text-[10px] font-bold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center border-2 border-white">
                          {cartCount > 9 ? "9+" : cartCount}
                        </span>
                      )}
                    </span>
                    <span
                      className={cn(
                        "text-[11px] leading-none",
                        isActive ? "font-semibold" : "font-medium",
                      )}
                    >
                      {label}
                    </span>
                    {/* Indicateur top sapin sur l'item actif */}
                    {isActive && (
                      <span
                        aria-hidden
                        className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-8 rounded-full bg-[#D4A93C]"
                      />
                    )}
                  </>
                )}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
