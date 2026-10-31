"use client";

import { ChangeEvent } from "react";
import { UploadedImage } from "../page";
import { CheckCircle2, ImagePlus, X } from "lucide-react";

interface UploadCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  image: UploadedImage | null;
  inputRef: React.RefObject<HTMLInputElement | null>;
  disabled?: boolean;
  onUpload: (event: ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
}

export default function UploadCard({
  title,
  description,
  icon,
  image,
  inputRef,
  disabled,
  onUpload,
  onRemove,
}: UploadCardProps) {
  return (
    <section className="overflow-hidden rounded-3xl border border-white/[0.07] bg-white/1.5 shadow-xl shadow-black/10">
      {/* Card header */}
      <div className="border-b border-white/6 p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-brand-green/15 bg-brand-green/10 text-brand-green">
            {icon}
          </div>

          <div>
            <h2 className="text-sm font-semibold">{title}</h2>

            <p className="mt-1 text-xs leading-5 text-white/35">
              {description}
            </p>
          </div>
        </div>
      </div>

      {/* Preview / Upload */}
      <div className="p-5 sm:p-6">
        {image ? (
          <div className="relative overflow-hidden rounded-2xl border border-white/8 bg-black/20">
            <img
              src={image.preview}
              alt={title}
              className="h-64 w-full object-cover"
            />

            <button
              type="button"
              onClick={onRemove}
              disabled={disabled}
              aria-label={`Remove ${title}`}
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-black/60 text-white/70 backdrop-blur-md transition hover:bg-black/80 hover:text-white disabled:pointer-events-none disabled:opacity-40"
            >
              <X size={15} />
            </button>

            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-lg border border-brand-green/20 bg-black/60 px-2.5 py-1.5 text-[11px] font-medium text-brand-green backdrop-blur-md">
              <CheckCircle2 size={13} />
              Image uploaded
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={disabled}
            className="group flex h-64 w-full flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/1.5 px-6 text-center transition hover:border-brand-green/30 hover:bg-brand-green/2 disabled:pointer-events-none disabled:opacity-40"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/8 bg-white/3 text-white/30 transition group-hover:border-brand-green/20 group-hover:bg-brand-green/10 group-hover:text-brand-green">
              <ImagePlus size={25} strokeWidth={1.5} />
            </div>

            <span className="mt-4 text-sm font-semibold text-white/70">
              Upload image
            </span>

            <span className="mt-1.5 text-xs text-white/30">
              JPG, PNG or WEBP · Max 10MB
            </span>
          </button>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={onUpload}
          disabled={disabled}
          className="hidden"
        />

        {image && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={disabled}
            className="mt-3 w-full rounded-xl border border-white/8 bg-white/2 py-2.5 text-xs font-semibold text-white/50 transition hover:border-white/15 hover:bg-white/4 hover:text-white disabled:pointer-events-none disabled:opacity-40"
          >
            Replace image
          </button>
        )}
      </div>
    </section>
  );
}
