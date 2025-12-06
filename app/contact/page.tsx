import { SiteHeader } from "../../components/SiteHeader";
import { SiteFooter } from "../../components/SiteFooter";
import { ContactForm } from "../../components/ContactForm";
import { getDictionary } from "../../lib/dictionary";

interface ContactProps {
  searchParams?: { lang?: string };
}

export default function ContactPage({ searchParams }: ContactProps) {
  const lang = searchParams?.lang;
  const dict = getDictionary(lang);

  return (
    <main className="flex min-h-screen flex-col">
      <SiteHeader lang={lang} />

      <section className="mx-auto max-w-3xl px-4 py-10 md:py-14">
        <h1 className="text-2xl font-semibold text-kahra_cream">
          {dict.contact.title}
        </h1>
        <p className="mt-3 text-sm text-kahra_cream/80">
          {dict.contact.subtitle}
        </p>

        <ContactForm lang={dict.lang} labels={dict.contact} />

        <div className="mt-6 text-[0.8rem] text-kahra_cream/70">
          <p>
            Email:
            {" "}
            <a
              href="mailto:dotcosoft@gmail.com"
              className="font-semibold text-kahra_gold hover:underline"
            >
              dotcosoft@gmail.com
            </a>
          </p>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
