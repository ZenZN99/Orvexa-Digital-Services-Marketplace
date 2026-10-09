"use client";

import { ImagePlus, X } from "lucide-react";
import React from "react";

interface ImagesProps {
  imagePreviews: string[];
  removeImage: (index: number) => void;
  handleImagesChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  maxImages: number;
  errors: {
    images?: string;
  };
}

export default function Images({
  imagePreviews,
  removeImage,
  handleImagesChange,
  maxImages,
  errors,
}: ImagesProps) {
  const reachedLimit = imagePreviews.length >= maxImages;

  return (
    <div className="rounded-2xl border border-white/8 bg-brand-navy/40 p-5 backdrop-blur-xl">
      <label className="mb-1.5 block text-sm font-medium text-white/80">
        Cover images
      </label>
      <p className="mb-3 text-xs text-white/40">
        Optional, but services with images get more views. Up to {maxImages}{" "}
        images.
      </p>

      <div className="flex flex-wrap gap-3">
        {imagePreviews.map((src, index) => (
          <div
            key={index}
            className="group relative h-20 w-20 overflow-hidden rounded-lg border border-white/[0.07]"
          >
            <img src={src} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition group-hover:opacity-100"
            >
              <X size={16} className="text-white" />
            </button>
          </div>
        ))}

        {!reachedLimit && (
          <label className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-white/15 text-white/30 transition hover:border-brand-green/30 hover:text-brand-green">
            <ImagePlus size={18} />
            <span className="text-[10px]">Add</span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImagesChange}
            />
          </label>
        )}
      </div>

      {errors.images && (
        <p className="mt-2 text-xs text-red-400">{errors.images}</p>
      )}
    </div>
  );
}
