"use client";

import { CSSProperties } from "react";
import AnimatedNumber from "./AnimatedNumber";
import DashboardPanel from "./DashboardPanel";
import Skeleton from "./Skeleton";
import { IPayment } from "@/app/types/payment";
import { ArrowDownRight, ArrowUpRight, Wallet } from "lucide-react";
import { formatCurrency } from "../utils/helpers";

interface RevenueMonth {
  key: string;
  month: string;
  value: number;
}

interface RevenueData {
  total: number;
  percent: number | null;
  max: number;
  partial: boolean;
  months: RevenueMonth[];
}

interface PaymentData {
  payments: IPayment[];
}

interface RevenueProps {
  revenue: RevenueData;
  payments: PaymentData;
  paymentsReady: boolean;
}

export default function Revenue({
  revenue,
  payments,
  paymentsReady,
}: RevenueProps) {
  return (
    <DashboardPanel
      delay={300}
      title="Payments Volume"
      description="Completed payments over the last six months."
      icon={Wallet}
    >
      <div className="mt-6">
        <div className="flex items-end justify-between">
          <div>
            {paymentsReady ? (
              <p className="text-3xl font-semibold tracking-tight text-white">
                <AnimatedNumber value={revenue.total} currency />
              </p>
            ) : (
              <Skeleton className="h-9 w-40" />
            )}

            {paymentsReady && revenue.percent !== null ? (
              <div
                className={`mt-1 flex items-center gap-1.5 text-xs ${
                  revenue.percent >= 0 ? "text-brand-green" : "text-red-400"
                }`}
              >
                {revenue.percent >= 0 ? (
                  <ArrowUpRight size={13} />
                ) : (
                  <ArrowDownRight size={13} />
                )}
                {Math.abs(revenue.percent).toFixed(1)}% vs previous month
              </div>
            ) : (
              <div className="mt-1 text-xs text-white/30">
                {paymentsReady ? "Completed payments only" : "\u00A0"}
              </div>
            )}
          </div>

          <span className="text-xs text-white/25">USD</span>
        </div>

        {/* Chart */}
        <div className="mt-8">
          {paymentsReady ? (
            <>
              <div className="relative h-52">
                {/* Grid lines */}
                <div className="pointer-events-none absolute inset-0 flex flex-col justify-between">
                  {[0, 1, 2, 3].map((line) => (
                    <div
                      key={line}
                      className="border-t border-dashed border-white/5"
                    />
                  ))}
                </div>

                <div className="relative flex h-full items-end gap-3 sm:gap-5">
                  {revenue.months.map((item, index) => {
                    const height =
                      revenue.max > 0 ? (item.value / revenue.max) * 100 : 0;

                    const isLast = index === revenue.months.length - 1;

                    return (
                      <div
                        key={item.key}
                        className="group relative flex h-full min-w-0 flex-1 items-end justify-center"
                      >
                        {/* Tooltip */}
                        <div
                          className="pointer-events-none absolute z-10 -translate-y-2 whitespace-nowrap rounded-lg border border-white/10 bg-brand-navy px-2.5 py-1 text-[11px] font-medium text-white opacity-0 shadow-lg transition-all duration-200 group-hover:-translate-y-3 group-hover:opacity-100"
                          style={{ bottom: `${Math.max(height, 4)}%` }}
                        >
                          {item.month}: {formatCurrency(item.value)}
                        </div>

                        <div
                          className={`dash-grow-y w-full max-w-10 origin-bottom rounded-t-lg transition-all duration-300 group-hover:brightness-125 ${
                            item.value > 0
                              ? isLast
                                ? "bg-linear-to-t from-brand-green/60 to-brand-green shadow-[0_0_24px_-6px_rgba(0,220,130,0.6)]"
                                : "bg-linear-to-t from-brand-green/30 to-brand-green/70 group-hover:to-brand-green"
                              : "bg-white/6"
                          }`}
                          style={
                            {
                              height: `${item.value > 0 ? Math.max(height, 3) : 2}%`,
                              "--d": `${420 + index * 90}ms`,
                            } as CSSProperties
                          }
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-3 flex gap-3 sm:gap-5">
                {revenue.months.map((item) => (
                  <span
                    key={item.key}
                    className="flex-1 text-center text-[10px] text-white/30"
                  >
                    {item.month}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <div className="flex h-52 items-end gap-3 sm:gap-5">
              {[45, 60, 50, 72, 80, 92].map((height, index) => (
                <Skeleton
                  key={index}
                  className="w-full max-w-10 flex-1 rounded-t-lg"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
          )}

          <div className="mt-4 border-t border-white/6" />

          {paymentsReady && revenue.partial && (
            <p className="mt-3 text-[11px] text-white/25">
              Based on the latest {payments.payments.length} payments.
            </p>
          )}
        </div>
      </div>
    </DashboardPanel>
  );
}
