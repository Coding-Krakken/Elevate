"use client";

import { useEditor } from "@/hooks/useEditor";
import type { CategoryItem } from "@/types";

const ICON_OPTIONS: CategoryItem["icon"][] = [
  "Flower2",
  "Pipette",
  "Cookie",
  "Droplets",
  "Cigarette",
  "FlaskConical",
  "SprayCan",
  "ShoppingBag",
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function CategoryMenu() {
  const { selectedElement, content, updateCategory, updateContent } = useEditor();

  if (!selectedElement || selectedElement.type !== "category") {
    return null;
  }

  const categoryId = selectedElement.id.replace(/^category-/, "");
  const category = content.categories.find((item) => item.id === categoryId);

  if (!category) {
    return null;
  }

  const addCategory = () => {
    const base = `category-${Math.random().toString(36).slice(2, 8)}`;
    const nextCategory: CategoryItem = {
      id: base,
      label: "NEW CATEGORY",
      slug: base,
      icon: "ShoppingBag",
    };

    updateContent((prev) => ({
      ...prev,
      categories: [...prev.categories, nextCategory],
    }));
  };

  const handleSlugChange = (rawValue: string) => {
    const nextSlug = slugify(rawValue);
    if (!nextSlug || nextSlug === category.slug) {
      return;
    }

    updateContent((prev) => ({
      ...prev,
      categories: prev.categories.map((item) => (item.id === category.id ? { ...item, slug: nextSlug } : item)),
      products: prev.products.map((product) =>
        product.category === category.slug ? { ...product, category: nextSlug } : product,
      ),
    }));
  };

  const deleteCategory = () => {
    if (content.categories.length <= 1) {
      return;
    }

    const fallback = content.categories.find((item) => item.id !== category.id);

    updateContent((prev) => ({
      ...prev,
      categories: prev.categories.filter((item) => item.id !== category.id),
      products: prev.products.map((product) =>
        product.category === category.slug
          ? { ...product, category: fallback?.slug ?? "flower" }
          : product,
      ),
    }));
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-xs font-semibold text-slate-300">Label</label>
        <input
          type="text"
          value={category.label}
          onChange={(event) => updateCategory(category.id, { label: event.target.value.toUpperCase() })}
          className="min-h-[44px] w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-blue-400 focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold text-slate-300">Slug</label>
        <input
          type="text"
          value={category.slug}
          onChange={(event) => handleSlugChange(event.target.value)}
          className="min-h-[44px] w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-blue-400 focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold text-slate-300">Icon</label>
        <select
          value={category.icon}
          onChange={(event) => updateCategory(category.id, { icon: event.target.value as CategoryItem["icon"] })}
          className="min-h-[44px] w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-blue-400 focus:outline-none"
        >
          {ICON_OPTIONS.map((icon) => (
            <option key={icon} value={icon} className="bg-[#0d1117] text-white">
              {icon}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={addCategory}
          className="min-h-[44px] rounded-lg border border-white/15 px-3 py-2 text-xs font-semibold text-slate-200 hover:border-lime-300/70 hover:text-lime-300"
        >
          Add Category
        </button>
        <button
          onClick={deleteCategory}
          disabled={content.categories.length <= 1}
          className="min-h-[44px] rounded-lg border border-red-500/40 px-3 py-2 text-xs font-semibold text-red-300 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
