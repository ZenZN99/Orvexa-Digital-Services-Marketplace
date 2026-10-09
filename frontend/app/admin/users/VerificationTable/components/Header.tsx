"use client";

import TableHead from "@/app/admin/components/TableHead";

export default function Header() {
  return (
    <thead>
      <tr className="border-b border-white/[0.07] bg-white/2">
        <TableHead>User</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Submitted</TableHead>
        <TableHead>Rejection Reason</TableHead>
        <TableHead>Account</TableHead>
        <TableHead>Action</TableHead>
      </tr>
    </thead>
  );
}
