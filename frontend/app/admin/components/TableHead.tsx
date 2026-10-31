"use client";

export default function TableHead({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-5 py-3.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-white/30">
      {children}
    </th>
  );
}

