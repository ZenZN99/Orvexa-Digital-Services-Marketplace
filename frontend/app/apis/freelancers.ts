import { JobTitle, Skills } from "../types/freelancer";
import { request } from "./request";

export interface FreelancerData {
  jobTitle?: JobTitle;
  about?: string;
  skills?: Skills[];
  website?: string;
}

export const freelancersApi = {
  findMe: async () => request("/api/freelancers"),

  findOne: async (userId: string) => request(`/api/freelancers/${userId}`),

  update: async (data: FreelancerData) =>
    request("/api/freelancers", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};
