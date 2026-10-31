"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import {
  CalendarDays,
  CheckCircle2,
  DollarSign,
  Eye,
  FileText,
  UserRound,
  X,
} from "lucide-react";

import { IPayment, PaymentStatus } from "@/app/types/payment";
import { PaymentStatusIcon } from "../PaymentStatusIcon";
import TableCell from "@/app/admin/components/TableCell";
import { formatCurrency, formatDate } from "../../utils/helpers";
import { usePresenceStore } from "@/app/stores/usePresenceStore";

export default function Payment({ payment }: { payment: IPayment }) {
  const [showModal, setShowModal] = useState(false);

  const statusClass =
    payment.status === PaymentStatus.COMPLETED
      ? "bg-brand-green/10 text-brand-green"
      : payment.status === PaymentStatus.FAILED
        ? "bg-red-400/10 text-red-300"
        : payment.status === PaymentStatus.REFUNDED
          ? "bg-purple-400/10 text-purple-300"
          : "bg-yellow-400/10 text-yellow-300";

  return (
    <>
      <TableCell>
        <div className="flex items-center gap-3">
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${statusClass}`}
          >
            <PaymentStatusIcon status={payment.status} />
          </div>

          <div className="min-w-0">
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-white/70 transition hover:text-brand-green"
            >
              <Eye size={14} />
              View
            </button>

            <p className="mt-0.5 text-[11px] text-white/25">Payment details</p>
          </div>
        </div>
      </TableCell>

      {showModal &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-999 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          >
            <div
              className="w-full max-w-2xl overflow-hidden rounded-2xl border border-white/8 bg-brand-navy shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-white/[0.07] p-5">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-xl ${statusClass}`}
                  >
                    <DollarSign size={17} />
                  </div>

                  <div>
                    <h2 className="text-sm font-semibold text-white">
                      Payment Details
                    </h2>

                    <p className="mt-0.5 text-xs text-white/30">
                      Payment and order information
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-lg p-2 text-white/30 transition hover:bg-white/5 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-5 p-5">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <Info
                    icon={DollarSign}
                    label="Amount"
                    value={formatCurrency(payment.amount)}
                  />

                  <Info icon={FileText} label="Status" value={payment.status} />

                  <Info
                    icon={CalendarDays}
                    label="Created"
                    value={
                      payment.createdAt
                        ? formatDate(payment.createdAt)
                        : "Unknown"
                    }
                  />

                  <Info
                    icon={CheckCircle2}
                    label="Paid At"
                    value={
                      payment.paidAt ? formatDate(payment.paidAt) : "Not paid"
                    }
                  />

                  <Info
                    icon={FileText}
                    label="Order"
                    value={payment.order?.status ?? "Unknown"}
                  />
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <UserCard label="Customer" user={payment.user} />

                  <div className="rounded-xl border border-white/6 bg-white/2.5 p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5">
                        <FileText size={17} className="text-white/30" />
                      </div>

                      <div className="min-w-0">
                        <p className="text-[10px] font-medium uppercase tracking-wider text-white/25">
                          Order
                        </p>

                        <p className="mt-1 text-sm font-medium text-white">
                          {formatCurrency(payment.order?.totalAmount ?? 0)}
                        </p>

                        <p className="mt-0.5 text-xs text-white/30">
                          {payment.order?.status ?? "Unknown"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}

function Info({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof DollarSign;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/6 bg-white/2.5 p-3.5">
      <div className="flex items-center gap-1.5">
        <Icon size={13} className="text-brand-green/70" />

        <p className="text-[10px] font-medium uppercase tracking-wider text-white/25">
          {label}
        </p>
      </div>

      <p className="mt-1.5 truncate text-sm font-medium text-white/70">
        {value}
      </p>
    </div>
  );
}

function UserCard({ label, user }: { label: string; user: IPayment["user"] }) {
  const onlineUserIds = usePresenceStore((state) => state.onlineUserIds);

  const isOnline = user ? onlineUserIds.includes(user.id) : false;

  return (
    <div className="rounded-xl border border-white/6 bg-white/2.5 p-4">
      <div className="flex items-center gap-3">
        <div className="group/avatar relative h-10 w-10 shrink-0">
          {user?.profile?.avatar?.url ? (
            <img
              src={user.profile.avatar.url}
              alt=""
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5">
              <UserRound size={17} className="text-white/25" />
            </div>
          )}

          {isOnline && (
            <>
              <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-brand-navy bg-brand-green shadow-[0_0_8px_rgba(0,220,130,0.45)]" />

              <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-white/10 bg-brand-navy px-2.5 py-1.5 text-[10px] font-medium text-white opacity-0 shadow-xl transition-opacity duration-200 group-hover/avatar:opacity-100">
                Online
              </span>
            </>
          )}
        </div>

        <div className="min-w-0">
          <p className="text-[10px] font-medium uppercase tracking-wider text-white/25">
            {label}
          </p>

          <p className="mt-1 truncate text-sm font-medium text-white">
            {user?.firstName} {user?.lastName}
          </p>

          <p className="mt-0.5 truncate text-xs text-white/30">{user?.email}</p>
        </div>
      </div>
    </div>
  );
}
