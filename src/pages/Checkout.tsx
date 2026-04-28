import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Clock, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toZonedTime } from "date-fns-tz";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCartStore } from "@/stores/cartStore";
import { useCheckoutStore } from "@/stores/checkoutStore";
import { supabase } from "@/integrations/supabase/client";

const PARIS_TZ = "Europe/Paris";
const NOTES_MAX = 200;

const formatEUR = (cents: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
    cents / 100
  );

interface SlotInfo {
  id: string;
  slot_start: string;
  slot_end: string;
}

function formatSlotLabel(slot: SlotInfo) {
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

export default function Checkout() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const items = useCartStore((s) => s.items);
  const totalCents = useCartStore((s) => s.getTotalCents());
  const clearCart = useCartStore((s) => s.clear);
  const selectedSlotId = useCheckoutStore((s) => s.selectedSlotId);

  const [paymentMethod, setPaymentMethod] = useState<"online" | "in_store">(
    "online"
  );
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [slot, setSlot] = useState<SlotInfo | null>(null);

  // Garde 1 : panier vide → /panier
  useEffect(() => {
    if (items.length === 0) {
      navigate("/panier", { replace: true });
    }
  }, [items.length, navigate]);

  // Garde 2 : pas de créneau → /creneaux
  useEffect(() => {
    if (items.length > 0 && !selectedSlotId) {
      navigate("/creneaux", { replace: true });
    }
  }, [selectedSlotId, items.length, navigate]);

  // Toast cancelled
  useEffect(() => {
    if (searchParams.get("cancelled") === "1") {
      toast.info(
        "Paiement annulé. Vous pouvez réessayer ou choisir un autre mode de paiement."
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Charge les infos du créneau choisi
  useEffect(() => {
    if (!selectedSlotId) return;
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("pickup_slots")
        .select("id, slot_start, slot_end")
        .eq("id", selectedSlotId)
        .maybeSingle();
      if (cancelled) return;
      if (error || !data) {
        toast.error("Créneau introuvable, merci d'en choisir un autre");
        navigate("/creneaux", { replace: true });
        return;
      }
      setSlot(data as SlotInfo);
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedSlotId, navigate]);

  const totalLabel = useMemo(() => formatEUR(totalCents), [totalCents]);

  const handleSubmit = async () => {
    if (!selectedSlotId) return;
    setLoading(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Session expirée, merci de vous reconnecter");
        navigate("/connexion", { replace: true });
        return;
      }

      const payload = {
        items: items.map((i) => ({
          product_id: i.product.id,
          quantity: i.quantity,
        })),
        pickup_slot_id: selectedSlotId,
        payment_method: paymentMethod,
        notes: notes.trim() || undefined,
      };

      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout-session`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 409) {
          toast.error(data.error ?? "Créneau complet", {
            action: {
              label: "Choisir un autre créneau",
              onClick: () => navigate("/creneaux"),
            },
          });
        } else {
          toast.error(data.error ?? "Erreur lors de la commande");
        }
        setLoading(false);
        return;
      }

      if (data.checkout_url) {
        window.location.href = data.checkout_url;
        return;
      }
      if (data.redirect_url) {
        clearCart();
        navigate(data.redirect_url);
        return;
      }

      toast.error("Réponse serveur inattendue");
      setLoading(false);
    } catch (err) {
      console.error("[checkout]", err);
      toast.error("Erreur réseau, merci de réessayer");
      setLoading(false);
    }
  };

  if (items.length === 0 || !selectedSlotId) return null;

  const buttonLabel =
    paymentMethod === "online"
      ? `Payer ${totalLabel} en ligne`
      : `Confirmer la commande (${totalLabel})`;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header sticky */}
      <header className="sticky top-0 z-10 flex items-center gap-3 border-b bg-background px-4 py-3">
        <button
          onClick={() => navigate("/creneaux")}
          aria-label="Retour"
          className="rounded-full p-1 hover:bg-muted"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-semibold">Paiement</h1>
      </header>

      <div className="space-y-4 p-4">
        {/* Récapitulatif */}
        <section className="rounded-lg bg-card p-4 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-muted-foreground">
            Récapitulatif de commande
          </h2>
          <ul className="space-y-2">
            {items.map((item) => (
              <li
                key={item.product.id}
                className="flex items-start justify-between gap-3 text-sm"
              >
                <span className="flex-1">
                  {item.quantity} × {item.product.name}
                </span>
                <span className="font-medium tabular-nums">
                  {formatEUR(item.product.priceCents * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex items-center justify-between border-t pt-3">
            <span className="text-lg font-semibold">Total</span>
            <span className="text-lg font-semibold tabular-nums">
              {totalLabel}
            </span>
          </div>
        </section>

        {/* Créneau */}
        <section className="rounded-lg bg-card p-4 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-muted-foreground">
            Créneau de retrait
          </h2>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">
                {slot ? formatSlotLabel(slot) : "Chargement…"}
              </span>
            </div>
            <button
              onClick={() => navigate("/creneaux")}
              className="text-sm font-medium text-primary hover:underline"
            >
              Modifier
            </button>
          </div>
        </section>

        {/* Mode de paiement */}
        <section className="rounded-lg bg-card p-4 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-muted-foreground">
            Mode de paiement
          </h2>
          <RadioGroup
            value={paymentMethod}
            onValueChange={(v) => setPaymentMethod(v as "online" | "in_store")}
            className="space-y-3"
          >
            <label
              htmlFor="pm-online"
              className="flex cursor-pointer items-start gap-3 rounded-md border p-3 transition-colors hover:bg-muted/50"
            >
              <RadioGroupItem value="online" id="pm-online" className="mt-1" />
              <div className="flex-1">
                <div className="text-base font-medium">
                  Payer en ligne par carte
                </div>
                <div className="text-xs text-muted-foreground">
                  Paiement sécurisé via Stripe (mode TEST)
                </div>
              </div>
            </label>

            <label
              htmlFor="pm-instore"
              className="flex cursor-pointer items-start gap-3 rounded-md border p-3 transition-colors hover:bg-muted/50"
            >
              <RadioGroupItem
                value="in_store"
                id="pm-instore"
                className="mt-1"
              />
              <div className="flex-1">
                <div className="text-base font-medium">
                  Payer au retrait en magasin
                </div>
                <div className="text-xs text-muted-foreground">
                  Espèces ou carte bancaire au retrait
                </div>
              </div>
            </label>
          </RadioGroup>
        </section>

        {/* Notes */}
        <section className="rounded-lg bg-card p-4 shadow-sm">
          <Label
            htmlFor="notes"
            className="mb-2 block text-sm font-semibold text-muted-foreground"
          >
            Note pour le préparateur (optionnel)
          </Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value.slice(0, NOTES_MAX))}
            maxLength={NOTES_MAX}
            placeholder="Ex : bananes pas trop mûres, merci !"
            rows={3}
            className="resize-none"
          />
          <p className="mt-1 text-right text-xs text-muted-foreground">
            {notes.length}/{NOTES_MAX}
          </p>
        </section>
      </div>

      {/* Bouton sticky bas */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-background p-4">
        <Button
          onClick={handleSubmit}
          disabled={loading || !slot}
          size="lg"
          className="w-full"
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {buttonLabel}
        </Button>
      </div>
    </div>
  );
}
