"use client";

import { JobTitle, Skills } from "@/app/types/freelancer";
import { IUser } from "@/app/types/user";

export interface EditForm {
  jobTitle: JobTitle | null;
  about: string;
  website: string;
  skills: Skills[];
}

interface JobTitleProps {
  isEditing: boolean;
  user: IUser;
  editForm: EditForm;
  setEditForm: React.Dispatch<React.SetStateAction<EditForm>>;
}

export default function JobTitleField({
  isEditing,
  user,
  editForm,
  setEditForm,
}: JobTitleProps) {
  return (
    <div>
      {!isEditing ? (
        <p className="mt-2 text-sm text-white/45">{user.freelancer.jobTitle}</p>
      ) : (
        <select
          value={editForm.jobTitle as JobTitle}
          onChange={(event) =>
            setEditForm((current) => ({
              ...current,
              jobTitle: event.target.value as JobTitle,
            }))
          }
          className="mt-3 rounded-xl border border-white/10 bg-brand-navy px-4 py-2 text-sm text-white outline-none"
        >
          {Object.values(JobTitle).map((title) => (
            <option key={title} value={title}>
              {title}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
