import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const FullScreenLoader = () => (
  <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-bg">
    <div
      aria-hidden
      className="w-10 h-10 rounded-full border-2 border-border border-t-primary animate-spin"
    />
    <p className="text-sm text-muted">Chargement…</p>
  </div>
);

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <FullScreenLoader />;
  }

  if (!user) {
    return <Navigate to="/connexion" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
};
