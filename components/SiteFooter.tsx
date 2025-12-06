import Link from "next/link";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    // Lighter footer with neutral background and dark text
    <footer className="bg-[#f8f8f8] py-4">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 text-[0.75rem] text-gray-600 md:flex-row">
        <p>© {year} Kahramani · كهرماني – All rights reserved.</p>
        <div className="flex items-center gap-4">
          <a
            href="https://www.instagram.com/kahramani_amber"
            target="_blank"
            rel="noreferrer"
            className="hover:text-kahra_gold"
          >
            Instagram
          </a>
          <a
            href="https://www.facebook.com/kahramaniamber"
            target="_blank"
            rel="noreferrer"
            className="hover:text-kahra_gold"
          >
            Facebook
          </a>
        </div>
      </div>
    </footer>
  );
}