import Link from 'next/link';
import { ArrowRight, Mail, MapPin, Phone } from 'lucide-react';

import { navigation } from '@/lib/navigation';

const quickLinks = ['/careers', '/contact-us', '/about-us/clientele', '/about-us/group-of-companies'];
const quickLinkLabels: Record<string, string> = {
  '/careers': 'Careers',
  '/contact-us': 'Contact Us',
  '/about-us/clientele': 'Clientele',
  '/about-us/group-of-companies': 'Group of Companies',
};

export function Footer() {
  return (
    <footer className="bg-slate-950 text-white">
      <div className="container-shell py-16">
        <div className="grid gap-10 lg:grid-cols-[1.2fr,0.7fr,0.7fr,0.7fr,1fr]">
          <div>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-lg font-bold text-primary-light">DK</div>
              <div>
                <p className="text-lg font-semibold">DK Enterprise</p>
                <p className="text-sm text-white/60">Facility Management Company</p>
              </div>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-7 text-white/65">
              Enterprise facility management built around service discipline, compliance, and resilient day-to-day operations.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">Quick Links</h3>
            <ul className="mt-5 space-y-3 text-sm text-white/70">
              {quickLinks.map((href) => (
                <li key={href}>
                  <Link href={href} className="transition hover:text-primary-light">
                    {quickLinkLabels[href]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">Services</h3>
            <ul className="mt-5 space-y-3 text-sm text-white/70">
              {navigation[1].children?.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition hover:text-primary-light">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">Sectors</h3>
            <ul className="mt-5 space-y-3 text-sm text-white/70">
              {navigation[2].children?.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition hover:text-primary-light">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-white/70">Stay Connected</h3>
            <div className="mt-5 space-y-4 text-sm text-white/70">
              <p className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-primary-light" />
                Ahmedabad, Gujarat, India
              </p>
              <p className="flex gap-3">
                <Phone className="mt-0.5 h-4 w-4 text-primary-light" />
                +91 79 4000 1122
              </p>
              <p className="flex gap-3">
                <Mail className="mt-0.5 h-4 w-4 text-primary-light" />
                contact@dkenterprise.com
              </p>
            </div>
           
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} DK Enterprise. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/" className="transition hover:text-primary-light">
              Privacy Policy
            </Link>
            <Link href="/" className="transition hover:text-primary-light">
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
