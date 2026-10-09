import { request } from "./request";

export const userProfilesApi = {
  update: async (bio?: string, avatar?: File, cover?: File) => {
    const formData = new FormData();

    if (bio) {
      formData.append("bio", bio);
    }

    if (avatar) {
      formData.append("avatar", avatar);
    }

    if (cover) {
      formData.append("cover", cover);
    }

    return request("/api/user-profiles", {
      method: "PUT",
      body: formData,
    });
  },
};
