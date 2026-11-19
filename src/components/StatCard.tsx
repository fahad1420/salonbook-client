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
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'confirmed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'revenue':
        return 'bg-champagne-50 text-champagne-700 border-champagne-200';
      default:
        return 'bg-alabaster-200 text-espresso-900 border-alabaster-300';
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-alabaster-300 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
          {title}
        </span>
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${getBadgeStyles()}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="space-y-1">
        <h3 className="font-serif text-3xl font-semibold text-espresso-950">
          {value}
        </h3>
        {description && (
          <p className="text-xs text-stone-500 font-medium">{description}</p>
        )}
      </div>
    </div>
  );
}
