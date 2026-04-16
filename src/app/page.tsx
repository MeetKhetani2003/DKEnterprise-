import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

import { AlternatingSection } from '@/components/AlternatingSection';
import { HeroCarousel } from '@/components/HeroCarousel';
import { PageTransition } from '@/components/PageTransition';
import { Reveal } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';
import { StatsSection } from '@/components/StatsSection';
import { TabbedShowcase } from '@/components/TabbedShowcase';
import { companyStats, heroSlides, sustainabilityHighlights } from '@/lib/home-data';
import { getAbsoluteUrl } from '@/lib/utils';

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'DK Enterprise',
  url: getAbsoluteUrl(),
  description:
    'DK Enterprise delivers integrated facility management, security services, and environmental support across critical sectors.',
  areaServed: 'India',
  knowsAbout: ['Facility Management', 'Security Services', 'Environmental Support', 'Integrated Operations'],
};

export default function HomePage() {
  return (
    <PageTransition>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <HeroCarousel slides={heroSlides} />
      <StatsSection stats={companyStats} />
      <TabbedShowcase />

      <section className="section-padding">
        <div className="container-shell">
          <div className="overflow-hidden rounded-[2rem] bg-surface-gradient p-6 sm:p-8 lg:p-12">
            <div className="grid items-center gap-12 lg:grid-cols-[1.05fr,0.95fr]">
              <Reveal>
                <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem]">
                  <Image
                    src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80"
                    alt="Sustainability-focused facility operations"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute left-6 top-6 rounded-[1.5rem] bg-white/90 px-5 py-4 shadow-soft backdrop-blur-xl">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-dark">ESG Aligned</p>
                    <p className="mt-2 text-lg font-semibold text-slate-900">Greener operations, measurable stewardship</p>
                  </div>
                </div>
              </Reveal>

              <Reveal>
                <SectionHeading
                  kicker="Sustainability in Action"
                  title="Cleaner operations and smarter resource use built into our delivery model."
                  description="We integrate sustainability into frontline execution so environmental responsibility improves both workplace standards and long-term cost efficiency."
                />
                <div className="mt-8 space-y-4">
                  {sustainabilityHighlights.map((item) => (
                    <div key={item} className="flex gap-3 rounded-[1.5rem] border border-slate-200/80 bg-white/80 p-4 shadow-soft">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 text-primary" />
                      <p className="text-sm leading-7 text-slate-700">{item}</p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-shell">
          <div className="grid gap-10 lg:grid-cols-[0.9fr,1.1fr]">
            <Reveal>
              <SectionHeading
                kicker="Why DK Enterprise"
                title="An enterprise operating partner with sector depth and service discipline."
                description="Our delivery model is designed for environments where compliance, uptime, cleanliness, and brand experience all matter at once."
              />
              <div className="mt-8 grid gap-4">
                {[
                  {
                    title: 'Integrated governance',
                    description: 'Single-window accountability across multiple service streams and stakeholders.',
                    icon: ShieldCheck,
                  },
                  {
                    title: 'Performance visibility',
                    description: 'Structured dashboards, review rhythms, and audit-ready reporting.',
                    icon: Sparkles,
                  },
                  {
                    title: 'Responsive mobilisation',
                    description: 'Scalable workforce deployment for complex, fast-moving environments.',
                    icon: ArrowRight,
                  },
                ].map((item) => (
                  <div key={item.title} className="card-surface p-5">
                    <item.icon className="h-6 w-6 text-primary" />
                    <h3 className="mt-4 text-lg font-semibold text-slate-900">{item.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-slate-600">{item.description}</p>
                  </div>
                ))}
              </div>
            </Reveal>

            <AlternatingSection
              title="Built for operational confidence across high-stakes environments"
              description="From public infrastructure and care settings to premium hospitality and modern workspaces, we adapt our operating system to the needs of each environment while maintaining one clear standard of excellence."
              image="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80"
              bullets={['Sector-specific SOPs and compliance awareness', 'Dedicated account governance and escalation paths', 'Service excellence backed by trained manpower and supervision']}
            />
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-shell">
          <div className="overflow-hidden rounded-[2rem] bg-primary-gradient px-6 py-12 text-white shadow-glow sm:px-10 lg:px-14">
            <div className="grid gap-10 lg:grid-cols-[1fr,0.8fr] lg:items-center">
              <Reveal>
                <span className="section-kicker border-white/20 bg-white/10 text-white">Start the Conversation</span>
                <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                  Let&apos;s design a facility strategy that improves reliability, presentation, and performance.
                </h2>
                <p className="mt-5 max-w-2xl text-base leading-7 text-white/80">
                  Connect with our team for a consultation on integrated facility management, security operations, or tailored sector deployment models.
                </p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link href="/contact-us" className="button-secondary border-white/20 bg-white text-slate-900">
                    Request a Proposal
                  </Link>
                  <Link href="/about-us/clientele" className="button-ghost border border-white/20 bg-white/10 text-white hover:bg-white/15 hover:text-white">
                    View Client Impact
                  </Link>
                </div>
              </Reveal>

              <Reveal>
                <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] border border-white/15 bg-white/10 p-3">
                  <Image
                    src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80"
                    alt="Corporate facility team meeting"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent" />
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
