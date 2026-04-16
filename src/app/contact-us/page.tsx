import type { Metadata } from 'next';
import Link from 'next/link';
import { Mail, MapPin, Phone } from 'lucide-react';

import { ContactForm } from '@/components/ContactForm';
import { PageHero } from '@/components/PageHero';
import { PageTransition } from '@/components/PageTransition';
import { Reveal } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';
import { offices } from '@/lib/forms-data';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Connect with DK Enterprise for facility management, security services, environmental support, and partnership enquiries.',
};

const socialLinks = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
  { label: 'Twitter', href: 'https://x.com/' },
  { label: 'Facebook', href: 'https://www.facebook.com/' },
  { label: 'Instagram', href: 'https://www.instagram.com/' },
];

export default function ContactUsPage() {
  return (
    <PageTransition>
      <PageHero
        kicker="Contact Us"
        title="Talk to a team that understands complex facility operations."
        description="Whether you need integrated services, a tailored sector solution, or a mobilisation roadmap, we&apos;re ready to help."
        image="https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1600&q=80"
      />

      <section className="section-padding">
        <div className="container-shell grid gap-10 lg:grid-cols-[0.9fr,1.1fr]">
          <Reveal>
            <div className="space-y-6">
              <SectionHeading
                kicker="Reach Our Team"
                title="Corporate contact details and service enquiries."
                description="Use the information below for direct outreach or submit the form to generate a PDF summary and alert our team."
              />
              {offices.map((office) => (
                <div key={office.title} className="card-surface p-6">
                  <h3 className="text-xl font-semibold text-slate-900">{office.title}</h3>
                  <div className="mt-5 space-y-4 text-sm text-slate-600">
                    <p className="flex gap-3">
                      <MapPin className="mt-0.5 h-5 w-5 text-primary" />
                      {office.address}
                    </p>
                    <p className="flex gap-3">
                      <Phone className="mt-0.5 h-5 w-5 text-primary" />
                      {office.phone}
                    </p>
                    <p className="flex gap-3">
                      <Mail className="mt-0.5 h-5 w-5 text-primary" />
                      {office.email}
                    </p>
                  </div>
                  <div className="mt-6 flex flex-wrap gap-3">
                    {socialLinks.map((social) => (
                      <Link key={social.label} href={social.href} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-primary hover:text-primary-dark">
                        {social.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}

              <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-soft">
                <iframe
                  title="DK Enterprise map"
                  src="https://www.google.com/maps?q=Ahmedabad%20Gujarat&output=embed"
                  className="h-[320px] w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </Reveal>

          <Reveal>
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </PageTransition>
  );
}
