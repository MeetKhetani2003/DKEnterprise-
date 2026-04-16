import { CheckCircle2 } from 'lucide-react';

import { Reveal } from '@/components/Reveal';

export function FeatureGrid({ items, columns = 3 }: { items: string[]; columns?: 2 | 3 }) {
  return (
    <div className={`grid gap-4 ${columns === 3 ? 'md:grid-cols-2 xl:grid-cols-3' : 'md:grid-cols-2'}`}>
      {items.map((item, index) => (
        <Reveal key={item} delay={index * 0.05}>
          <div className="glass-panel rounded-[1.5rem] p-5">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            <p className="mt-3 text-sm leading-7 text-slate-700">{item}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
