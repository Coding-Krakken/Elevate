"use client";

import {
  Cigarette,
  Cookie,
  Droplets,
  FlaskConical,
  Flower2,
  Pipette,
  ShoppingBag,
  SprayCan,
} from "lucide-react";
import { categories } from "@/data/categories";
import { homePageContent } from "@/data/homepage";
import { cn } from "@/lib/utils";

const icons = {
  Flower2,
  Pipette,
  Cookie,
  Droplets,
  Cigarette,
  FlaskConical,
  SprayCan,
  ShoppingBag,
};

interface CategoryGridProps {
  selectedCategory: string | null;
  onSelectCategory: (value: string | null) => void;
}

export function CategoryGrid({ selectedCategory, onSelectCategory }: CategoryGridProps) {
  const { sections } = homePageContent;

  return (
    <section>
      <div className="mb-2.5 flex items-center justify-between">
        <h2 className="text-sm font-black tracking-[0.16em] text-white">{sections.categoriesTitle}</h2>
        <button
          className="text-[10px] font-bold tracking-[0.12em] text-lime-300"
          onClick={() => onSelectCategory(null)}
        >
          {sections.categoriesViewAllLabel}
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {categories.map((category) => {
          const Icon = icons[category.icon as keyof typeof icons];
          const active = selectedCategory === category.slug;
          return (
            <button
              type="button"
              key={category.id}
              onClick={() => onSelectCategory(active ? null : category.slug)}
              className={cn(
                "group rounded-lg border px-3 py-3 text-left transition",
                active
                  ? "border-lime-300/50 bg-lime-300/10"
                  : "border-white/10 bg-[#10161c] hover:border-lime-300/30",
              )}
            >
              <Icon className="h-5 w-5 text-lime-300" />
              <p className="mt-1.5 text-[11px] font-bold tracking-[0.12em] text-white">{category.label}</p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
