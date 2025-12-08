import Link from "next/link";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";
import { getDictionary } from "../../lib/dictionary";
import { Suspense } from "react";

import {
  categories,
  getProductsByCategory,
} from "../../data/products";
import { ProductGallery } from "../../components/ProductGallery";

interface CatalogProps {
  searchParams?: Promise<{ lang?: string; category?: string }>;
}

export default async function CatalogPage({ searchParams }: CatalogProps) {
  const params = await searchParams;
  const lang = params?.lang;
  const dict = getDictionary(lang);
  const currentLang = dict.lang;
  const categoryParam = params?.category as string | undefined;
  const products = getProductsByCategory(categoryParam);

  const formatPrice = (usd: number, omr: number) => {
    return currentLang === "ar"
      ? `${omr.toFixed(3)} ر.ع · ${usd.toFixed(0)} USD`
      : `${usd.toFixed(0)} USD · ${omr.toFixed(3)} OMR`;
  };

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-b from-white to-kahra_cream/10">
     <Suspense fallback={null}>
        <SiteHeader lang={lang} />
      </Suspense>

      <section className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-800">
              {dict.catalog.title}
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              {dict.featured.subtitle}
            </p>
          </div>

          {/* CATEGORY FILTER - Fixed */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="font-semibold text-gray-700">
              {dict.catalog.filterByCategory}:
            </span>
            <Link
              href={`/catalog?lang=${currentLang}`}
              className={`rounded-full border px-3 py-1.5 transition-all ${
                !categoryParam
                  ? "border-kahra_gold bg-kahra_gold text-white shadow-md"
                  : "border-gray-300 text-gray-600 hover:border-kahra_gold"
              }`}
            >
              {dict.catalog.allCategories}
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/catalog?category=${cat.slug}&lang=${currentLang}`}
                className={`rounded-full border px-3 py-1.5 transition-all ${
                  categoryParam === cat.slug
                    ? "border-kahra_gold bg-kahra_gold text-white shadow-md"
                    : "border-gray-300 text-gray-600 hover:border-kahra_gold"
                }`}
              >
                {currentLang === "ar" ? cat.ar : cat.en}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {products.map((p) => (
            <article
              key={p.id}
              className="group flex flex-col overflow-hidden rounded-3xl bg-white border border-gray-200 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <ProductGallery images={p.images} alt={p.name[currentLang]} />
              <div className="px-5 py-4">
                <h2 className="text-base font-semibold text-gray-800">
                  {p.name[currentLang]}
                </h2>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                  {p.shortDescription[currentLang]}
                </p>
                <p className="mt-3 text-sm font-semibold text-kahra_gold">
                  {dict.catalog.from} {formatPrice(p.priceUsd, p.priceOmr)}
                </p>
                <p className="mt-1 text-xs text-gray-500">
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