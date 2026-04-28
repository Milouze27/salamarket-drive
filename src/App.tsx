import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/providers/AuthProvider";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Index from "./pages/Index.tsx";
import ProductDetail from "./pages/ProductDetail.tsx";
import Cart from "./pages/Cart.tsx";
import Slots from "./pages/Slots.tsx";
import Checkout from "./pages/Checkout.tsx";
import Login from "./pages/Login.tsx";
import Signup from "./pages/Signup.tsx";
import Account from "./pages/Account.tsx";
import Orders from "./pages/Orders.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ErrorBoundary>
        <BrowserRouter>
          <AuthProvider>
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
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </ErrorBoundary>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
