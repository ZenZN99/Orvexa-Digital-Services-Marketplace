"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useServices } from "@/app/hooks/useServices";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Toolbar from "./components/Toolbar";
import Pagination from "@/app/shared/components/Pagination";
import Grid from "./components/Grid";
import { ServiceCategory } from "@/app/types/service";

const categories = Object.values(ServiceCategory);

export default function ServicesPage() {
  const { services, page, pagination, setPage, loading } = useServices();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const filteredServices = useMemo(() => {
    const query = search.trim().toLowerCase();

    return services.filter((service) => {
      const matchesSearch =
        !query ||
        service.title.toLowerCase().includes(query) ||
        service.description.toLowerCase().includes(query);

      const matchesCategory =
        !selectedCategory || service.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [services, search, selectedCategory]);

  const changeSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const changeCategory = (category: string) => {
    setSelectedCategory((current) => (current === category ? "" : category));
    setPage(1);
  };

  return (
    <main className="min-h-screen bg-brand-navy text-white">
      <Header />

      <section className="mx-auto max-w-7xl px-6 py-10 sm:px-10 lg:px-12 lg:py-14">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          <Sidebar
            search={search}
            selectedCategory={selectedCategory}
            categories={categories}
            changeSearch={changeSearch}
            changeCategory={changeCategory}
            setSearch={setSearch}
            setSelectedCategory={setSelectedCategory}
            setPage={setPage}
          />

          <div className="min-w-0 flex-1">
            <Toolbar
              visibleServices={filteredServices}
              filteredServices={filteredServices}
              selectedCategory={selectedCategory}
              page={page}
              totalPages={pagination.totalPages}
              setSelectedCategory={setSelectedCategory}
              setPage={setPage}
            />

            {filteredServices.length === 0 ? (
              <div className="flex min-h-112.5 flex-col items-center justify-center rounded-3xl border border-dashed border-white/8 bg-white/1.5 px-6 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/8 bg-white/3">
                  <Search size={22} className="text-white/30" />
                </div>

                <h3 className="mt-5 text-lg font-semibold text-white">
                  No services found
                </h3>

                <p className="mt-2 max-w-sm text-sm leading-6 text-white/35">
                  Try another search term or remove the selected category
                  filter.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSearch("");
                    setSelectedCategory("");
                    setPage(1);
                  }}
                  className="mt-6 rounded-xl bg-brand-green px-5 py-2.5 text-sm font-semibold text-brand-navy transition hover:brightness-110"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <Grid visibleServices={filteredServices} />

                {pagination.totalPages > 1 && (
                  <Pagination
                    page={page}
                    totalPages={pagination.totalPages}
                    onPageChange={setPage}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
