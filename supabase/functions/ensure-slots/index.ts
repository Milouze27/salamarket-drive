// Edge function "ensure-slots"
// Génère de manière idempotente les créneaux de retrait pour J+0 à J+6
// en se basant sur le fuseau Europe/Paris.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { fromZonedTime, toZonedTime, format } from "https://esm.sh/date-fns-tz@3.2.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

const TZ = "Europe/Paris";
const CAPACITY = 5;

// Créneaux théoriques (heures de début / fin en HH:mm Paris)
const WEEKDAY_SLOTS: Array<[string, string]> = [
  ["10:00", "10:30"],
  ["12:00", "12:30"],
  ["17:00", "17:30"],
  ["19:00", "19:30"],
];

// Le dimanche : on ferme à 18h, donc pas de créneau 19h
const SUNDAY_SLOTS: Array<[string, string]> = [
  ["10:00", "10:30"],
  ["12:00", "12:30"],
  ["17:00", "17:30"],
];

function buildSlotForDay(parisDay: Date, hhmm: string): Date {
  const [h, m] = hhmm.split(":").map(Number);
  const y = format(parisDay, "yyyy", { timeZone: TZ });
  const mo = format(parisDay, "MM", { timeZone: TZ });
  const d = format(parisDay, "dd", { timeZone: TZ });
  const local = `${y}-${mo}-${d}T${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00`;
  // fromZonedTime : interprète "local" comme étant à Paris, retourne l'instant UTC
  return fromZonedTime(local, TZ);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const nowUtc = new Date();
    const nowParis = toZonedTime(nowUtc, TZ);

    const rows: Array<{
      slot_start: string;
      slot_end: string;
      capacity: number;
    }> = [];

    for (let offset = 0; offset <= 6; offset++) {
      // jour Paris = nowParis + offset jours, normalisé à minuit Paris
      const dayParis = new Date(nowParis);
      dayParis.setDate(dayParis.getDate() + offset);
      // dimanche = 0 en local Paris
      const weekdayParis = Number(
        format(fromZonedTime(format(dayParis, "yyyy-MM-dd'T'00:00:00", { timeZone: TZ }), TZ), "i", { timeZone: TZ }),
      );
      // 'i' = ISO day-of-week 1..7 (lundi=1, dimanche=7)
      const isSunday = weekdayParis === 7;
      const list = isSunday ? SUNDAY_SLOTS : WEEKDAY_SLOTS;

      for (const [start, end] of list) {
        const startUtc = buildSlotForDay(dayParis, start);
        const endUtc = buildSlotForDay(dayParis, end);
        rows.push({
          slot_start: startUtc.toISOString(),
          slot_end: endUtc.toISOString(),
          capacity: CAPACITY,
        });
      }
    }

    // Insert ON CONFLICT DO NOTHING via upsert ignoreDuplicates
    const { error: insertErr } = await supabase
      .from("pickup_slots")
      .upsert(rows, { onConflict: "slot_start", ignoreDuplicates: true });

    if (insertErr) throw insertErr;

    // Renvoie tous les créneaux des 7 prochains jours
    const sevenDaysLater = new Date(nowUtc.getTime() + 7 * 24 * 60 * 60 * 1000);
    const { data, error: selErr } = await supabase
      .from("pickup_slots")
      .select("*")
      .gte("slot_start", nowUtc.toISOString())
      .lt("slot_start", sevenDaysLater.toISOString())
      .order("slot_start", { ascending: true });

    if (selErr) throw selErr;

    return new Response(JSON.stringify({ slots: data ?? [] }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return new Response(JSON.stringify({ error: msg }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
