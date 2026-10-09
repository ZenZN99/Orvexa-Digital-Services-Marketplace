"use client";

import { useState } from "react";
import { CheckCircle2, ClipboardCheck, X, XCircle } from "lucide-react";
import type { IService } from "@/app/types/service";
import { ServiceStatus } from "@/app/types/service";
import { useServices } from "@/app/hooks/useServices";
import TableCell from "@/app/admin/components/TableCell";

interface ActionsProps {
  service: IService;
  onUpdated?: () => void;
}

type Decision = ServiceStatus.PUBLISHED | ServiceStatus.REJECTED;

export default function Actions({ service, onUpdated }: ActionsProps) {
  const { updateServiceStatus, loading } = useServices();

  const [open, setOpen] = useState(false);
  const [decision, setDecision] = useState<Decision | null>(null);
  const [reason, setReason] = useState("");

  const isSubmitting = !!loading.updatingStatus[service.id];
  const isRejected = decision === ServiceStatus.REJECTED;
  const trimmedReason = reason.trim();

  const canSubmit =
    !!decision && !isSubmitting && (!isRejected || trimmedReason.length > 0);

  const close = () => {
    if (isSubmitting) return;
    setOpen(false);
    setDecision(null);
    setReason("");
  };

  const handleSubmit = async () => {
    if (!decision || !canSubmit) return;

    const result = await updateServiceStatus(
      service.id,
      decision,
      isRejected ? trimmedReason : undefined,
    );

    if (result) {
      onUpdated?.();
      setOpen(false);
      setDecision(null);
      setReason("");
    }
  };

  return (
    <TableCell>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-white/10 bg-white/4 px-3 py-1.5 text-xs font-medium text-white/60 transition hover:border-brand-green/20 hover:bg-brand-green hover:text-brand-navy"
      >
        <ClipboardCheck size={13} />
        Review
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={close}
        >
          <div
            className="relative w-full max-w-md rounded-2xl border border-white/[0.07] bg-brand-navy p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={close}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-white/60 transition hover:bg-white/10 hover:text-white"
              aria-label="Close"
            >
              <X size={16} />
            </button>

            <h3 className="text-base font-semibold text-white">
              Review service
            </h3>
            <p className="mt-1 line-clamp-1 text-xs text-white/40">
              {service.title}
            </p>

            {/* Decision */}
            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDecision(ServiceStatus.PUBLISHED)}
                className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-semibold transition ${
                  decision === ServiceStatus.PUBLISHED
                    ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-400"
                    : "border-white/10 bg-white/3 text-white/50 hover:bg-white/6"
                }`}
              >
                <CheckCircle2 size={16} />
                Approve
              </button>

              <button
                type="button"
                onClick={() => setDecision(ServiceStatus.REJECTED)}
                className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-semibold transition ${
                  isRejected
                    ? "border-red-500/40 bg-red-500/15 text-red-400"
                    : "border-white/10 bg-white/3 text-white/50 hover:bg-white/6"
                }`}
              >
                <XCircle size={16} />
                Reject
              </button>
            </div>

            {/* Reason (required only for reject) */}
            {isRejected && (
              <div className="mt-4">
                <label
                  htmlFor={`reason-${service.id}`}
                  className="text-xs font-medium text-white/60"
                >
                  Rejection reason <span className="text-red-400">*</span>
                </label>

                <textarea
                  id={`reason-${service.id}`}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={4}
                  placeholder="Explain why this service was rejected..."
                  className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-white/3 p-3 text-sm text-white  focus:outline-none"
                />

                {trimmedReason.length === 0 && (
                  <p className="mt-1 text-[11px] text-red-400/80">
                    A reason is required to reject a service.
                  </p>
                )}
              </div>
            )}

            {/* Footer */}
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={close}
                disabled={isSubmitting}
                className="h-10 flex-1 rounded-xl border border-white/10 bg-white/3 text-sm font-semibold text-white/60 transition hover:bg-white/6 disabled:opacity-40"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={!canSubmit}
                className={`h-10 flex-1 rounded-xl text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${
                  isRejected
                    ? "bg-red-500 text-white hover:bg-red-500/90"
                    : "bg-brand-green text-brand-navy hover:opacity-90"
                }`}
              >
                {isSubmitting
                  ? "Saving..."
                  : isRejected
                    ? "Confirm rejection"
                    : "Confirm approval"}
              </button>
            </div>
          </div>
        </div>
      )}
    </TableCell>
  );
}
