"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useUsers } from "@/app/hooks/useUsers";
import { UserRole } from "@/app/types/user";
import Background from "./components/Background";
import Header from "./components/Header";
import Bio from "./components/Bio";
import Account from "./components/Account";
import Role from "./components/Role";
import ProfileSkeleton from "./components/ProfileSkeleton";
import UserNotFound from "@/app/shared/components/UserNotFound";

const ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.ADMIN]: "Admin",
  [UserRole.SUPPORT]: "Support",
  [UserRole.FREELANCER]: "Freelancer",
  [UserRole.CLIENT]: "Client",
};

export default function UserProfilePage() {
  const params = useParams<{ id: string }>();
  const userId = params?.id;

  const { user, fetchUserById } = useUsers();
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!userId) return;

    let active = true;

    setLoading(true);
    setNotFound(false);

    fetchUserById(userId).then((result) => {
      if (!active) return;

      if (!result) setNotFound(true);

      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [userId]);

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (notFound || !user) {
    return <UserNotFound />;
  }

  const roleLabel = ROLE_LABELS[user.role];

  const joinedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : undefined;

  return (
    <main className="pt-20 min-h-screen bg-brand-navy pb-14 text-white">
      <Background />

      <div className="relative mx-auto max-w-6xl px-4 pt-6 sm:px-5 lg:px-6">
        <Header user={user} joinedDate={joinedDate} roleLabel={roleLabel} />

        <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_280px]">
          <Bio user={user} />

          <aside className="space-y-5">
            <Account user={user} />

            <Role user={user} roleLabel={roleLabel} />
          </aside>
        </div>
      </div>
    </main>
  );
}
