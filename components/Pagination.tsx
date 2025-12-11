"use client";

import Link from "next/link";
import { useMemo } from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  currentLang: "ar" | "en";
  category?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  hasNextPage,
  hasPreviousPage,
  currentLang,
  category,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const buildPageUrl = (page: number) => {
    const params = new URLSearchParams();
    params.set("lang", currentLang);
    params.set("page", page.toString());
    if (category) {
      params.set("category", category);
    }
    return `/catalog?${params.toString()}`;
  };

  const pageNumbers = useMemo(() => {
    const pages: (number | string)[] = [];
    const showPages = 5;
    
    if (totalPages <= showPages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= Math.min(4, totalPages); i++) {
          pages.push(i);
        }
        if (totalPages > 4) {
          pages.push("...");
          pages.push(totalPages);
        }
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = Math.max(totalPages - 3, 2); i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }
    
    return pages;
  }, [currentPage, totalPages]);

  return (
    <nav className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-1 sm:gap-2" aria-label="Pagination">
      {/* Previous Button */}
      {hasPreviousPage ? (
        <Link
          href={buildPageUrl(currentPage - 1)}
          className="flex items-center gap-1 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-kahra_gold hover:text-white hover:border-kahra_gold transition-colors touch-manipulation"
        >
          <span>←</span>
          <span className="hidden sm:inline">{currentLang === "ar" ? "السابق" : "Previous"}</span>
        </Link>
      ) : (
        <span className="flex items-center gap-1 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-400 bg-gray-100 border border-gray-200 rounded-full cursor-not-allowed">
          <span>←</span>
          <span className="hidden sm:inline">{currentLang === "ar" ? "السابق" : "Previous"}</span>
        </span>
      )}

      {/* Page Numbers - Hide some on mobile */}
      <div className="flex items-center gap-1">
        {pageNumbers.map((page, index) => {
          if (page === "...") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-2 py-2 text-xs sm:text-sm text-gray-500"
              >
                ...
              </span>
            );
          }

          const pageNum = page as number;
          const isActive = pageNum === currentPage;

          // On mobile, only show current page, first, last, and adjacent
          const showOnMobile = pageNum === 1 || 
                               pageNum === totalPages || 
                               pageNum === currentPage ||
                               Math.abs(pageNum - currentPage) === 1;

          return (
            <Link
              key={pageNum}
              href={buildPageUrl(pageNum)}
              className={`min-w-[36px] sm:min-w-[40px] px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium text-center rounded-full transition-colors touch-manipulation ${
                isActive
                  ? "bg-kahra_gold text-white shadow-md"
                  : "text-gray-700 bg-white border border-gray-300 hover:bg-kahra_gold/10 hover:border-kahra_gold"
              } ${showOnMobile ? '' : 'hidden sm:flex sm:items-center sm:justify-center'}`}
            >
              {pageNum}
            </Link>
          );
        })}
      </div>

      {/* Next Button */}
      {hasNextPage ? (
        <Link
          href={buildPageUrl(currentPage + 1)}
          className="flex items-center gap-1 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-kahra_gold hover:text-white hover:border-kahra_gold transition-colors touch-manipulation"
        >
          <span className="hidden sm:inline">{currentLang === "ar" ? "التالي" : "Next"}</span>
          <span>→</span>
        </Link>
      ) : (
        <span className="flex items-center gap-1 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-400 bg-gray-100 border border-gray-200 rounded-full cursor-not-allowed">
          <span className="hidden sm:inline">{currentLang === "ar" ? "التالي" : "Next"}</span>
          <span>→</span>
        </span>
      )}
    </nav>
  );
}
