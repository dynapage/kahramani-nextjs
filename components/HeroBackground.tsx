"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";

/**
 * HeroBackground Component - Optimized for slow connections
 * 
 * Strategy for 2.7MB video:
 * 1. Show static poster image IMMEDIATELY (fast first paint)
 * 2. Load video in background ONLY on fast connections
 * 3. On slow connections or data saver mode: show only static image
 * 4. On mobile: always show static image (saves data + prevents crashes)
 * 
 * Required files in /public:
 * - /images/hero-poster.jpg (compressed, ~50-100KB) - shown immediately
 * - /videos/hero.mp4 (2.7MB) - loaded lazily on desktop with fast connection
 */

type ConnectionSpeed = 'slow' | 'fast' | 'unknown';

export function HeroBackground() {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(true);
  const [connectionSpeed, setConnectionSpeed] = useState<ConnectionSpeed>('unknown');
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setMounted(true);

    // Detect device type
    const checkDevice = () => {
      const userAgent = navigator.userAgent || '';
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
      const isSmallScreen = window.innerWidth < 768;
      const isIOS = /iPad|iPhone|iPod/.test(userAgent) || 
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      
      setIsMobile(isMobileDevice || isSmallScreen || isIOS);
    };

    // Detect connection speed
    const checkConnection = () => {
      const nav = navigator as Navigator & {
        connection?: {
          effectiveType?: string;
          saveData?: boolean;
          downlink?: number;
        };
      };

      if (nav.connection) {
        // User has data saver enabled - respect it
        if (nav.connection.saveData) {
          setConnectionSpeed('slow');
          return;
        }

        // Check effective connection type
        const effectiveType = nav.connection.effectiveType;
        if (effectiveType === '4g' && (nav.connection.downlink ?? 0) >= 5) {
          setConnectionSpeed('fast');
        } else if (effectiveType === 'slow-2g' || effectiveType === '2g' || effectiveType === '3g') {
          setConnectionSpeed('slow');
        } else {
          // Default to fast on desktop with unknown speed
          setConnectionSpeed('fast');
        }
      } else {
        // No Network Information API - assume fast on desktop
        setConnectionSpeed('fast');
      }
    };

    checkDevice();
    checkConnection();

    window.addEventListener('resize', checkDevice);
    
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // Lazy load video only when conditions are met
  useEffect(() => {
    if (!mounted || isMobile || connectionSpeed === 'slow') {
      return;
    }

    // Only load video on desktop with fast connection
    if (connectionSpeed === 'fast' && videoRef.current) {
      const video = videoRef.current;
      
      // Use Intersection Observer to only load when visible
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !videoLoaded) {
              // Start loading video
              video.load();
            }
          });
        },
        { threshold: 0.1 }
      );

      observer.observe(video);

      return () => observer.disconnect();
    }
  }, [mounted, isMobile, connectionSpeed, videoLoaded]);

  const handleVideoLoaded = () => {
    setVideoLoaded(true);
    // Small delay before showing video to ensure smooth transition
    setTimeout(() => setShowVideo(true), 100);
  };

  // SSR / Not mounted - show poster immediately
  if (!mounted) {
    return (
      <div className="absolute inset-0">
        <Image
          src="/images/hero-poster.jpg"
          alt="Kahramani amber jewelry"
          fill
          priority
          className="object-cover"
          sizes="100vw"
          quality={75}
        />
      </div>
    );
  }

  // Mobile or slow connection - show only static image
  // if (isMobile || connectionSpeed === 'slow') {
  //   return (
  //     <div className="absolute inset-0">
  //       <Image
  //         src="/images/hero-poster.jpg"
  //         alt="Kahramani amber jewelry"
  //         fill
  //         priority
  //         className="object-cover"
  //         sizes="100vw"
  //         quality={75}
  //       />
  //     </div>
  //   );
  // }

  // Desktop with fast connection - show video with poster fallback
  return (
    <div className="absolute inset-0">
      {/* Poster image - always visible initially, fades out when video plays */}
      <div 
        className={`absolute inset-0 transition-opacity duration-1000 ${
          showVideo ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <Image
          src="/images/hero-poster.jpg"
          alt="Kahramani amber jewelry"
          fill
          priority
          className="object-cover"
          sizes="100vw"
          quality={75}
        />
      </div>

      {/* Video - loads lazily, fades in when ready */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="none"
        poster="/images/hero-poster.jpg"
        onCanPlayThrough={handleVideoLoaded}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
          showVideo ? 'opacity-80' : 'opacity-0'
        }`}
      >
        {/* Provide multiple formats for better compatibility */}
        <source src="/videos/hero.webm" type="video/webm" />
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
