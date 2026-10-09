"use client";
import {
  BriefcaseBusiness,
  DollarSign,
  ShoppingBag,
  Users,
} from "lucide-react";
import DashboardPanel from "./DashboardPanel";
import SnapshotItem from "./SnapshotItem";
import { formatCurrency } from "../utils/helpers";
import { IPayment } from "@/app/types/payment";

interface QuickOverviewProps {
  usersReady: boolean;
  usersTotal: number;

  ordersReady: boolean;
  ordersTotal: number;

  servicesReady: boolean;
  publishedServices: number;

  paymentsReady: boolean;
  paymentsTotal: number;
  completedVolume: number;
  paymentsPartial: boolean;
  payments: {
    payments: IPayment[];
  };
}
export default function QuickOverview({
  usersReady,
  usersTotal,
  ordersReady,
  ordersTotal,
  servicesReady,
  publishedServices,
  paymentsReady,
  paymentsTotal,
  completedVolume,
  paymentsPartial,
  payments,
}: QuickOverviewProps) {
  return (
    <DashboardPanel
      delay={540}
      title="Platform Snapshot"
      description="High-level activity across the main admin domains."
      icon={ShoppingBag}
    >
      <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        <SnapshotItem
          icon={Users}
          label="Users"
          ready={usersReady}
          value={usersTotal}
        />

        <SnapshotItem
          icon={ShoppingBag}
          label="Orders"
          ready={ordersReady}
          value={ordersTotal}
        />

        <SnapshotItem
          icon={BriefcaseBusiness}
          label="Services"
          ready={servicesReady}
          value={publishedServices}
        />

        <SnapshotItem
          icon={DollarSign}
          label="Payments"
          ready={paymentsReady}
          value={paymentsTotal}
          caption={`${formatCurrency(completedVolume)} completed${
            paymentsPartial ? ` (latest ${payments.payments.length})` : ""
          }`}
        />
      </div>
    </DashboardPanel>
  );
}
