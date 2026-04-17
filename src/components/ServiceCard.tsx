import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type ServiceCardProps = {
  title: string;
  description?: string;
  image: string;
  href: string;
  label?: string;
};

export function ServiceCard({
  title,
  description,
  image,
  href,
  label = "Learn More",
}: ServiceCardProps) {
  return (
    <Link
      href={href}
      className="group block rounded-2xl bg-white border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-xl shadow-primary hover:border-primary hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition duration-700 group-hover:scale-105"
        />

        {/* Soft gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="px-6 py-5 bg-white">
        <h3 className="text-lg font-semibold text-slate-900 tracking-tight">
          {title}
        </h3>
      </div>
    </Link>
  );
}
