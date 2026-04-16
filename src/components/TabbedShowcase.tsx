'use client';

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { Reveal } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';
import { ServiceCard } from '@/components/ServiceCard';
import { sectors } from '@/lib/sectors-data';
import { services } from '@/lib/services-data';

export function TabbedShowcase() {
  const [activeTab, setActiveTab] = useState<'services' | 'sectors'>('services');

  return (
    <section className="section-padding">
      <div className="container-shell">
        <Reveal>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              kicker="Solutions Portfolio"
              title="Specialised service models for the sectors that demand more."
              description="Explore our core services and the environments where DK Enterprise delivers structured, high-performance operations."
            />
            <div className="flex rounded-full border border-slate-200 bg-white p-1 shadow-soft">
              {(['services', 'sectors'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-full px-5 py-2 text-sm font-semibold capitalize transition ${
                    activeTab === tab ? 'bg-primary-gradient text-white shadow-glow' : 'text-slate-600'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {(activeTab === 'services' ? services : sectors).map((item, index) => (
            <Reveal key={item.slug} delay={index * 0.08}>
              <ServiceCard
                title={item.title}
                description={item.description}
                image={item.image}
                href={`/${activeTab}/${item.slug}`}
                label={activeTab === 'services' ? 'View Service' : 'View Sector'}
              />
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-8 flex justify-end">
            <Link
              href={activeTab === 'services' ? '/services/integrated-facility-management' : '/sectors/government'}
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary-dark"
            >
              Explore all {activeTab}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
