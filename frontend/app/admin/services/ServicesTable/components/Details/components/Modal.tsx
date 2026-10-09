"use client";

import { IService } from "@/app/types/service";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface ModalProps {
  modalOpen: boolean;
  images: IService["images"];
  current: number;
  service: IService;
  setModalOpen: (open: boolean) => void;
  prev: () => void;
  next: () => void;
}

export default function Modal({
  modalOpen,
  images,
  current,
  service,
  setModalOpen,
  prev,
  next,
}: ModalProps) {
  return (
    <div>
      {modalOpen && images.length > 0 && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={() => setModalOpen(false)}
        >
          <button
            type="button"
            onClick={() => setModalOpen(false)}
            className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            aria-label="Close"
          >
            <X size={20} />
          </button>

          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              className="absolute left-5 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
              aria-label="Previous image"
            >
              <ChevronLeft size={22} />
            </button>
          )}

          <img
            src={images[current]?.url}
            alt={`${service.title} ${current + 1}`}
            className="max-h-[88vh] max-w-[92vw] rounded-xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {images.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              className="absolute right-5 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
              aria-label="Next image"
            >
              <ChevronRight size={22} />
            </button>
          )}

          <span className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-xs text-white/80">
            {current + 1} / {images.length}
          </span>
        </div>
      )}
    </div>
  );
}
