"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  House,
  LogOut,
  Menu,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import type { AdminHeaderProps } from "../types/admin";
import BellIcon from "@/app/shared/components/Bell";
import { useAuthStore } from "@/app/stores/useAuthStore";

export default function AdminHeader({
  title,
  description,
  onMenuClick,
}: AdminHeaderProps) {
  const { currentUser, logout } = useAuthStore();
  const router = useRouter();

  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  // الإغلاق عند الضغط خارج القائمة أو بزر Escape
  useEffect(() => {
    if (!accountOpen) return;

    const onMouseDown = (e: MouseEvent) => {
      if (
        accountRef.current &&
        !accountRef.current.contains(e.target as Node)
      ) {
        setAccountOpen(false);
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAccountOpen(false);
    };

    document.addEventListener("mousedown", onMouseDown);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [accountOpen]);

  const handleLogout = async () => {
    setAccountOpen(false);
    await logout();
    router.push("/login");
  };

  const fullName = currentUser
    ? `${currentUser.firstName ?? ""} ${currentUser.lastName ?? ""}`.trim()
    : "";

  return (
    <header className="relative z-30 border-b border-white/6 bg-brand-navy/95 backdrop-blur-xl">
      <div className="mx-auto flex min-h-20 max-w-[1600px] items-center justify-between gap-3 px-4 sm:gap-6 sm:px-6 lg:px-8">
        {/* Page Information */}
        <div className="flex min-w-0 items-center gap-3">
          {/* Menu */}
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Toggle sidebar"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] bg-white/2.5 text-white/45 transition-all duration-300 hover:border-brand-green/20 hover:bg-brand-green/6 hover:text-brand-green lg:hidden"
          >
            <Menu size={18} strokeWidth={1.8} />
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="hidden h-1.5 w-1.5 rounded-full bg-brand-green sm:block" />

              <h1 className="truncate text-lg font-semibold tracking-tight text-white sm:text-xl">
                {title}
              </h1>
            </div>

            {description && (
              <p className="mt-1 hidden max-w-2xl truncate text-xs text-white/35 sm:block">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-2">
          {/* Notifications */}
          <BellIcon />

          {/* Divider */}
          <div className="mx-1 hidden h-7 w-px bg-white/[0.07] sm:block" />

          {/* Admin Account */}
          <div ref={accountRef} className="relative">
            <button
              type="button"
              onClick={() => setAccountOpen((prev) => !prev)}
              aria-haspopup="menu"
              aria-expanded={accountOpen}
              className={`group flex items-center gap-3 rounded-xl border px-2 py-1.5 transition-all duration-300 hover:border-white/[0.07] hover:bg-white/2.5 ${
                accountOpen
                  ? "border-white/[0.07] bg-white/2.5"
                  : "border-transparent"
              }`}
            >
              {/* Avatar */}
              {currentUser?.profile?.avatar ? (
                <img
                  src={currentUser.profile.avatar.url}
                  alt={currentUser.firstName}
                  className="h-9 w-9 rounded-lg border border-brand-green/15 object-cover"
                />
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-brand-green/15 bg-brand-green/10">
                  <ShieldCheck
                    size={17}
                    strokeWidth={1.8}
                    className="text-brand-green"
                  />
                </div>
              )}

              {/* Admin Info */}
              <div className="hidden text-left sm:block">
                <p className="max-w-32 truncate text-xs font-medium text-white/80">
                  {fullName || "Administrator"}
                </p>

                <p className="mt-0.5 text-[10px] text-white/30">
                  Admin account
                </p>
              </div>

              <ChevronDown
                size={15}
                strokeWidth={1.8}
                className={`hidden text-white/25 transition-transform duration-300 group-hover:text-white/50 sm:block ${
                  accountOpen ? "rotate-180 text-white/50" : ""
                }`}
              />
            </button>

            {/* Dropdown */}
            {accountOpen && (
              <div
                role="menu"
                className="absolute right-0 top-full z-50 mt-2 w-64 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-white/8 bg-brand-navy p-2 shadow-2xl shadow-black/40"
              >
                {/* Account summary */}
                <div className="flex items-center gap-3 border-b border-white/6 px-3 pb-3 pt-2">
                  {currentUser?.profile?.avatar ? (
                    <img
                      src={currentUser.profile.avatar.url}
                      alt={currentUser.firstName}
                      className="h-10 w-10 shrink-0 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-brand-green/15 bg-brand-green/10">
                      <ShieldCheck
                        size={18}
                        strokeWidth={1.8}
                        className="text-brand-green"
                      />
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white/85">
                      {fullName || "Administrator"}
                    </p>

                    <p className="mt-0.5 truncate text-xs text-white/30">
                      {currentUser?.email ?? "Admin account"}
                    </p>
                  </div>
                </div>

                {/* Links */}
                <div className="space-y-1 py-2">
                  <Link
                    href="/profile"
                    role="menuitem"
                    onClick={() => setAccountOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/50 transition hover:bg-white/[0.035] hover:text-white"
                  >
                    <UserRound size={16} strokeWidth={1.7} />
                    Profile
                  </Link>

                  <Link
                    href="/"
                    role="menuitem"
                    onClick={() => setAccountOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/50 transition hover:bg-white/[0.035] hover:text-white"
                  >
                    <House size={16} strokeWidth={1.7} />
                    Back to site
                  </Link>
                </div>

                {/* Sign out */}
                <div className="border-t border-white/6 pt-2">
                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/45 transition hover:bg-red-500/10 hover:text-red-400"
                  >
                    <LogOut size={16} strokeWidth={1.7} />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
