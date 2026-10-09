"use client";

import { useMemo, useState } from "react";

import { useUsers } from "@/app/hooks/useUsers";
import { UserRole } from "@/app/types/user";

import Header from "./components/Header";
import Toolbar from "./components/Toolbar";
import Pagination from "@/app/shared/components/Pagination";
import Grid from "./components/Grid";
import Empty from "./components/Empty";
import Skeleton from "./components/Skeleton";

const ITEMS_PER_PAGE = 9;

export default function ExpertsPage() {
  const { users, loading, page, setPage, pagination } = useUsers(
    1,
    ITEMS_PER_PAGE,
  );

  const [search, setSearch] = useState("");

  const freelancers = useMemo(
    () => users.filter((user) => user.role === UserRole.FREELANCER),
    [users],
  );

  const filteredFreelancers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return freelancers;
    }

    return freelancers.filter((user) => {
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();

      const email = user.email.toLowerCase();

      const bio = (user.profile?.bio ?? "").toLowerCase();

      return (
        fullName.includes(query) || email.includes(query) || bio.includes(query)
      );
    });
  }, [freelancers, search]);

  const changeSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const clearFilters = () => {
    setSearch("");
    setPage(1);
  };

  return (
    <main className="min-h-screen bg-brand-navy text-white">
      <Header />

      <section className="mx-auto max-w-7xl px-6 py-10 sm:px-10 lg:px-12 lg:py-14">
        <Toolbar
          search={search}
          changeSearch={changeSearch}
          clearFilters={clearFilters}
          page={page}
          totalPages={pagination.totalPages}
        />

        <p className="mb-6 text-sm text-white/35">
          Showing{" "}
          <span className="font-semibold text-white/70">
            {filteredFreelancers.length}
          </span>{" "}
          freelancers
        </p>

        {loading.global ? (
          <Skeleton />
        ) : filteredFreelancers.length === 0 ? (
          <Empty
            title="No freelancers found"
            description="Unfortunately, we couldn't find any freelancers matching your search."
            actionLabel="Clear Search"
            onAction={clearFilters}
          />
        ) : (
          <>
            <Grid visibleFreelancers={filteredFreelancers} />

            {pagination.totalPages > 1 && (
              <Pagination
                page={page}
                totalPages={pagination.totalPages}
                onPageChange={setPage}
              />
            )}
          </>
        )}
      </section>
    </main>
  );
}
