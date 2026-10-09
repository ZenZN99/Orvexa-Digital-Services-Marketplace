import Link from "next/link";
import { Instrument_Serif } from "next/font/google";

const signature = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
});

const footerLinks = {
  Platform: [
    { label: "Explore Services", href: "/services" },
    { label: "Find Freelancers", href: "/freelancers" },
    { label: "Become a Seller", href: "/create-service" },
    { label: "How It Works", href: "/how-it-works" },
  ],
  Company: [
    { label: "About Orvexa", href: "/about" },
    { label: "Updates", href: "/updates" },
  ],
  Resources: [
    { label: "Help Center", href: "/support" },
    { label: "Community", href: "/community" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
  ],
};

const socials = [
  { label: "X", href: "https://x.com" },
  { label: "in", href: "https://linkedin.com" },
  { label: "GH", href: "https://github.com" },
];

const categories = [
  "Web Development",
  "Graphic Design",
  "Copywriting",
  "Video Editing",
  "SEO",
  "Mobile Apps",
  "Voice Over",
  "Data Entry",
  "Illustration",
  "3D & Animation",
];

export default function Footer() {
  const ticketNo = String(new Date().getFullYear()).slice(-2) + "-004821";

  return (
    <footer className="relative overflow-hidden border-t border-white/6 bg-brand-navy">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute -bottom-40 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-brand-green/[0.035] blur-[120px]" />

      {/* Scrolling category ticker — the marketplace's shelf, always stocked */}
      <div className="relative border-b border-white/6 bg-black/10">
        <div className="ticker-track flex w-max items-center gap-8 py-3 text-xs text-white/25">
          {[...categories, ...categories].map((cat, i) => (
            <span key={i} className="flex items-center gap-8 whitespace-nowrap">
              <span>{cat}</span>
              <span className="h-1 w-1 rounded-full bg-brand-green/70" />
            </span>
          ))}
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
        <div className="grid gap-14 py-16 sm:py-20 lg:grid-cols-[1.3fr_2fr] lg:gap-20">
          {/* Brand + signature line */}
          <div className="max-w-sm">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <img
                src="/favicon.ico"
                alt="Orvexa"
                className="h-9 w-9 rounded-xl object-contain"
              />
              <span className="text-xl font-bold tracking-tight text-white">
                Orvexa
              </span>
            </Link>

            <p
              className={`${signature.className} mt-7 text-[28px] italic leading-snug text-white/70`}
            >
              Good work finds good people.
            </p>

            <p className="mt-5 text-sm leading-7 text-white/35">
              A modern marketplace where talented people meet great
              opportunities, projects get done, and skills become businesses.
            </p>

            {/* Socials styled as wax-seal stamps */}
            <div className="mt-7 flex items-center gap-3">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  className="flex h-10 w-10 rotate-[-4deg] items-center justify-center rounded-full border border-white/10 bg-white/2 text-xs font-semibold text-white/40 transition-all duration-300 hover:rotate-0 hover:border-brand-green/40 hover:bg-brand-green hover:text-brand-navy"
                >
                  {social.label}
                </a>
              ))}
            </div>
          </div>

          {/* Link ledger */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-3">
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h3 className="text-sm font-medium text-white/50">{title}</h3>

                <ul className="mt-6 space-y-4">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="group relative inline-block text-sm text-white/35 transition-colors duration-300 hover:text-white"
                      >
                        {link.label}
                        <span className="absolute -bottom-1 left-0 h-px w-0 bg-brand-green transition-all duration-300 group-hover:w-full" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Ticket stub perforation */}
        <div className="relative flex items-center">
          <span className="absolute -left-6 h-4 w-4 -translate-x-1/2 rounded-full bg-[#05070d] sm:-left-10" />
          <div className="h-0 w-full border-t-2 border-dashed border-white/10" />
          <span className="absolute -right-6 h-4 w-4 translate-x-1/2 rounded-full bg-[#05070d] sm:-right-10" />
        </div>

        {/* Bottom stub */}
        <div className="flex flex-col gap-5 py-7 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4 text-xs text-white/25">
            <span>© {new Date().getFullYear()} Orvexa</span>
            <span className="font-mono text-white/15">No. {ticketNo}</span>
          </div>

          <div className="flex items-center gap-5 text-xs text-white/25">
            <Link
              href="/privacy"
              className="transition-colors hover:text-white"
            >
              Privacy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-white">
              Terms
            </Link>

            <span className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-green" />
              Systems live
            </span>
          </div>
        </div>
      </div>

      <style>{`
        .ticker-track {
          animation: orvexa-ticker 32s linear infinite;
        }
        @keyframes orvexa-ticker {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .ticker-track { animation: none; }
        }
      `}</style>
    </footer>
  );
}
