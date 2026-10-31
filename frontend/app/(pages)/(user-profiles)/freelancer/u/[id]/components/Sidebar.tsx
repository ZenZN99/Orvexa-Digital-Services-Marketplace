"use client";

import { IFreelancer } from "@/app/types/freelancer";
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

interface SidebarProps {
  freelancer: IFreelancer | null;
  user: IUser | null;
  joinedDate?: string;
}

export default function Sidebar({
  freelancer,
  user,
  joinedDate,
}: SidebarProps) {
  const router = useRouter();
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
                {freelancer?.jobTitle}
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
                {user?.email}
              </p>
            </div>
          </div>

          {/* Website */}
          {freelancer?.website && (
            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 text-white/60">
                <Globe size={18} />
              </div>

              <div className="min-w-0">
                <p className="text-xs text-white/35">Website</p>

                <a
                  href={freelancer.website}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 flex items-center gap-1 text-sm font-medium text-brand-green hover:underline"
                >
                  Visit website
                  <ExternalLink size={13} />
                </a>
              </div>
            </div>
          )}

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

        {/* Contact */}
        <button
          onClick={() => router.push(`/profile/u/${user?.id}`)}
          className="mt-7 flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/4 text-sm font-semibold text-white/60 transition hover:border-brand-green/20 hover:text-brand-green"
        >
          <MessageCircle size={17} />
          View Public Profile
        </button>
      </div>
    </aside>
  );
}
