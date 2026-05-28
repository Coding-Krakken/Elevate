import Image from "next/image";
import type { PromoItem } from "@/types";

export function PromoBannerCard({ promo, index }: { promo: PromoItem; index: number }) {
  return (
    <article className="relative min-h-[162px] overflow-hidden rounded-xl border border-white/15 bg-[#0d1318] p-4">
      <Image
        src={promo.image}
        alt={promo.title}
        fill
        sizes="(min-width: 1024px) 33vw, 100vw"
        className="object-cover opacity-30"
      />
      <div
        className={`absolute inset-0 ${
          index === 1
            ? "bg-gradient-to-r from-black/90 via-[#310944]/55 to-[#7c1fb9]/35"
            : "bg-gradient-to-r from-black/90 via-black/65 to-black/35"
        }`}
      />
      <div className="relative">
        <p className="text-xs font-bold tracking-[0.14em] text-lime-300">{promo.eyebrow}</p>
        <h3 className="mt-1 text-[52px] font-black leading-[0.88] tracking-[0.05em] text-white">{promo.title}</h3>
        <p className="text-sm font-semibold tracking-[0.11em] text-slate-200">{promo.subtitle}</p>
        {index === 1 ? (
          <p className="mt-3 inline-flex rounded-md border border-lime-300/45 bg-black/60 px-3 py-1.5 text-xs font-black tracking-[0.12em] text-lime-300">
            {promo.code ? `USE CODE: ${promo.code}` : promo.cta}
          </p>
        ) : (
          <button className="mt-3 rounded-md bg-lime-300 px-4 py-2 text-xs font-black tracking-[0.12em] text-black">
            {promo.cta}
          </button>
        )}
      </div>
      {index === 2 ? (
        <div className="neon-clock absolute bottom-3 right-4" aria-hidden>
          <div className="neon-clock-inner">
            <span className="neon-clock-hand neon-clock-hand-hour" />
            <span className="neon-clock-hand neon-clock-hand-minute" />
            <span className="neon-clock-center" />
            <span className="neon-clock-mark neon-clock-mark-top" />
            <span className="neon-clock-mark neon-clock-mark-right" />
            <span className="neon-clock-mark neon-clock-mark-bottom" />
            <span className="neon-clock-mark neon-clock-mark-left" />
          </div>
        </div>
      ) : null}
    </article>
  );
}

export function PromoBanners({ offers }: { offers: PromoItem[] }) {
  return (
    <section className="mt-3 grid gap-2.5 lg:grid-cols-3">
      {offers.map((promo, index) => (
        <PromoBannerCard key={promo.id} promo={promo} index={index} />
      ))}
    </section>
  );
}
