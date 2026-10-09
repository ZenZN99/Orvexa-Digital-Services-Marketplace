"use client";

import { IUser } from "@/app/types/user";
import React from "react";
import { EditForm } from "./JobTitleField";

interface AboutProps {
  isEditing: boolean;
  user: IUser;
  editForm: EditForm;
  setEditForm: React.Dispatch<React.SetStateAction<EditForm>>;
  aboutError: string;
  handleAboutChange: (value: string) => void;
}

export default function About({
  isEditing,
  user,
  editForm,
  aboutError,
  handleAboutChange,
}: AboutProps) {
  return (
    <div className="rounded-4xl border border-white/8 bg-white/2.5 p-6 backdrop-blur-xl sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-green">
            About
          </p>

          <h2 className="mt-2 text-xl font-semibold">About {user.firstName}</h2>
        </div>
      </div>

      {!isEditing ? (
        <p className="mt-6 max-w-3xl text-[15px] leading-7 text-white/60">
          {user.freelancer.about}
        </p>
      ) : (
        <div className="mt-6">
          <textarea
            value={editForm.about}
            onChange={(event) => handleAboutChange(event.target.value)}
            rows={7}
            placeholder="Tell clients about yourself..."
            className={`w-full resize-none rounded-2xl border bg-black/20 px-5 py-4 text-sm leading-7 text-white outline-none transition focus:ring-4 ${
              aboutError
                ? "border-red-500/60 focus:ring-red-500/10"
                : "border-white/10 focus:ring-brand-green/10"
            }`}
          />

          <div className="mt-2 flex items-start justify-between gap-4">
            <div>
              {aboutError && (
                <p className="text-xs text-red-400">{aboutError}</p>
              )}
            </div>

            <p
              className={`text-xs ${
                aboutError ? "text-red-400" : "text-white/25"
              }`}
            >
              {editForm.about.length}/500
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
