import type { Metadata } from 'next';

import { AlternatingSection } from '@/components/AlternatingSection';
import { CareersForm } from '@/components/CareersForm';
import { PageHero } from '@/components/PageHero';
import { PageTransition } from '@/components/PageTransition';
import { Reveal } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';

export const metadata: Metadata = {
  title: 'Careers',
  description: 'Join DK Enterprise and help deliver enterprise-grade facility management across high-performance environments.',
};

export default function CareersPage() {
  return (
    <PageTransition>
      <PageHero
        kicker="Careers"
        title="Grow with a team that values discipline, service, and leadership."
        description="We invest in people who want to build operational excellence on the ground and create meaningful client outcomes."
        image="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80"
      />

      <section className="section-padding">
        <div className="container-shell space-y-16">
          <AlternatingSection
            title="Build your career in a company that values frontline excellence"
            description="From supervisory tracks to specialised technical roles, DK Enterprise creates opportunities for people who take ownership and want to grow through structured training and live operations."
            image="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80"
            bullets={['Skill development and cross-functional exposure', 'Leadership pathways for high-performing team members', 'Strong safety, quality, and workplace culture']}
          />
          <AlternatingSection
            title="Work on environments that challenge and strengthen you"
            description="Our teams support commercial campuses, public infrastructure, healthcare spaces, and hospitality environments where professionalism and consistency matter every day."
            image="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80"
            reverse
            bullets={['Sector-specific operating playbooks', 'Mentored onboarding into site operations', 'Recognition for discipline, responsiveness, and client impact']}
          />
        </div>
      </section>

      <section className="section-padding pt-0">
        <div className="container-shell">
          <Reveal>
            <SectionHeading
              kicker="Apply Now"
              title="Share your experience and the team will review your profile."
              description="Use the form below to submit your application. You&apos;ll receive a downloadable PDF acknowledgement immediately after a successful submission."
            />
          </Reveal>
          <div className="mt-10">
            <CareersForm />
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
