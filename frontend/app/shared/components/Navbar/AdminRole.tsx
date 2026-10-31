"use client";

import { UserRole } from "@/app/types/user";
import { LayoutDashboard } from "lucide-react";
import Link from "next/link";

interface AdminRoleProps {
  isLoggedIn: boolean;
  role?: UserRole;
}

export default function AdminRole({ isLoggedIn, role }: AdminRoleProps) {
  return (
    <div>
      {isLoggedIn && role === UserRole.ADMIN && (
        <Link
          href="/admin"
          className="flex h-10 items-center gap-2 rounded-xl bg-brand-green px-4 text-sm font-semibold text-brand-navy transition hover:brightness-110"
        >
          <LayoutDashboard size={15} />
          Admin Dashboard
        </Link>
      )}
    </div>
  );
}
