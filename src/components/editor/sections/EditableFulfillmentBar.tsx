"use client";

import { Bolt, Truck } from "lucide-react";
import { StarRating } from "@/components/ui/StarRating";
import { EditableElement } from "../EditableElement";
import { useEditor } from "@/hooks/useEditor";

const icons = [Bolt, Truck];

export function EditableFulfillmentBar() {
  const { content } = useEditor();
  const fulfillment = content.homepage.fulfillment;

  return (
    <EditableElement elementId="section-fulfillment" elementType="section" sectionId="fulfillment" path="homepage.fulfillment">
      <section className="mt-2 rounded-xl border border-white/10 bg-[#0d1318] px-4 py-2.5">
        <div className="grid gap-2 md:grid-cols-[1fr_1fr_auto] md:items-center md:gap-0">
          {fulfillment.items.map((item, index) => {
            const Icon = icons[index] || Bolt;
            return (
              <div key={item.title} className="flex items-center gap-2 md:border-r md:border-white/10 md:px-2">
                <Icon className="h-4 w-4 text-lime-300" />
                <div>
                  <EditableElement elementId={`fulfillment-title-${index}`} elementType="text" sectionId="fulfillment" path={`homepage.fulfillment.items.${index}.title`}>
                    <p className="text-[10px] font-black tracking-[0.12em] text-slate-200">{item.title}</p>
                  </EditableElement>
                  <EditableElement elementId={`fulfillment-subtitle-${index}`} elementType="text" sectionId="fulfillment" path={`homepage.fulfillment.items.${index}.subtitle`}>
                    <p className="text-[11px] text-slate-400">{item.subtitle}</p>
                  </EditableElement>
                </div>
              </div>
            );
          })}

          <div className="flex items-center gap-2 px-3 py-2 md:justify-self-end">
            <EditableElement elementId="fulfillment-rating" elementType="text" sectionId="fulfillment" path="homepage.fulfillment.rating">
              <p className="text-2xl font-black text-lime-300">{fulfillment.rating}</p>
            </EditableElement>
            <StarRating count={5} />
            <EditableElement elementId="fulfillment-reviews" elementType="text" sectionId="fulfillment" path="homepage.fulfillment.reviewsLabel">
              <p className="text-[11px] text-slate-400">{fulfillment.reviewsLabel}</p>
            </EditableElement>
          </div>
        </div>
      </section>
    </EditableElement>
  );
}
