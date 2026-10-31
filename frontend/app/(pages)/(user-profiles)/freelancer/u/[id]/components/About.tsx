"use client";

import { IFreelancer } from "@/app/types/freelancer";
import { IUser } from "@/app/types/user";
import React from "react";

interface AboutProps {
  user: IUser | null;
  freelancer: IFreelancer | null;
}

export default function About({ user, freelancer }: AboutProps) {
  return (
    <div className="rounded-4xl border border-white/8 bg-white/2.5 p-6 backdrop-blur-xl sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-green">
        About
      </p>

      <h2 className="mt-2 text-xl font-semibold">About {user?.firstName}</h2>

      <p className="mt-6 max-w-3xl text-[15px] leading-7 text-white/60">
        {freelancer?.about}
      </p>
    </div>
  );
}
