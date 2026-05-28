"use client";

import { Leaf } from "lucide-react";
import { EditableElement } from "../EditableElement";
import { useEditor } from "@/hooks/useEditor";

export function EditableFooter() {
  const { content } = useEditor();

  return (
    <footer className="mt-4 border-t border-white/10 bg-[#05080b]">
      <div className="mx-auto w-full max-w-[1540px] px-4 py-6 md:px-8">
        <div className="grid gap-8 border-b border-white/10 pb-5 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <EditableElement elementId="footer-logo" elementType="text" sectionId="footer" path="homepage.header.brandLine1">
              <div className="flex items-center gap-2">
                <Leaf className="h-8 w-8 text-lime-300" />
                <div>
                  <EditableElement elementId="footer-brand-line-1" elementType="text" sectionId="footer" path="homepage.header.brandLine1">
                    <p className="text-xl font-black tracking-[0.22em] text-white">{content.homepage.header.brandLine1}</p>
                  </EditableElement>
                  <EditableElement elementId="footer-brand-line-2" elementType="text" sectionId="footer" path="homepage.header.brandLine2">
                    <p className="text-[10px] tracking-[0.2em] text-slate-400">{content.homepage.header.brandLine2}</p>
                  </EditableElement>
                </div>
              </div>
            </EditableElement>
            <EditableElement elementId="footer-tagline" elementType="text" sectionId="footer" path="homepage.footer.tagline">
              <p className="mt-4 max-w-[220px] text-xs leading-5 tracking-[0.1em] text-slate-300">
                {content.homepage.footer.tagline}
              </p>
            </EditableElement>
          </div>

          <div>
            <EditableElement elementId="footer-column-title" elementType="text" sectionId="footer" path="homepage.footer.columnTitle">
              <h4 className="mb-3 text-xs font-black tracking-[0.16em] text-white">{content.homepage.footer.columnTitle}</h4>
            </EditableElement>
            <ul className="space-y-1.5">
              {content.homepage.footer.links.map((item, index) => (
                <li key={`${item.label}-${index}`}>
                  <EditableElement
                    elementId={`footer-link-${index}`}
                    elementType="text"
                    sectionId="footer"
                    path={`homepage.footer.links.${index}.label`}
                  >
                    <span className="text-xs text-slate-300 hover:text-lime-300 transition cursor-pointer">
                      {item.label}
                    </span>
                  </EditableElement>
                  <EditableElement
                    elementId={`footer-link-href-${index}`}
                    elementType="text"
                    sectionId="footer"
                    path={`homepage.footer.links.${index}.href`}
                  >
                    <p className="mt-0.5 text-[10px] tracking-[0.08em] text-slate-500">{item.href}</p>
                  </EditableElement>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <EditableElement elementId="footer-disclaimer" elementType="text" sectionId="footer" path="homepage.footer.disclaimer">
          <p className="mt-4 text-xs text-slate-400">{content.homepage.footer.disclaimer}</p>
        </EditableElement>
        <EditableElement elementId="footer-copyright" elementType="text" sectionId="footer" path="homepage.footer.copyright">
          <p className="mt-3 text-xs text-slate-500">{content.homepage.footer.copyright}</p>
        </EditableElement>
      </div>
    </footer>
  );
}
