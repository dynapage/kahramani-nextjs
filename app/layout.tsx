import "./globals.css";
import type { Metadata } from "next";
import type React from "react";

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
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className="min-h-screen bg-white text-gray-800 antialiased">
        {children}
      </body>
    </html>
  );
}