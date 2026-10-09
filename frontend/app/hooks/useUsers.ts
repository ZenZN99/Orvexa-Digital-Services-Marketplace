"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { IUser, UserRole } from "../types/user";
import { usersApi } from "../apis/users";

interface LoadingState {
  global: boolean;
  updatingRole: Record<string, boolean>;
  deleting: Record<string, boolean>;
}

export const useUsers = (initialPage: number = 1, limit: number = 10) => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [user, setUser] = useState<IUser | null>(null);

  const [page, setPage] = useState(initialPage);

  const [pagination, setPagination] = useState({
    page: initialPage,
    limit,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const [loading, setLoading] = useState<LoadingState>({
    global: false,
    updatingRole: {},
    deleting: {},
  });

  const fetchUsers = useCallback(async () => {
    setLoading((p) => ({
      ...p,
      global: true,
    }));

    try {
      const res = await usersApi.findAll(page, limit);

      setUsers(Array.isArray(res.data.users) ? res.data.users : []);

      setPagination(res.data.pagination);

      return res.data.users;
    } catch {
    } finally {
      setLoading((p) => ({
        ...p,
        global: false,
      }));
    }
  }, [page, limit]);

  const fetchUserById = useCallback(async (userId: string) => {
    try {
      const res = await usersApi.findOne(userId);

      setUser(res.data);

      return res.data;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const updateUserRole = async (userId: string, role: UserRole) => {
    const snapshot = users;

    setLoading((p) => ({
      ...p,
      updatingRole: {
        ...p.updatingRole,
        [userId]: true,
      },
    }));

    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? {
              ...u,
              role,
            }
          : u,
      ),
    );

    try {
      const res = await usersApi.updateRole(userId, role);

      toast.success("User role updated");

      return res.data;
    } catch (error: any) {
      setUsers(snapshot);

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update user role,",
      );

      return null;
    } finally {
      setLoading((p) => {
        const { [userId]: _, ...rest } = p.updatingRole;

        return {
          ...p,
          updatingRole: rest,
        };
      });
    }
  };

  const blockUserById = async (userId: string) => {
    const snapshot = users;

    setLoading((p) => ({
      ...p,
      deleting: {
        ...p.deleting,
        [userId]: true,
      },
    }));

    setUsers((prev) => prev.filter((u) => u.id !== userId));

    try {
      await usersApi.block(userId);

      toast.success("User blocked successfully");
    } catch (error: any) {
      setUsers(snapshot);

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to block user",
      );
    } finally {
      setLoading((p) => {
        const { [userId]: _, ...rest } = p.deleting;

        return {
          ...p,
          deleting: rest,
        };
      });
    }
  };

  const refresh = () => {
    fetchUsers();
  };

  return {
    // data
    users,
    user,

    pagination,
    page,
    setPage,

    // loading
    loading,

    // fetch
    fetchUsers,
    fetchUserById,
    refresh,

    // actions
    updateUserRole,
    blockUserById,
  };
};
