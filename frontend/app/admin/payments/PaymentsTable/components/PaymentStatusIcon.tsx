"use client";

import { PaymentStatus } from "@/app/types/payment";
import {
  CheckCircle2,
  Clock3,
  CreditCard,
  RotateCcw,
  XCircle,
} from "lucide-react";

export function PaymentStatusIcon({ status }: { status: PaymentStatus }) {
  switch (status) {
    case PaymentStatus.COMPLETED:
      return <CheckCircle2 size={16} />;

    case PaymentStatus.FAILED:
      return <XCircle size={16} />;

    case PaymentStatus.REFUNDED:
      return <RotateCcw size={16} />;

    case PaymentStatus.PENDING:
      return <Clock3 size={16} />;

    default:
      return <CreditCard size={16} />;
  }
}
