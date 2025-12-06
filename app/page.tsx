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
    <main className="flex min-h-screen flex-col bg-kahra_gold/20">


      {/* HERO – two-image crossfade on a light background */}
      <section className="relative overflow-hidden bg-white border-b border-kahra_gold/20">

        <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-10 px-4 py-10 md:flex-row md:items-center md:py-16">
          {/* HERO TEXT */}


          {/* RIGHT SIDE: FEATURED PRODUCT */}
          <div className="md:w-1/2">
            <div className="relative mx-auto h-[340px] max-w-md md:h-[380px]">
              {/* Floating product image */}

            </div>
          </div>
        </div>
        {/* Cross‑fading background images */}
        <div className="absolute inset-0">
          <Image
            src="/images/banner4.png"
            alt="Amber bracelet product shot"
            fill
            priority
            className="object-cover animate-hero-fade-1"
          />
        </div>
        <div className="absolute inset-0">
          <Image
            src="/images/banner3.png"
            alt="Amber bracelet on marble surface"
            fill
            priority
            className="object-cover animate-hero-fade-2"
          />
        </div>

        
        <Image
          src="/images/kahramani-logo.svg"
          alt="Kahramani logo"
          fill
          className="object-contain p-1.5"
          priority
        />


        

      </section>
      <SiteHeader lang={lang} />
   



      {/* FEATURED SECTION */}
      <section
        id="featured"
        className="mx-auto max-w-6xl px-4 py-10 md:py-4"
      >
        <div className={dict.dir === "rtl" ? "md:pl-10 md:text-right" : "md:pr-10 md:text-left"}>
         
          <a
            href={`/catalog?lang=${currentLang}`}
            className="text-xs font-semibold uppercase tracking-[0.18em] text-kahra_gold hover:underline"
          >
            {dict.featured.viewAll}
          </a>
         
        </div>

        {/* BEST SELLERS */}
        <section id="best-sellers" className="mt-6">
         
          <div className="mt-3 grid gap-5 md:grid-cols-3">
            {bestSellers.map((p) => (
              <article
                key={p.id}
                className="group flex flex-col overflow-hidden rounded-3xl bg-white border border-kahra_gold/40 shadow-soft-xl hover:-translate-y-1 transition"
              >
                <div className="relative h-64 w-full">
                  <Image
                    src={p.images[0]}
                    alt={p.name[currentLang]}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="px-4 py-4">
                  <h4 className="text-sm font-semibold text-gray-900">
                    {p.name[currentLang]}
                  </h4>
                  <p className="mt-1 text-xs text-gray-600">
                    {p.shortDescription[currentLang]}
                  </p>
                  <p className="mt-2 text-xs font-semibold text-kahra_gold">
                    {formatPrice(p.priceUsd, p.priceOmr)}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>



        {/* OFFERS */}
        {offers.length > 0 && (
          <section className="mt-10">
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-kahra_gold">
              {dict.featured.offers}
            </h3>
            <div className="mt-3 grid gap-5 md:grid-cols-3">
              {offers.map((p) => (
                <article
                  key={p.id}
                  className="group flex flex-col overflow-hidden rounded-3xl bg-white border border-kahra_goldSoft/60 shadow-soft-xl hover:-translate-y-1 transition"
                >
                  <div className="relative h-60 w-full">
                    <Image
                      src={p.images[0]}
                      alt={p.name[currentLang]}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="px-4 py-4">
                    <h4 className="text-sm font-semibold text-gray-900">
                      {p.name[currentLang]}
                    </h4>
                    <p className="mt-1 text-xs text-gray-600">
                      {p.shortDescription[currentLang]}
                    </p>
                    <p className="mt-2 text-xs font-semibold text-kahra_goldSoft">
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
        className="border-t border-kahra_gold/20 bg-[#f8f8f8] py-10 text-gray-800"
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 md:flex-row md:items-center md:justify-between">
          <div className="md:w-2/3">
            <h2 className="text-xl font-semibold">{dict.about.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-700">
              {dict.about.paragraph1}
            </p>
          </div>
          <div className="space-y-1 text-sm text-gray-700 md:w-1/3">
            <p>• {dict.about.values[0]}</p>
            <p>• {dict.about.values[1]}</p>
            <p>• {dict.about.values[2]}</p>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}