import Image from "next/image";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { getDictionary } from "../lib/dictionary";
import {
  categories,
  getBestSellers,
  getOffers,
  getProductsByCategory,
} from "../data/products";

interface HomeProps {
  searchParams?: { lang?: string; category?: string };
}

export default function Home({ searchParams }: HomeProps) {
  const lang = searchParams?.lang;
  const dict = getDictionary(lang);
  const currentLang = dict.lang;
  const bestSellers = getBestSellers();
  const offers = getOffers();
  const heroCategory = getProductsByCategory("necklaces")[0];

  const formatPrice = (usd: number, omr: number) => {
    return currentLang === "ar"
      ? `${omr.toFixed(3)} ر.ع · ${usd.toFixed(0)} USD`
      : `${usd.toFixed(0)} USD · ${omr.toFixed(3)} OMR`;
  };

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-b from-white via-kahra_cream/5 to-white">
      {/* HERO – Enhanced with animations */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-kahra_cream/20 to-white border-b border-kahra_gold/10">
        {/* Crossfading background images */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute inset-0 animate-hero-fade-1">
            <Image
              src="/images/banner4.png"
              alt="Amber bracelet product shot"
              fill
              priority
              className="object-cover"
            />
          </div>
          <div className="absolute inset-0 animate-hero-fade-2">
            <Image
              src="/images/banner3.png"
              alt="Amber bracelet on marble surface"
              fill
              priority
              className="object-cover"
            />
          </div>
        </div>

        {/* Floating amber particles effect */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-[10%] w-3 h-3 bg-kahra_gold/30 rounded-full animate-amber-float-1 blur-sm" />
          <div className="absolute top-40 right-[15%] w-2 h-2 bg-kahra_goldSoft/40 rounded-full animate-amber-float-2 blur-sm" />
          <div className="absolute bottom-32 left-[20%] w-4 h-4 bg-kahra_gold/20 rounded-full animate-amber-float-3 blur-sm" />
          <div className="absolute top-60 right-[30%] w-2.5 h-2.5 bg-kahra_cream/50 rounded-full animate-amber-float-1" 
               style={{ animationDelay: '2s' }} />
        </div>

        {/* Logo section with elegant entrance */}
        <div className="relative z-10 flex items-center justify-center pt-12 pb-8">
          <div className="relative h-32 w-64 animate-fade-in-down">
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
        <div className="relative z-10 mx-auto max-w-4xl px-4 pb-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 animate-fade-in-up">
            <span className="text-kahra_gold">{dict.hero.titleStrong}</span>
            <span className="text-gray-700">{dict.hero.titleRest}</span>
          </h1>
          <p className="mt-6 text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed animate-fade-in-up"
             style={{ animationDelay: '0.2s' }}>
            {dict.hero.subtitle}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up"
               style={{ animationDelay: '0.4s' }}>
            <a
              href={`/catalog?lang=${currentLang}`}
              className="rounded-full bg-kahra_gold px-8 py-3 text-sm font-semibold uppercase tracking-wider text-white shadow-lg hover:bg-kahra_gold/90 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
            >
              {dict.hero.ctaPrimary}
            </a>
            <a
              href={`/about?lang=${currentLang}`}
              className="rounded-full border-2 border-kahra_gold px-8 py-3 text-sm font-semibold uppercase tracking-wider text-kahra_gold hover:bg-kahra_gold hover:text-white transition-all duration-300"
            >
              {dict.hero.ctaSecondary}
            </a>
          </div>
        </div>
      </section>

      <SiteHeader lang={lang} />

      {/* FEATURED SECTION */}
      <section
        id="featured"
        className="mx-auto max-w-6xl px-4 py-12 md:py-16"
      >
        <div className={dict.dir === "rtl" ? "md:pl-10 md:text-right" : "md:pr-10 md:text-left"}>
          <a
            href={`/catalog?lang=${currentLang}`}
            className="text-sm font-semibold uppercase tracking-wider text-kahra_gold hover:text-kahra_gold/80 transition-colors"
          >
            {dict.featured.viewAll} →
          </a>
        </div>

        {/* BEST SELLERS */}
        <section id="best-sellers" className="mt-8">
          <div className="grid gap-6 md:grid-cols-3">
            {bestSellers.map((p, idx) => (
              <article
                key={p.id}
                className="group flex flex-col overflow-hidden rounded-3xl bg-white border border-gray-200 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="relative h-64 w-full overflow-hidden">
                  <Image
                    src={p.images[0]}
                    alt={p.name[currentLang]}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="px-5 py-4">
                  <h4 className="text-base font-semibold text-gray-800">
                    {p.name[currentLang]}
                  </h4>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                    {p.shortDescription[currentLang]}
                  </p>
                  <p className="mt-3 text-sm font-bold text-kahra_gold">
                    {formatPrice(p.priceUsd, p.priceOmr)}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* OFFERS */}
        {offers.length > 0 && (
          <section className="mt-12">
            <h3 className="text-lg font-semibold uppercase tracking-wider text-kahra_gold mb-6">
              {dict.featured.offers}
            </h3>
            <div className="grid gap-6 md:grid-cols-3">
              {offers.map((p) => (
                <article
                  key={p.id}
                  className="group flex flex-col overflow-hidden rounded-3xl bg-white border border-kahra_gold/30 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="relative h-60 w-full overflow-hidden">
                    <Image
                      src={p.images[0]}
                      alt={p.name[currentLang]}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="px-5 py-4">
                    <h4 className="text-base font-semibold text-gray-800">
                      {p.name[currentLang]}
                    </h4>
                    <p className="mt-2 text-sm text-gray-600">
                      {p.shortDescription[currentLang]}
                    </p>
                    <p className="mt-3 text-sm font-bold text-kahra_goldSoft">
                      {formatPrice(p.priceUsd, p.priceOmr)}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </section>

      {/* ABOUT PREVIEW */}
      <section
        id="about-preview"
        className="border-t border-kahra_gold/20 bg-gradient-to-br from-gray-50 to-white py-12"
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 md:flex-row md:items-center md:justify-between">
          <div className="md:w-2/3">
            <h2 className="text-2xl font-semibold text-gray-800">{dict.about.title}</h2>
            <p className="mt-4 text-sm leading-relaxed text-gray-600">
              {dict.about.paragraph1}
            </p>
          </div>
          <div className="space-y-2 text-sm text-gray-700 md:w-1/3">
            <p className="flex items-start gap-2">
              <span className="text-kahra_gold mt-1">✓</span>
              <span>{dict.about.values[0]}</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-kahra_gold mt-1">✓</span>
              <span>{dict.about.values[1]}</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-kahra_gold mt-1">✓</span>
              <span>{dict.about.values[2]}</span>
            </p>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}