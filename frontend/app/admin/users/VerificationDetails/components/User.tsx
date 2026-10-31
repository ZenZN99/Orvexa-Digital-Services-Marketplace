"use client";

import { UserRound } from "lucide-react";
import InfoItem from "./InfoItem";
import { formatDate } from "../utils/formatDate";
import { IUser } from "@/app/types/user";
import { formatRole } from "../../UsersManagement/utils/formatRole";

export default function User({ user }: { user: IUser }) {
  return (
    <section className="rounded-2xl border border-white/[0.07] bg-white/2.5 p-5">
      <div className="mb-4 flex items-center gap-2">
        <UserRound size={15} className="text-white/30" />

        <h3 className="text-sm font-medium text-white/70">User Information</h3>
      </div>

      {user ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InfoItem
            label="Full Name"
            value={`${user.firstName} ${user.lastName}`}
          />

          <InfoItem label="Email" value={user.email} />

          <InfoItem label="User ID" value={user.id} />

          <InfoItem label="Role" value={formatRole(user.role)} />

          <InfoItem
            label="Account Status"
            value={user.isActive ? "Active" : "Blocked"}
          />

          <InfoItem
            label="Account Created"
            value={formatDate(user.createdAt)}
          />
        </div>
      ) : (
        <p className="text-xs text-white/30">User details unavailable.</p>
      )}
    </section>
  );
}
