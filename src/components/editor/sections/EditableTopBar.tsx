"use client";

import { Truck } from "lucide-react";
import { EditableElement } from "../EditableElement";
import { useEditor } from "@/hooks/useEditor";

export function EditableTopBar() {
  const { content } = useEditor();
  const text = content.homepage.topBar?.text || "FREE EXPRESS DELIVERY ON ORDERS $75+";

  return (
    <div className="border-b border-white/5 bg-[#06090c] py-1.5 text-center text-[11px] font-semibold tracking-[0.14em] text-lime-300">
      <EditableElement
        elementId="topbar-text"
        elementType="text"
        sectionId="topbar"
        path="homepage.topBar.text"
        className="inline-flex"
      >
        <p className="inline-flex items-center gap-1.5">
          <Truck className="h-3 w-3" />
          {text}
        </p>
      </EditableElement>
    </div>
  );
}
