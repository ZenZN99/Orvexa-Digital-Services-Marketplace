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
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update profile",
      );

      return null;
    } finally {
      setLoading((p) => ({
        ...p,
        updating: false,
      }));
    }
  };

  return {
    // loading
    loading,

    // actions
    updateProfile,
  };
};
