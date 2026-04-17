import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';

import { PageHero } from '@/components/PageHero';
import { PageTransition } from '@/components/PageTransition';
import { Reveal } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';
import { groupCompanies } from '@/lib/about-data';
import { ContactStrap } from '@/components/ContactStrap';

export const metadata: Metadata = {
  title: 'Group of Companies',
  description: 'Explore the group businesses that expand the DK Enterprise service ecosystem.',
};

export default function GroupOfCompaniesPage() {
  return (
    <PageTransition>
      <PageHero
        kicker="Group of Companies"
        title="A broader ecosystem designed to support enterprise operations end to end."
        description="Our group structure allows us to bring specialist capabilities into integrated programs without losing governance, speed, or accountability."
        image="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80"
      />

      <section className="section-padding">
        <div className="container-shell">
          <Reveal>
            <SectionHeading
              kicker="Business Portfolio"
              title="Specialist brands that strengthen our delivery model."
              description="Together, these businesses create deeper capability across security, environmental support, engineering, and workplace operations."
            />
          </Reveal>

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {groupCompanies.map((company, index) => (
              <Reveal key={company.name} delay={index * 0.06}>
                <div className="card-surface p-6">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-dark">Group Company</p>
                  <h3 className="mt-4 text-2xl font-semibold tracking-tight text-slate-900">{company.name}</h3>
                  <p className="mt-4 text-sm leading-7 text-slate-600">{company.description}</p>
                  <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary-dark">
                    Integrated capability
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
       <ContactStrap />
    </PageTransition>
  );
}
