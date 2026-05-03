// Shimmer custom (gradient horizontal qui défile) plutôt que le pulse
// Tailwind par défaut. Plus premium, plus proche d'un Stripe / Linear.
const SHIMMER_BG =
  "bg-[linear-gradient(90deg,#E5E5E0_0%,#F2F2EE_50%,#E5E5E0_100%)] bg-[length:200%_100%] animate-skeleton-shimmer";

export const ProductCardSkeleton = () => (
  <div className="flex flex-col bg-white rounded-2xl border border-border overflow-hidden">
    <div className={`aspect-square w-full ${SHIMMER_BG}`} />
    <div className="flex flex-col p-3 gap-2">
      <div className={`h-4 w-3/4 rounded ${SHIMMER_BG}`} />
      <div className={`h-3 w-1/3 rounded ${SHIMMER_BG}`} />
      <div className="flex items-end justify-between mt-2">
        <div className={`h-5 w-16 rounded ${SHIMMER_BG}`} />
        <div className={`w-10 h-10 rounded-full ${SHIMMER_BG}`} />
      </div>
    </div>
  </div>
);
