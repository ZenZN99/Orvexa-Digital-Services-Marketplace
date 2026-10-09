"use client";


export default function Header() {
  return (
    <section className="border-b border-white/6">
      <div className="mx-auto max-w-7xl px-6 pb-10 pt-28 sm:px-10 lg:px-12">
        <div className="max-w-3xl">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-green">
            Marketplace
          </span>

          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            Find the right service
            <span className="text-brand-green"> for your next idea.</span>
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-white/40 sm:text-lg">
            Explore services from talented professionals and find the expertise
            you need to move your project forward.
          </p>
        </div>
      </div>
    </section>
  );
}
