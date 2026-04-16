import { sectors } from '@/lib/sectors-data';
import { services } from '@/lib/services-data';

export function getSectorBySlug(slug: string) {
  return sectors.find((sector) => sector.slug === slug);
}

export function getServiceBySlug(slug: string) {
  return services.find((service) => service.slug === slug);
}
