"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import {
  AnimatePresence,
  motion,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { ChevronDown, Menu, X, ArrowRight } from "lucide-react";
import { usePathname } from "next/navigation";

import { navigation } from "@/lib/navigation";
import { cn } from "@/lib/utils";

/**
 * Helper to determine if a route is active
 */
function isActive(
  pathname: string,
  href?: string,
  children?: { href: string }[],
) {
  if (href === "/" && pathname !== "/") return false;
  if (href && pathname.startsWith(href)) return true;
  return Boolean(children?.some((item) => pathname.startsWith(item.href)));
}

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();

  // Handle scroll visibility (Hide on scroll down, show on scroll up)
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setVisible(false);
    } else {
      setVisible(true);
    }
    setScrolled(latest > 20);
  });

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [mobileOpen]);

  return (
    <>
      <motion.header
      className={cn(
        "fixed inset-x-0 top-0 z-50 flex justify-center transition-colors duration-500",
        scrolled
          ? "bg-white/95 shadow-md backdrop-blur-lg border-b border-slate-200"
          : "bg-white/80 backdrop-blur-md border-b border-white/20 sm:bg-white/50 sm:backdrop-blur-sm",
      )}
      animate={{ y: visible ? 0 : -100 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="container-shell w-full">
        <nav className="relative flex items-center justify-between gap-4 px-4 py-2 sm:px-6">
          {/* Brand Logo */}
          <Link href="/" className="group relative block">
            <Image
              src="/logos/logo.png"
              alt="DK Enterprise"
              width={160}
              height={48}
              priority
              className="h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navigation.map((item) => (
              <DesktopNavLink
                key={item.label}
                item={item}
                pathname={pathname}
              />
            ))}
          </div>

          {/* Action Area */}
          <div className="flex items-center gap-3">
            <Link
              href="/contact-us"
              className="hidden sm:inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary hover:shadow-lg active:scale-95"
            >
              Contact Us
            </Link>

            <button
              onClick={() => setMobileOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white transition-colors hover:bg-slate-50 lg:hidden"
            >
              <Menu className="h-5 w-5 text-slate-700" />
            </button>
          </div>
        </nav>
      </div>

      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <MobileMenu
            navigation={navigation}
            onClose={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

/**
 * Desktop Nav Item with Dropdown
 */
function DesktopNavLink({ item, pathname }: { item: any; pathname: string }) {
  const [hovered, setHovered] = useState(false);
  const active = isActive(pathname, item.href, item.children);

  return (
    <div
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link
        href={item.href ?? "#"}
        className={cn(
          "relative flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
          active ? "text-primary" : "text-slate-600 hover:text-slate-950",
        )}
      >
        {item.label}
        {item.children && (
          <ChevronDown
            className={cn(
              "h-3 w-3 transition-transform",
              hovered && "rotate-180",
            )}
          />
        )}
        {active && (
          <motion.div
            layoutId="nav-active"
            className="absolute inset-0 z-[-1] rounded-full bg-primary/5 border border-primary/10"
          />
        )}
      </Link>

      {item.children && (
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute left-0 top-full pt-3"
            >
              <div className="w-64 rounded-3xl border border-white/50 bg-white/90 p-2 shadow-2xl backdrop-blur-xl">
                {item.children.map((child: any) => (
                  <Link
                    key={child.href}
                    href={child.href}
                    className="group flex flex-col gap-0.5 rounded-2xl px-4 py-3 transition-colors hover:bg-primary/5"
                  >
                    <span className="text-sm font-bold text-slate-900 group-hover:text-primary">
                      {child.label}
                    </span>
                    {child.description && (
                      <span className="text-xs text-slate-500 line-clamp-1">
                        {child.description}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}

function MobileMenu({
  navigation,
  onClose,
}: {
  navigation: any[];
  onClose: () => void;
}) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-md lg:hidden"
      />
      <motion.aside
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed inset-y-0 right-0 z-[70] flex w-full max-w-sm flex-col bg-white shadow-2xl lg:hidden"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <span className="text-lg font-bold text-slate-900">Menu</span>
          <button onClick={onClose} className="rounded-full bg-slate-100 p-2 transition hover:bg-slate-200">
            <X className="h-5 w-5 text-slate-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-2">
          {navigation.map((item) => (
            <div key={item.label} className="flex flex-col">
              {item.children ? (
                <button
                  onClick={() =>
                    setExpanded(expanded === item.label ? null : item.label)
                  }
                  className="flex w-full items-center justify-between py-3 text-left text-lg font-bold text-slate-900"
                >
                  {item.label}
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 text-slate-400 transition-transform",
                      expanded === item.label && "rotate-180"
                    )}
                  />
                </button>
              ) : (
                <Link
                  href={item.href ?? "#"}
                  onClick={onClose}
                  className="block py-3 text-lg font-bold text-slate-900"
                >
                  {item.label}
                </Link>
              )}

              {item.children && (
                <AnimatePresence>
                  {expanded === item.label && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-2 mb-4 flex flex-col gap-3 border-l-2 border-slate-100 pl-4 ml-2">
                        {item.children.map((child: any) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={onClose}
                            className="flex items-center gap-2 py-1.5 text-[15px] font-medium text-slate-600 transition-colors hover:text-primary"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          ))}
        </div>

        <div className="border-t border-slate-100 p-6">
          <Link
            href="/contact-us"
            onClick={onClose}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 font-bold text-white shadow-lg shadow-primary/20 transition hover:bg-primary-dark"
          >
            Get Started
          </Link>
        </div>
      </motion.aside>
    </>
  );
}
