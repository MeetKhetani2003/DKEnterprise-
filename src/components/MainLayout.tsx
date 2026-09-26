"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export function MainLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  
  return (
    <main className={`overflow-hidden ${isAdmin ? "" : "pt-16"}`}>
      {children}
    </main>
  );
}
