"use client";

import { useMemo } from "react";
import { useEditor } from "@/hooks/useEditor";

function getFooterLinkIndex(elementId: string): number | null {
  const match = elementId.match(/^footer-link(?:-href)?-(\d+)$/);
  if (!match) {
    return null;
  }
  return Number.parseInt(match[1], 10);
}

export function FooterMenu() {
  const { selectedElement, content, updateContent } = useEditor();

  const selectedIndex = useMemo(() => {
    if (!selectedElement) {
      return null;
    }
    return getFooterLinkIndex(selectedElement.id);
  }, [selectedElement]);

  if (selectedIndex === null) {
    return null;
  }

  const links = content.homepage.footer.links;
  const selectedLink = links[selectedIndex];

  if (!selectedLink) {
    return null;
  }

  const updateLink = (field: "label" | "href", value: string) => {
    updateContent((prev) => ({
      ...prev,
      homepage: {
        ...prev.homepage,
        footer: {
          ...prev.homepage.footer,
          links: prev.homepage.footer.links.map((link, index) =>
            index === selectedIndex ? { ...link, [field]: value } : link,
          ),
        },
      },
    }));
  };

  const addLink = () => {
    updateContent((prev) => ({
      ...prev,
      homepage: {
        ...prev.homepage,
        footer: {
          ...prev.homepage.footer,
          links: [...prev.homepage.footer.links, { label: "New Link", href: "#" }],
        },
      },
    }));
  };

  const deleteLink = () => {
    if (links.length <= 1) {
      return;
    }

    updateContent((prev) => ({
      ...prev,
      homepage: {
        ...prev.homepage,
        footer: {
          ...prev.homepage.footer,
          links: prev.homepage.footer.links.filter((_, index) => index !== selectedIndex),
        },
      },
    }));
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1 block text-xs font-semibold text-slate-300">Footer Link Label</label>
        <input
          type="text"
          value={selectedLink.label}
          onChange={(event) => updateLink("label", event.target.value)}
          className="min-h-[44px] w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-blue-400 focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-semibold text-slate-300">Footer Link URL</label>
        <input
          type="text"
          value={selectedLink.href}
          onChange={(event) => updateLink("href", event.target.value)}
          className="min-h-[44px] w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-blue-400 focus:outline-none"
          placeholder="/products"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={addLink}
          className="min-h-[44px] rounded-lg border border-white/15 px-3 py-2 text-xs font-semibold text-slate-200 hover:border-lime-300/70 hover:text-lime-300"
        >
          Add Link
        </button>
        <button
          onClick={deleteLink}
          disabled={links.length <= 1}
          className="min-h-[44px] rounded-lg border border-red-500/40 px-3 py-2 text-xs font-semibold text-red-300 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Delete Link
        </button>
      </div>
    </div>
  );
}
