import React from 'react';
import Link from 'next/link';

interface LogoProps {
  variant?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  iconOnly?: boolean;
  className?: string;
}

export function LogoMonogram({
  size = 36,
  className = '',
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 transition-transform duration-300 group-hover:scale-105 ${className}`}
      aria-label="SalonBook Monogram"
    >
      {/* Outer rounded squircle frame */}
      <rect
        x="2"
        y="2"
        width="44"
        height="44"
        rx="14"
        className="fill-espresso-950"
      />
      <rect
        x="3"
        y="3"
        width="42"
        height="42"
        rx="13"
        stroke="#C59B6D"
        strokeWidth="1.2"
        strokeOpacity="0.75"
        fill="none"
      />

      {/* Elegant Intertwined S and B Monogram */}
      {/* Letter S curve */}
      <path
        d="M22 14.5C20.2 14.5 17.5 15.3 16.5 17C15.5 18.7 16.2 20.8 18 21.8L21 23.4C23.2 24.6 24 26.2 23.5 28C22.8 30.2 20.5 31.5 17.5 31.5C15.8 31.5 14.2 30.9 13 30"
        stroke="#C59B6D"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Letter B vertical stem and double loops */}
      <path
        d="M26 14V32"
        stroke="#FAF8F5"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M26 14.5H30.5C32.8 14.5 34.5 16 34.5 18.2C34.5 20.2 33 21.8 31 22.2H26"
        stroke="#FAF8F5"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M26 22.2H31.5C33.8 22.2 35.5 23.9 35.5 26.2C35.5 28.8 33.5 31.5 30.5 31.5H26"
        stroke="#FAF8F5"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Subtle delicate luxury accent pin */}
      <circle cx="24" cy="7" r="1.2" fill="#C59B6D" />
    </svg>
  );
}

export default function Logo({
  variant = 'dark',
  size = 'md',
  showSubtitle = true,
  iconOnly = false,
  className = '',
}: LogoProps) {
  const isLight = variant === 'light';

  const pixelSizes = {
    sm: 32,
    md: 40,
    lg: 48,
  };

  const titleSizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  const subtitleSizes = {
    sm: 'text-[9px]',
    md: 'text-[10px]',
    lg: 'text-[11px]',
  };

  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-3 group focus:outline-none ${className}`}
      aria-label="SalonBook Home"
    >
      <LogoMonogram size={pixelSizes[size]} />

      {!iconOnly && (
        <div className="flex flex-col select-none">
          <span
            className={`font-serif ${titleSizes[size]} font-semibold tracking-tight leading-none ${
              isLight ? 'text-white' : 'text-espresso-950'
            }`}
          >
            Salon
            <span className="text-champagne-500 font-normal ml-0.5">Book</span>
          </span>
          {showSubtitle && (
            <span
              className={`${subtitleSizes[size]} tracking-[0.25em] uppercase font-semibold mt-1 ${
                isLight ? 'text-stone-400' : 'text-stone-500'
              }`}
            >
              Atelier &amp; Spa
            </span>
          )}
        </div>
      )}
    </Link>
  );
}
