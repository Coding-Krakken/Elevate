import Image from "next/image";
import { Leaf, ShieldCheck, Sparkles } from "lucide-react";

export function Hero() {
  return (
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
          <h1 className="text-[58px] font-black leading-none tracking-[0.13em] text-white md:text-[92px]">SYRACUSE</h1>
          <p className="mt-1 text-[38px] font-black tracking-[0.15em] text-lime-300 md:text-[54px]">YOUR EXPERIENCE</p>
          <p className="mt-3 text-[15px] font-semibold tracking-[0.1em] text-slate-200">
            PREMIUM CANNABIS. UNMATCHED VIBES.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <button className="rounded-md bg-lime-300 px-8 py-3 text-sm font-black tracking-[0.12em] text-black transition hover:bg-lime-200">
              SHOP NOW
            </button>
            <button className="rounded-md border border-lime-300/45 bg-black/35 px-8 py-3 text-sm font-black tracking-[0.12em] text-white transition hover:border-lime-300/80">
              BROWSE DEALS
            </button>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 text-[11px] font-semibold tracking-[0.08em] text-slate-200 md:grid-cols-3 md:text-[12px]">
            <div className="flex items-center gap-2">
              <Leaf size={16} className="text-lime-300" />
              <span>PREMIUM QUALITY</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-lime-300" />
              <span>EXPERTLY CURATED</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-lime-300" />
              <span>100% SATISFACTION</span>
            </div>
          </div>
        </div>

        <div className="relative min-h-[260px] md:min-h-[340px]">

          <div className="absolute right-[2%] top-[8%] text-right text-[54px] leading-[0.92] md:text-[72px]">
            <p style={{ fontFamily: "var(--font-script)" }} className="text-fuchsia-300 [text-shadow:0_0_20px_rgba(176,38,255,0.82)]">Good VIBES</p>
            <p style={{ fontFamily: "var(--font-script)" }} className="text-lime-300 [text-shadow:0_0_20px_rgba(156,255,46,0.82)]">Higher TIMES</p>
          </div>
        </div>
      </div>
    </section>
  );
}
