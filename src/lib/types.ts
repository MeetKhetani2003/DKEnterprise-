import type { LucideIcon } from 'lucide-react';

export type NavChild = { label: string; href: string; description?: string };
export type NavItem = { label: string; href?: string; children?: NavChild[] };

export type HeroSlide = {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
};

export type FeatureBlock = {
  title: string;
  description: string;
  image: string;
  bullets?: string[];
};

export type Sector = {
  slug: string;
  title: string;
  kicker: string;
  description: string;
  image: string;
  icon: LucideIcon;
  heroDescription: string;
  features: FeatureBlock[];
  advantages: string[];
};

export type Service = {
  slug: string;
  title: string;
  kicker: string;
  description: string;
  image: string;
  icon: LucideIcon;
  heroDescription: string;
  stats: { label: string; value: number; suffix?: string }[];
  included: string[];
  sections: FeatureBlock[];
  keyFeatures: { title: string; description: string; icon: LucideIcon }[];
};
