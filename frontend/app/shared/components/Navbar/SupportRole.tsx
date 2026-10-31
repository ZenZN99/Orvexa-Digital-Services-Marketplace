"use client";

import Link from "next/link";
import { UserRole } from "@/app/types/user";
import { Headset } from "lucide-react";

interface SupportRoleProps {
  isLoggedIn: boolean;
  role?: UserRole;
}

export default function SupportRole({ isLoggedIn, role }: SupportRoleProps) {
  return (
    <div>
      {isLoggedIn && role === UserRole.SUPPORT && (
        <Link
          href="/support"
          className="flex h-10 items-center gap-2 rounded-xl bg-brand-green px-4 text-sm font-semibold text-brand-navy transition hover:brightness-110"
        >
          <Headset size={15} />
          Support Conversations
        </Link>
      )}
    </div>
  );
}
