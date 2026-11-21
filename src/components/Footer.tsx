import React from 'react';
import Link from 'next/link';
import Logo from '@/components/Logo';
import { ShieldCheck, MapPin, Clock, CalendarCheck, Lock, CreditCard } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-espresso-950 dark:bg-[#0c0b0a] text-stone-300 border-t border-espresso-800 dark:border-white/10 mt-auto transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Column 1 – Brand Identity */}
          <div className="space-y-4">
            <Logo variant="light" size="md" />
            <p className="text-stone-400 text-sm leading-relaxed">
              Curating salon and spa treatments with transparent pricing, predefined time allocations, and convenient digital reservations.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-champagne-400 font-medium">
              <ShieldCheck className="w-4 h-4 text-champagne-400 shrink-0" />
              <span>Dedicated Atelier Booking Platform</span>
            </div>
          </div>

          {/* Column 2 – Atelier Locations (Verified & Upcoming) */}
          <div className="space-y-3">
            <h3 className="font-serif text-white text-base font-semibold tracking-wide uppercase text-xs">
              Atelier Locations
            </h3>
            <div className="space-y-4 text-sm text-stone-400">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-alabaster-100 font-medium text-xs">
                  <MapPin className="w-3.5 h-3.5 text-champagne-400 shrink-0" />
                  <span>Flagship Atelier</span>
                </div>
                <p className="text-xs text-stone-400 leading-relaxed pl-5">
                  Central Atelier &amp; Spa Suite
                  <br />
                  <span className="text-[11px] text-stone-500">
                    Exact suite details provided upon confirmed booking
                  </span>
                </p>
              </div>

              <div className="space-y-1 pt-1 border-t border-espresso-900 dark:border-white/5">
                <div className="flex items-center gap-1.5 text-stone-300 font-medium text-xs">
                  <MapPin className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                  <span>Atelier II (Upcoming)</span>
                </div>
                <p className="text-xs text-stone-400 leading-relaxed pl-5">
                  Second location expansion in progress
                  <br />
                  <span className="text-[11px] text-champagne-400/90 italic">
                    Address to be updated upon launch
                  </span>
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-stone-400 pt-1">
                <Clock className="w-3.5 h-3.5 text-champagne-400 shrink-0" />
                <span>Mon – Sat: 9:00 AM – 7:00 PM</span>
              </div>
            </div>
          </div>

          {/* Column 3 – Explore Platform */}
          <div className="space-y-3">
            <h3 className="font-serif text-white text-base font-semibold tracking-wide uppercase text-xs">
              Explore Catalog
            </h3>
            <ul className="space-y-2.5 text-sm text-stone-400">
              <li>
                <Link href="/" className="hover:text-champagne-400 transition-colors">
                  Home Experience
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-champagne-400 transition-colors">
                  Browse All Services
                </Link>
              </li>
              <li>
                <Link
                  href="/services?category=Haircut+%26+Styling"
                  className="hover:text-champagne-400 transition-colors"
                >
                  Haircut &amp; Styling
                </Link>
              </li>
              <li>
                <Link
                  href="/services?category=Facial+%26+Skincare"
                  className="hover:text-champagne-400 transition-colors"
                >
                  Facial &amp; Skincare
                </Link>
              </li>
              <li>
                <Link
                  href="/services?category=Spa+%26+Massage"
                  className="hover:text-champagne-400 transition-colors"
                >
                  Spa &amp; Massage
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 – Platform Standards & Security */}
          <div className="space-y-3">
            <h3 className="font-serif text-white text-base font-semibold tracking-wide uppercase text-xs">
              Client Care &amp; Security
            </h3>
            <div className="space-y-3 text-sm text-stone-400">
              <div className="flex items-start gap-2.5">
                <Lock className="w-4 h-4 text-champagne-400 mt-1 shrink-0" />
                <span>Better Auth session protection &amp; Google OAuth verified.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CreditCard className="w-4 h-4 text-champagne-400 mt-1 shrink-0" />
                <span>Secure Stripe Checkout with server-verified webhook receipts.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CalendarCheck className="w-4 h-4 text-champagne-400 mt-1 shrink-0" />
                <span>Real-time slot lock to eliminate appointment overlap.</span>
              </div>
              <div className="pt-1">
                <Link
                  href="/dashboard/customer/appointments"
                  className="text-xs text-champagne-400 hover:text-champagne-300 font-medium underline underline-offset-4"
                >
                  Access My Appointments &amp; Receipts &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-12 pt-8 border-t border-espresso-800 dark:border-white/10 text-xs text-stone-400 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>&copy; 2026 SalonBook. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-stone-300 transition-colors cursor-pointer">
              Privacy Policy
            </span>
            <span className="hover:text-stone-300 transition-colors cursor-pointer">
              Terms &amp; Conditions
            </span>
            <span className="hover:text-stone-300 transition-colors cursor-pointer">
              Platform Standards
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
