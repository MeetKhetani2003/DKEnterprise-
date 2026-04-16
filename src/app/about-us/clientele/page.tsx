import type { Metadata } from 'next';

import { PageHero } from '@/components/PageHero';
import { PageTransition } from '@/components/PageTransition';
import { Reveal } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';
import { TestimonialCarousel } from '@/components/TestimonialCarousel';
import { clientStats, clienteleLogos, testimonials } from '@/lib/about-data';

export const metadata: Metadata = {
  title: 'Clientele',
  description: 'See the sectors, customer confidence, and client outcomes associated with DK Enterprise.',
};

export default function ClientelePage() {
  return (
    <PageTransition>
      <PageHero
        kicker="Clientele"
        title="Trusted by organisations that expect dependable outcomes."
        description="Our customer relationships are built on responsiveness, governance, and the ability to execute consistently across demanding environments."
        image="https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1600&q=80"
      />

      <section className="section-padding">
        <div className="container-shell">
          <Reveal>
            <SectionHeading
              kicker="Clients & Partners"
              title="A portfolio spanning public infrastructure, workplaces, care settings, and hospitality."
              description="Representative client names shown below illustrate the breadth of environments where our teams deliver facility management outcomes."
            />
          </Reveal>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {clienteleLogos.map((logo, index) => (
              <Reveal key={logo} delay={index * 0.03}>
                <div className="glass-panel flex min-h-28 items-center justify-center rounded-[1.5rem] p-6 text-center text-xl font-semibold tracking-tight text-slate-700">
                  {logo}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding pt-0">
        <div className="container-shell grid gap-8 lg:grid-cols-[1.1fr,0.9fr]">
          <Reveal>
            <TestimonialCarousel testimonials={testimonials} />
          </Reveal>
          <Reveal>
            <div className="grid h-full gap-5 sm:grid-cols-3 lg:grid-cols-1">
              {clientStats.map((stat) => (
                <div key={stat.label} className="card-surface flex flex-col justify-center p-6">
                  <p className="text-4xl font-semibold tracking-tight text-slate-900">{stat.value}</p>
                  <p className="mt-2 text-sm text-slate-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </PageTransition>
  );
}
