import type { ProductUnit } from "@/data/mockProducts";

export const formatPrice = (cents: number) =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);

export const unitLabel = (unit: ProductUnit) => {
  switch (unit) {
    case "kg":
      return "au kg";
    case "piece":
      return "à la pièce";
    case "pack":
      return "le pack";
  }
};
