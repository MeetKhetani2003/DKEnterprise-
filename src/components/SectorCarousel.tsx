"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

type Sector = {
  title: string;
  description: string;
  image: string;
  tag: string;
  href?: string;
};

export function SectorCarousel({ sectors }: { sectors: Sector[] }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % sectors.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [sectors.length]);

  return (
    <div className="relative overflow-hidden mt-8 sm:mt-12 rounded-[1.5rem] sm:rounded-[2rem] border border-slate-200 h-auto lg:h-[80vh] bg-white">
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.5 }}
          className="grid lg:grid-cols-2"
        >
          {/* LEFT IMAGE */}
          <div className="relative h-[40vh] sm:h-[50vh] lg:h-[80vh] w-full">
            <Image
              src={sectors[active].image}
              alt={sectors[active].title}
              fill
              className="object-cover"
            />
          </div>

          {/* RIGHT CONTENT */}
          <div className="flex flex-col justify-center px-6 py-10 sm:px-12 lg:px-16 lg:h-[80vh] pb-20 lg:pb-10">
            <p className="text-xs tracking-[0.2em] text-slate-400 uppercase">
              {sectors[active].tag}
            </p>

            <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-semibold text-slate-900 leading-tight">
              {sectors[active].title}
            </h2>

            <p className="mt-6 text-slate-600 leading-7 max-w-xl">
              {sectors[active].description}
            </p>

            {sectors[active].href && (
              <div className="mt-8">
                <Link
                  href={sectors[active].href}
                  className="inline-flex items-center gap-2 rounded-lg border border-primary px-6 py-3 text-primary font-medium hover:bg-primary hover:text-white transition"
                >
                  Read More →
                </Link>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
      {/* DOTS */}
      <div className="absolute bottom-6 lg:bottom-10 left-1/2 lg:left-1/2 -translate-x-1/2 flex gap-2">
        {sectors.map((_, index) => (
          <button
            key={index}
            onClick={() => setActive(index)}
            className={`h-2.5 rounded-full transition-all ${
              active === index ? "w-8 bg-primary" : "w-2.5 bg-slate-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
