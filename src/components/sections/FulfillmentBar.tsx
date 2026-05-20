import { Bolt, ShoppingBag, Truck } from "lucide-react";
import { StarRating } from "@/components/ui/StarRating";

const items = [
  { icon: Bolt, title: "FAST DELIVERY", subtitle: "As fast as 60 min" },
  { icon: ShoppingBag, title: "IN-STORE PICKUP", subtitle: "Skip the line" },
  { icon: Truck, title: "EASY ORDERING", subtitle: "Track in real time" },
];

export function FulfillmentBar() {
  return (
    <section className="mt-2 rounded-xl border border-white/10 bg-[#0d1318] px-4 py-2.5">
      <div className="grid gap-2 md:grid-cols-[1fr_1fr_1fr_auto] md:items-center">
        {items.map((item) => (
          <div key={item.title} className="flex items-center gap-2 md:border-r md:border-white/10 md:pr-2">
            <item.icon className="h-4 w-4 text-lime-300" />
            <div>
              <p className="text-[10px] font-black tracking-[0.12em] text-slate-200">{item.title}</p>
              <p className="text-[11px] text-slate-400">{item.subtitle}</p>
            </div>
          </div>
        ))}

        <div className="flex items-center gap-2 rounded-lg border border-lime-300/20 bg-lime-300/5 px-3 py-2 md:justify-self-end">
          <p className="text-2xl font-black text-lime-300">4.9</p>
          <StarRating count={5} />
          <p className="text-[11px] text-slate-400">2,400+ Reviews</p>
        </div>
      </div>
    </section>
  );
}
