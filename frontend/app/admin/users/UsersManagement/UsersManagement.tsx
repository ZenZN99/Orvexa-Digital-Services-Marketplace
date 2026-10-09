"use client";

import { useMemo, useState } from "react";
import { FileCheck2, Loader2, Users } from "lucide-react";

import type { IUser } from "@/app/types/user";
import { UserRole } from "@/app/types/user";

import type { IUserVerification } from "@/app/types/user-verification";
import { UserVerificationsStatus } from "@/app/types/user-verification";

import { useUsers } from "@/app/hooks/useUsers";
import { useUserVerifications } from "@/app/hooks/useUserVerifications";

import Header from "./components/Header";
import Stats from "./components/Stats";
import UserSummary from "./components/UserSummary";
import UserFilters from "./components/UserFilters";
import SectionHeader from "./components/SectionHeader";
import BlockUserConfirmation from "./components/BlockUserConfirmation";

import UsersTable from "../UsersTable/UsersTable";
import VerificationTable from "../VerificationTable/VerificationTable";
import VerificationDetails from "../VerificationDetails/VerificationDetails";

import toast from "react-hot-toast";

type RoleFilter = "all" | UserRole;
export type StatusFilter = "all" | "active" | "blocked";

export default function UsersManagement() {
  // Users
  const {
    users,
    pagination: usersPagination,
    page: usersPage,
    setPage: setUsersPage,
    loading: usersLoading,
    updateUserRole,
    blockUserById,
  } = useUsers(1, 10);

  // Verifications
  const {
    verifications,
    loading: verificationsLoading,
    updateVerificationStatus,
    pagination: verificationPagination,
    page: verificationPage,
    setPage: setVerificationPage,
  } = useUserVerifications(1, 10);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("all");

  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);

  const [selectedVerification, setSelectedVerification] =
    useState<IUserVerification | null>(null);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users.filter((user) => {
      const fullName =
        `${user.firstName} ${user.lastName}`.toLowerCase();

      const matchesSearch =
        !query ||
        user.id.toLowerCase().includes(query) ||
        fullName.includes(query) ||
        user.email.toLowerCase().includes(query) ||
        (user.profile?.bio ?? "").toLowerCase().includes(query);

      const matchesRole =
        roleFilter === "all" || user.role === roleFilter;

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && user.isActive) ||
        (statusFilter === "blocked" && !user.isActive);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: usersPagination.total,

      active: users.filter((user) => user.isActive).length,

      blocked: users.filter((user) => !user.isActive).length,

      freelancers: users.filter(
        (user) => user.role === UserRole.FREELANCER,
      ).length,

      clients: users.filter(
        (user) => user.role === UserRole.CLIENT,
      ).length,

      pendingVerification: verificationPagination.total,
    };
  }, [
    users,
    usersPagination.total,
    verificationPagination.total,
  ]);

  const handleSelectUser = (user: IUser) => {
    setSelectedUser(user);
    setSelectedVerification(null);

    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  const handleSelectVerification = (
    verification: IUserVerification,
  ) => {
    setSelectedVerification(verification);
    setSelectedUser(null);
  };

  const handleToggleActive = (user: IUser) => {
    if (!user.isActive) return;

    toast.custom(
      (t) => (
        <BlockUserConfirmation
          toastId={t.id}
          onConfirm={() => {
            blockUserById(user.id);

            if (selectedUser?.id === user.id) {
              setSelectedUser(null);
            }
          }}
        />
      ),
      {
        duration: Infinity,
      },
    );
  };

  const handleRoleChange = (
    user: IUser,
    role: UserRole,
  ) => {
    updateUserRole(user.id, role);
  };

  const handleApproveVerification = (
    verification: IUserVerification,
  ) => {
    updateVerificationStatus(
      verification.id,
      UserVerificationsStatus.APPROVED,
    );
  };

  const handleRejectVerification = (
    verification: IUserVerification,
    reason?: string,
  ) => {
    updateVerificationStatus(
      verification.id,
      UserVerificationsStatus.REJECTED,
      reason ||
        "Verification documents were rejected by the administrator.",
    );
  };

  return (
    <div className="space-y-8 p-6 lg:p-8">
      <Header />

      <Stats stats={stats} />

      <UserFilters
        search={search}
        setSearch={setSearch}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      {/* Users */}
      <section className="space-y-3">
        <SectionHeader
          icon={Users}
          title="All Users"
          count={filteredUsers.length}
        />

        <UsersTable
          users={filteredUsers}
          selectedUserId={selectedUser?.id}
          onSelectUser={handleSelectUser}
          onToggleActive={handleToggleActive}
          onRoleChange={handleRoleChange}
          loadingGlobal={usersLoading.global}
          updatingRoleIds={usersLoading.updatingRole}
          blockingIds={usersLoading.deleting}
          page={usersPage}
          totalPages={usersPagination.totalPages}
          onPageChange={setUsersPage}
        />
      </section>

      {/* Identity Verification */}
      <section className="space-y-3">
        <SectionHeader
          icon={FileCheck2}
          title="Identity Verification"
          count={verificationPagination.total}
        />

        {verificationsLoading.global &&
        verifications.length === 0 ? (
          <div className="flex items-center justify-center rounded-2xl border border-white/[0.07] bg-white/25 py-16">
            <Loader2
              size={20}
              className="animate-spin text-white/25"
            />
          </div>
        ) : (
          <VerificationTable
            verifications={verifications}
            onUpdateStatus={updateVerificationStatus}
            onSelectVerification={handleSelectVerification}
            updatingStatus={
              verificationsLoading.updatingStatus
            }
            page={verificationPage}
            totalPages={verificationPagination.totalPages}
            onPageChange={setVerificationPage}
          />
        )}
      </section>

      {/* Verification Details */}
      {selectedVerification && (
        <section className="rounded-2xl border border-white/[0.07] bg-white/25">
          <VerificationDetails
            verification={selectedVerification}
            onClose={() => setSelectedVerification(null)}
            onApprove={handleApproveVerification}
            onReject={handleRejectVerification}
            updating={
              verificationsLoading.updatingStatus[
                selectedVerification.id
              ]
            }
          />
        </section>
      )}

      {/* User Details */}
      {selectedUser && !selectedVerification && (
        <section className="rounded-2xl border border-white/7 bg-white/2.5">
          <UserSummary
            user={selectedUser}
            onClose={() => setSelectedUser(null)}
          />
        </section>
      )}
    </div>
  );
}