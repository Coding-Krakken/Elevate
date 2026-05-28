"use client";

import { ArrowDown, ArrowUp, Eye, EyeOff, Trash2 } from "lucide-react";
import { useEditor } from "@/hooks/useEditor";

const SECTION_LABEL_DEFAULTS: Record<string, string> = {
  hero: "Hero",
  fulfillment: "Fulfillment",
  products: "Featured Products",
  categories: "Shop Categories",
  promos: "Promotions",
  testimonials: "Customer Love",
};

export function SectionMenu() {
  const {
    selectedElement,
    content,
    updatePageLayout,
    moveSection,
    toggleSectionVisibility,
    deleteSection,
  } = useEditor();

  if (!selectedElement) return null;

  const sections = [...content.pageLayout.sections].sort((a, b) => a.order - b.order);
  const currentSection = sections.find((s) => s.id === selectedElement.sectionId);

  if (!currentSection) return null;

  const currentIndex = sections.indexOf(currentSection);
  const canMoveUp = currentIndex > 0;
  const canMoveDown = currentIndex < sections.length - 1;
  const defaultLabel = SECTION_LABEL_DEFAULTS[currentSection.type] ?? currentSection.type;

  const updateCurrentSectionLabel = (value: string) => {
    updatePageLayout({
      sections: content.pageLayout.sections.map((section) =>
        section.id === currentSection.id ? { ...section, label: value } : section,
      ),
    });
  };

  return (
    <div className="space-y-4">
      {/* Current section info */}
      <div className="p-3 rounded-lg bg-white/5 border border-white/10">
        <p className="text-xs font-semibold text-white capitalize">{currentSection.type} Section</p>
        <p className="text-[10px] text-slate-400 mt-0.5">
          Position: {currentIndex + 1} of {sections.length}
        </p>
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold text-slate-300">Section Label</label>
        <input
          type="text"
          value={currentSection.label ?? defaultLabel}
          onChange={(event) => updateCurrentSectionLabel(event.target.value)}
          className="min-h-[44px] w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white focus:border-blue-400 focus:outline-none"
          placeholder={defaultLabel}
        />
      </div>

      {/* Move up/down */}
      <div className="flex gap-2">
        <button
          onClick={() => moveSection(selectedElement.sectionId, "up")}
          disabled={!canMoveUp}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-white/10 text-slate-300 hover:border-blue-400 hover:text-white transition min-h-[50px] disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ArrowUp className="w-4 h-4" />
          <span className="text-xs font-semibold">Move Up</span>
        </button>
        <button
          onClick={() => moveSection(selectedElement.sectionId, "down")}
          disabled={!canMoveDown}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-white/10 text-slate-300 hover:border-blue-400 hover:text-white transition min-h-[50px] disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ArrowDown className="w-4 h-4" />
          <span className="text-xs font-semibold">Move Down</span>
        </button>
      </div>

      {/* Toggle visibility */}
      <button
        onClick={() => toggleSectionVisibility(selectedElement.sectionId)}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-white/10 text-slate-300 hover:border-yellow-400 hover:text-yellow-300 transition min-h-[50px]"
      >
        {currentSection.visible ? (
          <>
            <EyeOff className="w-4 h-4" />
            <span className="text-xs font-semibold">Hide Section</span>
          </>
        ) : (
          <>
            <Eye className="w-4 h-4" />
            <span className="text-xs font-semibold">Show Section</span>
          </>
        )}
      </button>

      {/* Delete section */}
      <button
        onClick={() => deleteSection(selectedElement.sectionId)}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition min-h-[50px]"
      >
        <Trash2 className="w-4 h-4" />
        <span className="text-xs font-semibold">Delete Section</span>
      </button>

      {/* All sections overview */}
      <div>
        <p className="text-xs font-semibold text-slate-300 mb-2">All Sections</p>
        <div className="space-y-1">
          {sections.map((section, idx) => (
            <div
              key={section.id}
              className={`flex items-center justify-between px-3 py-2 rounded-lg border ${
                section.id === currentSection.id
                  ? "border-blue-400/50 bg-blue-400/10"
                  : "border-white/5 bg-white/[0.02]"
              }`}
            >
              <span className="text-xs text-white capitalize">
                {idx + 1}. {section.type}
              </span>
              <span className={`text-[10px] ${section.visible ? "text-lime-400" : "text-slate-500"}`}>
                {section.visible ? "Visible" : "Hidden"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
