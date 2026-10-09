"use client";

import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  User,
} from "lucide-react";
import { INPUT_CLASS, ROLE_OPTIONS } from "../constants/register.constant";
import { RegisterData } from "@/app/apis/auth";
import PasswordStrengthMeter from "./PasswordStrengthMeter";
import { SetStateAction } from "react";
import Image from "next/image";
import Link from "next/link";

interface LeftForm {
  errorMessage: string;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  form: RegisterData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showPassword: boolean;
  setShowPassword: React.Dispatch<SetStateAction<boolean>>;
  setForm: (from: RegisterData) => void;
  loading: boolean;
}

export default function LeftForm({
  errorMessage,
  handleSubmit,
  form,
  handleChange,
  showPassword,
  setShowPassword,
  setForm,
  loading,
}: LeftForm) {
  return (
    <section className="flex w-full items-center justify-center px-5 py-6 sm:px-8 lg:w-1/2 lg:px-10 xl:px-14">
      <div className="w-full max-w-lg">
        {/* Brand */}
        <div className="mb-7 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/favicon.ico"
              width={32}
              height={32}
              priority
              alt="Orvexa"
              className="h-8 w-8 rounded-lg object-contain"
            />

            <span className="text-lg font-bold tracking-tight">Orvexa</span>
          </Link>

          <p className="text-xs text-white/35">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-brand-green transition hover:text-white"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Heading */}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Create your account
          </h1>

          <p className="mt-1.5 text-sm text-white/35">
            Join Orvexa and start building great work.
          </p>
        </div>

        {/* Error */}
        {errorMessage && (
          <div className="mt-4 rounded-lg border border-red-400/15 bg-red-400/6 px-3.5 py-2.5 text-xs text-red-300">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6">
          {/* Name */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="firstName"
                className="mb-1.5 block text-[11px] font-medium text-white/45"
              >
                First name
              </label>

              <div className="relative">
                <User
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20"
                />

                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  required
                  className={`${INPUT_CLASS} h-11 pl-9 text-sm`}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="mb-1.5 block text-[11px] font-medium text-white/45"
              >
                Last name
              </label>

              <div className="relative">
                <User
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20"
                />

                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  required
                  className={`${INPUT_CLASS} h-11 pl-9 text-sm`}
                />
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="mt-3">
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
            <label
              htmlFor="password"
              className="mb-1.5 block text-[11px] font-medium text-white/45"
            >
              Password
            </label>

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
                placeholder="Create a strong password"
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

            <PasswordStrengthMeter password={form.password} />
          </div>

          {/* Role */}
          <div className="mt-5">
            <label className="mb-2 block text-[11px] font-medium text-white/45">
              How will you use Orvexa?
            </label>

            <div className="grid grid-cols-2 gap-3">
              {ROLE_OPTIONS.map((option) => {
                const Icon = option.icon;
                const isActive = form.role === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      setForm({
                        ...form,
                        role: option.value,
                      })
                    }
                    className={`relative flex items-center gap-3 rounded-xl border px-3.5 py-3 text-left transition-all duration-200 ${
                      isActive
                        ? "border-brand-green/40 bg-brand-green/[0.07]"
                        : "border-white/8 bg-white/2 hover:border-white/[0.14] hover:bg-white/[0.035]"
                    }`}
                  >
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                        isActive
                          ? "bg-brand-green text-brand-navy"
                          : "bg-white/5 text-white/40"
                      }`}
                    >
                      <Icon size={17} />
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-xs font-semibold text-white">
                        {option.title}
                      </h3>

                      <p className="mt-0.5 truncate text-[10px] text-white/30">
                        {option.description}
                      </p>
                    </div>

                    {isActive && (
                      <span className="absolute right-2.5 top-2.5 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-brand-green text-brand-navy">
                        <Check size={10} strokeWidth={3} />
                      </span>
                    )}
                  </button>
                );
              })}
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
                Creating account...
              </>
            ) : (
              <>
                Create Account
                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </>
            )}
          </button>

          {/* Terms */}
          <p className="mt-3 text-center text-[10px] leading-4 text-white/20">
            By creating an account, you agree to Orvexa&apos;
            <Link
              href="/terms"
              className="text-white/40 underline underline-offset-2 transition hover:text-brand-green"
            >
              Terms {" "}
            </Link>
            and {" "}
            <Link
              href="/privacy"
              className="text-white/40 underline underline-offset-2 transition hover:text-brand-green"
            >
               Privacy Policy {" "}
            </Link>
            .
          </p>
        </form>
      </div>
    </section>
  );
}
