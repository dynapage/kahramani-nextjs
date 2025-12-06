import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";
import { getDictionary } from "../../lib/dictionary";

interface AboutProps {
  searchParams?: { lang?: string };
}

export default function AboutPage({ searchParams }: AboutProps) {
  const lang = searchParams?.lang;
  const dict = getDictionary(lang);

  return (
    <main className="flex min-h-screen flex-col">
      <SiteHeader lang={lang} />

      <section className="mx-auto max-w-4xl px-4 py-10 md:py-14">
        <h1 className="text-2xl font-semibold text-kahra_cream">
          {dict.about.title}
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-kahra_cream/80">
          {dict.about.paragraph1}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-kahra_cream/80">
          {dict.about.paragraph2}
        </p>

        <h2 className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-kahra_gold">
          {dict.about.valuesTitle}
        </h2>
        <ul className="mt-3 space-y-1 text-sm text-kahra_cream/80">
          {dict.about.values.map((v, idx) => (
            <li key={idx}>• {v}</li>
          ))}
        </ul>
      </section>

      <SiteFooter />
    </main>
  );
}
