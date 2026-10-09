"use client";

import { Search, X } from "lucide-react";
import FilterButton from "./FilterButton";
import { UserRole } from "@/app/types/user";

type RoleFilter = UserRole | "all";
type StatusFilter = "all" | "active" | "blocked";

interface UsersFilters {
  search: string;
  setSearch: (value: string) => void;
  roleFilter: RoleFilter;
  setRoleFilter: (value: RoleFilter) => void;
  statusFilter: StatusFilter;
  setStatusFilter: (value: StatusFilter) => void;
}

export default function UserFilters({
  search,
  setSearch,
  roleFilter,
  setRoleFilter,
  statusFilter,
  setStatusFilter,
}: UsersFilters) {
  return (
    <div className="rounded-2xl border border-white/[0.07]  p-4">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="relative w-full xl:max-w-md">
          <Search
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25"
          />

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search users..."
            className="h-10 w-full rounded-xl border border-white/8 bg-white/3 pl-10 pr-10 text-sm text-white outline-none"
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-white/25 hover:bg-white/6 hover:text-white/60"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <FilterButton
            active={roleFilter === "all"}
            onClick={() => setRoleFilter("all")}
          >
            All Roles
          </FilterButton>

          <FilterButton
            active={roleFilter === UserRole.CLIENT}
            onClick={() => setRoleFilter(UserRole.CLIENT)}
          >
            Clients
          </FilterButton>

          <FilterButton
            active={roleFilter === UserRole.FREELANCER}
            onClick={() => setRoleFilter(UserRole.FREELANCER)}
          >
            Freelancers
          </FilterButton>

          <FilterButton
            active={roleFilter === UserRole.SUPPORT}
            onClick={() => setRoleFilter(UserRole.SUPPORT)}
          >
            Support
          </FilterButton>

          <FilterButton
            active={roleFilter === UserRole.ADMIN}
            onClick={() => setRoleFilter(UserRole.ADMIN)}
          >
            Admins
          </FilterButton>
        </div>
      </div>

      <div className="mt-3 flex gap-2 border-t border-white/5 pt-3">
        <FilterButton
          active={statusFilter === "all"}
          onClick={() => setStatusFilter("all")}
        >
          All
        </FilterButton>

        <FilterButton
          active={statusFilter === "active"}
          onClick={() => setStatusFilter("active")}
        >
          Active
        </FilterButton>

        <FilterButton
          active={statusFilter === "blocked"}
          onClick={() => setStatusFilter("blocked")}
        >
          Blocked
        </FilterButton>
      </div>
    </div>
  );
}
