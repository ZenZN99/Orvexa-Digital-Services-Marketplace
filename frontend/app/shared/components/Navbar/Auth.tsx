"use client";

import { IUser } from "@/app/types/user";
import Link from "next/link";

interface AuthProps {
  isLoggedIn: boolean;
  currentUser: IUser | null;
  isGuest: boolean;
  handleLogout: () => void;
  loading: boolean;
}

export default function Auth({
  isLoggedIn,
  currentUser,
  isGuest,
  handleLogout,
  loading,
}: AuthProps) {
  return (
    <div>
      {isLoggedIn && currentUser ? (
        <div className="flex items-center gap-2">
          <div className="flex h-10 items-center gap-2 rounded-xl px-2.5">
            {currentUser.profile?.avatar ? (
              <Link href="/profile">
                <img
                  src={currentUser.profile.avatar.url}
                  alt={currentUser.firstName}
                  className="h-10 w-10 rounded-full object-cover transition-all duration-200 hover:scale-110"
                />
              </Link>
            ) : (
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-green text-xs font-bold text-brand-navy">
                {currentUser.firstName?.charAt(0).toUpperCase()}
              </div>
            )}

            <span className="max-w-25 truncate text-sm text-white">
              {currentUser.firstName}
            </span>
          </div>

          <button
            onClick={handleLogout}
            disabled={loading}
            className="h-10 rounded-xl border border-white/7 bg-white/2.5 px-3 text-sm text-white/60 transition hover:bg-red-500/10 hover:text-red-400"
          >
            Logout
          </button>
        </div>
      ) : isGuest ? (
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="h-10 rounded-xl border border-white/7 bg-white/2.5 px-4 py-2.5 text-sm text-white/70 transition hover:bg-white/5 hover:text-white"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="h-10 rounded-xl bg-brand-green px-4 py-2.5 text-sm font-semibold text-brand-navy transition hover:brightness-110"
          >
            Create Account
          </Link>
        </div>
      ) : null}
    </div>
  );
}
