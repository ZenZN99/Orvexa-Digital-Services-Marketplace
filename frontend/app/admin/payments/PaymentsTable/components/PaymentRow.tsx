"use client";

import { IPayment } from "@/app/types/payment";
import Payment from "./columns/Payment";
import User from "./columns/User";
import Amount from "./columns/Amount";
import Status from "./columns/Status";
import PaidAt from "./columns/PaidAt";
import Created from "./columns/Created";
import Updated from "./columns/Updated";

export default function PaymentRow({ payment }: { payment: IPayment }) {
  return (
    <tr className="border-b border-white/5 transition-colors last:border-0 hover:bg-white/2.5">
      <Payment payment={payment} />

      <User payment={payment} />

      <Amount payment={payment} />

      <Status payment={payment} />

      <PaidAt payment={payment} />

      <Created payment={payment} />

      <Updated payment={payment} />
    </tr>
  );
}
