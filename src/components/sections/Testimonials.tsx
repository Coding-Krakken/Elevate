"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { homePageContent } from "@/data/homepage";
import { reviews } from "@/data/reviews";
import { StarRating } from "@/components/ui/StarRating";

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const { sections } = homePageContent;

  const visible = useMemo(() => {
    const list = [...reviews, ...reviews];
    return list.slice(index, index + 4);
  }, [index]);

  return (
    <section className="mt-3">
      <div className="mb-2.5 flex items-center justify-between">
        <h2 className="text-sm font-black tracking-[0.16em] text-white">{sections.testimonialsTitle}</h2>
        <button className="inline-flex items-center gap-1 text-[11px] font-bold tracking-[0.12em] text-lime-300">
          {sections.testimonialsViewAllLabel}
          <span aria-hidden>›</span>
        </button>
      </div>
      <div className="relative">
        <button
          className="absolute -left-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-white/20 bg-black/70 p-1.5 text-slate-200 lg:block"
          onClick={() => setIndex((prev) => (prev - 1 + reviews.length) % reviews.length)}
          aria-label="Previous testimonials"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="grid gap-2.5 md:grid-cols-2 xl:grid-cols-4">
          {visible.map((review, idx) => (
            <article key={`${review.id}-${idx}`} className="min-h-[124px] rounded-xl border border-white/12 bg-[#0e1419] p-3.5">
              <StarRating count={review.rating} />
              <p className="mt-2 text-[12px] leading-4 text-slate-200">&ldquo;{review.quote}&rdquo;</p>
              <p className="mt-2 text-xs text-slate-400">- {review.name}</p>
            </article>
          ))}
        </div>
        <button
          className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-white/20 bg-black/70 p-1.5 text-slate-200 lg:block"
          onClick={() => setIndex((prev) => (prev + 1) % reviews.length)}
          aria-label="Next testimonials"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-2 flex justify-center gap-2 lg:hidden">
        <button
          onClick={() => setIndex((prev) => (prev - 1 + reviews.length) % reviews.length)}
          className="rounded-lg border border-white/20 px-3 py-1 text-xs text-slate-300"
        >
          Prev
        </button>
        <button
          onClick={() => setIndex((prev) => (prev + 1) % reviews.length)}
          className="rounded-lg border border-white/20 px-3 py-1 text-xs text-slate-300"
        >
          Next
        </button>
      </div>
    </section>
  );
}
