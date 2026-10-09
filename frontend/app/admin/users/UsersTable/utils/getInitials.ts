import { IUser } from "@/app/types/user";

export const getInitials = (user: IUser) => {
  return `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase();
};
