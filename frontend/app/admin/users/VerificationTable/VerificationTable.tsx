"use client";

import type {
  IUserVerification,
  UserVerificationStatus,
} from "@/app/types/user-verification";

import EmptyState from "./components/EmptyState";
import Header from "./components/Header";
import User from "./components/columns/User";
import Status from "./components/columns/Status";
import Submitted from "./components/columns/Submitted";
import RejectionReason from "./components/columns/RejectionReason";
import Account from "./components/columns/Account";
import Action from "./components/columns/Action";
import Footer from "./components/Footer";
import Pagination from "@/app/shared/components/Pagination";
import { statusConfig } from "../VerificationDetails/utils/statusConfig";

interface VerificationTableProps {
  verifications: IUserVerification[];
  selectedVerificationId?: string | null;
  onSelectVerification?: (verification: IUserVerification) => void;
  onUpdateStatus?: (
    verificationId: string,
    status: UserVerificationStatus,
    rejectionReason?: string,
  ) => void;
  updatingStatus?: Record<string, boolean>;

  page?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

export default function VerificationTable({
  verifications,
  selectedVerificationId,
  onSelectVerification,
  onUpdateStatus,
  updatingStatus = {},
  page = 1,
  totalPages = 1,
  onPageChange,
}: VerificationTableProps) {
  if (verifications.length === 0) {
    return <EmptyState />;
  }

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-white/7 bg-white/2.5">
        <div className="overflow-x-auto">
          <table className="w-full min-w-275">
            <Header />

            <tbody>
              {verifications.map((verification) => {
                const selected = selectedVerificationId === verification.id;

                const user = verification.user;

                const config = verification.status
                  ? statusConfig[verification.status]
                  : null;

                if (!config) {
                  return null;
                }

                const StatusIcon = config.icon;

                return (
                  <tr
                    key={verification.id}
                    onClick={() => onSelectVerification?.(verification)}
                    className={`border-b border-white/5 last:border-0 transition-colors ${
                      onSelectVerification
                        ? "cursor-pointer hover:bg-white/[0.035]"
                        : ""
                    } ${selected ? "bg-brand-green/4.5" : ""}`}
                  >
                    <User user={user} />

                    <Status StatusIcon={StatusIcon} config={config} />

                    <Submitted verification={verification} />

                    <RejectionReason verification={verification} />

                    <Account user={user} />

                    <Action
                      verification={verification}
                      onUpdateStatus={onUpdateStatus}
                      updating={!!updatingStatus[verification.id]}
                    />
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <Footer verifications={verifications} />
      </div>

      {totalPages > 1 && onPageChange && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </>
  );
}
