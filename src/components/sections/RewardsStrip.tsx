"use client";

import { Gift, Sparkles, Star, Zap } from "lucide-react";
import { useSiteStore } from "@/hooks/useSiteStore";

const perks = [
  { icon: Zap, title: "EARN POINTS", subtitle: "Every time you shop" },
  { icon: Sparkles, title: "EXCLUSIVE DEALS", subtitle: "Members only savings" },
  { icon: Gift, title: "BIRTHDAY REWARDS", subtitle: "Celebrate with us" },
  { icon: Star, title: "EARLY ACCESS", subtitle: "New drops & deals" },
];

export function RewardsStrip() {
  const { openRewards } = useSiteStore();

  return (
    <section className="mt-3 rounded-xl border border-white/10 bg-[#0d1318] px-4 py-2.5">
      <div className="grid gap-2 xl:grid-cols-[1.05fr_2.2fr_auto] xl:items-center">
        <div className="xl:border-r xl:border-white/10 xl:pr-4">
          <p className="text-[36px] font-black leading-none tracking-[0.08em] text-lime-300">SYRACUSE EXOTICZ REWARDS</p>
          <p className="text-[11px] tracking-[0.11em] text-slate-300">MORE POINTS. MORE PERKS. MORE ELEVATION.</p>
        </div>
        <div className="grid gap-1.5 sm:grid-cols-2 lg:grid-cols-4 xl:gap-0">
          {perks.map((perk) => (
            <div
              key={perk.title}
              className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-2 xl:rounded-none xl:border-0 xl:border-l xl:border-white/10 xl:bg-transparent xl:px-4"
            >
              <perk.icon className="h-3.5 w-3.5 text-lime-300" />
              <p className="mt-0.5 text-[10px] font-black tracking-[0.1em] text-white">{perk.title}</p>
              <p className="text-[11px] text-slate-400">{perk.subtitle}</p>
            </div>
          ))}
        </div>
        <div className="xl:border-l xl:border-white/10 xl:pl-4 xl:text-right">
          <button
            onClick={openRewards}
            className="rounded-md bg-lime-300 px-8 py-2.5 text-xs font-black tracking-[0.12em] text-black"
          >
            JOIN FOR FREE
          </button>
          <p className="mt-1.5 text-xs text-slate-400">
            Already a member? <span className="underline">Sign in</span>
          </p>
        </div>
      </div>
    </section>
  );
}
