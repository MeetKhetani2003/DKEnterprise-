import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Linkedin, Mail, Twitter } from 'lucide-react';

import { PageHero } from '@/components/PageHero';
import { PageTransition } from '@/components/PageTransition';
import { Reveal } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';
import { boardMembers } from '@/lib/about-data';
import { ContactStrap } from '@/components/ContactStrap';

export const metadata: Metadata = {
  title: 'Our Chairman',
  description: 'Meet the board leadership behind DK Enterprise.',
};

export default function OurChairmanPage() {
  return (
    <PageTransition>
      <PageHero
        kicker="Leadership"
        title="Experienced leadership with an operator&apos;s mindset."
        description="Our board combines strategic direction, sector insight, and a deep respect for the discipline required to deliver service excellence at scale."
        image="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80"
      />

      <section className="section-padding">
        <div className="container-shell">
          <Reveal>
            <SectionHeading
              kicker="Board of Directors"
              title="The people guiding our growth, culture, and operational standards."
              description="Each leader brings a distinctive perspective on quality, people, resilience, and customer value."
            />
          </Reveal>

          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {boardMembers.map((member, index) => (
              <Reveal key={member.name} delay={index * 0.05}>
                <article className="group card-surface overflow-hidden">
                  <div className="relative aspect-[4/4.5] overflow-hidden">
                    <Image src={member.image} alt={member.name} fill className="object-cover transition duration-700 group-hover:scale-105" />
                  </div>
                  <div className="p-6">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-dark">{member.role}</p>
                    <h3 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">{member.name}</h3>
                    <p className="mt-4 text-sm leading-7 text-slate-600">{member.bio}</p>
                    <div className="mt-6 flex gap-3">
                      <Link href={member.socials.linkedin} className="rounded-full border border-slate-200 p-3 text-slate-700 transition hover:border-primary hover:text-primary-dark">
                        <Linkedin className="h-4 w-4" />
                      </Link>
                      <Link href={member.socials.twitter} className="rounded-full border border-slate-200 p-3 text-slate-700 transition hover:border-primary hover:text-primary-dark">
                        <Twitter className="h-4 w-4" />
                      </Link>
                      <Link href={member.socials.email} className="rounded-full border border-slate-200 p-3 text-slate-700 transition hover:border-primary hover:text-primary-dark">
                        <Mail className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
       <ContactStrap />
    </PageTransition>
  );
}
