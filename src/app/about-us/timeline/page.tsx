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

      <section className="relative w-full overflow-hidden bg-[#f5f5f5] py-20">
        <Reveal>
          <div className="text-center max-w-3xl mx-auto px-6">
            <SectionHeading
              kicker="2019-2024"
              title="Progress you can trace through operational milestones."
              description="Scroll through the timeline to see how DK Enterprise has sharpened its capabilities."
            />
          </div>
        </Reveal>
        <div className="mt-12">
          <TimelineScroller milestones={timelineMilestones} />
        </div>
      </section>
    </PageTransition>
  );
}
