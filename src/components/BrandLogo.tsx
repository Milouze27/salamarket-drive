import { cn } from "@/lib/utils";

interface Props {
  size?: "sm" | "lg";
  className?: string;
}

// Logo horizontal officiel Salamarket Drive (mis à jour par l'utilisateur).
// Couleurs : sapin + doré. Conçu pour s'afficher sur fond clair (le fond
// du PNG se fond avec le bg crème #FAFAF7 du header).
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
        src="/brand/logo-horizontal.png?v=2"
        alt="Salamarket Drive"
        className={cn(heightClass, "w-auto")}
        width={size === "lg" ? 130 : 100}
        height={size === "lg" ? 36 : 28}
      />
    </span>
  );
};
