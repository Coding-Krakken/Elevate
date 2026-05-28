"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { StarRating } from "@/components/ui/StarRating";
import { EditableElement } from "../EditableElement";
import { useEditor } from "@/hooks/useEditor";

export function EditableTestimonials() {
  const { content, addTestimonial } = useEditor();
  const testimonials = content.testimonials;
  const sectionLabel =
    content.pageLayout.sections.find((section) => section.type === "testimonials")?.label ??
    "WHAT OUR CUSTOMERS SAY";
  const [index, setIndex] = useState(0);

  const visible = useMemo(() => {
    const list = [...testimonials, ...testimonials];
    return list.slice(index, index + 4);
  }, [index, testimonials]);

  return (
    <EditableElement elementId="section-testimonials" elementType="section" sectionId="testimonials" path="testimonials">
      <section id="reviews" className="mt-3">
        <div className="mb-2.5 flex items-center justify-between">
          <h2 className="text-sm font-black tracking-[0.16em] text-white">{sectionLabel}</h2>
          <div className="flex items-center gap-3">
            <EditableElement
              elementId="testimonials-view-all"
              elementType="text"
              sectionId="testimonials"
              path="homepage.testimonials.viewAllLabel"
            >
              <span className="inline-flex items-center gap-1 text-[11px] font-bold tracking-[0.12em] text-lime-300">
                {content.homepage.testimonials.viewAllLabel}
                <span aria-hidden>›</span>
              </span>
            </EditableElement>
            <button
              onClick={addTestimonial}
              className="inline-flex items-center gap-1 text-[11px] font-bold tracking-[0.12em] text-lime-300"
            >
              <Plus className="w-3 h-3" /> ADD REVIEW
            </button>
          </div>
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
              <EditableElement
                key={`${review.id}-${idx}`}
                elementId={review.id}
                elementType="testimonial"
                sectionId="testimonials"
                path={`testimonials`}
              >
                <article className="min-h-[124px] rounded-xl border border-white/12 bg-[#0e1419] p-3.5">
                  <StarRating count={review.rating} />
                  <p className="mt-2 text-[12px] leading-4 text-slate-200">&ldquo;{review.quote}&rdquo;</p>
                  <p className="mt-2 text-xs text-slate-400">- {review.name}</p>
                </article>
              </EditableElement>
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
          <EditableElement
            elementId="testimonials-prev-label"
            elementType="text"
            sectionId="testimonials"
            path="homepage.testimonials.prevLabel"
          >
            <button
              onClick={() => setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
              className="rounded-lg border border-white/20 px-3 py-1 text-xs text-slate-300"
            >
              {content.homepage.testimonials.prevLabel}
            </button>
          </EditableElement>
          <EditableElement
            elementId="testimonials-next-label"
            elementType="text"
            sectionId="testimonials"
            path="homepage.testimonials.nextLabel"
          >
            <button
              onClick={() => setIndex((prev) => (prev + 1) % testimonials.length)}
              className="rounded-lg border border-white/20 px-3 py-1 text-xs text-slate-300"
            >
              {content.homepage.testimonials.nextLabel}
            </button>
          </EditableElement>
        </div>
      </section>
    </EditableElement>
  );
}
