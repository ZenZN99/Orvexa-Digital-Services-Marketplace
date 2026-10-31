"use client";

import { useEffect, useState } from "react";
import { Cookie, ShieldCheck } from "lucide-react";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("orvexa-cookie-consent");

    if (!consent) {
      setVisible(true);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("orvexa-cookie-consent", "accepted");

    document.body.style.overflow = "";
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-100">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-brand-navy/70 backdrop-blur-md" />

      {/* Consent Card */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center p-4 sm:p-6">
        <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-white/8 bg-brand-navy shadow-2xl shadow-black/40">
          {/* Green Glow */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-brand-green/10 blur-[80px]" />

          <div className="relative p-5 sm:p-6 md:p-7">
            {/* Header */}
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-brand-green/20 bg-brand-green/10">
                <Cookie size={20} className="text-brand-green" />
              </div>

              {/* Text */}
              <div className="min-w-0">
                <h2 className="text-base font-semibold text-white sm:text-lg">
                  We use cookies
                </h2>

                <p className="mt-1.5 max-w-2xl text-sm leading-6 text-white/45">
                  Orvexa uses cookies to keep the platform secure, improve your
                  experience, and understand how our services are being used.
                </p>
              </div>
            </div>

            {/* Privacy */}
            <div className="mt-5 flex items-center gap-2 text-xs text-white/30">
              <ShieldCheck size={14} className="text-brand-green" />

              <span>Your privacy matters to us.</span>
            </div>

            {/* Actions */}
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <a
                href="/privacy"
                className="text-center text-sm text-white/40 underline-offset-4 transition hover:text-white hover:underline sm:text-left"
              >
                Privacy Policy
              </a>

              <button
                onClick={acceptCookies}
                className="h-11 rounded-xl bg-brand-green px-7 text-sm font-semibold text-brand-navy shadow-[0_0_30px_rgba(0,220,130,0.12)] transition hover:brightness-110 hover:shadow-[0_0_40px_rgba(0,220,130,0.2)]"
              >
                Accept All
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
