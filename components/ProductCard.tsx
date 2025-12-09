"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { ApiProduct } from "../lib/apiProducts";
import type { Dictionary } from "../lib/dictionary";

interface ProductCardProps {
  product: ApiProduct;
  currentLang: "ar" | "en";
  dict: Dictionary;
}

export function ProductCard({ product, currentLang, dict }: ProductCardProps) {
  // Start with placeholder - show product details immediately
  const [images, setImages] = useState<string[]>(["/images/placeholder.png"]);
  const [loadingImages, setLoadingImages] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
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
              setImages([allImages[0]]);
              setCurrentImageIndex(0);
              
              allImages.slice(1).forEach((img: string, idx: number) => {
                setTimeout(() => {
                  if (isMounted) {
                    setImages(prev => [...prev, img]);
                  }
                }, (idx + 1) * 300);
              });
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

    const timer = setTimeout(() => {
      loadImages();
    }, 100);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      controller.abort();
    };
  }, [product.id, product.name]);

  // Get the appropriate title and description based on language
  const productTitle = currentLang === "en" 
    ? (product.titleEn || product.name) 
    : product.name;
  
  const productDescription = currentLang === "en"
    ? (product.descriptionEn || product.descriptionAr)
    : product.descriptionAr;

  const isPlaceholder = images.length === 1 && images[0] === "/images/placeholder.png";
  const hasMultipleImages = images.length > 1 && !isPlaceholder;

  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl bg-white border border-gray-200 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {/* Image Section */}
      <div className="relative h-64 w-full overflow-hidden bg-gray-100">
        {loadingImages && isPlaceholder ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-kahra_gold"></div>
          </div>
        ) : (
          <>
            <Image
              src={images[currentImageIndex] || images[0]}
              alt={productTitle}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
              loading="lazy"
              unoptimized={images[currentImageIndex]?.startsWith('data:') || false}
              onError={() => {
                if (!imageError && !isPlaceholder) {
                  setImageError(true);
                  setImages(["/images/placeholder.png"]);
                }
              }}
            />
            
            {loadingImages && !isPlaceholder && (
              <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-kahra_gold"></div>
              </div>
            )}
          </>
        )}
        
        {hasMultipleImages && !loadingImages && (
          <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
            {currentImageIndex + 1} / {images.length} {currentLang === "ar" ? "صور" : "images"}
          </div>
        )}
        
        {hasMultipleImages && !loadingImages && (
          <>
            <button
              onClick={(e) => {
                e.preventDefault();
                setCurrentImageIndex(prev => prev === 0 ? images.length - 1 : prev - 1);
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full w-8 h-8 flex items-center justify-center transition-all"
            >
              ‹
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                setCurrentImageIndex(prev => prev === images.length - 1 ? 0 : prev + 1);
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white rounded-full w-8 h-8 flex items-center justify-center transition-all"
            >
              ›
            </button>
          </>
        )}
      </div>

      {/* Product Info */}
      <div className="px-5 py-4">
        <h2 className="text-base font-semibold text-gray-800 line-clamp-2">
          {productTitle}
        </h2>
        
        <p className="mt-2 text-sm text-gray-600 leading-relaxed line-clamp-3">
          {productDescription}
        </p>
        
        <div className="mt-3 flex items-center justify-end">
          {product.productCode && (
            <span className="text-xs text-kahra_gold font-medium bg-kahra_gold/10 px-2 py-1 rounded-full">
              #{product.productCode}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}