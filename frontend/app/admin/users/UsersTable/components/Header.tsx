"use client";

import { columns } from "../utils/columns";

export default function Header() {
  return (
    <thead>
      <tr className="border-b border-black/10 bg-black/2">
        {columns.map((column) => (
          <th
            key={column.key}
            className={`px-5 py-4 text-xs font-semibold uppercase tracking-wide text-white/45 ${column.align === "right" ? "text-right" : "text-left"}`}
          >
            {column.label}
          </th>
        ))}
      </tr>
    </thead>
  );
}
