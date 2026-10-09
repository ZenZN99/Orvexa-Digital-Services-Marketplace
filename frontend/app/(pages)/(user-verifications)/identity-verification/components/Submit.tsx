"use client";

import { CheckCircle2, Loader2, ShieldCheck } from "lucide-react";

interface SubmitProps {
  submitted: boolean;
  canSubmit: boolean | null;
  handleSubmit: () => void;
  loading: {
    creating: string | any;
  };
}

export default function Submit({
  submitted,
  canSubmit,
  handleSubmit,
  loading,
}: SubmitProps) {
  return (
    <div className="mt-7 flex flex-col items-center">
      {submitted ? (
        <div className="flex items-center gap-2 rounded-xl border border-brand-green/20 bg-brand-green/10 px-5 py-3 text-sm font-semibold text-brand-green">
          <CheckCircle2 size={17} />
          Verification request submitted
        </div>
      ) : (
        <button
          type="button"
          disabled={!canSubmit}
          onClick={handleSubmit}
          className="flex h-11 min-w-52 items-center justify-center gap-2 rounded-xl bg-brand-green px-6 text-sm font-semibold text-brand-navy shadow-[0_8px_30px_rgba(0,220,130,0.08)] transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[0_12px_35px_rgba(0,220,130,0.14)] disabled:pointer-events-none disabled:opacity-30"
        >
          {loading.creating ? (
            <>
              <Loader2 size={17} className="animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <ShieldCheck size={17} />
              Submit for verification
            </>
          )}
        </button>
      )}
    </div>
  );
}
