export const ProductCardSkeleton = () => (
  <div className="flex flex-col bg-white rounded-2xl border border-border overflow-hidden animate-pulse">
    <div className="aspect-square w-full bg-border/60" />
    <div className="flex flex-col p-3 gap-2">
      <div className="h-4 w-3/4 bg-border/60 rounded" />
      <div className="h-3 w-1/3 bg-border/40 rounded" />
      <div className="flex items-end justify-between mt-2">
        <div className="h-5 w-16 bg-border/60 rounded" />
        <div className="w-10 h-10 rounded-full bg-border/60" />
      </div>
    </div>
  </div>
);
