"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";

/**
 * HeroBackground Component - Progressive Video Loading
 * 
 * Strategy:
 * 1. Show poster image IMMEDIATELY (fast first paint)
 * 2. Load video lazily on ALL devices (mobile + desktop)
 * 3. Video plays AFTER image loads (progressive enhancement)
 * 4. Compatible with iOS 13+ Safari (5+ years old)
 * 
 * Mobile Safari Requirements:
 * - autoPlay only works with muted
 * - playsInline prevents fullscreen
 * - preload="metadata" for better performance
 */

export function HeroBackground() {
  const [mounted, setMounted] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const loadingTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);

    return () => {
      if (loadingTimerRef.current) {
        clearTimeout(loadingTimerRef.current);
      }
    };
  }, []);

  // Progressive video loading - works on ALL devices
  useEffect(() => {
    if (!mounted || !videoRef.current) {
      return;
    }

    const video = videoRef.current;

    // Use IntersectionObserver for lazy loading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Video is in viewport - start loading
            // Wait 500ms after poster loads for smooth transition
            loadingTimerRef.current = setTimeout(() => {
              try {
                // Load video metadata first (not full video)
                video.load();
              } catch (err) {
                console.warn('Video load failed:', err);
                setVideoError(true);
              }
            }, 500);
          }
        });
      },
      { 
        threshold: 0.1,
        rootMargin: '50px' // Start loading slightly before visible
      }
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
      if (loadingTimerRef.current) {
        clearTimeout(loadingTimerRef.current);
      }
    };
  }, [mounted]);

  // Handle video ready to play
  const handleVideoCanPlay = useCallback(() => {
    // Video has enough data to play
    // Fade it in smoothly
    setShowVideo(true);
    
    // Ensure video starts playing (especially important for iOS)
    if (videoRef.current) {
      videoRef.current.play().catch((err) => {
        // Autoplay was blocked - this is OK, video will be visible
        console.warn('Autoplay blocked:', err);
      });
    }
  }, []);

  // Handle video errors
  const handleVideoError = useCallback(() => {
    console.warn('Video failed to load - using poster fallback');
    setVideoError(true);
    setShowVideo(false);
  }, []);

  // Pause video when not visible (save battery/bandwidth)
  useEffect(() => {
    if (!mounted || !videoRef.current) return;

    const video = videoRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {
              // Ignore play errors
            });
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(video);

    return () => observer.disconnect();
  }, [mounted]);

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

  return (
    <div className="absolute inset-0">
      {/* Poster Image - Always visible initially, fades out when video plays */}
      <div 
        className={`absolute inset-0 transition-opacity duration-1000 ${
          showVideo && !videoError ? 'opacity-0' : 'opacity-100'
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

      {/* Video - Loads lazily, plays on ALL devices (mobile + desktop) */}
      {!videoError && (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster="/images/hero-poster.jpg"
          onCanPlay={handleVideoCanPlay}
          onError={handleVideoError}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            showVideo ? 'opacity-80' : 'opacity-0'
          }`}
          // iOS Safari compatibility attributes
          webkit-playsinline="true"
          x5-playsinline="true"
          x-webkit-airplay="allow"
        >
          {/* MP4 first for best iOS compatibility */}
          <source src="/videos/hero.mp4" type="video/mp4" />
          <source src="/videos/hero.webm" type="video/webm" />
        </video>
      )}
    </div>
  );
}