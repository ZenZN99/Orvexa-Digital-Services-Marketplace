import type { Metadata } from "next";
import "./globals.css";
import LayoutClient from "./shared/components/LayoutClient";

export const metadata: Metadata = {
  metadataBase: new URL("https://orvexa.vercel.app"),

  title: {
    default: "Orvexa | Freelance Services & Expert Professionals",
    template: "%s | Orvexa",
  },

  description:
    "Discover professional freelance services, connect with skilled freelancers, and manage projects securely with Orvexa — your platform for turning ideas into reality.",

  applicationName: "Orvexa",

  keywords: [
    "Orvexa",
    "freelance marketplace",
    "freelance services",
    "hire freelancers",
    "professional services",
    "find freelance experts",
    "online freelance platform",
    "hire professionals",
  ],

  authors: [{ name: "Orvexa" }],
  creator: "Orvexa",

  openGraph: {
    type: "website",
    url: "/",
    siteName: "Orvexa",
    title: "Orvexa | Freelance Services & Expert Professionals",
    description:
      "Find skilled freelancers, explore professional services, and manage your projects with Orvexa.",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Orvexa — Freelance Services & Expert Professionals",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Orvexa | Freelance Services & Expert Professionals",
    description:
      "Discover freelance services, connect with experts, and bring your projects to life with Orvexa.",
    images: ["/logo.png"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  category: "technology",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-brand-navy">
        <LayoutClient>{children}</LayoutClient>
      </body>
    </html>
  );
}
