"use client";

import {
  BriefcaseBusiness,
  DollarSign,
  FileText,
  MessageSquare,
  ShieldCheck,
  ShoppingBag,
  UserPlus,
  Wallet,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useContracts } from "../../hooks/useContracts";
import { useOrders } from "../../hooks/useOrders";
import { usePayments } from "../../hooks/usePayments";
import { usePlatformWallets } from "../../hooks/usePlatformWallets";
import { useServices } from "../../hooks/useServices";
import { useSupportConversations } from "../../hooks/useSupportConversations";
import { useUsers } from "../../hooks/useUsers";
import { useUserVerifications } from "../../hooks/useUserVerifications";
import { PaymentStatus } from "../../types/payment";
import { SupportConversationStatus } from "../../types/support-conversation";
import {
  capitalize,
  CHART_MONTHS,
  CONTRACT_GROUPS,
  CONTRACTS_LIMIT,
  DateLike,
  DAY,
  formatCurrency,
  fullName,
  ORDERS_LIMIT,
  PAYMENTS_LIMIT,
  periodStats,
  SERVICES_LIMIT,
  shortId,
  SUPPORT_LIMIT,
  toNumber,
  toTime,
  useHasLoaded,
  USERS_LIMIT,
  VERIFICATIONS_LIMIT,
} from "./utils/helpers";
import DashboardStyles from "./components/DashboardStyles";
import PageIntro from "./components/PageIntro";
import Revenue from "./components/Revenue";
import { ContractStatus } from "@/app/types/contract";
import ContractsStatus from "./components/ContractsStatus";
import BottomGrid from "./components/BottomGrid";
import QuickOverview from "./components/QuickOverview";
import Stats from "./components/Stats";

export default function DashboardOverview() {
  const users = useUsers(1, USERS_LIMIT);
  const services = useServices(1, SERVICES_LIMIT);
  const orders = useOrders(1, ORDERS_LIMIT);
  const contracts = useContracts(1, CONTRACTS_LIMIT);
  const payments = usePayments(1, PAYMENTS_LIMIT);
  const verifications = useUserVerifications(1, VERIFICATIONS_LIMIT);
  const support = useSupportConversations(1, SUPPORT_LIMIT);
  const wallet = usePlatformWallets();

  const { fetchPendingServices } = services;

  useEffect(() => {
    fetchPendingServices();
  }, [fetchPendingServices]);

  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60000);

    return () => clearInterval(id);
  }, []);

  const usersReady = useHasLoaded(users.loading.global);
  const servicesReady = useHasLoaded(services.loading.global);
  const pendingServicesReady = useHasLoaded(services.loading.pending);
  const ordersReady = useHasLoaded(orders.loading.global);
  const contractsReady = useHasLoaded(contracts.loading.global);
  const paymentsReady = useHasLoaded(payments.loading.global);
  const verificationsReady = useHasLoaded(verifications.loading.global);
  const supportReady = useHasLoaded(support.loading.global);
  const walletReady = useHasLoaded(wallet.loading.global);

  const refreshing =
    users.loading.global ||
    services.loading.global ||
    services.loading.pending ||
    orders.loading.global ||
    contracts.loading.global ||
    payments.loading.global ||
    verifications.loading.global ||
    support.loading.global ||
    wallet.loading.global;

  const refreshAll = () => {
    users.refresh();
    services.refresh();
    services.fetchPendingServices();
    orders.refresh();
    contracts.refresh();
    payments.refresh();
    verifications.refresh();
    support.refresh();
    wallet.refresh();
  };

  const usersTotal = users.pagination.total;
  const publishedServices = services.pagination.total;
  const pendingServicesTotal = services.pendingPagination.total;
  const contractsTotal = contracts.pagination.total;
  const ordersTotal = orders.pagination.total;
  const paymentsTotal = payments.pagination.total;
  const pendingVerifications = verifications.pagination.total;

  const userGrowth = useMemo(
    () =>
      periodStats(
        users.users
          .map((user) => toTime(user.createdAt))
          .filter((time): time is number => time !== null),
        usersTotal,
        now,
        30 * DAY,
      ),
    [users.users, usersTotal, now],
  );

  const contractGrowth = useMemo(
    () =>
      periodStats(
        contracts.contracts
          .map((contract) => toTime(contract.createdAt))
          .filter((time): time is number => time !== null),
        contractsTotal,
        now,
        30 * DAY,
      ),
    [contracts.contracts, contractsTotal, now],
  );

  const contractsPartial = contractsTotal > contracts.contracts.length;

  const activeContracts = contracts.contracts.filter(
    (contract) =>
      contract.status === ContractStatus.IN_PROGRESS ||
      contract.status === ContractStatus.DELIVERED,
  ).length;

  const revenue = useMemo(() => {
    const months = Array.from({ length: CHART_MONTHS }, (_, index) => {
      const date = new Date(now);

      date.setDate(1);
      date.setHours(0, 0, 0, 0);
      date.setMonth(date.getMonth() - (CHART_MONTHS - 1 - index));

      return {
        key: `${date.getFullYear()}-${date.getMonth()}`,
        month: date.toLocaleString("en-US", { month: "short" }),
        start: date.getTime(),
        value: 0,
      };
    });

    const byKey = new Map(months.map((item) => [item.key, item]));

    payments.payments.forEach((payment) => {
      if (payment.status !== PaymentStatus.COMPLETED) return;

      const time = toTime(payment.paidAt) ?? toTime(payment.createdAt);

      if (time === null) return;

      const date = new Date(time);
      const item = byKey.get(`${date.getFullYear()}-${date.getMonth()}`);

      if (item) item.value += toNumber(payment.amount);
    });

    const oldestLoaded = payments.payments.reduce<number>((oldest, payment) => {
      const time = toTime(payment.createdAt);

      return time !== null && time < oldest ? time : oldest;
    }, now);

    const complete = payments.payments.length >= paymentsTotal;
    const covered = complete || oldestLoaded <= months[0].start;

    const total = months.reduce((sum, item) => sum + item.value, 0);
    const last = months[months.length - 1].value;
    const previous = months[months.length - 2].value;

    return {
      months,
      total,
      max: Math.max(...months.map((item) => item.value)),
      partial: !covered,
      percent:
        covered && previous > 0 ? ((last - previous) / previous) * 100 : null,
    };
  }, [payments.payments, paymentsTotal, now]);

  const completedVolume = payments.payments
    .filter((payment) => payment.status === PaymentStatus.COMPLETED)
    .reduce((sum, payment) => sum + toNumber(payment.amount), 0);

  const paymentsPartial = paymentsTotal > payments.payments.length;

  const contractStatus = useMemo(() => {
    const sample = contracts.contracts.length;

    return CONTRACT_GROUPS.map((group) => {
      const value = contracts.contracts.filter((contract) =>
        group.statuses.includes(contract.status),
      ).length;

      return {
        ...group,
        value,
        percentage: sample ? (value / sample) * 100 : 0,
      };
    });
  }, [contracts.contracts]);

  const openConversations = support.conversations.filter(
    (conversation) => conversation.status === SupportConversationStatus.OPEN,
  ).length;

  const supportPartial =
    support.pagination.total > support.conversations.length;

  const disputedContracts =
    contractStatus.find((status) => status.label === "Disputed")?.value ?? 0;

  const pendingActions = [
    {
      label: "Pending verifications",
      value: pendingVerifications,
      suffix: "",
      ready: verificationsReady,
      icon: ShieldCheck,
    },
    {
      label: "Services awaiting review",
      value: pendingServicesTotal,
      suffix: "",
      ready: pendingServicesReady,
      icon: BriefcaseBusiness,
    },
    {
      label: "Open support conversations",
      value: openConversations,
      suffix: supportPartial ? "+" : "",
      ready: supportReady,
      icon: MessageSquare,
    },
    {
      label: "Disputed contracts",
      value: disputedContracts,
      suffix: contractsPartial ? "+" : "",
      ready: contractsReady,
      icon: FileText,
    },
  ];

  const allCaughtUp =
    verificationsReady &&
    pendingServicesReady &&
    supportReady &&
    contractsReady &&
    pendingActions.every((action) => action.value === 0);

  const recentActivity = useMemo(() => {
    const items: {
      id: string;
      title: string;
      description: string;
      time: number;
      icon: typeof Wallet;
    }[] = [];

    const push = (
      id: string,
      title: string,
      description: string,
      date: DateLike,
      icon: typeof Wallet,
    ) => {
      const time = toTime(date);

      if (time !== null) items.push({ id, title, description, time, icon });
    };

    contracts.contracts
      .slice(0, 5)
      .forEach((contract) =>
        push(
          `contract-${contract.id}`,
          "New contract created",
          contract.service?.title
            ? `${fullName(contract.client)} hired ${fullName(contract.freelancer?.user)} for "${contract.service.title}".`
            : `Contract #${shortId(contract.id)} was created.`,
          contract.createdAt,
          FileText,
        ),
      );

    payments.payments
      .filter((payment) => payment.status === PaymentStatus.COMPLETED)
      .slice(0, 5)
      .forEach((payment) =>
        push(
          `payment-${payment.id}`,
          "Payment completed",
          `${fullName(payment.user)} paid ${formatCurrency(toNumber(payment.amount))} successfully.`,
          payment.paidAt ?? payment.createdAt,
          DollarSign,
        ),
      );

    verifications.verifications
      .slice(0, 5)
      .forEach((verification) =>
        push(
          `verification-${verification.id}`,
          "Verification submitted",
          `${fullName(verification.user)} is waiting for an identity review.`,
          verification.submittedAt ?? verification.createdAt,
          ShieldCheck,
        ),
      );

    services.pendingServices
      .slice(0, 5)
      .forEach((service) =>
        push(
          `service-${service.id}`,
          "Service awaiting review",
          `"${service.title}" by ${fullName(service.freelancer?.user)} needs approval.`,
          service.createdAt,
          BriefcaseBusiness,
        ),
      );

    support.conversations.slice(0, 5).forEach((conversation) => {
      const closed = conversation.status === SupportConversationStatus.CLOSED;

      push(
        `support-${conversation.id}`,
        closed ? "Support conversation closed" : "Support conversation opened",
        closed
          ? `Conversation with ${fullName(conversation.user)} was closed.`
          : `${fullName(conversation.user)} needs help from the support team.`,
        closed
          ? (conversation.closedAt ?? conversation.updatedAt)
          : conversation.createdAt,
        MessageSquare,
      );
    });

    users.users
      .slice(0, 5)
      .forEach((user) =>
        push(
          `user-${user.id}`,
          "New user joined",
          `${fullName(user)} signed up as ${capitalize(user.role)}.`,
          user.createdAt,
          UserPlus,
        ),
      );

    orders.orders
      .slice(0, 5)
      .forEach((order) =>
        push(
          `order-${order.id}`,
          "New order placed",
          `Order #${shortId(order.id)} · ${formatCurrency(toNumber(order.totalAmount))}`,
          order.createdAt,
          ShoppingBag,
        ),
      );

    return items.sort((a, b) => b.time - a.time).slice(0, 6);
  }, [
    contracts.contracts,
    payments.payments,
    verifications.verifications,
    services.pendingServices,
    support.conversations,
    users.users,
    orders.orders,
  ]);

  const activityReady =
    contractsReady &&
    paymentsReady &&
    usersReady &&
    ordersReady &&
    supportReady &&
    verificationsReady;

  return (
    <section className="space-y-6 p-6">
      <DashboardStyles />

      <PageIntro refreshAll={refreshAll} refreshing={refreshing} />

      <Stats
        usersReady={usersReady}
        usersTotal={usersTotal}
        userGrowth={userGrowth}
        servicesReady={servicesReady}
        publishedServices={publishedServices}
        pendingServicesReady={pendingServicesReady}
        pendingServicesTotal={pendingServicesTotal}
        contractsReady={contractsReady}
        contractsTotal={contractsTotal}
        contractGrowth={contractGrowth}
        contractsPartial={contractsPartial}
        activeContracts={activeContracts}
        contracts={contracts}
        walletReady={walletReady}
        wallet={wallet}
      />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.6fr_1fr]">
        <Revenue
          revenue={revenue}
          payments={payments}
          paymentsReady={paymentsReady}
        />

        <ContractsStatus
          contractsReady={contractsReady}
          contractStatus={contractStatus}
          contractsTotal={contractsTotal}
          contractsPartial={contractsPartial}
          contracts={contracts}
        />
      </div>

      <BottomGrid
        pendingActions={pendingActions}
        allCaughtUp={allCaughtUp}
        activityReady={activityReady}
        recentActivity={recentActivity}
        now={now}
      />

      <QuickOverview
        usersReady={usersReady}
        usersTotal={usersTotal}
        ordersReady={ordersReady}
        ordersTotal={ordersTotal}
        servicesReady={servicesReady}
        publishedServices={publishedServices}
        paymentsReady={paymentsReady}
        paymentsTotal={paymentsTotal}
        completedVolume={completedVolume}
        paymentsPartial={paymentsPartial}
        payments={payments}
      />
    </section>
  );
}
