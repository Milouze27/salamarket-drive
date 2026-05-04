import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

interface Slide {
  kicker: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaLink: string;
  image: string;
  imageAlt: string;
}

const SLIDES: Slide[] = [
  {
    kicker: "Sélection premium",
    title: "Boucherie d'exception",
    subtitle:
      "Viandes halal certifiées, sélectionnées avec soin par notre boucher",
    ctaLabel: "Découvrir",
    ctaLink: "/?category=boucherie",
    image: "/hero/slide-1-boucherie.webp",
    imageAlt: "Pièces de viande halal de qualité boucher",
  },
  {
    kicker: "Saveurs maison",
    title: "Charcuterie traditionnelle",
    subtitle:
      "Préparée chaque jour en magasin, dans le respect des traditions",
    ctaLabel: "Voir tout",
    ctaLink: "/?category=charcuterie",
    image: "/hero/slide-2-charcuterie.webp",
    imageAlt: "Charcuterie maison traditionnelle",
  },
  {
    kicker: "Au quotidien",
    title: "Vos essentiels halal",
    subtitle:
      "Tout ce qu'il faut pour vos repas, livré en click & collect",
    ctaLabel: "Parcourir",
    ctaLink: "/",
    image: "/hero/slide-3-essentiels.webp",
    imageAlt: "Sélection de produits essentiels halal du quotidien",
  },
];

export const HeroSlider = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const autoplayRef = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true, stopOnLastSnap: false }),
  );

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    const handleSelect = () => setCurrent(api.selectedScrollSnap());
    api.on("select", handleSelect);
    return () => {
      api.off("select", handleSelect);
    };
  }, [api]);

  // Préload TOUTES les slides dès le mount pour éliminer le flash bg
  // sapin uni au moment du swipe vers slide 2 ou 3 (avant : slides 2/3
  // étaient en loading="lazy" → download au moment du swipe → flash).
  // Coût : ~400 KB (3 WebP × ~130 KB) une fois au mount, mis en cache.
  useEffect(() => {
    SLIDES.forEach((slide) => {
      const img = new Image();
      img.decoding = "async";
      img.src = slide.image;
    });
  }, []);

  return (
    <section
      aria-label="Promotions et mises en avant"
      className="relative w-full mb-6"
    >
      <Carousel
        setApi={setApi}
        opts={{ loop: true }}
        plugins={[autoplayRef.current]}
        className="w-full"
      >
        <CarouselContent className="ml-0">
          {SLIDES.map((slide, index) => {
            // Le ken-burns + le stagger d'entrée doivent rejouer à chaque
            // changement de slide actif. La key change déclenche un remount
            // donc l'animation CSS repart de zéro proprement.
            const isActive = index === current;
            return (
              <CarouselItem
                key={index}
                className="pl-0 basis-full"
                role="img"
                aria-label={slide.imageAlt}
              >
                <div className="relative h-72 md:h-80 w-full overflow-hidden bg-[#0F4C3A]">
                  {/* Image en background-image plutôt qu'<img> : permet
                      de rejouer le ken-burns via une `key` sur ce <div>
                      sans déclencher un remount qui causerait un flash
                      visuel. Toutes les slides sont préloadées au mount
                      (cf. useEffect ci-dessus) donc background-image
                      pointe vers une ressource déjà en cache navigateur
                      → zéro download au moment de l'affichage. */}
                  <div
                    key={`kb-${index}-${current}`}
                    className={cn(
                      "absolute inset-0 origin-center will-change-transform bg-cover bg-center",
                      isActive && "animate-ken-burns",
                    )}
                    style={{ backgroundImage: `url(${slide.image})` }}
                  />
                  {/* Voile sapin pour lisibilité du texte sur image. Léger
                      gradient radial pour donner un effet "spotlight" sur
                      la zone titre. */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0F4C3A]/90 via-[#0F4C3A]/65 to-[#0F4C3A]/30" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_50%,rgba(212,169,60,0.12)_0%,transparent_60%)]" />

                  <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-12 max-w-7xl mx-auto">
                    <span
                      key={`kicker-${index}-${current}`}
                      className={cn(
                        "text-[#D4A93C] text-sm font-semibold uppercase tracking-[0.18em] mb-2",
                        isActive &&
                          "animate-in fade-in slide-in-from-left-3 duration-500 [animation-fill-mode:backwards]",
                      )}
                    >
                      {slide.kicker}
                    </span>
                    <h2
                      key={`title-${index}-${current}`}
                      className={cn(
                        "text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-3 max-w-md",
                        isActive &&
                          "animate-in fade-in slide-in-from-left-4 duration-500 delay-100 [animation-fill-mode:backwards]",
                      )}
                    >
                      {slide.title}
                    </h2>
                    <p
                      key={`sub-${index}-${current}`}
                      className={cn(
                        "text-base md:text-lg text-white/90 mb-6 max-w-md",
                        isActive &&
                          "animate-in fade-in slide-in-from-left-4 duration-500 delay-200 [animation-fill-mode:backwards]",
                      )}
                    >
                      {slide.subtitle}
                    </p>
                    <Link
                      key={`cta-${index}-${current}`}
                      to={slide.ctaLink}
                      className={cn(
                        "group/cta relative inline-flex items-center gap-2 overflow-hidden bg-[#D4A93C] text-[#0F4C3A] font-bold px-6 py-3 rounded-full shadow-lg shadow-[#D4A93C]/30 hover:bg-[#E0B940] hover:shadow-xl hover:shadow-[#D4A93C]/40 active:scale-[0.98] transition-all w-fit",
                        isActive &&
                          "animate-in fade-in zoom-in-95 duration-500 delay-300 [animation-fill-mode:backwards]",
                      )}
                    >
                      {/* Shimmer : barre lumineuse qui sweep le bouton */}
                      <span
                        aria-hidden
                        className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"
                      />
                      <span className="relative z-10">{slide.ctaLabel}</span>
                      <ArrowRight
                        size={18}
                        className="relative z-10 transition-transform group-hover/cta:translate-x-0.5"
                      />
                    </Link>
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>

      {/* Indicateurs */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
        {SLIDES.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => api?.scrollTo(index)}
            aria-label={`Aller à la slide ${index + 1}`}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              index === current ? "w-8 bg-[#D4A93C]" : "w-2 bg-white/40",
            )}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;
