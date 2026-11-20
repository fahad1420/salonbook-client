'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ServiceCard from '@/components/ServiceCard';
import ServiceSkeleton from '@/components/ServiceSkeleton';
import { Service, SERVICE_CATEGORIES } from '@/types';
import { api } from '@/lib/api';
import {
  Search,
  SlidersHorizontal,
  Sparkles,
  X,
  ArrowUpDown,
  RotateCcw,
  Sparkle,
} from 'lucide-react';

function ServicesContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [sortBy, setSortBy] = useState<'default' | 'price_asc' | 'price_desc'>(
    (searchParams.get('sort') as any) || 'default'
  );

  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Sync state changes with URL query string
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm.trim()) {
      params.set('search', searchTerm.trim());
    }
    if (selectedCategory && selectedCategory !== 'all') {
      params.set('category', selectedCategory);
    }
    if (sortBy && sortBy !== 'default') {
      params.set('sort', sortBy);
    }

    const queryString = params.toString() ? `?${params.toString()}` : '';
    router.replace(`${pathname}${queryString}`, { scroll: false });
  }, [searchTerm, selectedCategory, sortBy, pathname, router]);

  // Fetch filtered catalog from backend
  const fetchServices = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm.trim()) {
        params.append('search', searchTerm.trim());
      }
      if (selectedCategory && selectedCategory !== 'all') {
        params.append('category', selectedCategory);
      }
      if (sortBy === 'price_asc' || sortBy === 'price_desc') {
        params.append('sort', sortBy);
      }

      const queryString = params.toString() ? `?${params.toString()}` : '';
      const res = await api.get<{ success: boolean; data: Service[] }>(
        `/services${queryString}`
      );

      if (res.success && res.data) {
        setServices(res.data);
      }
    } catch (err) {
      console.error('Error fetching services catalog:', err);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, selectedCategory, sortBy]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchServices();
    }, 250);
    return () => clearTimeout(timeoutId);
  }, [fetchServices]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSortBy('default');
    router.replace(pathname, { scroll: false });
  };

  return (
    <div className="min-h-screen flex flex-col bg-alabaster-100">
      <Navbar />

      <main className="flex-1 py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-champagne-100/90 text-champagne-700 text-xs font-semibold tracking-wider uppercase border border-champagne-300 shadow-soft">
              <Sparkles className="w-3.5 h-3.5 text-champagne-600" />
              <span>Full Atelier Menu &bull; Curated Services</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-espresso-950">
              Browse Salon &amp; Spa Treatments
            </h1>
            <p className="text-stone-500 text-sm sm:text-base leading-relaxed">
              Explore our comprehensive service rituals, filter by discipline, and reserve your private session with certified master artists.
            </p>
          </div>

          {/* Search, Filter & Sort Console */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-alabaster-300 shadow-soft space-y-6 mb-12">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Search Input */}
              <div className="md:col-span-8 relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search treatments by name (e.g. Balayage, Precision Cut, Caviar, Facial)..."
                  className="w-full pl-11 pr-10 py-3.5 rounded-2xl border border-alabaster-300 focus:border-champagne-500 focus:ring-1 focus:ring-champagne-500 bg-alabaster-50/50 text-sm text-espresso-900 placeholder:text-stone-400 outline-none transition-colors"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-espresso-950 transition-colors"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Price Sort Dropdown */}
              <div className="md:col-span-4 relative">
                <ArrowUpDown className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full pl-11 pr-8 py-3.5 rounded-2xl border border-alabaster-300 focus:border-champagne-500 focus:ring-1 focus:ring-champagne-500 bg-alabaster-50/50 text-sm text-espresso-900 outline-none appearance-none cursor-pointer transition-colors"
                >
                  <option value="default">Sort by: Curated Featured</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-500">
                <SlidersHorizontal className="w-3.5 h-3.5 text-champagne-600" />
                <span>Filter by Atelier Discipline</span>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setSelectedCategory('all')}
                  className={`px-4 py-2 rounded-full text-xs font-medium tracking-wide transition-all ${
                    selectedCategory === 'all'
                      ? 'bg-espresso-900 text-alabaster-100 shadow-sm'
                      : 'bg-alabaster-100 text-stone-700 hover:bg-alabaster-200 border border-alabaster-300'
                  }`}
                >
                  All Disciplines
                </button>
                {SERVICE_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full text-xs font-medium tracking-wide transition-all ${
                      selectedCategory === cat
                        ? 'bg-espresso-900 text-alabaster-100 shadow-sm'
                        : 'bg-alabaster-100 text-stone-700 hover:bg-alabaster-200 border border-alabaster-300'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Summary & Reset Bar */}
          <div className="flex items-center justify-between mb-8">
            <p className="text-xs uppercase tracking-wider font-semibold text-stone-500">
              Showing <span className="text-espresso-950 font-bold">{services.length}</span> active treatments
            </p>

            {(searchTerm || selectedCategory !== 'all' || sortBy !== 'default') && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 font-semibold transition-colors bg-rose-50 px-3 py-1.5 rounded-full border border-rose-200"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset all filters</span>
              </button>
            )}
          </div>

          {/* Service Cards Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <ServiceSkeleton key={i} />
              ))}
            </div>
          ) : services.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => (
                <ServiceCard key={service._id} service={service} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-alabaster-300 p-8 space-y-4 shadow-soft max-w-xl mx-auto">
              <div className="w-14 h-14 rounded-full bg-champagne-100 flex items-center justify-center text-champagne-700 mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-2xl font-medium text-espresso-950">
                No matching treatments found
              </h3>
              <p className="text-stone-500 text-sm leading-relaxed">
                We couldn&apos;t find any active salon treatments matching your query. Try clearing search keywords or switching categories.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-6 py-2.5 rounded-full bg-espresso-900 text-alabaster-100 text-xs font-semibold hover:bg-espresso-800 transition-colors shadow-soft"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function ServicesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-alabaster-100" />}>
      <ServicesContent />
    </Suspense>
  );
}
