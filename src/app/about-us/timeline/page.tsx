import type { Metadata } from "next";

import { PageHero } from "@/components/PageHero";
import { PageTransition } from "@/components/PageTransition";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { TimelineScroller } from "@/components/TimelineScroller";
import { timelineMilestones } from "@/lib/about-data";

export const metadata: Metadata = {
  title: "Timeline",
  description: "Explore the DK Enterprise journey from 2019 to 2024.",
};

export default function TimelinePage() {
  return (
    <PageTransition>
      <PageHero
        kicker="Our Timeline"
        title="A recent journey of modernisation, resilience, and growth."
        description="From operating discipline to sustainability and leadership development, each milestone reflects our commitment to better service delivery."
        image="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=80"
      />

      <section className="section-padding">
        <div className="container-shell">
          <Reveal>
            <SectionHeading
              kicker="2019-2024"
              title="Progress you can trace through operational milestones."
              description="Scroll through the timeline to see how DK Enterprise has sharpened its capabilities, delivery systems, and client impact."
            />
          </Reveal>
          <div className="mt-12">
            <TimelineScroller milestones={timelineMilestones} />
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
