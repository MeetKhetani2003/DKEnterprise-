import Image from 'next/image';
import { CheckCircle2 } from 'lucide-react';

import { Reveal } from '@/components/Reveal';

type AlternatingSectionProps = {
  title: string;
  description: string;
  image: string;
  reverse?: boolean;
  bullets?: string[];
};

export function AlternatingSection({ title, description, image, reverse = false, bullets }: AlternatingSectionProps) {
  return (
    <Reveal>
      <div className={`grid items-center gap-10 lg:grid-cols-2 ${reverse ? 'lg:[&>*:first-child]:order-2' : ''}`}>
        <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem]">
          <Image src={image} alt={title} fill className="object-cover transition duration-700 hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 to-transparent" />
        </div>
        <div>
          <h3 className="text-2xl font-semibold tracking-tight text-slate-900 md:text-3xl">{title}</h3>
          <p className="mt-4 text-base leading-7 text-slate-600">{description}</p>
          {bullets ? (
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {bullets.map((bullet) => (
                <div key={bullet} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-primary" />
                  <span className="text-sm text-slate-700">{bullet}</span>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </Reveal>
  );
}
