"use client";

interface TableCellProps {
  children: React.ReactNode;
  onClick?: () => void;
  clickable?: boolean;
}

export default function TableCell({
  children,
  onClick,
  clickable,
}: TableCellProps) {
  return (
    <td
      onClick={onClick}
      className={`px-5 py-4 align-middle ${clickable ? "cursor-pointer" : ""}`}
    >
      {children}
    </td>
  );
}
