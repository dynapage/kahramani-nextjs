"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getDictionary, type Dictionary } from "../lib/dictionary";
import { Suspense, useCallback, useEffect, useState, useMemo } from "react";

interface HeaderProps {
  lang?: string;
}

function HeaderContent({ lang }: HeaderProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const urlLang = searchParams.get("lang");
  const resolvedLang = urlLang === "en" || lang === "en" ? "en" : "ar";
  const dict: Dictionary = getDictionary(resolvedLang);
  const currentLang = dict.lang;
  const otherLang = currentLang === "ar" ? "en" : "ar";
  
  const isHomePage = pathname === "/";

  // ✅ FIX: Memoize searchParams string for stable dependency
  const searchParamsString = useMemo(() => {
    return searchParams.toString();
  }, [searchParams]);

  // ✅ FIX: Stable dependencies - no mounted, use searchParamsString
  const buildLink = useCallback((href: string) => {
    const params = new URLSearchParams(searchParamsString);
    params.set("lang", currentLang);
    const query = params.toString();
    return query ? `${href}?${query}` : href;
  }, [searchParamsString, currentLang]);

  // ✅ FIX: Stable dependencies for language toggle
  const handleLanguageToggle = useCallback(() => {
    const params = new URLSearchParams(searchParamsString);
    params.set("lang", otherLang);
    const query = params.toString();

    document.cookie = `kahra_lang=${otherLang}; path=/; max-age=31536000; SameSite=Lax`;

    router.push(query ? `${pathname}?${query}` : pathname);
    setMobileMenuOpen(false);
  }, [searchParamsString, otherLang, pathname, router]);

  const handleMobileMenuToggle = useCallback(() => {
    setMobileMenuOpen(prev => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  // Static header during SSR
  if (!mounted) {
    return (
      <header className="border-b border-kahra_gold/20 bg-white/95 backdrop-blur-sm sticky top-0 z-50">
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
          <div className="h-8 w-16 bg-kahra_gold/10 rounded-full" />
        </div>
      </header>
    );
  }

  return (
    <header className="border-b border-kahra_gold/20 bg-white/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* ✅ FIX: Only render Link when NOT on homepage, so it always has content */}
        {!isHomePage ? (
          <Link href={buildLink("/")} className="flex items-center gap-3">
            <div className="relative h-10 w-32">
              <Image
                src="/images/kahramani-logo.svg"
                alt="Kahramani logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>
        ) : (
          <div className="flex items-center gap-3">
            {/* Empty space on homepage for layout consistency */}
          </div>
        )}

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <Link 
            href={buildLink("/")} 
            className="text-gray-700 hover:text-kahra_gold transition-colors duration-200"
          >
            {dict.nav.home}
          </Link>
          <Link 
            href={buildLink("/catalog")} 
            className="text-gray-700 hover:text-kahra_gold transition-colors duration-200"
          >
            {dict.nav.catalog}
          </Link>
          <Link 
            href={buildLink("/about")} 
            className="text-gray-700 hover:text-kahra_gold transition-colors duration-200"
          >
            {dict.nav.about}
          </Link>
          <Link 
            href={buildLink("/contact")} 
            className="text-gray-700 hover:text-kahra_gold transition-colors duration-200"
          >
            {dict.nav.contact}
          </Link>

          <div className="mx-2 h-5 w-px bg-kahra_gold/30" />

          <button
            type="button"
            onClick={handleLanguageToggle}
            className="rounded-full border border-kahra_gold/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-kahra_gold hover:bg-kahra_gold hover:text-white transition-colors duration-200"
          >
            {dict.nav.languageShort}
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-3 md:hidden">
          <button
            type="button"
            onClick={handleLanguageToggle}
            className="rounded-full border border-kahra_gold/60 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-kahra_gold"
          >
            {dict.nav.languageShort}
          </button>
          
          <button
            type="button"
            onClick={handleMobileMenuToggle}
            className="p-2 text-gray-700 hover:text-kahra_gold"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <nav className="md:hidden border-t border-kahra_gold/20 bg-white/95 backdrop-blur-sm">
          <div className="px-4 py-3 space-y-3">
            <Link 
              href={buildLink("/")} 
              onClick={closeMobileMenu}
              className="block py-2 text-gray-700 hover:text-kahra_gold transition-colors duration-200"
            >
              {dict.nav.home}
            </Link>
            <Link 
              href={buildLink("/catalog")} 
              onClick={closeMobileMenu}
              className="block py-2 text-gray-700 hover:text-kahra_gold transition-colors duration-200"
            >
              {dict.nav.catalog}
            </Link>
            <Link 
              href={buildLink("/about")} 
              onClick={closeMobileMenu}
              className="block py-2 text-gray-700 hover:text-kahra_gold transition-colors duration-200"
            >
              {dict.nav.about}
            </Link>
            <Link 
              href={buildLink("/contact")} 
              onClick={closeMobileMenu}
              className="block py-2 text-gray-700 hover:text-kahra_gold transition-colors duration-200"
            >
              {dict.nav.contact}
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}

function HeaderFallback() {
  return (
    <header className="border-b border-kahra_gold/20 bg-white/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="h-10 w-32 bg-kahra_gold/10 rounded" />
        <div className="h-8 w-16 bg-kahra_gold/10 rounded-full" />
      </div>
    </header>
  );
}

export function SiteHeader({ lang }: HeaderProps) {
  return (
    <Suspense fallback={<HeaderFallback />}>
      <HeaderContent lang={lang} />
    </Suspense>
  );
}