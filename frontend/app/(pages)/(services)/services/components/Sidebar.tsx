"use client";

import { ServiceCategory } from "@/app/types/service";
import { Check, Filter, Search, SlidersHorizontal } from "lucide-react";

interface SidebarProps {
  search: string;
  selectedCategory: string;
  categories: ServiceCategory[];
  changeSearch: (value: string) => void;
  changeCategory: (category: string) => void;
  setSearch: (value: string) => void;
  setSelectedCategory: (value: string) => void;
  setPage: (page: number) => void;
}

export default function Sidebar({
  search,
  selectedCategory,
  categories,
  changeSearch,
  changeCategory,
  setSearch,
  setSelectedCategory,
  setPage,
}: SidebarProps) {
  return (
    <aside className="w-full shrink-0 lg:sticky lg:top-24 lg:w-72">
      <div className="rounded-2xl border border-white/[0.07] bg-white/2 p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <SlidersHorizontal size={17} className="text-brand-green" />

            <h2 className="text-sm font-semibold text-white">Filters</h2>
          </div>

          {(search || selectedCategory) && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSelectedCategory("");
                setPage(1);
              }}
              className="text-xs font-medium text-white/30 transition hover:text-brand-green"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Search */}
        <div className="mt-6">
          <label className="mb-2.5 block text-xs font-medium uppercase tracking-[0.15em] text-white/30">
            Search
          </label>

          <div className="relative">
            <Search
              size={17}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25"
            />

            <input
              type="text"
              value={search}
              onChange={(event) => changeSearch(event.target.value)}
              placeholder="Search services..."
              className="h-11 w-full rounded-xl border border-white/8 bg-white/3 pl-10 pr-4 text-sm text-white outline-none  transition "
            />
          </div>
        </div>

        {/* Categories */}
        <div className="mt-7 border-t border-white/6 pt-6">
          <div className="flex items-center gap-2">
            <Filter size={15} className="text-white/35" />

            <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-white/40">
              Category
            </h3>
          </div>

          <div className="mt-4 space-y-1">
            {categories.map((category) => {
              const active = selectedCategory === category;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => changeCategory(category)}
                  className={`group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition-all duration-200 ${
                    active
                      ? "bg-brand-green/8 text-brand-green"
                      : "text-white/45 hover:bg-white/3 hover:text-white"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={`flex h-4 w-4 items-center justify-center rounded border transition ${
                        active
                          ? "border-brand-green bg-brand-green text-brand-navy"
                          : "border-white/15 bg-white/2 group-hover:border-white/30"
                      }`}
                    >
                      {active && <Check size={11} strokeWidth={3} />}
                    </span>

                    <span className="text-sm">{category}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}
