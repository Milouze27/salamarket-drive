import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

// "Wall text" éditorial à la Le Bon Marché — pas un slider promo,
// pas un hero metric, une déclaration d'identité du magasin. Photo
// dominante + Plus Jakarta Sans 800 tight pour la phrase signature
// + paragraphe chaleureux + un seul CTA.
//
// Pourquoi pas un carousel : un slider qui alterne 3 rayons fait
// "Carrefour Drive" (anti-référence PRODUCT.md). Une seule image
// forte, choisie, signe le commerçant indépendant.
export const EditorialIntro = () => (
  <section
    aria-labelledby="editorial-intro-title"
    className="relative w-full bg-[#FAF7EE]"
  >
    <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8 pb-10 md:py-16">
      <div className="grid gap-6 md:gap-10 md:grid-cols-12 items-center">
        {/* Photo — colonne 7 sur desktop, full sur mobile. Ratio
            portrait sur desktop (5:6), paysage sur mobile (4:3). */}
        <figure className="md:col-span-7 md:order-1 order-1">
          <div className="relative overflow-hidden rounded-[28px] md:rounded-[36px] aspect-[4/3] md:aspect-[5/4] bg-[#082A20] shadow-[0_30px_60px_-30px_rgba(8,42,32,0.35)]">
            <img
              src="/hero/slide-1-boucherie.webp"
              alt="Le rayon boucherie de Salamarket Toulouse — pièces sélectionnées par le boucher"
              loading="eager"
              fetchPriority="high"
              decoding="async"
              width={1600}
              height={1280}
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Voile chaud côté texte pour faire chanter le doré sans
                écraser la photo. Très léger, presque imperceptible. */}
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-[#082A20]/30 via-transparent to-transparent"
            />
            {/* Marque manuscrite du commerçant — comme une étiquette
                ardoise posée sur l'image. */}
            <div className="absolute left-5 top-5 md:left-6 md:top-6 flex items-center gap-2 rounded-full bg-[#FAF7EE]/95 backdrop-blur-md px-3 py-1.5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227]" aria-hidden />
              <span className="text-[10px] uppercase tracking-[0.22em] font-bold text-[#0E3B2E]">
                Halal certifié
              </span>
            </div>
          </div>
        </figure>

        {/* Texte — colonne 5, alignement gauche, hiérarchie éditoriale */}
        <div className="md:col-span-5 md:order-2 order-2">
          {/* Kicker — petites caps tracked, doré */}
          <p className="text-[11px] md:text-xs uppercase tracking-[0.28em] font-bold text-[#C9A227] mb-4 md:mb-5">
            Salamarket · 8 av. Larrieu&#8209;Thibaud
          </p>

          {/* Titre display — Plus Jakarta Sans 800, tracking serré pour
              donner du caractère sans changer de famille. L'accent gold
              porte la signature éditoriale. */}
          <h2
            id="editorial-intro-title"
            className="text-[34px] leading-[1.05] md:text-[52px] md:leading-[1.02] text-[#0E3B2E] font-extrabold tracking-[-0.03em]"
          >
            Votre supermarché halal,{" "}
            <span className="text-[#C9A227]">comme à la maison.</span>
          </h2>

          <p className="mt-5 md:mt-6 text-[15px] md:text-base leading-relaxed text-[#0F1A14]/75 max-w-[44ch]">
            Otmane, Ahmed et l'équipe préparent vos commandes chaque matin
            avenue Larrieu&#8209;Thibaud. Vous choisissez vos produits ce
            soir, vous récupérez demain entre vos rendez&#8209;vous. Aucune
            file, aucune surprise.
          </p>

          {/* CTA pair — primary plein sapin, secondary lien souligné */}
          <div className="mt-7 md:mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link
              to="/?category=boucherie"
              className="group inline-flex items-center gap-2 h-12 px-6 rounded-full bg-[#0E3B2E] text-white text-[15px] font-semibold shadow-md shadow-[#0E3B2E]/20 hover:bg-[#082A20] hover:shadow-lg hover:shadow-[#0E3B2E]/30 active:scale-[0.98] transition-all"
            >
              Commencer ma commande
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5"
                aria-hidden
              />
            </Link>
            <a
              href="#nos-rayons"
              className="inline-flex items-center gap-1 text-[14px] font-semibold text-[#0E3B2E] underline-offset-[6px] hover:underline decoration-[#C9A227]/60 decoration-[1.5px]"
            >
              Voir nos rayons
            </a>
          </div>

          {/* Microcopie horaires — réassurance discrète */}
          <p className="mt-6 md:mt-8 text-xs text-[#6B7280]">
            Ouvert du lundi au samedi · 10h–19h30 · Dimanche 10h–18h
          </p>
        </div>
      </div>
    </div>
  </section>
);

export default EditorialIntro;
