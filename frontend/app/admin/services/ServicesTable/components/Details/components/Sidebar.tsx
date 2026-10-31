"use client";

import { IService } from "@/app/types/service";
import { ChevronLeft, ChevronRight, ImageIcon, ZoomIn } from "lucide-react";

interface SidebarProps {
  service: IService;
  images: IService["images"];
  current: number;
  setCurrent: (index: number) => void;
  prev: () => void;
  next: () => void;
  setModalOpen: (open: boolean) => void;
}

export default function Sidebar({
  service,
  images,
  current,
  setCurrent,
  prev,
  next,
  setModalOpen,
}: SidebarProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-white/2">
      {images.length > 0 ? (
        <>
          <div className="group relative aspect-16/10 overflow-hidden bg-black/20">
            <img
              src={images[current]?.url}
              alt={`${service.title} ${current + 1}`}
              className="h-full w-full cursor-zoom-in object-cover"
              onClick={() => setModalOpen(true)}
            />

            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-brand-navy/80 text-white/80 backdrop-blur-md transition hover:bg-brand-navy"
              aria-label="Open image"
            >
              <ZoomIn size={16} />
            </button>

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={prev}
                  className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-brand-navy/80 text-white backdrop-blur-md transition hover:bg-brand-navy"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={18} />
                </button>

                <button
                  type="button"
                  onClick={next}
                  className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-brand-navy/80 text-white backdrop-blur-md transition hover:bg-brand-navy"
                  aria-label="Next image"
                >
                  <ChevronRight size={18} />
                </button>

                <span className="absolute bottom-3 left-3 rounded-full border border-white/10 bg-brand-navy/80 px-2.5 py-1 text-[11px] font-medium text-white/80 backdrop-blur-md">
                  {current + 1} / {images.length}
                </span>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto p-3">
              {images.map((img, i) => (
                <button
                  key={img.publicId ?? i}
                  type="button"
                  onClick={() => setCurrent(i)}
                  className={`h-16 w-24 shrink-0 overflow-hidden rounded-lg border transition ${
                    i === current
                      ? "border-brand-green"
                      : "border-white/10 opacity-60 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img.url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="flex aspect-16/10 flex-col items-center justify-center gap-2 text-white/20">
          <ImageIcon size={32} />
          <span className="text-xs">No images</span>
        </div>
      )}
    </div>
  );
}
