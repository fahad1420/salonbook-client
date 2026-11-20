import React from 'react';
import Link from 'next/link';
import Logo from '@/components/Logo';
import { ShieldCheck, CalendarCheck, Lock, CreditCard } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-espresso-950 text-stone-300 border-t border-espresso-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Column 1 – Brand Identity */}
          <div className="space-y-4">
            <Logo variant="light" size="md" />
            <p className="text-stone-400 text-sm leading-relaxed">
              Curating elevated salon and spa rituals with transparent pricing, guaranteed time allocations, and seamless digital reservations.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-champagne-400 font-medium">
              <ShieldCheck className="w-4 h-4 text-champagne-400 shrink-0" />
              <span>Dedicated Atelier Booking Platform</span>
            </div>
          </div>

          {/* Column 2 – Explore Platform */}
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

          {/* Column 3 – Customer Care */}
          <div className="space-y-3">
            <h3 className="font-serif text-white text-base font-semibold tracking-wide uppercase text-xs">
              Customer Care
            </h3>
            <ul className="space-y-2.5 text-sm text-stone-400">
              <li>
                <Link
                  href="/dashboard/customer/appointments"
                  className="hover:text-champagne-400 transition-colors"
                >
                  My Appointments
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/customer/profile"
                  className="hover:text-champagne-400 transition-colors"
                >
                  My Profile
                </Link>
              </li>
              <li>
                <a
                  href="/#how-it-works"
                  className="hover:text-champagne-400 transition-colors"
                >
                  Booking Information
                </a>
              </li>
              <li>
                <a
                  href="/#standards"
                  className="hover:text-champagne-400 transition-colors"
                >
                  Cancellation Policy
                </a>
              </li>
              <li>
                <Link
                  href="/services"
                  className="hover:text-champagne-400 transition-colors"
                >
                  Treatment Preparation
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 – Platform Information & Security */}
          <div className="space-y-3">
            <h3 className="font-serif text-white text-base font-semibold tracking-wide uppercase text-xs">
              Security &amp; Standards
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
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-12 pt-8 border-t border-espresso-800 text-xs text-stone-400 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>&copy; 2026 SalonBook. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-stone-300 transition-colors cursor-pointer">
              Privacy Policy
            </span>
            <span className="hover:text-stone-300 transition-colors cursor-pointer">
              Terms &amp; Conditions
            </span>
            <span className="hover:text-stone-300 transition-colors cursor-pointer">
              Hygiene Standards
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
