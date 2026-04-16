"use client";

import Image from "next/image";
import Link from "next/link";

type SectorHeroProps = {
  title: string;
  image: string;
};

export function PageHero({ title, image }: SectorHeroProps) {
  return (
    <section className="px-4 pt-6">
      <div className="relative overflow-hidden rounded-[2rem]">
        {/* Background Image */}
        <div className="relative h-[220px] w-full">
          <Image src={image} alt={title} fill className="object-cover" />

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/60" />
        </div>

        {/* Content */}
        <div className="absolute inset-0 flex items-center px-8 sm:px-12 lg:px-16">
          <div className="flex flex-wrap items-center gap-2 text-white text-lg sm:text-xl">
            <Link href="/corporate" className="hover:text-white/80">
              Corporate
            </Link>

            <span className="opacity-70">›</span>

            <Link href="/investors" className="hover:text-white/80">
              Investors
            </Link>

            <span className="opacity-70">›</span>

            {/* Active */}
            <span className="text-primary font-semibold">{title}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
