"use client";

import React, { Dispatch, SetStateAction } from "react";
import { CategoryFilter, StatusFilter } from "../ServicesManagement";

interface ResultSummaryProps {
  filteredServices: unknown[];
  services: unknown[];
  search: string;
  statusFilter: string;
  categoryFilter: string;
  setSearch: (value: string) => void;
  setStatusFilter: Dispatch<SetStateAction<StatusFilter>>;
  setCategoryFilter: Dispatch<SetStateAction<CategoryFilter>>;
}

export default function ResultSummary({
  filteredServices,
  services,
  search,
  statusFilter,
  categoryFilter,
  setSearch,
  setStatusFilter,
  setCategoryFilter,
}: ResultSummaryProps) {
  const hasFilter =
    search || statusFilter !== "all" || categoryFilter !== "all";
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <p className="text-xs text-white/30">
        Showing <span className="text-white/55">{filteredServices.length}</span>
        of <span className="text-white/55">{services.length}</span> services
      </p>

      {hasFilter ? (
        <button
          type="button"
          onClick={() => {
            setSearch("");
            setStatusFilter("all");
            setCategoryFilter("all");
          }}
          className="text-xs text-white/35 transition hover:text-white/65"
        >
          Clear filters
        </button>
      ) : null}
    </div>
  );
}
