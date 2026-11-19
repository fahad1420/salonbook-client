import React from 'react';

export default function ServiceSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-alabaster-300 shadow-sm animate-pulse flex flex-col">
      <div className="h-60 w-full bg-stone-200" />
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          <div className="h-5 bg-stone-200 rounded w-3/4" />
          <div className="h-4 bg-stone-100 rounded w-full" />
          <div className="h-4 bg-stone-100 rounded w-2/3" />
        </div>
        <div className="pt-4 border-t border-alabaster-200 flex items-center justify-between">
          <div className="space-y-1">
            <div className="h-3 bg-stone-200 rounded w-10" />
            <div className="h-6 bg-stone-200 rounded w-16" />
          </div>
          <div className="h-8 bg-stone-200 rounded-full w-28" />
        </div>
      </div>
    </div>
  );
}
