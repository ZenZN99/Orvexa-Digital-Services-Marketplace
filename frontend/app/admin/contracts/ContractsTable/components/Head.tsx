"use client";

import TableHead from "@/app/admin/components/TableHead";

export default function Head() {
  return (
    <thead>
      <tr className="border-b border-white/[0.07] bg-white/2">
        <TableHead>Contract</TableHead>
        <TableHead>Order</TableHead>
        <TableHead>Freelancer</TableHead>
        <TableHead>Client</TableHead>
        <TableHead>Amount</TableHead>
        <TableHead>Delivery</TableHead>
        <TableHead>Deadline</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Created</TableHead>
      </tr>
    </thead>
  );
}
