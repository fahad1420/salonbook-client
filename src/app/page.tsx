'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ServiceCard from '@/components/ServiceCard';
import ServiceSkeleton from '@/components/ServiceSkeleton';
import { Service, SERVICE_CATEGORIES } from '@/types';
import { api } from '@/lib/api';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Award,
  Leaf,
  Scissors,
  CalendarCheck,
  ChevronRight,
  Clock,
  CreditCard,
  CheckCircle2,
  Calendar,
  Lock,
} from 'lucide-react';

const CATEGORY_META: Record<
  string,
  { image: string; tag: string; description: string }
> = {
  'Haircut & Styling': {
    image:
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
    tag: 'Hair Architecture',
    description: 'Precision cutting, custom blowouts, and tailored styling.',
  },
  'Hair Coloring': {
    image:
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    tag: 'Color Alchemy',
    description: 'Dimensional balayage, gloss treatments, and tone correction.',
  },
  'Hair Treatment': {
    image:
      'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=800&q=80',
    tag: 'Deep Restoration',
    description: 'Peptide infusions, moisture locks, and restorative keratin seals.',
  },
  'Facial & Skincare': {
    image:
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
    tag: 'Dermal Wellness',
    description: 'Deep cleansing, hydration therapies, and renewal facials.',
  },
  Makeup: {
    image:
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80',
    tag: 'Artistry & Glamour',
    description: 'Event styling, editorial techniques, and custom application.',
  },
  'Manicure & Pedicure': {
    image:
      'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=800&q=80',
    tag: 'Hand & Foot Care',
    description: 'Exfoliation, cuticle conditioning, and durable vegan lacquers.',
  },
  'Spa & Massage': {
    image:
      'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80',
    tag: 'Relaxation Therapies',
    description: 'Full-body relaxation, basalt stone therapy, and aromatherapy.',
  },
};

const HOW_IT_WORKS_STEPS = [
  {
    step: '01',
    title: 'Select Your Treatment',
    description:
      'Explore our transparent catalog of salon rituals with clear pricing, session durations, and detailed descriptions.',
    icon: Scissors,
  },
  {
    step: '02',
    title: 'Choose Date & Time Slot',
    description:
      'Select from predefined daily salon slots. Live availability verification ensures zero double-booking conflicts.',
    icon: Calendar,
  },
  {
    step: '03',
    title: 'Confirmation & Contactless Pay',
    description:
      'Our concierge reviews your request. Once confirmed, settle securely with Stripe for an unhurried salon visit.',
    icon: CreditCard,
  },
];

const POLICIES_STANDARDS = [
  {
    title: 'Clinical Tool Sterilization',
    description:
      'All precision metal instruments undergo medical autoclave sterilization before every single appointment.',
    icon: ShieldCheck,
  },
  {
    title: 'Transparent Upfront Pricing',
    description:
      'Every service displays its exact investment and duration upfront. No hidden chair fees or unexpected charges.',
    icon: Award,
  },
  {
    title: 'Self-Service Scheduling',
    description:
      'Easily cancel pending reservations or review past session history through your private customer portal.',
    icon: CalendarCheck,
  },
];

export default function HomePage() {
  const [featuredServices, setFeaturedServices] = useState<Service[]>([]);
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.get<{ success: boolean; data: Service[] }>('/services');
        if (res.success && res.data) {
          setFeaturedServices(res.data.slice(0, 6));

          const counts: Record<string, number> = {};
          SERVICE_CATEGORIES.forEach((cat) => {
            counts[cat] = res.data.filter((s) => s.category === cat).length;
          });
          setCategoryCounts(counts);
        }
      } catch (err) {
        console.error('Failed to load services data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-alabaster-100">
      <Navbar />

      <main className="flex-1">
        {/* 1. Asymmetric Split Hero Banner */}
        <section className="relative overflow-hidden pt-10 pb-20 md:pt-16 md:pb-28 bg-gradient-to-b from-alabaster-200/50 via-alabaster-100 to-alabaster-100 border-b border-alabaster-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Authentic Feature Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-6 text-xs text-stone-600 font-medium">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-champagne-100/90 text-champagne-700 border border-champagne-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-champagne-600" />
                Verified Salon Appointments
              </span>
              <span className="hidden sm:inline-block text-stone-300">•</span>
              <span className="inline-flex items-center gap-1 text-stone-600">
                <Calendar className="w-4 h-4 text-champagne-600" />
                Real-Time Slot Availability
              </span>
              <span className="hidden sm:inline-block text-stone-300">•</span>
              <span className="inline-flex items-center gap-1 text-stone-600">
                <Lock className="w-4 h-4 text-champagne-600" />
                Contactless Stripe Checkout
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              {/* Hero Copy */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-espresso-900 border border-alabaster-300 text-xs font-semibold tracking-wider uppercase shadow-soft">
                  <Sparkles className="w-3.5 h-3.5 text-champagne-600" />
                  <span>Salon &amp; Spa Appointment Booking</span>
                </div>

                <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-espresso-950 leading-[1.12]">
                  Elevate Your Self-Care with{' '}
                  <span className="italic text-champagne-600">Seamless Atelier</span>{' '}
                  Reservations.
                </h1>

                <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                  Discover curated salon rituals across 7 dedicated disciplines. Reserve predefined time slots with real-time conflict prevention and secure digital checkout.
                </p>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                  <Link
                    href="/services"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-espresso-900 hover:bg-espresso-800 text-alabaster-100 text-sm font-semibold tracking-wide transition-all shadow-luxury hover:shadow-luxury-hover hover:-translate-y-0.5"
                  >
                    <span>Explore Salon Services</span>
                    <ArrowRight className="w-4 h-4 text-champagne-400" />
                  </Link>

                  <a
                    href="#categories"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-white hover:bg-alabaster-50 text-espresso-900 border border-alabaster-300 text-sm font-semibold tracking-wide transition-all shadow-soft"
                  >
                    <span>Browse Disciplines</span>
                    <ChevronRight className="w-4 h-4 text-stone-400" />
                  </a>
                </div>

                {/* Platform Guarantees */}
                <div className="pt-8 border-t border-alabaster-300 grid grid-cols-3 gap-4 text-left">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-champagne-100 flex items-center justify-center text-champagne-700 flex-shrink-0">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-espresso-950">Hygiene First</p>
                      <p className="text-[11px] text-stone-500">Sterilized Implements</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-champagne-100 flex items-center justify-center text-champagne-700 flex-shrink-0">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-espresso-950">Set Durations</p>
                      <p className="text-[11px] text-stone-500">Clear Service Times</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-champagne-100 flex items-center justify-center text-champagne-700 flex-shrink-0">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-espresso-950">Secure Pay</p>
                      <p className="text-[11px] text-stone-500">Stripe Integration</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Framed Editorial Visual */}
              <div className="lg:col-span-5 relative">
                <div className="relative mx-auto max-w-md lg:max-w-none">
                  <div className="absolute -top-4 -right-4 w-72 h-72 bg-champagne-200/50 rounded-full blur-3xl -z-10" />

                  <div className="relative h-96 sm:h-[480px] w-full rounded-3xl overflow-hidden shadow-luxury border-4 border-white">
                    <Image
                      src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80"
                      alt="Luxury Salon Interior"
                      fill
                      priority
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-espresso-950/70 via-transparent to-transparent" />

                    <div className="absolute bottom-6 left-6 right-6 text-white">
                      <span className="text-[11px] font-semibold uppercase tracking-widest text-champagne-300">
                        Atelier Atmosphere
                      </span>
                      <p className="font-serif text-xl sm:text-2xl font-medium mt-1">
                        Curated Salon &amp; Spa Suites
                      </p>
                    </div>
                  </div>

                  {/* Feature Highlight Card */}
                  <div className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-luxury border border-alabaster-300 max-w-xs hidden sm:block">
                    <div className="flex items-center gap-2 text-champagne-700 text-xs font-semibold mb-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Dedicated Appointment Flow</span>
                    </div>
                    <p className="text-xs text-espresso-950 leading-snug">
                      Choose your preferred date, lock in an available slot, and receive concierge confirmation.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Interactive Category Showcase */}
        <section id="categories" className="py-20 md:py-28 bg-white border-b border-alabaster-300 scroll-mt-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-champagne-600">
                Service Disciplines
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight text-espresso-950">
                Explore by Salon Category
              </h2>
              <p className="text-stone-500 text-sm leading-relaxed">
                Select from our 7 core salon categories to discover active treatments, pricing, and time allocations.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {SERVICE_CATEGORIES.map((cat) => {
                const meta =
                  CATEGORY_META[cat] || {
                    image:
                      'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80',
                    tag: 'Salon Discipline',
                    description: 'Professional treatments tailored to your aesthetic.',
                  };
                const count = categoryCounts[cat] || 0;

                return (
                  <Link
                    key={cat}
                    href={`/services?category=${encodeURIComponent(cat)}`}
                    className="group relative rounded-2xl overflow-hidden border border-alabaster-300 bg-alabaster-50 shadow-soft hover:shadow-luxury-hover transition-all duration-300 flex flex-col h-[280px]"
                  >
                    <div className="relative h-40 w-full overflow-hidden">
                      <Image
                        src={meta.image}
                        alt={cat}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-espresso-950/80 via-espresso-950/20 to-transparent" />
                      
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] uppercase tracking-wider font-semibold text-espresso-900 border border-white/40">
                          {meta.tag}
                        </span>
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                        <span className="text-xs text-champagne-300 font-medium">
                          {count > 0 ? `${count} ${count === 1 ? 'Service' : 'Services'}` : 'Browse Services'}
                        </span>
                        <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-champagne-500 group-hover:text-espresso-950 transition-colors">
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-serif text-lg font-medium text-espresso-950 group-hover:text-champagne-700 transition-colors line-clamp-1">
                          {cat}
                        </h3>
                        <p className="text-stone-500 text-xs mt-1 line-clamp-2 leading-relaxed">
                          {meta.description}
                        </p>
                      </div>

                      <div className="pt-2 flex items-center gap-1 text-[11px] font-semibold text-champagne-700 uppercase tracking-wider">
                        <span>Browse Treatments</span>
                        <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* 3. Curated Featured Services (Dynamic Section 1: 6+ active services from DB) */}
        <section className="py-20 md:py-28 bg-alabaster-100 border-b border-alabaster-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
              <div className="space-y-2 text-center md:text-left">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-champagne-600">
                  Featured Offerings
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight text-espresso-950">
                  Curated Salon Treatments
                </h2>
                <p className="text-stone-500 text-sm max-w-xl">
                  Explore active services fetched directly from our database, featuring clear fees, duration schedules, and instant booking links.
                </p>
              </div>

              <Link
                href="/services"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-espresso-900 text-espresso-900 hover:bg-espresso-900 hover:text-alabaster-100 text-xs font-semibold tracking-wide transition-all shadow-soft"
              >
                <span>View Full Catalog</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <ServiceSkeleton key={i} />
                ))}
              </div>
            ) : featuredServices.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredServices.map((service) => (
                  <ServiceCard key={service._id} service={service} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-3xl border border-alabaster-300 p-8 shadow-soft">
                <p className="text-stone-600 text-sm">
                  Services are currently being added. Please check back shortly.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* 4. Extra Meaningful Section: How SalonBook Works */}
        <section className="py-20 md:py-28 bg-white border-b border-alabaster-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-champagne-600">
                Reservation Workflow
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight text-espresso-950">
                How SalonBook Works
              </h2>
              <p className="text-stone-500 text-sm leading-relaxed">
                A simple, reliable three-step process engineered to eliminate scheduling friction and prevent double-booking.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {HOW_IT_WORKS_STEPS.map((item) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={item.step}
                    className="relative rounded-3xl border border-alabaster-300 bg-alabaster-50 p-8 space-y-5 shadow-soft hover:shadow-luxury-hover transition-all duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-espresso-900 text-champagne-400 flex items-center justify-center shadow-sm">
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <span className="font-serif text-3xl font-semibold text-champagne-300">
                        {item.step}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-serif text-xl font-medium text-espresso-950">
                        {item.title}
                      </h3>
                      <p className="text-stone-600 text-sm leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 5. Salon Standards & Booking Policies */}
        <section className="py-20 md:py-28 bg-alabaster-100 border-b border-alabaster-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-champagne-600">
                Operating Policies
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight text-espresso-950">
                Our Standards &amp; Client Policies
              </h2>
              <p className="text-stone-500 text-sm leading-relaxed">
                Clear expectations, clinical hygiene standards, and client-first cancellation policies.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {POLICIES_STANDARDS.map((policy) => {
                const IconComponent = policy.icon;
                return (
                  <div
                    key={policy.title}
                    className="p-8 rounded-3xl bg-white border border-alabaster-300 space-y-4 hover:border-champagne-400 transition-colors shadow-soft"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-espresso-900 text-champagne-400 flex items-center justify-center">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <h3 className="font-serif text-xl font-medium text-espresso-950">
                      {policy.title}
                    </h3>
                    <p className="text-stone-600 text-sm leading-relaxed">
                      {policy.description}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Real Platform Capability Facts */}
            <div className="bg-espresso-950 text-white rounded-3xl p-8 sm:p-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center border border-espresso-800 shadow-luxury">
              <div className="space-y-1">
                <p className="font-serif text-3xl sm:text-4xl font-semibold text-champagne-400">
                  7
                </p>
                <p className="text-xs text-stone-400 uppercase tracking-wider">
                  Service Categories
                </p>
              </div>
              <div className="space-y-1">
                <p className="font-serif text-3xl sm:text-4xl font-semibold text-champagne-400">
                  5
                </p>
                <p className="text-xs text-stone-400 uppercase tracking-wider">
                  Daily Time Windows
                </p>
              </div>
              <div className="space-y-1">
                <p className="font-serif text-3xl sm:text-4xl font-semibold text-champagne-400">
                  100%
                </p>
                <p className="text-xs text-stone-400 uppercase tracking-wider">
                  Verified Stripe Webhook
                </p>
              </div>
              <div className="space-y-1">
                <p className="font-serif text-3xl sm:text-4xl font-semibold text-champagne-400">
                  24/7
                </p>
                <p className="text-xs text-stone-400 uppercase tracking-wider">
                  Online Booking Access
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
