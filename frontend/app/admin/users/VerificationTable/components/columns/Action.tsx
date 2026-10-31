"use client";

import { useState } from "react";
import { Eye, Check, X, Loader2 } from "lucide-react";
import TableCell from "@/app/admin/components/TableCell";
import {
  IUserVerification,
  UserVerificationsStatus,
  UserVerificationStatus,
} from "@/app/types/user-verification";
import ModalImages from "../ModalImages";

interface ActionProps {
  verification: IUserVerification;
  onUpdateStatus?: (
    verificationId: string,
    status: UserVerificationStatus,
    rejectionReason?: string,
  ) => void;
  updating?: boolean;
}

export default function Action({
  verification,
  onUpdateStatus,
  updating = false,
}: ActionProps) {
  const [showImages, setShowImages] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const isPending = verification.status === UserVerificationsStatus.PENDING;

  const handleApprove = (event: React.MouseEvent) => {
    event.stopPropagation();
    onUpdateStatus?.(verification.id, UserVerificationsStatus.APPROVED);
  };

  const handleRejectClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    setShowRejectModal(true);
  };

  const handleRejectConfirm = () => {
    if (!rejectionReason.trim()) return;

    onUpdateStatus?.(
      verification.id,
      UserVerificationsStatus.REJECTED,
      rejectionReason.trim(),
    );
    setShowRejectModal(false);
    setRejectionReason("");
  };

  const closeRejectModal = () => {
    setShowRejectModal(false);
    setRejectionReason("");
  };

  return (
    <TableCell>
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            setShowImages(true);
          }}
          className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-white/[0.07] bg-white/2.5 px-2.5 text-[11px] font-medium text-white/40 transition hover:border-brand-green/20 hover:bg-brand-green/10 hover:text-brand-green"
        >
          <Eye size={13} />
          View
        </button>

        {isPending && (
          <>
            <button
              type="button"
              onClick={handleApprove}
              disabled={updating}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-white/[0.07] bg-white/2.5 px-2.5 text-[11px] font-medium text-white/40 transition hover:border-brand-green/30 hover:bg-brand-green/10 hover:text-brand-green disabled:cursor-not-allowed disabled:opacity-50"
            >
              {updating ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <Check size={13} />
              )}
              Approve
            </button>

            <button
              type="button"
              onClick={handleRejectClick}
              disabled={updating}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-white/[0.07] bg-white/2.5 px-2.5 text-[11px] font-medium text-white/40 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <X size={13} />
              Reject
            </button>
          </>
        )}
      </div>

      {showImages && (
        <ModalImages
          verification={verification}
          onClose={() => setShowImages(false)}
        />
      )}

      {showRejectModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={closeRejectModal}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-brand-green/20 bg-brand-navy p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-medium text-brand-green">
                Rejection Reason
              </h2>
              <button
                type="button"
                onClick={closeRejectModal}
                className="rounded-lg p-1.5 text-brand-green/50 transition hover:bg-brand-green/10 hover:text-brand-green"
              >
                <X size={16} />
              </button>
            </div>

            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
              autoFocus
              placeholder="Explain why this verification is rejected..."
              className="w-full resize-none rounded-lg border border-brand-green/20 bg-brand-green/5 p-3 text-[13px] text-brand-green"
            />

            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={closeRejectModal}
                className="rounded-lg px-3 py-1.5 text-[12px] text-brand-green/60 hover:text-brand-green"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRejectConfirm}
                disabled={!rejectionReason.trim() || updating}
                className="inline-flex items-center gap-1.5 rounded-lg bg-brand-green/15 px-3 py-1.5 text-[12px] font-medium text-brand-green transition hover:bg-brand-green/25 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {updating && <Loader2 size={13} className="animate-spin" />}
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </TableCell>
  );
}
