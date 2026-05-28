"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useStorefrontContent } from "@/hooks/useStorefrontContent";
import { StarRating } from "@/components/ui/StarRating";
import { toElementStyle } from "@/lib/style-overrides";

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const { testimonials, pageLayout, styleOverrides, homepage } = useStorefrontContent();
  const testimonialsSection = pageLayout.sections.find((section) => section.type === "testimonials");

  const visible = useMemo(() => {
    const list = [...testimonials, ...testimonials];
    return list.slice(index, index + 4);
  }, [index, testimonials]);

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section id="reviews" className="mt-3" style={toElementStyle(styleOverrides?.["section-testimonials"])}>
      <div className="mb-2.5 flex items-center justify-between">
        <h2 className="text-sm font-black tracking-[0.16em] text-white">{testimonialsSection?.label || "CUSTOMER LOVE"}</h2>
        <Link
          href={homepage.testimonials.viewAllHref || "#"}
          className="inline-flex items-center gap-1 text-[11px] font-bold tracking-[0.12em] text-lime-300"
          style={toElementStyle(styleOverrides?.["testimonials-view-all"])}
        >
          {homepage.testimonials.viewAllLabel}
          <span aria-hidden>›</span>
        </Link>
      </div>
      <div className="relative">
        <button
          className="absolute -left-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-white/20 bg-black/70 p-1.5 text-slate-200 lg:block"
          onClick={() => setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
          aria-label="Previous testimonials"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="grid gap-2.5 md:grid-cols-2 xl:grid-cols-4">
          {visible.map((review, idx) => (
            <article
              key={`${review.id}-${idx}`}
              className="min-h-[124px] rounded-xl border border-white/12 bg-[#0e1419] p-3.5"
              style={toElementStyle(styleOverrides?.[review.id])}
            >
              <StarRating count={review.rating} />
              <p className="mt-2 text-[12px] leading-4 text-slate-200">&ldquo;{review.quote}&rdquo;</p>
              <p className="mt-2 text-xs text-slate-400">- {review.name}</p>
            </article>
          ))}
        </div>
        <button
          className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-white/20 bg-black/70 p-1.5 text-slate-200 lg:block"
          onClick={() => setIndex((prev) => (prev + 1) % testimonials.length)}
          aria-label="Next testimonials"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-2 flex justify-center gap-2 lg:hidden">
        <button
          onClick={() => setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
          className="rounded-lg border border-white/20 px-3 py-1 text-xs text-slate-300"
        >
          {homepage.testimonials.prevLabel}
        </button>
        <button
          onClick={() => setIndex((prev) => (prev + 1) % testimonials.length)}
          className="rounded-lg border border-white/20 px-3 py-1 text-xs text-slate-300"
        >
          {homepage.testimonials.nextLabel}
        </button>
      </div>
    </section>
  );
}
