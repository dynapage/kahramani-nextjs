export type Lang = "ar" | "en";

export interface Dictionary {
  lang: Lang;
  dir: "rtl" | "ltr";
  hero: {
    kahrLine: string;
    titleStrong: string;
    titleRest: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    badgeLeft: string;
    badgeRight: string;
  };
  nav: {
    home: string;
    necklaces: string;
    rings: string;
    earrings: string;
    about: string;
    contact: string;
    catalog: string;
    languageLabel: string;
    languageShort: string;
  };
  featured: {
    title: string;
    subtitle: string;
    bestSellers: string;
    offers: string;
    viewAll: string;
  };
  catalog: {
    title: string;
    filterByCategory: string;
    allCategories: string;
    price: string;
    inStock: string;
    outOfStock: string;
    from: string;
  };
  about: {
    title: string;
    paragraph1: string;
    paragraph2: string;
    valuesTitle: string;
    values: string[];
  };
  contact: {
    title: string;
    subtitle: string;
    name: string;
    email: string;
    message: string;
    send: string;
    whatsapp: string;
    or: string;
  };
}

export const dictionaries: Record<Lang, Dictionary> = {
  ar: {
    lang: "ar",
    dir: "rtl",
    hero: {
      kahrLine: "كهرماني · Kahramani",
      titleStrong: "روح شرقية",
      titleRest: " بحجر عنبر بلطيقي أصيل",
      subtitle:
        "قطع عنبر مختارة بعناية لامرأة تبحث عن قطعة تجمع بين الجمال والقيمة – زينة وخزينة في نفس الوقت.",
      ctaPrimary: "تصفّح القطع المميّزة",
      ctaSecondary: "لماذا كهرماني؟",
      badgeLeft: "عنبر بلطيقي أصيل",
      badgeRight: "تصميم مخصص لأسلوب الخليج",
    },
    nav: {
      home: "الرئيسية",
      necklaces: "القلائد",
      rings: "الخواتم",
      earrings: "الأقراط",
      about: "من نحن",
      contact: "تواصل معنا",
      catalog: "المنتجات",
      languageLabel: "English",
      languageShort: "EN",
    },
    featured: {
      title: "مختارات مميّزة",
      subtitle: "اكتشفي أجمل القطع بدرجات الكرز والعسل والأصفر الحليبي.",
      bestSellers: "الأكثر مبيعاً",
      offers: "عروض خاصة",
      viewAll: "مشاهدة كل القطع",
    },
    catalog: {
      title: "جميع المنتجات",
      filterByCategory: "تصفية حسب الفئة",
      allCategories: "كل الفئات",
      price: "السعر",
      inStock: "متوفر",
      outOfStock: "غير متوفر",
      from: "ابتداءً من",
    },
    about: {
      title: "عن كهرماني",
      paragraph1:
        "كهرماني تجمع بين جودة العنبر البلطيقي القادم من بولندا وليتوانيا مع حس تصميم مستوحى من المرأة الخليجية. كل قطعة مدروسة لتكون خفيفة على الجلد وغنية في اللون وقابلة للاستخدام اليومي والمناسبات الخاصة.",
      paragraph2:
        "نختار قطعنا بعناية من موردين موثوقين، ونعرضها في تشكيلات محدودة لتبقى مميّزة وتحافظ على قيمتها مع الزمن.",
      valuesTitle: "ما الذي يميزنا؟",
      values: [
        "عنبر بلطيقي طبيعي 100%",
        "تصميم مخصص لذوق الخليج",
        "خيارات بيع بالتجزئة والجملة والبراند الخاص",
      ],
    },
    contact: {
      title: "تواصل معنا",
      subtitle:
        "للاستفسار عن القطع، الطلبات الخاصة أو التعاونات، تواصلي معنا مباشرة.",
      name: "الاسم",
      email: "البريد الإلكتروني",
      message: "رسالتك",
      send: "إرسال الرسالة",
      whatsapp: "تواصل عبر واتساب",
      or: "أو",
    },
  },
  en: {
    lang: "en",
    dir: "ltr",
    hero: {
      kahrLine: "Kahramani · كهرماني",
      titleStrong: "Baltic amber",
      titleRest: " with a Middle Eastern soul.",
      subtitle:
        "Hand-picked Baltic amber designed for women who want jewellery that is both beauty and savings in one timeless piece.",
      ctaPrimary: "View signature pieces",
      ctaSecondary: "Why Kahramani?",
      badgeLeft: "Authentic Baltic amber",
      badgeRight: "Tailored to GCC style",
    },
    nav: {
      home: "Home",
      necklaces: "Necklaces",
      rings: "Rings",
      earrings: "Earrings",
      about: "About Us",
      contact: "Contact",
      catalog: "Products",
      languageLabel: "العربية",
      languageShort: "AR",
    },
    featured: {
      title: "Featured collections",
      subtitle:
        "Explore our most loved pieces in deep cherry, cognac and creamy yellow amber.",
      bestSellers: "Best sellers",
      offers: "Special offers",
      viewAll: "View all products",
    },
    catalog: {
      title: "All products",
      filterByCategory: "Filter by category",
      allCategories: "All categories",
      price: "Price",
      inStock: "In stock",
      outOfStock: "Out of stock",
      from: "From",
    },
    about: {
      title: "About Kahramani",
      paragraph1:
        "Kahramani brings together genuine Baltic amber from Poland and Lithuania with a design language inspired by women across the GCC. Every piece is created to be light on the skin, rich in colour and ready for both everyday wear and special occasions.",
      paragraph2:
        "We work only with trusted workshops and release our designs in curated drops, keeping each piece distinctive and value-preserving over time.",
      valuesTitle: "What makes us different?",
      values: [
        "100% natural Baltic amber",
        "Designs tailored for GCC tastes",
        "Retail, wholesale and private-label options",
      ],
    },
    contact: {
      title: "Contact us",
      subtitle:
        "For product questions, custom orders or collaborations, reach out anytime.",
      name: "Name",
      email: "Email",
      message: "Your message",
      send: "Send message",
      whatsapp: "Chat on WhatsApp",
      or: "or",
    },
  },
};

export function getDictionary(langParam?: string): Dictionary {
  const lang = langParam === "en" ? "en" : "ar";
  return dictionaries[lang];
}