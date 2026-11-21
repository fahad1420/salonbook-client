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
  CalendarCheck,
  X,
  ArrowUpDown,
  RotateCcw,
  AlertCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const ITEMS_PER_PAGE = 6;

function ServicesContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [sortBy, setSortBy] = useState<'default' | 'price_asc' | 'price_desc'>(
    (searchParams.get('sort') as any) || 'default'
  );
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get('page') || '1', 10) || 1
  );

  const [allServices, setAllServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
    if (currentPage > 1) {
      params.set('page', currentPage.toString());
    }

    const queryString = params.toString() ? `?${params.toString()}` : '';
    router.replace(`${pathname}${queryString}`, { scroll: false });
  }, [searchTerm, selectedCategory, sortBy, currentPage, pathname, router]);

  // Fetch filtered catalog from backend
  const fetchServices = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
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
      const res = await api.get<{
        success: boolean;
        data: Service[];
        totalCount?: number;
      }>(`/services${queryString}`);

      if (res.success && Array.isArray(res.data)) {
        setAllServices(res.data);
      } else {
        setErrorMessage('Unable to load services catalog.');
      }
    } catch (err) {
      console.error('Error fetching services catalog:', err);
      setErrorMessage((err as Error).message || 'Failed to connect to the salon catalog service.');
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

  // Reset page when search or category filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, sortBy]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSortBy('default');
    setCurrentPage(1);
    router.replace(pathname, { scroll: false });
  };

  // Pagination slicing
  const totalItems = allServices.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
  const validPage = Math.min(currentPage, totalPages);
  const startIndex = (validPage - 1) * ITEMS_PER_PAGE;
  const paginatedServices = allServices.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const hasActiveFilters = Boolean(
    searchTerm.trim() || selectedCategory !== 'all' || sortBy !== 'default'
  );

  return (
    <div className="min-h-screen flex flex-col bg-alabaster-100">
      <Navbar />

      <main className="flex-1 py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Editorial Page Header */}
          <header className="text-center max-w-3xl mx-auto space-y-3.5">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-champagne-100 text-champagne-800 text-xs font-semibold tracking-wider uppercase border border-champagne-300 shadow-soft">
              <CalendarCheck className="w-3.5 h-3.5 text-champagne-600" />
              <span>Full Atelier Menu &bull; Curated Services</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-espresso-950">
              Browse Salon &amp; Spa Treatments
            </h1>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              Explore our salon services, filter by category, and reserve an available appointment time slot.
            </p>
          </header>

          {/* Search, Filter & Sort Console */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-alabaster-300 shadow-soft space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Search Input */}
              <div className="md:col-span-8 relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search treatments by name (e.g. Balayage, Precision Cut, Caviar, Facial)..."
                  className="w-full pl-11 pr-10 py-3.5 rounded-2xl border border-alabaster-300 focus:border-champagne-500 focus:ring-1 focus:ring-champagne-500 bg-alabaster-50/60 text-sm text-espresso-900 placeholder:text-stone-400 outline-none transition-colors"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-espresso-950 transition-colors"
                    aria-label="Clear search input"
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
                  className="w-full pl-11 pr-10 py-3.5 rounded-2xl border border-alabaster-300 focus:border-champagne-500 focus:ring-1 focus:ring-champagne-500 bg-alabaster-50/60 text-sm text-espresso-900 outline-none appearance-none cursor-pointer transition-colors"
                >
                  <option value="default">Sort by: Curated Featured</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="space-y-3">
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

            {/* Active Filters Summary Bar */}
            {hasActiveFilters && (
              <div className="pt-3 border-t border-alabaster-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex flex-wrap items-center gap-2 text-stone-600">
                  <span className="font-medium text-stone-400 uppercase tracking-wider text-[11px]">Active Filters:</span>
                  {searchTerm && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-champagne-100 text-champagne-800 font-medium">
                      Search: &ldquo;{searchTerm}&rdquo;
                      <button onClick={() => setSearchTerm('')} aria-label="Remove search filter">
                        <X className="w-3 h-3 hover:text-rose-600" />
                      </button>
                    </span>
                  )}
                  {selectedCategory !== 'all' && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-champagne-100 text-champagne-800 font-medium">
                      {selectedCategory}
                      <button onClick={() => setSelectedCategory('all')} aria-label="Remove category filter">
                        <X className="w-3 h-3 hover:text-rose-600" />
                      </button>
                    </span>
                  )}
                  {sortBy !== 'default' && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-champagne-100 text-champagne-800 font-medium">
                      {sortBy === 'price_asc' ? 'Price: Low to High' : 'Price: High to Low'}
                      <button onClick={() => setSortBy('default')} aria-label="Reset sorting">
                        <X className="w-3 h-3 hover:text-rose-600" />
                      </button>
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-1.5 text-xs text-rose-700 hover:text-rose-800 font-semibold transition-colors bg-rose-50 px-3 py-1.5 rounded-full border border-rose-200 hover:bg-rose-100"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset All Filters</span>
                </button>
              </div>
            )}
          </section>

          {/* Results Summary Bar */}
          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-wider font-semibold text-stone-500">
              Showing{' '}
              <span className="text-espresso-950 font-bold">
                {totalItems === 0
                  ? 0
                  : `${startIndex + 1}-${Math.min(startIndex + ITEMS_PER_PAGE, totalItems)} of ${totalItems}`}
              </span>{' '}
              active treatments
            </p>
          </div>

          {/* Service Cards Grid / Skeletons / Error / Empty States */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <ServiceSkeleton key={i} />
              ))}
            </div>
          ) : errorMessage ? (
            /* API Error State */
            <div className="text-center py-16 bg-white rounded-3xl border border-rose-200 p-8 space-y-4 shadow-soft max-w-xl mx-auto">
              <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
                <AlertCircle className="w-7 h-7" />
              </div>
              <h2 className="font-serif text-2xl font-medium text-espresso-950">
                Unable to Load Services Catalog
              </h2>
              <p className="text-stone-500 text-sm leading-relaxed max-w-md mx-auto">
                {errorMessage} Please verify your connection or retry fetching our atelier offerings.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => fetchServices()}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-espresso-900 hover:bg-espresso-800 text-alabaster-100 text-xs font-semibold tracking-wide transition-all shadow-soft"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retry Connection</span>
                </button>
              </div>
            </div>
          ) : paginatedServices.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {paginatedServices.map((service) => (
                  <ServiceCard key={service._id} service={service} />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <nav
                  aria-label="Catalog pagination"
                  className="flex items-center justify-center gap-2 pt-8"
                >
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={validPage <= 1}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-alabaster-300 bg-white text-xs font-medium text-espresso-900 hover:bg-alabaster-100 disabled:opacity-40 disabled:pointer-events-none transition-all shadow-sm"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>

                  <div className="flex items-center gap-1 px-2">
                    {[...Array(totalPages)].map((_, idx) => {
                      const pageNum = idx + 1;
                      const isActive = pageNum === validPage;
                      return (
                        <button
                          key={pageNum}
                          type="button"
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-9 h-9 rounded-full text-xs font-semibold transition-all ${
                            isActive
                              ? 'bg-espresso-900 text-alabaster-100 shadow-sm'
                              : 'bg-white text-stone-600 hover:bg-alabaster-200 border border-alabaster-300'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={validPage >= totalPages}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-alabaster-300 bg-white text-xs font-medium text-espresso-900 hover:bg-alabaster-100 disabled:opacity-40 disabled:pointer-events-none transition-all shadow-sm"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </nav>
              )}
            </>
          ) : (
            /* Empty State */
            <div className="text-center py-20 bg-white rounded-3xl border border-alabaster-300 p-8 space-y-4 shadow-soft max-w-xl mx-auto">
              <div className="w-14 h-14 rounded-full bg-champagne-100 flex items-center justify-center text-champagne-700 mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h2 className="font-serif text-2xl font-medium text-espresso-950">
                No Matching Treatments Found
              </h2>
              <p className="text-stone-500 text-sm leading-relaxed max-w-md mx-auto">
                We couldn&apos;t find any active salon treatments matching your query. Try clearing search keywords or switching atelier disciplines.
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
