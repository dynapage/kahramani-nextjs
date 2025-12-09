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
       // console.log(`[ProductCard] Fetching images for: ${product.name}`);
        
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
       //     console.log(`[ProductCard] Received ${data.images.length} images for ${product.name}`);
            
            // Load images progressively
            const allImages = data.images.filter((img: string) => img && img.length > 0);
            
            if (allImages.length > 0) {
              // Start with first image
              setImages([allImages[0]]);
              setCurrentImageIndex(0);
              
              // Load remaining images one by one with a slight delay
              allImages.slice(1).forEach((img: string, idx: number) => {
                setTimeout(() => {
                  if (isMounted) {
                    setImages(prev => [...prev, img]);
                  }
                }, (idx + 1) * 300); // 300ms delay between each image
              });
            } else {
              console.warn(`[ProductCard] No valid images for ${product.name}`);
              setImages(["/images/placeholder.png"]);
            }
          } else {
            console.warn(`[ProductCard] Empty or invalid response for ${product.name}`);
            setImages(["/images/placeholder.png"]);
          }
        } else {
          if (isMounted) {
            console.error(`[ProductCard] API error for ${product.name}: ${response.status}`);
            setImageError(true);
            setImages(["/images/placeholder.png"]);
          }
        }
      } catch (err) {
        if (isMounted && err instanceof Error && err.name !== 'AbortError') {
          console.error(`[ProductCard] Exception for ${product.name}:`, err.message);
          setImageError(true);
          setImages(["/images/placeholder.png"]);
        }
      } finally {
        if (isMounted) {
          setLoadingImages(false);
        }
      }
    };

    // Small delay before loading images to let product details render first
    const timer = setTimeout(() => {
      loadImages();
    }, 100);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      controller.abort();
    };
  }, [product.id, product.name]);

  const formatPrice = (price: number) => {
    return currentLang === "ar"
      ? `${price.toFixed(3)} ر.ع`
      : `${price.toFixed(2)} OMR`;
  };

  // Determine if we're showing placeholder
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
              alt={product.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
              loading="lazy"
              unoptimized={images[currentImageIndex]?.startsWith('data:') || false}
              onError={() => {
                if (!imageError && !isPlaceholder) {
                  console.error(`[ProductCard] Image render error for ${product.name}`);
                  setImageError(true);
                  setImages(["/images/placeholder.png"]);
                }
              }}
            />
            
            {/* Loading overlay for progressive image loading */}
            {loadingImages && !isPlaceholder && (
              <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-kahra_gold"></div>
              </div>
            )}
          </>
        )}
        
        {/* Image count indicator */}
        {hasMultipleImages && !loadingImages && (
          <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
            {currentImageIndex + 1} / {images.length} {currentLang === "ar" ? "صور" : "images"}
          </div>
        )}
        
        {/* Image navigation arrows for multiple images */}
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

      {/* Product Info - Always visible, loads immediately */}
      <div className="px-5 py-4">
        <h2 className="text-base font-semibold text-gray-800 line-clamp-2">
          {product.name}
        </h2>
        
        <p className="mt-2 text-sm text-gray-600 leading-relaxed line-clamp-3">
          {product.descriptionAr}
        </p>
        
        <div className="mt-3 flex items-center justify-between">
          <p className="text-sm font-semibold text-kahra_gold">
            {dict.catalog.from} {formatPrice(product.listPrice)}
          </p>
          
          <span className="text-xs text-green-600 font-medium">
            {dict.catalog.inStock}
          </span>
        </div>
      </div>
    </article>
  );
}