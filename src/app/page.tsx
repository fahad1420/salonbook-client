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
  CheckCircle2,
  CalendarCheck,
  Star,
} from 'lucide-react';

const CATEGORY_IMAGES: Record<string, string> = {
  'Haircut & Styling':
    'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80',
  'Hair Coloring':
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
  'Hair Treatment':
    'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=600&q=80',
  'Facial & Skincare':
    'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80',
  'Makeup':
    'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80',
  'Manicure & Pedicure':
    'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=600&q=80',
  'Spa & Massage':
    'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=600&q=80',
};

export default function HomePage() {
  const [featuredServices, setFeaturedServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadFeatured() {
      try {
        const res = await api.get<{ success: boolean; data: Service[] }>(
          '/services?limit=6'
        );
        if (res.success && res.data && res.data.length > 0) {
          setFeaturedServices(res.data);
        }
      } catch (err) {
        console.error('Failed to load featured services:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadFeatured();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-alabaster-100">
      <Navbar />

      <main className="flex-1">
        {/* Hero Banner */}
        <section className="relative overflow-hidden pt-12 pb-24 md:pt-20 md:pb-32 bg-gradient-to-b from-alabaster-200/60 to-alabaster-100 border-b border-alabaster-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              {/* Hero Copy */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-champagne-100/90 text-champagne-700 border border-champagne-300 text-xs font-semibold tracking-wider uppercase">
                  <Sparkles className="w-3.5 h-3.5 text-champagne-600" />
                  <span>Bespoke Beauty Atelier</span>
                </div>

                <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-espresso-950 leading-[1.15]">
                  Where Artistry Meets{' '}
                  <span className="italic text-champagne-600">Haute Couture</span>{' '}
                  Pampering.
                </h1>

                <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                  Immerse yourself in precision scissor sculpture, luminous botanical color alchemy, and restorative spa therapies curated by master European practitioners.
                </p>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                  <Link
                    href="/services"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-espresso-900 hover:bg-espresso-800 text-alabaster-100 text-sm font-semibold tracking-wide transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                  >
                    <span>Explore Salon Services</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    href="/sign-up"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full bg-white hover:bg-alabaster-50 text-espresso-900 border border-alabaster-300 text-sm font-semibold tracking-wide transition-all shadow-sm hover:shadow"
                  >
                    <CalendarCheck className="w-4 h-4 text-champagne-600" />
                    <span>Reserve Session</span>
                  </Link>
                </div>

                {/* Trust Badges */}
                <div className="pt-8 border-t border-alabaster-300 grid grid-cols-3 gap-4 text-left">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-champagne-600 flex-shrink-0" />
                    <span className="text-xs font-medium text-stone-600">
                      Master Stylists
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-champagne-600 flex-shrink-0" />
                    <span className="text-xs font-medium text-stone-600">
                      Medical-Grade Hygiene
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Leaf className="w-5 h-5 text-champagne-600 flex-shrink-0" />
                    <span className="text-xs font-medium text-stone-600">
                      100% Organic Formulations
                    </span>
                  </div>
                </div>
              </div>

              {/* Hero Image Mosaic */}
              <div className="lg:col-span-5 relative">
                <div className="relative mx-auto max-w-md lg:max-w-none">
                  {/* Main Large Image */}
                  <div className="relative h-96 sm:h-[450px] w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                    <Image
                      src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80"
                      alt="Luxury Salon Interior"
                      fill
                      priority
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  </div>

                  {/* Floating Testimonial Tag */}
                  <div className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-alabaster-300 max-w-xs hidden sm:block animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center gap-1 text-amber-500 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-xs font-medium text-espresso-950">
                      &ldquo;The balayage and champagne blowout was an absolute revelation.&rdquo;
                    </p>
                    <span className="text-[10px] text-stone-500 uppercase tracking-wider block mt-1">
                      Vivienne L. &bull; Verified Client
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Salon Service Categories */}
        <section className="py-20 md:py-28 bg-white border-b border-alabaster-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-champagne-600">
                Curated Disciplines
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight text-espresso-950">
                Explore by Salon Category
              </h2>
              <p className="text-stone-500 text-sm leading-relaxed">
                Select from our signature disciplines, each administered by certified master artists using botanical, cruelty-free formulas.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {SERVICE_CATEGORIES.map((cat) => {
                const imageUrl =
                  CATEGORY_IMAGES[cat] ||
                  'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80';

                return (
                  <Link
                    key={cat}
                    href={`/services?category=${encodeURIComponent(cat)}`}
                    className="group relative h-48 sm:h-56 rounded-2xl overflow-hidden border border-alabaster-300 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <Image
                      src={imageUrl}
                      alt={cat}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-espresso-950/85 via-espresso-950/40 to-transparent" />
                    
                    <div className="absolute inset-0 p-4 flex flex-col justify-end text-white">
                      <span className="text-xs text-champagne-300 tracking-wider uppercase font-medium">
                        Atelier Focus
                      </span>
                      <h3 className="font-serif text-lg font-medium text-white group-hover:text-champagne-300 transition-colors">
                        {cat}
                      </h3>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Featured Salon Services (6+ active services from DB) */}
        <section className="py-20 md:py-28 bg-alabaster-100 border-b border-alabaster-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
              <div className="space-y-2 text-center md:text-left">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-champagne-600">
                  Featured Treatments
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight text-espresso-950">
                  Signature Salon Rituals
                </h2>
                <p className="text-stone-500 text-sm max-w-xl">
                  Discover our clients&apos; most coveted treatments, from artisanal precision cuts to 24-karat cellular skin therapies.
                </p>
              </div>

              <Link
                href="/services"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-espresso-900 text-espresso-900 hover:bg-espresso-900 hover:text-alabaster-100 text-xs font-semibold tracking-wide transition-all"
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
              <div className="text-center py-16 bg-white rounded-3xl border border-alabaster-300 p-8">
                <p className="text-stone-600 text-sm">
                  Services are currently being curated. Please check back shortly.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Signature Experience Section (Custom Extra Section) */}
        <section className="py-20 md:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-champagne-600">
                The SalonBook Standard
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight text-espresso-950">
                Our Signature Experience
              </h2>
              <p className="text-stone-500 text-sm leading-relaxed">
                Every reservation is an unhurried, multi-sensory retreat conducted within private suites adhering to strict clinical sterilization.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="p-8 rounded-3xl bg-alabaster-100 border border-alabaster-300 space-y-4 hover:border-champagne-400 transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-espresso-900 text-champagne-400 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-xl font-medium text-espresso-950">
                  Clinical Sanitation
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed">
                  Hospital-grade autoclave sterilization for all precision metal tools, complemented by single-use organic linen and air-purification filters.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-alabaster-100 border border-alabaster-300 space-y-4 hover:border-champagne-400 transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-espresso-900 text-champagne-400 flex items-center justify-center">
                  <Scissors className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-xl font-medium text-espresso-950">
                  Master European Stylists
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed">
                  Our resident practitioners undergo continuous seasonal certification in Paris and Milan, mastering tailored face architecture and colorimetry.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-alabaster-100 border border-alabaster-300 space-y-4 hover:border-champagne-400 transition-colors">
                <div className="w-12 h-12 rounded-2xl bg-espresso-900 text-champagne-400 flex items-center justify-center">
                  <Leaf className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-xl font-medium text-espresso-950">
                  Clean Organic Formulations
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed">
                  We formulate treatments exclusively with ethically sourced marine caviar, organic Bulgarian rosewater, and ammonia-free pigments.
                </p>
              </div>
            </div>

            {/* Metrics Ribbon */}
            <div className="bg-espresso-950 text-white rounded-3xl p-8 sm:p-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center border border-espresso-800">
              <div className="space-y-1">
                <p className="font-serif text-3xl sm:text-4xl font-semibold text-champagne-400">
                  99.8%
                </p>
                <p className="text-xs text-stone-400 uppercase tracking-wider">
                  Client Satisfaction
                </p>
              </div>
              <div className="space-y-1">
                <p className="font-serif text-3xl sm:text-4xl font-semibold text-champagne-400">
                  15+
                </p>
                <p className="text-xs text-stone-400 uppercase tracking-wider">
                  Years Atelier Craft
                </p>
              </div>
              <div className="space-y-1">
                <p className="font-serif text-3xl sm:text-4xl font-semibold text-champagne-400">
                  100%
                </p>
                <p className="text-xs text-stone-400 uppercase tracking-wider">
                  Sterilization Standard
                </p>
              </div>
              <div className="space-y-1">
                <p className="font-serif text-3xl sm:text-4xl font-semibold text-champagne-400">
                  12,000+
                </p>
                <p className="text-xs text-stone-400 uppercase tracking-wider">
                  Bespoke Sessions
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
