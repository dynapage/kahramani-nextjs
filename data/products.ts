export type CategorySlug =
  | "necklaces"
  | "rings"
  | "sets"
  | "bracelets"
  | "earrings"
  | "pendants"
  | "others";

export interface Product {
  id: string;
  slug: string;
  category: CategorySlug;
  name: { ar: string; en: string };
  shortDescription: { ar: string; en: string };
  priceUsd: number;
  priceOmr: number;
  inStock: boolean;
  isBestSeller?: boolean;
  isOnOffer?: boolean;
  images: string[];
}

export const categories: { slug: CategorySlug; ar: string; en: string }[] = [
  { slug: "rings", ar: "خواتم", en: "Rings" },
  { slug: "bracelets", ar: "أساور", en: "Bracelets" },
  { slug: "earrings", ar: "أقراط", en: "Earrings" },
  { slug: "pendants", ar: "قلائد", en: "Pendants" },
  { slug: "sets", ar: "أطقم عنبر", en: "Sets" },
  { slug: "others", ar: "أخرى", en: "Others" },
];

export const products: Product[] = [
  {
    id: "butterfly-set",
    slug: "butterfly-set",
    category: "sets",
    name: {
      ar: "طقم الفراشة بالعنبر الكرزي",
      en: "Cherry amber butterfly set",
    },
    shortDescription: {
      ar: "طقم عنبر طبيعي مع تصميم فراشة مميز، مثالي للمناسبات الخاصة.",
      en: "Natural cherry amber set with statement butterfly design.",
    },
    priceUsd: 100,
    priceOmr: 100,
    inStock: true,
    isBestSeller: true,
    images: ["/images/Pro1_1.jpg", "/images/Pro1_2.jpg", "/images/Pro1_3.jpg", "/images/Pro1_4.png", "/images/Pro1_5.png", "/images/Pro1_6.png"],
  },
  {
    id: "cylinder-necklace1",
    slug: "cylinder-necklace",
    category: "necklaces",
    name: {
      ar: "عقد عنبر أسطواني ثنائي اللون",
      en: "Two-tone cylinder amber necklace",
    },
    shortDescription: {
      ar: "درجات العنبر الأصفر والكرزي بتصميم عصري أنيق.",
      en: "Creamy yellow and cherry amber in a sleek modern necklace.",
    },
    priceUsd: 260,
    priceOmr: 100,
    inStock: true,
    isBestSeller: true,
    images: ["/images/NECK01.png"],
  },

  {
    id: "cylinder-necklace2",
    slug: "cylinder-necklace",
    category: "necklaces",
    name: {
      ar: "قلادة نادرة من الكهرمان العنبري",
      en: "Two-tone cylinder amber necklace",
    },
    shortDescription: {
      ar: "قلادة مصاغة يدوياً من الفضة الخالصة وقطعة نادرة من الكهرمان العنبري (الكهرب) الحشري البولوني الطبيعي.",
      en: "Creamy yellow and cherry amber in a sleek modern necklace.",
    },
    priceUsd: 260,
    priceOmr: 100,
    inStock: true,
    isBestSeller: true,
    images: ["/images/pen02.png", "/images/pen03.png", "/images/pen01.png"],
  },
  {
    id: "cylinder-necklace4",
    slug: "cylinder-necklace",
    category: "necklaces",
    name: {
      ar: "اساور من الفضة ٩٩٥",
      en: "995 Silver Bracelets",
    },
    shortDescription: {
      ar: "اساور من الفضة مطعمة بتشكيلة من احجار الكهرمان البلطيقي ومصنوعة بعناية بكل تفاصيلها.",
      en: "Bracelets made of 995 silver adorned with a variety of Baltic amber stones, crafted with meticulous attention to detail.",
    },
    priceUsd: 260,
    priceOmr: 100,
    inStock: true,
    isBestSeller: true,
    images: ["/images/BR01.png", "/images/BR02.png", "/images/BR04.png"],
  },

  {
    id: "cylinder-necklace5",
    slug: "cylinder-necklace",
    category: "necklaces",
    name: {
      ar: "تصاميم نادرة من الكهرمان العنبري",
      en: "Rare Amber Designs",
    },
    shortDescription: {
      ar: "تصاميم فريدة عملت يدوياً بمهارة عالمية في بولندا من الفضة الخالصة وقطع ثمينة واصيلة من الكهرمان العنبري (الكهرب) البولوني الطبيعي.",
      en: "Unique designs handcrafted with world-class skill in Poland from pure silver and precious authentic Polish amber (electric).",
    },
    priceUsd: 260,
    priceOmr: 100,
    inStock: true,
    isBestSeller: true,
    images: ["/images/hero-2.png"],
  },


  {
    id: "golden-ring-set",
    slug: "golden-ring-set",
    category: "rings",
    name: {
      ar: "خاتم عنبر ذهبي مع تعليقة",
      en: "Golden amber ring & pendant",
    },
    shortDescription: {
      ar: "خاتم مركزي بتفاصيل متلألئة مع تعليقة مطابقة.",
      en: "Central amber cabochon ring with matching pendant.",
    },
    priceUsd: 310,
    priceOmr: 120,
    inStock: true,
    isBestSeller: true,
    images: ["/images/SET01.png", "/images/SET02.png"],
  },

  {
    id: "golden-br",
    slug: "bracelets",
    category: "bracelets",
    name: {
      ar: "اكتشفي أسرار الاساور",
      en: "Amber Bracelets",
    },
    shortDescription: {
      ar: "الاساور بتفاصيل متلألئة مع الفضة الخالصة أو الفضة المطلية بالذهب الخالص.",
      en: "Bracelets with sparkling details in pure silver or gold-plated silver.",
    },
    priceUsd: 310,
    priceOmr: 120,
    inStock: true,
    isBestSeller: true,
    images: ["/images/BR05.png", "/images/BR03.png", "/images/BR06.png", "/images/BR04.png"],
  },

  {
    id: "yellow-ring",
    slug: "yellow-ring",
    category: "rings",
    name: {
      ar: "خاتم عنبر أصفر حليبي",
      en: "Buttery yellow amber ring",
    },
    shortDescription: {
      ar: "لون دافئ يناسب جميع ألوان البشرة.",
      en: "Soft buttery yellow tone flattering every skin tone.",
    },
    priceUsd: 190,
    priceOmr: 73,
    inStock: true,
    images: ["/images/kahramani-yellow-ring.png"],
  },
];

export function getProductsByCategory(category?: string): Product[] {
  if (!category) return products;

  // Map UI-friendly slugs to underlying product categories
  if (category === "pendants") {
    return products.filter((p) => p.category === "necklaces");
  }

  return products.filter((p) => p.category === category);
}

export function getBestSellers(): Product[] {
  return products.filter((p) => p.isBestSeller);
}

export function getOffers(): Product[] {
  return products.filter((p) => p.isOnOffer);
}
