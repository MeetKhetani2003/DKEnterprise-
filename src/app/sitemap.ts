import type { MetadataRoute } from 'next';

import { getAbsoluteUrl } from '@/lib/utils';
import { sectors } from '@/lib/sectors-data';
import { services } from '@/lib/services-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    '/',
    '/careers',
    '/contact-us',
    '/about-us/mission-vision-purpose',
    '/about-us/timeline',
    '/about-us/our-chairman',
    '/about-us/group-of-companies',
    '/about-us/clientele',
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: getAbsoluteUrl(route),
      lastModified: new Date(),
    })),
    ...services.map((service) => ({
      url: getAbsoluteUrl(`/services/${service.slug}`),
      lastModified: new Date(),
    })),
    ...sectors.map((sector) => ({
      url: getAbsoluteUrl(`/sectors/${sector.slug}`),
      lastModified: new Date(),
    })),
  ];
}
