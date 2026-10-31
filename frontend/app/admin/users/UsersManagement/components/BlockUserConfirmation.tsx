"use client";

import toast from "react-hot-toast";

interface BlockUserConfirmationProps {
  toastId: string;
  onConfirm: () => void;
}

export default function BlockUserConfirmation({
  toastId,
  onConfirm,
}: BlockUserConfirmationProps) {
  return (
    <div className="w-90 rounded-xl border border-white/8 bg-brand-navy p-4 shadow-xl">
      <p className="text-sm font-semibold text-white">Block this user?</p>

      <p className="mt-2 text-xs leading-5 text-white/50">
        This action is permanent. The user will not be able to recover or access
        their account after being blocked.
      </p>

      <div className="mt-4 flex justify-end gap-2">
        <button
          type="button"
          onClick={() => toast.dismiss(toastId)}
          className="rounded-lg border border-white/6 px-3 py-2 text-xs text-white/45 transition hover:bg-white/5 hover:text-white"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={() => {
            toast.dismiss(toastId);
            onConfirm();
          }}
          className="rounded-lg bg-red-400/8 px-3 py-2 text-xs font-semibold text-red-300 transition hover:bg-red-400/[0.14] active:scale-[0.98]"
        >
          Block User
        </button>
      </div>
    </div>
  );
}
