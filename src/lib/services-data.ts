import {
  Building,
  CheckCircle2,
  ClipboardCheck,
  Globe2,
  Leaf,
  ShieldCheck,
  Sparkles,
  Users,
  Wrench,
} from 'lucide-react';

import type { Service } from '@/lib/types';

export const services: Service[] = [
  {
    slug: 'integrated-facility-management',
    title: 'Integrated Facility Management',
    kicker: 'One Operating Partner',
    description: 'A unified model that brings hard services, soft services, compliance, and reporting into one accountable program.',
    image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80',
    icon: Wrench,
    heroDescription:
      'Our IFM solution combines maintenance, housekeeping, helpdesk, energy oversight, and vendor coordination into one performance-led command structure.',
    stats: [
      { label: 'Sites Managed', value: 240, suffix: '+' },
      { label: 'SLA Compliance', value: 98, suffix: '%' },
      { label: 'Response Coverage', value: 24, suffix: '/7' },
      { label: 'Audit Readiness', value: 100, suffix: '%' },
    ],
    included: [
      'Technical maintenance and MEP services',
      'Housekeeping and janitorial operations',
      'Helpdesk, ticketing, and escalation handling',
      'Vendor management and service governance',
      'Energy, utility, and asset performance tracking',
      'Compliance documentation and inspections',
      'Pest control and hygiene management',
      'Landscape and common area upkeep',
    ],
    sections: [
      {
        title: 'A single command layer for every service stream',
        description:
          'We remove fragmented vendor management by consolidating day-to-day service coordination under a single accountable team and reporting rhythm.',
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Lifecycle-focused asset reliability',
        description:
          'Preventive planning, calibrated maintenance schedules, and smart escalation keep assets available and reduce costly reactive breakdowns.',
        image: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Transparent governance and KPI visibility',
        description:
          'Stakeholders receive structured dashboards, review packs, and audit evidence that translate operations into measurable performance.',
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Flexible manpower and service design',
        description:
          'Our operating model scales by site complexity, business hours, occupancy patterns, and compliance risk rather than one-size-fits-all staffing.',
        image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Continuous improvement built into delivery',
        description:
          'We review trends, root causes, and cost levers to improve performance month after month instead of simply maintaining the status quo.',
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
      },
    ],
    keyFeatures: [
      { title: 'Central Helpdesk', description: 'Single-window service orchestration with tracked closure.', icon: ClipboardCheck },
      { title: 'Asset Intelligence', description: 'Maintenance planning aligned to asset criticality and uptime.', icon: Sparkles },
      { title: 'Compliance Oversight', description: 'Inspection calendars, permits, and documentation visibility.', icon: ShieldCheck },
      { title: 'Workforce Governance', description: 'Structured rostering, supervision, and training controls.', icon: Users },
    ],
  },
  {
    slug: 'security-services',
    title: 'Security Services',
    kicker: 'Safe. Visible. Prepared.',
    description: 'Integrated manned guarding, access control support, and risk-aware response programs for enterprise facilities.',
    image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80',
    icon: ShieldCheck,
    heroDescription:
      'We design security operations that protect people, assets, and reputation while staying aligned to customer experience and operational flow.',
    stats: [
      { label: 'Guards Deployed', value: 3500, suffix: '+' },
      { label: 'Incident Escalation', value: 15, suffix: ' min' },
      { label: 'Training Modules', value: 18, suffix: '+' },
      { label: 'Coverage Readiness', value: 24, suffix: '/7' },
    ],
    included: [
      'Manned guarding and patrolling',
      'Access control and visitor management',
      'Control room support',
      'Incident reporting and escalation',
      'Fire and safety drill coordination',
      'Perimeter and asset surveillance support',
      'Emergency response readiness',
      'Security SOP and post-order management',
    ],
    sections: [
      {
        title: 'Security programs tailored to site risk',
        description:
          'We assess operational risks, public exposure, and critical asset requirements to structure the right guarding and response model for each site.',
        image: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Professional frontline presence',
        description:
          'Uniformed teams are trained not only for vigilance, but for conduct, visitor handling, and calm response under pressure.',
        image: 'https://images.unsplash.com/photo-1568992687947-868a62a9f521?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Faster escalation and control room alignment',
        description:
          'Control procedures, post orders, and real-time reporting reduce ambiguity when rapid action is required.',
        image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Security that complements experience',
        description:
          'For workplaces, hospitals, and hospitality environments, our teams balance visible security with professionalism and service sensitivity.',
        image: 'https://images.unsplash.com/photo-1516321310764-8d4d8c117a29?auto=format&fit=crop&w=1200&q=80',
      },
    ],
    keyFeatures: [
      { title: 'Post Orders', description: 'Structured instructions for each zone and risk profile.', icon: ClipboardCheck },
      { title: 'Control Readiness', description: 'Escalation frameworks tied to critical response workflows.', icon: ShieldCheck },
      { title: 'Guest Sensitivity', description: 'Security teams trained for public and client-facing situations.', icon: Building },
      { title: 'Training Discipline', description: 'Refresher modules across vigilance, safety, and conduct.', icon: Users },
    ],
  },
  {
    slug: 'environmental-support',
    title: 'Environmental Support',
    kicker: 'Cleaner. Healthier. Greener.',
    description: 'Sustainable cleaning, hygiene, and waste programs that elevate wellbeing and operational presentation.',
    image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80',
    icon: Leaf,
    heroDescription:
      'Our environmental support services combine hygiene rigor, waste discipline, and sustainability practices to create cleaner, healthier facilities.',
    stats: [
      { label: 'Daily Service Areas', value: 1200, suffix: '+' },
      { label: 'Waste Diversion Programs', value: 65, suffix: '+' },
      { label: 'Eco-friendly Materials', value: 80, suffix: '%' },
      { label: 'Quality Audits', value: 300, suffix: '/month' },
    ],
    included: [
      'Daily housekeeping and deep cleaning',
      'Restroom hygiene management',
      'Waste segregation and disposal support',
      'Consumables replenishment',
      'Floor and façade care',
      'Pantry and common area hygiene',
      'Seasonal deep cleaning campaigns',
      'Green cleaning program implementation',
    ],
    sections: [
      {
        title: 'Visible cleanliness backed by process discipline',
        description:
          'We translate hygiene expectations into zone plans, inspection routines, and quality checks that maintain consistency across shifts.',
        image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Healthier environments for people and visitors',
        description:
          'Clean, well-maintained spaces improve confidence, employee wellbeing, and the overall impression of your brand.',
        image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Sustainability built into service routines',
        description:
          'Our teams support greener operations through smarter material choices, responsible waste handling, and continuous awareness.',
        image: 'https://images.unsplash.com/photo-1497366858526-0766cadbe8fa?auto=format&fit=crop&w=1200&q=80',
      },
      {
        title: 'Premium presentation for demanding environments',
        description:
          'From corporate offices to hospitality spaces, our approach protects both hygiene outcomes and visual standards.',
        image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80',
      },
    ],
    keyFeatures: [
      { title: 'Quality Inspections', description: 'Routine checks and supervisory oversight for every zone.', icon: CheckCircle2 },
      { title: 'Waste Discipline', description: 'Segregation and disposal programs that support compliance.', icon: Leaf },
      { title: 'Material Stewardship', description: 'Preference for safer, efficient, and greener products.', icon: Globe2 },
      { title: 'Brand Presentation', description: 'Cleaning standards designed around first impressions.', icon: Sparkles },
    ],
  },
];
