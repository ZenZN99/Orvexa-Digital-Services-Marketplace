"use client";

import { useUserProfiles } from "@/app/hooks/userProfiles";
import { useAuthStore } from "@/app/stores/useAuthStore";
import { UserRole } from "@/app/types/user";
import { useRef, useState } from "react";
import Background from "./components/Background";
import Header from "./components/Header";
import Bio from "./components/Bio";
import Account from "./components/Account";
import Role from "./components/Role";
import Loading from "./u/[id]/components/ProfileSkeleton";
import ProtectedRoute from "@/app/config/routes/ProtectedRoute";

const ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.ADMIN]: "Admin",
  [UserRole.SUPPORT]: "Support",
  [UserRole.FREELANCER]: "Freelancer",
  [UserRole.CLIENT]: "Client",
};

export default function ProfilePage() {
  const { currentUser, setUser } = useAuthStore();
  const { loading, updateProfile } = useUserProfiles();

  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bio, setBio] = useState(currentUser?.profile.bio ?? "");
  const [uploadingField, setUploadingField] = useState<
    "avatar" | "cover" | null
  >(null);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  if (!currentUser) {
    return <Loading />;
  }

  const roleLabel = ROLE_LABELS[currentUser.role];

  const joinedDate = currentUser.createdAt
    ? new Date(currentUser.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : undefined;

  const handleSaveBio = async () => {
    const updated = await updateProfile(bio);

    if (updated) {
      setUser({
        ...currentUser,
        profile: {
          ...currentUser.profile,
          bio: updated.bio ?? bio,
        },
      });
    }

    setIsEditingBio(false);
  };

  const handleCancelBio = () => {
    setBio(currentUser.profile.bio);
    setIsEditingBio(false);
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploadingField("avatar");
    const updated = await updateProfile(undefined, file);

    if (updated) {
      setUser({
        ...currentUser,
        profile: {
          ...currentUser.profile,
          avatar: updated.avatar ?? currentUser.profile.avatar,
        },
      });
    }

    setUploadingField(null);
  };

  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploadingField("cover");
    const updated = await updateProfile(undefined, undefined, file);

    if (updated) {
      setUser({
        ...currentUser,
        profile: {
          ...currentUser.profile,
          cover: updated.cover ?? currentUser.profile.cover,
        },
      });
    }

    setUploadingField(null);
  };

  return (
    <ProtectedRoute>
      <main className="pt-20 min-h-screen bg-brand-navy pb-14 text-white">
        <input
          ref={avatarInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleAvatarChange}
        />

        <input
          ref={coverInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleCoverChange}
        />

        <Background />

        <div className="relative mx-auto max-w-6xl px-4 pt-6 sm:px-5 lg:px-6">
          <Header
            currentUser={currentUser}
            loading={loading}
            uploadingField={uploadingField}
            avatarInputRef={avatarInputRef}
            coverInputRef={coverInputRef}
            roleLabel={roleLabel}
            joinedDate={joinedDate}
          />

          <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_280px]">
            <Bio
              currentUser={currentUser}
              isEditingBio={isEditingBio}
              setIsEditingBio={setIsEditingBio}
              bio={bio}
              setBio={setBio}
              loading={loading}
              handleCancelBio={handleCancelBio}
              handleSaveBio={handleSaveBio}
            />

            <aside className="space-y-5">
              <Account currentUser={currentUser} />

              <Role currentUser={currentUser} roleLabel={roleLabel} />
            </aside>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
