"use client";

import { UserRole } from "@/app/types/user";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";

interface ClientRoleProps {
  isLoggedIn: boolean;
  role?: UserRole;
  cartCount: number;
}

export default function ClientRole({
  isLoggedIn,
  role,
  cartCount,
}: ClientRoleProps) {
  return (
    <div >
      {isLoggedIn && role === UserRole.CLIENT && (
        <Link
          href="/cart"
          aria-label="Cart"
          className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/7 bg-white/2.5 text-white/50 transition hover:border-brand-green/20 hover:bg-white/5 hover:text-white"
        >
          <ShoppingCart size={17} />

          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-green px-1 text-[10px] font-bold text-brand-navy">
            {cartCount > 9 ? "9+" : cartCount}
          </span>
        </Link>
      )}
    </div>
  );
}
