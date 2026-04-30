// Edge function notify-new-order
// ─────────────────────────────────
// Déclenchée par un Database Webhook Supabase configuré sur INSERT
// public.orders. Envoie une notification Web Push à toutes les
// subscriptions des utilisateurs ayant le rôle "admin" ou "employee".
//
// Env vars requises (Lovable Cloud → Edge Functions → Secrets) :
//   - VAPID_PUBLIC_KEY
//   - VAPID_PRIVATE_KEY
//   - VAPID_SUBJECT      (ex. "mailto:contact@salamarket.fr")
//   - SUPABASE_URL
//   - SUPABASE_SERVICE_ROLE_KEY

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import webpush from "npm:web-push@3.6.7";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface OrderRecord {
  id: string;
  total_cents: number;
  status: string;
}

interface WebhookPayload {
  type?: string;
  table?: string;
  record?: OrderRecord;
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const formatEUR = (cents: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
    (cents ?? 0) / 100,
  );

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const VAPID_PUBLIC = Deno.env.get("VAPID_PUBLIC_KEY");
  const VAPID_PRIVATE = Deno.env.get("VAPID_PRIVATE_KEY");
  const VAPID_SUBJECT = Deno.env.get("VAPID_SUBJECT");

  if (!VAPID_PUBLIC || !VAPID_PRIVATE || !VAPID_SUBJECT) {
    return json({ error: "VAPID keys not configured" }, 500);
  }

  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC, VAPID_PRIVATE);

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  let payload: WebhookPayload;
  try {
    payload = await req.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  // Filtre : on ne traite que les INSERT sur orders.
  if (payload.type !== "INSERT" || payload.table !== "orders" || !payload.record) {
    return json({ skipped: true, reason: "not an orders insert" });
  }

  const order = payload.record;

  // Récupère toutes les subscriptions des admins + employees.
  const { data: targetProfiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id")
    .in("role", ["admin", "employee"]);

  if (profilesError) {
    console.error("[notify-new-order] profiles query error:", profilesError);
    return json({ error: profilesError.message }, 500);
  }

  const targetUserIds = (targetProfiles ?? []).map((p: { id: string }) => p.id);
  if (targetUserIds.length === 0) {
    return json({ sent: 0, reason: "no admin/employee profiles" });
  }

  const { data: subs, error: subsError } = await supabase
    .from("push_subscriptions")
    .select("id, user_id, endpoint, p256dh, auth")
    .in("user_id", targetUserIds);

  if (subsError) {
    console.error("[notify-new-order] subs query error:", subsError);
    return json({ error: subsError.message }, 500);
  }

  if (!subs || subs.length === 0) {
    return json({ sent: 0, reason: "no subscriptions" });
  }

  const notification = JSON.stringify({
    title: "Nouvelle commande",
    body: `Commande de ${formatEUR(order.total_cents)} reçue.`,
    url: "/admin",
    tag: `order-${order.id}`,
  });

  const results = await Promise.allSettled(
    subs.map((sub: { id: string; endpoint: string; p256dh: string; auth: string }) =>
      webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: { p256dh: sub.p256dh, auth: sub.auth },
        },
        notification,
      ),
    ),
  );

  // Nettoie les subscriptions invalides (410 Gone, 404 Not Found).
  const expired: string[] = [];
  results.forEach((res, idx) => {
    if (res.status === "rejected") {
      const err = res.reason as { statusCode?: number };
      if (err?.statusCode === 410 || err?.statusCode === 404) {
        expired.push(subs[idx].id);
      } else {
        console.error("[notify-new-order] push failed:", err);
      }
    }
  });

  if (expired.length > 0) {
    await supabase.from("push_subscriptions").delete().in("id", expired);
  }

  const sent = results.filter((r) => r.status === "fulfilled").length;
  return json({ sent, expired: expired.length, total: subs.length });
});
