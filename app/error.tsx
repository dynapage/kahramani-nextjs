'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-kahra_cream/10 px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">عذراً</h1>
          <h2 className="text-2xl font-semibold text-kahra_gold mb-2">Sorry</h2>
          <p className="text-gray-600 mb-2">حدث خطأ غير متوقع</p>
          <p className="text-gray-600">Something went wrong</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={reset}
            className="w-full rounded-full bg-kahra_gold px-6 py-3 text-sm font-semibold uppercase tracking-wider text-white shadow-lg hover:bg-kahra_gold/90 transition-all"
          >
            حاول مرة أخرى / Try Again
          </button>

          <Link
            href="/?lang=ar"
            className="block w-full rounded-full border-2 border-kahra_gold px-6 py-3 text-sm font-semibold uppercase tracking-wider text-kahra_gold hover:bg-kahra_gold hover:text-white transition-all"
          >
            العودة للرئيسية / Go Home
          </Link>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <div className="mt-8 p-4 bg-red-50 rounded-lg text-left">
            <p className="text-xs text-red-600 font-mono break-all">
              {error.message}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}