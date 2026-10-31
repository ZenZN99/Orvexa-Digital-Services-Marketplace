"use client";

export default function TableCell({ children }: { children: React.ReactNode }) {
  return <td className="px-5 py-4 align-middle">{children}</td>;
}
