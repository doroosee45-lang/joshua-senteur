import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageCircle, Banknote, MapPin, Share2, Sparkles } from 'lucide-react';
import JoshuaLogo from '../components/JoshuaLogo';
import SakuraPetals from '../components/SakuraPetals';
import ProductCard from '../components/ProductCard';
import { Reveal, LuxuryImage, EditorialHeader } from '../components/Motion';
import { useBoutique } from '../context/BoutiqueContext';
import { sanitizePhoneForWhatsApp } from '../utils/whatsapp';

const HERO_SLIDES = [
  {
    id: 0,
    image: '/images/hero-1.jpg',
    eyebrow: '01 · MAISON DE HAUTE PARFUMERIE',
    headline: 'Votre parfum,',
    italic: 'votre élégance.',
    subtext:
      'L’élégance se révèle dans chaque sillage. Des créations choisies pour Elle, pour Lui et Mixtes, livrées entre vos mains à Jendouba et dans les communes voisines.',
    ctaLabel: 'Découvrir la collection',
    ctaLink: '/catalogue',
  },
  {
    id: 1,
    image: '/images/hero-2.jpg',
    eyebrow: '02 · SILLAGES BOISÉS & AMBRÉS',
    headline: 'La noblesse des bois,',
    italic: 'l’éclat de l’ambre.',
    subtext:
      'Commandez en toute simplicité depuis votre navigateur ou sur WhatsApp, et réglez exclusivement en espèces à la réception de votre flacon.',
    ctaLabel: 'Explorer Pour Lui',
    ctaLink: '/catalogue?categorie=Homme',
  },
  {
    id: 2,
    image: '/images/hero-3.jpg',
    eyebrow: '03 · CRÉATIONS LUMINEUSES',
    headline: 'La caresse d’une fleur',
    italic: 'à fleur de peau.',
    subtext:
      'Une sélection contemporaine aux notes de rose poudrée, de jasmin blanc et de musc soyeux, pensée pour sublimer chaque instant.',
    ctaLabel: 'Explorer Pour Elle',
    ctaLink: '/catalogue?categorie=Femme',
  },
];

const UNIVERSES = [
  {
    num: '01 — POUR ELLE',
    title: 'Sillages Féminins',
    desc: 'Notes florales, poudrées, solaires & veloutées',
    image: '/images/editorial-femme.jpg',
    to: '/catalogue?categorie=Femme',
  },
  {
    num: '02 — POUR LUI',
    title: 'Caractères Masculins',
    desc: 'Accords boisés, ambrés, fumés & épicés',
    image: '/images/editorial-homme.jpg',
    to: '/catalogue?categorie=Homme',
  },
  {
    num: '03 — COLLECTION PRIVÉE',
    title: 'Créations Mixtes',
    desc: 'Équilibres rares d’oud blanc, bergamote & musc',
    image: '/images/editorial-mixte.jpg',
    to: '/catalogue?categorie=Mixte',
  },
];

export default function HomePage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const { publicProducts, settings, setShareModalPayload } = useBoutique();

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6800);
    return () => clearInterval(timer);
  }, []);

  const featuredProducts = publicProducts.filter((p) => p.featured).slice(0, 4);
  const showcaseList =
    featuredProducts.length >= 4 ? featuredProducts : publicProducts.slice(0, 4);
  const waDigits = sanitizePhoneForWhatsApp(settings.whatsappNumber);
  const currentSlide = HERO_SLIDES[activeSlide];

  return (
    <div className="w-full">
      {/* =========================================================
          1. HERO SECTION — Choreographed Crossfade & Progress Flow
         ========================================================= */}
      <section className="relative w-full min-h-[88vh] sm:min-h-[93vh] pt-[74px] sm:pt-[82px] flex items-center overflow-hidden bg-[#1C1615]">
        {/* Background Slides with Smooth 1400ms Crossfade & Subtle Scale */}
        {HERO_SLIDES.map((slide, index) => {
          const isCurrent = index === activeSlide;
          return (
            <div
              key={slide.id}
              style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
              className={`absolute inset-0 transition-opacity duration-[1400ms] ${
                isCurrent ? 'opacity-100 z-0' : 'opacity-0 -z-10'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.headline}
                className={`w-full h-full object-cover object-center transition-transform duration-[9000ms] ease-out ${
                  isCurrent ? 'scale-[1.05]' : 'scale-100'
                }`}
              />
              {/* Harmonized Espresso Vignette */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#1C1615]/92 via-[#231B19]/58 to-[#1C1615]/20" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C1615]/85 via-transparent to-[#1C1615]/30" />
            </div>
          );
        })}

        {/* Delicate Floating Blossoms & Petals */}
        <SakuraPetals />

        {/* Left Editorial Typography Block */}
        <div className="relative z-20 max-w-[1440px] mx-auto w-full px-6 sm:px-12 lg:px-20 py-14 sm:py-20">
          <div className="max-w-xl">
            <div className="mb-7 flex justify-start">
              <JoshuaLogo size="lg" subtitle="ATELIER PARFUM" />
            </div>

            {/* Keyed Animated Copy Block on Slide Change */}
            <div key={currentSlide.id} className="animate-page-enter">
              <div className="inline-flex items-center gap-3 mb-4">
                <span className="w-6 h-[1px] bg-[#E2C0BC]/65" />
                <span className="text-[10px] sm:text-[10.5px] uppercase tracking-[0.32em] text-[#E2C0BC] font-medium">
                  {currentSlide.eyebrow}
                </span>
              </div>

              <h1 className="font-serif text-4xl sm:text-6xl lg:text-[64px] font-normal text-[#FAF7F4] leading-[1.06] tracking-[-0.01em]">
                {currentSlide.headline}{' '}
                <em className="italic font-light text-[#E2C0BC] block sm:inline">
                  {currentSlide.italic}
                </em>
              </h1>

              <p className="mt-5 text-xs sm:text-[14px] text-[#FAF7F4]/78 font-light leading-[1.85] max-w-md">
                {currentSlide.subtext}
              </p>

              {/* Unified Atelier Button Duo */}
              <div className="mt-9 flex flex-wrap items-center gap-3.5">
                <Link to={currentSlide.ctaLink} className="btn-atelier-outline-light">
                  <span>{currentSlide.ctaLabel}</span>
                </Link>

                <a
                  href={`https://wa.me/${waDigits}?text=${encodeURIComponent(
                    `Bonjour ${settings.boutiqueName} ✨ Je souhaite commander un parfum (Règlement en espèces à la livraison).`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-atelier-blush"
                >
                  <MessageCircle className="w-4 h-4" strokeWidth={1.6} />
                  <span>Commande WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Harmonized Reassurance Line */}
            <div className="mt-9 pt-6 border-t border-white/[0.09] flex flex-wrap items-center gap-x-6 gap-y-2 text-[10px] uppercase tracking-[0.22em] text-[#D4B8AE]/85">
              <span className="flex items-center gap-2">
                <Banknote className="w-3.5 h-3.5 text-[#E2C0BC]" strokeWidth={1.5} />
                Espèces à la livraison
              </span>
              <span className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#E2C0BC]" strokeWidth={1.5} />
                Jendouba & villes voisines
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Center Animated Progress Indicators */}
        <div className="absolute bottom-7 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
          {HERO_SLIDES.map((s, idx) => {
            const isCurrent = idx === activeSlide;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setActiveSlide(idx)}
                aria-label={`Diapositive ${idx + 1}`}
                className="relative w-12 sm:w-16 h-[2px] bg-white/25 overflow-hidden"
              >
                {isCurrent && (
                  <span
                    key={`bar-${activeSlide}`}
                    className="absolute inset-0 bg-[#E2C0BC] animate-hero-progress"
                  />
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* =========================================================
          2. FLORAL MURAL MANIFESTO — Mirrors La Roselle Mural
         ========================================================= */}
      <section className="relative w-full py-24 sm:py-36 overflow-hidden border-t border-white/[0.07]">
        <div className="absolute inset-0">
          <img
            src="/images/floral-mural.jpg"
            alt="Fresque florale Joshua Parfum"
            className="w-full h-full object-cover object-center opacity-50"
          />
          <div className="absolute inset-0 bg-[#281F1D]/65" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1C1615]/75 via-transparent to-[#1C1615]/85" />
        </div>

        <SakuraPetals density="subtle" />

        <Reveal className="relative z-20 max-w-3xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-3 mb-5">
            <span className="w-7 h-[1px] bg-[#E2C0BC]/55" />
            <span className="text-[10px] sm:text-[10.5px] uppercase tracking-[0.34em] text-[#E2C0BC] font-medium">
              {settings.boutiqueName} · L’ESPRIT DE LA MAISON
            </span>
            <span className="w-7 h-[1px] bg-[#E2C0BC]/55" />
          </div>

          <h2 className="font-serif text-5xl sm:text-7xl lg:text-[78px] font-normal text-[#FAF7F4] leading-[1.03] tracking-[-0.01em]">
            L’art du sillage
            <em className="block italic font-light text-[#E2C0BC] mt-1">autrement.</em>
          </h2>

          <p className="mt-6 text-xs sm:text-[14px] text-[#FAF7F4]/76 font-light leading-[1.85] max-w-lg mx-auto">
            Des matières nobles, des accords ciselés et des flacons aux lignes pures qui racontent
            une certaine idée de l’élégance contemporaine.
          </p>
        </Reveal>
      </section>

      {/* =========================================================
          3. TROIS EXPRESSIONS — Staggered Editorial Triptych
         ========================================================= */}
      <section className="bg-[#1C1615] py-20 sm:py-28 px-4 sm:px-8 lg:px-14 border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
            <EditorialHeader
              eyebrow="Trois expressions · Une même vision"
              title="Une allure"
              italicAccent="singulière."
              align="left"
              theme="dark"
            />
            <Reveal delay={140}>
              <Link
                to="/catalogue"
                className="inline-flex items-center gap-2.5 text-[10.5px] uppercase tracking-[0.26em] text-[#E2C0BC] hover:text-[#FAF7F4] transition-colors"
              >
                <span>Explorer toute la maison</span>
                <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
              </Link>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {UNIVERSES.map((item, idx) => (
              <Reveal key={item.num} delay={idx * 120} variant="scale">
                <Link
                  to={item.to}
                  className="group relative aspect-[4/5] overflow-hidden border border-white/[0.09] hover:border-[#E2C0BC]/45 transition-colors duration-500 block"
                >
                  <LuxuryImage
                    src={item.image}
                    alt={item.title}
                    darkPlaceholder
                    toneOverlay={false}
                    className="w-full h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1C1615]/92 via-[#1C1615]/22 to-transparent" />
                  <div className="absolute inset-x-7 bottom-7">
                    <p className="text-[9.5px] uppercase tracking-[0.3em] text-[#E2C0BC] font-medium">
                      {item.num}
                    </p>
                    <h3 className="font-serif text-3xl text-[#FAF7F4] mt-1.5 group-hover:text-[#E2C0BC] transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-xs font-light text-[#FAF7F4]/68 mt-1.5 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          4. LA SÉLECTION SIGNATURE — Warm Alabaster Gallery
         ========================================================= */}
      <section className="bg-[#FAF7F4] text-[#1C1615] py-22 sm:py-28 px-4 sm:px-8 lg:px-14">
        <div className="max-w-7xl mx-auto">
          <EditorialHeader
            eyebrow="Créations & Nouveautés"
            title="La Sélection"
            italicAccent="Signature."
            description="Chaque flacon est proposé en Dinars Tunisiens (DT), disponible en ajout direct au panier ou en commande express sur WhatsApp avec règlement en espèces à la livraison."
            align="center"
            theme="light"
            className="mb-14"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7">
            {showcaseList.map((product, idx) => (
              <Reveal key={product.id} delay={idx * 90}>
                <ProductCard product={product} variant="light" />
              </Reveal>
            ))}
          </div>

          <Reveal delay={200} className="mt-14 text-center">
            <Link to="/catalogue" className="btn-atelier-dark">
              <span>Découvrir les {publicProducts.length} créations</span>
              <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* =========================================================
          5. LE GOÛT DU DÉTAIL — Savoir-Faire, Espèces & WhatsApp
         ========================================================= */}
      <section className="bg-[#231B19] text-[#FAF7F4] py-20 sm:py-28 px-4 sm:px-8 lg:px-14 border-t border-white/[0.08]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <Reveal variant="scale" className="lg:col-span-6 relative">
            <div className="aspect-[4/3] overflow-hidden border border-white/10">
              <LuxuryImage
                src="/images/savoir-faire.jpg"
                alt="Savoir-faire Joshua Parfum"
                darkPlaceholder
                className="w-full h-full"
              />
            </div>
            <div className="hidden sm:block absolute -bottom-6 -right-6 bg-[#1C1615] border border-[#E2C0BC]/30 p-6 max-w-xs shadow-2xl">
              <p className="font-serif italic text-xl text-[#E2C0BC]">
                « {settings.slogan} »
              </p>
              <p className="text-[10.5px] font-light tracking-wide text-[#FAF7F4]/65 mt-1.5">
                Service privé WhatsApp · {settings.whatsappNumber}
              </p>
            </div>
          </Reveal>

          <div className="lg:col-span-6 space-y-7">
            <EditorialHeader
              eyebrow="Simplicité & Confiance"
              title="La beauté d’un service"
              italicAccent="sur mesure."
              description={`Chez ${settings.boutiqueName}, commandez directement depuis votre smartphone sans créer de compte ni saisir de carte bancaire. Votre parfum est préparé avec soin et livré à Jendouba et dans les villes voisines.`}
              align="left"
              theme="dark"
            />

            <Reveal delay={120} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 bg-[#1C1615]/80 border border-white/[0.08]">
                <Banknote className="w-4 h-4 text-[#E2C0BC] mb-2.5" strokeWidth={1.5} />
                <h4 className="text-[10.5px] uppercase tracking-[0.22em] font-medium text-[#FAF7F4]">
                  Règlement à la livraison
                </h4>
                <p className="text-xs font-light text-[#FAF7F4]/62 mt-1.5 leading-[1.75]">
                  Réglez le montant exact en espèces en Dinars Tunisiens lors de la remise en main
                  propre.
                </p>
              </div>

              <div className="p-5 bg-[#1C1615]/80 border border-white/[0.08]">
                <Sparkles className="w-4 h-4 text-[#E2C0BC] mb-2.5" strokeWidth={1.5} />
                <h4 className="text-[10.5px] uppercase tracking-[0.22em] font-medium text-[#FAF7F4]">
                  Partage en un geste
                </h4>
                <p className="text-xs font-light text-[#FAF7F4]/62 mt-1.5 leading-[1.75]">
                  Faites découvrir l’adresse de la boutique sur WhatsApp, Facebook et TikTok.
                </p>
              </div>
            </Reveal>

            <Reveal delay={220} className="pt-2 flex flex-wrap gap-3.5">
              <a
                href={`https://wa.me/${waDigits}?text=${encodeURIComponent(
                  `Bonjour ${settings.boutiqueName} ✨ J’aimerais être conseillé pour choisir un parfum.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-atelier-blush"
              >
                <MessageCircle className="w-4 h-4" strokeWidth={1.6} />
                <span>Commander sur WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={() =>
                  setShareModalPayload({
                    url: window.location.origin,
                    title: `${settings.boutiqueName} — ${settings.slogan}`,
                  })
                }
                className="btn-atelier-outline-light"
              >
                <Share2 className="w-4 h-4" strokeWidth={1.6} />
                <span>Partager l’adresse</span>
              </button>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
