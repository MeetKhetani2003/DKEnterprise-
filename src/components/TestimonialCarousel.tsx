'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

type Testimonial = {
  quote: string;
  author: string;
};

export function TestimonialCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActive((current) => (current + 1) % testimonials.length);
    }, 5000);
    return () => window.clearInterval(interval);
  }, [testimonials.length]);

  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-primary-gradient p-8 text-white shadow-glow sm:p-10">
      <AnimatePresence mode="wait">
        <motion.div
          key={testimonials[active].author}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.4 }}
        >
          <p className="text-xl font-medium leading-9 sm:text-2xl">“{testimonials[active].quote}”</p>
          <p className="mt-6 text-sm uppercase tracking-[0.18em] text-white/70">{testimonials[active].author}</p>
        </motion.div>
      </AnimatePresence>

      <div className="mt-8 flex gap-2">
        {testimonials.map((item, index) => (
          <button
            key={item.author}
            type="button"
            onClick={() => setActive(index)}
            className={`h-2.5 rounded-full transition-all ${active === index ? 'w-9 bg-white' : 'w-2.5 bg-white/40'}`}
            aria-label={`Show testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
