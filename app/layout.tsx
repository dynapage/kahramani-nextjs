import "./globals.css";
import type { Metadata } from "next";
import type React from "react";
import { cookies } from "next/headers";

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
  metadataBase: new URL("https://kahramani.com"),
  openGraph: {
    title: "كهرماني Kahramani | Baltic Amber Jewellery",
    description:
      "Authentic Baltic amber jewellery with a Middle Eastern soul. Shop rings, necklaces and sets from Oman to the GCC.",
    type: "website",
    url: "https://kahramani.com",
  },
};

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const cookieLang =
    cookieStore.get("kahra_lang")?.value === "en" ? "en" : "ar";
  const dir = cookieLang === "ar" ? "rtl" : "ltr";

  return (
    <html lang={cookieLang} dir={dir}>
      <body className="min-h-screen bg-kahra_deep text-kahra_cream antialiased">
        {children}
      </body>
    </html>
  );
}

