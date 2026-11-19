'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  Calendar,
  User as UserIcon,
  LogOut,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import Image from 'next/image';

export default function CustomerSidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  const navItems = [
    {
      label: 'Overview',
      href: '/dashboard/customer',
      icon: LayoutDashboard,
      exact: true,
    },
    {
      label: 'My Appointments',
      href: '/dashboard/customer/appointments',
      icon: Calendar,
      exact: false,
    },
    {
      label: 'My Profile',
      href: '/dashboard/customer/profile',
      icon: UserIcon,
      exact: false,
    },
  ];

  const isLinkActive = (href: string, exact: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-full lg:w-72 bg-white rounded-3xl border border-alabaster-300 p-6 shadow-sm flex flex-col justify-between shrink-0">
      <div className="space-y-6">
        {/* User Card */}
        <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-alabaster-100 border border-alabaster-300">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-champagne-200 border border-champagne-300 flex items-center justify-center text-espresso-950 font-serif font-bold text-lg shrink-0">
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
            <p className="font-serif text-sm font-semibold text-espresso-950 truncate">
              {user?.name}
            </p>
            <p className="text-xs text-stone-500 truncate">{user?.email}</p>
            <span className="inline-block mt-1 text-[10px] font-semibold uppercase tracking-wider text-champagne-700 bg-champagne-100 px-2 py-0.5 rounded-full border border-champagne-200">
              Verified Client
            </span>
          </div>
        </div>

        {/* Navigation */}
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
                    ? 'bg-espresso-900 text-alabaster-100 shadow-sm'
                    : 'text-stone-600 hover:text-espresso-950 hover:bg-alabaster-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-champagne-400' : 'text-stone-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Browse Atelier link */}
        <div className="pt-2 border-t border-alabaster-200">
          <Link
            href="/services"
            className="flex items-center justify-between px-4 py-2.5 rounded-2xl text-xs font-medium text-stone-600 hover:text-espresso-950 hover:bg-alabaster-100 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-champagne-600" />
              <span>Browse Catalog</span>
            </span>
            <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
          </Link>
        </div>
      </div>

      {/* Logout */}
      <div className="pt-6 border-t border-alabaster-200 mt-6">
        <button
          onClick={signOut}
          className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs font-semibold text-rose-700 hover:bg-rose-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
