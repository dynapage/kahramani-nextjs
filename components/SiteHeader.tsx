"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getDictionary, type Dictionary } from "../lib/dictionary";

interface HeaderProps {
  lang?: string;
}

export function SiteHeader({ lang }: HeaderProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const urlLang = searchParams.get("lang");
  const resolvedLang = urlLang === "en" || lang === "en" ? "en" : "ar";
  const dict: Dictionary = getDictionary(resolvedLang);
  const currentLang = dict.lang;
  const otherLang = currentLang === "ar" ? "en" : "ar";

  const buildLink = (href: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("lang", currentLang);
    const query = params.toString();
    return query ? `${href}?${query}` : href;
  };

  const handleLanguageToggle = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("lang", otherLang);
    const query = params.toString();

    // persist in cookie for layout (dir / lang on <html>)
    document.cookie = `kahra_lang=${otherLang}; path=/; max-age=31536000`;

    router.push(query ? `${pathname}?${query}` : pathname);
  };

  return (
    // Lighter header: white background with subtle border
    <header className="border-b border-kahra_gold/20 bg-kahra_gold/20 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-2 py-2">
        <Link href={buildLink("/")}> 
          <div className="flex items-center gap-3">
             <div className="Relative h-20 w-136 overflow-hidden">
             
               {/* <Image
                src="/images/kahramani-logo.svg"
                alt="Kahramani logo"
                fill
                className="object-contain p-1.5"
                priority
              /> */}
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-xs font-medium md:flex">
          <Link href={buildLink("/")} className="text-gray-800 hover:text-kahra_gold">
            {dict.nav.home}
          </Link>
          <Link href={buildLink("/catalog")} className="text-gray-800 hover:text-kahra_gold">
            {dict.nav.catalog}
          </Link>
          <Link href={buildLink("/about")} className="text-gray-800 hover:text-kahra_gold">
            {dict.nav.about}
          </Link>
          <Link href={buildLink("/contact")} className="text-gray-800 hover:text-kahra_gold">
            {dict.nav.contact}
          </Link>

          <div className="mx-2 h-5 w-px bg-kahra_gold/20" />

          <button
            type="button"
            onClick={handleLanguageToggle}
            className="rounded-full border border-kahra_gold px-4 py-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-kahra_gold hover:bg-kahra_deep/20"
          >
            {dict.nav.languageShort}
          </button>
        </nav>
      </div>
    </header>
  );
}