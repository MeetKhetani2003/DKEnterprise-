'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

import type { HeroSlide } from '@/lib/types';

type HeroCarouselProps = {
  slides: HeroSlide[];
};

export function HeroCarousel({ slides }: HeroCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 5500);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  const activeSlide = slides[activeIndex];

  return (
    <section className="relative isolate min-h-[88vh] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSlide.title}
          className="absolute inset-0"
          initial={{ opacity: 0.35, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0.25, scale: 1.05 }}
          transition={{ duration: 1.1, ease: 'easeOut' }}
        >
          <Image src={activeSlide.image} alt={activeSlide.title} fill priority className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/60 to-slate-950/45" />
          <div className="absolute inset-0 bg-hero-grid bg-[size:46px_46px] opacity-10" />
        </motion.div>
      </AnimatePresence>

      <div className="container-shell relative flex min-h-[88vh] items-center py-20">
        <motion.div
          key={`${activeSlide.title}-content`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl text-white"
        >
          <span className="section-kicker border-white/20 bg-white/10 text-white">{activeSlide.eyebrow}</span>
          <h1 className="text-balance text-4xl font-semibold leading-tight sm:text-5xl md:text-6xl">
            {activeSlide.title}
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-white/75 sm:text-lg">{activeSlide.description}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href={activeSlide.primaryCta.href} className="button-primary">
              {activeSlide.primaryCta.label}
            </Link>
            <Link href={activeSlide.secondaryCta.href} className="button-secondary border-white/30 bg-white/10 text-white hover:bg-white hover:text-slate-900">
              {activeSlide.secondaryCta.label}
            </Link>
          </div>
          <div className="mt-10 flex items-center gap-4">
            {slides.map((slide, index) => (
              <button
                key={slide.title}
                type="button"
                onClick={() => setActiveIndex(index)}
                className="group flex items-center gap-2"
                aria-label={`Go to slide ${index + 1}`}
              >
                <span
                  className={`h-2.5 rounded-full transition-all ${activeIndex === index ? 'w-10 bg-primary-light' : 'w-2.5 bg-white/35 group-hover:bg-white/60'}`}
                />
              </button>
            ))}
          </div>
        </motion.div>

        <div className="absolute bottom-10 right-4 hidden rounded-full border border-white/15 bg-white/10 px-4 py-3 text-sm text-white/80 backdrop-blur-xl xl:flex">
          Operational excellence, measurable outcomes
          <ArrowRight className="ml-2 h-4 w-4" />
        </div>
      </div>
    </section>
  );
}
