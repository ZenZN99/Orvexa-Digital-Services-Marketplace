"use client";

interface FilterButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

export default function FilterButton({
  active,
  onClick,
  children,
}: FilterButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-3 py-2 text-xs font-medium transition ${
        active
          ? "bg-brand-green text-brand-navy"
          : "bg-white/4 text-white/40 hover:bg-white/[0.07] hover:text-white/65"
      }`}
    >
      {children}
    </button>
  );
}
