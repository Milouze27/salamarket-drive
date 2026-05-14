// Shimmer custom (gradient horizontal qui défile) plutôt que le pulse
// Tailwind par défaut. Plus premium, plus proche d'un Stripe / Linear.
// Aligné sur la nouvelle ProductCard photo-led (4:5 portrait, pas de
// card frame, texte sous l'image).
const SHIMMER_BG =
  "bg-[linear-gradient(90deg,#E8E4D8_0%,#F2F2EE_50%,#E8E4D8_100%)] bg-[length:200%_100%] animate-skeleton-shimmer";

export const ProductCardSkeleton = () => (
  <div className="flex flex-col">
    <div className={`aspect-[4/5] w-full rounded-3xl ${SHIMMER_BG}`} />
    <div className="flex flex-col gap-2 px-1 pt-3">
      <div className={`h-4 w-3/4 rounded ${SHIMMER_BG}`} />
      <div className={`h-4 w-2/3 rounded ${SHIMMER_BG}`} />
      <div className={`mt-1 h-4 w-1/3 rounded ${SHIMMER_BG}`} />
    </div>
  </div>
);
