'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Logo from '@/components/Logo';
import ThemeToggle from '@/components/ThemeToggle';
import { Menu, X, User as UserIcon, Calendar, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';
import Image from 'next/image';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const dashboardHref =
    user?.role === 'admin' ? '/dashboard/admin' : '/dashboard/customer';

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-alabaster-100/90 dark:bg-[#141210]/95 backdrop-blur-md border-b border-alabaster-300 dark:border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <Logo variant="dark" size="md" />

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className={`text-sm tracking-wide transition-colors ${
                isActive('/')
                  ? 'text-espresso-950 dark:text-white font-semibold'
                  : 'text-stone-600 dark:text-stone-300 hover:text-espresso-950 dark:hover:text-white'
              }`}
            >
              Home
            </Link>
            <Link
              href="/services"
              className={`text-sm tracking-wide transition-colors ${
                isActive('/services')
                  ? 'text-espresso-950 dark:text-white font-semibold'
                  : 'text-stone-600 dark:text-stone-300 hover:text-espresso-950 dark:hover:text-white'
              }`}
            >
              Browse Services
            </Link>
            {user && (
              <Link
                href={dashboardHref}
                className={`text-sm tracking-wide transition-colors ${
                  pathname.startsWith('/dashboard')
                    ? 'text-espresso-950 dark:text-white font-semibold'
                    : 'text-stone-600 dark:text-stone-300 hover:text-espresso-950 dark:hover:text-white'
                }`}
              >
                Dashboard
              </Link>
            )}
          </nav>

          {/* Desktop Auth Controls & Theme Toggle */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />

            {!user ? (
              <>
                <Link
                  href="/sign-in"
                  className="text-sm font-medium text-espresso-900 dark:text-alabaster-100 hover:text-champagne-700 dark:hover:text-champagne-300 px-4 py-2 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="text-sm font-medium bg-espresso-900 dark:bg-champagne-600 text-alabaster-100 dark:text-espresso-950 hover:bg-espresso-800 dark:hover:bg-champagne-500 px-5 py-2.5 rounded-full transition-all shadow-sm hover:shadow"
                >
                  Reserve Appointment
                </Link>
              </>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-3 p-1.5 rounded-full hover:bg-alabaster-200 dark:hover:bg-espresso-900 transition-colors focus:outline-none border border-alabaster-300 dark:border-white/15"
                  aria-expanded={dropdownOpen}
                >
                  <div className="w-9 h-9 rounded-full overflow-hidden bg-champagne-200 dark:bg-champagne-900/60 flex items-center justify-center text-espresso-900 dark:text-champagne-300 font-medium text-sm border border-champagne-300 dark:border-champagne-700">
                    {user.image ? (
                      <Image
                        src={user.image}
                        alt={user.name}
                        width={36}
                        height={36}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{user.name.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <span className="text-sm font-medium text-espresso-900 dark:text-alabaster-100 max-w-[130px] truncate">
                    {user.name}
                  </span>
                  <ChevronDown className="w-4 h-4 text-stone-500 dark:text-stone-400 mr-1" />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-espresso-950 shadow-xl border border-alabaster-300 dark:border-white/10 py-2 animate-in fade-in zoom-in-95 duration-150 z-50">
                    <div className="px-4 py-3 border-b border-stone-100 dark:border-white/10">
                      <p className="text-sm font-medium text-espresso-950 dark:text-white truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-stone-500 dark:text-stone-400 truncate">{user.email}</p>
                      <span className="inline-block mt-1.5 px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded-full bg-champagne-100 dark:bg-champagne-950/60 text-champagne-700 dark:text-champagne-300 border border-champagne-200 dark:border-champagne-800">
                        {user.role}
                      </span>
                    </div>

                    <div className="py-1">
                      <Link
                        href={dashboardHref}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-stone-700 dark:text-stone-300 hover:bg-alabaster-100 dark:hover:bg-espresso-900 hover:text-espresso-950 dark:hover:text-white transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-champagne-600 dark:text-champagne-400" />
                        Dashboard
                      </Link>

                      {user.role === 'customer' && (
                        <Link
                          href="/dashboard/customer/appointments"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-stone-700 dark:text-stone-300 hover:bg-alabaster-100 dark:hover:bg-espresso-900 hover:text-espresso-950 dark:hover:text-white transition-colors"
                        >
                          <Calendar className="w-4 h-4 text-champagne-600 dark:text-champagne-400" />
                          My Appointments
                        </Link>
                      )}

                      <Link
                        href={
                          user.role === 'admin'
                            ? '/dashboard/admin/profile'
                            : '/dashboard/customer/profile'
                        }
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-stone-700 dark:text-stone-300 hover:bg-alabaster-100 dark:hover:bg-espresso-900 hover:text-espresso-950 dark:hover:text-white transition-colors"
                      >
                        <UserIcon className="w-4 h-4 text-champagne-600 dark:text-champagne-400" />
                        My Profile
                      </Link>
                    </div>

                    <div className="border-t border-stone-100 dark:border-white/10 pt-1">
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          signOut();
                        }}
                        className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu & Theme Controls */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="p-2 rounded-lg text-espresso-900 dark:text-alabaster-100 hover:bg-alabaster-200 dark:hover:bg-espresso-900 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-alabaster-300 dark:border-white/10 bg-alabaster-100 dark:bg-[#141210] px-4 pt-2 pb-6 space-y-3">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-espresso-900 dark:text-white hover:text-champagne-700 dark:hover:text-champagne-300"
          >
            Home
          </Link>
          <Link
            href="/services"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-espresso-900 dark:text-white hover:text-champagne-700 dark:hover:text-champagne-300"
          >
            Browse Services
          </Link>
          {user ? (
            <>
              <Link
                href={dashboardHref}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-base font-medium text-espresso-900 dark:text-white hover:text-champagne-700 dark:hover:text-champagne-300"
              >
                Dashboard ({user.role})
              </Link>
              <div className="pt-3 border-t border-alabaster-300 dark:border-white/10 flex items-center justify-between">
                <span className="text-sm text-stone-600 dark:text-stone-400">{user.email}</span>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    signOut();
                  }}
                  className="text-sm font-medium text-rose-700 dark:text-rose-400"
                >
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <div className="pt-4 border-t border-alabaster-300 dark:border-white/10 flex flex-col gap-2">
              <Link
                href="/sign-in"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-full border border-espresso-900 dark:border-white/20 text-espresso-900 dark:text-white font-medium text-sm"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-full bg-espresso-900 dark:bg-champagne-600 text-alabaster-100 dark:text-espresso-950 font-medium text-sm"
              >
                Reserve Appointment
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
