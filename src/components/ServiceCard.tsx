import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

type ServiceCardProps = {
  title: string;
  description: string;
  image: string;
  href: string;
  label?: string;
};

export function ServiceCard({ title, description, image, href, label = 'Learn More' }: ServiceCardProps) {
  return (
    <Link href={href} className="group card-surface overflow-hidden">
      <div className="relative aspect-[16/11] overflow-hidden">
        <Image src={image} alt={title} fill className="object-cover transition duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-950/5 to-transparent" />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold tracking-tight text-slate-900">{title}</h3>
        <p className="mt-3 text-sm leading-7 text-slate-600">{description}</p>
        <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary-dark">
          {label}
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
