"use client";

const ITEMS_PER_PAGE = 9;

function Bone({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-white/6 ${className}`} />;
}

export default function Skeleton() {
  return (
    <div
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
      aria-busy="true"
      aria-label="Loading freelancers"
    >
      {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
        <article
          key={index}
          className="rounded-xl border border-white/6 bg-white/2 p-4"
        >
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <Bone className="h-11 w-11 shrink-0 rounded-full" />

            {/* Name + email */}
            <div className="min-w-0 flex-1">
              <Bone className="h-3.5 w-32 max-w-full rounded-md" />
              <Bone className="mt-2 h-3 w-40 max-w-full rounded-md" />
            </div>

            {/* View Profile button */}
            <Bone className="h-8 w-28 shrink-0 rounded-lg" />
          </div>

          {/* Bio */}
          <div className="mt-3 space-y-2">
            <Bone className="h-3 w-full rounded-md" />
            <Bone className="h-3 w-3/4 rounded-md" />
          </div>
        </article>
      ))}
    </div>
  );
}
