"use client";

import { useEditor } from "@/hooks/useEditor";
import { useImagePaste } from "@/hooks/useImagePaste";
import type { ManagedOffer, OfferRules } from "@/types";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function OfferMenu() {
  const { selectedElement, content, updateOffer } = useEditor();
  const { handlePaste, pasting } = useImagePaste((url) => {
    if (selectedElement && selectedElement.type === "offer") {
      updateOffer(selectedElement.id, { image: url });
    }
  });

  if (!selectedElement || selectedElement.type !== "offer") return null;

  const offer = content.offers.find((o) => o.id === selectedElement.id);
  if (!offer) return null;

  const update = (updates: Partial<ManagedOffer>) => {
    updateOffer(offer.id, updates);
  };

  const updateRules = (ruleUpdates: Partial<OfferRules>) => {
    update({ rules: { ...offer.rules!, ...ruleUpdates } });
  };

  return (
    <div className="space-y-4">
      {/* Eyebrow */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1">Eyebrow</label>
        <input
          type="text"
          value={offer.eyebrow}
          onChange={(e) => update({ eyebrow: e.target.value })}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-400 focus:outline-none min-h-[44px]"
        />
      </div>

      {/* Title */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1">Title</label>
        <input
          type="text"
          value={offer.title}
          onChange={(e) => update({ title: e.target.value })}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-400 focus:outline-none min-h-[44px]"
        />
      </div>

      {/* Subtitle */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1">Subtitle</label>
        <input
          type="text"
          value={offer.subtitle}
          onChange={(e) => update({ subtitle: e.target.value })}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-blue-400 focus:outline-none min-h-[44px]"
        />
      </div>

      {/* CTA & Code */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">CTA Text</label>
          <input
            type="text"
            value={offer.cta}
            onChange={(e) => update({ cta: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-blue-400 focus:outline-none min-h-[44px]"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Promo Code</label>
          <input
            type="text"
            value={offer.code || ""}
            onChange={(e) => update({ code: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-blue-400 focus:outline-none min-h-[44px]"
            placeholder="Optional"
          />
        </div>
      </div>

      {/* Image */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1">Image URL</label>
        <input
          type="text"
          value={offer.image}
          onChange={(e) => update({ image: e.target.value })}
          onPaste={handlePaste}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:border-blue-400 focus:outline-none min-h-[44px]"
          placeholder={pasting ? "Uploading pasted image..." : "https://... or /images/... (paste image)"}
        />
      </div>

      {/* Discount Rules */}
      <div className="p-3 rounded-lg border border-white/10 bg-white/[0.02] space-y-3">
        <p className="text-xs font-bold text-white">Discount Rules</p>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[10px] text-slate-400 mb-0.5">Type</label>
            <select
              value={offer.rules?.discountType || "percent"}
              onChange={(e) => updateRules({ discountType: e.target.value as "percent" | "fixed" })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:border-blue-400 focus:outline-none min-h-[40px]"
            >
              <option value="percent" className="bg-[#0d1117]">Percent</option>
              <option value="fixed" className="bg-[#0d1117]">Fixed $</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] text-slate-400 mb-0.5">Value</label>
            <input
              type="number"
              value={offer.rules?.discountValue || 0}
              onChange={(e) => updateRules({ discountValue: Number(e.target.value) })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:border-blue-400 focus:outline-none min-h-[40px]"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] text-slate-400 mb-0.5">Min Subtotal ($)</label>
          <input
            type="number"
            value={offer.rules?.minSubtotal || ""}
            onChange={(e) => updateRules({ minSubtotal: e.target.value ? Number(e.target.value) : undefined })}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:border-blue-400 focus:outline-none min-h-[40px]"
            placeholder="No minimum"
          />
        </div>

        {/* Auto/Manual Apply */}
        <div className="flex gap-3">
          <label className="flex items-center gap-2 text-xs text-slate-300">
            <input
              type="checkbox"
              checked={offer.rules?.autoApply || false}
              onChange={(e) => updateRules({ autoApply: e.target.checked })}
              className="rounded accent-lime-400"
            />
            Auto Apply
          </label>
          <label className="flex items-center gap-2 text-xs text-slate-300">
            <input
              type="checkbox"
              checked={offer.rules?.allowManualApply || false}
              onChange={(e) => updateRules({ allowManualApply: e.target.checked })}
              className="rounded accent-lime-400"
            />
            Manual Apply
          </label>
        </div>
      </div>

      {/* Schedule */}
      <div className="p-3 rounded-lg border border-white/10 bg-white/[0.02] space-y-3">
        <p className="text-xs font-bold text-white">Schedule</p>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[10px] text-slate-400 mb-0.5">Start Date</label>
            <input
              type="date"
              value={offer.rules?.startDate || ""}
              onChange={(e) => updateRules({ startDate: e.target.value || undefined })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:border-blue-400 focus:outline-none min-h-[40px]"
            />
          </div>
          <div>
            <label className="block text-[10px] text-slate-400 mb-0.5">End Date</label>
            <input
              type="date"
              value={offer.rules?.endDate || ""}
              onChange={(e) => updateRules({ endDate: e.target.value || undefined })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:border-blue-400 focus:outline-none min-h-[40px]"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[10px] text-slate-400 mb-0.5">Start Time</label>
            <input
              type="time"
              value={offer.rules?.startTime || ""}
              onChange={(e) => updateRules({ startTime: e.target.value || undefined })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:border-blue-400 focus:outline-none min-h-[40px]"
            />
          </div>
          <div>
            <label className="block text-[10px] text-slate-400 mb-0.5">End Time</label>
            <input
              type="time"
              value={offer.rules?.endTime || ""}
              onChange={(e) => updateRules({ endTime: e.target.value || undefined })}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:border-blue-400 focus:outline-none min-h-[40px]"
            />
          </div>
        </div>

        {/* Days of week */}
        <div>
          <label className="block text-[10px] text-slate-400 mb-1">Days Active</label>
          <div className="flex gap-1">
            {DAYS.map((day, idx) => {
              const active = offer.rules?.daysOfWeek?.includes(idx);
              return (
                <button
                  key={day}
                  onClick={() => {
                    const current = offer.rules?.daysOfWeek || [];
                    const next = active ? current.filter((d) => d !== idx) : [...current, idx];
                    updateRules({ daysOfWeek: next.length > 0 ? next : undefined });
                  }}
                  className={`flex-1 py-2 rounded text-[10px] font-semibold transition min-h-[40px] ${
                    active ? "bg-blue-500/20 text-blue-400 border border-blue-400/50" : "border border-white/10 text-slate-400"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Active Toggle */}
      <div className="flex items-center justify-between px-3 py-3 rounded-lg bg-white/5 border border-white/10">
        <span className="text-xs font-semibold text-slate-300">Active</span>
        <button
          onClick={() => update({ isActive: !offer.isActive })}
          className={`w-10 h-5 rounded-full transition relative ${offer.isActive ? "bg-lime-400" : "bg-slate-600"}`}
        >
          <span
            className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${offer.isActive ? "left-5" : "left-0.5"}`}
          />
        </button>
      </div>
    </div>
  );
}
