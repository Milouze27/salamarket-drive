import { cn } from "@/lib/utils";

interface Props {
  size?: "sm" | "lg";
  className?: string;
}

// Logo horizontal officiel Salamarket Drive (version "light" : tout doré
// sur fond transparent). Conçu pour s'afficher sur fond sombre — utilisé
// dans le header bg sapin. La hauteur définit la taille (le ratio largeur
// est intrinsèque à l'image, pas de bg parasite).
export const BrandLogo = ({ size = "lg", className }: Props) => {
  const heightClass = size === "lg" ? "h-9" : "h-7";

  return (
    <span
      className={cn(
        "inline-block active:scale-95 transition-transform",
        className,
      )}
    >
      <img
        src="/brand/logo-horizontal-light.png"
        alt="Salamarket Drive"
        className={cn(heightClass, "w-auto")}
        // Hint largeur intrinsèque pour CLS — le PNG fait ~1024×320 (ratio 3.2).
        width={size === "lg" ? 115 : 90}
        height={size === "lg" ? 36 : 28}
      />
    </span>
  );
};
