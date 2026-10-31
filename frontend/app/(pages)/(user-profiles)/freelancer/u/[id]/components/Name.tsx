"use client";

import VerificationBadge from "@/app/shared/components/VerificationBadge";
import { IUser } from "@/app/types/user";
import { UserVerificationsStatus } from "@/app/types/user-verification";
import { ShieldAlert } from "lucide-react";

export default function Name({ user }: { user: IUser | null }) {
  const isVerified =
    user?.verification?.status === UserVerificationsStatus.APPROVED;

  return (
    <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
        {user?.firstName} {user?.lastName}
      </h1>

      <div>
        {isVerified ? (
          <>
            <VerificationBadge user={user} />
          </>
        ) : (
          <>
            <ShieldAlert size={13} />
            Not Secure
          </>
        )}
      </div>
    </div>
  );
}
