import { ContractStatus } from "@/app/types/contract";
import { useEffect, useRef, useState } from "react";

export const USERS_LIMIT = 100;
export const CONTRACTS_LIMIT = 100;
export const PAYMENTS_LIMIT = 100;
export const SUPPORT_LIMIT = 100;
export const ORDERS_LIMIT = 20;
export const SERVICES_LIMIT = 10;
export const VERIFICATIONS_LIMIT = 5;

export const DAY = 24 * 60 * 60 * 1000;
export const CHART_MONTHS = 6;

export const CONTRACT_GROUPS = [
  {
    label: "In Progress",
    statuses: [ContractStatus.IN_PROGRESS],
    className: "bg-blue-400",
  },
  {
    label: "Delivered",
    statuses: [ContractStatus.DELIVERED],
    className: "bg-purple-400",
  },
  {
    label: "Completed",
    statuses: [ContractStatus.COMPLETED],
    className: "bg-brand-green",
  },
  {
    label: "Disputed",
    statuses: [ContractStatus.DISPUTED],
    className: "bg-orange-400",
  },
  {
    label: "Other",
    statuses: [
      ContractStatus.CANCELLED,
      ContractStatus.REFUNDED,
      ContractStatus.EXPIRED,
    ],
    className: "bg-white/25",
  },
];


export type DateLike = Date | string | null | undefined;

export function toTime(value: DateLike): number | null {
  if (!value) return null;

  const time = new Date(value).getTime();

  return Number.isNaN(time) ? null : time;
}

export function toNumber(value: unknown): number {
  const number = Number(value);

  return Number.isFinite(number) ? number : 0;
}

export function formatCurrency(value: number, decimals?: number) {
  const digits = decimals ?? (Math.abs(value) >= 1000 ? 0 : 2);

  return `$${value.toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })}`;
}

export function fullName(user?: { firstName?: string; lastName?: string } | null) {
  const name = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim();

  return name || "A user";
}

export function shortId(id?: string) {
  return id ? id.slice(0, 8) : "unknown";
}

export function capitalize(value?: string) {
  if (!value) return "";

  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function timeAgo(time: number, now: number) {
  const diff = Math.max(0, now - time);
  const minutes = Math.floor(diff / 60000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(minutes / 60);

  if (hours < 24) return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;

  const days = Math.floor(hours / 24);

  if (days < 7) return `${days} ${days === 1 ? "day" : "days"} ago`;

  return new Date(time).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function periodStats(
  times: number[],
  total: number,
  now: number,
  windowMs: number,
) {
  const oldest = times.length ? Math.min(...times) : now;
  const complete = times.length >= total;

  const coversCurrent = complete || oldest <= now - windowMs;
  const coversPrevious = complete || oldest <= now - windowMs * 2;

  const current = times.filter((time) => time >= now - windowMs).length;
  const previous = times.filter(
    (time) => time < now - windowMs && time >= now - windowMs * 2,
  ).length;

  return {
    current: coversCurrent ? current : null,
    percent:
      coversCurrent && coversPrevious && previous > 0
        ? ((current - previous) / previous) * 100
        : null,
  };
}

export function useHasLoaded(isLoading: boolean) {
  const [state, setState] = useState({ saw: false, done: false });

  if (isLoading && !state.saw) {
    setState({ saw: true, done: false });
  } else if (!isLoading && state.saw && !state.done) {
    setState({ saw: true, done: true });
  }

  return state.done;
}

export function useCountUp(target: number, duration = 1000) {
  const [value, setValue] = useState(0);
  const fromRef = useRef(0);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const from = fromRef.current;
    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const progress = reduceMotion ? 1 : Math.min(1, (now - start) / duration);

      const eased = 1 - Math.pow(1 - progress, 3);
      const next = from + (target - from) * eased;

      fromRef.current = next;
      setValue(next);

      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return value;
}
