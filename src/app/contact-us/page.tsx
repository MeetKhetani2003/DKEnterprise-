import type { Metadata } from "next";

import { ContactForm } from "@/components/ContactForm";
import { PageHero } from "@/components/PageHero";
import { PageTransition } from "@/components/PageTransition";
import { Reveal } from "@/components/Reveal";
import { OfficeSection } from "@/components/OfficeSection";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Connect with DK Enterprise for facility management, security services, environmental support, and partnership enquiries.",
};

export default function ContactUsPage() {
  return (
    <PageTransition>
      <PageHero
        kicker="Contact Us"
        title="Talk to a team that understands complex facility operations."
        description="Whether you need integrated services, a tailored sector solution, or a mobilisation roadmap, we're ready to help."
        image="https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1600&q=80"
      />

      <section className="section-padding">
        <div className="container-shell space-y-6 my-6">
          <Reveal>
            <ContactForm />
          </Reveal>
          <Reveal className="mt-6">
            <OfficeSection />
          </Reveal>
        </div>
      </section>
    </PageTransition>
  );
}
