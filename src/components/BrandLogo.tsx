import { cn } from "@/lib/utils";

interface Props {
  size?: "sm" | "lg";
  withWordmark?: boolean;
  className?: string;
}

// Logo de marque qui combine l'icône PWA officielle (carré sapin avec arche+M
// doré) + wordmark texte "Salamarket Drive". Évite l'utilisation de
// /brand/logo-horizontal.png qui a un fond blanc opaque (visible comme un
// carré blanc sur les bg crème). 100% transparent et adaptable.
export const BrandLogo = ({
  size = "lg",
  withWordmark = true,
  className,
}: Props) => {
  const iconClass = size === "lg" ? "h-9 w-9" : "h-7 w-7";
  const wordmarkClass =
    size === "lg"
      ? "text-base font-bold tracking-tight"
      : "text-sm font-bold tracking-tight";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 active:scale-95 transition-transform",
        className,
      )}
    >
      <img
        src="/icons/icon-180.png"
        alt=""
        aria-hidden
        width={size === "lg" ? 36 : 28}
        height={size === "lg" ? 36 : 28}
        className={cn(iconClass, "rounded-xl shrink-0 shadow-sm")}
      />
      {withWordmark && (
        <span className="inline-flex items-baseline gap-1">
          <span className={cn(wordmarkClass, "text-[#0F4C3A]")}>
            Salamarket
          </span>
          <span className={cn(wordmarkClass, "font-light text-[#D4A93C]")}>
            Drive
          </span>
        </span>
      )}
    </span>
  );
};
