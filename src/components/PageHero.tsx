"use client";

import Image from "next/image";

type SectorHeroProps = {
  kicker?: string;
  title: string;
  description?: string;
  image: string;
};

export function PageHero({
  kicker,
  title,
  description,
  image,
}: SectorHeroProps) {
  return (
    <section className="px-4 pt-6">
      <div className="relative overflow-hidden rounded-[2rem]">
        <div className="relative h-[260px] w-full sm:h-[320px]">
          <Image src={image} alt={title} fill className="object-cover" />
          <div className="absolute inset-0 bg-slate-950/60" />
        </div>

        <div className="absolute inset-0 flex items-center px-8 sm:px-12 lg:px-16">
          <div className="max-w-3xl text-white">
            {kicker ? (
              <span className="section-kicker border-white/20 bg-white/10 text-white">
                {kicker}
              </span>
            ) : null}
            <h1 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
              {title}
            </h1>
            {description ? (
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
                {description}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
