"use client";

import Info from "./Info";
import { CalendarDays, CheckCircle2, Clock3, DollarSign } from "lucide-react";
import { formatCurrency, formatDate } from "../../../../utils/helpers";
import { IContract } from "@/app/types/contract";

export default function Information({ contract }: { contract: IContract }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <Info
        icon={DollarSign}
        label="Amount"
        value={formatCurrency(contract.amount)}
      />

      <Info
        icon={Clock3}
        label="Delivery"
        value={`${contract.deliveryDays} days`}
      />

      <Info
        icon={CalendarDays}
        label="Deadline"
        value={formatDate(contract.deadline)}
      />

      <Info icon={CheckCircle2} label="Status" value={contract.status} />
    </div>
  );
}
