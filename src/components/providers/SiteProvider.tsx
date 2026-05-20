"use client";

import type { ReactNode } from "react";
import dynamic from "next/dynamic";
import { SiteStoreProvider } from "@/hooks/useSiteStore";
import { CartDrawer } from "@/components/CartDrawer";
import { RewardsModal } from "@/components/RewardsModal";
import { Toast } from "@/components/Toast";

const AgeGate = dynamic(
  () => import("@/components/AgeGate").then((mod) => mod.AgeGate),
  { ssr: false },
);

export function SiteProvider({ children }: { children: ReactNode }) {
  return (
    <SiteStoreProvider>
      {children}
      <AgeGate />
      <CartDrawer />
      <RewardsModal />
      <Toast />
    </SiteStoreProvider>
  );
}
