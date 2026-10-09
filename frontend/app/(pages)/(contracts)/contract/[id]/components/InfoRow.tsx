"use client";

interface InfoRowProps {
  label: string;
  value: string;
  valueClassName?: string;
}

export default function InfoRow({
  label,
  value,
  valueClassName = "text-white/60",
}: InfoRowProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-xs text-white/25">{label}</span>
      <span className={`text-right text-xs font-medium ${valueClassName}`}>
        {value}
      </span>
    </div>
  );
}
