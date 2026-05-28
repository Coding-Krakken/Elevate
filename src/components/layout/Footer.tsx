"use client";

import Link from "next/link";
import {
  Leaf,
} from "lucide-react";
import { useStorefrontContent } from "@/hooks/useStorefrontContent";
import { toElementStyle } from "@/lib/style-overrides";
import type { ElementStyleOverrides } from "@/types";

export function Footer() {
  const { styleOverrides, homepage } = useStorefrontContent();

  return (
    <footer className="mt-4 border-t border-white/10 bg-[#05080b]">
      <div className="mx-auto w-full max-w-[1540px] px-4 py-6 md:px-8">
        <div className="grid gap-8 border-b border-white/10 pb-5 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <div className="flex items-center gap-2" style={toElementStyle(styleOverrides?.["footer-logo"])}>
              <Leaf className="h-8 w-8 text-lime-300" />
              <div>
                <p
                  className="text-xl font-black tracking-[0.22em] text-white"
                  style={toElementStyle(styleOverrides?.["footer-brand-line-1"])}
                >
                  {homepage.header.brandLine1}
                </p>
                <p
                  className="text-[10px] tracking-[0.2em] text-slate-400"
                  style={toElementStyle(styleOverrides?.["footer-brand-line-2"])}
                >
                  {homepage.header.brandLine2}
                </p>
              </div>
            </div>
            <p
              className="mt-4 max-w-[220px] text-xs leading-5 tracking-[0.1em] text-slate-300"
              style={toElementStyle(styleOverrides?.["footer-tagline"])}
            >
              {homepage.footer.tagline}
            </p>
          </div>

          <FooterColumn title={homepage.footer.columnTitle} items={homepage.footer.links} styleOverrides={styleOverrides} />
        </div>

        <p className="mt-4 text-xs text-slate-400" style={toElementStyle(styleOverrides?.["footer-disclaimer"])}>{homepage.footer.disclaimer}</p>

        <p className="mt-3 text-xs text-slate-500" style={toElementStyle(styleOverrides?.["footer-copyright"])}>{homepage.footer.copyright}</p>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  items,
  styleOverrides,
}: {
  title: string;
  items: { label: string; href: string }[];
  styleOverrides: Record<string, ElementStyleOverrides>;
}) {
  return (
    <div>
      <h4 className="mb-3 text-xs font-black tracking-[0.16em] text-white" style={toElementStyle(styleOverrides?.["footer-column-title"])}>{title}</h4>
      <ul className="space-y-1.5">
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`}>
            <Link
              href={item.href || "#"}
              className="text-xs text-slate-300 transition hover:text-lime-300"
              style={toElementStyle(styleOverrides?.[`footer-link-${index}`])}
            >
              {item.label}
            </Link>
            <p className="mt-0.5 text-[10px] tracking-[0.08em] text-slate-500" style={toElementStyle(styleOverrides?.[`footer-link-href-${index}`])}>
              {item.href}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
