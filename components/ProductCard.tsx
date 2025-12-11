"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Image from "next/image";
import type { ApiProduct } from "../lib/apiProducts";
import type { Dictionary } from "../lib/dictionary";

interface ProductCardProps {
  product: ApiProduct;
  currentLang: "ar" | "en";
  dict: Dictionary;
}

export function ProductCard({ product, currentLang, dict }: ProductCardProps) {
  const [images, setImages] = useState<string[]>(["/images/placeholder.png"]);
  const [loadingImages, setLoadingImages] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  
  // ✅ FIX: Use useRef instead of useState for mounted flag
  // This prevents infinite loops in Safari
  const mountedRef = useRef(false);

  // Set mounted flag without triggering re-render
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // ✅ FIX: ONLY product.id in dependencies - NO mounted
  useEffect(() => {
    if (!mountedRef.current) return;
    
    let isMounted = true;
    const controller = new AbortController();

    const loadImages = async () => {
      try {
        const apiUrl = `/api/product-images/${product.id}`;
        
        const response = await fetch(apiUrl, {
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
          },
        });
        
        if (!isMounted) return;

        if (response.ok) {
          const data = await response.json();
          
          if (isMounted && data.images && Array.isArray(data.images) && data.images.length > 0) {
            const allImages = data.images.filter((img: string) => img && img.length > 0);
            
            if (allImages.length > 0) {
              setImages(allImages);
              setCurrentImageIndex(0);
            } else {
              setImages(["/images/placeholder.png"]);
            }
          } else {
            setImages(["/images/placeholder.png"]);
          }
        } else {
          if (isMounted) {
            setImageError(true);
            setImages(["/images/placeholder.png"]);
          }
        }
      } catch (err) {
        if (isMounted && err instanceof Error && err.name !== 'AbortError') {
          setImageError(true);
          setImages(["/images/placeholder.png"]);
        }
      } finally {
        if (isMounted) {
          setLoadingImages(false);
        }
      }
    };

    loadImages();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [product.id]); // ✅ CRITICAL FIX: ONLY product.id

  const productTitle = currentLang === "en" 
    ? (product.titleEn || product.name) 
    : product.name;
  
  const productDescription = currentLang === "en"
    ? (product.descriptionEn || product.descriptionAr)
    : product.descriptionAr;

  const isPlaceholder = images.length === 1 && images[0] === "/images/placeholder.png";
  const hasMultipleImages = images.length > 1 && !isPlaceholder;

  const handlePrevImage = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex(prev => prev === 0 ? images.length - 1 : prev - 1);
  }, [images.length]);

  const handleNextImage = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex(prev => prev === images.length - 1 ? 0 : prev + 1);
  }, [images.length]);

  const handleImageError = useCallback(() => {
    if (!imageError && !isPlaceholder) {
      setImageError(true);
      setImages(["/images/placeholder.png"]);
    }
  }, [imageError, isPlaceholder]);

  const currentImage = images[currentImageIndex] || images[0];
  const isBase64Image = currentImage?.startsWith('data:');

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-300">
      <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
        {loadingImages && isPlaceholder ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-10 h-10 border-2 border-kahra_gold border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            <Image
              src={currentImage}
              alt={productTitle}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
              loading="lazy"
              unoptimized={isBase64Image}
              onError={handleImageError}
            />
            
            {loadingImages && !isPlaceholder && (
              <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-kahra_gold border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </>
        )}
        
        {hasMultipleImages && !loadingImages && (
          <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
            {currentImageIndex + 1} / {images.length}
          </div>
        )}
        
        {hasMultipleImages && !loadingImages && (
          <>
            <button
              type="button"
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors touch-manipulation"
              aria-label="Previous image"
            >
              <span className="text-lg leading-none">‹</span>
            </button>
            <button
              type="button"
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors touch-manipulation"
              aria-label="Next image"
            >
              <span className="text-lg leading-none">›</span>
            </button>
          </>
        )}
      </div>

      <div className="flex flex-col flex-1 p-4">
        <h2 className="text-sm sm:text-base font-semibold text-gray-800 line-clamp-2 leading-snug">
          {productTitle}
        </h2>
        
        <p className="mt-2 text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-2 flex-1">
          {productDescription}
        </p>
        
        {product.productCode && (
          <div className="mt-3 flex items-center justify-end">
            <span className="text-xs text-kahra_gold font-medium bg-kahra_gold/10 px-2 py-1 rounded-full">
              #{product.productCode}
            </span>
          </div>
        )}
      </div>
    </article>
  );
}