"use client";

import { useEffect } from "react";
import { ShieldCheck } from "lucide-react";
import { useAgeGate } from "@/hooks/useAgeGate";

export function AgeGate() {
  const { accepted, accept, decline } = useAgeGate();

  useEffect(() => {
    if (accepted) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [accepted]);

  if (accepted) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/85 px-4 backdrop-blur-sm">
      <div
        className="w-full max-w-lg rounded-2xl border border-lime-300/30 bg-[#0b1014]/95 p-7 shadow-[0_0_80px_rgba(176,38,255,0.3)]"
        role="dialog"
        aria-modal="true"
        aria-label="Age verification"
      >
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-lime-300/40 bg-lime-300/10 px-3 py-1 text-xs font-semibold tracking-[0.2em] text-lime-300">
          <ShieldCheck className="h-3.5 w-3.5" />
          AGE VERIFICATION
        </div>
        <h2 className="text-3xl font-black tracking-[0.18em] text-white">ARE YOU 21 OR OLDER?</h2>
        <p className="mt-3 text-sm text-slate-300">
          You must be of legal consumption age in your area to access this site. For adults 21+ only where required by law.
        </p>
        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <button
            onClick={accept}
            className="rounded-xl bg-lime-300 px-4 py-3 text-sm font-bold tracking-[0.12em] text-black transition hover:bg-lime-200"
          >
            ENTER SITE
          </button>
          <button
            onClick={decline}
            className="rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm font-bold tracking-[0.12em] text-white transition hover:bg-white/10"
          >
            LEAVE SITE
          </button>
        </div>
        <p className="mt-5 text-xs text-slate-400">
          Keep out of reach of children. Follow all local laws.
        </p>
      </div>
    </div>
  );
}
