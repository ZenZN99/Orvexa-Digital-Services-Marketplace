"use client";

import { ImagePlus, X } from "lucide-react";
import React from "react";

interface ImagesProps {
  existingImages: { url: string }[];
  imagePreviews: string[];
  removeImage: (index: number) => void;
  handleImagesChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  maxImages: number;
  errors: {
    images?: string;
  };
}

export default function Images({
  existingImages,
  imagePreviews,
  removeImage,
  handleImagesChange,
  maxImages,
  errors,
}: ImagesProps) {
  const hasNew = imagePreviews.length > 0;
  const reachedLimit = imagePreviews.length >= maxImages;

  return (
    <div className="rounded-2xl border border-white/8 bg-brand-navy/40 p-5 backdrop-blur-xl">
      <label className="mb-1.5 block text-sm font-medium text-white/80">
        Cover images
      </label>
      <p className="mb-3 text-xs text-white/40">
        {hasNew
          ? `New images will replace all current images. Up to ${maxImages} images.`
          : `Current images are kept unless you upload new ones. Uploading new images replaces all of them (up to ${maxImages}).`}
      </p>

      <div className="flex flex-wrap gap-3">
        {/* Current images (read-only) — hidden once new ones are picked */}
        {!hasNew &&
          existingImages.map((img, index) => (
            <div
              key={index}
              className="relative h-20 w-20 overflow-hidden rounded-lg border border-white/[0.07]"
            >
              <img
                src={img.url}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
          ))}

        {/* New images */}
        {imagePreviews.map((src, index) => (
          <div
            key={index}
            className="group relative h-20 w-20 overflow-hidden rounded-lg border border-brand-green/30"
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
            <span className="text-[10px]">{hasNew ? "Add" : "Replace"}</span>
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
