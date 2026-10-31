"use client";

interface ContractMetaProps {
  label: string;
  value: string;
}

export default function ContractMeta({ label, value }: ContractMetaProps) {
  return (
    <div className="rounded-xl border border-white/6 bg-white/2 px-4 py-3">
      <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-white/25">
        {label}
      </p>

      <p className="mt-1 truncate text-sm font-medium text-white/65">{value}</p>
    </div>
  );
}
