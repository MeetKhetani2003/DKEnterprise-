import Link from "next/link";

export function ContactStrap() {
  return (
    <section className="section-padding bg-slate-100">
      <div className="container-shell text-center">
        {/* Title */}
        <h2 className="text-3xl sm:text-4xl font-semibold text-slate-900">
          Contact US
        </h2>

        {/* Description */}
        <p className="mt-4 max-w-2xl mx-auto text-slate-600 leading-7">
          For detailed information about our services or any business-related
          enquiries, please feel free to get in touch with us.
        </p>

        {/* CTA Button */}
        <div className="mt-8">
          <Link
            href="/contact-us"
            className="inline-flex items-center gap-2 rounded-lg border border-primary px-6 py-3 text-primary font-medium hover:bg-primary hover:text-white transition"
          >
            Enquire Now →
          </Link>
        </div>
      </div>
    </section>
  );
}
