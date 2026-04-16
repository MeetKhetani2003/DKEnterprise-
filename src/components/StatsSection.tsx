'use client';

import { useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

import { formatNumber } from '@/lib/utils';

type Stat = {
  label: string;
  value: number;
  suffix?: string;
};

function AnimatedCounter({ value, suffix = '' }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.75 });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let frame = 0;
    const totalFrames = 45;
    const step = () => {
      frame += 1;
      const progress = frame / totalFrames;
      const next = Math.round(value * (1 - Math.pow(1 - progress, 3)));
      setCount(next);
      if (frame < totalFrames) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {formatNumber(count)}
      {suffix}
    </span>
  );
}

export function StatsSection({ stats, dark = true }: { stats: Stat[]; dark?: boolean }) {
  return (
    <section className="section-padding">
      <div className="container-shell">
        <div className={`overflow-hidden rounded-[2rem] px-6 py-10 shadow-glow sm:px-10 lg:px-14 lg:py-14 ${dark ? 'bg-primary-gradient text-white' : 'glass-panel'}`}>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.45 }}
                className={`rounded-[1.5rem] border px-6 py-6 ${dark ? 'border-white/15 bg-white/10' : 'border-slate-200 bg-white'}`}
              >
                <p className={`text-4xl font-semibold tracking-tight ${dark ? 'text-white' : 'text-slate-900'}`}>
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </p>
                <p className={`mt-2 text-sm ${dark ? 'text-white/70' : 'text-slate-500'}`}>{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
