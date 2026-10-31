"use client";

import { createPortal } from "react-dom";
import { IOrder } from "@/app/types/order";
import { IUser } from "@/app/types/user";
import Header from "./components/Header";
import User from "./components/User";
import Information from "./components/Information";
import Services from "./components/Services";

interface OrderModalProps {
  order: IOrder;
  client: IUser;
  onClose: () => void;
}

export default function OrderModal({
  order,
  onClose,
  client,
}: OrderModalProps) {
  const services = order?.services ?? [];

  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-2xl border border-white/8 bg-brand-navy shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <Header onClose={onClose} />

        <div className="space-y-5 p-5">
          <User client={client} />

          <Information order={order} />

          <Services services={services} />
        </div>
      </div>
    </div>,
    document.body,
  );
}
