"use client";

import { UserRole } from "@/app/types/user";
import { Sparkles } from "lucide-react";
import Link from "next/link";

interface FreelancerRoleProps {
  isLoggedIn: boolean;
  role?: UserRole;
}

export default function FreelancerRole({
  isLoggedIn,
  role,
}: FreelancerRoleProps) {
  return (
    <div>
      {isLoggedIn && role === UserRole.FREELANCER && (
        <Link
          href="/create-service"
          className="flex h-10 items-center gap-2 rounded-xl bg-brand-green px-4 text-sm font-semibold text-brand-navy transition hover:brightness-110"
        >
          <Sparkles size={15} />
          Create Service
        </Link>
      )}
    </div>
  );
}
