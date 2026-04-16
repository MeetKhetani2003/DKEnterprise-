import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";

import { AlternatingSection } from "@/components/AlternatingSection";
import { HeroCarousel } from "@/components/HeroCarousel";
import { PageTransition } from "@/components/PageTransition";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { StatsSection } from "@/components/StatsSection";
import { TabbedShowcase } from "@/components/TabbedShowcase";
import {
  companyStats,
  heroSlides,
  sustainabilityHighlights,
} from "@/lib/home-data";
import { getAbsoluteUrl } from "@/lib/utils";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "DK Enterprise",
  url: getAbsoluteUrl(),
  description:
    "DK Enterprise delivers integrated facility management, security services, and environmental support across critical sectors.",
  areaServed: "India",
  knowsAbout: [
    "Facility Management",
    "Security Services",
    "Environmental Support",
    "Integrated Operations",
  ],
};

export default function HomePage() {
  return (
    <PageTransition>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <HeroCarousel slides={heroSlides} />
      <StatsSection stats={companyStats} />
      <TabbedShowcase />

      <section className="section-padding">
        <div className="container-shell">
          {/* Outer Card */}
          <div className="overflow-hidden rounded-[2rem] border border-primary bg-[#f8f8f8]">
            <div className="grid lg:grid-cols-2">
              {/* LEFT IMAGE */}
              <div className="relative h-[420px] w-full">
                <Image
                  src="https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?auto=format&fit=crop&w=1200&q=80"
                  alt="Sustainability"
                  fill
                  className="object-cover"
                />
              </div>

              {/* RIGHT CONTENT */}
              <div className="flex flex-col justify-center px-8 py-10 sm:px-12 lg:px-16">
                {/* Kicker */}
                <p className="text-xs tracking-[0.2em] text-slate-400 uppercase">
                  Sustainability
                </p>

                {/* Title */}
                <h2 className="mt-4 text-4xl sm:text-5xl font-semibold text-slate-900 leading-tight">
                  Sustainability & <br /> Innovation
                </h2>

                {/* Description */}
                <p className="mt-6 text-slate-600 leading-7 max-w-xl">
                  At Savita Oil, sustainability is at the core of our business.
                  As a carbon-positive company, we lead the way in developing
                  biodegradable transformer oils, synthetic esters, and
                  eco-friendly lubricants that align with a cleaner, greener
                  future.
                </p>

                {/* CTA */}
                <div className="mt-8">
                  <Link
                    href="#"
                    className="inline-flex items-center gap-2 rounded-lg border border-primary px-6 py-3 text-primary font-medium hover:bg-primary-dark hover:text-white transition"
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
