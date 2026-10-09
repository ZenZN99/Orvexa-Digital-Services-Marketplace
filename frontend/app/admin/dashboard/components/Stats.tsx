"use client";

import React from "react";
import StatCard from "./StatCard";
import { Users, BriefcaseBusiness, FileText, DollarSign } from "lucide-react";
import { IContract } from "@/app/types/contract";

interface UserGrowth {
  percent: number | null;
  current: number | null;
}

interface ContractGrowth {
  percent: number | null;
}

interface ContractsData {
  contracts: IContract[];
}

interface Wallet {
  balance: number;
}

interface StatsProps {
  usersReady: boolean;
  usersTotal: number;
  userGrowth: UserGrowth;

  servicesReady: boolean;
  publishedServices: number;
  pendingServicesReady: boolean;
  pendingServicesTotal: number;

  contractsReady: boolean;
  contractsTotal: number;
  contractGrowth: ContractGrowth;
  contractsPartial: boolean;
  activeContracts: number;
  contracts: ContractsData;

  walletReady: boolean;
  wallet: Wallet;
}

export default function Stats({
  usersReady,
  usersTotal,
  userGrowth,
  servicesReady,
  publishedServices,
  pendingServicesReady,
  pendingServicesTotal,
  contractsReady,
  contractsTotal,
  contractGrowth,
  contractsPartial,
  activeContracts,
  contracts,
  walletReady,
  wallet,
}: StatsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        delay={60}
        label="Total Users"
        icon={Users}
        ready={usersReady}
        value={usersTotal}
        change={userGrowth.percent}
        caption={
          userGrowth.current !== null
            ? `${userGrowth.current.toLocaleString("en-US")} new in the last 30 days`
            : "Registered accounts on the platform"
        }
      />

      <StatCard
        delay={120}
        label="Active Services"
        icon={BriefcaseBusiness}
        ready={servicesReady}
        value={publishedServices}
        change={null}
        caption={
          pendingServicesReady
            ? `${pendingServicesTotal.toLocaleString("en-US")} awaiting review`
            : "Published on the marketplace"
        }
      />

      <StatCard
        delay={180}
        label="Total Contracts"
        icon={FileText}
        ready={contractsReady}
        value={contractsTotal}
        change={contractGrowth.percent}
        caption={
          contractsPartial
            ? `${activeContracts.toLocaleString("en-US")} active in latest ${contracts.contracts.length}`
            : `${activeContracts.toLocaleString("en-US")} currently active`
        }
      />

      <StatCard
        delay={240}
        label="Platform Balance"
        icon={DollarSign}
        ready={walletReady}
        value={wallet.balance}
        currency
        change={null}
        caption="Current platform wallet balance"
      />
    </div>
  );
}
