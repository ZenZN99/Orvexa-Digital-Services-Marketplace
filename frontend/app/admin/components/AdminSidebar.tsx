"use client";

import {
  BarChart3,
  BriefcaseBusiness,
  CreditCard,
  FileText,
  Headphones,
  LogOut,
  MessageSquare,
  Settings,
  ShoppingBag,
  UserRound,
  Wallet,
  X,
} from "lucide-react";

import type { AdminSidebarProps, AdminTab } from "../types/admin";
import { useAuthStore } from "@/app/stores/useAuthStore";
import { useRouter } from "next/navigation";

const navigation: {
  id: AdminTab;
  label: string;
  icon: typeof BarChart3;
}[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: BarChart3,
  },
  {
    id: "users",
    label: "Users",
    icon: UserRound,
  },
  {
    id: "services",
    label: "Services",
    icon: BriefcaseBusiness,
  },
  {
    id: "orders",
    label: "Orders",
    icon: ShoppingBag,
  },
  {
    id: "contracts",
    label: "Contracts",
    icon: FileText,
  },
  {
    id: "payments",
    label: "Payments",
    icon: CreditCard,
  },
  {
    id: "wallet",
    label: "Platform Wallet",
    icon: Wallet,
  },

  {
    id: "support",
    label: "Support",
    icon: Headphones,
  },
];

export default function AdminSidebar({
  activeTab,
  onTabChange,
  onClose,
}: AdminSidebarProps & { onClose?: () => void }) {
  const { logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    onClose?.();
    await logout();
    router.push("/login");
  };

  const handleTabChange = (tab: AdminTab) => {
    onTabChange(tab);
    onClose?.();
  };

  return (
    <aside className="flex h-full w-full shrink-0 flex-col border-r border-white/6 bg-brand-navy">
      {/* Brand */}
      <div className="flex h-20 items-center justify-between border-b border-white/6 px-6">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-white">
            ORVEXA
          </h1>

          <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.18em] text-brand-green">
            Admin Console
          </p>
        </div>

        {/* Close (small screens only) */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.07] bg-white/2.5 text-white/45 transition-all duration-300 hover:border-brand-green/20 hover:bg-brand-green/6 hover:text-brand-green lg:hidden"
          >
            <X size={18} strokeWidth={1.8} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-5">
        <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/25">
          Management
        </p>

        <div className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleTabChange(item.id)}
                aria-current={isActive ? "page" : undefined}
                className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-all duration-200 ${
                  isActive
                    ? "bg-brand-green/10 text-brand-green"
                    : "text-white/40 hover:bg-white/[0.035] hover:text-white/75"
                }`}
              >
                {/* Active indicator */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-brand-green" />
                )}

                <Icon
                  size={17}
                  strokeWidth={isActive ? 2 : 1.7}
                  className={`shrink-0 transition-colors ${
                    isActive
                      ? "text-brand-green"
                      : "text-white/30 group-hover:text-white/60"
                  }`}
                />

                <span className="truncate font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Bottom */}
      <div className="border-t border-white/6 p-3">
        <button
          onClick={handleLogout}
          className="group mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-white/35 transition-all duration-200 hover:bg-red-500/6 hover:text-red-400"
        >
          <LogOut
            size={17}
            strokeWidth={1.7}
            className="text-white/30 transition-colors group-hover:text-red-400"
          />

          <span className="font-medium">Sign out</span>
        </button>
      </div>
    </aside>
  );
}
