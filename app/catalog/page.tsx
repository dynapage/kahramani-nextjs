import Link from "next/link";
import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";
import { getDictionary } from "../../lib/dictionary";
import { Suspense } from "react";
import { fetchProducts } from "../../lib/apiProducts";
import { ProductCard } from "../../components/ProductCard";
import { Pagination } from "../../components/Pagination";

interface CatalogProps {
  searchParams?: Promise<{ lang?: string; category?: string; page?: string }>;
}

// Category mapping for display - Pendants and Necklaces combined
const categories = [
  { slug: "rings", ar: "خواتم", en: "Rings" },
  { slug: "bracelets", ar: "أساور", en: "Bracelets" },
  { slug: "earrings", ar: "أقراط", en: "Earrings" },
  { slug: "necklaces", ar: "قلائد", en: "Necklaces & Pendants" },
  { slug: "sets", ar: "أطقم عنبر", en: "Sets (Rosery)" },
];

export default async function CatalogPage({ searchParams }: CatalogProps) {
  const params = await searchParams;
  const lang = params?.lang;
  const dict = getDictionary(lang);
  const currentLang = dict.lang;
  const categoryParam = params?.category as string | undefined;
  const pageParam = params?.page;
  const currentPage = pageParam ? parseInt(pageParam, 10) : 1;

  // Fetch products from API with pagination (12 per page)
  const productsResponse = await fetchProducts(currentPage, 12, categoryParam);
  const { 
    items: apiProducts, 
    totalCount, 
    totalPages, 
    hasNextPage, 
    hasPreviousPage 
  } = productsResponse;

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-b from-white to-kahra_cream/10">
      <Suspense fallback={null}>
        <SiteHeader lang={lang} />
      </Suspense>

      <section className="mx-auto w-full max-w-6xl px-4 py-6 sm:py-10 md:py-14">
        {/* Header Section */}
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">
              {dict.catalog.title}
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              {dict.featured.subtitle}
            </p>
            {totalCount > 0 && (
              <p className="mt-1 text-xs text-gray-500">
                {currentLang === "ar" 
                  ? `عرض ${apiProducts.length} من ${totalCount} منتج`
                  : `Showing ${apiProducts.length} of ${totalCount} products`}
              </p>
            )}
          </div>

          {/* CATEGORY FILTER - Horizontal scrollable on mobile */}
          <div className="mt-2">
            <span className="block text-xs font-semibold text-gray-700 mb-2">
              {dict.catalog.filterByCategory}:
            </span>
            <div className="flex overflow-x-auto pb-2 gap-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap scrollbar-hide">
              <Link
                href={`/catalog?lang=${currentLang}`}
                className={`flex-shrink-0 rounded-full border px-3 py-1.5 text-xs transition-all whitespace-nowrap ${
                  !categoryParam
                    ? "border-kahra_gold bg-kahra_gold text-white shadow-md"
                    : "border-gray-300 text-gray-600 hover:border-kahra_gold bg-white"
                }`}
              >
                {dict.catalog.allCategories}
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/catalog?category=${cat.slug}&lang=${currentLang}`}
                  className={`flex-shrink-0 rounded-full border px-3 py-1.5 text-xs transition-all whitespace-nowrap ${
                    categoryParam === cat.slug
                      ? "border-kahra_gold bg-kahra_gold text-white shadow-md"
                      : "border-gray-300 text-gray-600 hover:border-kahra_gold bg-white"
                  }`}
                >
                  {currentLang === "ar" ? cat.ar : cat.en}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* PRODUCT GRID - Responsive grid */}
        {apiProducts.length === 0 ? (
          <div className="mt-12 text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <p className="text-gray-600 text-base">
              {currentLang === "ar" 
                ? "لا توجد منتجات متاحة حالياً"
                : "No products available at the moment"}
            </p>
            <Link
              href={`/catalog?lang=${currentLang}`}
              className="inline-block mt-4 text-kahra_gold hover:underline text-sm"
            >
              {currentLang === "ar" ? "عرض جميع المنتجات" : "View all products"}
            </Link>
          </div>
        ) : (
          <>
            {/* Grid: 1 col on mobile, 2 on sm, 3 on md+ */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {apiProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  currentLang={currentLang}
                  dict={dict}
                />
              ))}
            </div>

            {/* PAGINATION */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              hasNextPage={hasNextPage}
              hasPreviousPage={hasPreviousPage}
              currentLang={currentLang}
              category={categoryParam}
            />
          </>
        )}
      </section>

      <SiteFooter />
    </main>
  );
}
