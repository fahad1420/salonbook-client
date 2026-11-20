'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, RotateCcw, Home } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App Router segment error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-alabaster-100 p-4 sm:p-6">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-alabaster-300 shadow-luxury text-center space-y-6">
        <div className="w-14 h-14 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mx-auto">
          <AlertCircle className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
            Atelier Exception
          </span>
          <h1 className="font-serif text-3xl font-medium text-espresso-950 pt-1">
            Something went wrong
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm leading-relaxed">
            We encountered an unexpected disruption while rendering this atelier view. You may retry or return to safety.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            type="button"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-espresso-900 hover:bg-espresso-800 text-alabaster-100 text-xs font-semibold tracking-wide transition-all shadow-md"
          >
            <RotateCcw className="w-3.5 h-3.5 text-champagne-400" />
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-alabaster-100 hover:bg-alabaster-200 text-espresso-900 border border-alabaster-300 text-xs font-semibold tracking-wide transition-all"
          >
            <Home className="w-3.5 h-3.5 text-stone-500" />
            <span>Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
