import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

// Hero éditorial poster — typographie dominante + photo magazine
// + pagination éditoriale "01" qui anchor la séquence du home. Registre
// supermarché pro (Chronodrive density) mais avec la chaleur Salamarket
// (sapin + or + photographie chaude).
//
// Composition :
// - Mobile : numéro + kicker + TITRE HUGE + body + photo full-bleed
//   sous le bloc texte avec sceau halal en overlay + CTA pair + microcopy
// - Desktop : grid 12-col, texte gauche (5 col) / photo droite (7 col)
//   asymétrique pour rythme visuel
//
// Le "01" en gold thin signe la pagination de la home — repris dans
// WeeklyPicks (02) et le catalogue (03) pour une rythmique catalogue
// raisonné cohérente.
export const EditorialIntro = () => (
  <section
    aria-labelledby="editorial-intro-title"
    className="relative w-full bg-[#FAF7EE] overflow-hidden"
  >
    <div className="max-w-7xl mx-auto px-5 md:px-8 pt-10 md:pt-24 pb-12 md:pb-28">
      <div className="grid md:grid-cols-12 gap-y-10 md:gap-x-10 lg:gap-x-16 items-center">
        {/* COLONNE TEXTE — 5 col desktop, full mobile, vient en premier
            visuellement (mobile order 1, desktop order 1). */}
        <div className="md:col-span-5 md:order-1">
          {/* Pagination éditoriale : "01" + hairline + label section.
              Pattern repris à chaque section pour rythme catalogue. */}
          <div className="flex items-center gap-4 mb-7 md:mb-10">
            <span className="text-[28px] md:text-[32px] font-extrabold text-[#C9A227] tabular-nums leading-none tracking-[-0.04em]">
              01
            </span>
            <span aria-hidden className="h-px flex-1 max-w-[80px] bg-[#0E3B2E]/25" />
            <span className="text-[10px] uppercase tracking-[0.32em] font-bold text-[#0E3B2E]">
              Le magasin
            </span>
          </div>

          {/* Titre poster — Plus Jakarta Sans 800, tracking ultra-serré.
              Calibré pour 4 lignes max sur iPhone 390px et 3 lignes sur
              desktop. Le break manuel pose la 2nde phrase en gold sur
              ligne distincte = effet "punch line" éditorial. */}
          <h2
            id="editorial-intro-title"
            className="text-[36px] leading-[1] sm:text-[44px] sm:leading-[0.98] md:text-[56px] md:leading-[0.96] lg:text-[68px] lg:leading-[0.94] text-[#0E3B2E] font-extrabold tracking-[-0.035em] lg:tracking-[-0.04em]"
          >
            Votre supermarché halal,
            <br />
            <span className="text-[#C9A227]">en click&nbsp;&amp;&nbsp;collect.</span>
          </h2>

          <p className="mt-7 md:mt-9 text-[15px] md:text-[16px] leading-[1.55] text-[#0F1A14]/80 max-w-[44ch]">
            Sélection halal certifiée, préparée chaque matin avenue
            Larrieu&#8209;Thibaud. Vous commandez ce soir, vous récupérez
            demain sur le créneau de votre choix. Aucune file, aucune
            surprise.
          </p>

          {/* CTA pair — primary sapin plein, secondary lien souligné gold */}
          <div className="mt-8 md:mt-10 flex flex-wrap items-center gap-x-7 gap-y-4">
            <Link
              to="/?category=boucherie"
              className="group inline-flex items-center gap-2 h-14 px-7 rounded-full bg-[#0E3B2E] text-white text-[15px] font-semibold shadow-md shadow-[#0E3B2E]/20 hover:bg-[#082A20] hover:shadow-lg hover:shadow-[#0E3B2E]/30 active:scale-[0.98] transition-all"
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
              className="inline-flex items-center gap-1 text-[14px] font-semibold text-[#0E3B2E] underline-offset-[7px] hover:underline decoration-[#C9A227] decoration-[2px]"
            >
              Voir tous les rayons
            </a>
          </div>

          {/* Microcopy avec hairline supérieure pour le poids éditorial */}
          <div className="mt-10 md:mt-14 pt-5 border-t border-[#0E3B2E]/15 grid grid-cols-2 gap-x-6 gap-y-3 text-[12px] text-[#0F1A14]/65 max-w-[400px]">
            <div>
              <p className="text-[#C9A227] font-bold uppercase tracking-[0.18em] text-[10px] mb-1">
                Retrait
              </p>
              <p className="leading-snug">8 av. Larrieu&#8209;Thibaud, 31100 Toulouse</p>
            </div>
            <div>
              <p className="text-[#C9A227] font-bold uppercase tracking-[0.18em] text-[10px] mb-1">
                Horaires
              </p>
              <p className="leading-snug">Lun – Sam · 10h – 19h30</p>
            </div>
          </div>
        </div>

        {/* COLONNE PHOTO — 7 col desktop, full mobile. Photo très grande
            avec sceau halal flottant + ombre généreuse. */}
        <figure className="md:col-span-7 md:order-2 relative">
          <div className="relative aspect-[4/5] sm:aspect-[5/6] md:aspect-[5/6] w-full overflow-hidden rounded-[28px] md:rounded-[40px] bg-[#082A20] shadow-[0_40px_80px_-32px_rgba(8,42,32,0.45)]">
            <img
              src="/hero/slide-1-boucherie.webp"
              alt="Sélection halal certifiée — comptoir boucherie Salamarket Toulouse"
              loading="eager"
              fetchPriority="high"
              decoding="async"
              width={1600}
              height={2000}
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Voile bas pour faire chanter le sceau + ancrage visuel */}
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-t from-[#082A20]/55 via-transparent to-[#082A20]/10"
            />

            {/* Sceau Halal certifié — circulaire, signature visuelle */}
            <div className="absolute top-5 right-5 md:top-7 md:right-7 z-10">
              <div className="relative w-[88px] h-[88px] md:w-[110px] md:h-[110px] rounded-full bg-[#FAF7EE] shadow-xl shadow-[#082A20]/30 flex flex-col items-center justify-center text-center">
                {/* Anneau intérieur doré */}
                <span
                  aria-hidden
                  className="absolute inset-[6px] rounded-full border-[1.5px] border-[#C9A227]/45"
                />
                <span className="relative text-[9px] md:text-[10px] uppercase tracking-[0.18em] font-bold text-[#C9A227] leading-tight">
                  Halal
                </span>
                <span className="relative text-[14px] md:text-[16px] font-extrabold text-[#0E3B2E] leading-tight tracking-[-0.02em]">
                  Certifié
                </span>
                <span className="relative text-[8px] md:text-[9px] uppercase tracking-[0.22em] font-semibold text-[#0E3B2E]/55 mt-0.5">
                  Salamarket
                </span>
              </div>
            </div>

            {/* Petit cartel bas-gauche — info magasin posée comme sur poster */}
            <div className="absolute bottom-5 left-5 md:bottom-7 md:left-7 flex items-center gap-2 rounded-full bg-[#FAF7EE]/95 backdrop-blur-md px-3.5 py-1.5 shadow-md">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227]" aria-hidden />
              <span className="text-[10px] uppercase tracking-[0.22em] font-bold text-[#0E3B2E]">
                Salamarket · Toulouse
              </span>
            </div>
          </div>

          {/* Petit pavé crédit sous la photo — détail "magazine" */}
          <figcaption className="mt-4 md:mt-5 flex items-center gap-3 text-[11px] uppercase tracking-[0.24em] font-bold text-[#0E3B2E]/55">
            <span aria-hidden className="h-px w-8 bg-[#C9A227]" />
            Boucherie · Sélection du jour
          </figcaption>
        </figure>
      </div>
    </div>
  </section>
);

export default EditorialIntro;
