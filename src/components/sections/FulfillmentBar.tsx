"use client";

import { Bolt, Truck } from "lucide-react";
import { StarRating } from "@/components/ui/StarRating";
import { useStorefrontContent } from "@/hooks/useStorefrontContent";
import { toElementStyle } from "@/lib/style-overrides";

const items = [
  { icon: Bolt, title: "FAST DELIVERY", subtitle: "As fast as 60 min" },
  { icon: Truck, title: "EASY ORDERING", subtitle: "Track in real time" },
];

export function FulfillmentBar() {
  const { homepage, styleOverrides } = useStorefrontContent();
  const { fulfillment } = homepage;

  return (
    <section
      className="mt-2 rounded-xl border border-white/10 bg-[#0d1318] px-4 py-2.5"
      style={toElementStyle(styleOverrides?.["section-fulfillment"])}
    >
      <div className="grid gap-2 md:grid-cols-[1fr_1fr_auto] md:items-center md:gap-0">
        {items.map((item, index) => (
          <div key={item.title} className="flex items-center gap-2 md:border-r md:border-white/10 md:px-2">
            <item.icon className="h-4 w-4 text-lime-300" />
            <div>
              <p className="text-[10px] font-black tracking-[0.12em] text-slate-200">{fulfillment.items[index].title}</p>
              <p className="text-[11px] text-slate-400">{fulfillment.items[index].subtitle}</p>
            </div>
          </div>
        ))}

        <div className="flex items-center gap-2 px-3 py-2 md:justify-self-end">
          <p className="text-2xl font-black text-lime-300" style={toElementStyle(styleOverrides?.["fulfillment-rating"])}>{fulfillment.rating}</p>
          <StarRating count={5} />
          <p className="text-[11px] text-slate-400" style={toElementStyle(styleOverrides?.["fulfillment-reviews"])}>{fulfillment.reviewsLabel}</p>
        </div>
      </div>
    </section>
  );
}
