"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { useSiteStore } from "@/hooks/useSiteStore";

export function RewardsModal() {
  const { isRewardsOpen, closeRewards } = useSiteStore();

  useEffect(() => {
    if (!isRewardsOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeRewards();
      }
    };

    document.addEventListener("keydown", onEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onEscape);
    };
  }, [closeRewards, isRewardsOpen]);

  if (!isRewardsOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[85] flex items-center justify-center bg-black/70 px-4" onClick={closeRewards}>
      <div
        className="w-full max-w-md rounded-2xl border border-white/15 bg-[#0b1015] p-6"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Rewards signup information"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black tracking-[0.15em] text-white">ELEVATE REWARDS</h3>
          <button
            className="rounded-md border border-white/15 p-2 text-slate-300"
            onClick={closeRewards}
            aria-label="Close rewards modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-3 text-sm text-slate-300">
          Rewards signup is a demo interaction in this environment. Connect your real signup flow to enable account enrollment.
        </p>
        <button
          className="mt-5 w-full rounded-xl bg-lime-300 px-4 py-3 text-sm font-black tracking-[0.11em] text-black"
          onClick={closeRewards}
        >
          CONTINUE BROWSING
        </button>
      </div>
    </div>
  );
}
