import Link from 'next/link';

export function ContactStrap() {
  return (
    <section className="section-padding">
      <div className="container-shell">
        <div className="overflow-hidden rounded-[2rem] bg-primary-gradient px-6 py-10 text-white shadow-glow sm:px-10 lg:px-14 lg:py-14">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <span className="section-kicker border-white/20 bg-white/10 text-white">Let&apos;s Build Better Operations</span>
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Ready for a facility partner that brings structure, speed, and accountability?
              </h2>
              <p className="mt-4 text-base leading-7 text-white/80">
                Speak with our team about integrated service models, mobilisation planning, and performance-led support for your sites.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/contact-us" className="button-secondary border-white/30 bg-white text-slate-900 hover:text-primary-dark">
                Request a Consultation
              </Link>
              <Link href="/services/integrated-facility-management" className="button-ghost border border-white/20 bg-white/10 text-white hover:bg-white/15 hover:text-white">
                Explore Services
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
