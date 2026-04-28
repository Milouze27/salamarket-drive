import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Product, ProductUnit } from "@/types/product";

export const useProducts = () => {
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, description, price_cents, unit, category, image_url, in_stock")
        .order("category", { ascending: true })
        .order("name", { ascending: true });

      if (error) throw error;

      return (data ?? []).map((row) => ({
        id: row.id,
        name: row.name,
        description: row.description,
        priceCents: row.price_cents,
        unit: row.unit as ProductUnit,
        category: row.category,
        imageUrl: row.image_url,
        inStock: row.in_stock,
      }));
    },
  });
};
