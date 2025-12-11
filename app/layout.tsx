import "./globals.css";
import type { Metadata, Viewport } from "next";
import type React from "react";

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#b88746',
};

export const metadata: Metadata = {
  title: {
    default: "كهرماني Kahramani | Baltic Amber Jewellery",
    template: "%s | Kahramani",
  },
  description:
    "كهرماني | Kahramani – Baltic amber jewellery brand based in Oman and the GCC, offering authentic Baltic amber pieces designed for Middle Eastern style.",
  keywords: [
    "Kahramani",
    "كهرماني",
    "Baltic amber",
    "عنبر بلطيقي",
    "amber jewellery",
    "Oman jewellery",
    "GCC jewellery",
    "amber rings",
    "amber necklaces",
    "amber earrings",
    "Oman amber shop",
    "Muscat amber",
  ],
  openGraph: {
    title: "كهرماني Kahramani | Baltic Amber Jewellery",
    description:
      "Authentic Baltic amber jewellery with a Middle Eastern soul. Shop rings, necklaces and sets from Oman to the GCC.",
    type: "website",
    locale: "ar_OM",
    alternateLocale: "en_US",
  },
  robots: {
    index: true,
    follow: true,
  },
  formatDetection: {
    telephone: false,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Kahramani',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        {/* Preconnect to external domains for faster loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* DNS prefetch for API */}
        <link rel="dns-prefetch" href="https://apikahramani-e8eddtdchububue6.southindia-01.azurewebsites.net" />
        
        {/* Apple specific meta tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="min-h-screen bg-white text-gray-800 antialiased">
        {children}
      </body>
    </html>
  );
}
