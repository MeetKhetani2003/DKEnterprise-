import type { NavItem } from '@/lib/types';

export const navigation: NavItem[] = [
  { label: 'Home', href: '/' },
  {
    label: 'Services',
    children: [
      {
        label: 'Integrated Facility Management',
        href: '/services/integrated-facility-management',
        description: 'End-to-end hard and soft service orchestration.',
      },
      {
        label: 'Security Services',
        href: '/services/security-services',
        description: 'Risk-aware guarding, control room, and response protocols.',
      },
      {
        label: 'Environmental Support',
        href: '/services/environmental-support',
        description: 'Sustainable cleaning, waste and hygiene operations.',
      },
    ],
  },
  {
    label: 'Sectors',
    children: [
      {
        label: 'Government',
        href: '/sectors/government',
        description: 'Mission critical operations for public infrastructure.',
      },
      {
        label: 'Commercial',
        href: '/sectors/commercial',
        description: 'Reliable experience-led facility services for workplaces.',
      },
      {
        label: 'Hotel & Hospitality',
        href: '/sectors/hotel-hospitality',
        description: 'Guest-first upkeep and back-of-house excellence.',
      },
      {
        label: 'Health Care',
        href: '/sectors/health-care',
        description: 'Compliance-focused support for care environments.',
      },
    ],
  },
  {
    label: 'About Us',
    children: [
      { label: 'Mission, Vision & Purpose', href: '/about-us/mission-vision-purpose' },
      { label: 'Timeline', href: '/about-us/timeline' },
      { label: 'Our Chairman', href: '/about-us/our-chairman' },
      { label: 'Group of Companies', href: '/about-us/group-of-companies' },
      { label: 'Clientele', href: '/about-us/clientele' },
    ],
  },
  { label: 'Careers', href: '/careers' },
  { label: 'Contact Us', href: '/contact-us' },
];
