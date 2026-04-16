import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { AlternatingSection } from '@/components/AlternatingSection';
import { FeatureGrid } from '@/components/FeatureGrid';
import { PageHero } from '@/components/PageHero';
import { PageTransition } from '@/components/PageTransition';
import { Reveal } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';
import { getSectorBySlug } from '@/lib/content';
import { sectors } from '@/lib/sectors-data';

export function generateStaticParams() {
  return sectors.map((sector) => ({ slug: sector.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const sector = getSectorBySlug(params.slug);

  if (!sector) {
    return { title: 'Sector Not Found' };
  }

  return {
    title: sector.title,
    description: sector.description,
  };
}

export default function SectorPage({ params }: { params: { slug: string } }) {
  const sector = getSectorBySlug(params.slug);

  if (!sector) {
    notFound();
  }

  return (
    <PageTransition>
      <PageHero kicker={sector.kicker} title={sector.title} description={sector.heroDescription} image={sector.image} />

      <section className="section-padding">
        <div className="container-shell">
          <Reveal>
            <SectionHeading
              kicker="About the Sector"
              title={`Facility management tailored for ${sector.title.toLowerCase()} environments.`}
              description={sector.description}
              align="center"
            />
          </Reveal>
        </div>
      </section>

      <section className="section-padding pt-0">
        <div className="container-shell space-y-16">
          {sector.features.map((feature, index) => (
            <AlternatingSection
              key={feature.title}
              title={feature.title}
              description={feature.description}
              image={feature.image}
              bullets={feature.bullets}
              reverse={index % 2 === 1}
            />
          ))}
        </div>
      </section>

      <section className="section-padding">
        <div className="container-shell">
          <Reveal>
            <SectionHeading
              kicker="Client Advantages"
              title={`Why ${sector.title} leaders choose DK Enterprise.`}
              description="Our sector playbooks combine operational control, trained teams, and reporting clarity for high-trust environments."
            />
          </Reveal>
          <div className="mt-10">
            <FeatureGrid items={sector.advantages} columns={3} />
          </div>
        </div>
      </section>

      <section className="section-padding pt-0">
        <div className="container-shell">
          <Reveal>
            <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-soft sm:p-10 lg:flex lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <span className="section-kicker">Need a Tailored Approach?</span>
                <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
                  Let&apos;s shape a sector-ready operating model for your facilities.
                </h2>
                <p className="mt-4 text-slate-600">
                  Speak with our team about scope planning, mobilisation, compliance alignment, and service outcomes for your site portfolio.
                </p>
              </div>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:mt-0">
                <Link href="/contact-us" className="button-primary">
                  Speak to Our Team
                </Link>
                <Link href="/services/integrated-facility-management" className="button-secondary">
                  Explore Services
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </PageTransition>
  );
}
