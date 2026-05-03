import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface UserOrderItem {
  product_id: string;
  name: string;
  unit_price_cents: number;
  quantity: number;
  line_total_cents: number;
}

export interface UserOrderSlot {
  slot_start: string;
  slot_end: string;
}

export interface UserOrder {
  id: string;
  status: string;
  payment_method: "online" | "in_store";
  payment_status: string;
  total_cents: number;
  items: UserOrderItem[];
  created_at: string;
  pickup_slot: UserOrderSlot | null;
}

const fetchUserOrders = async (userId: string): Promise<UserOrder[]> => {
  const { data, error } = await supabase
    .from("orders")
    .select(
      "id, status, payment_method, payment_status, total_cents, items, created_at, pickup_slot:pickup_slots(slot_start, slot_end)",
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) throw error;
  return (data ?? []) as unknown as UserOrder[];
};

export const useUserOrders = (userId: string | undefined) =>
  useQuery({
    queryKey: ["user-orders", userId],
    queryFn: () => fetchUserOrders(userId!),
    enabled: !!userId,
    staleTime: 30 * 1000,
  });
