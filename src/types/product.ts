export type ProductUnit = "kg" | "piece" | "pack";

export interface Product {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  unit: ProductUnit;
  category: string;
  imageUrl: string;
  inStock: boolean;
}
