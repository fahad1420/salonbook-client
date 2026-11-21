'use client';

import React, { useEffect, useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  className?: string;
}

export default function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        aria-label="Toggle theme"
        className={`p-2 rounded-full border border-alabaster-300 dark:border-white/10 text-stone-500 transition-colors ${className}`}
      >
        <div className="w-4 h-4" />
      </button>
    );
  }

  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`p-2 rounded-full border border-alabaster-300 dark:border-white/15 bg-white/80 dark:bg-espresso-900/80 backdrop-blur-sm text-espresso-950 dark:text-champagne-300 hover:text-champagne-600 dark:hover:text-champagne-200 transition-all duration-200 shadow-sm hover:scale-105 active:scale-95 ${className}`}
    >
      {isDark ? (
        <Sun className="w-4 h-4 transition-transform duration-300 rotate-0 hover:rotate-90 text-champagne-400" />
      ) : (
        <Moon className="w-4 h-4 transition-transform duration-300 -rotate-12 hover:rotate-0 text-stone-600" />
      )}
    </button>
  );
}
