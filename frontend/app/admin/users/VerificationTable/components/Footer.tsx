"use client";

import {
  IUserVerification,
  UserVerificationsStatus,
} from "@/app/types/user-verification";
import StatusCount from "./StatusCount";

export default function Footer({
  verifications,
}: {
  verifications: IUserVerification[];
}) {
  const pendingCount = verifications.filter(
    (item) => item.status === UserVerificationsStatus.PENDING,
  ).length;

  const approvedCount = verifications.filter(
    (item) => item.status === UserVerificationsStatus.APPROVED,
  ).length;

  const rejectedCount = verifications.filter(
    (item) => item.status === UserVerificationsStatus.REJECTED,
  ).length;
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/6 px-5 py-4">
      <span className="text-xs text-white/30">
        {verifications.length}{" "}
        {verifications.length === 1 ? "request" : "requests"}
      </span>

      <div className="flex flex-wrap items-center gap-4">
        <StatusCount
          label="Pending"
          value={pendingCount}
          className="text-amber-300"
        />

        <StatusCount
          label="Approved"
          value={approvedCount}
          className="text-brand-green"
        />

        <StatusCount
          label="Rejected"
          value={rejectedCount}
          className="text-red-300"
        />
      </div>
    </div>
  );
}
