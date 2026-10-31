"use client";

interface InfoCardProps {
  label: string;
  value: string;
}

export default function InfoCard({ label, value }: InfoCardProps) {
  return (
    <div className="rounded-xl border border-white/6 bg-white/2 p-3">
      <p className="text-[10px] uppercase tracking-widest text-white/20">
        {label}
      </p>

      <p className="mt-1 text-sm font-medium text-white/60">{value}</p>
    </div>
  );
}
