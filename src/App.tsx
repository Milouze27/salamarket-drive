import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/providers/AuthProvider";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { RoleProtectedRoute } from "@/components/RoleProtectedRoute";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { InstallPrompt } from "@/components/InstallPrompt";
import { OnboardingGate } from "@/components/OnboardingGate";
import { BottomNav } from "@/components/BottomNav";
import { StickyCartCTA } from "@/components/StickyCartCTA";

// Routes critiques (chemin chaud client) — chargées eager pour pas
// pénaliser le 1st paint sur l'écran d'accueil et le flow de commande.
import Index from "./pages/Index.tsx";
import ProductDetail from "./pages/ProductDetail.tsx";
import Cart from "./pages/Cart.tsx";
import NotFound from "./pages/NotFound.tsx";

// Routes secondaires — lazy load. Évite ~400-500 KB sur le bundle initial.
// Le user qui arrive sur la home n'a pas besoin du JS de l'admin / Stripe /
// auth tant qu'il n'y va pas.
const Slots = lazy(() => import("./pages/Slots.tsx"));
const Checkout = lazy(() => import("./pages/Checkout.tsx"));
const OrderConfirmation = lazy(() => import("./pages/OrderConfirmation.tsx"));
const Login = lazy(() => import("./pages/Login.tsx"));
const Signup = lazy(() => import("./pages/Signup.tsx"));
const Account = lazy(() => import("./pages/Account.tsx"));
const Orders = lazy(() => import("./pages/Orders.tsx"));
const Admin = lazy(() => import("./pages/Admin.tsx"));
const AdminSettings = lazy(() => import("./pages/AdminSettings.tsx"));
const EmployeeKanban = lazy(() => import("./pages/EmployeeKanban.tsx"));

const queryClient = new QueryClient();

const RouteFallback = () => (
  <div className="min-h-dvh bg-[#FAFAF7] flex items-center justify-center">
    <Loader2
      className="h-8 w-8 text-[#0F4C3A] animate-spin"
      aria-label="Chargement"
    />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ErrorBoundary>
        <BrowserRouter>
          <AuthProvider>
            <OnboardingGate />
            <InstallPrompt />
            <Suspense fallback={<RouteFallback />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/produit/:id" element={<ProductDetail />} />
                <Route path="/panier" element={<Cart />} />
                <Route path="/creneaux" element={<Slots />} />
                <Route
                  path="/paiement"
                  element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/commande/confirmee/:orderId"
                  element={
                    <ProtectedRoute>
                      <OrderConfirmation />
                    </ProtectedRoute>
                  }
                />
                <Route path="/connexion" element={<Login />} />
                <Route path="/inscription" element={<Signup />} />
                <Route
                  path="/compte"
                  element={
                    <ProtectedRoute>
                      <Account />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/commandes"
                  element={
                    <ProtectedRoute>
                      <Orders />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <RoleProtectedRoute requiredRole="admin">
                      <Admin />
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/admin/reglages"
                  element={
                    <RoleProtectedRoute requiredRole="admin">
                      <AdminSettings />
                    </RoleProtectedRoute>
                  }
                />
                <Route
                  path="/employe"
                  element={
                    <RoleProtectedRoute requiredRoles={["admin", "employee"]}>
                      <EmployeeKanban />
                    </RoleProtectedRoute>
                  }
                />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
            <StickyCartCTA />
            <BottomNav />
          </AuthProvider>
        </BrowserRouter>
      </ErrorBoundary>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
