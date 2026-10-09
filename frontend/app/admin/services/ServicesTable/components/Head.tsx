"use client";

import TableHead from "@/app/admin/components/TableHead";

export default function Head() {
  return (
    <thead>
      <tr className="border-b border-white/[0.07] bg-white/2">
        <TableHead>Service</TableHead>
        <TableHead>Freelancer</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Details</TableHead>
        <TableHead>Actions</TableHead>
      </tr>
    </thead>
  );
}
