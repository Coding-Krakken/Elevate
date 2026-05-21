"use client";

import Link from "next/link";
import {
  Leaf,
  ShoppingCart,
  User,
} from "lucide-react";
import { useSiteStore } from "@/hooks/useSiteStore";

export function Header() {
  const { cartCount, toggleCart } = useSiteStore();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#060a0e]/95 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-[1540px] items-center gap-3 px-4 md:h-[60px] md:px-8">
        <Link href="#" className="group flex min-w-[190px] items-center gap-2">
          <Leaf className="h-7 w-7 text-lime-300" />
          <div>
            <p className="text-lg font-black leading-none tracking-[0.22em] text-white">SYRACUSE</p>
            <p className="-mt-0.5 text-[9px] tracking-[0.2em] text-slate-400">EXOTICZ</p>
          </div>
        </Link>

        <div className="ml-auto flex items-center gap-2 md:gap-3">
          <Link
            href="/admin"
            className="rounded-full border border-white/15 p-2 text-slate-200 transition hover:border-lime-300/60 hover:text-lime-300"
            aria-label="Account"
          >
            <User className="h-4 w-4" />
          </Link>

          <button
            className="relative rounded-full border border-white/15 p-2 text-slate-200 transition hover:border-lime-300/60 hover:text-lime-300"
            aria-label="Open cart"
            onClick={toggleCart}
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-lime-300 px-1 text-[10px] font-black text-black">
              {cartCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
