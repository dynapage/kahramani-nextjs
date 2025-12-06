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
    <main className="flex min-h-screen flex-col">
      <SiteHeader lang={lang} />

  {/* BALTIC WINTER HERO – LAYERED + ANIMATED */}
<section className="relative border-b border-kahra_gold/40 overflow-hidden bg-kahra_deep">
  {/* Moving forest background */}
  <div className="absolute inset-0 animate-baltic-pan">
    <Image
      src="/images/hero-baltic-bg.png"
      alt="Baltic winter forest with glowing amber garlands"
      fill
      priority
      className="object-cover"
    />
  </div>

  {/* Dark overlay to keep text readable */}
  <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />

  {/* Optional snow overlay */}
  <div className="pointer-events-none snow" />
  <div className="pointer-events-none" />

  <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-10 px-4 py-10 md:flex-row md:items-center md:py-16">
    {/* HERO TEXT – reuse your existing text/CTAs */}
    <div className={dict.dir === "rtl" ? "md:pl-10 md:text-right" : "md:pr-10 md:text-left"}>
      <p className="text-[1rem] md:text-[1.15rem] font-semibold uppercase tracking-[0.35em] text-kahra_gold">
        {dict.hero.kahrLine}
      </p>
      {/* <h1 className="mt-4 text-3xl font-bold leading-tight md:text-4xl text-kahra_cream">
        {dict.lang === "ar" ? (
          <>
            <span>{dict.hero.titleRest}</span>
          </>
        ) : (
          <>
            <span className="block">{dict.hero.titleStrong}</span>
            <span className="block">{dict.hero.titleRest}</span>
          </>
        )}
      </h1> */}<br></br><br></br><br></br><br></br>
      <p className="mt-4 text-sm leading-relaxed text-kahra_cream/80 md:text-[1rem]">
        {dict.hero.subtitle}
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <a
          href={"#best-sellers"}
          className="rounded-full bg-kahra_gold px-6 py-3 text-[0.8rem] font-semibold uppercase tracking-[0.2em] text-[#0d3b36] shadow-md shadow-kahra_gold/40 hover:bg-[#9c6223]"
        >
          {dict.hero.ctaPrimary}
        </a>
        <a
          href={"#about"}
          className="rounded-full border border-kahra_gold px-6 py-3 text-[0.8rem] font-semibold uppercase tracking-[0.2em] text-kahra_gold hover:bg-kahra_deep/60"
        >
          {dict.hero.ctaSecondary}
        </a>
      </div>

      <div className="mt-6 flex flex-wrap gap-6 text-[0.85rem] text-kahra_cream/70">
        <div>
          <p className="font-semibold text-kahra_gold">
            {dict.hero.badgeLeft}
          </p>
        </div>
        <div>
          <p className="font-semibold text-kahra_gold">
            {dict.hero.badgeRight}
          </p>
        </div>
      </div>
    </div>

    {/* RIGHT SIDE: FLOATING JEWELLERY LAYERS */}
    <div className="md:w-1/2">
      <div className="relative mx-auto h-[340px] max-w-md md:h-[380px]">
        {/* hanging garland (hero-amber-garland.png) */}
        

        {/* bracelet path in the snow (hero-amber-bracelet-path.png) */}
        <Image
          src="/images/hero-amber-bracelet-path.png"
          alt="Amber bracelet forming a glowing path in the snow"
          width={520}
          height={260}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 animate-amber-float-1 object-contain"
          priority
        />

        {/* your real product photo in front */}
        <Image
          src="/images/hero-1.png" // or whatever product image you want
          alt={heroCategory?.name[currentLang] ?? "Kahramani amber bracelet"}
          width={320}
          height={320}
          className="absolute bottom-4 right-2 rounded-3xl bg-[#0b2b27]/80 p-3 shadow-soft-xl animate-amber-float-3 object-contain"
          priority
        />
      </div>
    </div>
  </div>
</section>


      {/* FEATURED SECTION */}
      <section
        id="featured"
        className="mx-auto max-w-6xl px-4 py-10 md:py-14"
      >
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h2 className="text-2xl font-semibold text-kahra_cream">
              {dict.featured.title}
            </h2>
            <p className="mt-2 text-sm text-kahra_cream/70">
              {dict.featured.subtitle}
            </p>
          </div>
          <a
            href={`/catalog?lang=${currentLang}`}
            className="text-xs font-semibold uppercase tracking-[0.18em] text-kahra_gold hover:underline"
          >
            {dict.featured.viewAll}
          </a>
        </div>

        {/* BEST SELLERS */}
        <section id="best-sellers" className="mt-6">
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-kahra_gold">
            {dict.featured.bestSellers}
          </h3>
          <div className="mt-3 grid gap-5 md:grid-cols-3">
            {bestSellers.map((p) => (
              <article
                key={p.id}
                className="group flex flex-col overflow-hidden rounded-3xl bg-kahra_deep/40 border border-kahra_gold/40 shadow-soft-xl hover:-translate-y-1 transition"
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
                  <h4 className="text-sm font-semibold text-kahra_cream">
                    {p.name[currentLang]}
                  </h4>
                  <p className="mt-1 text-xs text-kahra_cream/70">
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
                  className="group flex flex-col overflow-hidden rounded-3xl bg-[#0b2b27] border border-kahra_goldSoft/60 shadow-soft-xl hover:-translate-y-1 transition"
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
                    <h4 className="text-sm font-semibold text-kahra_cream">
                      {p.name[currentLang]}
                    </h4>
                    <p className="mt-1 text-xs text-kahra_cream/70">
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
        className="border-t border-kahra_gold/40 bg-[#091f1c] py-10 text-kahra_cream"
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 md:flex-row md:items-center md:justify-between">
          <div className="md:w-2/3">
            <h2 className="text-xl font-semibold">{dict.about.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-kahra_cream/80">
              {dict.about.paragraph1}
            </p>
          </div>
          <div className="space-y-1 text-sm text-kahra_cream/80 md:w-1/3">
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
