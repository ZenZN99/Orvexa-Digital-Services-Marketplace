"use client";

import { IService } from "@/app/types/service";
import Freelancer from "./Freelancer";
import Status from "./Status";
import Info from "./Info";
import ViewDetails from "./ViewDetails";
import Actions from "./Actions";

interface ServiceRowProps {
  service: IService;
  onViewDetails: (service: IService) => void;
}

export default function ServiceRow({
  service,
  onViewDetails,
}: ServiceRowProps) {
  return (
    <tr className="border-b border-white/5 transition-colors last:border-0 hover:bg-white/2.5">
      <Info service={service} />

      <Freelancer service={service} />

      <Status service={service} />

      <ViewDetails onView={() => onViewDetails(service)} />

      <Actions service={service} />
    </tr>
  );
}
