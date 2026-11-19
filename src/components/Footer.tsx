import React from 'react';
import Link from 'next/link';
import { Sparkles, MapPin, Phone, Mail, Clock, Instagram, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-espresso-950 text-stone-300 border-t border-espresso-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-full bg-alabaster-100 flex items-center justify-center text-espresso-900 shadow-sm">
                <Sparkles className="w-5 h-5 text-champagne-600" />
              </div>
              <span className="font-serif text-2xl font-medium tracking-tight text-white">
                Salon<span className="text-champagne-400 font-normal">Book</span>
              </span>
            </Link>
            <p className="text-stone-400 text-sm leading-relaxed">
              Curating elevated beauty rituals, precision hair sculpture, and revitalizing spa therapies with unmatched French atelier elegance.
            </p>
            <div className="flex items-center gap-3 pt-2 text-stone-400">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-espresso-800 flex items-center justify-center hover:text-champagne-400 hover:border-champagne-400 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-espresso-800 flex items-center justify-center hover:text-champagne-400 hover:border-champagne-400 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="font-serif text-white text-base font-semibold tracking-wide uppercase text-xs">
              Salon Discovery
            </h3>
            <ul className="space-y-2 text-sm">
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

          {/* Contact Details */}
          <div className="space-y-3">
            <h3 className="font-serif text-white text-base font-semibold tracking-wide uppercase text-xs">
              Concierge Desk
            </h3>
            <ul className="space-y-2.5 text-sm text-stone-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-champagne-400 mt-1 flex-shrink-0" />
                <span>450 Madison Avenue, Penthouse Level, New York, NY 10022</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-champagne-400 flex-shrink-0" />
                <span>+1 (212) 555-8900</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-champagne-400 flex-shrink-0" />
                <span>concierge@salonbook.luxury</span>
              </li>
            </ul>
          </div>

          {/* Atelier Hours */}
          <div className="space-y-3">
            <h3 className="font-serif text-white text-base font-semibold tracking-wide uppercase text-xs">
              Atelier Hours
            </h3>
            <div className="flex items-start gap-2.5 text-sm text-stone-400">
              <Clock className="w-4 h-4 text-champagne-400 mt-1 flex-shrink-0" />
              <div className="space-y-1">
                <p className="flex justify-between gap-4">
                  <span className="text-stone-300">Mon &ndash; Fri:</span>
                  <span>9:00 AM &ndash; 8:00 PM</span>
                </p>
                <p className="flex justify-between gap-4">
                  <span className="text-stone-300">Saturday:</span>
                  <span>9:00 AM &ndash; 7:00 PM</span>
                </p>
                <p className="flex justify-between gap-4">
                  <span className="text-stone-300">Sunday:</span>
                  <span>10:00 AM &ndash; 6:00 PM</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-espresso-800 text-xs text-stone-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>&copy; {new Date().getFullYear()} SalonBook Atelier Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-stone-300 transition-colors">Privacy Policy</span>
            <span className="hover:text-stone-300 transition-colors">Terms of Service</span>
            <span className="hover:text-stone-300 transition-colors">Sanitation Standards</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
