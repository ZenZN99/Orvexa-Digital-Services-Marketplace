"use client";

import { Loader2 } from "lucide-react";
import type { IUser } from "@/app/types/user";
import { UserRole } from "@/app/types/user";
import EmptyState from "./components/EmptyState";
import VerificationBadge from "./components/VerificationBadge";
import User from "./components/columns/User";
import Role from "./components/columns/Role";
import Account from "./components/columns/Account";
import Joined from "./components/columns/Joined";
import Actions from "./components/columns/Actions";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Pagination from "@/app/shared/components/Pagination";

interface UsersTableProps {
  users: IUser[];
  selectedUserId?: string | null;
  onSelectUser?: (user: IUser) => void;
  onToggleActive?: (user: IUser) => void;
  onRoleChange?: (user: IUser, role: UserRole) => void;
  loadingGlobal?: boolean;
  updatingRoleIds?: Record<string, boolean>;
  blockingIds?: Record<string, boolean>;
  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export default function UsersTable({
  users,
  selectedUserId,
  onSelectUser,
  onToggleActive,
  onRoleChange,
  loadingGlobal = false,
  updatingRoleIds = {},
  blockingIds = {},
  page = 1,
  totalPages = 1,
  onPageChange,
}: UsersTableProps) {
  if (loadingGlobal && users.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-2xl border border-black/10  py-16">
        <Loader2 size={20} className="animate-spin text-black/25" />
      </div>
    );
  }

  if (users.length === 0) {
    return <EmptyState />;
  }

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-white/7 bg-white/2.5">
        <div className="overflow-x-auto">
          <table className="w-full min-w-262.5">
            <Header />

            <tbody className="divide-y divide-black/5">
              {users.map((user) => {
                const isSelected = selectedUserId === user.id;
                const isUpdatingRole = !!updatingRoleIds[user.id];
                const isBlocking = !!blockingIds[user.id];

                return (
                  <tr
                    key={user.id}
                    className={`transition-colors ${
                      isSelected ? "bg-brand-green/6" : "hover:bg-black/1.5"
                    }`}
                  >
                    <User user={user} />

                    <Role
                      user={user}
                      onRoleChange={onRoleChange}
                      isUpdatingRole={isUpdatingRole}
                    />

                    <td className="px-5 py-4">
                      <VerificationBadge status={user.verification?.status} />
                    </td>

                    <Account user={user} />

                    <Joined user={user} />

                    <Actions
                      onSelectUser={onSelectUser}
                      onToggleActive={onToggleActive}
                      user={user}
                      isBlocking={isBlocking}
                    />
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <Footer users={users} />
      </div>

      {totalPages > 1 && onPageChange && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </>
  );
}
