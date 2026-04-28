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

const img = (name: string) =>
  `https://placehold.co/400x400/0F4C3A/D4A574/png?text=${encodeURIComponent(name)}`;

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Entrecôte de bœuf halal",
    description: "Entrecôte tendre, certifiée halal, élevage français.",
    priceCents: 1890,
    unit: "kg",
    category: "boucherie",
    imageUrl: img("Entrecôte"),
    inStock: true,
  },
  {
    id: "p2",
    name: "Escalope de poulet fermier",
    description: "Filet de poulet fermier label rouge, halal.",
    priceCents: 1290,
    unit: "kg",
    category: "boucherie",
    imageUrl: img("Poulet"),
    inStock: true,
  },
  {
    id: "p3",
    name: "Cacher dinde fumée",
    description: "Tranches fines de dinde fumée halal.",
    priceCents: 399,
    unit: "pack",
    category: "charcuterie",
    imageUrl: img("Dinde+fumée"),
    inStock: true,
  },
  {
    id: "p4",
    name: "Merguez artisanales",
    description: "Merguez maison épicées, halal.",
    priceCents: 1450,
    unit: "kg",
    category: "charcuterie",
    imageUrl: img("Merguez"),
    inStock: true,
  },
  {
    id: "p5",
    name: "Riz Basmati 5kg",
    description: "Riz basmati premium, grain long.",
    priceCents: 1290,
    unit: "pack",
    category: "epicerie",
    imageUrl: img("Riz+Basmati"),
    inStock: true,
  },
  {
    id: "p6",
    name: "Huile d'olive vierge extra 1L",
    description: "Huile d'olive vierge extra, première pression à froid.",
    priceCents: 890,
    unit: "piece",
    category: "epicerie",
    imageUrl: img("Huile+olive"),
    inStock: true,
  },
  {
    id: "p7",
    name: "Yaourt nature x8",
    description: "Pack de 8 yaourts nature au lait entier.",
    priceCents: 299,
    unit: "pack",
    category: "frais",
    imageUrl: img("Yaourts"),
    inStock: true,
  },
  {
    id: "p8",
    name: "Nuggets de poulet halal",
    description: "Nuggets surgelés, poulet 100% halal.",
    priceCents: 599,
    unit: "pack",
    category: "surgele",
    imageUrl: img("Nuggets"),
    inStock: true,
  },
  {
    id: "p9",
    name: "Tomates grappe",
    description: "Tomates grappe origine France.",
    priceCents: 349,
    unit: "kg",
    category: "fruits-legumes",
    imageUrl: img("Tomates"),
    inStock: true,
  },
  {
    id: "p10",
    name: "Bananes équitables",
    description: "Bananes du commerce équitable.",
    priceCents: 219,
    unit: "kg",
    category: "fruits-legumes",
    imageUrl: img("Bananes"),
    inStock: true,
  },
  {
    id: "p11",
    name: "Jus de pomme artisanal 1L",
    description: "Jus de pomme pressé, sans sucre ajouté.",
    priceCents: 349,
    unit: "piece",
    category: "boissons",
    imageUrl: img("Jus+pomme"),
    inStock: true,
  },
  {
    id: "p12",
    name: "Liquide vaisselle écologique",
    description: "Liquide vaisselle écolabel, 750ml.",
    priceCents: 399,
    unit: "piece",
    category: "bazar",
    imageUrl: img("Liquide+vaisselle"),
    inStock: true,
  },
];
