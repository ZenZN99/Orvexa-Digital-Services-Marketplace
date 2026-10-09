import { ServiceCategory, ServiceStatus } from "../types/service";
import { request } from "./request";

export interface ServiceData {
  category: ServiceCategory;
  title: string;
  description: string;
  features: string[];
  keywords: string[];
  price: number;
  deliveryDays: number;
}

export const servicesApi = {
  create: async (data: ServiceData, images?: File[]) => {
    const formData = new FormData();

    formData.append("category", data.category);
    formData.append("title", data.title);
    formData.append("description", data.description);

    data.features.forEach((feature) => {
      formData.append("features", feature);
    });

    data.keywords.forEach((keyword) => {
      formData.append("keywords", keyword);
    });

    formData.append("price", String(data.price));
    formData.append("deliveryDays", String(data.deliveryDays));

    images?.forEach((image) => {
      formData.append("images", image);
    });

    return request("/api/services", {
      method: "POST",
      body: formData,
    });
  },

  findAll: async (page = 1, limit = 10, search = "") => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    if (search.trim()) {
      params.set("search", search.trim());
    }

    return request(`/api/services?${params.toString()}`);
  },

  findMe: async () => {
    return request("/api/services/me");
  },

  findByFreelancer: async (userId: string) => {
    return request(`/api/services/freelancer/${userId}`);
  },

  findPending: async (page = 1, limit = 10) => {
    return request(`/api/services/pending?page=${page}&limit=${limit}`);
  },

  findOne: async (serviceId: string) => {
    return request(`/api/services/${serviceId}`);
  },

  update: async (serviceId: string, data: ServiceData, images?: File[]) => {
    const formData = new FormData();

    formData.append("category", data.category);
    formData.append("title", data.title);
    formData.append("description", data.description);

    data.features.forEach((feature) => {
      formData.append("features", feature);
    });

    data.keywords.forEach((keyword) => {
      formData.append("keywords", keyword);
    });

    formData.append("price", String(data.price));
    formData.append("deliveryDays", String(data.deliveryDays));

    images?.forEach((image) => {
      formData.append("images", image);
    });

    return request(`/api/services/${serviceId}`, {
      method: "PUT",
      body: formData,
    });
  },

  updateStatus: async (
    serviceId: string,
    status: ServiceStatus,
    reason?: string,
  ) => {
    const body: {
      status: ServiceStatus;
      reason?: string;
    } = {
      status,
    };

    if (reason) {
      body.reason = reason;
    }

    return request(`/api/services/${serviceId}/status`, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  },

  destroy: async (serviceId: string) => {
    return request(`/api/services/${serviceId}`, {
      method: "DELETE",
    });
  },
};
