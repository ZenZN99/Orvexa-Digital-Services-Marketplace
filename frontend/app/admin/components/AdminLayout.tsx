"use client";

import { useEffect, useState } from "react";

import type { AdminTab } from "../types/admin";
import AdminContent from "./AdminContent";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import ProtectedRoute from "@/app/config/routes/ProtectedRoute";
import { UserRole } from "@/app/types/user";
const tabMeta: Record<
  AdminTab,
  {
    title: string;
    description: string;
  }
> = {
  dashboard: {
    title: "Dashboard",
    description: "Overview of your platform activity and performance.",
  },

  users: {
    title: "Users",
    description: "Manage users, roles, accounts, and verification.",
  },

  services: {
    title: "Services",
    description: "Review and manage services submitted to the platform.",
  },

  orders: {
    title: "Orders",
    description: "Monitor and manage platform orders.",
  },

  contracts: {
    title: "Contracts",
    description: "Review contracts between clients and freelancers.",
  },

  payments: {
    title: "Payments",
    description: "Monitor platform payments and transactions.",
  },

  wallet: {
    title: "Platform Wallet",
    description: "Manage the platform balance and withdrawals.",
  },

  support: {
    title: "Support",
    description: "Manage support conversations and requests.",
  },
};

export default function AdminLayout() {
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [sidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const currentTab = tabMeta[activeTab];

  const closeMobile = () => setMobileOpen(false);

  // منع سكرول الصفحة عند فتح القائمة + الإغلاق بـ Escape + الإغلاق عند تكبير الشاشة
  useEffect(() => {
    if (!mobileOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };

    const onResize = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
    };
  }, [mobileOpen]);

  return (
    <ProtectedRoute roles={[UserRole.ADMIN]}>
      <div className="min-h-screen bg-brand-navy text-white">
        <div className="flex min-h-screen">
          {/* Sidebar (large screens) */}
          <div
            className={`hidden shrink-0 transition-all duration-300 lg:block ${
              sidebarOpen ? "w-64" : "w-0 overflow-hidden"
            }`}
          >
            <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
          </div>

          {/* Sidebar drawer (small screens) */}
          <div
            className={`lg:hidden ${
              mobileOpen ? "pointer-events-auto" : "pointer-events-none"
            }`}
            aria-hidden={!mobileOpen}
          >
            {/* Overlay */}
            <div
              onClick={closeMobile}
              className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
                mobileOpen ? "opacity-100" : "opacity-0"
              }`}
            />

            {/* Drawer */}
            <div
              className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[85%] shadow-2xl shadow-black/40 transition-transform duration-300 ease-out ${
                mobileOpen ? "translate-x-0" : "-translate-x-full"
              }`}
            >
              <AdminSidebar
                activeTab={activeTab}
                onTabChange={setActiveTab}
                onClose={closeMobile}
              />
            </div>
          </div>

          {/* Main */}
          <div className="flex min-w-0 flex-1 flex-col">
            <AdminHeader
              title={currentTab.title}
              description={currentTab.description}
              onMenuClick={() => setMobileOpen(true)}
            />

            <main className="flex-1 overflow-x-hidden">
              <AdminContent activeTab={activeTab} />
            </main>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
