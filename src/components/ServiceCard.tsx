'use client';

import React from 'react';
import Link from 'next/link';
import { Service } from '@/types';
import { Clock, ArrowRight, Sparkles } from 'lucide-react';
import ServiceImage from './ServiceImage';

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <article className="group bg-white rounded-3xl overflow-hidden border border-alabaster-300 hover:border-champagne-400/80 shadow-soft hover:shadow-luxury-hover transition-all duration-300 flex flex-col h-full">
      {/* Service Photography Header */}
      <div className="relative h-60 sm:h-64 w-full overflow-hidden bg-alabaster-200">
        <ServiceImage
          src={service.image}
          alt={service.serviceName}
          category={service.category}
          className="transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Ambient Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-espresso-950/70 via-espresso-950/20 to-transparent opacity-60 group-hover:opacity-45 transition-opacity" />

        {/* Category Badge */}
        <div className="absolute top-4 left-4 z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-espresso-900 text-[11px] font-semibold tracking-wider uppercase shadow-sm border border-alabaster-300">
            <Sparkles className="w-3 h-3 text-champagne-600" />
            <span>{service.category}</span>
          </span>
        </div>

        {/* Duration Badge */}
        <div className="absolute bottom-4 right-4 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-espresso-950/80 backdrop-blur-md text-alabaster-100 text-xs font-medium border border-white/10 shadow-sm">
          <Clock className="w-3.5 h-3.5 text-champagne-400" />
          <span>{service.duration} mins</span>
        </div>
      </div>

      {/* Card Content & Investment Details */}
      <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-5">
        <div className="space-y-2.5">
          <h3
            className="font-serif text-xl sm:text-2xl font-medium text-espresso-950 group-hover:text-champagne-700 transition-colors line-clamp-1 leading-snug"
            title={service.serviceName}
          >
            {service.serviceName}
          </h3>
          <p className="text-stone-600 text-xs sm:text-sm leading-relaxed line-clamp-2 min-h-[2.5rem]">
            {service.description}
          </p>
        </div>

        {/* Pricing & Reservation Action */}
        <div className="pt-4 border-t border-alabaster-200 flex items-center justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-semibold block">
              Investment
            </span>
            <div className="flex items-baseline gap-1">
              <span className="font-serif text-2xl sm:text-3xl font-semibold text-espresso-950">
                ${service.price}
              </span>
              <span className="text-[11px] text-stone-500 font-normal">/ session</span>
            </div>
          </div>

          <Link
            href={`/services/${service._id}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-espresso-900 hover:bg-espresso-800 text-alabaster-100 text-xs font-semibold tracking-wide transition-all duration-200 shadow-soft group/btn shrink-0"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/btn:translate-x-1 text-champagne-400" />
          </Link>
        </div>
      </div>
    </article>
  );
}
