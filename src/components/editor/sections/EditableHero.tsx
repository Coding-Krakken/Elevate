"use client";

import Image from "next/image";
import { Leaf, ShieldCheck, Sparkles } from "lucide-react";
import { EditableElement } from "../EditableElement";
import { useEditor } from "@/hooks/useEditor";

export function EditableHero() {
  const { content } = useEditor();
  const hero = content.homepage.hero;

  return (
    <EditableElement elementId="section-hero" elementType="section" sectionId="hero" path="homepage.hero">
      <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#060a0b] px-4 py-5 md:px-6 md:py-6">
        <Image
          src="/images/hero-backdrop-reference.png"
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
              <EditableElement elementId="hero-title1" elementType="text" sectionId="hero" path="homepage.hero.titleLine1" className="inline-block">
                <span className="block text-[#f4f4f4]">{hero.titleLine1}</span>
              </EditableElement>
              <EditableElement elementId="hero-title2" elementType="text" sectionId="hero" path="homepage.hero.titleLine2" className="inline-block">
                <span className="block text-[#7cff00] [text-shadow:0_0_8px_rgba(124,255,0,0.35),0_0_18px_rgba(124,255,0,0.22)]">{hero.titleLine2}</span>
              </EditableElement>
            </h1>

            <EditableElement elementId="hero-subtitle" elementType="text" sectionId="hero" path="homepage.hero.subtitle">
              <p className="mt-3 text-[15px] font-semibold tracking-[0.1em] text-slate-200">
                {hero.subtitle}
              </p>
            </EditableElement>

            <div className="mt-5 flex flex-wrap gap-3">
              <EditableElement elementId="hero-cta1" elementType="text" sectionId="hero" path="homepage.hero.primaryCta" className="inline-block">
                <button className="rounded-md bg-lime-300 px-8 py-3 text-sm font-black tracking-[0.12em] text-black transition hover:bg-lime-200">
                  {hero.primaryCta}
                </button>
              </EditableElement>
              <EditableElement elementId="hero-cta2" elementType="text" sectionId="hero" path="homepage.hero.secondaryCta" className="inline-block">
                <button className="rounded-md border border-lime-300/45 bg-black/35 px-8 py-3 text-sm font-black tracking-[0.12em] text-white transition hover:border-lime-300/80">
                  {hero.secondaryCta}
                </button>
              </EditableElement>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 text-[11px] font-semibold tracking-[0.08em] text-slate-200 md:grid-cols-3 md:text-[12px]">
              <div className="flex items-center gap-2">
                <Leaf size={16} className="text-lime-300" />
                <EditableElement elementId="hero-highlight-0" elementType="text" sectionId="hero" path="homepage.hero.highlights.0">
                  <span>{hero.highlights[0] ?? "PREMIUM QUALITY"}</span>
                </EditableElement>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-lime-300" />
                <EditableElement elementId="hero-highlight-1" elementType="text" sectionId="hero" path="homepage.hero.highlights.1">
                  <span>{hero.highlights[1] ?? "EXPERTLY CURATED"}</span>
                </EditableElement>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-lime-300" />
                <EditableElement elementId="hero-highlight-2" elementType="text" sectionId="hero" path="homepage.hero.highlights.2">
                  <span>{hero.highlights[2] ?? "100% SATISFACTION"}</span>
                </EditableElement>
              </div>
            </div>
          </div>

          <div className="relative min-h-[260px] md:min-h-[340px]">
            <div className="absolute right-[2%] top-[8%] text-right text-[54px] leading-[0.92] md:text-[72px]">
              <EditableElement elementId="hero-script1" elementType="text" sectionId="hero" path="homepage.hero.scriptLine1" className="inline-block">
                <p style={{ fontFamily: "var(--font-satisfy)" }} className="text-fuchsia-300 [text-shadow:0_0_20px_rgba(176,38,255,0.82)]">{hero.scriptLine1}</p>
              </EditableElement>
              <EditableElement elementId="hero-script2" elementType="text" sectionId="hero" path="homepage.hero.scriptLine2" className="inline-block">
                <p style={{ fontFamily: "var(--font-satisfy)" }} className="text-lime-300 [text-shadow:0_0_20px_rgba(156,255,46,0.82)]">{hero.scriptLine2}</p>
              </EditableElement>
            </div>
          </div>
        </div>
      </section>
    </EditableElement>
  );
}
