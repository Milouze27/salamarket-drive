import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import Stripe from "https://esm.sh/stripe@18?target=denonext";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
    apiVersion: "2024-11-20.acacia",
    httpClient: Stripe.createFetchHttpClient(),
  });

  try {
    const { order_id, session_id } = await req.json();
    if (!order_id) return json({ error: "order_id requis" }, 400);

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return json({ error: "Missing auth" }, 401);

    const supabaseAuth = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );
    const { data: { user } } = await supabaseAuth.auth.getUser();
    if (!user) return json({ error: "Unauthorized" }, 401);

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .select("*, pickup_slot:pickup_slots(id, slot_start, slot_end)")
      .eq("id", order_id)
      .eq("user_id", user.id)
      .single();
    if (error || !order) return json({ error: "Commande introuvable" }, 404);

    // Déjà payée OU paiement magasin
    if (order.payment_status === "paid" || order.payment_method === "in_store") {
      return json({ order });
    }

    // Paiement en ligne, encore unpaid → on vérifie auprès de Stripe
    if (session_id && order.stripe_session_id === session_id) {
      const session = await stripe.checkout.sessions.retrieve(session_id);

      if (session.payment_status === "paid") {
        const { data: updated } = await supabaseAdmin
          .from("orders")
          .update({
            payment_status: "paid",
            status: "confirmed",
            stripe_payment_intent_id: session.payment_intent as string,
          })
          .eq("id", order_id)
          .select("*, pickup_slot:pickup_slots(id, slot_start, slot_end)")
          .single();
        return json({ order: updated });
      }
    }

    return json({ order });
  } catch (err) {
    console.error("[verify-checkout-session]", err);
    return json({ error: (err as Error).message }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
