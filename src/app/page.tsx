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
  Star,
  CalendarCheck,
  ChevronRight,
  CheckCircle2,
  Clock,
  Sparkle,
  BadgeCheck,
} from 'lucide-react';

const CATEGORY_META: Record<
  string,
  { image: string; tag: string; description: string }
> = {
  'Haircut & Styling': {
    image:
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
    tag: 'Scissor Architecture',
    description: 'Precision geometry, volumetric blowouts, and bespoke shaping.',
  },
  'Hair Coloring': {
    image:
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
    tag: 'Botanical Color Alchemy',
    description: 'Sun-drenched balayage, organic glosses, and dimensional tints.',
  },
  'Hair Treatment': {
    image:
      'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=800&q=80',
    tag: 'Cellular Restoration',
    description: 'Caviar peptide complexes and micronized thermal keratin seals.',
  },
  'Facial & Skincare': {
    image:
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
    tag: 'Clinical Dermal Rituals',
    description: '24K colloidal gold, hyperbaric oxygen, and ultrasound lifting.',
  },
  Makeup: {
    image:
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80',
    tag: 'Haute Couture Artistry',
    description: 'Micronized mineral pigments, silk lashes, and editorial finishes.',
  },
  'Manicure & Pedicure': {
    image:
      'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=800&q=80',
    tag: 'Aromatherapy Nail Spa',
    description: 'Damask rose baths, sweet apricot micro-buffing, and vegan lacquer.',
  },
  'Spa & Massage': {
    image:
      'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80',
    tag: 'Holistic Body Rituals',
    description: 'Volcanic basalt therapy paired with cold-pressed botanical oils.',
  },
};

const MASTER_STYLISTS = [
  {
    name: 'Vivienne Laurent',
    title: 'Master Colorist & Creative Director',
    experience: '14+ Years • Paris & New York',
    specialty: 'Sun-Drenched Balayage & Organic Acidic Glossing',
    image:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    quote: 'Hair color should look like liquid light captured in silk.',
  },
  {
    name: 'Marcus Vance',
    title: 'Principal Scissor Architect',
    experience: '12+ Years • London Atelier',
    specialty: 'Precision Dry-Cutting & Tailored Facial Contouring',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    quote: 'Every scissor stroke is an architectural response to individual bone structure.',
  },
  {
    name: 'Dr. Sophia Chen',
    title: 'Lead Aesthetician & Dermal Specialist',
    experience: '10+ Years • Zurich Skin Clinic',
    specialty: '24K Cellular Therapy & Hyperbaric Oxygen Infusions',
    image:
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
    quote: 'True skin luminescence begins with cellular health and pure bio-compatible nutrients.',
  },
];

const CLIENT_STORIES = [
  {
    client: 'Elena Rostova',
    role: 'Editorial Fashion Director',
    avatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    service: 'Sun-Drenched Balayage & Gloss Finish',
    rating: 5,
    text: 'SalonBook is in an entirely different league. The private consultation suite, the quiet luxury atmosphere, and Vivienne’s balayage artistry gave me the exact dimensional shine I had spent years searching for.',
  },
  {
    client: 'Julian Thorne',
    role: 'Private Equity Managing Director',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    service: 'Artisanal Precision Haircut & Blowout',
    rating: 5,
    text: 'Marcus Vance’s precision scissor geometry is remarkable. The booking was seamless, my session began promptly on the minute, and the botanical scalp purification was deeply restorative.',
  },
  {
    client: 'Camille Moreau',
    role: 'Architectural Designer',
    avatar:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    service: '24K Gold Cellular Renewal Facial',
    rating: 5,
    text: 'The 24K Gold renewal therapy gave my skin an unbelievable glass-skin glow before Fashion Week. Truly bespoke, attentive, and tranquil luxury that sets the gold standard.',
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
          // Take top 6 active services
          setFeaturedServices(res.data.slice(0, 6));

          // Compute dynamic category counts
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
            {/* Quick Trust Bar */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-6 text-xs text-stone-600 font-medium">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-champagne-100/90 text-champagne-700 border border-champagne-300">
                <Star className="w-3.5 h-3.5 fill-champagne-500 text-champagne-500" />
                4.9★ Rated Luxury Studio
              </span>
              <span className="hidden sm:inline-block text-stone-300">•</span>
              <span className="inline-flex items-center gap-1 text-stone-600">
                <BadgeCheck className="w-4 h-4 text-champagne-600" />
                Instant Online Booking
              </span>
              <span className="hidden sm:inline-block text-stone-300">•</span>
              <span className="inline-flex items-center gap-1 text-stone-600">
                <Award className="w-4 h-4 text-champagne-600" />
                Certified Master Stylists
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              {/* Hero Copy */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-espresso-900 border border-alabaster-300 text-xs font-semibold tracking-wider uppercase shadow-soft">
                  <Sparkles className="w-3.5 h-3.5 text-champagne-600" />
                  <span>Haute Coiffure &amp; Restorative Wellness</span>
                </div>

                <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-espresso-950 leading-[1.12]">
                  Where Masterful Artistry Meets{' '}
                  <span className="italic text-champagne-600">Private Atelier</span>{' '}
                  Elegance.
                </h1>

                <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                  Reserve curated appointments for precision hair architecture, organic botanical balayage, and clinical 24K dermal rituals inside private sanctuary suites.
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
                    <span>View Disciplines</span>
                    <ChevronRight className="w-4 h-4 text-stone-400" />
                  </a>
                </div>

                {/* Assurance Indicators */}
                <div className="pt-8 border-t border-alabaster-300 grid grid-cols-3 gap-4 text-left">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-champagne-100 flex items-center justify-center text-champagne-700 flex-shrink-0">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-espresso-950">Medical Clean</p>
                      <p className="text-[11px] text-stone-500">Autoclave Sterilized</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-champagne-100 flex items-center justify-center text-champagne-700 flex-shrink-0">
                      <Scissors className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-espresso-950">1-on-1 Focus</p>
                      <p className="text-[11px] text-stone-500">Private Suite Time</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-champagne-100 flex items-center justify-center text-champagne-700 flex-shrink-0">
                      <Leaf className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-espresso-950">100% Organic</p>
                      <p className="text-[11px] text-stone-500">Cruelty-Free Actives</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Framed Editorial Visual */}
              <div className="lg:col-span-5 relative">
                <div className="relative mx-auto max-w-md lg:max-w-none">
                  {/* Decorative Backdrop Accent */}
                  <div className="absolute -top-4 -right-4 w-72 h-72 bg-champagne-200/50 rounded-full blur-3xl -z-10" />

                  {/* Main Framed Photography */}
                  <div className="relative h-96 sm:h-[480px] w-full rounded-3xl overflow-hidden shadow-luxury border-4 border-white">
                    <Image
                      src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80"
                      alt="Luxury Salon Suite"
                      fill
                      priority
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-espresso-950/70 via-transparent to-transparent" />

                    <div className="absolute bottom-6 left-6 right-6 text-white">
                      <span className="text-[11px] font-semibold uppercase tracking-widest text-champagne-300">
                        Atelier Premiere
                      </span>
                      <p className="font-serif text-xl sm:text-2xl font-medium mt-1">
                        Sanctuary Suite 01 &bull; Madison Ave
                      </p>
                    </div>
                  </div>

                  {/* Floating Client Trust Card */}
                  <div className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-luxury border border-alabaster-300 max-w-xs hidden sm:block animate-in fade-in duration-700">
                    <div className="flex items-center gap-1 text-champagne-600 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-champagne-500 text-champagne-500" />
                      ))}
                    </div>
                    <p className="text-xs font-medium text-espresso-950 leading-snug">
                      &ldquo;The balayage &amp; cashmere blowout was an absolute revelation.&rdquo;
                    </p>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-alabaster-200 text-[10px] text-stone-500">
                      <span>Vivienne L. &bull; Verified Client</span>
                      <span className="text-champagne-700 font-medium">Madison Atelier</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Interactive Category Showcase (Dynamic Section 2) */}
        <section id="categories" className="py-20 md:py-28 bg-white border-b border-alabaster-300 scroll-mt-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-champagne-600">
                Curated Disciplines
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight text-espresso-950">
                Explore by Salon Category
              </h2>
              <p className="text-stone-500 text-sm leading-relaxed">
                Select your preferred discipline to browse available treatments, duration schedules, and master stylist allocations.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {SERVICE_CATEGORIES.map((cat) => {
                const meta =
                  CATEGORY_META[cat] || {
                    image:
                      'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80',
                    tag: 'Atelier Discipline',
                    description: 'Bespoke treatments tailored to your aesthetic preference.',
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
                          {count > 0 ? `${count} ${count === 1 ? 'Ritual' : 'Rituals'}` : 'Curated Rituals'}
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
                  Services are currently being curated. Please check back shortly.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* 4. Extra Section 1 — The SalonBook Standard & Master Stylists Spotlight */}
        <section className="py-20 md:py-28 bg-white border-b border-alabaster-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-champagne-600">
                Atelier Craftsmanship
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight text-espresso-950">
                The SalonBook Standard &amp; Master Stylists
              </h2>
              <p className="text-stone-500 text-sm leading-relaxed">
                Meet the resident artists and practitioners defining contemporary luxury salon standards through rigorous European craftsmanship.
              </p>
            </div>

            {/* Master Stylists Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
              {MASTER_STYLISTS.map((stylist) => (
                <div
                  key={stylist.name}
                  className="group rounded-3xl overflow-hidden border border-alabaster-300 bg-alabaster-50 p-6 flex flex-col justify-between hover:border-champagne-400 transition-all duration-300 shadow-soft hover:shadow-luxury-hover"
                >
                  <div className="space-y-4">
                    <div className="relative h-64 w-full rounded-2xl overflow-hidden bg-alabaster-200">
                      <Image
                        src={stylist.image}
                        alt={stylist.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-espresso-950/60 via-transparent to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <span className="text-[10px] tracking-widest uppercase font-semibold text-champagne-300">
                          {stylist.experience}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-serif text-2xl font-medium text-espresso-950">
                        {stylist.name}
                      </h3>
                      <p className="text-xs text-champagne-700 font-semibold uppercase tracking-wider mt-0.5">
                        {stylist.title}
                      </p>
                      <p className="text-stone-600 text-sm mt-3 leading-relaxed">
                        <span className="font-medium text-espresso-950">Focus:</span>{' '}
                        {stylist.specialty}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-alabaster-200">
                    <p className="text-xs italic text-stone-500">
                      &ldquo;{stylist.quote}&rdquo;
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Hygiene & Formulation Standard Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-3xl bg-alabaster-100 border border-alabaster-300 space-y-4 hover:border-champagne-400 transition-colors shadow-soft">
                <div className="w-12 h-12 rounded-2xl bg-espresso-900 text-champagne-400 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-xl font-medium text-espresso-950">
                  Hospital-Grade Sterilization
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed">
                  Medical autoclave sterilization for precision stainless implements, complemented by single-use organic linens and continuous HEPA filtration in each suite.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-alabaster-100 border border-alabaster-300 space-y-4 hover:border-champagne-400 transition-colors shadow-soft">
                <div className="w-12 h-12 rounded-2xl bg-espresso-900 text-champagne-400 flex items-center justify-center">
                  <Scissors className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-xl font-medium text-espresso-950">
                  Tailored Bone-Structure Architecture
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed">
                  No cookie-cutter haircuts. Every scissor cut and balayage placement is calculated according to your unique bone architecture and natural growth habits.
                </p>
              </div>

              <div className="p-8 rounded-3xl bg-alabaster-100 border border-alabaster-300 space-y-4 hover:border-champagne-400 transition-colors shadow-soft">
                <div className="w-12 h-12 rounded-2xl bg-espresso-900 text-champagne-400 flex items-center justify-center">
                  <Leaf className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-xl font-medium text-espresso-950">
                  Clean Bio-Compatible Actives
                </h3>
                <p className="text-stone-600 text-sm leading-relaxed">
                  We formulate strictly with French marine caviar, organic cold-pressed botanicals, and ammonia-free pigments that protect and nourish long-term hair integrity.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Extra Section 2 (Bonus Polish) — Client Stories / Verified Reviews Showcase */}
        <section className="py-20 md:py-28 bg-alabaster-100 border-b border-alabaster-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-champagne-600">
                Verified Client Stories
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight text-espresso-950">
                Words from Our Atelier Guests
              </h2>
              <p className="text-stone-500 text-sm leading-relaxed">
                Read authentic feedback from discerning clients who have made SalonBook their sanctuary for luxury beauty and wellness.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {CLIENT_STORIES.map((story) => (
                <div
                  key={story.client}
                  className="bg-white rounded-3xl p-8 border border-alabaster-300 shadow-soft hover:shadow-luxury-hover transition-all duration-300 flex flex-col justify-between space-y-6"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-champagne-600">
                        {[...Array(story.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 fill-champagne-500 text-champagne-500"
                          />
                        ))}
                      </div>
                      <span className="text-[10px] tracking-wider uppercase font-semibold text-stone-400 bg-alabaster-100 px-2.5 py-1 rounded-full border border-alabaster-200">
                        Verified
                      </span>
                    </div>

                    <p className="text-stone-700 text-sm leading-relaxed italic">
                      &ldquo;{story.text}&rdquo;
                    </p>
                  </div>

                  <div className="pt-4 border-t border-alabaster-200 flex items-center gap-3.5">
                    <div className="relative w-11 h-11 rounded-full overflow-hidden border border-champagne-300 flex-shrink-0">
                      <Image
                        src={story.avatar}
                        alt={story.client}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-espresso-950 truncate">
                        {story.client}
                      </p>
                      <p className="text-xs text-stone-500 truncate">{story.role}</p>
                      <p className="text-[11px] text-champagne-700 font-medium truncate mt-0.5">
                        {story.service}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Metrics Ribbon */}
            <div className="mt-16 bg-espresso-950 text-white rounded-3xl p-8 sm:p-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center border border-espresso-800 shadow-luxury">
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
