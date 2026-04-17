import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { getAbsoluteUrl } from "@/lib/utils";
import Saperator from "@/components/Saperator";

export const metadata: Metadata = {
  metadataBase: new URL(getAbsoluteUrl()),
  title: {
    default: "DK Enterprise | Enterprise Facility Management",
    template: "%s | DK Enterprise",
  },
  description:
    "DK Enterprise delivers integrated facility management, security services, and environmental support across government, commercial, hospitality, and healthcare sectors.",
  openGraph: {
    title: "DK Enterprise",
    description:
      "Enterprise-level facility management solutions with disciplined service delivery, trained manpower, and measurable outcomes.",
    url: getAbsoluteUrl(),
    siteName: "DK Enterprise",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DK Enterprise",
    description:
      "Enterprise-level facility management solutions with disciplined service delivery, trained manpower, and measurable outcomes.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body className="text-slate-900 antialiased">
        <Navbar />
        <main className="overflow-hidden pt-16">{children}</main>
        <Saperator />
       

        <Footer />
      </body>
    </html>
  );
}
