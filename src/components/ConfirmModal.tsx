'use client';

import React from 'react';
import { AlertCircle, X, Loader2 } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = false,
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-alabaster-300 dark:border-stone-800 shadow-2xl space-y-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                isDestructive
                  ? 'bg-rose-50 text-rose-600 border border-rose-200 dark:bg-rose-950/40 dark:border-rose-900/50 dark:text-rose-400'
                  : 'bg-champagne-100 text-champagne-700 border border-champagne-200 dark:bg-champagne-950/40 dark:border-champagne-800/40 dark:text-champagne-300'
              }`}
            >
              <AlertCircle className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-xl font-medium text-espresso-950 dark:text-alabaster-50">
              {title}
            </h3>
          </div>
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="p-1 rounded-full text-stone-400 hover:text-stone-600 hover:bg-stone-100 dark:hover:text-stone-200 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-stone-600 dark:text-stone-300 text-sm leading-relaxed">{message}</p>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            disabled={isLoading}
            onClick={onCancel}
            className="px-5 py-2.5 rounded-full border border-alabaster-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 text-xs font-semibold hover:bg-alabaster-100 dark:hover:bg-stone-800 transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={onConfirm}
            className={`px-5 py-2.5 rounded-full text-xs font-semibold text-white transition-all shadow-sm flex items-center gap-2 ${
              isDestructive
                ? 'bg-rose-600 hover:bg-rose-700'
                : 'bg-espresso-900 hover:bg-espresso-800 dark:bg-champagne-500 dark:hover:bg-champagne-400 dark:text-stone-950'
            }`}
          >
            {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>{confirmLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
