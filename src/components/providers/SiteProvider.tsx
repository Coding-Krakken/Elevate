"use client";

import type { ReactNode } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { SiteStoreProvider } from "@/hooks/useSiteStore";
import { StorefrontContentProvider } from "@/hooks/useStorefrontContent";
import { CartDrawer } from "@/components/CartDrawer";
import { RewardsModal } from "@/components/RewardsModal";
import { Toast } from "@/components/Toast";

const AgeGate = dynamic(
  () => import("@/components/AgeGate").then((mod) => mod.AgeGate),
  { ssr: false },
);

export function SiteProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  return (
    <StorefrontContentProvider>
      <SiteStoreProvider>
        {children}
        <AgeGate />
        {!isAdminRoute ? <CartDrawer /> : null}
        {!isAdminRoute ? <RewardsModal /> : null}
        {!isAdminRoute ? <Toast /> : null}
      </SiteStoreProvider>
    </StorefrontContentProvider>
  );
}
