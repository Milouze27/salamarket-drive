import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  AlertCircle,
  Banknote,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toZonedTime } from "date-fns-tz";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useCartStore } from "@/stores/cartStore";
import { useCheckoutStore } from "@/stores/checkoutStore";

const PARIS_TZ = "Europe/Paris";

const formatEUR = (cents: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
    (cents ?? 0) / 100
  );

interface OrderItem {
  product_id: string;
  name: string;
  unit_price_cents: number;
  quantity: number;
  line_total_cents: number;
}

interface PickupSlot {
  id: string;
  slot_start: string;
  slot_end: string;
}

interface Order {
  id: string;
  status: string;
  payment_method: "online" | "in_store";
  payment_status: "paid" | "unpaid" | string;
  total_cents: number;
  items: OrderItem[];
  notes: string | null;
  pickup_slot: PickupSlot | null;
}

function formatSlotLabel(slot: PickupSlot) {
  const start = toZonedTime(new Date(slot.slot_start), PARIS_TZ);
  const end = toZonedTime(new Date(slot.slot_end), PARIS_TZ);
  const today = toZonedTime(new Date(), PARIS_TZ);
  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  let dayLabel: string;
  if (isSameDay(start, today)) dayLabel = "Aujourd'hui";
  else if (isSameDay(start, tomorrow)) dayLabel = "Demain";
  else dayLabel = format(start, "EEE d MMM", { locale: fr });

  const startTime = format(start, "HH'h'mm", { locale: fr });
  const endTime = format(end, "HH'h'mm", { locale: fr });
  return `${dayLabel} · ${startTime} - ${endTime}`;
}

const OrderConfirmation = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const clearCart = useCartStore((s) => s.clear);
  const clearSlot = useCheckoutStore((s) => s.clearSlot);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        if (!orderId) {
          setError("Identifiant de commande manquant");
          setLoading(false);
          return;
        }

        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) {
          setError("Session expirée");
          setLoading(false);
          return;
        }

        const sessionId = searchParams.get("session_id");
        const res = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/verify-checkout-session`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.access_token}`,
              apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
            },
            body: JSON.stringify({
              order_id: orderId,
              session_id: sessionId ?? null,
            }),
          }
        );

        const data = await res.json();
        if (cancelled) return;

        if (!res.ok || !data.order) {
          setError(data.error ?? "Commande introuvable");
          setLoading(false);
          return;
        }

        const fetchedOrder: Order = data.order;
        setOrder(fetchedOrder);

        if (
          fetchedOrder.payment_status === "paid" ||
          fetchedOrder.payment_method === "in_store"
        ) {
          clearCart();
          clearSlot();
        }
        setLoading(false);
      } catch (err) {
        if (cancelled) return;
        setError((err as Error).message ?? "Erreur inconnue");
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [orderId, searchParams, clearCart, clearSlot]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-background p-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">
          Vérification de votre commande...
        </p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background p-4 text-center">
        <AlertCircle className="w-16 h-16 text-destructive" />
        <h1 className="text-2xl font-semibold">Commande introuvable</h1>
        <p className="text-sm text-muted-foreground max-w-sm">
          {error ?? "Cette commande n'existe pas ou n'est pas accessible."}
        </p>
        <Button onClick={() => navigate("/")} className="mt-2">
          Retour à l'accueil
        </Button>
      </div>
    );
  }

  const orderShortId = order.id.slice(0, 8).toUpperCase();
  const items = Array.isArray(order.items) ? order.items : [];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* Header */}
        <div className="flex flex-col items-center gap-3 pt-6 pb-2">
          <CheckCircle2 className="text-primary" size={64} strokeWidth={1.5} />
          <h1 className="text-2xl font-semibold text-center">
            Merci, votre commande est confirmée !
          </h1>
        </div>

        {/* Numéro de commande */}
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm text-muted-foreground">Numéro de commande</p>
          <p className="text-lg font-mono uppercase mt-1">{orderShortId}</p>
        </div>

        {/* Créneau de retrait */}
        <div className="rounded-lg border border-primary bg-primary/5 p-4">
          <div className="flex items-start gap-3">
            <Calendar className="text-primary shrink-0 mt-0.5" size={20} />
            <div className="flex-1">
              <p className="font-medium">Retrait prévu</p>
              <p className="text-sm text-foreground mt-1">
                {order.pickup_slot
                  ? formatSlotLabel(order.pickup_slot)
                  : "Créneau à confirmer"}
              </p>
            </div>
          </div>
        </div>

        {/* Articles */}
        <div className="rounded-lg border bg-card p-4">
          <p className="font-medium mb-3">Articles</p>
          <ul className="space-y-2">
            {items.map((item, idx) => (
              <li
                key={`${item.product_id}-${idx}`}
                className="flex justify-between text-sm"
              >
                <span>
                  {item.quantity} × {item.name}
                </span>
                <span className="text-muted-foreground">
                  {formatEUR(item.line_total_cents)}
                </span>
              </li>
            ))}
          </ul>
          <Separator className="my-3" />
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>{formatEUR(order.total_cents)}</span>
          </div>
        </div>

        {/* Mode de paiement */}
        <div className="rounded-lg border bg-card p-4">
          {order.payment_method === "online" &&
            order.payment_status === "paid" && (
              <div className="flex items-start gap-3">
                <CreditCard
                  className="text-primary shrink-0 mt-0.5"
                  size={20}
                />
                <div className="flex-1 space-y-2">
                  <Badge className="bg-primary text-primary-foreground hover:bg-primary">
                    Payé en ligne
                  </Badge>
                  <p className="text-sm">
                    Vous avez payé {formatEUR(order.total_cents)} par carte.
                    Vous n'avez rien à régler au retrait.
                  </p>
                </div>
              </div>
            )}

          {order.payment_method === "in_store" && (
            <div className="flex items-start gap-3">
              <Banknote className="text-primary shrink-0 mt-0.5" size={20} />
              <div className="flex-1 space-y-2">
                <Badge className="bg-orange-500 text-white hover:bg-orange-500">
                  À régler au retrait
                </Badge>
                <p className="font-semibold">
                  À régler au retrait : {formatEUR(order.total_cents)}
                </p>
                <p className="text-sm text-muted-foreground">
                  Espèces ou carte bancaire acceptés
                </p>
              </div>
            </div>
          )}

          {order.payment_method === "online" &&
            order.payment_status === "unpaid" && (
              <div className="flex items-start gap-3">
                <Clock className="text-muted-foreground shrink-0 mt-0.5" size={20} />
                <div className="flex-1 space-y-2">
                  <Badge variant="secondary">En cours de validation</Badge>
                  <p className="text-sm">
                    Votre paiement est en cours de validation. Vous recevrez
                    une confirmation par email.
                  </p>
                </div>
              </div>
            )}
        </div>

        {/* Infos retrait */}
        <div className="text-sm text-muted-foreground p-4 space-y-1">
          <p>📍 Retrait à Salamarket Larrieu-Thibaud</p>
          <p>Présentez votre numéro de commande à l'arrivée</p>
          {order.notes && (
            <p className="pt-2">
              Note transmise au préparateur : {order.notes}
            </p>
          )}
        </div>

        {/* Boutons */}
        <div className="space-y-2 pt-2 pb-8">
          <Button
            className="w-full"
            onClick={() => navigate("/commandes")}
          >
            Mes commandes
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate("/")}
          >
            Retour à l'accueil
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
