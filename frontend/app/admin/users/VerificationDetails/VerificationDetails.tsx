"use client";

import { useState } from "react";
import type { IUserVerification, UserVerificationStatus } from "@/app/types/user-verification";
import { UserVerificationsStatus } from "@/app/types/user-verification";
import EmptyState from "./components/EmptyState";
import { statusConfig } from "./utils/statusConfig";
import Header from "./components/Header";
import Status from "./components/Status";
import User from "./components/User";
import VerificationInfo from "./components/VerificationInfo";
import Actions from "./components/Actions";
import VerificationSuccess from "./components/VerificationSuccess";

interface VerificationDetailsProps {
  verification: IUserVerification | null;
  onClose?: () => void;
  onApprove?: (verification: IUserVerification) => void;
  onReject?: (verification: IUserVerification, reason?: string) => void;
  updating?: boolean;
}

export default function VerificationDetails({
  verification,
  onClose,
  onApprove,
  onReject,
  updating = false,
}: VerificationDetailsProps) {
  const [rejectionReason, setRejectionReason] = useState("");

  if (!verification) {
    return <EmptyState />;
  }

  const user = verification.user;
  const isPending = verification.status === UserVerificationsStatus.PENDING;
  const config = statusConfig[verification.status as UserVerificationStatus];
  const StatusIcon = config.icon;

  return (
    <div className="space-y-6 p-6">
      <Header onClose={onClose} />

      <Status
        verification={verification}
        StatusIcon={StatusIcon}
        config={config}
      />

      <User user={user} />

      <VerificationInfo verification={verification} config={config} />

      {isPending && (
        <Actions
          verification={verification}
          updating={updating}
          rejectionReason={rejectionReason}
          setRejectionReason={setRejectionReason}
          onApprove={onApprove}
          onReject={onReject}
        />
      )}

      {verification.status === UserVerificationsStatus.APPROVED && (
        <VerificationSuccess />
      )}
    </div>
  );
}
