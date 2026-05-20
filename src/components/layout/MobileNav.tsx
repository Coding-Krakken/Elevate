"use client";

import Link from "next/link";
import { useEffect } from "react";
import { X } from "lucide-react";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
  links: { label: string }[];
}

export function MobileNav({ open, onClose, links }: MobileNavProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", onEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onEscape);
    };
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[70] bg-black/70 transition"
      onClick={onClose}
    >
      <aside
        onClick={(event) => event.stopPropagation()}
        className="absolute left-0 top-0 h-full w-80 max-w-[84vw] border-r border-white/15 bg-[#090e12] p-5 transition"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <div className="mb-5 flex items-center justify-between">
          <p className="text-sm font-bold tracking-[0.16em] text-white">MENU</p>
          <button
            className="rounded-md border border-white/15 p-2 text-slate-300"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <nav className="space-y-2">
          {links.map((link) => (
            <Link
              key={link.label}
              href="#"
              onClick={onClose}
              className="block rounded-lg border border-white/10 bg-white/5 px-3 py-3 text-sm font-semibold tracking-[0.08em] text-slate-100"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>
    </div>
  );
}
