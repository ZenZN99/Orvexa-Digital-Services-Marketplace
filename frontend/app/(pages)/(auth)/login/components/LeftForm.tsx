"use client";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import Link from "next/link";
import { INPUT_CLASS } from "../../register/constants/register.constant";
import { LoginData } from "@/app/apis/auth";
import { SetStateAction } from "react";

interface LeftForm {
  errorMessage: string;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  form: LoginData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showPassword: boolean;
  setShowPassword: React.Dispatch<SetStateAction<boolean>>;
  loading: boolean;
}

export default function LeftForm({
  errorMessage,
  handleSubmit,
  form,
  handleChange,
  showPassword,
  setShowPassword,
  loading,
}: LeftForm) {
  return (
    <section className="flex w-full items-center justify-center px-5 py-6 sm:px-8 lg:w-1/2 lg:px-10 xl:px-14">
      <div className="w-full max-w-lg">
        {/* Brand */}
        <div className="mb-7 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <img
              src="/favicon.ico"
              alt="Orvexa"
              className="h-8 w-8 rounded-lg object-contain"
            />

            <span className="text-lg font-bold tracking-tight">Orvexa</span>
          </Link>

          <p className="text-xs text-white/35">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-brand-green transition hover:text-white"
            >
              Sign up
            </Link>
          </p>
        </div>

        {/* Heading */}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Welcome back
          </h1>

          <p className="mt-1.5 text-sm text-white/35">
            Sign in to continue to Orvexa.
          </p>
        </div>

        {/* Error */}
        {errorMessage && (
          <div className="mt-4 rounded-lg border border-red-400/15 bg-red-400/6 px-3.5 py-2.5 text-xs text-red-300">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-[11px] font-medium text-white/45"
            >
              Email address
            </label>

            <div className="relative">
              <Mail
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20"
              />

              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className={`${INPUT_CLASS} h-11 pl-9 text-sm`}
              />
            </div>
          </div>

          {/* Password */}
          <div className="mt-3">
            <div className="mb-1.5 flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-[11px] font-medium text-white/45"
              >
                Password
              </label>

              <Link
                href="/forgot-password"
                className="text-[11px] font-medium text-brand-green transition hover:text-white"
              >
                Forgot password?
              </Link>
            </div>

            <div className="relative">
              <LockKeyhole
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20"
              />

              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                className={`${INPUT_CLASS} h-11 pl-9 pr-11 text-sm`}
              />

              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 transition hover:text-white/60"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="group mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand-green text-sm font-semibold text-brand-navy shadow-[0_0_30px_rgba(0,220,130,0.08)] transition-all duration-300 hover:brightness-110 hover:shadow-[0_0_40px_rgba(0,220,130,0.15)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-brand-navy/30 border-t-brand-navy" />
                Signing in...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </>
            )}
          </button>

          {/* Terms */}
          <p className="mt-3 text-center text-[10px] leading-4 text-white/20">
            By signing in, you agree to Orvexa&apos;s{" "}
            <Link
              href="/terms"
              className="text-white/40 underline underline-offset-2 transition hover:text-brand-green"
            >
              Terms
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="text-white/40 underline underline-offset-2 transition hover:text-brand-green"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </form>
      </div>
    </section>
  );
}
