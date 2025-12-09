"use client";

import Link from "next/link";

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

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showPages = 5;
    
    if (totalPages <= showPages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
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
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Pagination">
      {/* Previous Button */}
      {hasPreviousPage ? (
        <Link
          href={buildPageUrl(currentPage - 1)}
          className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-kahra_gold hover:text-white hover:border-kahra_gold transition-all"
        >
          <span>←</span>
          <span>{currentLang === "ar" ? "السابق" : "Previous"}</span>
        </Link>
      ) : (
        <span className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-400 bg-gray-100 border border-gray-200 rounded-full cursor-not-allowed">
          <span>←</span>
          <span>{currentLang === "ar" ? "السابق" : "Previous"}</span>
        </span>
      )}

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {pageNumbers.map((page, index) => {
          if (page === "...") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-3 py-2 text-sm text-gray-500"
              >
                ...
              </span>
            );
          }

          const pageNum = page as number;
          const isActive = pageNum === currentPage;

          return (
            <Link
              key={pageNum}
              href={buildPageUrl(pageNum)}
              className={`min-w-[40px] px-3 py-2 text-sm font-medium text-center rounded-full transition-all ${
                isActive
                  ? "bg-kahra_gold text-white shadow-md"
                  : "text-gray-700 bg-white border border-gray-300 hover:bg-kahra_gold/10 hover:border-kahra_gold"
              }`}
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
          className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-kahra_gold hover:text-white hover:border-kahra_gold transition-all"
        >
          <span>{currentLang === "ar" ? "التالي" : "Next"}</span>
          <span>→</span>
        </Link>
      ) : (
        <span className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-400 bg-gray-100 border border-gray-200 rounded-full cursor-not-allowed">
          <span>{currentLang === "ar" ? "التالي" : "Next"}</span>
          <span>→</span>
        </span>
      )}
    </nav>
  );
}