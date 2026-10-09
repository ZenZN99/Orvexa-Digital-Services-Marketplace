"use client";

export default function Header() {
  return (
    <div className="mb-8 flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl">
        <img src="/favicon.ico" alt="" />
      </div>
      <div>
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
          Edit service
        </h1>
        <p className="mt-1 text-sm text-white/45">
          Update your service details. After saving, it will be reviewed again
          by our team.
        </p>
      </div>
    </div>
  );
}
