"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export type Milestone = {
  year: string;
  title: string;
  description: string;
  image: string;
};

export function TimelineScroller({ milestones }: { milestones: Milestone[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;

    if (!container || !track || milestones.length === 0) {
      return;
    }

    const ctx = gsap.context(() => {
      const getTravel = () =>
        Math.max(track.scrollWidth - window.innerWidth, 0);

      const getDistance = () => Math.max(track.scrollWidth, window.innerWidth);

      gsap.to(track, {
        x: () => -getTravel(),
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: () => `+=${getDistance()}`,
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
        },
      });
    }, container);

    return () => ctx.revert();
  }, [milestones]);

  return (
    <section
      ref={containerRef}
      className="relative h-[100svh] overflow-hidden bg-[linear-gradient(180deg,#effdfa_0%,#f8fffe_38%,#ffffff_100%)] text-slate-900"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-0 h-full w-full bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.18),transparent_32%),radial-gradient(circle_at_top_right,rgba(14,165,233,0.12),transparent_28%)]" />
        <div className="absolute bottom-24 left-0 h-px w-full bg-primary/20" />

        {[10, 23, 38, 54, 71, 87].map((left, index) => (
          <div
            key={left}
            className="absolute bottom-24 w-px bg-primary/20"
            style={{
              left: `${left}%`,
              height: index % 2 === 0 ? "140px" : "112px",
            }}
          >
            <div className="absolute -top-4 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full border border-primary/30 bg-white shadow-[0_0_0_6px_rgba(255,255,255,0.65)]" />
          </div>
        ))}

        <svg
          className="absolute bottom-[92px] left-[7%] h-24 w-16 text-primary/20"
          viewBox="0 0 80 160"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M40 10C26 10 16 20 16 34V116"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M40 10C54 10 64 20 64 34V116"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M16 116H64"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <circle cx="40" cy="34" r="10" fill="currentColor" />
        </svg>

        <svg
          className="absolute bottom-[92px] left-[49%] h-28 w-20 text-cyan-400/20"
          viewBox="0 0 100 190"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M50 18C35 18 24 29 24 45V150"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M50 18C65 18 76 29 76 45V150"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M24 150H76"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <circle cx="50" cy="45" r="11" fill="currentColor" />
        </svg>

        <svg
          className="absolute bottom-0 left-0 h-28 w-full text-primary/10"
          viewBox="0 0 1440 200"
          preserveAspectRatio="none"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M0 150C120 128 240 174 360 156C480 138 600 92 720 108C840 124 960 174 1080 166C1200 158 1320 118 1440 134V200H0V150Z"
            fill="currentColor"
          />
        </svg>
      </div>

      {/* <div
        ref={walkerRef}
        className="pointer-events-none absolute left-[8%] top-1/2 z-30 hidden -translate-x-1/2 -translate-y-[58%] md:block"
      >
        Walking person temporarily disabled as requested.
      </div> */}

      <div className="relative z-10 flex h-full flex-col justify-between px-6 py-10 md:px-10 lg:px-16">
        <div className="flex items-center justify-between gap-6">
          <div>
            <p className="inline-flex rounded-full border border-primary/15 bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-primary-dark">
              Milestones
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 md:text-5xl">
              The journey, year by year
            </h2>
          </div>

          <div className="hidden text-right md:block">
            <p className="text-xs uppercase tracking-[0.35em] text-primary-dark/80">
              Scroll horizontally
            </p>
            <p className="mt-2 max-w-xs text-sm leading-6 text-slate-600">
              Timeline styling now includes reference-inspired SVG landmarks, a
              moving balloon, and your site’s teal/cyan brand palette.
            </p>
          </div>
        </div>

        {/* <div className="pointer-events-none absolute left-6 right-6 top-1/2 z-20 hidden -translate-y-1/2 md:block md:left-10 md:right-10 lg:left-16 lg:right-16">
          Moving progress line temporarily disabled as requested.
        </div> */}

        <div
          ref={trackRef}
          className="relative z-10 flex h-full items-center gap-10 pl-2 pr-[18vw] md:gap-14 md:pl-6"
        >
          {milestones.map((item) => {
            return (
              <article
                key={item.year}
                className="relative flex h-full w-[82vw] min-w-[82vw] shrink-0 items-center md:w-[520px] md:min-w-[520px]"
              >
                <div className="absolute left-0 top-1/2 hidden h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[5px] border-white bg-primary shadow-[0_0_0_1px_rgba(20,184,166,0.25)] md:block" />

                <div className="absolute left-[2px] top-1/2 hidden h-32 w-px bg-primary/20 md:block" />

                <div className="relative w-full max-w-[390px] md:translate-y-24 lg:translate-y-28">
                  <div className="absolute -top-24 left-0 z-20 text-[72px] font-bold leading-none tracking-[-0.06em] text-primary/15 md:-top-32 md:text-[110px]">
                    {item.year}
                  </div>

                  <div className="relative z-10 rounded-[24px] border border-white/70 bg-white/90 p-3 shadow-[0_18px_40px_rgba(15,23,42,0.08)] backdrop-blur-sm md:mt-14">
                    <div className="flex items-center gap-3">
                      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[18px] bg-slate-100 md:h-28 md:w-28">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          sizes="112px"
                          className="object-cover"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="text-lg font-semibold tracking-tight text-slate-900 md:text-xl">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-xs leading-6 text-slate-600 md:text-sm">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="relative z-20 flex items-center justify-between gap-4 text-xs uppercase tracking-[0.35em] text-primary-dark md:hidden">
          <span>{milestones[0]?.year}</span>
          <span>Timeline</span>
          <span>{milestones[milestones.length - 1]?.year}</span>
        </div>
      </div>
    </section>
  );
}
