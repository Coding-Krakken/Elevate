"use client";

import { Leaf, ShoppingCart, User } from "lucide-react";
import { EditableElement } from "../EditableElement";
import { useEditor } from "@/hooks/useEditor";

export function EditableHeader() {
  const { content } = useEditor();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#060a0e]/95 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-[1540px] items-center gap-3 px-4 md:h-[60px] md:px-8">
        <EditableElement
          elementId="header-logo"
          elementType="text"
          sectionId="header"
          path="homepage.hero.titleLine1"
          className="inline-flex"
        >
          <div className="group flex min-w-[190px] items-center gap-2">
            <Leaf className="h-7 w-7 text-lime-300" />
            <div>
              <EditableElement elementId="header-brand-line-1" elementType="text" sectionId="header" path="homepage.header.brandLine1">
                <p className="text-lg font-black leading-none tracking-[0.22em] text-white">{content.homepage.header.brandLine1}</p>
              </EditableElement>
              <EditableElement elementId="header-brand-line-2" elementType="text" sectionId="header" path="homepage.header.brandLine2">
                <p className="-mt-0.5 text-[9px] tracking-[0.2em] text-slate-400">{content.homepage.header.brandLine2}</p>
              </EditableElement>
            </div>
          </div>
        </EditableElement>

        <div className="ml-auto flex items-center gap-2 md:gap-3">
          <EditableElement elementId="header-account" elementType="text" sectionId="header" path="homepage.header.accountHref">
            <span className="rounded-full border border-white/15 p-2 text-slate-200">
              <User className="h-4 w-4" />
            </span>
          </EditableElement>
          <span className="relative rounded-full border border-white/15 p-2 text-slate-200">
            <ShoppingCart className="h-4 w-4" />
            <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-lime-300 px-1 text-[10px] font-black text-black">
              0
            </span>
          </span>
        </div>
      </div>
    </header>
  );
}
