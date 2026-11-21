import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  description?: string;
  trend?: string;
  variant?: 'default' | 'pending' | 'confirmed' | 'cancelled' | 'revenue';
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  description,
  variant = 'default',
}: StatCardProps) {
  const getBadgeStyles = () => {
    switch (variant) {
      case 'pending':
        return 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800';
      case 'confirmed':
        return 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
      case 'cancelled':
        return 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-800';
      case 'revenue':
        return 'bg-champagne-50 dark:bg-champagne-950/40 text-champagne-700 dark:text-champagne-300 border-champagne-200 dark:border-champagne-800';
      default:
        return 'bg-alabaster-200 dark:bg-espresso-900 text-espresso-900 dark:text-alabaster-100 border-alabaster-300 dark:border-white/10';
    }
  };

  return (
    <div className="bg-white dark:bg-espresso-950 rounded-3xl p-6 border border-alabaster-300 dark:border-white/10 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
          {title}
        </span>
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${getBadgeStyles()}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="space-y-1">
        <h3 className="font-serif text-3xl font-semibold text-espresso-950 dark:text-white">
          {value}
        </h3>
        {description && (
          <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">{description}</p>
        )}
      </div>
    </div>
  );
}
