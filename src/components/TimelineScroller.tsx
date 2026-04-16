'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

type Milestone = {
  year: string;
  title: string;
  description: string;
  image: string;
};

const runningPath = 'M12 35c3-6 7-10 11-10 7 0 7 9 7 9m-11-20a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-1 11-5 8m9-6 8 4m-7 2 7 11m-12-7-9 8';

export function TimelineScroller({ milestones }: { milestones: Milestone[] }) {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute left-0 top-14 hidden h-px w-full bg-gradient-to-r from-primary/0 via-primary/40 to-primary/0 lg:block" />
      <motion.svg
        viewBox="0 0 48 48"
        className="absolute -top-4 left-0 hidden h-14 w-14 text-primary lg:block"
        animate={{ x: ['0%', '85vw', '0%'] }}
        transition={{ duration: 18, repeat: Number.POSITIVE_INFINITY, ease: 'linear' }}
      >
        <path d={runningPath} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
      </motion.svg>

      <div className="flex snap-x gap-6 overflow-x-auto pb-6 pt-12">
        {milestones.map((milestone, index) => (
          <motion.article
            key={milestone.year}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: index * 0.08 }}
            className="card-surface min-w-[300px] max-w-[320px] snap-center overflow-hidden"
          >
            <div className="relative aspect-[4/3]">
              <Image src={milestone.image} alt={milestone.title} fill className="object-cover" />
            </div>
            <div className="p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-dark">{milestone.year}</p>
              <h3 className="mt-3 text-xl font-semibold text-slate-900">{milestone.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{milestone.description}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
