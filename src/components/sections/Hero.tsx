"use client";

import Image from "next/image";
import Link from "next/link";
import { Leaf, ShieldCheck, Sparkles } from "lucide-react";
import { useStorefrontContent } from "@/hooks/useStorefrontContent";
import { toElementStyle } from "@/lib/style-overrides";

export function Hero() {
  const { homepage, styleOverrides } = useStorefrontContent();
  const { hero } = homepage;

  return (
    <section
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#060a0b] px-4 py-5 md:px-6 md:py-6"
      style={toElementStyle(styleOverrides?.["section-hero"])}
    >
      <Image
        src={hero.backgroundImage ?? "/images/hero-backdrop-reference.png"}
        alt="Green neon product backdrop"
        fill
        priority
        sizes="(min-width: 1024px) 1540px, 100vw"
        className="object-cover object-center opacity-96"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(1,3,4,0.82)_0%,rgba(1,4,4,0.66)_21%,rgba(2,6,6,0.34)_40%,rgba(3,7,7,0.18)_58%,rgba(4,8,8,0.2)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_31%_58%,rgba(124,255,58,0.12)_0,transparent_34%),repeating-radial-gradient(circle_at_31%_58%,rgba(124,255,58,0.12)_0_1px,transparent_1px_30px)] opacity-38" />

      <div className="relative grid items-end gap-4 lg:min-h-[370px] lg:grid-cols-[0.92fr_1.28fr]">
        <div className="pt-1 lg:max-w-[620px] lg:pb-3">
          <h1
            className="m-0 text-[clamp(2rem,8.2vw,8.3rem)] font-black uppercase leading-[0.86] tracking-[0.1em] max-[767px]:leading-[0.9] max-[767px]:tracking-[0.08em]"
            style={{ fontFamily: 'var(--font-orbitron), "Orbitron", "Eurostile Extended", "Microgramma D Extended", "Bank Gothic", sans-serif' }}
          >
            <span className="block text-[#f4f4f4]" style={toElementStyle(styleOverrides?.["hero-title1"])}>{hero.titleLine1}</span>
            <span
              className="block text-[#7cff00] [text-shadow:0_0_8px_rgba(124,255,0,0.35),0_0_18px_rgba(124,255,0,0.22)]"
              style={toElementStyle(styleOverrides?.["hero-title2"])}
            >
              {hero.titleLine2}
            </span>
          </h1>
          <p className="mt-3 text-[15px] font-semibold tracking-[0.1em] text-slate-200" style={toElementStyle(styleOverrides?.["hero-subtitle"])}>
            {hero.subtitle}
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href={hero.primaryCtaHref || "#"}
              className="rounded-md bg-lime-300 px-8 py-3 text-sm font-black tracking-[0.12em] text-black transition hover:bg-lime-200"
              style={toElementStyle(styleOverrides?.["hero-cta1"])}
            >
              {hero.primaryCta}
            </Link>
            <Link
              href={hero.secondaryCtaHref || "#"}
              className="rounded-md border border-lime-300/45 bg-black/35 px-8 py-3 text-sm font-black tracking-[0.12em] text-white transition hover:border-lime-300/80"
              style={toElementStyle(styleOverrides?.["hero-cta2"])}
            >
              {hero.secondaryCta}
            </Link>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 text-[11px] font-semibold tracking-[0.08em] text-slate-200 md:grid-cols-3 md:text-[12px]">
            <div className="flex items-center gap-2">
              <Leaf size={16} className="text-lime-300" />
              <span style={toElementStyle(styleOverrides?.["hero-highlight-0"])}>{hero.highlights[0] ?? "PREMIUM QUALITY"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-lime-300" />
              <span style={toElementStyle(styleOverrides?.["hero-highlight-1"])}>{hero.highlights[1] ?? "EXPERTLY CURATED"}</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-lime-300" />
              <span style={toElementStyle(styleOverrides?.["hero-highlight-2"])}>{hero.highlights[2] ?? "100% SATISFACTION"}</span>
            </div>
          </div>
        </div>

        <div className="relative min-h-[260px] md:min-h-[340px]">

          <div className="absolute right-[2%] top-[8%] text-right text-[54px] leading-[0.92] md:text-[72px]">
            <p
              style={{ fontFamily: "var(--font-script)", ...toElementStyle(styleOverrides?.["hero-script1"]) }}
              className="text-fuchsia-300 [text-shadow:0_0_20px_rgba(176,38,255,0.82)]"
            >
              {hero.scriptLine1}
            </p>
            <p
              style={{ fontFamily: "var(--font-script)", ...toElementStyle(styleOverrides?.["hero-script2"]) }}
              className="text-lime-300 [text-shadow:0_0_20px_rgba(156,255,46,0.82)]"
            >
              {hero.scriptLine2}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
