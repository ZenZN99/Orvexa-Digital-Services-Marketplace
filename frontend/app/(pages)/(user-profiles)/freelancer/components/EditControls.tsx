"use client";

import { Edit3, Save, Sparkles, X } from "lucide-react";
import { useRouter } from "next/navigation";

interface EditControlsProps {
  isEditing: boolean;
  handleEdit: () => void;
  handleCancel: () => void;
  handleSave: () => void;
  saving: boolean;
  hasValidationError: boolean;
}

export default function EditControls({
  isEditing,
  handleEdit,
  handleCancel,
  handleSave,
  saving,
  hasValidationError,
}: EditControlsProps) {
  const router = useRouter();

  const saveDisabled = saving || hasValidationError;

  return (
    <div className="mt-7">
      {!isEditing ? (
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={handleEdit}
            className="group flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 text-sm font-semibold text-white/70 shadow-sm transition-all duration-200 hover:border-white/20 hover:bg-white/10 hover:text-white active:scale-[0.98] sm:w-auto"
          >
            <Edit3
              size={16}
              className="transition-transform duration-200 group-hover:rotate-[-8deg]"
            />
            Edit Profile
          </button>

          <button
            type="button"
            onClick={() => router.push("/create-service")}
            className="group flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand-green px-5 text-sm font-bold text-brand-navy shadow-lg shadow-brand-green/10 transition-all duration-200 hover:brightness-110 hover:shadow-brand-green/20 active:scale-[0.98] sm:w-auto"
          >
            <Sparkles
              size={16}
              className="transition-transform duration-200 group-hover:rotate-12 group-hover:scale-110"
            />
            Create Service
          </button>
        </div>
      ) : (
        <div className="flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={handleCancel}
            className="flex h-11 items-center gap-2 rounded-xl border border-white/10 bg-white/4 px-5 text-sm font-semibold text-white/70 transition hover:bg-white/8 hover:text-white"
          >
            <X size={16} />
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={saveDisabled}
            className={`flex h-11 items-center gap-2 rounded-xl px-6 text-sm font-semibold shadow-lg transition ${
              saveDisabled
                ? "cursor-not-allowed bg-gray-600 text-gray-300 shadow-none"
                : "bg-brand-green text-white shadow-brand-green/10 hover:brightness-110"
            }`}
          >
            <Save size={16} />

            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      )}
    </div>
  );
}
