import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Service } from '@/types';
import { Clock, ArrowRight } from 'lucide-react';

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-alabaster-300 hover:border-champagne-400/80 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col">
      {/* Service Photography */}
      <div className="relative h-60 w-full overflow-hidden bg-alabaster-200">
        <Image
          src={service.image}
          alt={service.serviceName}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-sm text-espresso-900 text-xs font-medium tracking-wide shadow-sm border border-white/40">
            {service.category}
          </span>
        </div>

        {/* Duration Badge */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white text-xs font-medium">
          <Clock className="w-3.5 h-3.5 text-champagne-300" />
          <span>{service.duration} mins</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <h3 className="font-serif text-xl font-medium text-espresso-950 group-hover:text-champagne-700 transition-colors line-clamp-1">
            {service.serviceName}
          </h3>
          <p className="text-stone-600 text-sm leading-relaxed line-clamp-2">
            {service.description}
          </p>
        </div>

        <div className="pt-4 border-t border-alabaster-200 flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider text-stone-500 font-medium">Fee</span>
            <p className="font-serif text-2xl font-semibold text-espresso-950">
              ${service.price}
            </p>
          </div>

          <Link
            href={`/services/${service._id}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-alabaster-200 hover:bg-espresso-900 text-espresso-900 hover:text-white text-xs font-semibold tracking-wide transition-all group/btn"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
