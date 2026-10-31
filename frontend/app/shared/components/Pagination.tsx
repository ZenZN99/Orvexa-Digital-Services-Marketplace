"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const getPages = (): (number | "...")[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (page <= 4) {
      return [1, 2, 3, 4, 5, "...", totalPages];
    }

    if (page >= totalPages - 3) {
      return [
        1,
        "...",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [1, "...", page - 1, page, page + 1, "...", totalPages];
  };

  return (
    <div className="mt-6 flex items-center justify-center gap-1.5 sm:gap-2">
      {/* Previous */}
      <button
        type="button"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/8 bg-white/2 text-white/40 transition hover:border-brand-green/20 hover:bg-brand-green hover:text-brand-navy disabled:pointer-events-none disabled:opacity-25 sm:h-10 sm:w-auto sm:gap-2 sm:px-4 sm:text-sm sm:font-medium"
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
        <span className="hidden sm:inline">Previous</span>
      </button>

      {/* Pages */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {getPages().map((pageNumber, index) =>
          pageNumber === "..." ? (
            <span
              key={`ellipsis-${index}`}
              className="flex h-9 w-6 items-center justify-center text-sm text-white/30 sm:h-10 sm:w-10"
            >
              ...
            </span>
          ) : (
            <button
              key={pageNumber}
              type="button"
              onClick={() => onPageChange(pageNumber)}
              className={`flex h-9 min-w-9 items-center justify-center rounded-xl px-2 text-xs font-semibold transition-all sm:h-10 sm:min-w-10 sm:px-3 sm:text-sm ${
                page === pageNumber
                  ? "bg-brand-green text-brand-navy shadow-[0_0_25px_rgba(0,220,130,0.12)]"
                  : "border border-white/8 bg-white/2 text-white/40 hover:border-brand-green/20 hover:text-white"
              }`}
            >
              {pageNumber}
            </button>
          ),
        )}
      </div>

      {/* Next */}
      <button
        type="button"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/8 bg-white/2 text-white/40 transition hover:border-brand-green/20 hover:bg-brand-green hover:text-brand-navy disabled:pointer-events-none disabled:opacity-25 sm:h-10 sm:w-auto sm:gap-2 sm:px-4 sm:text-sm sm:font-medium"
        aria-label="Next page"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight size={16} />
      </button>
    </div>
  );
}
