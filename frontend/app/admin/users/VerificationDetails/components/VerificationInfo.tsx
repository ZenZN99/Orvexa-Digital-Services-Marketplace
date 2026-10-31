"use client";

import { AlertCircle, FileCheck2, LucideIcon } from "lucide-react";
import InfoItem from "./InfoItem";
import { formatDate } from "../utils/formatDate";
import { IUserVerification } from "@/app/types/user-verification";

interface StatusConfig {
  icon: LucideIcon;
  label: string;
  className: string;
}
interface VerificationInfoProps {
  verification: IUserVerification;
  config: StatusConfig;
}

export default function VerificationInfo({
  verification,
  config,
}: VerificationInfoProps) {
  return (
    <section className="rounded-2xl border border-white/[0.07] bg-white/2.5 p-5">
      <div className="mb-4 flex items-center gap-2">
        <FileCheck2 size={15} className="text-white/30" />

        <h3 className="text-sm font-medium text-white/70">
          Verification Information
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InfoItem label="Status" value={config.label} />

        <InfoItem
          label="Submitted At"
          value={formatDate(verification.submittedAt)}
        />
      </div>

      {(verification.profileImage?.url ||
        verification.identityDocument?.url) && (
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {verification.profileImage?.url && (
            <a
              href={verification.profileImage.url}
              target="_blank"
              rel="noreferrer"
              className="block overflow-hidden rounded-xl border border-white/6"
            >
              <img
                src={verification.profileImage.url}
                alt="Profile document"
                className="h-40 w-full object-cover"
              />
            </a>
          )}

          {verification.identityDocument?.url && (
            <a
              href={verification.identityDocument.url}
              target="_blank"
              rel="noreferrer"
              className="block overflow-hidden rounded-xl border border-white/6"
            >
              <img
                src={verification.identityDocument.url}
                alt="Identity document"
                className="h-40 w-full object-cover"
              />
            </a>
          )}
        </div>
      )}

      {verification.rejectionReason && (
        <div className="mt-4 rounded-xl border border-red-400/10 bg-red-400/5 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-300" />

            <div>
              <p className="text-xs font-medium text-red-300">
                Rejection Reason
              </p>

              <p className="mt-1 text-sm leading-6 text-white/50">
                {verification.rejectionReason}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
