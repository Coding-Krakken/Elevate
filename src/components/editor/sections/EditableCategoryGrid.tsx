"use client";

import {
  Flower2,
  Pipette,
  Cookie,
  Droplets,
  Cigarette,
  FlaskConical,
  SprayCan,
  ShoppingBag,
} from "lucide-react";
import { EditableElement } from "../EditableElement";
import { useEditor } from "@/hooks/useEditor";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Flower2,
  Pipette,
  Cookie,
  Droplets,
  Cigarette,
  FlaskConical,
  SprayCan,
  ShoppingBag,
};

interface EditableCategoryGridProps {
  selectedCategory: string | null;
  onSelectCategory: (slug: string | null) => void;
  availableCategories: string[];
}

export function EditableCategoryGrid({
  selectedCategory,
  onSelectCategory,
  availableCategories,
}: EditableCategoryGridProps) {
  const { content } = useEditor();
  const categories = content.categories;
  const sectionLabel =
    content.pageLayout.sections.find((section) => section.type === "categories")?.label ??
    "SHOP CATEGORIES";

  return (
    <EditableElement elementId="section-categories" elementType="section" sectionId="products" path="categories">
      <div className="rounded-xl border border-white/10 bg-[#0d1318] p-3">
        <p className="mb-2 text-[10px] font-bold tracking-[0.14em] text-slate-400">{sectionLabel}</p>

        <div className="grid grid-cols-2 gap-1.5">
          {/* View All button */}
          <EditableElement
            elementId="category-view-all"
            elementType="text"
            sectionId="products"
            path="homepage.categories.viewAllLabel"
          >
            <button
              onClick={() => onSelectCategory(null)}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-[11px] font-semibold tracking-[0.06em] transition ${
                selectedCategory === null
                  ? "border-lime-300/50 bg-lime-300/10 text-lime-300"
                  : "border-white/10 text-slate-300 hover:border-white/25"
              }`}
            >
              {content.homepage.categories.viewAllLabel}
            </button>
          </EditableElement>

          {categories.map((cat) => {
            const Icon = iconMap[cat.icon] || ShoppingBag;
            const isAvailable = availableCategories.includes(cat.slug);
            const isActive = selectedCategory === cat.slug;

            return (
              <EditableElement
                key={cat.id}
                elementId={`category-${cat.id}`}
                elementType="category"
                sectionId="products"
                path={`categories`}
              >
                <button
                  onClick={() => onSelectCategory(isActive ? null : cat.slug)}
                  disabled={!isAvailable}
                  className={`flex w-full items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-[11px] font-semibold tracking-[0.06em] transition ${
                    isActive
                      ? "border-lime-300/50 bg-lime-300/10 text-lime-300"
                      : isAvailable
                        ? "border-white/10 text-slate-300 hover:border-white/25"
                        : "border-white/5 text-slate-600 cursor-not-allowed"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {cat.label}
                </button>
              </EditableElement>
            );
          })}
        </div>
      </div>
    </EditableElement>
  );
}
