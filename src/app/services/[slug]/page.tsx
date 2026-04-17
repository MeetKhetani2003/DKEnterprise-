import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AlternatingSection } from "@/components/AlternatingSection";
import { PageHero } from "@/components/PageHero";
import { PageTransition } from "@/components/PageTransition";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { StatsSection } from "@/components/StatsSection";
import { services } from "@/lib/services-data";
import { getServiceBySlug } from "@/lib/content";
import { ContactStrap } from "@/components/ContactStrap";

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const service = getServiceBySlug(params.slug);

  if (!service) {
    return { title: "Service Not Found" };
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
      <PageHero
        kicker={service.kicker}
        title={service.title}
        description={service.heroDescription}
        image={service.image}
      />
      <StatsSection stats={service.stats} />

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
       <ContactStrap />
    </PageTransition>
  );
}
