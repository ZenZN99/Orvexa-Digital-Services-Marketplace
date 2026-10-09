"use client";

import { IService } from "@/app/types/service";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface ServiceImageSliderProps {
  images: IService["images"];
  title: string;
}

export default function ServiceImageSlider({
  images,
  title,
}: ServiceImageSliderProps) {
  const [index, setIndex] = useState(0);
  const hasMultiple = images.length > 1;

  const goPrev = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  };

  const goNext = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIndex((i) => (i === images.length - 1 ? 0 : i + 1));
  };

  return (
    <div className="relative h-48 overflow-hidden">
      <img
        src={images[index].url}
        alt={`${title} — image ${index + 1} of ${images.length}`}
        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
      />

      <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />

      {hasMultiple && (
        <>
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous image"
            className="absolute left-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/40 text-white opacity-0 backdrop-blur-md transition duration-200 hover:bg-black/60 group-hover:opacity-100"
          >
            <ChevronLeft size={16} />
          </button>

          <button
            type="button"
            onClick={goNext}
            aria-label="Next image"
            className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/40 text-white opacity-0 backdrop-blur-md transition duration-200 hover:bg-black/60 group-hover:opacity-100"
          >
            <ChevronRight size={16} />
          </button>

          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setIndex(i);
                }}
                aria-label={`Go to image ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === index
                    ? "w-4 bg-brand-green"
                    : "w-1.5 bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
