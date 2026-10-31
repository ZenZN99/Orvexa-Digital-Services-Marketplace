"use client";

import NavLink from "./NavLink";
import { UserRole } from "@/app/types/user";

interface NavigationProps {
  isLoggedIn: boolean;
  role?: UserRole;
}

interface NavigationLink {
  href: string;
  label: string;
}

export const links: Partial<Record<UserRole, NavigationLink[]>> = {
  [UserRole.CLIENT]: [
    { href: "/services", label: "Services" },
    { href: "/experts", label: "Experts" },
    { href: "/contracts", label: "Contracts" },
    { href: "/orders", label: "Orders" },
    { href: "/payments", label: "Payments" },
    { href: "/support", label: "Support" },
  ],

  [UserRole.FREELANCER]: [
    { href: "/services", label: "Services" },
    { href: "/contracts", label: "Contracts" },
    { href: "/support", label: "Support" },
  ],

  [UserRole.SUPPORT]: [
    { href: "/services", label: "Services" },
    { href: "/experts", label: "Experts" },
    { href: "/support", label: "Support" },
  ],

  [UserRole.ADMIN]: [
    { href: "/services", label: "Services" },
    { href: "/experts", label: "Experts" },
    { href: "/support", label: "Support" },
  ],
};

export default function Navigation({ isLoggedIn, role }: NavigationProps) {
  if (!isLoggedIn) {
    return (
      <div className="hidden flex-1 justify-center lg:flex">
        <div className="flex items-center gap-1">
          <NavLink href="/privacy">Privacy Policy</NavLink>
          <NavLink href="/terms">Orvexa Terms</NavLink>
          <NavLink href="/cookies">Cookies Policy</NavLink>
        </div>
      </div>
    );
  }

  const roleLinks = role ? (links[role] ?? []) : [];

  return (
    <div className="hidden flex-1 justify-center lg:flex">
      <div className="flex items-center gap-1">
        {roleLinks.map((link) => (
          <NavLink key={link.href} href={link.href}>
            {link.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
