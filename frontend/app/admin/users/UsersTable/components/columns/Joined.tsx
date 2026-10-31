"use client";

import { IUser } from "@/app/types/user";
import { formatDate } from "../../utils/formatDate";

export default function Joined({ user }: { user: IUser }) {
  return (
    <td className="px-5 py-4">
      <span className="text-sm text-white/55">
        {formatDate(user.createdAt)}
      </span>
    </td>
  );
}
