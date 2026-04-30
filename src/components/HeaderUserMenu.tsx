import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { LayoutDashboard, LogOut, Package, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

type Role = "admin" | "employee" | "client";

const fetchRole = async (userId: string): Promise<Role | null> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();
  if (error) throw error;
  return (data as { role?: Role } | null)?.role ?? null;
};

const getInitials = (name?: string | null, email?: string | null): string => {
  const source = (name?.trim() || email?.trim() || "").trim();
  if (!source) return "?";
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return source.slice(0, 2).toUpperCase();
};

export const HeaderUserMenu = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const { data: role } = useQuery({
    queryKey: ["user-role", user?.id],
    queryFn: () => fetchRole(user!.id),
    enabled: !!user?.id,
    staleTime: 5 * 60_000,
  });

  if (!user) {
    return (
      <Link
        to="/connexion"
        aria-label="Se connecter"
        className="w-10 h-10 rounded-full hover:bg-white/10 flex items-center justify-center text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/30"
      >
        <User size={22} />
      </Link>
    );
  }

  const initials = getInitials(profile?.full_name, user.email);

  const handleSignOut = async () => {
    await signOut();
    navigate("/", { replace: true });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Mon compte"
          className="h-10 w-10 rounded-full bg-[#D4A93C] text-[#0F4C3A] text-sm font-bold flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white/30"
        >
          {initials}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <p className="text-sm text-gray-700 truncate">{user.email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate("/compte")} className="cursor-pointer">
          <User className="mr-2 h-4 w-4" />
          Mon compte
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate("/commandes")} className="cursor-pointer">
          <Package className="mr-2 h-4 w-4" />
          Mes commandes
        </DropdownMenuItem>
        {role === "admin" && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/admin")} className="cursor-pointer">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Tableau de bord admin
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleSignOut}
          className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Se déconnecter
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default HeaderUserMenu;
