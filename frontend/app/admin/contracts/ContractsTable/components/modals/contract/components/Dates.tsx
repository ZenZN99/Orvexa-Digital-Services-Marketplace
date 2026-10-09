"use client";
import Info from "./Info";
import { CalendarDays, CheckCircle2 } from "lucide-react";
import { formatDate } from "../../../../utils/helpers";
import { IContract } from "@/app/types/contract";

export default function Dates({ contract }: { contract: IContract }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <Info
        icon={CalendarDays}
        label="Created"
        value={formatDate(contract.createdAt)}
      />

      <Info
        icon={CheckCircle2}
        label="Delivered"
        value={
          contract.deliveredAt
            ? formatDate(contract.deliveredAt)
            : "Not delivered"
        }
      />

      <Info
        icon={CheckCircle2}
        label="Completed"
        value={
          contract.completedAt
            ? formatDate(contract.completedAt)
            : "Not completed"
        }
      />
    </div>
  );
}
