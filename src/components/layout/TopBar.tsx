import { Truck } from "lucide-react";

export function TopBar() {
  return (
    <div className="border-b border-white/5 bg-[#06090c] py-1.5 text-center text-[11px] font-semibold tracking-[0.14em] text-lime-300">
      <p className="inline-flex items-center gap-1.5">
        <Truck className="h-3 w-3" />
        FREE EXPRESS DELIVERY ON ORDERS $75+
      </p>
    </div>
  );
}
