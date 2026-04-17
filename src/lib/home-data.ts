import type { HeroSlide } from "@/lib/types";

export const heroSlides: HeroSlide[] = [
  {
    eyebrow: "Enterprise Facility Management",
    title:
      "Precision-managed workplaces that stay safe, efficient, and future ready.",
    description:
      "DK Enterprise partners with institutions, corporates, and hospitality leaders to run resilient operations backed by disciplined service delivery and measurable outcomes.",
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=80",
    primaryCta: {
      label: "Explore Services",
      href: "/services/integrated-facility-management",
    },
    secondaryCta: { label: "Talk to Our Team", href: "/contact-us" },
  },
  {
    eyebrow: "Trusted Across High-Stakes Environments",
    title:
      "Operational confidence for government, healthcare, commercial, and hospitality sectors.",
    description:
      "From complex campuses to public-facing assets, our teams align compliance, responsiveness, and guest experience into one accountable operating model.",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80",
    primaryCta: { label: "View Sectors", href: "/sectors/government" },
    secondaryCta: {
      label: "About DK Enterprise",
      href: "/about-us/mission-vision-purpose",
    },
  },
  {
    eyebrow: "People, Process, Performance",
    title:
      "10,000+ professionals trained to deliver seamless service excellence at scale.",
    description:
      "We combine workforce discipline, digital visibility, and proactive maintenance to keep your facilities one step ahead of operational risk.",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=80",
    primaryCta: { label: "Join Our Team", href: "/careers" },
    secondaryCta: { label: "Request a Proposal", href: "/contact-us" },
  },
];

export const companyStats = [
  { label: "People, Places & Plant", value: 45000, suffix: "+" },
  { label: "States & U.T.", value: 29 },
  { label: "Cities", value: 150, suffix: "+" },
  { label: "Customers", value: 800, suffix: "+" },
  { label: "Sites", value: 1560, suffix: "+" },
];

export const sustainabilityHighlights = [
  "Energy and water optimisation initiatives for long-term operational savings.",
  "Green cleaning programs that improve hygiene outcomes with lower environmental impact.",
  "Waste segregation and recycling processes aligned to compliance and ESG goals.",
  "Training modules that build sustainability awareness into everyday service delivery.",
];
