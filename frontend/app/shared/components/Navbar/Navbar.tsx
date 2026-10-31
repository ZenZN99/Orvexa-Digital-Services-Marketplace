"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/app/stores/useAuthStore";
import { useRouter } from "next/navigation";
import Logo from "./Logo";
import Navigation from "./Navigation";
import Actions from "./Actions";
import MobileToggle from "./MobileToggle";
import MobileMenu from "./MobileMenu";
import { useCarts } from "@/app/hooks/useCarts";
import NavbarSkeleton from "./NavbarSkeleton";

export default function Navbar() {
  const { currentUser, loadUser, logout } = useAuthStore();
  const { cart } = useCarts();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const closeMenu = useCallback(() => setOpen(false), []);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  useEffect(() => {
    const fetchCurrentUser = async () => {
      setLoading(true);
      await loadUser();
      setLoading(false);
    };
    fetchCurrentUser();
  }, []);

  const isLoggedIn = !loading && !!currentUser;
  const isGuest = !loading && !currentUser;
  const role = currentUser?.role;

  const cartCount = cart?.items.length ?? 0;

  if(loading) {
    return <NavbarSkeleton />
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4">
      <nav className="mx-auto flex h-17 max-w-7xl items-center justify-between rounded-2xl border border-white/8 bg-brand-navy/80 px-4 shadow-2xl shadow-black/20 backdrop-blur-2xl md:px-5">
        <Logo />

        <Navigation isLoggedIn={isLoggedIn} role={currentUser?.role} />

        <Actions
          isLoggedIn={isLoggedIn}
          role={role}
          cartCount={cartCount}
          currentUser={currentUser}
          isGuest={isGuest}
          handleLogout={handleLogout}
          loading={loading}
        />

        <MobileToggle open={open} setOpen={setOpen} />
      </nav>

      <MobileMenu
        open={open}
        isLoggedIn={isLoggedIn}
        role={role}
        cartCount={cartCount}
        currentUser={currentUser}
        isGuest={isGuest}
        handleLogout={handleLogout}
        loading={loading}
        onClose={closeMenu}
      />
    </header>
  );
}
