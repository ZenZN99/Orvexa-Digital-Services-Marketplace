"use client";

import { usePathname } from "next/navigation";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";

import Navbar from "./Navbar/Navbar";
import Footer from "./Footer";

import { useAuthStore } from "@/app/stores/useAuthStore";
import { usePresenceStore } from "@/app/stores/usePresenceStore";
import Scroll from "./ٍScroll";
import { useNotificationStore } from "@/app/stores/useNotificationStore";
import { useMessageStore } from "@/app/stores/useMessageStore";

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const hiddenRoutes = ["/register", "/login", "/admin"];

  const hideNavbar =
    hiddenRoutes.includes(pathname) ||
    pathname.startsWith("/support/conversation/") ||
    pathname.startsWith("/contract/");

  const hideFooter =
    hiddenRoutes.includes(pathname) ||
    pathname.startsWith("/support/conversation/") ||
    pathname.startsWith("/contract/");

  const { currentUser, loadUser } = useAuthStore();
  const { connect: connectPresence } = usePresenceStore();
  const connectNotifications = useNotificationStore((state) => state.connect);

  const connectMessages = useMessageStore((state) => state.connect);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    if (!currentUser) return;

    connectPresence();
    connectNotifications();
    connectMessages();
  }, [currentUser, connectPresence, connectMessages, connectNotifications]);

  return (
    <>
      <Scroll />

      {!hideNavbar && <Navbar />}

      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,

          style: {
            background: "rgba(2, 4, 32, 0.94)",
            color: "#FFFFFF",
            padding: "14px 18px",
            borderRadius: "16px",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            boxShadow: "0 18px 50px rgba(0,0,0,0.45)",
            fontSize: "14px",
            fontWeight: 600,
          },

          success: {
            style: {
              border: "1px solid rgba(0,220,130,0.3)",
              color: "#00dc82",
              boxShadow: "0 18px 50px rgba(0,220,130,0.08)",
            },
            iconTheme: {
              primary: "#00dc82",
              secondary: "#020420",
            },
          },

          error: {
            style: {
              border: "1px solid rgba(248,113,113,0.3)",
              color: "#f87171",
            },
            iconTheme: {
              primary: "#ef4444",
              secondary: "#020420",
            },
          },

          loading: {
            style: {
              border: "1px solid rgba(0,220,130,0.22)",
              color: "#00dc82",
            },
            iconTheme: {
              primary: "#00dc82",
              secondary: "#020420",
            },
          },
        }}
      />

      {children}

      {!hideFooter && <Footer />}
    </>
  );
}
