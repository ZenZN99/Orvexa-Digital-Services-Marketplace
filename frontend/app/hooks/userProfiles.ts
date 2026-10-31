"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { userProfilesApi } from "../apis/user-profiles";

interface LoadingState {
  updating: boolean;
}

export const useUserProfiles = () => {
  const [loading, setLoading] = useState<LoadingState>({
    updating: false,
  });

  const updateProfile = async (bio?: string, avatar?: File, cover?: File) => {
    setLoading((p) => ({
      ...p,
      updating: true,
    }));

    try {
      const res = await userProfilesApi.update(bio, avatar, cover);

      toast.success("Profile updated successfully");

      return res.data;
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : typeof error === "object" &&
              error !== null &&
              "message" in error &&
              typeof error.message === "string"
            ? error.message
            : "Failed to update profile";

      toast.error(message);

      return null;
    } finally {
      setLoading((p) => ({
        ...p,
        updating: false,
      }));
    }
  };

  return {
    loading,
    updateProfile,
  };
};
