import { Building2, HeartPulse, Hotel, Landmark } from 'lucide-react';

import type { Sector } from '@/lib/types';

export const sectors: Sector[] = [
  {
    slug: 'government',
    title: 'Government',
    kicker: 'Public Infrastructure',
    description: 'Reliable, transparent, and compliance-driven facility management for civic and public-sector assets.',
    image: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5ce?auto=format&fit=crop&w=1200&q=80',
    icon: Landmark,
    heroDescription:
      'We support mission-critical government facilities with disciplined process control, trained manpower, and audit-ready reporting that protects service continuity.',
    features: [
      {
        title: 'Governance-led deployment',
        description:
          'Operational frameworks designed around SLAs, inspections, escalation paths, and transparent documentation for public stakeholders.',
        image: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=1200&q=80',
        bullets: ['SOP-led mobilisation', 'Audit support', 'Control room reporting'],
      },
      {
        title: 'Secure and responsive field operations',
        description:
          'Our trained teams manage complex, high-footfall environments while maintaining security discipline, cleanliness, and public trust.',
        image: 'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80',
        bullets: ['Crowd-sensitive operations', 'Emergency response drills', 'Preventive maintenance routines'],
      },
      {
        title: 'Sustainable public asset upkeep',
        description:
          'We integrate energy awareness, waste minimisation, and lifecycle care to improve facility performance over the long term.',
        image: 'https://images.unsplash.com/photo-1497366412874-3415097a27e7?auto=format&fit=crop&w=1200&q=80',
        bullets: ['Energy dashboards', 'Water stewardship', 'Asset preservation plans'],
      },
    ],
    advantages: [
      'Dedicated command and escalation matrix',
      'Verified and trained workforce',
      'Statutory compliance oversight',
      'Energy and utility optimisation',
      'Digitised audits and reports',
      'Multi-site governance alignment',
    ],
  },
  {
    slug: 'commercial',
    title: 'Commercial',
    kicker: 'Corporate Workplaces',
    description: 'Experience-led upkeep, security, and maintenance programs for modern commercial campuses and offices.',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    icon: Building2,
    heroDescription:
      'We help commercial operators maintain high-performing workspaces that keep occupiers productive, visitors confident, and assets protected.',
    features: [
      {
        title: 'Occupier-first service delivery',
        description:
          'Front-of-house standards, housekeeping detail, and maintenance readiness that strengthen workplace satisfaction and brand experience.',
        image: 'https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&w=1200&q=80',
        bullets: ['Reception support', 'Housekeeping excellence', 'Rapid ticket response'],
      },
      {
        title: 'Operational resilience for busy campuses',
        description:
          'From utilities to security patrols, we align service teams to minimise downtime and maintain business continuity.',
        image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80',
        bullets: ['BMS coordination', 'Planned preventive maintenance', 'Vendor orchestration'],
      },
      {
        title: 'Data-led efficiency improvements',
        description:
          'Our reporting cadence turns everyday operations into a strategic advantage with measurable performance insights.',
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
        bullets: ['KPI dashboards', 'Trend analysis', 'Continuous improvement reviews'],
      },
    ],
    advantages: [
      'Improved tenant and employee experience',
      'Reduced reactive maintenance',
      'Integrated helpdesk and reporting',
      'Scalable manpower deployment',
      'Security and hospitality alignment',
      'Brand-consistent front-of-house standards',
    ],
  },
  {
    slug: 'hotel-hospitality',
    title: 'Hotel & Hospitality',
    kicker: 'Guest Experience Environments',
    description: 'Guest-centric facilities support that protects service standards across front-of-house and back-of-house operations.',
    image: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=1200&q=80',
    icon: Hotel,
    heroDescription:
      'Hospitality environments demand discreet execution, rapid turnarounds, and flawless upkeep. Our teams keep guest journeys polished from arrival to checkout.',
    features: [
      {
        title: 'Guest-ready presentation standards',
        description:
          'We manage cleanliness, ambience, and public areas with a hospitality mindset that reinforces brand promise and guest confidence.',
        image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
        bullets: ['Lobby and public area care', 'Room turnaround support', 'Event readiness'],
      },
      {
        title: 'Behind-the-scenes operational discipline',
        description:
          'Strong controls across utilities, waste, hygiene, and manpower ensure service never slips in kitchens, laundry, or engineering zones.',
        image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80',
        bullets: ['Kitchen hygiene protocols', 'Laundry coordination', 'MEP maintenance oversight'],
      },
      {
        title: 'Service continuity during peak demand',
        description:
          'Our flexible staffing and escalation model helps properties stay consistent through events, seasonal peaks, and high occupancy periods.',
        image: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80',
        bullets: ['Peak staffing plans', 'Event support teams', 'Rapid issue resolution'],
      },
    ],
    advantages: [
      'Guest-experience aligned manpower',
      'Back-of-house hygiene rigor',
      'Rapid turnaround support',
      'Event and banquet preparedness',
      'Luxury presentation standards',
      'Discreet security and service coordination',
    ],
  },
  {
    slug: 'health-care',
    title: 'Health Care',
    kicker: 'Care-Sensitive Facilities',
    description: 'Compliance-focused facilities support for hospitals, clinics, diagnostic centres, and care campuses.',
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80',
    icon: HeartPulse,
    heroDescription:
      'Healthcare settings demand precision, hygiene discipline, and dependable response. We support patient-safe environments with process-led facility operations.',
    features: [
      {
        title: 'Clinical-grade hygiene support',
        description:
          'Our teams follow zoned cleaning standards, infection-control protocols, and detailed supervision to protect patient-facing environments.',
        image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80',
        bullets: ['Infection control alignment', 'Critical area housekeeping', 'Waste segregation support'],
      },
      {
        title: 'Reliable engineering and utility uptime',
        description:
          'We help maintain service continuity across sensitive assets and utilities where downtime is not an option.',
        image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1200&q=80',
        bullets: ['Utility monitoring', 'Equipment support coordination', 'Emergency response readiness'],
      },
      {
        title: 'Patient and visitor confidence',
        description:
          'Clean, calm, and professionally managed spaces improve trust for patients, clinicians, and families alike.',
        image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
        bullets: ['Wayfinding assistance', 'Front-of-house support', 'Comfort and ambience care'],
      },
    ],
    advantages: [
      'Infection-control aware operations',
      'Critical asset uptime support',
      'Regulated waste handling workflows',
      'Sensitive-area housekeeping',
      '24/7 escalation readiness',
      'Compassionate service culture',
    ],
  },
];
