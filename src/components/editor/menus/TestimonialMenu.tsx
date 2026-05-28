"use client";

import { useEditor } from "@/hooks/useEditor";

export function TestimonialMenu() {
  const { selectedElement, content, updateTestimonial, deleteTestimonial } = useEditor();

  if (!selectedElement || selectedElement.type !== "testimonial") {
    return null;
  }

  const testimonial = content.testimonials.find((item) => item.id === selectedElement.id);
  if (!testimonial) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-xs font-semibold text-slate-300">Customer Name</label>
        <input
          type="text"
          value={testimonial.name}
          onChange={(event) => updateTestimonial(testimonial.id, { name: event.target.value })}
          className="min-h-[44px] w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-blue-400 focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold text-slate-300">Quote</label>
        <textarea
          value={testimonial.quote}
          onChange={(event) => updateTestimonial(testimonial.id, { quote: event.target.value })}
          className="min-h-[90px] w-full resize-none rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-blue-400 focus:outline-none"
          rows={4}
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold text-slate-300">Rating</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              onClick={() => updateTestimonial(testimonial.id, { rating: value })}
              className={`min-h-[40px] min-w-[40px] rounded-lg border text-sm font-bold transition ${
                testimonial.rating === value
                  ? "border-lime-300/80 bg-lime-300/20 text-lime-200"
                  : "border-white/10 text-slate-300 hover:border-blue-400 hover:text-white"
              }`}
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => deleteTestimonial(testimonial.id)}
        className="min-h-[44px] w-full rounded-lg border border-red-500/40 px-3 py-2 text-xs font-semibold text-red-300 transition hover:bg-red-500/10"
      >
        Delete Testimonial
      </button>
    </div>
  );
}
