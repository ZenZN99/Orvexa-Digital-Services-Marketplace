"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  Headset,
  LayoutDashboard,
  ShoppingCart,
  Sparkles,
  X,
} from "lucide-react";
import MobileLink from "./MobileLink";
import { IUser, UserRole } from "@/app/types/user";
import { links } from "./Navigation";
import Logo from "./Logo";
import BellIcon from "../Bell";

interface MobileMenuProps {
  open: boolean;
  isLoggedIn: boolean;
  role?: UserRole;
  cartCount: number;
  currentUser: IUser | null;
  isGuest: boolean;
  handleLogout: () => void;
  loading: boolean;
  onClose: () => void;
}

export default function MobileMenu({
  open,
  isLoggedIn,
  role,
  cartCount,
  currentUser,
  isGuest,
  handleLogout,
  loading,
  onClose,
}: MobileMenuProps) {
  const roleLinks = role ? (links[role] ?? []) : [];

  // منع سكرول الصفحة عند فتح الـ sidebar + الإغلاق بزر Escape
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  return (
    <div
      className={`md:hidden ${open ? "pointer-events-auto" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 right-0 z-50 flex w-72 max-w-[85%] flex-col border-l border-white/8 bg-brand-navy/95 shadow-2xl shadow-black/40 backdrop-blur-2xl transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex h-17 shrink-0 items-center justify-between border-b border-white/8 px-4">
          <div onClick={onClose}>
            <Logo />
          </div>

          <div className="flex items-center gap-2">
            <BellIcon />

            <button
              onClick={onClose}
              aria-label="Close menu"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/8 bg-white/2.5 text-white"
            >
              <X size={19} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-3">
          {isLoggedIn ? (
            <>
              {/* User info */}
              {currentUser && (
                <Link
                  href="/profile"
                  onClick={onClose}
                  className="mb-3 flex items-center gap-3 rounded-xl border border-white/7 bg-white/2.5 p-3 transition hover:bg-white/5"
                >
                  {currentUser.profile?.avatar ? (
                    <img
                      src={currentUser.profile.avatar.url}
                      alt={currentUser.firstName}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-green text-sm font-bold text-brand-navy">
                      {currentUser.firstName?.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <span className="truncate text-sm text-white">
                    {currentUser.firstName}
                  </span>
                </Link>
              )}

              <div className="space-y-1">
                {roleLinks.map((link) => (
                  <MobileLink
                    key={link.href}
                    href={link.href}
                    onClick={onClose}
                  >
                    {link.label}
                  </MobileLink>
                ))}
              </div>

              {/* CLIENT: cart */}
              {role === UserRole.CLIENT && (
                <Link
                  href="/cart"
                  onClick={onClose}
                  className="mt-3 flex h-11 items-center justify-center gap-2 rounded-xl border border-white/7 bg-white/2.5 text-sm font-semibold text-white"
                >
                  <ShoppingCart size={16} />
                  Cart
                  {cartCount > 0
                    ? ` (${cartCount > 9 ? "9+" : cartCount})`
                    : ""}
                </Link>
              )}

              {/* FREELANCER: create service */}
              {role === UserRole.FREELANCER && (
                <Link
                  href="/services/create"
                  onClick={onClose}
                  className="mt-3 flex h-11 items-center justify-center gap-2 rounded-xl bg-brand-green text-sm font-semibold text-brand-navy"
                >
                  <Sparkles size={16} />
                  Create Service
                </Link>
              )}

              {/* ADMIN: dashboard */}
              {role === UserRole.ADMIN && (
                <Link
                  href="/admin"
                  onClick={onClose}
                  className="mt-3 flex h-11 items-center justify-center gap-2 rounded-xl bg-brand-green text-sm font-semibold text-brand-navy"
                >
                  <LayoutDashboard size={16} />
                  Admin Dashboard
                </Link>
              )}

              {/* SUPPORT: conversations */}
              {role === UserRole.SUPPORT && (
                <Link
                  href="/support"
                  onClick={onClose}
                  className="mt-3 flex h-11 items-center justify-center gap-2 rounded-xl bg-brand-green text-sm font-semibold text-brand-navy"
                >
                  <Headset size={16} />
                  Support Conversations
                </Link>
              )}

              {/* Logout */}
              <button
                onClick={() => {
                  onClose();
                  handleLogout();
                }}
                disabled={loading}
                className="mt-3 flex h-11 w-full items-center justify-center rounded-xl border border-white/7 bg-white/2.5 text-sm text-white/60 transition hover:bg-red-500/10 hover:text-red-400"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <div className="space-y-1">
                <MobileLink href="/privacy" onClick={onClose}>
                  Privacy Policy
                </MobileLink>

                <MobileLink href="/terms" onClick={onClose}>
                  Orvexa Terms
                </MobileLink>

                <MobileLink href="/cookies" onClick={onClose}>
                  Cookies Policy
                </MobileLink>
              </div>

              {isGuest && (
                <div className="mt-3 flex flex-col gap-2">
                  <Link
                    href="/login"
                    onClick={onClose}
                    className="flex h-11 items-center justify-center rounded-xl border border-white/7 bg-white/2.5 text-sm text-white/70"
                  >
                    Login
                  </Link>

                  <Link
                    href="/register"
                    onClick={onClose}
                    className="flex h-11 items-center justify-center rounded-xl bg-brand-green text-sm font-semibold text-brand-navy"
                  >
                    Create Account
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </aside>
    </div>
  );
}
