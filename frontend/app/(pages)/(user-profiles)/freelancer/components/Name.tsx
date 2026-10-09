"use client";

import VerificationBadge from "@/app/shared/components/VerificationBadge";
import { IUser } from "@/app/types/user";
import { CheckCircle2 } from "lucide-react";

export default function Name({ user }: { user: IUser }) {
  return (
    <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
      <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
        {user.firstName} {user.lastName}
      </h1>

      <VerificationBadge user={user} />
    </div>
  );
}
