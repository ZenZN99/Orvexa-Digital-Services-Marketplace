"use client";

import { IService } from "@/app/types/service";
import { X } from "lucide-react";
import React from "react";

interface ToolbarProps {
  visibleServices: IService[];
  filteredServices: IService[];
  selectedCategory: string;
  page: number;
  totalPages: number;
  setSelectedCategory: (value: string) => void;
  setPage: (page: number) => void;
}

export default function Toolbar({
  visibleServices,
  filteredServices,
  selectedCategory,
  page,
  totalPages,
  setSelectedCategory,
  setPage,
}: ToolbarProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm text-white/35">
          Showing{" "}
          <span className="font-semibold text-white/70">
            {visibleServices.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-white/70">
            {filteredServices.length}
          </span>{" "}
          services
        </p>

        {selectedCategory && (
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("");
              setPage(1);
            }}
            className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-brand-green/15 bg-brand-green/6 px-2.5 py-1 text-xs text-brand-green"
          >
            {selectedCategory}
            <X size={12} />
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/2 px-3 py-2">
        <span className="text-xs text-white/30">Page</span>

        <span className="text-sm font-semibold text-white">{page}</span>

        <span className="text-xs text-white/20">
          / {Math.max(totalPages, 1)}
        </span>
      </div>
    </div>
  );
}
