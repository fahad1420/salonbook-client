import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Service } from '@/types';
import { Clock, ArrowRight, Sparkles } from 'lucide-react';

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-alabaster-300 hover:border-champagne-400/80 shadow-soft hover:shadow-luxury-hover transition-all duration-300 flex flex-col">
      {/* Service Photography */}
      <div className="relative h-60 w-full overflow-hidden bg-alabaster-200">
        <Image
          src={service.image}
          alt={service.serviceName}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-espresso-950/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
        
        {/* Category Badge */}
        <div className="absolute top-3.5 left-3.5">
          <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-espresso-900 text-[11px] font-semibold tracking-wider uppercase shadow-sm border border-alabaster-300">
            {service.category}
          </span>
        </div>

        {/* Duration Badge */}
        <div className="absolute bottom-3.5 right-3.5 flex items-center gap-1.5 px-3 py-1 rounded-full bg-espresso-950/75 backdrop-blur-md text-alabaster-100 text-xs font-medium border border-white/10">
          <Clock className="w-3.5 h-3.5 text-champagne-400" />
          <span>{service.duration} mins</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <h3 className="font-serif text-xl font-medium text-espresso-950 group-hover:text-champagne-600 transition-colors line-clamp-1">
            {service.serviceName}
          </h3>
          <p className="text-stone-600 text-sm leading-relaxed line-clamp-2">
            {service.description}
          </p>
        </div>

        <div className="pt-4 border-t border-alabaster-200 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-[0.18em] text-stone-400 font-semibold block">Investment</span>
            <p className="font-serif text-2xl font-semibold text-espresso-950">
              ${service.price}
            </p>
          </div>

          <Link
            href={`/services/${service._id}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-alabaster-200 hover:bg-espresso-900 text-espresso-900 hover:text-alabaster-100 text-xs font-semibold tracking-wide transition-all group/btn"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
