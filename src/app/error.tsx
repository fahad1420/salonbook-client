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
    <div className="min-h-screen flex flex-col items-center justify-center bg-alabaster-100 dark:bg-stone-950 p-4 sm:p-6 transition-colors">
      <div className="max-w-md w-full bg-white dark:bg-stone-900 rounded-3xl p-8 sm:p-10 border border-alabaster-300 dark:border-stone-800 shadow-luxury text-center space-y-6">
        <div className="w-14 h-14 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 flex items-center justify-center text-rose-600 dark:text-rose-400 mx-auto">
          <AlertCircle className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-3 py-1 rounded-full border border-rose-200 dark:border-rose-900/50">
            Atelier Exception
          </span>
          <h1 className="font-serif text-3xl font-medium text-espresso-950 dark:text-alabaster-50 pt-1">
            Something went wrong
          </h1>
          <p className="text-stone-500 dark:text-stone-400 text-xs sm:text-sm leading-relaxed">
            We encountered an unexpected disruption while rendering this atelier view. You may retry or return to safety.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            type="button"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-espresso-900 hover:bg-espresso-800 dark:bg-champagne-500 dark:hover:bg-champagne-400 text-alabaster-100 dark:text-stone-950 text-xs font-semibold tracking-wide transition-all shadow-md"
          >
            <RotateCcw className="w-3.5 h-3.5 text-champagne-400 dark:text-stone-950" />
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-alabaster-100 dark:bg-stone-800 hover:bg-alabaster-200 dark:hover:bg-stone-700 text-espresso-900 dark:text-alabaster-100 border border-alabaster-300 dark:border-stone-700 text-xs font-semibold tracking-wide transition-all"
          >
            <Home className="w-3.5 h-3.5 text-stone-500 dark:text-stone-400" />
            <span>Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
