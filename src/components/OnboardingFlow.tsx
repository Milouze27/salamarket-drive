import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, CreditCard, ShoppingBag, type LucideIcon } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

type Slide = {
  Icon: LucideIcon;
  title: string;
  subtitle: string;
};

const SLIDES: Slide[] = [
  {
    Icon: ShoppingBag,
    title: "Vos produits halal de confiance",
    subtitle: "Sélectionnés avec soin par votre épicerie de quartier",
  },
  {
    Icon: Clock,
    title: "Récupérez à votre rythme",
    subtitle: "Choisissez le créneau qui s'adapte à votre journée",
  },
  {
    Icon: CreditCard,
    title: "Votre commerce, simplifié",
    subtitle: "Tout votre marché halal, sans bouger de chez vous",
  },
];

export const OnboardingFlow = () => {
  const navigate = useNavigate();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  // Slides déjà arrivés en position active dans cette session.
  // Ref (pas state) pour ne pas déclencher de re-render qui interromprait
  // l'animation CSS en cours.
  const visitedRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    const handleSelect = () => setCurrent(api.selectedScrollSnap());
    api.on("select", handleSelect);
    return () => {
      api.off("select", handleSelect);
    };
  }, [api]);

  // Marque le slide comme visité APRÈS la durée de l'animation cascade.
  // Sinon, un re-render rapide (par ex. embla qui set son api après mount)
  // retire les classes animate-* avant la fin et interrompt l'animation.
  useEffect(() => {
    const timer = window.setTimeout(() => {
      visitedRef.current.add(current);
    }, 800);
    return () => window.clearTimeout(timer);
  }, [current]);

  // Verrouille le scroll du body pendant que l'onboarding est affiché,
  // sinon la scrollbar de la page sous-jacente reste visible à droite.
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

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
    <div className="fixed inset-0 z-50 min-h-dvh overflow-hidden bg-gradient-to-br from-[#0F4C3A] via-[#0A3A2C] to-[#073025]">
      {!isLastSlide && (
        <button
          type="button"
          onClick={handleComplete}
          className="absolute right-6 top-6 z-20 text-sm text-white/70 underline-offset-4 hover:underline focus:outline-none"
          style={{ top: "calc(env(safe-area-inset-top) + 1.5rem)" }}
        >
          Passer
        </button>
      )}

      <Carousel
        setApi={setApi}
        opts={{ loop: false }}
        className="h-full [&>div]:h-full"
      >
        <CarouselContent className="ml-0 h-full">
          {SLIDES.map(({ Icon, title, subtitle }, index) => {
            const shouldAnimate =
              index === current && !visitedRef.current.has(index);
            return (
              <CarouselItem
                key={index}
                className="flex h-full flex-col items-center justify-center pl-0"
              >
                <div
                  key={`slide-${index}-${current}`}
                  className="flex flex-col items-center"
                >
                  {/* Cercle doré + halo radial + icône */}
                  <div
                    className={cn(
                      "relative flex h-60 w-60 items-center justify-center rounded-full bg-[#D4A93C]/20",
                      // Halo radial circulaire (évite le bug iOS Safari du
                      // filter:blur qui produit un halo carré).
                      "before:absolute before:-inset-6 before:rounded-full before:content-['']",
                      "before:bg-[radial-gradient(circle,rgba(212,169,60,0.35)_0%,transparent_70%)]",
                      shouldAnimate &&
                        "animate-in fade-in zoom-in-95 duration-500 [animation-fill-mode:backwards]",
                    )}
                  >
                    <Icon
                      className="relative z-10 text-[#D4A93C]"
                      size={120}
                      strokeWidth={1.5}
                    />
                  </div>

                  <div className="mt-10 flex flex-col items-center">
                    <h2
                      className={cn(
                        "text-3xl md:text-4xl font-bold tracking-tight text-white text-center px-6",
                        shouldAnimate &&
                          "animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150 [animation-fill-mode:backwards]",
                      )}
                    >
                      {title}
                    </h2>
                    <div
                      className={cn(
                        "my-5 mx-auto h-0.5 w-16 bg-[#D4A93C]",
                        shouldAnimate &&
                          "animate-in fade-in duration-500 delay-200 [animation-fill-mode:backwards]",
                      )}
                    />
                    <p
                      className={cn(
                        "max-w-sm px-6 text-center text-lg leading-relaxed text-white/80",
                        shouldAnimate &&
                          "animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300 [animation-fill-mode:backwards]",
                      )}
                    >
                      {subtitle}
                    </p>
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>

      {/* Indicateurs dots */}
      <div className="absolute bottom-24 left-0 right-0 z-10 flex items-center justify-center gap-2">
        {SLIDES.map((_, index) => (
          <span
            key={index}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              index === current ? "w-8 bg-[#D4A93C]" : "w-2 bg-white/30",
            )}
          />
        ))}
      </div>

      {/* Bouton final — slide 3 uniquement */}
      {isLastSlide && (
        <button
          type="button"
          onClick={handleComplete}
          className="fixed bottom-8 left-6 right-6 z-20 h-14 w-auto rounded-xl bg-[#D4A93C] font-bold text-[#0F4C3A] shadow-lg shadow-[#D4A93C]/25 transition-all hover:bg-[#E0B940] active:scale-[0.98]"
          style={{ bottom: "calc(env(safe-area-inset-bottom) + 2rem)" }}
        >
          Découvrir le catalogue
        </button>
      )}
    </div>
  );
};

export default OnboardingFlow;
