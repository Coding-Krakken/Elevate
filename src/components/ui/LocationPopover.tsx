"use client";

import { MapPin } from "lucide-react";
import { useSiteStore } from "@/hooks/useSiteStore";

const locations = ["West Hollywood, CA", "Beverly Hills, CA", "Santa Monica, CA"];

export function LocationPopover() {
  const { isLocationOpen, closeLocation } = useSiteStore();

  if (!isLocationOpen) {
    return null;
  }

  return (
    <div className="absolute right-0 top-[calc(100%+0.5rem)] z-40 w-64 rounded-xl border border-white/15 bg-[#0d1318] p-3 shadow-2xl">
      <p className="mb-2 px-2 text-xs tracking-[0.15em] text-slate-400">SELECT DELIVERY AREA</p>
      <div className="space-y-1">
        {locations.map((loc) => (
          <button
            key={loc}
            onClick={closeLocation}
            className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm text-slate-200 transition hover:bg-white/10"
          >
            <MapPin className="h-3.5 w-3.5 text-lime-300" />
            {loc}
          </button>
        ))}
      </div>
    </div>
  );
}
