"use client";

import Image from "next/image";
import { useMemo } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { EditableElement } from "../EditableElement";
import { useEditor } from "@/hooks/useEditor";
import type { ManagedProduct } from "@/types";

const strainClasses = {
  HYBRID: "bg-lime-300/20 text-lime-200 border-lime-300/40",
  SATIVA: "bg-yellow-300/20 text-yellow-100 border-yellow-300/40",
  INDICA: "bg-purple-400/20 text-purple-100 border-purple-300/40",
};

export function EditableFeaturedProducts({ selectedCategory }: { selectedCategory: string | null }) {
  const { content, addProduct } = useEditor();
  const sectionLabel =
    content.pageLayout.sections.find((section) => section.type === "products")?.label ??
    "FEATURED PRODUCTS";

  const activeProducts = content.products.filter((p) => p.isActive);
  const filteredProducts = selectedCategory
    ? activeProducts.filter((p) => p.category === selectedCategory)
    : activeProducts;

  return (
    <div>
      <h2 className="mb-2.5 text-sm font-black tracking-[0.16em] text-white">{sectionLabel}</h2>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5">
        {filteredProducts.map((product) => (
          <EditableProductCard key={product.id} product={product} />
        ))}

        {/* Add product button */}
        <button
          onClick={addProduct}
          className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-white/20 p-4 text-slate-400 hover:border-lime-300/40 hover:text-lime-300 transition min-h-[200px]"
        >
          <Plus className="w-6 h-6" />
          <span className="text-xs font-semibold">Add Product</span>
        </button>
      </div>

      {filteredProducts.length === 0 && (
        <p className="mt-4 text-center text-sm text-slate-500">
          No products in this category yet. Try another category.
        </p>
      )}
    </div>
  );
}

function EditableProductCard({ product }: { product: ManagedProduct }) {
  const activeQuantities = useMemo(
    () => product.quantities.filter((option) => option.isActive),
    [product.quantities],
  );

  const selectedQuantity = activeQuantities[0];

  return (
    <EditableElement
      elementId={product.id}
      elementType="product"
      sectionId="products"
      path={`products`}
    >
      <article className="group relative rounded-xl border border-white/10 bg-gradient-to-b from-[#11171d] to-[#0c1015] p-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition hover:border-lime-300/40">
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
            alt={product.name}
            fill
            sizes="220px"
            className="object-cover transition duration-500 group-hover:scale-105"
            style={{ objectPosition: product.imagePosition ?? "center" }}
          />
          <div className="absolute inset-0 bg-black/15" />
          <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/65 to-transparent" />
        </div>

        <h3 className="line-clamp-1 text-[15px] font-bold leading-tight text-white">{product.name}</h3>
        <p className="text-[11px] text-slate-400">{product.brand}</p>
        <p className="text-[10px] text-slate-500">{product.thc}</p>
        <p className="mt-1 line-clamp-2 text-[11px] leading-tight text-slate-300">{product.description}</p>

        <div className="mt-2 flex flex-wrap gap-1">
          {activeQuantities.map((option) => (
            <span
              key={option.id}
              className="rounded-md border border-white/15 bg-white/5 px-2 py-1 text-[10px] text-slate-300"
            >
              {option.label} · ${option.price}
            </span>
          ))}
        </div>

        {selectedQuantity && (
          <div className="mt-2 flex items-center justify-between">
            <p className="text-lg font-black text-lime-300">${selectedQuantity.price}</p>
            <span className="rounded-full bg-lime-300 p-1.5 text-black">
              <Plus className="h-3.5 w-3.5" />
            </span>
          </div>
        )}
      </article>
    </EditableElement>
  );
}
