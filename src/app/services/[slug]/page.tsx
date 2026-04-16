import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { AlternatingSection } from '@/components/AlternatingSection';
import { PageHero } from '@/components/PageHero';
import { PageTransition } from '@/components/PageTransition';
import { Reveal } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';
import { StatsSection } from '@/components/StatsSection';
import { services } from '@/lib/services-data';
import { getServiceBySlug } from '@/lib/content';

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const service = getServiceBySlug(params.slug);

  if (!service) {
    return { title: 'Service Not Found' };
  }

  return {
    title: service.title,
    description: service.description,
  };
}

export default function ServicePage({ params }: { params: { slug: string } }) {
  const service = getServiceBySlug(params.slug);

  if (!service) {
    notFound();
  }

  return (
    <PageTransition>
      <PageHero kicker={service.kicker} title={service.title} description={service.heroDescription} image={service.image} />
      <StatsSection stats={service.stats} />

      <section className="section-padding pt-0">
        <div className="container-shell">
          <Reveal>
            <SectionHeading
              kicker="What&apos;s Included"
              title={`Everything you need in a ${service.title.toLowerCase()} program.`}
              description="Designed to bring consistency, control, and measurable service performance to your environment."
            />
          </Reveal>
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {service.included.map((item, index) => (
              <Reveal key={item} delay={index * 0.04}>
                <div className="card-surface p-5">
                  <service.icon className="h-6 w-6 text-primary" />
                  <p className="mt-4 text-sm leading-7 text-slate-700">{item}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-shell space-y-16">
          {service.sections.map((section, index) => (
            <AlternatingSection
              key={section.title}
              title={section.title}
              description={section.description}
              image={section.image}
              reverse={index % 2 === 1}
            />
          ))}
        </div>
      </section>

      <section className="section-padding pt-0">
        <div className="container-shell">
          <Reveal>
            <SectionHeading
              kicker="Key Features"
              title={`What sets our ${service.title.toLowerCase()} delivery apart.`}
              description="Every service line is supported by governance, trained teams, and a clear operating cadence."
            />
          </Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {service.keyFeatures.map((feature, index) => (
              <Reveal key={feature.title} delay={index * 0.05}>
                <div className="glass-panel rounded-[1.5rem] p-6">
                  <feature.icon className="h-6 w-6 text-primary" />
                  <h3 className="mt-5 text-lg font-semibold text-slate-900">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{feature.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
