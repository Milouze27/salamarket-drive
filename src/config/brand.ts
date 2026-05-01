export const BRAND = {
  name: "Salamarket Drive",
  tagline: "Votre supermarché halal en click & collect",
  store: {
    name: "Salamarket Toulouse",
    city: "Toulouse",
    pickupOnly: true,
  },
  colors: {
    primary: "#0F4C3A",
    accent: "#D4A574",
    bg: "#FAFAF7",
    text: "#1A1A1A",
    muted: "#6B6B6B",
    border: "#E5E5E0",
  },
  font: "Manrope",
  categories: [
    { slug: "boucherie", name: "Boucherie", emoji: "🥩" },
    { slug: "charcuterie", name: "Charcuterie", emoji: "🌭" },
    { slug: "epicerie", name: "Épicerie", emoji: "🫙" },
    { slug: "frais", name: "Frais", emoji: "🧀" },
    { slug: "surgele", name: "Surgelé", emoji: "🧊" },
    { slug: "fruits-legumes", name: "Fruits & Légumes", emoji: "🥬" },
    { slug: "boissons", name: "Boissons", emoji: "🥤" },
    { slug: "bazar", name: "Bazar", emoji: "🧴" },
  ],
} as const;

export type Category = (typeof BRAND.categories)[number];

// Affiche "Salamarket Toulouse" plutôt que "Salamarket Toulouse · Toulouse"
// quand le nom du magasin contient déjà la ville.
export const formatStoreLocation = (store: {
  name: string;
  city: string;
}): string => {
  const nameContainsCity = store.name
    .toLowerCase()
    .includes(store.city.toLowerCase());
  return nameContainsCity ? store.name : `${store.name} · ${store.city}`;
};
