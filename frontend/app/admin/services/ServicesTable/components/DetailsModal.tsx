"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import type { IService } from "@/app/types/service";
import Details from "./Details/Details";

interface DetailsModalProps {
  service: IService;
  onClose: () => void;
}

export default function DetailsModal({ service, onClose }: DetailsModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm sm:p-8"
      onClick={onClose}
    >
      <div
        className="relative my-auto w-full max-w-6xl rounded-3xl border border-white/[0.07] bg-brand-navy p-6 shadow-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white/70 transition hover:bg-white/10 hover:text-white"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <Details service={service} />
      </div>
    </div>
  );
}
