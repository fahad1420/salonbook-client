'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  Scissors,
  CalendarCheck,
  Users,
  Receipt,
  User as UserIcon,
  LogOut,
} from 'lucide-react';
import Image from 'next/image';

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  const navItems = [
    {
      label: 'Overview',
      href: '/dashboard/admin',
      icon: LayoutDashboard,
      exact: true,
    },
    {
      label: 'Manage Services',
      href: '/dashboard/admin/services',
      icon: Scissors,
      exact: false,
    },
    {
      label: 'Manage Appointments',
      href: '/dashboard/admin/appointments',
      icon: CalendarCheck,
      exact: false,
    },
    {
      label: 'Manage Clients',
      href: '/dashboard/admin/users',
      icon: Users,
      exact: false,
    },
    {
      label: 'Financial Ledger',
      href: '/dashboard/admin/transactions',
      icon: Receipt,
      exact: false,
    },
    {
      label: 'Atelier Profile',
      href: '/dashboard/admin/profile',
      icon: UserIcon,
      exact: false,
    },
  ];

  const isLinkActive = (href: string, exact: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-full lg:w-72 bg-white dark:bg-espresso-950 rounded-3xl border border-alabaster-300 dark:border-white/10 p-6 shadow-sm flex flex-col justify-between shrink-0 transition-colors">
      <div className="space-y-6">
        {/* Admin Director Profile Header */}
        <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-espresso-950 text-white border border-espresso-800 dark:border-white/15">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-champagne-200 border border-champagne-400 flex items-center justify-center text-espresso-950 font-serif font-bold text-lg shrink-0">
            {user?.image ? (
              <Image
                src={user.image}
                alt={user.name}
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{user?.name?.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-serif text-sm font-semibold text-white truncate">
              {user?.name}
            </p>
            <p className="text-xs text-stone-400 truncate">{user?.email}</p>
            <span className="inline-block mt-1 text-[10px] font-semibold uppercase tracking-wider text-champagne-300 bg-espresso-800 px-2 py-0.5 rounded-full border border-champagne-500/30">
              Salon Administrator
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const active = isLinkActive(item.href, item.exact);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold tracking-wide transition-all ${
                  active
                    ? 'bg-espresso-900 dark:bg-champagne-600 text-alabaster-100 dark:text-espresso-950 shadow-sm'
                    : 'text-stone-600 dark:text-stone-400 hover:text-espresso-950 dark:hover:text-white hover:bg-alabaster-100 dark:hover:bg-espresso-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-champagne-400 dark:text-espresso-950' : 'text-stone-400 dark:text-stone-500'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Quick Atelier Storefront Link */}
        <div className="pt-2 border-t border-alabaster-200 dark:border-white/10">
          <Link
            href="/services"
            className="flex items-center justify-between px-4 py-2.5 rounded-2xl text-xs font-medium text-stone-600 dark:text-stone-400 hover:text-espresso-950 dark:hover:text-white hover:bg-alabaster-100 dark:hover:bg-espresso-900 transition-colors"
          >
            <span className="flex items-center gap-2">
              <CalendarCheck className="w-3.5 h-3.5 text-champagne-600 dark:text-champagne-400" />
              <span>Public Atelier Menu</span>
            </span>
          </Link>
        </div>
      </div>

      {/* Logout */}
      <div className="pt-6 border-t border-alabaster-200 dark:border-white/10 mt-6">
        <button
          onClick={signOut}
          className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs font-semibold text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
