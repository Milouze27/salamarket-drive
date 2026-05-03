import { ShoppingBag, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { BRAND } from "@/config/brand";
import { useCartCount } from "@/hooks/useCartSummary";
import { useAuth } from "@/hooks/useAuth";

interface Props {
  showBack?: boolean;
  title?: string;
}

function getInitials(name?: string | null, email?: string | null) {
  const source = (name?.trim() || email?.trim() || "").trim();
  if (!source) return "?";
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return source.slice(0, 2).toUpperCase();
}

export const AppHeader = ({ showBack = false, title }: Props) => {
  const navigate = useNavigate();
  const count = useCartCount();
  const { user, profile, loading } = useAuth();

  const initials = getInitials(profile?.full_name, user?.email);

  return (
    <header
      className="sticky top-0 z-40 bg-bg/95 backdrop-blur border-b border-border"
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
              className="p-2 -ml-2 text-text"
            >
              <ArrowLeft size={22} />
            </button>
          )}
          {title ? (
            <h1 className="font-semibold text-base text-text truncate">
              {title}
            </h1>
          ) : (
            <h1 className="font-bold text-lg text-primary tracking-tight truncate">
              {BRAND.name}
            </h1>
          )}
        </div>
        <div className="flex items-center gap-1">
          {loading ? (
            <div
              aria-hidden
              className="w-9 h-9 rounded-full bg-accent/30 animate-pulse"
            />
          ) : user ? (
            <button
              onClick={() => navigate("/compte")}
              aria-label="Mon compte"
              className="w-9 h-9 rounded-full bg-accent text-primary text-xs font-bold flex items-center justify-center"
            >
              {initials}
            </button>
          ) : null}
          <button
            onClick={() => navigate("/panier")}
            aria-label="Voir le panier"
            className="relative p-2 -mr-2 text-text"
          >
            <ShoppingBag size={24} />
            {count > 0 && (
              <span className="absolute top-0 right-0 min-w-[20px] h-5 px-1 rounded-full bg-accent text-white text-xs font-bold flex items-center justify-center">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
