"use client";

import { useEditor } from "@/hooks/useEditor";
import { useImagePaste } from "@/hooks/useImagePaste";
import type { ManagedProduct } from "@/types";

const STRAIN_OPTIONS: ManagedProduct["strain"][] = ["HYBRID", "SATIVA", "INDICA"];
const CATEGORY_OPTIONS = ["flower", "vapes", "edibles", "concentrates", "pre-rolls", "tinctures", "topicals", "accessories"];

export function ProductMenu() {
  const { selectedElement, content, updateProduct } = useEditor();
  const { handlePaste, pasting } = useImagePaste((url) => {
    if (selectedElement && selectedElement.type === "product") {
      updateProduct(selectedElement.id, { image: url });
    }
  });

  if (!selectedElement || selectedElement.type !== "product") return null;

  const product = content.products.find((p) => p.id === selectedElement.id);
  if (!product) return null;

  const update = (updates: Partial<ManagedProduct>) => {
    updateProduct(product.id, updates);
  };

  return (
    <div className="space-y-4">
      {/* Name */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1">Name</label>
        <input
          type="text"
          value={product.name}
          onChange={(e) => update({ name: e.target.value })}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-400 focus:outline-none min-h-[44px]"
        />
      </div>

      {/* Brand */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1">Brand</label>
        <input
          type="text"
          value={product.brand}
          onChange={(e) => update({ brand: e.target.value })}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-400 focus:outline-none min-h-[44px]"
        />
      </div>

      {/* Category & Strain */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
          <select
            value={product.category}
            onChange={(e) => update({ category: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-blue-400 focus:outline-none min-h-[44px]"
          >
            {CATEGORY_OPTIONS.map((cat) => (
              <option key={cat} value={cat} className="bg-[#0d1117]">
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Strain</label>
          <select
            value={product.strain}
            onChange={(e) => update({ strain: e.target.value as ManagedProduct["strain"] })}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-blue-400 focus:outline-none min-h-[44px]"
          >
            {STRAIN_OPTIONS.map((strain) => (
              <option key={strain} value={strain} className="bg-[#0d1117]">
                {strain}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* THC & Description */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1">THC Label</label>
        <input
          type="text"
          value={product.thc}
          onChange={(e) => update({ thc: e.target.value })}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-400 focus:outline-none min-h-[44px]"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
        <textarea
          value={product.description}
          onChange={(e) => update({ description: e.target.value })}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-400 focus:outline-none resize-none min-h-[60px]"
          rows={2}
        />
      </div>

      {/* Image */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1">Image URL</label>
        <input
          type="text"
          value={product.image}
          onChange={(e) => update({ image: e.target.value })}
          onPaste={handlePaste}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-blue-400 focus:outline-none min-h-[44px]"
          placeholder={pasting ? "Uploading pasted image..." : "https://... or /images/... (paste image)"}
        />
      </div>

      {/* Quantities */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-2">Pricing Options</label>
        <div className="space-y-2">
          {product.quantities.map((qty, idx) => (
            <div key={qty.id} className="flex items-center gap-2">
              <input
                type="text"
                value={qty.label}
                onChange={(e) => {
                  const quantities = [...product.quantities];
                  quantities[idx] = { ...quantities[idx], label: e.target.value };
                  update({ quantities });
                }}
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:border-blue-400 focus:outline-none min-h-[40px]"
                placeholder="Label"
              />
              <div className="relative">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-slate-500">$</span>
                <input
                  type="number"
                  value={qty.price}
                  onChange={(e) => {
                    const quantities = [...product.quantities];
                    quantities[idx] = { ...quantities[idx], price: Number(e.target.value) };
                    update({ quantities });
                  }}
                  className="w-20 bg-white/5 border border-white/10 rounded-lg pl-5 pr-2 py-1.5 text-xs text-white focus:border-blue-400 focus:outline-none min-h-[40px]"
                />
              </div>
              <button
                onClick={() => {
                  const quantities = product.quantities.filter((_, i) => i !== idx);
                  update({ quantities });
                }}
                className="p-1.5 rounded text-red-400 hover:bg-red-400/10 min-w-[36px] min-h-[36px] flex items-center justify-center"
              >
                ×
              </button>
            </div>
          ))}
          <button
            onClick={() => {
              const quantities = [
                ...product.quantities,
                { id: `qty-${Math.random().toString(36).slice(2, 8)}`, label: "New", price: 0, isActive: true },
              ];
              update({ quantities });
            }}
            className="w-full px-3 py-2 rounded-lg border border-dashed border-white/20 text-xs text-slate-400 hover:border-blue-400 hover:text-white transition min-h-[44px]"
          >
            + Add Option
          </button>
        </div>
      </div>

      {/* Active Toggle */}
      <div className="flex items-center justify-between px-3 py-3 rounded-lg bg-white/5 border border-white/10">
        <span className="text-xs font-semibold text-slate-300">Active</span>
        <button
          onClick={() => update({ isActive: !product.isActive })}
          className={`w-10 h-5 rounded-full transition relative ${product.isActive ? "bg-lime-400" : "bg-slate-600"}`}
        >
          <span
            className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${product.isActive ? "left-5" : "left-0.5"}`}
          />
        </button>
      </div>
    </div>
  );
}
