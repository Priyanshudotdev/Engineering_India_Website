"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/landing/navbar";
import Footer from "@/components/landing/footer";
import VibeathonNavbar from "@/components/vibeathon/VibeathonNavbar";
import VibeathonFooter from "@/components/vibeathon/VibeathonFooter";

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");
  const isVibeathonRoute = pathname?.startsWith("/vibeathon");

  return (
    <>
      {!isAdminRoute && !isVibeathonRoute && <Navbar />}
      {isVibeathonRoute && <VibeathonNavbar />}
      {children}
      {!isAdminRoute && !isVibeathonRoute && <Footer />}
      {isVibeathonRoute && <VibeathonFooter />}
    </>
  );
}
