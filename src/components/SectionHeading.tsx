import { cn } from '@/lib/utils';

type SectionHeadingProps = {
  kicker?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  light?: boolean;
};

export function SectionHeading({ kicker, title, description, align = 'left', light = false }: SectionHeadingProps) {
  return (
    <div className={cn('max-w-3xl', align === 'center' && 'mx-auto text-center', light && 'text-white')}>
      {kicker ? <span className={cn('section-kicker', light && 'border-white/20 bg-white/10 text-white')}>{kicker}</span> : null}
      <h2 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">{title}</h2>
      {description ? (
        <p className={cn('mt-5 text-base leading-7 text-slate-600 sm:text-lg', light && 'text-white/80')}>{description}</p>
      ) : null}
    </div>
  );
}
