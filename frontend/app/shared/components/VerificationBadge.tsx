"use client";

import { useRouter } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import { IUser } from "@/app/types/user";
import { UserVerificationsStatus } from "@/app/types/user-verification";
export interface VerificationBadgeProps {
  user: IUser;
}

const VerificationBadge = ({ user }: VerificationBadgeProps) => {
  const router = useRouter();

  if (user.verification?.status === UserVerificationsStatus.APPROVED) {
    return (
      <span
        title="Verified account"
        className="inline-flex h-8 w-8 shrink-0 items-center justify-center"
      >
        <svg viewBox="0 0 24 24" className="h-full w-full" fill="none">
          <path
            d="M12 1.5l2.05 1.34 2.42-.23 1.34 2.05 2.24.95v2.43l1.53 1.88-1.53 1.88v2.43l-2.24.95-1.34 2.05-2.42-.23L12 22.5l-2.05-1.34-2.42.23-1.34-2.05-2.24-.95v-2.43L2.42 12l1.53-1.88V7.69l2.24-.95L7.53 4.7l2.42.23L12 1.5z"
            fill="#0095F6"
          />

          <path
            d="M9.3 12.2L11.2 14.1L15.1 9.9"
            stroke="white"
            strokeWidth="2.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={() => router.push("/identity-verification")}
      title="Verify your account"
      className="inline-flex h-7 shrink-0 items-center gap-1.5 rounded-full border border-white/10 bg-white/4 px-2.5 text-[11px] font-medium text-white/45 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.07] hover:text-white/70 active:scale-[0.97]"
    >
      <ShieldAlert size={13} strokeWidth={1.8} />
      <span>Not verified</span>
    </button>
  );
};

export default VerificationBadge;
