import Image from 'next/image';

import { SectionHeading } from '@/components/SectionHeading';

type PageHeroProps = {
  kicker: string;
  title: string;
  description: string;
  image: string;
};

export function PageHero({ kicker, title, description, image }: PageHeroProps) {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0">
        <Image src={image} alt={title} fill priority className="object-cover" />
        <div className="absolute inset-0 bg-slate-950/65" />
        <div className="absolute inset-0 bg-hero-grid bg-[size:42px_42px] opacity-10" />
      </div>
      <div className="container-shell relative flex min-h-[420px] items-center py-24">
        <SectionHeading kicker={kicker} title={title} description={description} light />
      </div>
    </section>
  );
}
