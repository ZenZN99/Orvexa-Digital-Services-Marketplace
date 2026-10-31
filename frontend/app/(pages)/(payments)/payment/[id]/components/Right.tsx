"use client";

import { LucideIcon, UserRound } from "lucide-react";
import { formatDate } from "../../../payments/utils/helpers";
import { IPayment } from "@/app/types/payment";
import Link from "next/link";

interface RightProps {
  payment: IPayment;
  status: {
    className: string;
    label: string;
    description: string;
  };
  StatusIcon: LucideIcon;
}

export default function Right({ payment, status, StatusIcon }: RightProps) {
  return (
    <aside className="space-y-6">
      {/* Status Card */}
      <section className="rounded-2xl border border-white/8 bg-white/3 p-5">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${status.className.split(" ").slice(1, 2).join(" ")}`}
        >
          <StatusIcon size={20} />
        </div>

        <h2 className="mt-4 text-sm font-semibold">{status.label}</h2>

        <p className="mt-2 text-xs leading-5 text-white/35">
          {status.description}
        </p>
      </section>

      {/* User */}
      {payment.user && (
        <section className="rounded-2xl border border-white/8 bg-white/3 p-5">
          <div className="flex items-center gap-2">
            {payment?.user?.profile?.avatar?.url ? (
              <Link href={`/profile/u/${payment.userId}`}>
                <img
                  src={payment.user.profile.avatar.url}
                  alt={`${payment.user.firstName} ${payment.user.lastName}`}
                  className="h-6 w-6 rounded-full object-cover transition-all duration-300 hover:scale-110"
                />
              </Link>
            ) : (
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-green/10 text-xs font-semibold text-brand-green">
                {payment.user?.firstName?.charAt(0)}
              </div>
            )}

            <h2 className="text-sm font-semibold">Customer</h2>
          </div>

          <div className="mt-5">
            <p className="text-sm font-medium text-white/80">
              {payment.user.firstName} {payment.user.lastName}
            </p>

            <p className="mt-1 break-all text-xs text-white/35">
              {payment.user.email}
            </p>
          </div>
        </section>
      )}

      {/* Transaction Info */}
      <section className="rounded-2xl border border-white/8 bg-white/3 p-5">
        <h2 className="text-sm font-semibold">Transaction Info</h2>

        <div className="mt-5 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs text-white/30">Payment ID</span>

            <span className="max-w-40 truncate text-xs text-white/55">
              {payment.id}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="text-xs text-white/30">Created</span>

            <span className="text-xs text-white/55">
              {formatDate(payment.createdAt)}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="text-xs text-white/30">Updated</span>

            <span className="text-xs text-white/55">
              {formatDate(payment.updatedAt)}
            </span>
          </div>
        </div>
      </section>
    </aside>
  );
}
