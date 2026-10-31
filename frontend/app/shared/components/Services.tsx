import {
  BriefcaseBusiness,
  CreditCard,
  Headphones,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

const services = [
  {
    icon: BriefcaseBusiness,
    title: "Find Great Talent",
    description:
      "Connect with skilled freelancers ready to bring your ideas to life.",
  },
  {
    icon: Sparkles,
    title: "Sell Your Skills",
    description:
      "Turn your expertise into services and reach clients looking for you.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Transactions",
    description:
      "Keep every transaction protected with a secure payment experience.",
  },
  {
    icon: Users,
    title: "Easy Collaboration",
    description:
      "Work together smoothly with clear communication from start to finish.",
  },
  {
    icon: CreditCard,
    title: "Simple Payments",
    description:
      "Manage payments with a straightforward and transparent process.",
  },
  {
    icon: Headphones,
    title: "Reliable Support",
    description:
      "Get the help you need whenever you need assistance with your work.",
  },
];

export default function Services() {
  return (
    <section className="relative overflow-hidden bg-brand-navy py-24 sm:py-32">
      {/* Background glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-brand-green/[0.05] blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-green/[0.06] px-3.5 py-2">
            <Sparkles size={14} strokeWidth={2} className="text-brand-green" />

            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-green">
              What we offer
            </span>
          </div>

          <h2 className="mt-6 text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Everything you need to
            <span className="text-brand-green"> get work done.</span>
          </h2>

          <p className="mt-5 text-base leading-7 text-white/40 sm:text-lg">
            Orvexa brings talent, services, payments, and collaboration together
            in one simple marketplace.
          </p>
        </div>

        {/* Services Grid */}
        <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <div
                key={service.title}
                className="group relative overflow-hidden rounded-3xl p-7 transition-colors duration-500 sm:p-8"
              >
                {/* Hover accent */}
                <div className="absolute left-0 top-0 h-px w-0 bg-brand-green transition-all duration-500 group-hover:w-full" />

                {/* Icon */}
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.05] transition-all duration-300 group-hover:bg-brand-green/10">
                  <Icon
                    size={20}
                    strokeWidth={1.8}
                    className="text-white/45 transition-colors duration-300 group-hover:text-brand-green"
                  />
                </div>

                {/* Content */}
                <h3 className="mt-6 text-lg font-semibold text-white transition-colors duration-300 group-hover:text-brand-green">
                  {service.title}
                </h3>

                <p className="mt-3 max-w-sm text-sm leading-6 text-white/35 transition-colors duration-300 group-hover:text-white/50">
                  {service.description}
                </p>

                {/* Number */}
                <span className="absolute bottom-6 right-7 text-xs font-medium tracking-[0.15em] text-white/[0.08] transition-colors duration-300 group-hover:text-brand-green/20">
                  {String(services.indexOf(service) + 1).padStart(2, "0")}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
