import Link from "next/link";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";
import { getDictionary } from "../../lib/dictionary";
import {
  categories,
  getProductsByCategory,
} from "../../data/products";
import { ProductGallery } from "../../components/ProductGallery";

interface CatalogProps {
  searchParams?: { lang?: string; category?: string };
}

export default function CatalogPage({ searchParams }: CatalogProps) {
  const lang = searchParams?.lang;
  const dict = getDictionary(lang);
  const currentLang = dict.lang;
  const categoryParam = searchParams?.category as string | undefined;
  const products = getProductsByCategory(categoryParam);

  const formatPrice = (usd: number, omr: number) => {
    return currentLang === "ar"
      ? `${omr.toFixed(3)} ر.ع · ${usd.toFixed(0)} USD`
      : `${usd.toFixed(0)} USD · ${omr.toFixed(3)} OMR`;
  };

  const categoryLabel = (slug: string) => {
    const cat = categories.find((c) => c.slug === slug);
    if (!cat) return slug;
    return currentLang === "ar" ? cat.ar : cat.en;
  };

  return (
    <main className="flex min-h-screen flex-col">
      <SiteHeader lang={lang} />

      <section className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-kahra_cream">
              {dict.catalog.title}
            </h1>
            <p className="mt-2 text-sm text-kahra_cream/70">
              {dict.featured.subtitle}
            </p>
          </div>

          {/* CATEGORY FILTER */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="font-semibold text-kahra_cream/80">
              {dict.catalog.filterByCategory}:
            </span>
            <Link
              href={`/catalog?lang=${currentLang}`}
              className={`rounded-full border px-3 py-1 ${
                !categoryParam
                  ? "border-kahra_gold bg-kahra_gold text-[#0d3b36]"
                  : "border-kahra_gold/40 text-kahra_cream/80"
              }`}
            >
              {dict.catalog.allCategories}
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/catalog?category=${cat.slug}&lang=${currentLang}`}
                className={`rounded-full border px-3 py-1 ${
                  categoryParam === cat.slug
                    ? "border-kahra_gold bg-kahra_gold text-[#0d3b36]"
                    : "border-kahra_gold/40 text-kahra_cream/80"
                }`}
              >
                {currentLang === "ar" ? cat.ar : cat.en}
              </Link>
            ))}
          </div>
        </div>

        {/* PRODUCT GRID */}
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {products.map((p) => (
            <article
              key={p.id}
              className="group flex flex-col overflow-hidden rounded-3xl bg-kahra_deep/40 border border-kahra_gold/40 shadow-soft-xl"
            >
              <ProductGallery images={p.images} alt={p.name[currentLang]} />
              <div className="px-4 py-4">
                <h2 className="text-sm font-semibold text-kahra_cream">
                  {p.name[currentLang]}
                </h2>
                <p className="mt-1 text-xs text-kahra_cream/70">
                  {p.shortDescription[currentLang]}
                </p>
                <p className="mt-2 text-xs font-semibold text-kahra_gold">
                  {dict.catalog.from} {formatPrice(p.priceUsd, p.priceOmr)}
                </p>
                <p className="mt-1 text-[0.7rem] text-kahra_cream/60">
                  {p.inStock ? dict.catalog.inStock : dict.catalog.outOfStock}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
