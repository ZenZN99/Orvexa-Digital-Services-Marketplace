"use client";

interface FilterButtonProps {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}

export default function FilterButton({
  children,
  active,
  onClick,
}: FilterButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl border px-3.5 py-2 text-xs font-medium transition ${
        active
          ? "bg-brand-green text-white border-brand-green/20"
          : "border-brand-green/20 bg-brand-green/10 text-brand-green"
      }`}
    >
      {children}
    </button>
  );
}
