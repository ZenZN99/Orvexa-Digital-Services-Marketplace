"use client";

import { X } from "lucide-react";
import { IUserVerification } from "@/app/types/user-verification";

interface ModalImagesProps {
  verification: IUserVerification;
  onClose: () => void;
}

export default function ModalImages({
  verification,
  onClose,
}: ModalImagesProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl rounded-2xl border border-brand-green/20 bg-brand-navy p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-base font-medium text-brand-green">
            Verification Images
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-brand-green/50 transition hover:bg-brand-green/10 hover:text-brand-green"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="mb-2 text-[12px] text-brand-green/50">
              Profile Image
            </p>
            <img
              src={verification.profileImage?.url}
              alt="Profile"
              className="h-96 w-full rounded-xl border border-brand-green/20 object-cover"
            />
          </div>

          <div>
            <p className="mb-2 text-[12px] text-brand-green/50">
              Identity Document
            </p>
            <img
              src={verification.identityDocument?.url}
              alt="Identity Document"
              className="h-96 w-full rounded-xl border border-brand-green/20 object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
