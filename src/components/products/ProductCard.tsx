"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSiteStore } from "@/hooks/useSiteStore";
import { useStorefrontContent } from "@/hooks/useStorefrontContent";
import { toElementStyle } from "@/lib/style-overrides";
import type { Product } from "@/types";

const strainClasses = {
  HYBRID: "bg-lime-300/20 text-lime-200 border-lime-300/40",
  SATIVA: "bg-yellow-300/20 text-yellow-100 border-yellow-300/40",
  INDICA: "bg-purple-400/20 text-purple-100 border-purple-300/40",
};

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useSiteStore();
  const { styleOverrides } = useStorefrontContent();
  const styleOverride = styleOverrides?.[product.id];
  const activeQuantities = useMemo(
    () => product.quantities.filter((option) => option.isActive),
    [product.quantities],
  );
  const [selectedQuantityId, setSelectedQuantityId] = useState(activeQuantities[0]?.id ?? "");

  useEffect(() => {
    if (activeQuantities.some((option) => option.id === selectedQuantityId)) {
      return;
    }
    setSelectedQuantityId(activeQuantities[0]?.id ?? "");
  }, [activeQuantities, selectedQuantityId]);

  const selectedQuantity = activeQuantities.find((option) => option.id === selectedQuantityId);
  const canAdd = Boolean(selectedQuantity);

  return (
    <article
      className="group relative rounded-xl border border-white/10 bg-gradient-to-b from-[#11171d] to-[#0c1015] p-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition hover:border-lime-300/40"
      style={toElementStyle(styleOverrides?.[product.id])}
    >
      <span
        className={cn(
          "absolute left-3 top-3 z-10 rounded-full border px-2 py-0.5 text-[9px] font-bold tracking-[0.12em]",
          strainClasses[product.strain],
        )}
      >
        {product.strain}
      </span>

      <div className="relative mb-2 h-[100px] overflow-hidden rounded-lg border border-white/10 bg-black/20">
        <Image
          src={product.image}
          alt={styleOverride?.imageAlt || product.name}
          fill
          sizes="220px"
          className="object-cover transition duration-500 group-hover:scale-105"
          style={{
            objectFit: styleOverride?.objectFit ?? "cover",
            objectPosition: styleOverride?.objectPosition ?? product.imagePosition ?? "center",
          }}
        />
        <div className="absolute inset-0 bg-black/15" />
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/65 to-transparent" />
      </div>

      <h3 className="line-clamp-1 text-[15px] font-bold leading-tight text-white">{product.name}</h3>
      <p className="text-[11px] text-slate-400">{product.brand}</p>
      <p className="text-[10px] text-slate-500">{product.thc}</p>
      <p className="mt-1 line-clamp-2 text-[11px] leading-tight text-slate-300">{product.description}</p>

      <div className="mt-2 flex flex-wrap gap-1">
        {activeQuantities.map((option) => {
          const selected = option.id === selectedQuantityId;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => setSelectedQuantityId(option.id)}
              className={cn(
                "rounded-full border px-2 py-0.5 text-[10px] font-semibold transition",
                selected
                  ? "border-lime-300/70 bg-lime-300/20 text-lime-200"
                  : "border-white/20 bg-black/20 text-slate-300 hover:border-lime-300/40",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      <div className="mt-2 flex items-end justify-between">
        <div>
          <p className="text-[28px] font-black leading-none text-white">
            ${selectedQuantity?.price ?? 0}
          </p>
          <p className="text-[10px] text-slate-400">{selectedQuantity?.label ?? "Unavailable"}</p>
        </div>
        <button
          onClick={() => selectedQuantity && addToCart(product, selectedQuantity)}
          disabled={!canAdd}
          aria-label={`Add ${product.name} to cart`}
          className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-lime-300 text-black transition hover:scale-110 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}
