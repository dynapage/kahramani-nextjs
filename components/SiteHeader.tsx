"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getDictionary, type Dictionary } from "../lib/dictionary";
import { Suspense, useEffect, useState } from "react";

interface HeaderProps {
  lang?: string;
}

function HeaderContent({ lang }: HeaderProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const urlLang = searchParams.get("lang");
  const resolvedLang = urlLang === "en" || lang === "en" ? "en" : "ar";
  const dict: Dictionary = getDictionary(resolvedLang);
  const currentLang = dict.lang;
  const otherLang = currentLang === "ar" ? "en" : "ar";
  
  const isHomePage = pathname === "/";

  const buildLink = (href: string) => {
    if (!mounted) return href;
    const params = new URLSearchParams(searchParams.toString());
    params.set("lang", currentLang);
    const query = params.toString();
    return query ? `${href}?${query}` : href;
  };

  const handleLanguageToggle = () => {
    if (!mounted) return;
    
    const params = new URLSearchParams(searchParams.toString());
    params.set("lang", otherLang);
    const query = params.toString();

    document.cookie = `kahra_lang=${otherLang}; path=/; max-age=31536000; SameSite=Lax`;

    router.push(query ? `${pathname}?${query}` : pathname);
  };

  if (!mounted) {
    // Return a simplified header during SSR to prevent hydration mismatch
    return (
      <header className="border-b border-kahra_gold/20 bg-kahra_gold/10 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            {!isHomePage && (
              <div className="relative h-10 w-32">
                <Image
                  src="/images/kahramani-logo.svg"
                  alt="Kahramani logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            )}
          </div>
          <div className="h-8 w-16 bg-kahra_gold/10 rounded-full animate-pulse" />
        </div>
      </header>
    );
  }

  return (
    <header className="border-b border-kahra_gold/20 bg-kahra_gold/10 backdrop-blur-md sticky top-0 z-50">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href={buildLink("/")} className="flex items-center gap-3">
          {!isHomePage && (
            <div className="relative h-10 w-32">
              <Image
                src="/images/kahramani-logo.svg"
                alt="Kahramani logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          )}
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <Link 
            href={buildLink("/")} 
            className="text-gray-700 hover:text-kahra_gold transition-colors"
          >
            {dict.nav.home}
          </Link>
          <Link 
            href={buildLink("/catalog")} 
            className="text-gray-700 hover:text-kahra_gold transition-colors"
          >
            {dict.nav.catalog}
          </Link>
          <Link 
            href={buildLink("/about")} 
            className="text-gray-700 hover:text-kahra_gold transition-colors"
          >
            {dict.nav.about}
          </Link>
          <Link 
            href={buildLink("/contact")} 
            className="text-gray-700 hover:text-kahra_gold transition-colors"
          >
            {dict.nav.contact}
          </Link>

          <div className="mx-2 h-5 w-px bg-kahra_gold/30" />

          <button
            type="button"
            onClick={handleLanguageToggle}
            className="rounded-full border border-kahra_gold/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-kahra_gold hover:bg-kahra_gold hover:text-white transition-all"
          >
            {dict.nav.languageShort}
          </button>
        </nav>

        <div className="md:hidden">
          <button
            type="button"
            onClick={handleLanguageToggle}
            className="rounded-full border border-kahra_gold/60 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-kahra_gold"
          >
            {dict.nav.languageShort}
          </button>
        </div>
      </div>
    </header>
  );
}

export function SiteHeader({ lang }: HeaderProps) {
  return (
    <Suspense fallback={
      <header className="border-b border-kahra_gold/20 bg-kahra_gold/10 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="h-10 w-32 bg-kahra_gold/10 rounded animate-pulse" />
          <div className="h-8 w-16 bg-kahra_gold/10 rounded-full animate-pulse" />
        </div>
      </header>
    }>
      <HeaderContent lang={lang} />
    </Suspense>
  );
}