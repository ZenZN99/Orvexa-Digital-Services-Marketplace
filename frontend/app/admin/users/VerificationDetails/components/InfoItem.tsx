"use client";

interface InfoItemProps {
  label: string;
  value: string;
}

export default function InfoItem({ label, value }: InfoItemProps) {
  return (
    <div className="min-w-0">
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/20">
        {label}
      </p>

      <p title={value} className="mt-1 truncate text-sm text-white/55">
        {value}
      </p>
    </div>
  );
}
