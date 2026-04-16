import type { Metadata } from 'next';

import { AlternatingSection } from '@/components/AlternatingSection';
import { PageHero } from '@/components/PageHero';
import { PageTransition } from '@/components/PageTransition';
import { missionVisionPurpose } from '@/lib/about-data';

export const metadata: Metadata = {
  title: 'Mission, Vision & Purpose',
  description: 'Discover the mission, vision, and purpose that guide DK Enterprise.',
};

const images = [
  'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80',
];

export default function MissionVisionPurposePage() {
  return (
    <PageTransition>
      <PageHero
        kicker="About Us"
        title="Mission, vision, and purpose shaped by service excellence."
        description="Our direction is grounded in operational discipline, people-first leadership, and measurable client value."
        image="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80"
      />

      <section className="section-padding">
        <div className="container-shell space-y-16">
          {missionVisionPurpose.map((item, index) => (
            <div
              key={item.title}
              className={`overflow-hidden rounded-[2rem] bg-gradient-to-br ${
                index % 2 === 0 ? 'from-primary/10 via-primary-soft to-white' : 'from-slate-50 via-white to-primary/5'
              } p-6 sm:p-8 lg:p-10`}
            >
              <AlternatingSection
                title={item.title}
                description={item.description}
                image={images[index] ?? images[0]}
                reverse={index % 2 === 1}
                bullets={['People-first culture', 'Disciplined delivery systems', 'Long-term client partnership mindset']}
              />
            </div>
          ))}
        </div>
      </section>
    </PageTransition>
  );
}
