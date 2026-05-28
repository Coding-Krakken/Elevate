"use client";

import { Truck } from "lucide-react";
import { useStorefrontContent } from "@/hooks/useStorefrontContent";
import { toElementStyle } from "@/lib/style-overrides";

export function TopBar() {
  const { homepage, styleOverrides } = useStorefrontContent();

  return (
    <div className="border-b border-white/5 bg-[#06090c] py-1.5 text-center text-[11px] font-semibold tracking-[0.14em] text-lime-300">
      <p className="inline-flex items-center gap-1.5" style={toElementStyle(styleOverrides?.["topbar-text"])}>
        <Truck className="h-3 w-3" />
        {homepage.topBar.text}
      </p>
    </div>
  );
}
