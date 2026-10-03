"use client";

import React from "react";
import { usePathname } from 'next/navigation';

const Saperator = () => {
  const pathname = usePathname();

  if (pathname.startsWith('/admin')) {
    return null;
  }

  return <div className="bg-zinc-300 w-full h-[1.5px] my-8"></div>;
};

export default Saperator;
