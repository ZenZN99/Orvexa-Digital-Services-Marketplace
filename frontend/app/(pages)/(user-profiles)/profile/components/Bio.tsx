import { IUser } from "@/app/types/user";
import { CheckCircle2, Edit3, Loader2, X } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";

interface BioProps {
  currentUser: IUser;
  isEditingBio: boolean;
  setIsEditingBio: Dispatch<SetStateAction<boolean>>;
  bio: string;
  setBio: Dispatch<SetStateAction<string>>;
  loading: { updating: boolean };
  handleCancelBio: () => void;
  handleSaveBio: () => void;
}

export default function Bio({
  currentUser,
  isEditingBio,
  setIsEditingBio,
  bio,
  setBio,
  loading,
  handleCancelBio,
  handleSaveBio,
}: BioProps) {
  const [bioError, setBioError] = useState("");

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;

    setBio(value);

    if (value.length > 225) {
      setBioError("Bio cannot exceed 225 characters.");
    } else {
      setBioError("");
    }
  };

  const handleSave = () => {
    if (bio.length > 225) {
      setBioError("Bio cannot exceed 225 characters.");
      return;
    }

    setBioError("");
    handleSaveBio();
  };

  const isSaveDisabled = loading.updating || !!bioError;

  return (
    <section className="rounded-3xl border border-white/8 bg-brand-navy/25 p-5 shadow-xl shadow-black/10 backdrop-blur-xl sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-green">
            About you
          </p>

          <h2 className="mt-1.5 text-lg font-semibold">
            Your introduction
          </h2>
        </div>

        {!isEditingBio && (
          <button
            type="button"
            onClick={() => setIsEditingBio(true)}
            className="flex h-9 items-center gap-1.5 rounded-lg border border-white/10 bg-white/4 px-3.5 text-xs font-medium text-white/70 transition hover:bg-white/8 hover:text-white"
          >
            <Edit3 size={13} />
            Edit
          </button>
        )}
      </div>

      {!isEditingBio ? (
        <div className="mt-5">
          {currentUser.profile.bio ? (
            <p className="max-w-3xl text-sm leading-6 text-white/60">
              {currentUser.profile.bio}
            </p>
          ) : (
            <div className="rounded-xl border border-dashed border-white/10 bg-white/2 p-5 text-center">
              <p className="text-xs text-white/40">
                You haven&apos;t added a bio yet.
              </p>

              <button
                type="button"
                onClick={() => setIsEditingBio(true)}
                className="mt-2.5 text-xs font-semibold text-brand-green transition hover:text-brand-green/80"
              >
                Add your bio
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-5">
          <textarea
            value={bio}
            onChange={handleBioChange}
            rows={5}
            placeholder="Tell people a little about yourself..."
            className={`w-full resize-none rounded-xl border bg-black/20 px-4 py-3 text-sm leading-6 text-white outline-none transition focus:ring-4 ${
              bioError
                ? "border-red-500/60 focus:ring-red-500/10"
                : "border-white/10 focus:ring-brand-green/10"
            }`}
          />

          <div className="mt-2.5 flex items-center justify-between">
            <div>
              <span
                className={`text-[11px] ${
                  bioError ? "text-red-400" : "text-white/30"
                }`}
              >
                {bio.length}/225
              </span>

              {bioError && (
                <p className="mt-1 text-xs text-red-400">
                  {bioError}
                </p>
              )}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  handleCancelBio();
                  setBioError("");
                }}
                disabled={loading.updating}
                className="flex h-9 items-center gap-1.5 rounded-lg border border-white/10 px-3.5 text-xs font-medium text-white/60 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                <X size={13} />
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSave}
                disabled={isSaveDisabled}
                className={`flex h-9 items-center gap-1.5 rounded-lg px-4 text-xs font-semibold transition ${
                  isSaveDisabled
                    ? "cursor-not-allowed bg-gray-600 text-gray-300 opacity-60"
                    : "bg-brand-green text-white hover:brightness-110"
                }`}
              >
                {loading.updating ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={13} />
                    Save changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
