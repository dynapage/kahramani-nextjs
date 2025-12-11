"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";

interface ProductGalleryCardProps {
  images: string[];
  name: string;
  description: string;
  price?: string;
  currentLang: "ar" | "en";
  priority?: boolean;
  isOffer?: boolean;
}

export function ProductGalleryCard({
  images,
  name,
  description,
  price,
  currentLang,
  priority = false,
  isOffer = false,
}: ProductGalleryCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  
  // ✅ FIX: Use useRef instead of useState for mounted flag
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const validImages = images && images.length > 0 ? images : ["/images/placeholder.png"];
  const hasMultipleImages = validImages.length > 1;

  const goToPrevious = useCallback((e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setCurrentIndex((prev) => (prev === 0 ? validImages.length - 1 : prev - 1));
  }, [validImages.length]);

  const goToNext = useCallback((e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setCurrentIndex((prev) => (prev === validImages.length - 1 ? 0 : prev + 1));
  }, [validImages.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  const minSwipeDistance = 50;

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  }, []);

  const onTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe && hasMultipleImages) {
      goToNext();
    }
    if (isRightSwipe && hasMultipleImages) {
      goToPrevious();
    }
  }, [touchStart, touchEnd, hasMultipleImages, goToNext, goToPrevious]);

  // ✅ FIX: Use mountedRef.current instead of mounted state
  const showControls = mountedRef.current && hasMultipleImages;

  return (
    <article 
      className={`group flex flex-col overflow-hidden rounded-2xl bg-white border shadow-md hover:shadow-xl transition-shadow duration-300 ${
        isOffer ? "border-kahra_gold/30" : "border-gray-200"
      }`}
    >
      <div 
        className="relative aspect-square w-full overflow-hidden bg-gray-100"
        onTouchStart={hasMultipleImages ? onTouchStart : undefined}
        onTouchMove={hasMultipleImages ? onTouchMove : undefined}
        onTouchEnd={hasMultipleImages ? onTouchEnd : undefined}
      >
        <Image
          src={validImages[currentIndex]}
          alt={name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority={priority}
          loading={priority ? "eager" : "lazy"}
        />

        {showControls && (
          <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full z-10">
            {currentIndex + 1} / {validImages.length}
          </div>
        )}

        {showControls && (
          <>
            <button
              type="button"
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-8 h-8 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 sm:opacity-70 touch-manipulation z-10"
              aria-label={currentLang === "ar" ? "الصورة السابقة" : "Previous image"}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              type="button"
              onClick={goToNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-8 h-8 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 sm:opacity-70 touch-manipulation z-10"
              aria-label={currentLang === "ar" ? "الصورة التالية" : "Next image"}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {showControls && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {validImages.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all touch-manipulation ${
                  index === currentIndex
                    ? "bg-white w-4"
                    : "bg-white/50 hover:bg-white/80"
                }`}
                aria-label={`${currentLang === "ar" ? "انتقل إلى الصورة" : "Go to image"} ${index + 1}`}
              />
            ))}
          </div>
        )}

        {showControls && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/70 text-xs sm:hidden pointer-events-none">
            {currentLang === "ar" ? "اسحب للمزيد" : "Swipe for more"}
          </div>
        )}
      </div>

      {validImages.length > 3 && mountedRef.current && (
        <div className="flex gap-1 p-2 bg-gray-50 overflow-x-auto scrollbar-hide">
          {validImages.map((img, index) => (
            <button
              key={index}
              type="button"
              onClick={() => goToSlide(index)}
              className={`relative flex-shrink-0 w-12 h-12 rounded overflow-hidden transition-all touch-manipulation ${
                index === currentIndex
                  ? "ring-2 ring-kahra_gold"
                  : "opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={img}
                alt={`${name} - ${index + 1}`}
                fill
                className="object-cover"
                sizes="48px"
              />
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-col flex-1 p-4 sm:px-5 sm:py-4">
        <h4 className="text-sm sm:text-base font-semibold text-gray-800 line-clamp-2">
          {name}
        </h4>
        <p className="mt-2 text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-2 flex-1">
          {description}
        </p>
        {price && (
          <p className={`mt-3 text-sm font-bold ${isOffer ? "text-kahra_goldSoft" : "text-kahra_gold"}`}>
            {price}
          </p>
        )}
      </div>
    </article>
  );
}