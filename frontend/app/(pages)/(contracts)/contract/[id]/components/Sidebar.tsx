"use client";

import Link from "next/link";
import { formatDate, statusLabel } from "../utils/helpers";
import { ContractStatus, IContract } from "@/app/types/contract";
import Avatar from "./Avatar";
import { IUser } from "@/app/types/user";
import InfoRow from "./InfoRow";
import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
  PackageCheck,
  Wallet,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

interface SidebarProps {
  canChat: boolean;
  contract: IContract;
  isClient: boolean;
  otherUser?: IUser;
  handleReceiveService: () => void;
  handleDeliverContract: () => void;
  loading: {
    completing: Record<string, boolean>;
    delivering: Record<string, boolean>;
  };
  open?: boolean;
  onClose?: () => void;
}

function ExpiredNotice({
  isClient,
  amount,
  deadline,
}: {
  isClient: boolean;
  amount: number;
  deadline: string | Date;
}) {
  if (isClient) {
    return (
      <div className="rounded-xl border border-brand-green/20 bg-brand-green/5 px-4 py-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-green/10 text-brand-green">
            <Wallet size={16} />
          </div>

          <div>
            <p className="text-sm font-semibold text-brand-green">
              Delivery deadline expired
            </p>

            <p className="mt-2 text-xs leading-5 text-white/50">
              The freelancer did not deliver the service before the deadline (
              {formatDate(deadline)}). The contract was closed automatically and{" "}
              <span className="font-semibold text-white/80">
                ${Number(amount).toFixed(2)}
              </span>{" "}
              has been refunded to your balance.
            </p>

            <p className="mt-2 text-xs leading-5 text-white/35">
              You can browse other services and place a new order anytime.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-4">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-red-400">
          <AlertTriangle size={16} />
        </div>

        <div>
          <p className="text-sm font-semibold text-red-400">
            You missed the delivery deadline
          </p>

          <p className="mt-2 text-xs leading-5 text-white/50">
            The service was not delivered before {formatDate(deadline)}, so the
            contract was terminated and the payment was returned to the client.
          </p>

          <p className="mt-2 text-xs leading-5 text-white/35">
            Please manage your time better next time and only accept orders you
            can deliver on schedule. Repeated delays can hurt your rating and
            your chances of getting new clients.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Sidebar({
  canChat,
  contract,
  isClient,
  otherUser,
  handleReceiveService,
  handleDeliverContract,
  loading,
  open = false,
  onClose,
}: SidebarProps) {
  const [showReceiveInfo, setShowReceiveInfo] = useState(false);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  const isActionLoading = isClient
    ? !!loading.completing[contract.id]
    : !!loading.delivering[contract.id];

  const isExpired = contract.status === ContractStatus.EXPIRED;

  const canReceiveService =
    isClient && contract.status === ContractStatus.DELIVERED;

  const canDeliverService =
    !isClient && contract.status === ContractStatus.IN_PROGRESS;

  const serviceReceived =
    isClient && contract.status === ContractStatus.COMPLETED;

  return (
    <>
      {/* Overlay (small screens only) */}
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-80 max-w-[85%] flex-col overflow-y-auto sidebar-scrollbar border-r border-white/8 bg-brand-navy shadow-2xl shadow-black/40 transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        } lg:static lg:z-auto lg:min-h-0 lg:w-auto lg:max-w-none lg:translate-x-0 lg:overflow-y-auto lg:bg-transparent lg:shadow-none`}
      >
        {/* Header */}
        <div className="relative border-b border-white/8 p-6">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close details"
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-xl border border-white/8 bg-white/2.5 text-white lg:hidden"
          >
            <X size={17} />
          </button>

          <div
            className={`flex items-center gap-2 text-xs font-medium uppercase tracking-wider ${
              isExpired ? "text-red-400" : "text-brand-green"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isExpired ? "bg-red-400" : "bg-brand-green"
              }`}
            />

            {canChat ? "Active contract" : statusLabel(contract.status)}
          </div>

          <h1 className="mt-4 text-lg font-semibold leading-7">
            {contract.service?.title ?? "Contract"}
          </h1>
        </div>

        {/* Other User */}
        <div className="border-b border-white/8 p-6">
          <p className="text-[11px] font-medium uppercase tracking-wider text-white/25">
            {isClient ? "Freelancer" : "Client"}
          </p>

          <div className="mt-4 flex items-center gap-3">
            <Avatar user={otherUser} size="md" />

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white/85">
                {otherUser
                  ? `${otherUser.firstName} ${otherUser.lastName}`
                  : "Unknown user"}
              </p>

              <p className="mt-1 truncate text-xs text-white/30">
                {otherUser?.email}
              </p>
            </div>
          </div>
        </div>

        {/* Contract Information */}
        <div className="p-6">
          <p className="text-[11px] font-medium uppercase tracking-wider text-white/25">
            Contract information
          </p>

          <div className="mt-5 space-y-4">
            <InfoRow
              label="Amount"
              value={`$${Number(contract.amount).toFixed(2)}`}
            />

            <InfoRow label="Started" value={formatDate(contract.createdAt)} />

            <InfoRow label="Deadline" value={formatDate(contract.deadline)} />

            <InfoRow
              label="Status"
              value={statusLabel(contract.status)}
              valueClassName={
                canChat
                  ? "text-brand-green"
                  : isExpired
                    ? "text-red-400"
                    : "text-white/60"
              }
            />

            {/* Contract Action */}
            <div className="mt-6">
              {isExpired ? (
                <ExpiredNotice
                  isClient={isClient}
                  amount={Number(contract.amount)}
                  deadline={contract.deadline}
                />
              ) : isClient ? (
                <>
                  {/* Receive Service */}
                  <button
                    type="button"
                    disabled={isActionLoading || serviceReceived}
                    onClick={() => {
                      if (contract.status !== ContractStatus.DELIVERED) {
                        setShowReceiveInfo(true);
                        return;
                      }

                      setShowReceiveInfo(false);
                      handleReceiveService();
                    }}
                    className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                      serviceReceived
                        ? "cursor-not-allowed bg-white/10 text-white/35"
                        : canReceiveService
                          ? "bg-brand-green text-white hover:opacity-90"
                          : "cursor-pointer bg-white/10 text-white/30 hover:bg-white/12"
                    } disabled:cursor-not-allowed disabled:opacity-60`}
                  >
                    {isActionLoading ? (
                      <>
                        <Loader2 size={17} className="animate-spin" />
                        Processing...
                      </>
                    ) : serviceReceived ? (
                      <>
                        <CheckCircle2 size={17} />
                        Service Received
                      </>
                    ) : (
                      <>
                        <PackageCheck size={17} />
                        Receive Service
                      </>
                    )}
                  </button>

                  {/* Receive Info */}
                  {showReceiveInfo &&
                    contract.status !== ContractStatus.DELIVERED &&
                    contract.status !== ContractStatus.COMPLETED && (
                      <div className="mt-3 rounded-xl border border-white/8 bg-white/3 px-4 py-3">
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-green/10 text-brand-green">
                            <PackageCheck size={15} />
                          </div>

                          <p className="text-xs leading-5 text-white/45">
                            You&apos;ll be able to receive the service once{" "}
                            {otherUser ? (
                              <Link
                                href={`/freelancer/u/${otherUser.id}`}
                                onClick={onClose}
                                className="font-medium text-white/75 transition hover:text-brand-green hover:underline"
                              >
                                {otherUser.firstName} {otherUser.lastName}
                              </Link>
                            ) : (
                              <span className="font-medium text-white/65">
                                the freelancer
                              </span>
                            )}{" "}
                            completes and delivers it.
                          </p>
                        </div>
                      </div>
                    )}
                </>
              ) : (
                <button
                  type="button"
                  disabled={
                    isActionLoading ||
                    contract.status !== ContractStatus.IN_PROGRESS
                  }
                  onClick={handleDeliverContract}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    contract.status === ContractStatus.DELIVERED ||
                    contract.status === ContractStatus.COMPLETED
                      ? "cursor-not-allowed bg-brand-green/10 text-brand-green"
                      : canDeliverService
                        ? "bg-brand-green text-white hover:opacity-90"
                        : "cursor-not-allowed bg-white/10 text-white/30"
                  } disabled:cursor-not-allowed disabled:opacity-60`}
                >
                  {isActionLoading ? (
                    <>
                      <Loader2 size={17} className="animate-spin" />
                      Processing...
                    </>
                  ) : contract.status === ContractStatus.DELIVERED ||
                    contract.status === ContractStatus.COMPLETED ? (
                    <>
                      <CheckCircle2 size={17} />
                      Service Delivered
                    </>
                  ) : (
                    <>
                      <PackageCheck size={17} />
                      Deliver Service
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
