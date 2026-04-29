import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, CreditCard, ShoppingBag, type LucideIcon } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Slide = {
  Icon: LucideIcon;
  title: string;
  subtitle: string;
};

const SLIDES: Slide[] = [
  {
    Icon: ShoppingBag,
    title: "Catalogue halal certifié",
    subtitle: "Découvrez nos produits frais sélectionnés",
  },
  {
    Icon: Clock,
    title: "Choisissez votre créneau",
    subtitle: "Retirez à l'horaire qui vous convient",
  },
  {
    Icon: CreditCard,
    title: "Paiement flexible",
    subtitle: "En ligne ou au retrait, c'est vous qui choisissez",
  },
];

export const OnboardingFlow = () => {
  const navigate = useNavigate();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    const handleSelect = () => setCurrent(api.selectedScrollSnap());
    api.on("select", handleSelect);
    return () => {
      api.off("select", handleSelect);
    };
  }, [api]);

  const handleComplete = () => {
    try {
      localStorage.setItem("onboarding_completed", "true");
    } catch {
      // ignore
    }
    window.dispatchEvent(new CustomEvent("onboarding:completed"));
    navigate("/", { replace: true });
  };

  const isLastSlide = current === SLIDES.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      {!isLastSlide && (
        <button
          type="button"
          onClick={handleComplete}
          className="absolute right-4 top-4 z-10 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          Passer
        </button>
      )}

      <Carousel
        setApi={setApi}
        opts={{ loop: false }}
        className="flex flex-1 flex-col"
      >
        <CarouselContent className="flex-1">
          {SLIDES.map(({ Icon, title, subtitle }, index) => (
            <CarouselItem
              key={index}
              className="flex h-full flex-col items-center justify-center px-6 text-center"
            >
              <div className="flex flex-col items-center gap-6">
                <Icon className="text-primary" size={80} strokeWidth={1.5} />
                <h2 className="text-2xl font-bold">{title}</h2>
                <p className="max-w-xs text-base text-muted-foreground">
                  {subtitle}
                </p>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div className="flex flex-col items-center gap-6 px-6 pb-10">
        <div className="flex items-center gap-2">
          {SLIDES.map((_, index) => (
            <span
              key={index}
              className={cn(
                "h-2 rounded-full transition-all",
                index === current ? "w-6 bg-primary" : "w-2 bg-muted",
              )}
            />
          ))}
        </div>
        {isLastSlide && (
          <Button onClick={handleComplete} className="w-full" size="lg">
            Découvrir le catalogue
          </Button>
        )}
      </div>
    </div>
  );
};

export default OnboardingFlow;
