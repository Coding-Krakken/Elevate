import Image from "next/image";

export function Hero() {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a0f15] px-4 py-5 md:px-6 md:py-6">
      <Image
        src="https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=1800&q=80"
        alt="Neon city night"
        fill
        priority
        className="object-cover object-center opacity-30"
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_35%,rgba(176,38,255,0.52),transparent_45%),radial-gradient(circle_at_85%_75%,rgba(156,255,46,0.16),transparent_32%),linear-gradient(95deg,#0b0f14_5%,rgba(11,15,20,0.7)_42%,rgba(11,15,20,0.3)_70%)]" />

      <div className="relative grid items-end gap-4 lg:min-h-[355px] lg:grid-cols-[0.92fr_1.28fr]">
        <div className="pt-1 lg:pb-3">
          <h1 className="text-[58px] font-black leading-none tracking-[0.13em] text-white md:text-[80px]">ELEVATE</h1>
          <p className="mt-1 text-[38px] font-black tracking-[0.15em] text-lime-300 md:text-[52px]">YOUR EXPERIENCE</p>
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
        </div>

        <div className="relative min-h-[260px] md:min-h-[340px]">
          <div className="absolute left-[8%] top-[44%] h-24 w-24 overflow-hidden rounded-full border border-lime-300/25 shadow-[0_0_40px_rgba(156,255,46,0.25)] md:h-28 md:w-28">
            <Image
              src="https://images.unsplash.com/photo-1603909223429-69bb7101f420?auto=format&fit=crop&w=500&q=80"
              alt="Cannabis flower"
              fill
              className="object-cover object-center"
            />
          </div>
          <div className="absolute left-[24%] top-[8%] h-52 w-40 overflow-hidden rounded-2xl border border-white/20 bg-black/50 shadow-[0_0_50px_rgba(176,38,255,0.35)] md:h-64 md:w-52">
            <Image
              src="https://images.unsplash.com/photo-1611078489935-0cb964de46d6?auto=format&fit=crop&w=600&q=80"
              alt="Elevate product jar"
              fill
              className="object-cover object-[center_38%]"
            />
          </div>
          <div className="absolute left-[53%] top-[1%] h-56 w-14 overflow-hidden rounded-3xl border border-lime-300/35 bg-black/40 md:h-72 md:w-16">
            <Image
              src="https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?auto=format&fit=crop&w=400&q=80"
              alt="Vape product"
              fill
              className="object-cover object-[center_42%]"
            />
          </div>
          <div className="absolute left-[61%] top-[8%] h-56 w-28 overflow-hidden rounded-xl border border-purple-300/35 bg-black/60 shadow-[0_0_55px_rgba(176,38,255,0.3)] md:h-68 md:w-36">
            <Image
              src="https://images.unsplash.com/photo-1611242320536-f12d3541249b?auto=format&fit=crop&w=500&q=80"
              alt="Cannabis product box"
              fill
              className="object-cover object-[center_35%]"
            />
          </div>
          <div className="absolute right-[2%] top-[8%] text-right text-[54px] leading-[0.92] md:text-[72px]">
            <p className="font-[var(--font-script)] text-fuchsia-300 [text-shadow:0_0_20px_rgba(176,38,255,0.82)]">Good VIBES</p>
            <p className="font-[var(--font-script)] text-lime-300 [text-shadow:0_0_20px_rgba(156,255,46,0.82)]">Higher TIMES</p>
          </div>
        </div>
      </div>
    </section>
  );
}
