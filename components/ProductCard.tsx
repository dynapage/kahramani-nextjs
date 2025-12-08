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
  const [images, setImages] = useState<string[]>(["/images/placeholder.png"]);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const loadImages = async () => {
      try {
        const response = await fetch(`/api/products/${product.id}/images?includeContent=true`, {
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
            "X-Dev-Auth": "admin:testuser",
          },
        });
        
        if (!isMounted) return;

        if (response.ok) {
          const data = await response.json();
          if (isMounted && data.images && Array.isArray(data.images)) {
            setImages(data.images.length > 0 ? data.images : ["/images/placeholder.png"]);
          }
        } else {
          if (isMounted) {
            setImageError(true);
            setImages(["/images/placeholder.png"]);
          }
        }
      } catch (err) {
        if (isMounted && err instanceof Error && err.name !== 'AbortError') {
          console.error("Error loading product images:", err);
          setImageError(true);
          setImages(["/images/placeholder.png"]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadImages();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [product.id]);

  const formatPrice = (price: number) => {
    return currentLang === "ar"
      ? `${price.toFixed(3)} ر.ع`
      : `${price.toFixed(2)} OMR`;
  };

  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl bg-white border border-gray-200 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {/* Image Section */}
      <div className="relative h-64 w-full overflow-hidden bg-gray-100">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-kahra_gold"></div>
          </div>
        ) : (
          <Image
            src={images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
            loading="lazy"
            onError={() => {
              if (!imageError) {
                setImageError(true);
                setImages(["/images/placeholder.png"]);
              }
            }}
          />
        )}
        
        {/* Image count indicator if multiple images */}
        {images.length > 1 && !loading && (
          <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
            {images.length} {currentLang === "ar" ? "صور" : "images"}
          </div>
        )}
      </div>

      {/* Product Info */}
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