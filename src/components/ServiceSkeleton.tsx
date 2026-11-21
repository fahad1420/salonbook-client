import React from 'react';

export default function ServiceSkeleton() {
  return (
    <div className="bg-white dark:bg-espresso-950 rounded-3xl overflow-hidden border border-alabaster-300 dark:border-white/10 shadow-soft animate-pulse flex flex-col h-full">
      {/* Photo Placeholder */}
      <div className="h-60 sm:h-64 w-full bg-stone-200/70 dark:bg-espresso-900" />

      {/* Body Placeholder */}
      <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-5">
        <div className="space-y-3">
          <div className="h-6 bg-stone-200 dark:bg-espresso-800 rounded-lg w-3/4" />
          <div className="space-y-1.5">
            <div className="h-4 bg-stone-100 dark:bg-espresso-900 rounded w-full" />
            <div className="h-4 bg-stone-100 dark:bg-espresso-900 rounded w-4/5" />
          </div>
        </div>

        {/* Footer Placeholder */}
        <div className="pt-4 border-t border-alabaster-200 dark:border-white/10 flex items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="h-3 bg-stone-200 dark:bg-espresso-800 rounded w-14" />
            <div className="h-7 bg-stone-200 dark:bg-espresso-800 rounded-lg w-20" />
          </div>
          <div className="h-10 bg-stone-200 dark:bg-espresso-800 rounded-full w-32 shrink-0" />
        </div>
      </div>
    </div>
  );
}
