"use client";

import DashboardOverview from "../dashboard/DashboardOverview";
import OrdersManagement from "../orders/OrdersManagement/OrdersManagement";
import PaymentsManagement from "../payments/PaymentsManagement/PaymentsManagement";
import PlatformWallet from "../wallets/PlatformWallet/PlatformWallet";
import SupportManagement from "../support/SupportManagement/SupportManagement";
import type { AdminContentProps } from "../types/admin";
import UsersManagement from "../users/UsersManagement/UsersManagement";
import ServicesManagement from "../services/ServicesManagement/ServicesManagement";
import ContractsManagement from "../contracts/ContractsManagement/ContractsManagement";

export default function AdminContent({ activeTab }: AdminContentProps) {
  switch (activeTab) {
    case "dashboard":
      return <DashboardOverview />;

    case "users":
      return <UsersManagement />;

    case "services":
      return <ServicesManagement />;

    case "orders":
      return <OrdersManagement />;

    case "contracts":
      return <ContractsManagement />;

    case "payments":
      return <PaymentsManagement />;

    case "wallet":
      return <PlatformWallet />;

    case "support":
      return <SupportManagement />;

    default:
      return <DashboardOverview />;
  }
}
