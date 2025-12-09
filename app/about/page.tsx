import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";
import { getDictionary } from "../../lib/dictionary";
import { Suspense } from "react";

interface AboutProps {
  searchParams?: Promise<{ lang?: string }>;
}

export default async function AboutPage({ searchParams }: AboutProps) {
  const params = await searchParams;
  const lang = params?.lang;
  const dict = getDictionary(lang);

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-b from-white to-kahra_cream/10">
      <Suspense fallback={null}>
        <SiteHeader lang={lang} />
      </Suspense>

      <section className="mx-auto w-full max-w-4xl px-4 py-8 sm:py-12 md:py-16">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          {dict.about.title}
        </h1>
        <p className="mt-4 sm:mt-6 text-sm sm:text-base leading-relaxed text-gray-700">
          {dict.about.paragraph1}
        </p>
        <p className="mt-3 sm:mt-4 text-sm sm:text-base leading-relaxed text-gray-700">
          {dict.about.paragraph2}
        </p>

        <h2 className="mt-8 sm:mt-10 text-base sm:text-lg font-semibold uppercase tracking-wider text-kahra_gold">
          {dict.about.valuesTitle}
        </h2>
        <ul className="mt-3 sm:mt-4 space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-700">
          {dict.about.values.map((v, idx) => (
            <li key={idx} className="flex items-start gap-2 sm:gap-3">
              <span className="text-kahra_gold font-bold mt-0.5 flex-shrink-0">✓</span>
              <span>{v}</span>
            </li>
          ))}
        </ul>
      </section>

      <SiteFooter />
    </main>
  );
}
