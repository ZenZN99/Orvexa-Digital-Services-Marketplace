"use client";

import ProtectedRoute from "@/app/config/routes/ProtectedRoute";
import { UserRole } from "@/app/types/user";
import { CheckCircle2 } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

interface IsSubmittedProps {
  handleResetForm: () => void;
  router: AppRouterInstance;
}

export default function IsSubmitted({
  handleResetForm,
  router,
}: IsSubmittedProps) {
  return (
    <ProtectedRoute roles={[UserRole.FREELANCER]}>
      <main className="flex min-h-screen items-center justify-center bg-brand-navy px-4 pt-20 text-white">
        <div className="mx-auto flex max-w-md flex-col items-center text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-green/10">
            <CheckCircle2 size={32} className="text-brand-green" />
          </div>
          <h1 className="mt-6 text-xl font-bold text-white">
            Your service was created successfully!
          </h1>
          <p className="mt-3 text-sm leading-6 text-white/50">
            Your service is now under review by our team. You will be notified
            as soon as the review is complete.
          </p>
          <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row">
            <button
              onClick={() => router.push("/freelancer")}
              className="h-11 flex-1 rounded-xl bg-brand-green text-sm font-semibold text-brand-navy transition hover:opacity-90"
            >
              Go to Freelancer Profile
            </button>

            <button
              onClick={handleResetForm}
              className="h-11 flex-1 rounded-xl border border-white/10 bg-white/5 text-sm font-semibold text-white/70 transition hover:bg-white/10"
            >
              Create Another Service
            </button>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
