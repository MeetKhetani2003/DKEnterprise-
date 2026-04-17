"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import type { HeroSlide } from "@/lib/types";

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
    <section className="relative isolate px-4 sm:px-10 py-4 sm:py-6 rounded-xl">
      <div className="relative overflow-hidden rounded-[2rem]">
        {/* Background Image */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide.title}
            className="absolute inset-0"
            initial={{ opacity: 0.4, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0.3, scale: 1.08 }}
            transition={{ duration: 1 }}
          >
            <Image
              src={activeSlide.image}
              alt={activeSlide.title}
              fill
              priority
              className="object-cover"
            />

            {/* Light Overlay (FIXED) */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Content */}
        <div className="relative flex min-h-[400px] sm:min-h-[520px] items-center justify-center text-center px-4 sm:px-6">
          <motion.div
            key={`${activeSlide.title}-content`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl text-white"
          >
            {/* Heading */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-semibold leading-tight drop-shadow-md">
              {activeSlide.title}
            </h1>

            {/* Optional Description (can remove if you want exact match) */}
            {activeSlide.description && (
              <p className="mt-4 text-white/70 max-w-xl mx-auto">
                {activeSlide.description}
              </p>
            )}

            {/* CTA */}
            <div className="mt-6">
              <Link
                href={activeSlide.primaryCta.href}
                className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-6 py-3 text-white font-medium shadow-lg hover:bg-orange-600 transition"
              >
                {activeSlide.primaryCta.label}
              </Link>
            </div>
          </motion.div>

          {/* Slider Dots (Bottom Left) */}
          <div className="absolute bottom-6 left-6 flex items-center gap-3">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`h-2.5 rounded-full transition-all ${
                  activeIndex === index
                    ? "w-10 bg-white"
                    : "w-2.5 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
