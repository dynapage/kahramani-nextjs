'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global error:', error);
  }, [error]);

  return (
    <html lang="ar" dir="rtl">
      <body className="min-h-screen bg-white text-gray-800 antialiased">
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">عذراً</h1>
              <h2 className="text-xl font-semibold mb-2" style={{ color: '#b88746' }}>Sorry</h2>
              <p className="text-gray-600 mb-2">حدث خطأ غير متوقع</p>
              <p className="text-gray-600">Something went wrong</p>
            </div>

            <div className="space-y-4">
              <button
                type="button"
                onClick={() => reset()}
                className="w-full rounded-full px-6 py-3 text-sm font-semibold uppercase tracking-wider text-white shadow-lg"
                style={{ backgroundColor: '#b88746' }}
              >
                حاول مرة أخرى / Try Again
              </button>

              <a
                href="/?lang=ar"
                className="block w-full rounded-full border-2 px-6 py-3 text-sm font-semibold uppercase tracking-wider"
                style={{ borderColor: '#b88746', color: '#b88746' }}
              >
                العودة للرئيسية / Go Home
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
