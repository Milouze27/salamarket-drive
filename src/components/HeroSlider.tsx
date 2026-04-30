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
      "Viandes halal certifiées, sélectionnées avec soin par votre boucher de quartier",
    ctaLabel: "Découvrir",
    ctaLink: "/?category=boucherie",
    image:
      "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=1920&q=80",
    imageAlt: "Boucher en train de préparer une pièce de viande",
  },
  {
    kicker: "Saveurs maison",
    title: "Charcuterie traditionnelle",
    subtitle:
      "Préparée chaque jour en magasin, dans le respect des traditions",
    ctaLabel: "Voir tout",
    ctaLink: "/?category=charcuterie",
    image:
      "https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=1920&q=80",
    imageAlt: "Étal coloré d'épices et de produits secs",
  },
  {
    kicker: "Au quotidien",
    title: "Vos essentiels halal",
    subtitle:
      "Tout ce qu'il faut pour vos repas, livré en click & collect",
    ctaLabel: "Parcourir",
    ctaLink: "/",
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1920&q=80",
    imageAlt: "Étal de fruits et légumes frais sur un marché",
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
          {SLIDES.map((slide, index) => (
            <CarouselItem key={index} className="pl-0 basis-full">
              <div className="relative h-72 md:h-80 w-full overflow-hidden bg-[#0F4C3A]">
                <img
                  src={slide.image}
                  alt={slide.imageAlt}
                  loading={index === 0 ? "eager" : "lazy"}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0F4C3A]/85 via-[#0F4C3A]/60 to-[#0F4C3A]/30" />
                <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-12 max-w-7xl mx-auto">
                  <span className="text-[#D4A93C] text-sm font-semibold uppercase tracking-wider mb-2">
                    {slide.kicker}
                  </span>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-3 max-w-md">
                    {slide.title}
                  </h2>
                  <p className="text-base md:text-lg text-white/90 mb-6 max-w-md">
                    {slide.subtitle}
                  </p>
                  <Link
                    to={slide.ctaLink}
                    className="inline-flex items-center gap-2 bg-[#D4A93C] text-[#0F4C3A] font-bold px-6 py-3 rounded-xl shadow-lg hover:bg-[#E0B940] active:scale-[0.98] transition-all w-fit"
                  >
                    {slide.ctaLabel}
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            </CarouselItem>
          ))}
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
