import { request } from "./request";

export interface ReviewData {
  comment: string;
  rating: number;
}

export const reviewsApi = {
  create: async (contractId: string, data: ReviewData) => {
    return request(`/api/reviews/${contractId}`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  findMe: (page = 1, limit = 10) => {
    return request(`/api/reviews/me?page=${page}&limit=${limit}`);
  },

  findByFreelancer: (freelancerId: string, page = 1, limit = 10) => {
    return request(
      `/api/reviews/freelancer/${freelancerId}?page=${page}&limit=${limit}`,
    );
  },

  findAllByService: async (serviceId: string, page = 1, limit = 10) => {
    return request(`/api/reviews/all/${serviceId}?page=${page}&limit=${limit}`);
  },

  findOne: async (reviewId: string) => {
    return request(`/api/reviews/${reviewId}`);
  },
};
