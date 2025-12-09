import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { getDictionary } from "../lib/dictionary";
import { Suspense } from "react";
import { HeroBackground } from "../components/HeroBackground";

import {
  getBestSellers,
  getOffers,
} from "../data/products";
import { ProductGalleryCard } from "../components/ProductGalleryCard";

interface HomeProps {
  searchParams?: Promise<{ lang?: string; category?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const lang = params?.lang;
  const dict = getDictionary(lang);
  const currentLang = dict.lang;
  const bestSellers = getBestSellers();
  const offers = getOffers();

  const formatPrice = (usd: number, omr: number) => {
    return currentLang === "ar"
      ? `${omr.toFixed(3)} ر.ع · ${usd.toFixed(0)} USD`
      : `${usd.toFixed(0)} USD · ${omr.toFixed(3)} OMR`;
  };

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-b from-kahra_gold/20 via-kahra_cream/5 to-white">
      {/* HERO – Safari-compatible version */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-kahra_cream/20 to-white border-b border-kahra_gold/10">
        {/* 
          CRITICAL FIX: The GIF was crashing iOS Safari due to memory limits.
          GIFs decompress ALL frames into memory (~500MB-2GB for animated GIFs).
          iOS Safari has a ~1.5GB per-tab limit.
          
          Solution: Use HeroBackground component that:
          - Shows MP4 video on desktop (much more memory efficient)
          - Shows static image on mobile/iOS (safest option)
        */}
        <HeroBackground />

        {/* Floating amber particles - DESKTOP ONLY to save mobile GPU/memory */}
        <div className="absolute inset-0 pointer-events-none hidden lg:block">
          <div className="absolute top-20 left-[10%] w-3 h-3 bg-kahra_gold/30 rounded-full animate-amber-float-1" />
          <div className="absolute top-40 right-[15%] w-2 h-2 bg-kahra_goldSoft/40 rounded-full animate-amber-float-2" />
          <div className="absolute bottom-32 left-[20%] w-4 h-4 bg-kahra_gold/20 rounded-full animate-amber-float-3" />
          <div 
            className="absolute top-60 right-[30%] w-2.5 h-2.5 bg-kahra_cream/50 rounded-full animate-amber-float-1"
            style={{ animationDelay: '2s' }} 
          />
        </div>

        {/* Logo section with elegant entrance */}
        <div className="relative z-10 flex items-center justify-center pt-8 sm:pt-12 pb-6 sm:pb-8">
          <div className="h-24 w-48 sm:h-32 sm:w-64 animate-fade-in-down">
            <Image
              src="/images/kahramani-logo.svg"
              alt="Kahramani logo"
              fill
              className="object-contain drop-shadow-lg"
              priority
            />
          </div>
        </div>

        {/* Hero text with staggered animation */}
        <div className="relative z-10 mx-auto max-w-4xl px-4 pb-12 sm:pb-16 text-center">
          <div 
            className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 animate-fade-in-up"
            style={{ animationDelay: '0.4s' }}
          >
            <Link
              href={`/catalog?lang=${currentLang}`}
              className="w-full sm:w-auto rounded-full bg-kahra_gold px-6 sm:px-8 py-3 text-sm font-semibold uppercase tracking-wider text-white shadow-lg hover:bg-kahra_gold/90 hover:shadow-xl transition-all duration-300 touch-manipulation"
            >
              {dict.hero.ctaPrimary}
            </Link>
            <Link
              href={`/about?lang=${currentLang}`}
              className="w-full sm:w-auto rounded-full border-2 border-kahra_gold px-6 sm:px-8 py-3 text-sm font-semibold uppercase tracking-wider text-kahra_gold hover:bg-kahra_gold hover:text-white transition-all duration-300 touch-manipulation"
            >
              {dict.hero.ctaSecondary}
            </Link>
          </div>
        </div>
      </section>

      <Suspense fallback={null}>
        <SiteHeader lang={lang} />
      </Suspense>

      {/* FEATURED SECTION */}
      <section
        id="featured"
        className="mx-auto w-full max-w-6xl px-4 py-8 sm:py-12 md:py-16"
      >
        <div className={dict.dir === "rtl" ? "md:pl-10 md:text-right" : "md:pr-10 md:text-left"}>
          <Link
            href={`/catalog?lang=${currentLang}`}
            className="text-sm font-semibold uppercase tracking-wider text-kahra_gold hover:text-kahra_gold/80 transition-colors"
          >
            {dict.featured.viewAll} →
          </Link>
        </div>
        
        {/* Best Sellers Section - Now with multi-image gallery support */}
        <section id="best-sellers" className="mt-6 sm:mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {bestSellers.map((p, idx) => (
              <ProductGalleryCard
                key={p.id}
                images={p.images}
                name={p.name[currentLang]}
                description={p.shortDescription[currentLang]}
                currentLang={currentLang}
                priority={idx < 3}
              />
            ))}
          </div>
        </section>

        {/* Offers Section - Also with multi-image gallery support */}
        {offers.length > 0 && (
          <section className="mt-10 sm:mt-12">
            <h3 className="text-base sm:text-lg font-semibold uppercase tracking-wider text-kahra_gold mb-4 sm:mb-6">
              {dict.featured.offers}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {offers.map((p) => (
                <ProductGalleryCard
                  key={p.id}
                  images={p.images}
                  name={p.name[currentLang]}
                  description={p.shortDescription[currentLang]}
                  price={formatPrice(p.priceUsd, p.priceOmr)}
                  currentLang={currentLang}
                  isOffer
                />
              ))}
            </div>
          </section>
        )}
      </section>

      {/* ABOUT PREVIEW */}
      <section
        id="about-preview"
        className="border-t border-kahra_gold/20 bg-gradient-to-br from-gray-50 to-white py-10 sm:py-12"
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 md:flex-row md:items-center md:justify-between">
          <div className="md:w-2/3">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">{dict.about.title}</h2>
            <p className="mt-3 sm:mt-4 text-sm leading-relaxed text-gray-600">
              {dict.about.paragraph1}
            </p>
          </div>
          <div className="space-y-2 text-sm text-gray-700 md:w-1/3">
            {dict.about.values.slice(0, 3).map((value, idx) => (
              <p key={idx} className="flex items-start gap-2">
                <span className="text-kahra_gold mt-0.5 flex-shrink-0">✓</span>
                <span>{value}</span>
              </p>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
