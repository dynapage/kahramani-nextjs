import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-kahra_cream/10 px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-kahra_gold mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">الصفحة غير موجودة</h2>
          <p className="text-gray-600 mb-2">Page Not Found</p>
          <p className="text-sm text-gray-500 mt-4">
            الصفحة التي تبحث عنها غير موجودة أو تم نقلها
          </p>
          <p className="text-sm text-gray-500">
            The page you&apos;re looking for doesn&apos;t exist or has been moved
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/?lang=ar"
            className="block w-full rounded-full bg-kahra_gold px-6 py-3 text-sm font-semibold uppercase tracking-wider text-white shadow-lg hover:bg-kahra_gold/90 transition-colors touch-manipulation"
          >
            العودة للرئيسية / Go Home
          </Link>

          <Link
            href="/catalog?lang=ar"
            className="block w-full rounded-full border-2 border-kahra_gold px-6 py-3 text-sm font-semibold uppercase tracking-wider text-kahra_gold hover:bg-kahra_gold hover:text-white transition-colors touch-manipulation"
          >
            تصفح المنتجات / Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
}
