'use client';

import React, { useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';

export const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  'Haircut & Styling':
    'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80',
  'Hair Coloring':
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80',
  'Hair Treatment':
    'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&w=1200&q=80',
  'Facial & Skincare':
    'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=1200&q=80',
  Makeup:
    'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1200&q=80',
  'Manicure & Pedicure':
    'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=1200&q=80',
  'Spa & Massage':
    'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=80',
};

export const DEFAULT_FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80';

const KNOWN_BROKEN_URLS = ['photo-1512290900672-1f416d860d5b'];

export function getSafeImageUrl(src?: string | null, category?: string): string {
  const fallback = (category && CATEGORY_FALLBACK_IMAGES[category]) || DEFAULT_FALLBACK_IMAGE;

  if (!src || typeof src !== 'string' || src.trim().length === 0) {
    return fallback;
  }

  const clean = src.trim();
  for (const broken of KNOWN_BROKEN_URLS) {
    if (clean.includes(broken)) {
      return fallback;
    }
  }

  return clean;
}

interface ServiceImageProps extends Omit<ImageProps, 'src' | 'onError' | 'onLoad'> {
  src?: string | null;
  category?: string;
  containerClassName?: string;
}

export default function ServiceImage({
  src,
  alt,
  category,
  className = '',
  containerClassName = '',
  fill = true,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  ...props
}: ServiceImageProps) {
  const safeInitialSrc = getSafeImageUrl(src, category);
  const [currentSrc, setCurrentSrc] = useState<string>(safeInitialSrc);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    const verified = getSafeImageUrl(src, category);
    setCurrentSrc(verified);
    setHasError(false);
  }, [src, category]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      const fallback = (category && CATEGORY_FALLBACK_IMAGES[category]) || DEFAULT_FALLBACK_IMAGE;
      setCurrentSrc(fallback);
    }
  };

  return (
    <>
      {/* Subtle shimmer placeholder while loading */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-stone-200/60 animate-pulse transition-opacity" />
      )}

      <Image
        {...props}
        src={currentSrc}
        alt={alt || 'Salon service photography'}
        fill={fill}
        sizes={sizes}
        onLoad={() => setIsLoaded(true)}
        onError={handleError}
        className={`object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
      />
    </>
  );
}
