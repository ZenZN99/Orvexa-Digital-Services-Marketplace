"use client";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ServiceCategory, ServiceStatus, IService } from "../types/service";
import { ServiceData, servicesApi } from "../apis/services";

interface LoadingState {
  global: boolean;
  myServices: boolean;
  freelancerServices: boolean;
  pending: boolean;
  creating: boolean;
  updating: Record<string, boolean>;
  updatingStatus: Record<string, boolean>;
  deleting: Record<string, boolean>;
}

export const useServices = (
  initialPage: number = 1,
  limit: number = 10,
  search: string = "",
) => {
  const [services, setServices] = useState<IService[]>([]);
  const [myServices, setMyServices] = useState<IService[]>([]);
  const [freelancerServices, setFreelancerServices] = useState<IService[]>([]);
  const [pendingServices, setPendingServices] = useState<IService[]>([]);
  const [service, setService] = useState<IService | null>(null);

  const [page, setPage] = useState(initialPage);
  const [pendingPage, setPendingPage] = useState(initialPage);

  const [pagination, setPagination] = useState({
    page: initialPage,
    limit,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const [pendingPagination, setPendingPagination] = useState({
    page: initialPage,
    limit,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const [loading, setLoading] = useState<LoadingState>({
    global: false,
    myServices: false,
    freelancerServices: false,
    pending: false,
    creating: false,
    updating: {},
    updatingStatus: {},
    deleting: {},
  });

  const fetchServices = useCallback(async () => {
    setLoading((p) => ({
      ...p,
      global: true,
    }));

    try {
      const res = await servicesApi.findAll(page, limit, search);

      setServices(Array.isArray(res.data.services) ? res.data.services : []);

      setPagination(res.data.pagination);

      return res.data.services;
    } catch {
      return [];
    } finally {
      setLoading((p) => ({
        ...p,
        global: false,
      }));
    }
  }, [page, limit, search]);

  const fetchMyServices = useCallback(async () => {
    setLoading((p) => ({
      ...p,
      myServices: true,
    }));

    try {
      const res = await servicesApi.findMe();

      setMyServices(Array.isArray(res.data) ? res.data : []);

      return res.data;
    } catch (error) {
      return [];
    } finally {
      setLoading((p) => ({
        ...p,
        myServices: false,
      }));
    }
  }, []);

  const fetchServicesByFreelancer = useCallback(async (userId: string) => {
    setLoading((p) => ({
      ...p,
      freelancerServices: true,
    }));

    try {
      const res = await servicesApi.findByFreelancer(userId);

      setFreelancerServices(Array.isArray(res.data) ? res.data : []);

      return res.data;
    } catch {
      setFreelancerServices([]);

      return [];
    } finally {
      setLoading((p) => ({
        ...p,
        freelancerServices: false,
      }));
    }
  }, []);

  const fetchPendingServices = useCallback(async () => {
    setLoading((p) => ({
      ...p,
      pending: true,
    }));

    try {
      const res = await servicesApi.findPending(pendingPage, limit);

      setPendingServices(
        Array.isArray(res.data.services) ? res.data.services : [],
      );

      setPendingPagination(res.data.pagination);

      return res.data.services;
    } catch {
      return [];
    } finally {
      setLoading((p) => ({
        ...p,
        pending: false,
      }));
    }
  }, [pendingPage, limit]);

  const fetchServiceById = async (serviceId: string) => {
    try {
      const res = await servicesApi.findOne(serviceId);

      setService(res.data);

      return res.data;
    } catch {
      return null;
    }
  };

  const createService = async (data: ServiceData, images?: File[]) => {
    setLoading((p) => ({
      ...p,
      creating: true,
    }));

    try {
      const res = await servicesApi.create(data, images);

      toast.success("Service created successfully");

      return res.data;
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to create service",
      );

      return null;
    } finally {
      setLoading((p) => ({
        ...p,
        creating: false,
      }));
    }
  };

  const updateService = async (
    serviceId: string,
    data: ServiceData,
    images?: File[],
  ) => {
    setLoading((p) => ({
      ...p,
      updating: {
        ...p.updating,
        [serviceId]: true,
      },
    }));

    try {
      const res = await servicesApi.update(serviceId, data, images);

      toast.success("Service updated successfully");

      return res.data;
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update service",
      );

      return null;
    } finally {
      setLoading((p) => {
        const { [serviceId]: _, ...rest } = p.updating;

        return {
          ...p,
          updating: rest,
        };
      });
    }
  };

  const updateServiceStatus = async (
    serviceId: string,
    status: ServiceStatus,
    reason?: string,
  ) => {
    const snapshot = pendingServices;

    setLoading((p) => ({
      ...p,
      updatingStatus: {
        ...p.updatingStatus,
        [serviceId]: true,
      },
    }));

    setPendingServices((prev) =>
      prev.map((item) =>
        item.id === serviceId
          ? {
              ...item,
              status,
            }
          : item,
      ),
    );

    try {
      const res = await servicesApi.updateStatus(serviceId, status, reason);

      toast.success("Service status updated successfully");

      return res.data;
    } catch (error: any) {
      setPendingServices(snapshot);

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update service status",
      );

      return null;
    } finally {
      setLoading((p) => {
        const { [serviceId]: _, ...rest } = p.updatingStatus;

        return {
          ...p,
          updatingStatus: rest,
        };
      });
    }
  };

  const deleteService = async (serviceId: string) => {
    const snapshot = services;

    setLoading((p) => ({
      ...p,
      deleting: {
        ...p.deleting,
        [serviceId]: true,
      },
    }));

    setServices((prev) => prev.filter((item) => item.id !== serviceId));

    try {
      await servicesApi.destroy(serviceId);

      toast.success("Service deleted successfully");
    } catch (error: any) {
      setServices(snapshot);

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to delete service",
      );
    } finally {
      setLoading((p) => {
        const { [serviceId]: _, ...rest } = p.deleting;

        return {
          ...p,
          deleting: rest,
        };
      });
    }
  };

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const refresh = () => {
    fetchServices();
  };

  return {
    // data
    services,
    myServices,
    freelancerServices,
    pendingServices,
    service,

    pagination,
    pendingPagination,

    page,
    setPage,

    pendingPage,
    setPendingPage,

    // loading
    loading,

    // fetch
    fetchServices,
    fetchMyServices,
    fetchServicesByFreelancer,
    fetchPendingServices,
    fetchServiceById,
    refresh,

    // actions
    createService,
    updateService,
    updateServiceStatus,
    deleteService,
  };
};
