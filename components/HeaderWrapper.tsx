"use client";

import { SiteHeader } from "./SiteHeader";
import { useSearchParams } from "next/navigation";

interface HeaderWrapperProps {
  lang?: string;
}

export function HeaderWrapper({ lang }: HeaderWrapperProps) {
  // This component bridges server and client components
  // It reads searchParams on the client side
  return <SiteHeader lang={lang} />;
}