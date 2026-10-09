"use client";

import { useAuthStore } from "@/app/stores/useAuthStore";
import type { JSX } from "react";

import AuthMiddleware from "../middlewares/AuthMiddleware";
import FreelancerMiddleware from "../middlewares/FreelancerMiddleware";
import AdminMiddleware from "../middlewares/AdminMiddleware";
import ClientMiddleware from "../middlewares/ClientMiddleware";
import Forbidden from "../middlewares/Forbidden";
import Loading from "@/app/admin/support/SupportManagement/components/Loading";

import { UserRole } from "@/app/types/user";

interface ProtectedRouteProps {
  children: JSX.Element;
  roles?: UserRole[];
}

const ProtectedRoute = ({ children, roles }: ProtectedRouteProps) => {
  const { currentUser, isLoading, isInitialized } = useAuthStore();

  if (isLoading || !isInitialized) {
    return <Loading />;
  }

  if (!currentUser) {
    return <AuthMiddleware />;
  }

  if (roles && !roles.includes(currentUser.role)) {
    if (roles.length > 1) {
      return <Forbidden />;
    }

    switch (roles[0]) {
      case UserRole.ADMIN:
        return <AdminMiddleware />;

      case UserRole.FREELANCER:
        return <FreelancerMiddleware />;

      case UserRole.CLIENT:
        return <ClientMiddleware />;

      default:
        return <Forbidden />;
    }
  }

  return children;
};

export default ProtectedRoute;
