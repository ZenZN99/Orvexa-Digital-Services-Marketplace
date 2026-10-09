"use client";

import ClientRole from "./ClientRole";
import { IUser, UserRole } from "@/app/types/user";
import FreelancerRole from "./FreelancerRole";
import AdminRole from "./AdminRole";
import SupportRole from "./SupportRole";
import Auth from "./Auth";
import BellIcon from "../Bell";

interface ActionsProps {
  isLoggedIn: boolean;
  role?: UserRole;
  cartCount: number;
  currentUser: IUser | null;
  isGuest: boolean;
  handleLogout: () => void;
  loading: boolean;
}

export default function Actions({
  isLoggedIn,
  role,
  cartCount,
  currentUser,
  isGuest,
  handleLogout,
  loading,
}: ActionsProps) {
  return (
    <div className="hidden items-center gap-2 md:flex">
      <BellIcon />

      <ClientRole isLoggedIn={isLoggedIn} role={role} cartCount={cartCount} />

      <FreelancerRole isLoggedIn={isLoggedIn} role={role} />

      <AdminRole isLoggedIn={isLoggedIn} role={role} />

      <SupportRole isLoggedIn={isLoggedIn} role={role} />

      <Auth
        isLoggedIn={isLoggedIn}
        currentUser={currentUser}
        isGuest={isGuest}
        handleLogout={handleLogout}
        loading={loading}
      />
    </div>
  );
}
