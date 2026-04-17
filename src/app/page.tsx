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
import { SectorCarousel } from "@/components/SectorCarousel";
import Saperator from "@/components/Saperator";
import { ContactStrap } from "@/components/ContactStrap";
const sectorsData = [
  {
    tag: "Sustainability",
    title: "Sustainability & Innovation",
    description:
      "At Savita Oil, sustainability is at the core of our business. As a carbon-positive company, we lead the way in developing biodegradable transformer oils and eco-friendly lubricants.",
    image:
      "https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?auto=format&fit=crop&w=1200&q=80",
    href: "#",
  },
  {
    tag: "Coatings",
    title: "Coating, Adhesive & Inks",
    description:
      "We provide high-performance coating solutions for industrial and commercial applications with long-lasting durability.",
    image:
      "https://images.unsplash.com/photo-1581091215367-59ab6b2c2f90?auto=format&fit=crop&w=1200&q=80",
    href: "#",
  },
  {
    tag: "Construction",
    title: "Construction & Building Material",
    description:
      "Delivering reliable materials and services for modern infrastructure and sustainable construction.",
    image:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80",
    href: "#",
  },
];
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
      <Saperator />
      <TabbedShowcase />
      <Saperator />

      <section className="section-padding">
        <div className="container-shell">
          <SectorCarousel sectors={sectorsData} />
        </div>
      </section>
       <ContactStrap />
    </PageTransition>
  );
}
