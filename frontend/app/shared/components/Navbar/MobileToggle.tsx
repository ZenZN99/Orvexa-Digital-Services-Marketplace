"use client";

import { Menu, X } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

interface MobileToggleProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export default function MobileToggle({ open, setOpen }: MobileToggleProps) {
  return (
    <button
      onClick={() => setOpen((value) => !value)}
      className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/8 bg-white/2.5 text-white md:hidden"
    >
      {open ? <X size={19} /> : <Menu size={19} />}
    </button>
  );
}
