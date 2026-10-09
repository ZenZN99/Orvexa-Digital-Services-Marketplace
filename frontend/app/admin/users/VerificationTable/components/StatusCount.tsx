export default function StatusCount({
  label,
  value,
  className,
}: {
  label: string;
  value: number;
  className: string;
}) {
  return (
    <span className="flex items-center gap-1.5 text-xs text-white/30">
      <span className={`font-medium ${className}`}>{value}</span>

      <span>{label}</span>
    </span>
  );
}
