"use client";

function Bone({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-white/6 ${className}`} />;
}

export default function NavbarSkeleton() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4" aria-hidden="true">
      <nav className="mx-auto flex h-17 max-w-7xl items-center justify-between rounded-2xl border border-white/8 bg-brand-navy/80 px-4 shadow-2xl shadow-black/20 backdrop-blur-2xl md:px-5">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <Bone className="h-9 w-9 rounded-xl" />
          <Bone className="h-5 w-20 rounded-md" />
        </div>

        {/* Navigation (lg+) */}
        <div className="hidden flex-1 justify-center lg:flex">
          <div className="flex items-center gap-1">
            <Bone className="h-8 w-20 rounded-xl" />
            <Bone className="h-8 w-16 rounded-xl" />
            <Bone className="h-8 w-24 rounded-xl" />
            <Bone className="h-8 w-16 rounded-xl" />
            <Bone className="h-8 w-20 rounded-xl" />
          </div>
        </div>

        {/* Actions (md+) */}
        <div className="hidden items-center gap-2 md:flex">
          {/* Bell */}
          <Bone className="h-10 w-10 rounded-xl" />

          {/* Cart / role button */}
          <Bone className="h-10 w-10 rounded-xl" />

          {/* Avatar + name */}
          <div className="flex h-10 items-center gap-2 px-2.5">
            <Bone className="h-10 w-10 rounded-full" />
            <Bone className="h-4 w-16 rounded-md" />
          </div>

          {/* Logout */}
          <Bone className="h-10 w-20 rounded-xl" />
        </div>

        {/* Mobile toggle (< md) */}
        <Bone className="h-10 w-10 rounded-xl md:hidden" />
      </nav>
    </header>
  );
}
