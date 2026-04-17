import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CheckCircle2, Settings, Sparkles } from "lucide-react";

import { PageTransition } from "@/components/PageTransition";
import { Reveal } from "@/components/Reveal";
import { getSectorBySlug } from "@/lib/content";
import { sectors } from "@/lib/sectors-data";
import { PageHero } from "@/components/PageHero";

export function generateStaticParams() {
  return sectors.map((sector) => ({ slug: sector.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const sector = getSectorBySlug(params.slug);

  if (!sector) return { title: "Sector Not Found" };

  return {
    title: sector.title,
    description: sector.description,
  };
}

export default function SectorPage({ params }: { params: { slug: string } }) {
  const sector = getSectorBySlug(params.slug);

  if (!sector) notFound();

  const sectorImages = sector.features.map((feature) => feature.image);

  return (
    <PageTransition>
      {/* ✅ HERO */}
      <PageHero title={sector.title} image={sector.image} />

      {/* ✅ HEADING + DETAILS */}
      <section className="section-padding">
        <div className="container-shell text-center max-w-3xl ">
          <Reveal>
            <h1 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-semibold text-slate-900 leading-tight">
              {sector.title}
            </h1>

            <p className="mt-5 text-slate-600 leading-7 text-base sm:text-lg">
              {sector.description}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ✅ PHOTOS */}
      {sectorImages.length > 0 && (
        <section className="section-padding pt-0">
          <div className="container-shell">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {sectorImages.map((img, index) => (
                <div
                  key={index}
                  className="group relative h-[240px] overflow-hidden rounded-[1.5rem]"
                >
                  <Image
                    src={img}
                    alt="sector"
                    fill
                    className="object-cover transition duration-500 group-hover:scale-110"
                  />

                  {/* subtle overlay */}
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ✅ ADVANTAGES */}
      <section className="section-padding">
        <div className="container-shell">
          <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6 sm:p-8">
            {/* Heading */}
            <div className="flex items-center gap-3">
              <Sparkles className="text-primary h-6 w-6" />
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
                Advantages
              </h2>
            </div>

            {/* List */}
            <ol className="mt-6 space-y-4 text-slate-700 leading-7">
              {sector.advantages.map((item, index) => (
                <li key={index}>
                  {index + 1}. {item}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ✅ KEY FEATURES */}
      <section className="section-padding pt-0">
        <div className="container-shell">
          <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6 sm:p-8">
            {/* Heading */}
            <div className="flex items-center gap-3">
              <Settings className="text-primary h-6 w-6" />
              <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
                Key Features
              </h2>
            </div>

            {/* List */}
            <ol className="mt-6 space-y-4 text-slate-700 leading-7">
              {sector.features.map((feature, index) => (
                <li key={feature.title}>
                  {index + 1}. {feature.title}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
