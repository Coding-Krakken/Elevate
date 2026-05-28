"use client";

import { useEditor } from "@/hooks/useEditor";

type ActionTarget = {
  label: string;
  path: string;
  placeholder: string;
};

const ACTION_TARGETS: Record<string, ActionTarget> = {
  "hero-cta1": {
    label: "Primary CTA URL",
    path: "homepage.hero.primaryCtaHref",
    placeholder: "/products",
  },
  "hero-cta2": {
    label: "Secondary CTA URL",
    path: "homepage.hero.secondaryCtaHref",
    placeholder: "#deals",
  },
  "header-logo": {
    label: "Header Logo URL",
    path: "homepage.header.logoHref",
    placeholder: "/",
  },
  "header-account": {
    label: "Account Icon URL",
    path: "homepage.header.accountHref",
    placeholder: "/admin",
  },
  "testimonials-view-all": {
    label: "Testimonials CTA URL",
    path: "homepage.testimonials.viewAllHref",
    placeholder: "#reviews",
  },
};

function getValueAtPath(obj: unknown, path: string): string {
  const keys = path.split(".");
  let current: unknown = obj;

  for (const key of keys) {
    if (current == null || typeof current !== "object") {
      return "";
    }
    current = (current as Record<string, unknown>)[key];
  }

  return typeof current === "string" ? current : "";
}

export function ActionMenu() {
  const { selectedElement, content, setFieldValue } = useEditor();

  if (!selectedElement) {
    return null;
  }

  const target = ACTION_TARGETS[selectedElement.id];
  if (!target) {
    return null;
  }

  const value = getValueAtPath(content, target.path);

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-xs font-semibold text-slate-300">{target.label}</label>
        <input
          type="text"
          value={value}
          placeholder={target.placeholder}
          onChange={(event) => setFieldValue(target.path, event.target.value)}
          className="min-h-[44px] w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-blue-400 focus:outline-none"
        />
      </div>
      <p className="text-[11px] text-slate-400">Use internal routes like /products or section anchors like #deals.</p>
    </div>
  );
}
