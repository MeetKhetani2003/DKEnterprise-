"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  MotionValue,
  useMotionValue,
  useMotionValueEvent,
  useSpring,
  useTransform,
} from "framer-motion";

export type Milestone = {
  year: string;
  title: string;
  description: string;
  image: string;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

function Walker({ isWalking }: { isWalking: boolean }) {
  const bob = isWalking ? { y: [0, -8, 0] } : { y: 0 };

  return React.createElement(
    motion.div,
    {
      className: "relative h-16 w-16",
      animate: bob,
      transition: { duration: 1, repeat: Infinity, ease: "easeInOut" },
      "aria-hidden": true,
    },
    React.createElement("div", {
      className:
        "absolute left-1/2 top-0 h-5 w-5 -translate-x-1/2 rounded-full bg-[#14B8A6]",
    }),
    React.createElement("div", {
      className:
        "absolute left-1/2 top-5 h-6 w-3 -translate-x-1/2 rounded-full bg-[#14B8A6]",
    }),
    React.createElement(motion.div, {
      className:
        "absolute left-[18px] top-[28px] h-7 w-[3px] origin-top rounded-full bg-[#14B8A6]",
      animate: isWalking ? { rotate: [16, -16, 16] } : { rotate: 0 },
      transition: { duration: 0.9, repeat: Infinity, ease: "easeInOut" },
    }),
    React.createElement(motion.div, {
      className:
        "absolute right-[18px] top-[28px] h-7 w-[3px] origin-top rounded-full bg-[#14B8A6]",
      animate: isWalking ? { rotate: [-16, 16, -16] } : { rotate: 0 },
      transition: {
        duration: 0.9,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 0.45,
      },
    }),
    React.createElement(motion.div, {
      className:
        "absolute left-[14px] top-[18px] h-6 w-[3px] origin-top rounded-full bg-[#14B8A6]",
      animate: isWalking ? { rotate: [-22, 10, -22] } : { rotate: 0 },
      transition: {
        duration: 0.9,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 0.45,
      },
    }),
    React.createElement(motion.div, {
      className:
        "absolute right-[14px] top-[18px] h-6 w-[3px] origin-top rounded-full bg-[#14B8A6]",
      animate: isWalking ? { rotate: [22, -10, 22] } : { rotate: 0 },
      transition: { duration: 0.9, repeat: Infinity, ease: "easeInOut" },
    }),
  );
}

function TimelineDot({
  milestone,
  index,
  progress,
  totalSlides,
}: {
  milestone: Milestone;
  index: number;
  progress: MotionValue<number>;
  totalSlides: number;
}) {
  const start = index / totalSlides;
  const center = (index + 0.5) / totalSlides;
  const end = (index + 1) / totalSlides;

  const backgroundColor = useTransform(
    progress,
    [start, center, end],
    ["rgba(255,255,255,0.3)", "rgba(20,184,166,1)", "rgba(255,255,255,0.3)"],
  );

  const scale = useTransform(progress, [start, center, end], [1, 1.45, 1]);

  return React.createElement(motion.div, {
    key: milestone.year,
    className: "h-2 w-2 rounded-full",
    style: { backgroundColor, scale },
  });
}

function TimelineSlide({
  milestone,
  index,
  progress,
  totalSlides,
}: {
  milestone: Milestone;
  index: number;
  progress: MotionValue<number>;
  totalSlides: number;
}) {
  const start = index / totalSlides;
  const center = (index + 0.5) / totalSlides;
  const end = (index + 1) / totalSlides;

  const opacity = useTransform(
    progress,
    [start, center - 0.08, center, center + 0.08, end],
    [0.28, 0.72, 1, 0.72, 0.28],
  );
  const scale = useTransform(
    progress,
    [start, center - 0.1, center, center + 0.1, end],
    [0.9, 0.965, 1, 0.965, 0.9],
  );
  const textY = useTransform(progress, [start, center, end], [80, 0, -50]);
  const imageScale = useTransform(
    progress,
    [start, center, end],
    [1.12, 1, 1.05],
  );
  const blur = useTransform(
    progress,
    [start, center - 0.08, center, center + 0.08, end],
    [10, 4, 0, 4, 10],
  );
  const filter = useTransform(blur, (value) => `blur(${value}px)`);

  return React.createElement(
    motion.div,
    {
      className:
        "relative flex h-screen w-screen flex-shrink-0 items-center justify-center overflow-hidden",
      style: { opacity, scale, filter },
    },
    React.createElement(
      motion.div,
      { className: "absolute inset-0", style: { scale: imageScale } },
      React.createElement(Image, {
        src: milestone.image,
        alt: milestone.title,
        fill: true,
        className: "object-cover",
        priority: index === 0,
      }),
    ),
    React.createElement("div", {
      className:
        "absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80",
    }),
    React.createElement(
      motion.div,
      {
        className:
          "relative z-10 mx-auto max-w-5xl px-8 text-center text-white",
        style: { y: textY },
      },
      React.createElement(
        "div",
        {
          className:
            "mb-4 text-[5rem] font-black leading-none text-white/15 md:text-[9rem]",
        },
        milestone.year,
      ),
      React.createElement(
        "h2",
        {
          className: "mb-6 text-4xl font-bold drop-shadow-2xl md:text-7xl",
        },
        milestone.title,
      ),
      React.createElement(
        "p",
        {
          className:
            "mx-auto max-w-3xl text-lg leading-relaxed text-white/90 md:text-2xl",
        },
        milestone.description,
      ),
    ),
  );
}

export function TimelineScroller({ milestones }: { milestones: Milestone[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const progress = useMotionValue(0);
  const totalSlides = milestones.length;
  const maxIndex = Math.max(totalSlides - 1, 0);

  const [activeSlide, setActiveSlide] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  const smoothProgress = useSpring(progress, {
    stiffness: 70,
    damping: 24,
    mass: 1.05,
    restDelta: 0.0005,
  });

  const normalizedProgress = useTransform(smoothProgress, (value) =>
    maxIndex === 0 ? 0 : value / maxIndex,
  );

  const trackX = useTransform(
    normalizedProgress,
    [0, 1],
    ["0%", `-${maxIndex * 100}%`],
  );
  const walkerX = useTransform(normalizedProgress, [0, 1], ["8%", "92%"]);
  const walkerY = useTransform(
    normalizedProgress,
    [0, 0.18, 0.36, 0.54, 0.72, 0.9, 1],
    [0, -10, 0, -10, 0, -8, 0],
  );
  const walkerRotate = useTransform(
    normalizedProgress,
    [0, 0.2, 0.5, 0.8, 1],
    [0, 1.5, 0, -1.5, 0],
  );
  const progressWidth = useTransform(
    normalizedProgress,
    (value) => `${value * 100}%`,
  );
  const shadowScale = useTransform(walkerY, [-10, 0], [0.84, 1]);
  const shadowOpacity = useTransform(walkerY, [-10, 0], [0.28, 0.6]);

  useMotionValueEvent(smoothProgress, "change", (latest) => {
    const current = clamp(latest, 0, maxIndex);
    setActiveSlide(Math.round(current));
  });

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || maxIndex === 0) return;

    const setScrollLock = (locked: boolean) => {
      document.body.style.overflow = locked ? "hidden" : "";
      document.documentElement.style.overflow = locked ? "hidden" : "";
      setIsLocked(locked);
    };

    const handleWheel = (event: WheelEvent) => {
      const rect = section.getBoundingClientRect();
      const isSectionActive =
        rect.top <= 0 && rect.bottom >= window.innerHeight;

      if (!isSectionActive) {
        if (isLocked) setScrollLock(false);
        return;
      }

      const delta = event.deltaY;
      const current = progress.get();
      const next = clamp(current + delta * 0.0011, 0, maxIndex);
      const willMove = Math.abs(next - current) > 0.0005;

      if (!willMove) {
        if ((current <= 0 && delta < 0) || (current >= maxIndex && delta > 0)) {
          setScrollLock(false);
          return;
        }
      }

      event.preventDefault();
      if (!isLocked) setScrollLock(true);
      progress.set(next);

      if ((next <= 0 && delta < 0) || (next >= maxIndex && delta > 0)) {
        window.setTimeout(() => setScrollLock(false), 120);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      window.removeEventListener("wheel", handleWheel);
    };
  }, [isLocked, maxIndex, progress]);

  const isWalking = isLocked || activeSlide > 0;

  return React.createElement(
    "section",
    {
      ref: sectionRef,
      className: "relative overscroll-none",
      style: { height: `${Math.max(totalSlides * 135, 320)}vh` },
    },
    React.createElement(
      "div",
      {
        className:
          "sticky top-0 h-screen overflow-hidden rounded-[2rem] bg-black",
      },
      React.createElement(
        "div",
        {
          className:
            "absolute left-1/2 top-8 z-50 flex -translate-x-1/2 items-center gap-4 rounded-full border border-white/10 bg-black/35 px-4 py-2 backdrop-blur-md",
        },
        React.createElement(
          "span",
          { className: "text-sm font-medium text-white/70" },
          "Scroll to Explore",
        ),
        React.createElement(
          "div",
          { className: "h-1 w-32 overflow-hidden rounded-full bg-white/20" },
          React.createElement(motion.div, {
            className: "h-full bg-[#14B8A6]",
            style: { width: progressWidth },
          }),
        ),
      ),
      React.createElement(
        motion.div,
        {
          className: "absolute bottom-16 left-0 z-50",
          style: { x: walkerX, y: walkerY, rotate: walkerRotate },
        },
        React.createElement(Walker, { isWalking }),
        React.createElement(motion.div, {
          className: "mx-auto mt-1 h-3 w-12 rounded-full bg-black/30 blur-sm",
          style: { scale: shadowScale, opacity: shadowOpacity },
        }),
      ),
      React.createElement(
        "div",
        {
          className: "absolute bottom-8 left-1/2 z-40 -translate-x-1/2",
        },
        React.createElement(
          "div",
          {
            className:
              "flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-4 py-2 backdrop-blur-md",
          },
          ...milestones.map((milestone, index) =>
            React.createElement(TimelineDot, {
              key: milestone.year,
              milestone,
              index,
              progress: normalizedProgress,
              totalSlides,
            }),
          ),
        ),
      ),
      React.createElement(
        motion.div,
        {
          className: "flex h-full",
          style: { x: trackX },
        },
        ...milestones.map((milestone, index) =>
          React.createElement(TimelineSlide, {
            key: milestone.year,
            milestone,
            index,
            progress: normalizedProgress,
            totalSlides,
          }),
        ),
      ),
      React.createElement("div", {
        className:
          "pointer-events-none absolute inset-y-0 left-0 z-20 w-32 bg-gradient-to-r from-black/60 to-transparent",
      }),
      React.createElement("div", {
        className:
          "pointer-events-none absolute inset-y-0 right-0 z-20 w-32 bg-gradient-to-l from-black/60 to-transparent",
      }),
    ),
  );
}
