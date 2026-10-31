"use client";

import { IUser } from "@/app/types/user";
import {
  BriefcaseBusiness,
  CalendarDays,
  ExternalLink,
  Globe,
  Mail,
  MapPin,
  MessageCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { EditForm } from "./JobTitleField";
import { ReactNode } from "react";

interface SidebarProps {
  user: IUser;
  isEditing: boolean;
  editForm: EditForm;
  joinedDate: ReactNode;
  setEditForm: React.Dispatch<React.SetStateAction<EditForm>>;
  websiteError: string;
  setWebsiteError: React.Dispatch<React.SetStateAction<string>>;
}

export default function Sidebar({
  user,
  isEditing,
  editForm,
  joinedDate,
  setEditForm,
  websiteError,
  setWebsiteError,
}: SidebarProps) {
  const router = useRouter();

  const validateWebsite = (value: string) => {
    if (!value.trim()) {
      setWebsiteError("");
      return;
    }

    try {
      const url = new URL(value);

      if (url.protocol !== "http:" && url.protocol !== "https:") {
        setWebsiteError("Please enter a valid website URL.");
        return;
      }

      setWebsiteError("");
    } catch {
      setWebsiteError("Please enter a valid website URL.");
    }
  };

  const handleWebsiteChange = (value: string) => {
    setEditForm((current) => ({
      ...current,
      website: value,
    }));

    validateWebsite(value);
  };

  return (
    <aside>
      <div className="rounded-4xl border border-white/8 bg-white/2.5 p-6 backdrop-blur-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/30">
          Freelancer information
        </p>

        <div className="mt-6 space-y-5">
          {/* Job title */}
          <div className="flex gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-green/10 text-brand-green">
              <BriefcaseBusiness size={18} />
            </div>

            <div>
              <p className="text-xs text-white/35">Job title</p>

              <p className="mt-1 text-sm font-medium text-white">
                {user.freelancer.jobTitle}
              </p>
            </div>
          </div>

          {/* Email */}
          <div className="flex gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 text-white/60">
              <Mail size={18} />
            </div>

            <div className="min-w-0">
              <p className="text-xs text-white/35">Contact</p>

              <p className="mt-1 truncate text-sm font-medium text-white">
                {user.email}
              </p>
            </div>
          </div>

          {/* Website */}
          <div className="flex gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 text-white/60">
              <Globe size={18} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs text-white/35">Website</p>

              {!isEditing ? (
                user.freelancer.website ? (
                  <a
                    href={user.freelancer.website}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 flex items-center gap-1 text-sm font-medium text-brand-green hover:underline"
                  >
                    Visit website
                    <ExternalLink size={13} />
                  </a>
                ) : (
                  <p className="mt-1 text-sm text-white/30">Not added</p>
                )
              ) : (
                <div className="mt-2">
                  <input
                    value={editForm.website}
                    onChange={(event) =>
                      handleWebsiteChange(event.target.value)
                    }
                    placeholder="https://example.com"
                    className={`h-10 w-full rounded-xl border bg-black/20 px-3 text-sm text-white outline-none transition ${
                      websiteError
                        ? "border-red-500/60 focus:ring-4 focus:ring-red-500/10"
                        : "border-white/10 focus:ring-4 focus:ring-brand-green/10"
                    }`}
                  />

                  {websiteError && (
                    <p className="mt-1.5 text-xs text-red-400">
                      {websiteError}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="flex gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 text-white/60">
              <MapPin size={18} />
            </div>

            <div>
              <p className="text-xs text-white/35">Location</p>

              <p className="mt-1 text-sm font-medium text-white">
                Available worldwide
              </p>
            </div>
          </div>

          {/* Joined */}
          {joinedDate && (
            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 text-white/60">
                <CalendarDays size={18} />
              </div>

              <div>
                <p className="text-xs text-white/35">Member since</p>

                <p className="mt-1 text-sm font-medium text-white">
                  {joinedDate}
                </p>
              </div>
            </div>
          )}
        </div>

        {!isEditing && (
          <button
            type="button"
            onClick={() => router.push("/profile")}
            className="mt-7 flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/4 text-sm font-semibold text-white/60 transition hover:border-brand-green/20 hover:text-brand-green"
          >
            <MessageCircle size={17} />
            View Public Profile
          </button>
        )}
      </div>
    </aside>
  );
}
