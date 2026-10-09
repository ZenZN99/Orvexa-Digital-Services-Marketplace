"use client";

interface InfoRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

export default function InfoRow({ icon, label, value }: InfoRowProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="flex items-center gap-2 text-xs text-white/35">
        {icon}
        {label}
      </dt>
      <dd className="text-right text-sm font-medium text-white/70">{value}</dd>
    </div>
  );
}
