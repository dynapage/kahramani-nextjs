import Link from "next/link";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";
import { getDictionary } from "../../lib/dictionary";
import { Suspense } from "react";
import { fetchProducts } from "../../lib/apiProducts";
import { ProductCard } from "../../components/ProductCard";

interface CatalogProps {
  searchParams?: Promise<{ lang?: string; category?: string }>;
}

// Category mapping for display
const categories = [
  { slug: "rings", ar: "خواتم", en: "Rings" },
  { slug: "bracelets", ar: "أساور", en: "Bracelets" },
  { slug: "earrings", ar: "أقراط", en: "Earrings" },
  { slug: "pendants", ar: "قلائد", en: "Pendants" },
  { slug: "necklaces", ar: "قلائد", en: "Necklaces" },
  { slug: "sets", ar: "أطقم عنبر", en: "Sets (Rosery)" },
];

export default async function CatalogPage({ searchParams }: CatalogProps) {
  const params = await searchParams;
  const lang = params?.lang;
  const dict = getDictionary(lang);
  const currentLang = dict.lang;
  const categoryParam = params?.category as string | undefined;

  // Fetch products from API
  const apiProducts = await fetchProducts(1, 50, categoryParam);

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

          {/* CATEGORY FILTER */}
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

        {/* PRODUCT GRID */}
        {apiProducts.length === 0 ? (
          <div className="mt-12 text-center">
            <p className="text-gray-600">
              {currentLang === "ar" 
                ? "لا توجد منتجات متاحة حالياً"
                : "No products available at the moment"}
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {apiProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                currentLang={currentLang}
                dict={dict}
              />
            ))}
          </div>
        )}
      </section>

      <SiteFooter />
    </main>
  );
}