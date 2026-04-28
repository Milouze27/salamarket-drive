import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Product, ProductUnit } from "@/types/product";

export const useProduct = (id: string | undefined) => {
  return useQuery<Product | null>({
    queryKey: ["product", id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select(
          "id, name, description, price_cents, unit, category, image_url, in_stock"
        )
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      if (!data) return null;

      return {
        id: data.id,
        name: data.name,
        description: data.description,
        priceCents: data.price_cents,
        unit: data.unit as ProductUnit,
        category: data.category,
        imageUrl: data.image_url,
        inStock: data.in_stock,
      };
    },
  });
};
