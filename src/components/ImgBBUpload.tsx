'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { UploadCloud, CheckCircle2, AlertCircle, Loader2, X } from 'lucide-react';
import { uploadImageToImgBB } from '@/lib/api';

interface ImgBBUploadProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  required?: boolean;
  aspectRatio?: 'square' | 'video';
  helperText?: string;
}

export default function ImgBBUpload({
  label,
  value,
  onChange,
  required = false,
  aspectRatio = 'square',
  helperText,
}: ImgBBUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileProcess = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (PNG, JPG, WEBP).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Image size exceeds 10MB limit.');
      return;
    }

    setUploadError(null);
    setIsUploading(true);

    try {
      const hostedUrl = await uploadImageToImgBB(file);
      onChange(hostedUrl);
    } catch (err) {
      setUploadError((err as Error).message || 'Image upload failed.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold uppercase tracking-wider text-espresso-950">
          {label} {required && <span className="text-rose-600">*</span>}
        </label>
        {value && !isUploading && (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            Uploaded
          </span>
        )}
      </div>

      {value ? (
        <div className="relative group rounded-xl overflow-hidden border border-alabaster-300 bg-alabaster-100">
          <div
            className={`relative w-full ${
              aspectRatio === 'square' ? 'h-40 sm:h-48' : 'h-48 sm:h-56'
            }`}
          >
            <Image
              src={value}
              alt="Uploaded Preview"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-full bg-white text-espresso-900 text-xs font-semibold shadow hover:bg-alabaster-100 transition-colors"
              >
                Change Image
              </button>
              <button
                type="button"
                onClick={() => onChange('')}
                className="p-1.5 rounded-full bg-rose-600 text-white hover:bg-rose-700 transition-colors"
                aria-label="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`cursor-pointer rounded-2xl border-2 border-dashed p-6 text-center transition-all ${
            isDragging
              ? 'border-champagne-500 bg-champagne-50/50'
              : 'border-alabaster-300 hover:border-champagne-400 bg-white/70 hover:bg-white'
          } ${isUploading ? 'pointer-events-none opacity-75' : ''}`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center justify-center py-4 space-y-2">
              <Loader2 className="w-7 h-7 text-champagne-600 animate-spin" />
              <p className="text-xs font-medium text-espresso-900">
                Streaming image to ImgBB...
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-alabaster-200 flex items-center justify-center text-champagne-700">
                <UploadCloud className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-medium text-espresso-950">
                  <span className="text-champagne-700 font-semibold underline underline-offset-2">
                    Click to browse
                  </span>{' '}
                  or drag and drop
                </p>
                <p className="text-[11px] text-stone-500">
                  PNG, JPG, or WEBP up to 10MB
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFileProcess(e.target.files[0]);
          }
        }}
      />

      {uploadError && (
        <p className="text-xs text-rose-600 flex items-center gap-1 mt-1">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{uploadError}</span>
        </p>
      )}

      {helperText && !uploadError && (
        <p className="text-[11px] text-stone-500">{helperText}</p>
      )}
    </div>
  );
}
