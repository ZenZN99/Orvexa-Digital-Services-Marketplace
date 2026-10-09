import { UserVerificationStatus } from "../types/user-verification";
import { request } from "./request";

export const userVerificationsApi = {
  create: async (profileImage: File, identityDocument: File) => {
    const formData = new FormData();

    formData.append("images", profileImage);
    formData.append("images", identityDocument);

    return request("/api/user-verifications", {
      method: "POST",
      body: formData,
    });
  },

  findPending: async (page = 1, limit = 10) => {
    return request(
      `/api/user-verifications/pending?page=${page}&limit=${limit}`,
    );
  },

  tryAgain: async () => {
    return request("/api/user-verifications/try-again", {
      method: "POST",
    });
  },

  updateStatus: async (
    verificationId: string,
    status: UserVerificationStatus,
    rejectionReason?: string,
  ) => {
    return request(`/api/user-verifications/${verificationId}/status`, {
      method: "PATCH",
      body: JSON.stringify({
        status,
        ...(rejectionReason && { rejectionReason }),
      }),
    });
  },
};
